import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";

import {
  authRoutes,
  leadsRoutes,
  usersRoutes,
  orgsRoutes,
  projectsRoutes,
  milestonesRoutes,
  tasksRoutes,
  ticketsRoutes,
  filesRoutes,
  deploymentsRoutes,
  notificationsRoutes,
  billingRoutes,
  integrationsRoutes,
  webhooksRoutes,
  activityRoutes,
} from "../routes";

const app = new Hono<{ Bindings: Env }>();

function withCors(origin: string | null | undefined) {
  const allowOrigin = origin && origin !== "null" ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, x-admin-crm, x-organization-id",
    "Access-Control-Max-Age": "86400",
  } as const;
}

function isOptionsRequest(c: { req: { method: string } }) {
  return c.req.method === "OPTIONS";
}

app.use("*", async (c, next) => {
  const origin = c.req.header("origin");

  if (isOptionsRequest(c)) {
    return c.body(null, 204, {
      ...withCors(origin),
    });
  }

  await next();
});

app.use("*", async (c, next) => {
  const origin = c.req.header("origin");

  try {
    await next();
  } catch (err) {
    console.error("Unhandled error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }

  c.res.headers.set("Access-Control-Allow-Origin", withCors(origin)["Access-Control-Allow-Origin"]);
});

app.route("/", authRoutes);
app.route("/", leadsRoutes);
app.route("/", usersRoutes);
app.route("/", orgsRoutes);
app.route("/", projectsRoutes);
app.route("/", milestonesRoutes);
app.route("/", tasksRoutes);
app.route("/", ticketsRoutes);
app.route("/", filesRoutes);
app.route("/", deploymentsRoutes);
app.route("/", notificationsRoutes);
app.route("/", billingRoutes);
app.route("/", integrationsRoutes);
app.route("/", webhooksRoutes);
app.route("/", activityRoutes);

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.get("/api/admin/stats", async (c) => {
  const supabase = getSupabaseClient(c.env);

  const [{ count: orgCount }, { count: userCount }, { count: pendingLeads }] = await Promise.all([
    supabase.from("Organization").select("*", { count: "exact", head: true }),
    supabase.from("User").select("*", { count: "exact", head: true }),
    supabase.from("LeadRequest").select("*", { count: "exact", head: true }).eq("status", "SUBMITTED"),
  ]);

  return c.json({ organizations: orgCount || 0, users: userCount || 0, pendingLeads: pendingLeads || 0 });
});

export default app;