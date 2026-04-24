import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader } from "../middleware/auth";
import { requireActiveClientProfile } from "../middleware/require";

export const billingRoutes = new Hono<{ Bindings: Env }>();

function getOptionalPagination(c: { req: { query: (name: string) => string | undefined } }) {
  const limitRaw = c.req.query("limit");
  const offsetRaw = c.req.query("offset");
  const hasPagination = limitRaw !== undefined || offsetRaw !== undefined;
  const limit = Math.min(Math.max(parseInt(limitRaw || "50", 10), 1), 200);
  const offset = Math.max(parseInt(offsetRaw || "0", 10), 0);
  return { hasPagination, limit, offset };
}

billingRoutes.get("/api/billing", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);
  const { hasPagination, limit, offset } = getOptionalPagination(c);
  const paginationEnabledByFlag = (c.env.LIST_PAGINATION_V1 ?? "").toLowerCase() === "true";
  const usePagination = hasPagination || paginationEnabledByFlag;

  if (!usePagination) {
    c.header("X-API-Deprecated", "unpaginated-response; add limit/offset");
  }

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    let query = supabase
      .from("Subscription")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false })
      .order("id", { ascending: false });
    if (usePagination) query = query.range(offset, offset + limit - 1);
    const { data: subscriptions, error } = await query;

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return c.json({ error: "Failed to fetch subscriptions" }, 500);
    }
    return c.json({ data: subscriptions });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  let query = supabase
    .from("Subscription")
    .select("*, organization:Organization(*)")
    .order("createdAt", { ascending: false })
    .order("id", { ascending: false });
  if (usePagination) query = query.range(offset, offset + limit - 1);
  const { data: subscriptions, error } = await query;

  if (error) {
    console.error("Error fetching subscriptions:", error);
    return c.json({ error: "Failed to fetch subscriptions" }, 500);
  }
  return c.json({ data: subscriptions });
});

billingRoutes.get("/api/billing/subscriptions", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);
  const { hasPagination, limit, offset } = getOptionalPagination(c);
  const paginationEnabledByFlag = (c.env.LIST_PAGINATION_V1 ?? "").toLowerCase() === "true";
  const usePagination = hasPagination || paginationEnabledByFlag;

  if (!usePagination) {
    c.header("X-API-Deprecated", "unpaginated-response; add limit/offset");
  }

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    let query = supabase
      .from("Subscription")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false })
      .order("id", { ascending: false });
    if (usePagination) query = query.range(offset, offset + limit - 1);
    const { data: subscriptions, error } = await query;

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return c.json({ error: "Failed to fetch subscriptions" }, 500);
    }
    return c.json({ data: subscriptions });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  let query = supabase
    .from("Subscription")
    .select("*, organization:Organization(*)")
    .order("createdAt", { ascending: false })
    .order("id", { ascending: false });
  if (usePagination) query = query.range(offset, offset + limit - 1);
  const { data: subscriptions, error } = await query;

  if (error) {
    console.error("Error fetching subscriptions:", error);
    return c.json({ error: "Failed to fetch subscriptions" }, 500);
  }
  return c.json({ data: subscriptions });
});

billingRoutes.get("/api/billing/invoices", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);
  const { hasPagination, limit, offset } = getOptionalPagination(c);
  const paginationEnabledByFlag = (c.env.LIST_PAGINATION_V1 ?? "").toLowerCase() === "true";
  const usePagination = hasPagination || paginationEnabledByFlag;

  if (!usePagination) {
    c.header("X-API-Deprecated", "unpaginated-response; add limit/offset");
  }

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    let query = supabase
      .from("Invoice")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false })
      .order("id", { ascending: false });
    if (usePagination) query = query.range(offset, offset + limit - 1);
    const { data: invoices, error } = await query;

    if (error) {
      console.error("Error fetching invoices:", error);
      return c.json({ error: "Failed to fetch invoices" }, 500);
    }
    return c.json({ data: invoices });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  let query = supabase
    .from("Invoice")
    .select("*, organization:Organization(*)")
    .order("createdAt", { ascending: false })
    .order("id", { ascending: false });
  if (usePagination) query = query.range(offset, offset + limit - 1);
  const { data: invoices, error } = await query;

  if (error) {
    console.error("Error fetching invoices:", error);
    return c.json({ error: "Failed to fetch invoices" }, 500);
  }
  return c.json({ data: invoices });
});

billingRoutes.get("/api/billing/payments", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);
  const { hasPagination, limit, offset } = getOptionalPagination(c);
  const paginationEnabledByFlag = (c.env.LIST_PAGINATION_V1 ?? "").toLowerCase() === "true";
  const usePagination = hasPagination || paginationEnabledByFlag;

  if (!usePagination) {
    c.header("X-API-Deprecated", "unpaginated-response; add limit/offset");
  }

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    let query = supabase
      .from("Payment")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false })
      .order("id", { ascending: false });
    if (usePagination) query = query.range(offset, offset + limit - 1);
    const { data: payments, error } = await query;

    if (error) {
      console.error("Error fetching payments:", error);
      return c.json({ error: "Failed to fetch payments" }, 500);
    }
    return c.json({ data: payments });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  let query = supabase
    .from("Payment")
    .select("*, organization:Organization(*)")
    .order("createdAt", { ascending: false })
    .order("id", { ascending: false });
  if (usePagination) query = query.range(offset, offset + limit - 1);
  const { data: payments, error } = await query;

  if (error) {
    console.error("Error fetching payments:", error);
    return c.json({ error: "Failed to fetch payments" }, 500);
  }
  return c.json({ data: payments });
});
