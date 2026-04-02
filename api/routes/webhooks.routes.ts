import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";

export const webhooksRoutes = new Hono<{ Bindings: Env }>();

webhooksRoutes.get("/api/webhooks", async (c) => {
  const supabase = getSupabaseClient(c.env);

  const { data: webhooks, error } = await supabase
    .from("Webhook")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching webhooks:", error);
    return c.json({ error: "Failed to fetch webhooks" }, 500);
  }

  return c.json({ data: webhooks });
});

webhooksRoutes.post("/api/webhooks", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const { url, secret, events } = await c.req.json();

  const { data: webhook, error } = await supabase
    .from("Webhook")
    .insert({
      url,
      secret: secret ?? null,
      events: events ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating webhook:", error);
    return c.json({ error: "Failed to create webhook" }, 500);
  }

  return c.json({ data: webhook });
});

webhooksRoutes.patch("/api/webhooks/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const { url, secret, events } = await c.req.json();
  const id = c.req.param("id");

  const { data: webhook, error } = await supabase
    .from("Webhook")
    .update({
      ...(url !== undefined && { url }),
      ...(secret !== undefined && { secret }),
      ...(events !== undefined && { events }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating webhook:", error);
    return c.json({ error: "Failed to update webhook" }, 500);
  }

  return c.json({ data: webhook });
});

webhooksRoutes.delete("/api/webhooks/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");

  await supabase.from("Webhook").delete().eq("id", id);

  return c.json({ success: true });
});