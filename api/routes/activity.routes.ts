import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader } from "../middleware/auth";
import { requireActiveClientProfile } from "../middleware/require";

export const activityRoutes = new Hono<{ Bindings: Env }>();

activityRoutes.get("/api/activity-logs", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  const entityType = c.req.query("entityType");
  const action = c.req.query("action");
  const userId = c.req.query("userId");
  const from = c.req.query("from");
  const to = c.req.query("to");
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  console.log("Activity logs request:", { orgId, adminMode, entityType, action, userId, from, to, limit, offset });

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    let query = supabase
      .from("ActivityLog")
      .select("*", { count: "exact" })
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false })
      .range(offset, offset + limit - 1);

    if (entityType) query = query.eq("entityType", entityType);
    if (action) query = query.ilike("action", `%${action}%`);
    if (userId) query = query.eq("userId", userId);
    if (from) query = query.gte("createdAt", from);
    if (to) query = query.lte("createdAt", to);

    const { data: logs, error, count } = await query;

    if (error) {
      console.error("Error fetching activity logs:", JSON.stringify(error, null, 2));
      return c.json({ error: "Failed to fetch activity logs" }, 500);
    }

    console.log("Activity logs fetched for org:", orgId, "count:", logs?.length);

    if (logs && logs.length > 0) {
      const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))];
      let userMap: Record<string, any> = {};

      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from("User")
          .select("id, name, email")
          .in("id", userIds);
        userMap = (users || []).reduce((acc: Record<string, any>, u: any) => {
          acc[u.id] = u;
          return acc;
        }, {});
      }

      const logsWithUser = logs.map(log => ({
        ...log,
        user: log.userId ? userMap[log.userId] || null : null
      }));

      return c.json({ data: logsWithUser, pagination: { total: count || 0, limit, offset, hasMore: (count || 0) > offset + limit } });
    }

    return c.json({ data: logs || [], pagination: { total: count || 0, limit, offset, hasMore: (count || 0) > offset + limit } });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  console.log("Admin mode: fetching all activity logs");

  let query = supabase
    .from("ActivityLog")
    .select("*", { count: "exact" })
    .order("createdAt", { ascending: false })
    .range(offset, offset + limit - 1);

  if (entityType) query = query.eq("entityType", entityType);
  if (action) query = query.ilike("action", `%${action}%`);
  if (userId) query = query.eq("userId", userId);
  if (from) query = query.gte("createdAt", from);
  if (to) query = query.lte("createdAt", to);

  const { data: logs, error, count } = await query;

  if (error) {
    console.error("Error fetching activity logs (admin):", JSON.stringify(error, null, 2));
    return c.json({ error: "Failed to fetch activity logs" }, 500);
  }

  console.log("Activity logs fetched (admin):", logs?.length, "total:", count);

  if (logs && logs.length > 0) {
    const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))];
    const orgIds = [...new Set(logs.map(l => l.organizationId).filter(Boolean))];
    let userMap: Record<string, any> = {};
    let orgMap: Record<string, any> = {};

    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from("User")
        .select("id, name, email")
        .in("id", userIds);
      userMap = (users || []).reduce((acc: Record<string, any>, u: any) => {
        acc[u.id] = u;
        return acc;
      }, {});
    }

    if (orgIds.length > 0) {
      const { data: orgs } = await supabase
        .from("Organization")
        .select("id, name")
        .in("id", orgIds);
      orgMap = (orgs || []).reduce((acc: Record<string, any>, o: any) => {
        acc[o.id] = o;
        return acc;
      }, {});
    }

    const logsWithRelations = logs.map(log => ({
      ...log,
      user: log.userId ? userMap[log.userId] || null : null,
      organization: log.organizationId ? orgMap[log.organizationId] || null : null
    }));

    return c.json({ data: logsWithRelations, pagination: { total: count || 0, limit, offset, hasMore: (count || 0) > offset + limit } });
  }

  return c.json({ data: logs || [], pagination: { total: count || 0, limit, offset, hasMore: (count || 0) > offset + limit } });
});
