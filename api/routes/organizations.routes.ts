import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { extractBearerToken, fetchSupabaseUserProfile } from "../middleware/auth";
import { createActivityLog } from "../services/notification.service";

export const orgsRoutes = new Hono<{ Bindings: Env }>();

orgsRoutes.get("/api/organizations", async (c) => {
  const supabase = getSupabaseClient(c.env);

  const { data: orgs, error } = await supabase
    .from("Organization")
    .select(`
      *,
      members:OrganizationMember(
        id, userId, joinedAt,
        user:User(id, name, email, status)
      )
    `)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching organizations:", error);
    return c.json({ error: "Failed to fetch organizations" }, 500);
  }

  return c.json({ data: orgs });
});

orgsRoutes.get("/api/organizations/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");

  const { data: org, error } = await supabase
    .from("Organization")
    .select(`
      *,
      members:OrganizationMember(
        id, userId, joinedAt,
        user:User(id, name, email, status)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !org) {
    return c.json({ error: "Organization not found" }, 404);
  }

  return c.json({ data: org });
});

orgsRoutes.post("/api/organizations", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const { name, status } = await c.req.json();

  let shortCode: string;
  let exists = true;
  while (exists) {
    shortCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const { data } = await supabase
      .from("Organization")
      .select("id")
      .eq("shortCode", shortCode)
      .limit(1);
    exists = data && data.length > 0;
  }

  const { data: organization, error } = await supabase
    .from("Organization")
    .insert({
      name,
      status: status ?? "ACTIVE",
      shortCode: shortCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating organization:", error);
    return c.json({ error: "Failed to create organization" }, 500);
  }

  return c.json({ data: organization });
});

orgsRoutes.patch("/api/organizations/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");
  const { name, status } = await c.req.json();

  const { data: org, error } = await supabase
    .from("Organization")
    .update({
      ...(name && { name }),
      ...(status && { status }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating organization:", error);
    return c.json({ error: "Failed to update organization" }, 500);
  }

  return c.json({ data: org });
});

orgsRoutes.delete("/api/organizations/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");

  const { data: org } = await supabase
    .from("Organization")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!org) {
    return c.json({ error: "Organization not found" }, 404);
  }

  await Promise.all([
    supabase.from("FileAsset").delete().eq("organizationId", id),
    supabase.from("FileAuditLog").delete().eq("organizationId", id),
    supabase.from("ActivityLog").delete().eq("organizationId", id),
    supabase.from("Notification").delete().eq("organizationId", id),
    supabase.from("Comment").delete().eq("organizationId", id),
    supabase.from("Milestone").delete().eq("organizationId", id),
    supabase.from("Task").delete().eq("organizationId", id),
    supabase.from("Ticket").delete().eq("organizationId", id),
    supabase.from("Deployment").delete().eq("organizationId", id),
    supabase.from("Integration").delete().eq("organizationId", id),
    supabase.from("Project").delete().eq("organizationId", id),
    supabase.from("Subscription").delete().eq("organizationId", id),
    supabase.from("LeadRequest").delete().eq("organizationId", id),
    supabase.from("OrganizationRequest").delete().eq("organizationId", id),
    supabase.from("OrganizationMember").delete().eq("organizationId", id),
    supabase.from("Organization").delete().eq("id", id),
  ]);

  return c.json({ success: true });
});

orgsRoutes.post("/api/organizations/members", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const { organizationId, userId } = await c.req.json();

  if (!organizationId || !userId) {
    return c.json({ error: "organizationId and userId are required" }, 400);
  }

  const { data: existing } = await supabase
    .from("OrganizationMember")
    .select("id")
    .eq("organizationId", organizationId)
    .eq("userId", userId)
    .limit(1);

  if (existing && existing.length > 0) {
    return c.json({ error: "User is already a member of this organization" }, 400);
  }

  const { data: member, error } = await supabase
    .from("OrganizationMember")
    .insert({ organizationId: organizationId, userId: userId })
    .select(`
      id, organizationId, userId, joinedAt,
      user:User(id, name, email, status)
    `)
    .single();

  if (error) {
    console.error("Error adding member:", error);
    return c.json({ error: "Failed to add member" }, 500);
  }

  await createActivityLog(supabase, {
    organizationId,
    userId: userId,
    action: `Member added to organization`,
    entityType: "Organization",
    entityId: organizationId,
    metadata: { userId, userEmail: member?.user?.email, userName: member?.user?.name },
  });

  return c.json({ data: member });
});

orgsRoutes.delete("/api/organizations/:id/members/:userId", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const organizationId = c.req.param("id");
  const userId = c.req.param("userId");

  const { data: member } = await supabase
    .from("OrganizationMember")
    .select("user:User(id, name, email)")
    .eq("organizationId", organizationId)
    .eq("userId", userId)
    .single();

  await supabase
    .from("OrganizationMember")
    .delete()
    .eq("organizationId", organizationId)
    .eq("userId", userId);

  await createActivityLog(supabase, {
    organizationId,
    userId: userId,
    action: `Member removed from organization`,
    entityType: "Organization",
    entityId: organizationId,
    metadata: { userId, userEmail: member?.user?.email, userName: member?.user?.name },
  });

  return c.json({ success: true });
});

orgsRoutes.post("/api/organizations/request", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const { name } = await c.req.json();

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) return c.json({ error: "Missing Authorization Bearer token" }, 401);

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile?.id) return c.json({ error: "User not found" }, 404);

  const { data: existingUser } = await supabase
    .from("User")
    .select("id")
    .eq("id", userProfile.id)
    .single();

  if (!existingUser) {
    await supabase.from("User").insert({
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      status: userProfile.status,
    });
  }

  let shortCode: string;
  let exists = true;
  while (exists) {
    shortCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const { data } = await supabase
      .from("Organization")
      .select("id")
      .eq("shortCode", shortCode)
      .limit(1);
    exists = data && data.length > 0;
  }

  const { data: organization, error: orgError } = await supabase
    .from("Organization")
    .insert({
      name,
      status: "PENDING_APPROVAL",
      shortCode: shortCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (orgError || !organization) {
    console.error("Error creating organization:", orgError);
    return c.json({ error: "Failed to create organization" }, 500);
  }

  const { data: orgRequest, error: requestError } = await supabase
    .from("OrganizationRequest")
    .insert({
      organizationId: organization.id,
      requestedById: userProfile.id,
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select(`
      *,
      organization:Organization(*),
      requestedBy:User(id, name, email)
    `)
    .single();

  if (requestError) {
    console.error("Error creating org request:", requestError);
    return c.json({ error: "Failed to create organization request" }, 500);
  }

  return c.json({ data: orgRequest }, 201);
});

orgsRoutes.get("/api/organizations/requests", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const status = c.req.query("status") || undefined;

  let query = supabase
    .from("OrganizationRequest")
    .select(`
      *,
      organization:Organization(*),
      requestedBy:User(id, name, email)
    `)
    .order("createdAt", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: requests, error } = await query;

  if (error) {
    console.error("Error fetching requests:", error);
    return c.json({ error: "Failed to fetch requests" }, 500);
  }

  return c.json({ data: requests });
});

orgsRoutes.patch("/api/organizations/request/:id/approve", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const requestId = c.req.param("id");

  const { data: orgRequest } = await supabase
    .from("OrganizationRequest")
    .select("*, organization:Organization(*)")
    .eq("id", requestId)
    .single();

  if (!orgRequest) {
    return c.json({ error: "Organization request not found" }, 404);
  }

  if (orgRequest.status !== "SUBMITTED") {
    return c.json({ error: "Request has already been processed" }, 400);
  }

  await Promise.all([
    supabase
      .from("Organization")
      .update({ status: "ACTIVE" })
      .eq("id", orgRequest.organizationId),
    supabase
      .from("OrganizationRequest")
      .update({ status: "APPROVED" })
      .eq("id", requestId),
    supabase
      .from("OrganizationMember")
      .insert({
        organizationId: orgRequest.organizationId,
        userId: orgRequest.requestedById,
      }),
  ]);

  const { data: updatedRequest } = await supabase
    .from("OrganizationRequest")
    .select(`
      *,
      organization:Organization(*),
      requestedBy:User(id, name, email)
    `)
    .eq("id", requestId)
    .single();

  return c.json({ data: updatedRequest });
});

orgsRoutes.patch("/api/organizations/request/:id/reject", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const requestId = c.req.param("id");
  const { reason } = await c.req.json().catch(() => ({}));

  const { data: orgRequest } = await supabase
    .from("OrganizationRequest")
    .select("*, organization:Organization(*)")
    .eq("id", requestId)
    .single();

  if (!orgRequest) {
    return c.json({ error: "Organization request not found" }, 404);
  }

  if (orgRequest.status !== "SUBMITTED") {
    return c.json({ error: "Request has already been processed" }, 400);
  }

  await Promise.all([
    supabase
      .from("Organization")
      .update({ status: "DELETED" })
      .eq("id", orgRequest.organizationId),
    supabase
      .from("OrganizationRequest")
      .update({
        status: "REJECTED",
        rejectionReason: reason ?? null,
      })
      .eq("id", requestId),
  ]);

  return c.json({ success: true, message: "Organization request rejected" });
});

orgsRoutes.post("/api/organizations/:id/join", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const organizationId = c.req.param("id");

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) return c.json({ error: "Missing Authorization Bearer token" }, 401);

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile?.id) return c.json({ error: "User not found" }, 404);

  const { data: existingUser } = await supabase
    .from("User")
    .select("id")
    .eq("id", userProfile.id)
    .single();

  if (!existingUser) {
    await supabase.from("User").insert({
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      status: userProfile.status,
    });
  }

  const { data: organization } = await supabase
    .from("Organization")
    .select("id, status")
    .eq("id", organizationId)
    .single();

  if (!organization) {
    return c.json({ error: "Organization not found" }, 404);
  }

  if (organization.status !== "ACTIVE") {
    return c.json({ error: "Cannot join inactive organization" }, 400);
  }

  const { data: existingMembership } = await supabase
    .from("OrganizationMember")
    .select("id")
    .eq("organizationId", organizationId)
    .eq("userId", userProfile.id)
    .limit(1);

  if (existingMembership && existingMembership.length > 0) {
    return c.json({ error: "Already a member of this organization" }, 400);
  }

  const { data: member, error } = await supabase
    .from("OrganizationMember")
    .insert({
      organizationId: organizationId,
      userId: userProfile.id,
    })
    .select(`
      id, organizationId, userId, joinedAt,
      user:User(id, name, email, status),
      organization:Organization(*)
    `)
    .single();

  if (error) {
    console.error("Error joining organization:", error);
    return c.json({ error: "Failed to join organization" }, 500);
  }

  return c.json({ data: member });
});