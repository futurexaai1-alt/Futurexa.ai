import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader } from "../middleware/auth";
import { requireActiveClientProfile } from "../middleware/require";
import { createActivityLog } from "../services/notification.service";

export const deploymentsRoutes = new Hono<{ Bindings: Env }>();

deploymentsRoutes.get("/api/deployments", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    const { data: deployments, error } = await supabase
      .from("Deployment")
      .select("*")
      .eq("organizationId", orgId)
      .order("deployedAt", { ascending: false });

    if (error) {
      console.error("Error fetching deployments:", error);
      return c.json({ error: "Failed to fetch deployments" }, 500);
    }
    return c.json({ data: deployments });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  const { data: deployments, error } = await supabase
    .from("Deployment")
    .select("*")
    .order("deployedAt", { ascending: false });

  if (error) {
    console.error("Error fetching deployments:", error);
    return c.json({ error: "Failed to fetch deployments" }, 500);
  }
  return c.json({ data: deployments });
});

deploymentsRoutes.post("/api/deployments", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  if (!isAdminCrmRequest(c)) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { projectId, name, status, environment, changelog, deployedAt } = await c.req.json();

  const { data: deployment, error } = await supabase
    .from("Deployment")
    .insert({
      organizationId: orgId,
      projectId: projectId || null,
      name,
      status: status ?? "SUCCESS",
      environment: environment ?? "STAGING",
      metadata: changelog ? { changelog } : null,
      deployedAt: deployedAt ? new Date(deployedAt).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating deployment:", error);
    return c.json({ error: "Failed to create deployment" }, 500);
  }

  await createActivityLog(supabase, {
    organizationId: orgId,
    userId: "",
    action: `Deployment created: ${name}`,
    entityType: "Deployment",
    entityId: deployment.id,
    metadata: { name, projectId, status, environment },
  });

  return c.json({ data: deployment });
});

deploymentsRoutes.patch("/api/deployments/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const { status, changelog } = await c.req.json();
  const id = c.req.param("id");

  const { data: deployment, error } = await supabase
    .from("Deployment")
    .update({
      ...(status && { status }),
      ...(changelog !== undefined && { metadata: { changelog } }),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating deployment:", error);
    return c.json({ error: "Failed to update deployment" }, 500);
  }

  const orgId = getOrgIdFromHeader(c);

  await createActivityLog(supabase, {
    organizationId: orgId || "",
    userId: "",
    action: `Deployment updated: ${deployment.name}`,
    entityType: "Deployment",
    entityId: deployment.id,
    metadata: { name: deployment.name, status },
  });

  return c.json({ data: deployment });
});

deploymentsRoutes.delete("/api/deployments/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");

  await supabase.from("Deployment").delete().eq("id", id);

  return c.json({ success: true });
});