import { Hono } from "hono";
import { getPrismaClient } from "./db";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

function withCors(origin: string | null | undefined) {
  const allowOrigin = origin && origin !== "null" ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    // Include custom headers used by admin-crm/client-web.
    "Access-Control-Allow-Headers": "Authorization, Content-Type, x-admin-crm, x-organization-id",
    "Access-Control-Max-Age": "86400",
  } as const;
}

function isOptionsRequest(c: { req: { method: string } }) {
  return c.req.method === "OPTIONS";
}

type SupabaseUserProfile = {
  id: string;
  email: string;
  name: string | null;
  status: string;
};

function extractBearerToken(authHeader: string | undefined) {
  const value = authHeader ?? "";
  return value.startsWith("Bearer ") ? value.slice("Bearer ".length) : null;
}

async function fetchSupabaseUserProfile(env: Env, token: string): Promise<SupabaseUserProfile | null> {
  const meRes = await fetch(`${env.SUPABASE_URL}/rest/v1/User?select=id,email,name,status&limit=1`, {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });

  if (!meRes.ok) return null;

  const meData = (await meRes.json()) as SupabaseUserProfile[];
  return meData[0] ?? null;
}

async function updateSupabaseUserStatus(
  env: Env,
  userId: string,
  status: string
): Promise<void> {
  // Update Supabase `public."User"` so client-web gates immediately after admin approval.
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/User?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error(`Failed to update Supabase user status: ${text}`), { status: 500 });
  }
}

async function getOrganizationIdForUser(
  prisma: ReturnType<typeof getPrismaClient>,
  userId: string
) {
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
    select: { organizationId: true },
  });
  return membership?.organizationId ?? null;
}

function isAdminCrmRequest(c: { req: { header: (name: string) => string | undefined } }) {
  return c.req.header("x-admin-crm") === "true";
}

function getOrgIdFromHeader(c: { req: { header: (name: string) => string | undefined } }) {
  return c.req.header("x-organization-id") ?? null;
}

async function requireActiveClientProfile(
  c: { env: Env; req: { header: (name: string) => string | undefined } },
  prisma: ReturnType<typeof getPrismaClient>,
  orgId: string
): Promise<SupabaseUserProfile> {
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) {
    throw Object.assign(new Error("Missing Authorization Bearer token"), { status: 401 });
  }

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile) {
    throw Object.assign(new Error("Profile not found"), { status: 404 });
  }

  if (userProfile.status === "SUSPENDED") {
    throw Object.assign(new Error("Account suspended"), { status: 403 });
  }

  if (userProfile.status !== "ACTIVE_CLIENT") {
    throw Object.assign(
      new Error("Workspace restricted: activate your account to access this resource"),
      { status: 403 }
    );
  }

  const membershipOrgId = await getOrganizationIdForUser(prisma, userProfile.id);
  if (!membershipOrgId || membershipOrgId !== orgId) {
    throw Object.assign(new Error("Forbidden: organization mismatch"), { status: 403 });
  }

  return userProfile;
}

app.use("*", async (c, next) => {
  const origin = c.req.header("origin");

  if (isOptionsRequest(c)) {
    // Preflight response (no auth/token needed).
    return c.body(null, 204, {
      ...withCors(origin),
    });
  }

  await next();

  // Add CORS headers to all responses.
  const headers = withCors(origin);
  Object.entries(headers).forEach(([k, v]) => {
    c.res.headers.set(k, String(v));
  });
});

app.get("/api/health", (c) => {
  return c.json({ ok: true });
});

app.get("/api/me", async (c) => {
  const env = c.env;
  const prisma = getPrismaClient(env.DATABASE_URL);

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);

  if (!token) {
    return c.json({ error: "Missing Authorization Bearer token" }, 401);
  }

  // 1. Verify user via Supabase REST (simple)
  const userData = await fetchSupabaseUserProfile(env, token);
  if (!userData) {
    return c.json({ error: "Profile not found" }, 404);
  }

  // 2. Fetch organizationId via Prisma
  const membershipOrgId = await getOrganizationIdForUser(prisma, userData.id);

  return c.json({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    status: userData.status,
    organizationId: membershipOrgId,
  });
});

