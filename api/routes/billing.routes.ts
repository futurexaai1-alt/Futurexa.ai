import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader } from "../middleware/auth";
import { requireActiveClientProfile } from "../middleware/require";

export const billingRoutes = new Hono<{ Bindings: Env }>();

billingRoutes.get("/api/billing", async (c) => {
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

    const { data: subscriptions, error } = await supabase
      .from("Subscription")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return c.json({ error: "Failed to fetch subscriptions" }, 500);
    }
    return c.json({ data: subscriptions });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  const { data: subscriptions, error } = await supabase
    .from("Subscription")
    .select("*, organization:Organization(*)")
    .order("createdAt", { ascending: false });

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

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    const { data: subscriptions, error } = await supabase
      .from("Subscription")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return c.json({ error: "Failed to fetch subscriptions" }, 500);
    }
    return c.json({ data: subscriptions });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  const { data: subscriptions, error } = await supabase
    .from("Subscription")
    .select("*, organization:Organization(*)")
    .order("createdAt", { ascending: false });

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

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    const { data: invoices, error } = await supabase
      .from("Invoice")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching invoices:", error);
      return c.json({ error: "Failed to fetch invoices" }, 500);
    }
    return c.json({ data: invoices });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  const { data: invoices, error } = await supabase
    .from("Invoice")
    .select("*, organization:Organization(*)")
    .order("createdAt", { ascending: false });

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

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    const { data: payments, error } = await supabase
      .from("Payment")
      .select("*")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
      return c.json({ error: "Failed to fetch payments" }, 500);
    }
    return c.json({ data: payments });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  const { data: payments, error } = await supabase
    .from("Payment")
    .select("*, organization:Organization(*)")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return c.json({ error: "Failed to fetch payments" }, 500);
  }
  return c.json({ data: payments });
});