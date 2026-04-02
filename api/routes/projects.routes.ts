import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader } from "../middleware/auth";
import { requireActiveClientProfile } from "../middleware/require";
import { createActivityLog } from "../services/notification.service";

export const projectsRoutes = new Hono<{ Bindings: Env }>();

projectsRoutes.get("/api/projects", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);

  if (orgId) {
    const { data: projects, error } = await supabase
      .from("Project")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return c.json({ error: "Failed to fetch projects" }, 500);
    }
    return c.json({ data: projects });
  }

  if (isAdminCrmRequest(c)) {
    const { data: projects, error } = await supabase
      .from("Project")
      .select("*, organization:Organization(*)")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return c.json({ error: "Failed to fetch projects" }, 500);
    }
    return c.json({ data: projects });
  }

  return c.json({ error: "Organization ID required" }, 400);
});

projectsRoutes.post("/api/projects", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  let createdById: string | undefined;
  if (!isAdminCrmRequest(c)) {
    try {
      const profile = await requireActiveClientProfile(c as any, supabase, orgId);
      createdById = profile.id;
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { name, description, status } = await c.req.json();

  const { data: project, error } = await supabase
    .from("Project")
    .insert({
      organizationId: orgId,
      name,
      description: description ?? null,
      status: status ?? "ACTIVE",
      createdById: createdById ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }

  await createActivityLog(supabase, {
    organizationId: orgId,
    userId: createdById || "",
    action: "Project created",
    entityType: "Project",
    entityId: project.id,
    metadata: { name, description },
  });

  return c.json({ data: project });
});

projectsRoutes.patch("/api/projects/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const { name, description, status } = await c.req.json();
  const id = c.req.param("id");

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { data: updated, error } = await supabase
    .from("Project")
    .update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
    })
    .eq("id", id)
    .eq("organizationId", orgId)
    .select()
    .single();

  if (error || !updated) {
    return c.json({ error: "Project not found" }, 404);
  }

  if (name) {
    await createActivityLog(supabase, {
      organizationId: orgId,
      userId: "",
      action: "Project updated",
      entityType: "Project",
      entityId: id,
      metadata: { name },
    });
  }

  return c.json({ data: updated });
});

projectsRoutes.delete("/api/projects/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const id = c.req.param("id");

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { data: project } = await supabase
    .from("Project")
    .select("id, organizationId")
    .eq("id", id)
    .single();

  await supabase.from("Project").delete().eq("id", id);

  if (project) {
    await createActivityLog(supabase, {
      organizationId: orgId,
      userId: "",
      action: "Project deleted",
      entityType: "Project",
      entityId: id,
    });
  }

  return c.json({ success: true });
});