// --- Admin CRM Endpoints ---

app.get("/api/admin/stats", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  
  const [orgCount, userCount, pendingLeads] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.leadRequest.count({ where: { status: "SUBMITTED" } }),
  ]);

  return c.json({
    data: {
      organizations: orgCount,
      users: userCount,
      pendingLeads: pendingLeads,
    }
  });
});

app.get("/api/organizations", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const organizations = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: organizations });
});

app.get("/api/users", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: users });
});

app.get("/api/activity-logs", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token && isAdminCrmRequest(c) && !orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }
  const where = orgId ? { organizationId: orgId } : undefined;

  if (token) {
    if (!orgId) return c.json({ error: "Organization ID required" }, 400);
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const logs = await prisma.activityLog.findMany({
    include: {
      user: { select: { email: true, name: true } },
      organization: { select: { name: true } },
    },
    where: where ?? undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return c.json({ data: logs });
});

app.get("/api/billing", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token && isAdminCrmRequest(c) && !orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (token) {
    if (!orgId) return c.json({ error: "Organization ID required" }, 400);
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const where = orgId ? { organizationId: orgId } : undefined;

  const subscriptions = await prisma.subscription.findMany({
    where,
    include: {
      organization: { select: { name: true } },
      invoices: true,
      payments: true,
    },
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  return c.json({ data: subscriptions });
});

app.get("/api/project-requests", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const requests = await prisma.leadRequest.findMany({
    include: {
      requestedBy: true,
      organization: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: requests });
});

app.patch("/api/project-requests/:id/status", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();
  const prisma = getPrismaClient(c.env.DATABASE_URL);

  const request = await prisma.leadRequest.update({
    where: { id },
    data: { status: status as any },
    include: { requestedBy: true },
  });

  // If approved, update user status to ACTIVE_CLIENT
  if (request.requestedById) {
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: request.requestedById },
        data: { status: "ACTIVE_CLIENT" },
      });

      await updateSupabaseUserStatus(c.env, request.requestedById, "ACTIVE_CLIENT");

      // Convert the approved request into an initial project record.
      // Idempotency: only create one project per (organizationId, requestedById).
      const existingProject = await prisma.project.findFirst({
        where: {
          organizationId: request.organizationId,
          createdById: request.requestedById,
        },
        select: { id: true },
      });

      if (!existingProject) {
        const projectName =
          request.type === "DEMO" ? "Client Demo Workspace" : "Client Dashboard Project";

        await prisma.project.create({
          data: {
            organizationId: request.organizationId,
            name: projectName,
            description: request.description ?? undefined,
            status: "ACTIVE",
            createdById: request.requestedById,
          },
        });
      }
    } else if (status === "REJECTED") {
      await prisma.user.update({
        where: { id: request.requestedById },
        data: { status: "NEW_USER" },
      });

      await updateSupabaseUserStatus(c.env, request.requestedById, "NEW_USER");
    }
  }

  return c.json({ data: request });
});

app.get("/api/projects", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = c.req.header("x-organization-id");
  
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (isAdminCrmRequest(c)) {
    const projects = await prisma.project.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });
    return c.json({ data: projects });
  }

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) {
    return c.json({ error: "Missing Authorization Bearer token" }, 401);
  }

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  if (userProfile.status === "SUSPENDED") {
    return c.json({ error: "Account suspended" }, 403);
  }

  if (userProfile.status !== "ACTIVE_CLIENT") {
    return c.json({ error: "Workspace restricted: activate your account to access projects" }, 403);
  }

  const membershipOrgId = await getOrganizationIdForUser(prisma, userProfile.id);
  if (!membershipOrgId || membershipOrgId !== orgId) {
    return c.json({ error: "Forbidden: organization mismatch" }, 403);
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: projects });
});

