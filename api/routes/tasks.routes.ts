import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader } from "../middleware/auth";
import { requireActiveClientProfile } from "../middleware/require";
import { createActivityLog } from "../services/notification.service";

export const tasksRoutes = new Hono<{ Bindings: Env }>();

tasksRoutes.get("/api/tasks", async (c) => {
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

    const { data: tasks, error } = await supabase
      .from("Task")
      .select("*, milestone:Milestone(id, title, status)")
      .eq("organizationId", orgId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return c.json({ error: "Failed to fetch tasks" }, 500);
    }
    return c.json({ data: tasks });
  }

  if (!adminMode) {
    const { data: tasks, error } = await supabase
      .from("Task")
      .select("*, milestone:Milestone(id, title, status)")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return c.json({ error: "Failed to fetch tasks" }, 500);
    }
    return c.json({ data: tasks });
  }

  return c.json({ error: "Organization ID required" }, 400);
});

tasksRoutes.post("/api/tasks", async (c) => {
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

  const { projectId, title, description, status, priority, assigneeId, milestoneId, dueDate } = await c.req.json();

  const { data: task, error } = await supabase
    .from("Task")
    .insert({
      organizationId: orgId,
      projectId: projectId || null,
      title,
      description: description ?? null,
      status: status ?? "PENDING",
      createdById: null,
      assignedToId: assigneeId ?? null,
      milestoneId: milestoneId ?? null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    return c.json({ error: "Failed to create task" }, 500);
  }

  await createActivityLog(supabase, {
    organizationId: orgId,
    userId: "",
    action: `Task created: ${title}`,
    entityType: "Task",
    entityId: task.id,
    metadata: { title, projectId, milestoneId, status, priority },
  });

  return c.json({ data: task });
});

tasksRoutes.patch("/api/tasks/:id", async (c) => {
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

  const { title, description, status, priority, assigneeId, milestoneId, dueDate } = await c.req.json();
  const id = c.req.param("id");

  const { data: task, error } = await supabase
    .from("Task")
    .update({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(assigneeId !== undefined && { assignedToId: assigneeId }),
      ...(milestoneId !== undefined && { milestoneId }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate).toISOString() : null }),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    return c.json({ error: "Failed to update task" }, 500);
  }

  await createActivityLog(supabase, {
    organizationId: orgId,
    userId: "",
    action: `Task updated: ${task.title}`,
    entityType: "Task",
    entityId: task.id,
    metadata: { title: task.title, status, priority, updatedFields: { title, description, status, priority, assigneeId, milestoneId, dueDate } },
  });

  return c.json({ data: task });
});

tasksRoutes.delete("/api/tasks/:id", async (c) => {
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

  const id = c.req.param("id");

  await supabase.from("Task").delete().eq("id", id);

  return c.json({ success: true });
});