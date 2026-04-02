import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { getOrgIdFromHeader } from "../middleware/auth";

export const integrationsRoutes = new Hono<{ Bindings: Env }>();

integrationsRoutes.get("/api/integrations", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);

  let query = supabase.from("Integration").select("*").order("createdAt", { ascending: false });

  if (orgId) {
    query = query.eq("organizationId", orgId);
  }

  const { data: integrations, error } = await query;

  if (error) {
    console.error("Error fetching integrations:", error);
    return c.json({ error: "Failed to fetch integrations" }, 500);
  }

  return c.json({ data: integrations });
});

integrationsRoutes.post("/api/integrations", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const { name, provider, status } = await c.req.json();

  const { data: integration, error } = await supabase
    .from("Integration")
    .insert({
      organizationId: orgId || "",
      name,
      provider,
      status: status ?? "DISCONNECTED",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating integration:", error);
    return c.json({ error: "Failed to create integration" }, 500);
  }

  return c.json({ data: integration });
});

integrationsRoutes.patch("/api/integrations/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const { status } = await c.req.json();
  const id = c.req.param("id");

  const { data: integration, error } = await supabase
    .from("Integration")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating integration:", error);
    return c.json({ error: "Failed to update integration" }, 500);
  }

  return c.json({ data: integration });
});

integrationsRoutes.delete("/api/integrations/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");

  await supabase.from("Integration").delete().eq("id", id);

  return c.json({ success: true });
});