app.get("/api/milestones", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = c.req.header("x-organization-id");

  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (isAdminCrmRequest(c)) {
    const milestones = await prisma.milestone.findMany({
      where: { project: { organizationId: orgId } },
      orderBy: { createdAt: "desc" },
    });
    return c.json({ data: milestones });
  }

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) {
    return c.json({ error: "Missing Authorization Bearer token" }, 401);
  }

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  if (userProfile.status === "SUSPENDED") {
    return c.json({ error: "Account suspended" }, 403);
  }

  if (userProfile.status !== "ACTIVE_CLIENT") {
    return c.json({ error: "Workspace restricted: activate your account to access milestones" }, 403);
  }

  const membershipOrgId = await getOrganizationIdForUser(prisma, userProfile.id);
  if (!membershipOrgId || membershipOrgId !== orgId) {
    return c.json({ error: "Forbidden: organization mismatch" }, 403);
  }

  const milestones = await prisma.milestone.findMany({
    where: { project: { organizationId: orgId } },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: milestones });
});

app.get("/api/tickets", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = c.req.header("x-organization-id");

  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (isAdminCrmRequest(c)) {
    const tickets = await prisma.ticket.findMany({
      where: { project: { organizationId: orgId } },
      orderBy: { createdAt: "desc" },
    });
    return c.json({ data: tickets });
  }

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) {
    return c.json({ error: "Missing Authorization Bearer token" }, 401);
  }

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  if (userProfile.status === "SUSPENDED") {
    return c.json({ error: "Account suspended" }, 403);
  }

  if (userProfile.status !== "ACTIVE_CLIENT") {
    return c.json({ error: "Workspace restricted: activate your account to access tickets" }, 403);
  }

  const membershipOrgId = await getOrganizationIdForUser(prisma, userProfile.id);
  if (!membershipOrgId || membershipOrgId !== orgId) {
    return c.json({ error: "Forbidden: organization mismatch" }, 403);
  }

  const tickets = await prisma.ticket.findMany({
    where: { project: { organizationId: orgId } },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: tickets });
});

// --- Organizations ---
app.post("/api/organizations", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const { name, status } = await c.req.json();
  const organization = await prisma.organization.create({
    data: {
      name,
      status: status ?? "ACTIVE",
    },
  });
  return c.json({ data: organization });
});

