import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { getOrgIdFromHeader } from "../middleware/auth";
import { requireClientProfileForRead } from "../middleware/require";

export const notificationsRoutes = new Hono<{ Bindings: Env }>();

notificationsRoutes.get("/api/notifications", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);

  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  try {
    await requireClientProfileForRead(c as any, supabase, orgId);
  } catch (e: any) {
    return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
  }

  const { data: notifications, error } = await supabase
    .from("Notification")
    .select("*")
    .eq("organizationId", orgId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return c.json({ error: "Failed to fetch notifications" }, 500);
  }

  return c.json({ data: notifications });
});

notificationsRoutes.patch("/api/notifications/:id/read", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);

  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  try {
    await requireClientProfileForRead(c as any, supabase, orgId);
  } catch (e: any) {
    return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
  }

  const id = c.req.param("id");

  await supabase
    .from("Notification")
    .update({ readAt: new Date().toISOString() })
    .eq("id", id)
    .eq("organizationId", orgId);

  return c.json({ success: true });
});

notificationsRoutes.patch("/api/notifications/read-all", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);

  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  try {
    await requireClientProfileForRead(c as any, supabase, orgId);
  } catch (e: any) {
    return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
  }

  await supabase
    .from("Notification")
    .update({ readAt: new Date().toISOString() })
    .eq("organizationId", orgId)
    .is("readAt", null);

  return c.json({ success: true });
});