// --- Projects CRUD ---
app.post("/api/projects", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  let createdById: string | undefined;
  if (!isAdminCrmRequest(c)) {
    try {
      const profile = await requireActiveClientProfile(c as any, prisma, orgId);
      createdById = profile.id;
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { name, description, status } = await c.req.json();
  const project = await prisma.project.create({
    data: {
      organizationId: orgId,
      name,
      description: description ?? null,
      status: status ?? "ACTIVE",
      createdById: createdById ?? null,
    },
  });

  return c.json({ data: project });
});

app.patch("/api/projects/:id", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const { name, description, status } = await c.req.json();
  const id = c.req.param("id");

  let profile: SupabaseUserProfile | null = null;
  if (!isAdminCrmRequest(c)) {
    try {
      profile = await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const updated = await prisma.project.updateMany({
    where: { id, organizationId: orgId },
    data: {
      name: name ?? undefined,
      description: description ?? undefined,
      status: status ?? undefined,
    },
  });

  if (updated.count === 0) return c.json({ error: "Project not found" }, 404);
  const project = await prisma.project.findFirst({ where: { id, organizationId: orgId } });
  return c.json({ data: project });
});

app.delete("/api/projects/:id", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  const id = c.req.param("id");

  await prisma.project.updateMany({
    where: { id, organizationId: orgId },
    data: { deletedAt: new Date() },
  });

  return c.json({ success: true });
});

// --- Milestones CRUD ---
app.post("/api/milestones", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { projectId, title, description, dueDate, status } = await c.req.json();
  const project = await prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
  if (!project) return c.json({ error: "Project not found" }, 404);

  const milestone = await prisma.milestone.create({
    data: {
      organizationId: orgId,
      projectId,
      title,
      description: description ?? null,
      status: status ?? "PLANNED",
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return c.json({ data: milestone });
});

app.patch("/api/milestones/:id", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const id = c.req.param("id");
  const { title, description, dueDate, status } = await c.req.json();

  const updated = await prisma.milestone.updateMany({
    where: { id, organizationId: orgId },
    data: {
      title: title ?? undefined,
      description: description ?? undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: status ?? undefined,
    },
  });
  if (updated.count === 0) return c.json({ error: "Milestone not found" }, 404);
  const milestone = await prisma.milestone.findFirst({ where: { id, organizationId: orgId } });
  return c.json({ data: milestone });
});

app.delete("/api/milestones/:id", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const id = c.req.param("id");
  await prisma.milestone.deleteMany({ where: { id, organizationId: orgId } });
  return c.json({ success: true });
});

// --- Tasks CRUD ---
app.get("/api/tasks", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (isAdminCrmRequest(c)) {
    const tasks = await prisma.task.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });
    return c.json({ data: tasks });
  }

  try {
    await requireActiveClientProfile(c as any, prisma, orgId);
  } catch (e: any) {
    return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
  }

  const tasks = await prisma.task.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ data: tasks });
});

app.post("/api/tasks", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { projectId, title, description, dueDate } = await c.req.json();
  const project = await prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
  if (!project) return c.json({ error: "Project not found" }, 404);

  const task = await prisma.task.create({
    data: {
      organizationId: orgId,
      projectId,
      title,
      description: description ?? null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return c.json({ data: task });
});

app.patch("/api/tasks/:id", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const id = c.req.param("id");
  const { title, description, status, dueDate } = await c.req.json();
  const updated = await prisma.task.updateMany({
    where: { id, organizationId: orgId },
    data: {
      title: title ?? undefined,
      description: description ?? undefined,
      status: status ?? undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  });

  if (updated.count === 0) return c.json({ error: "Task not found" }, 404);
  const task = await prisma.task.findFirst({ where: { id, organizationId: orgId } });
  return c.json({ data: task });
});

app.delete("/api/tasks/:id", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const id = c.req.param("id");
  await prisma.task.deleteMany({ where: { id, organizationId: orgId } });
  return c.json({ success: true });
});

// --- Files (metadata CRUD) ---
app.get("/api/files", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const files = await prisma.fileAsset.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return c.json({ data: files });
});

app.post("/api/files", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { projectId, fileUrl, fileType } = await c.req.json();
  if (!fileUrl) return c.json({ error: "fileUrl required" }, 400);

  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
    if (!project) return c.json({ error: "Project not found" }, 404);
  }

  const file = await prisma.fileAsset.create({
    data: {
      organizationId: orgId,
      projectId: projectId ?? null,
      fileUrl,
      fileType: fileType ?? null,
    },
  });

  return c.json({ data: file });
});

// --- Files upload to R2 (multipart/form-data) ---
app.post("/api/files/upload", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  let uploadedById: string | null = null;
  if (!isAdminCrmRequest(c)) {
    try {
      const profile = await requireActiveClientProfile(c as any, prisma, orgId);
      uploadedById = profile.id;
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const rawReq = (c.req as any).raw ?? c.req;
  const formData: FormData = await rawReq.formData();

  const fileEntry = formData.get("file");
  if (!(fileEntry instanceof Blob)) {
    return c.json({ error: "file (multipart field) is required" }, 400);
  }

  // Enforce tenant quota (~50MB per upload).
  const maxBytes = 50 * 1024 * 1024;
  if (fileEntry.size > maxBytes) {
    return c.json({ error: "File too large. Max 50MB allowed." }, 413);
  }

  const projectIdRaw = formData.get("projectId");
  const projectId = typeof projectIdRaw === "string" && projectIdRaw.trim() ? projectIdRaw.trim() : null;

  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
    if (!project) return c.json({ error: "Project not found" }, 404);
  }

  const fileTypeRaw = formData.get("fileType");
  const fileType = typeof fileTypeRaw === "string" && fileTypeRaw.trim() ? fileTypeRaw.trim() : (fileEntry.type || null);

  const originalNameRaw = formData.get("fileName");
  const originalName =
    typeof originalNameRaw === "string" && originalNameRaw.trim()
      ? originalNameRaw.trim()
      : ((fileEntry as any).name as string | undefined) ?? "upload.bin";

  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const objectKey = `uploads/${orgId}/${crypto.randomUUID()}-${safeName}`;

  const r2 = (c.env as any).R2_FILES;
  if (!r2 || typeof r2.put !== "function") {
    return c.json({ error: "R2 bucket binding missing (R2_FILES)" }, 500);
  }

  await r2.put(objectKey, fileEntry, {
    httpMetadata: {
      contentType: fileType || undefined,
    },
  });

  const file = await prisma.fileAsset.create({
    data: {
      organizationId: orgId,
      projectId,
      uploadedById: uploadedById,
      fileUrl: objectKey,
      fileType: fileType,
    },
  });

  return c.json({ data: file });
});

app.patch("/api/files/:id", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  const id = c.req.param("id");

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { fileUrl, fileType } = await c.req.json();
  const updated = await prisma.fileAsset.updateMany({
    where: { id, organizationId: orgId },
    data: { fileUrl: fileUrl ?? undefined, fileType: fileType ?? undefined },
  });
  if (updated.count === 0) return c.json({ error: "File not found" }, 404);
  const file = await prisma.fileAsset.findFirst({ where: { id, organizationId: orgId } });
  return c.json({ data: file });
});

app.delete("/api/files/:id", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const id = c.req.param("id");
  await prisma.fileAsset.deleteMany({ where: { id, organizationId: orgId } });
  return c.json({ success: true });
});

// --- Deployments CRUD ---
app.get("/api/deployments", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const deployments = await prisma.deployment.findMany({
    where: { organizationId: orgId },
    orderBy: { deployedAt: "desc" },
    take: 50,
  });

  return c.json({ data: deployments });
});

app.post("/api/deployments", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const { projectId, name, status, environment, metadata } = await c.req.json();
  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
    if (!project) return c.json({ error: "Project not found" }, 404);
  }

  const deployment = await prisma.deployment.create({
    data: {
      organizationId: orgId,
      projectId: projectId ?? null,
      name,
      status: status ?? "IN_PROGRESS",
      environment: environment ?? null,
      metadata: metadata ?? null,
    },
  });
  return c.json({ data: deployment });
});

app.patch("/api/deployments/:id", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const id = c.req.param("id");
  const { name, status, environment, metadata } = await c.req.json();
  const updated = await prisma.deployment.updateMany({
    where: { id, organizationId: orgId },
    data: {
      name: name ?? undefined,
      status: status ?? undefined,
      environment: environment ?? undefined,
      metadata: metadata ?? undefined,
    },
  });
  if (updated.count === 0) return c.json({ error: "Deployment not found" }, 404);
  const deployment = await prisma.deployment.findFirst({ where: { id, organizationId: orgId } });
  return c.json({ data: deployment });
});

app.delete("/api/deployments/:id", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  const id = c.req.param("id");
  await prisma.deployment.deleteMany({ where: { id, organizationId: orgId } });
  return c.json({ success: true });
});

// --- Billing breakdown ---
app.get("/api/billing/subscriptions", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token && isAdminCrmRequest(c) && !orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }
  if (token) {
    if (!orgId) return c.json({ error: "Organization ID required" }, 400);
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }
  const where = orgId ? { organizationId: orgId } : undefined;
  const subscriptions = await prisma.subscription.findMany({
    where,
    orderBy: { startedAt: "desc" },
    take: 50,
    include: { organization: { select: { name: true } } },
  });
  return c.json({ data: subscriptions });
});

app.get("/api/billing/invoices", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token && isAdminCrmRequest(c) && !orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }
  if (token) {
    if (!orgId) return c.json({ error: "Organization ID required" }, 400);
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }
  const where = orgId ? { organizationId: orgId } : undefined;
  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { issuedAt: "desc" },
    take: 50,
    include: { subscription: true },
  });
  return c.json({ data: invoices });
});

app.get("/api/billing/payments", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token && isAdminCrmRequest(c) && !orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }
  if (token) {
    if (!orgId) return c.json({ error: "Organization ID required" }, 400);
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }
  const where = orgId ? { organizationId: orgId } : undefined;
  const payments = await prisma.payment.findMany({
    where,
    orderBy: { paidAt: "desc" },
    take: 50,
    include: { invoice: true, subscription: true },
  });
  return c.json({ data: payments });
});

// --- Integrations + Webhooks ---
app.get("/api/integrations", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const integrations = await prisma.integration.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return c.json({ data: integrations });
});

app.post("/api/integrations", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const { projectId, provider, name, status } = await c.req.json();
  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
    if (!project) return c.json({ error: "Project not found" }, 404);
  }

  const integration = await prisma.integration.create({
    data: {
      organizationId: orgId,
      projectId: projectId ?? null,
      provider,
      name: name ?? null,
      status: status ?? "ACTIVE",
    },
  });

  return c.json({ data: integration });
});

app.patch("/api/integrations/:id", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const id = c.req.param("id");
  const { provider, name, status, projectId } = await c.req.json();
  if (projectId) {
    const project = await prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
    if (!project) return c.json({ error: "Project not found" }, 404);
  }

  const updated = await prisma.integration.updateMany({
    where: { id, organizationId: orgId },
    data: {
      provider: provider ?? undefined,
      name: name ?? undefined,
      status: status ?? undefined,
      projectId: projectId ?? undefined,
    },
  });

  if (updated.count === 0) return c.json({ error: "Integration not found" }, 404);
  const integration = await prisma.integration.findFirst({ where: { id, organizationId: orgId } });
  return c.json({ data: integration });
});

app.delete("/api/integrations/:id", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  const id = c.req.param("id");
  await prisma.integration.deleteMany({ where: { id, organizationId: orgId } });
  return c.json({ success: true });
});

app.get("/api/webhooks", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const webhooks = await prisma.webhook.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { integration: true },
  });
  return c.json({ data: webhooks });
});

app.post("/api/webhooks", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const { integrationId, url, secret, events } = await c.req.json();
  const webhook = await prisma.webhook.create({
    data: {
      organizationId: orgId,
      integrationId: integrationId ?? null,
      url,
      secret: secret ?? null,
      events: events ?? null,
    },
  });
  return c.json({ data: webhook });
});

app.patch("/api/webhooks/:id", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const id = c.req.param("id");
  const { url, secret, events, integrationId } = await c.req.json();

  const updated = await prisma.webhook.updateMany({
    where: { id, organizationId: orgId },
    data: {
      url: url ?? undefined,
      secret: secret ?? undefined,
      events: events ?? undefined,
      integrationId: integrationId ?? undefined,
    },
  });

  if (updated.count === 0) return c.json({ error: "Webhook not found" }, 404);
  const webhook = await prisma.webhook.findFirst({ where: { id, organizationId: orgId } });
  return c.json({ data: webhook });
});

app.delete("/api/webhooks/:id", async (c) => {
  if (!isAdminCrmRequest(c)) return c.json({ error: "Forbidden" }, 403);
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  const id = c.req.param("id");
  await prisma.webhook.deleteMany({ where: { id, organizationId: orgId } });
  return c.json({ success: true });
});

// --- Ticket CRUD (create + status update) ---
app.post("/api/tickets", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { projectId, title, description, type, status } = await c.req.json();
  // `type` is currently not modeled on Ticket; we ignore it for now.

  const project = projectId
    ? await prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } })
    : null;
  if (projectId && !project) return c.json({ error: "Project not found" }, 404);

  const ticket = await prisma.ticket.create({
    data: {
      organizationId: orgId,
      projectId: projectId ?? null,
      title,
      description: description ?? null,
      status: (status ?? "OPEN") as any,
    },
  });

  return c.json({ data: ticket });
});

app.patch("/api/tickets/:id/status", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const id = c.req.param("id");
  const { status, description } = await c.req.json();
  const updated = await prisma.ticket.updateMany({
    where: { id, organizationId: orgId },
    data: { status: status as any, description: description ?? undefined },
  });
  if (updated.count === 0) return c.json({ error: "Ticket not found" }, 404);
  const ticket = await prisma.ticket.findFirst({ where: { id, organizationId: orgId } });
  return c.json({ data: ticket });
});

app.delete("/api/tickets/:id", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, prisma, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const id = c.req.param("id");
  await prisma.ticket.deleteMany({ where: { id, organizationId: orgId } });
  return c.json({ success: true });
});

// --- Client profile settings (name only) ---
app.patch("/api/settings", async (c) => {
  const prisma = getPrismaClient(c.env.DATABASE_URL);
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) return c.json({ error: "Missing Authorization Bearer token" }, 401);

  let userProfile: SupabaseUserProfile | null = null;
  try {
    userProfile = await fetchSupabaseUserProfile(c.env, token);
  } catch {
    // ignore
  }
  if (!userProfile) return c.json({ error: "Profile not found" }, 404);
  if (userProfile.status === "SUSPENDED") return c.json({ error: "Account suspended" }, 403);

  const { name } = await c.req.json();
  const updated = await prisma.user.update({
    where: { id: userProfile.id },
    data: { name: name ?? null },
  });
  return c.json({ data: updated });
});

app.post("/api/lead-requests", async (c) => {
  const env = c.env;
  const prisma = getPrismaClient(env.DATABASE_URL);

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);

  if (!token) {
    return c.json({ error: "Missing Authorization Bearer token" }, 401);
  }

  const { type, description } = await c.req.json();

  // 1. Verify user via Supabase REST (as we are avoiding complex JWT for now)
  const userProfile = await fetchSupabaseUserProfile(env, token);
  const userId = userProfile?.id ?? null;

  if (!userId) return c.json({ error: "User not found" }, 404);
  if (userProfile?.status === "SUSPENDED") {
    return c.json({ error: "Account suspended" }, 403);
  }
  if (userProfile?.status === "ACTIVE_CLIENT") {
    return c.json({ error: "Account already active" }, 400);
  }

  // 2. Find their organization
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
  });

  if (!membership) {
    return c.json({ error: "User is not a member of any organization" }, 400);
  }

  // 3. Create Lead Request
  const request = await prisma.leadRequest.create({
    data: {
      organizationId: membership.organizationId,
      requestedById: userId,
      type: type || "PROJECT",
      status: "SUBMITTED",
      description: description || "Requesting access to client dashboard",
    },
  });

  // 4. Update User Status to LEAD
  await prisma.user.update({
    where: { id: userId },
    data: { status: "LEAD" },
  });

  await updateSupabaseUserStatus(env, userId, "LEAD");

  return c.json({ success: true, data: request });
});

// Wrangler expects a `fetch` handler export.
export default {
  fetch: app.fetch,
};

