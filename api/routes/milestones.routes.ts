import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader } from "../middleware/auth";
import { requireActiveClientProfile } from "../middleware/require";
import { createNotification, createActivityLog } from "../services/notification.service";

export const milestonesRoutes = new Hono<{ Bindings: Env }>();

function getOptionalPagination(c: { req: { query: (name: string) => string | undefined } }) {
  const limitRaw = c.req.query("limit");
  const offsetRaw = c.req.query("offset");
  const hasPagination = limitRaw !== undefined || offsetRaw !== undefined;
  const limit = Math.min(Math.max(parseInt(limitRaw || "50", 10), 1), 200);
  const offset = Math.max(parseInt(offsetRaw || "0", 10), 0);
  return { hasPagination, limit, offset };
}

milestonesRoutes.get("/api/milestones", async (c) => {
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
      .from("Milestone")
      .select("*, project:Project(*), tasks:Task(id)")
      .eq("organizationId", orgId)
      .order("dueDate", { ascending: true })
      .order("id", { ascending: true });
    if (usePagination) query = query.range(offset, offset + limit - 1);
    const { data: milestones, error } = await query;

    if (error) {
      console.error("Error fetching milestones:", error);
      return c.json({ error: "Failed to fetch milestones" }, 500);
    }
    return c.json({ data: milestones });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  let query = supabase
    .from("Milestone")
    .select("*, project:Project(*, organization:Organization(*)), tasks:Task(id)")
    .order("dueDate", { ascending: true })
    .order("id", { ascending: true });
  if (usePagination) query = query.range(offset, offset + limit - 1);
  const { data: milestones, error } = await query;

  if (error) {
    console.error("Error fetching milestones:", error);
    return c.json({ error: "Failed to fetch milestones" }, 500);
  }
  return c.json({ data: milestones });
});

milestonesRoutes.post("/api/milestones", async (c) => {
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

  const { projectId, title, description, dueDate, startDate, status, progressPercent, stageBreakdown, expectedDeliverables } = await c.req.json();

  const { data: project } = await supabase
    .from("Project")
    .select("id")
    .eq("id", projectId)
    .single();

  if (!project) return c.json({ error: "Project not found" }, 404);

  const { data: milestone, error } = await supabase
    .from("Milestone")
    .insert({
      organizationId: orgId,
      projectId: projectId,
      title,
      description: description ?? null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      status: status ?? "PENDING",
      progressPercent: progressPercent ?? 0,
      stageBreakdown: stageBreakdown ?? null,
      expectedDeliverables: expectedDeliverables ?? null,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating milestone:", error);
    return c.json({ error: "Failed to create milestone" }, 500);
  }

  await createActivityLog(supabase, {
    organizationId: orgId,
    userId: "",
    action: `Milestone created: ${title}`,
    entityType: "Milestone",
    entityId: milestone.id,
    metadata: { title, projectId, description, dueDate, status },
  });

  return c.json({ data: milestone });
});

milestonesRoutes.patch("/api/milestones/:id", async (c) => {
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

  const { title, description, dueDate, startDate, status, progressPercent, stageBreakdown, expectedDeliverables } = await c.req.json();
  const id = c.req.param("id");

  const { data: milestone, error } = await supabase
    .from("Milestone")
    .update({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate).toISOString() : null }),
      ...(startDate !== undefined && { startDate: startDate ? new Date(startDate).toISOString() : null }),
      ...(status && { status }),
      ...(progressPercent !== undefined && { progressPercent }),
      ...(stageBreakdown !== undefined && { stageBreakdown }),
      ...(expectedDeliverables !== undefined && { expectedDeliverables }),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating milestone:", error);
    return c.json({ error: "Failed to update milestone" }, 500);
  }

  if (status === "COMPLETED") {
    await createNotification(supabase, {
      organizationId: orgId,
      userId: "",
      title: "Milestone Reached",
      body: `Congratulations! "${milestone.title}" has been completed.`,
      channel: "IN_APP",
    });
  }

  await createActivityLog(supabase, {
    organizationId: orgId,
    userId: "",
    action: `Milestone updated: ${milestone.title}`,
    entityType: "Milestone",
    entityId: milestone.id,
    metadata: { title: milestone.title, status, progressPercent, updatedFields: { title, description, dueDate, status, progressPercent } },
  });

  return c.json({ data: milestone });
});

milestonesRoutes.get("/api/milestones/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);
  const id = c.req.param("id");

  if (orgId && !adminMode) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { data: milestone, error } = await supabase
    .from("Milestone")
    .select(`
      *,
      project:Project(*),
      tasks:Task(*),
      updates:MilestoneUpdate(*),
      deliverables:Deliverable(*, fileAsset:FileAsset(*)),
      blockers:Blocker(*),
      approvals:MilestoneApproval(*)
    `)
    .eq("id", id)
    .single();

  if (error || !milestone) {
    console.error("Error fetching milestone detail:", error);
    return c.json({ error: "Milestone not found" }, 404);
  }

  return c.json({ data: milestone });
});

milestonesRoutes.post("/api/milestones/:id/updates", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  if (!isAdminCrmRequest(c)) return c.json({ error: "Admin only" }, 403);

  const id = c.req.param("id");
  const { title, message, attachments, tags, createdById } = await c.req.json();

  const { data: update, error } = await supabase
    .from("MilestoneUpdate")
    .insert({
      milestoneId: id,
      organizationId: orgId,
      title,
      message,
      attachments,
      tags,
      createdById
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating milestone update:", error);
    return c.json({ error: "Failed to add update" }, 500);
  }

  return c.json({ data: update });
});

milestonesRoutes.post("/api/milestones/:id/deliverables", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  if (!isAdminCrmRequest(c)) return c.json({ error: "Admin only" }, 403);

  const id = c.req.param("id");
  const { fileAssetId, type, description, uploadedById } = await c.req.json();

  const { data: deliverable, error } = await supabase
    .from("Deliverable")
    .insert({
      milestoneId: id,
      fileAssetId,
      type,
      description,
      uploadedById
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding deliverable:", error);
    return c.json({ error: "Failed to add deliverable" }, 500);
  }

  return c.json({ data: deliverable });
});

milestonesRoutes.post("/api/milestones/:id/blockers", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  if (!isAdminCrmRequest(c)) return c.json({ error: "Admin only" }, 403);

  const id = c.req.param("id");
  const { title, description, severity, status, createdById, assignedResolverId, expectedResolutionDate } = await c.req.json();

  const { data: blocker, error } = await supabase
    .from("Blocker")
    .insert({
      milestoneId: id,
      title,
      description,
      severity,
      status: status ?? "OPEN",
      createdById,
      assignedResolverId,
      expectedResolutionDate: expectedResolutionDate ? new Date(expectedResolutionDate).toISOString() : null
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding blocker:", error);
    return c.json({ error: "Failed to add blocker" }, 500);
  }

  return c.json({ data: blocker });
});

milestonesRoutes.patch("/api/milestones/:id/blockers/:blockerId", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  if (!isAdminCrmRequest(c)) return c.json({ error: "Admin only" }, 403);

  const blockerId = c.req.param("blockerId");
  const { status, resolutionDate, assignedResolverId } = await c.req.json();

  const { data: blocker, error } = await supabase
    .from("Blocker")
    .update({
      status,
      assignedResolverId,
      expectedResolutionDate: resolutionDate ? new Date(resolutionDate).toISOString() : undefined
    })
    .eq("id", blockerId)
    .select()
    .single();

  if (error) {
    console.error("Error updating blocker:", error);
    return c.json({ error: "Failed to update blocker" }, 500);
  }

  return c.json({ data: blocker });
});

milestonesRoutes.post("/api/milestones/:id/approve", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  
  const id = c.req.param("id");
  const { approvedById, comment } = await c.req.json();

  const { data: approval, error } = await supabase
    .from("MilestoneApproval")
    .insert({
      milestoneId: id,
      approvedById,
      status: "APPROVED",
      comment,
      approvedAt: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error approving milestone:", error);
    return c.json({ error: "Failed to approve milestone" }, 500);
  }

  // Also update milestone status to COMPLETED if approved
  await supabase.from("Milestone").update({ status: "COMPLETED", progressPercent: 100 }).eq("id", id);

  const { data: milestone } = await supabase.from("Milestone").select("title").eq("id", id).single();

  await createActivityLog(supabase, {
    organizationId: orgId,
    userId: approvedById || "",
    action: `Milestone approved: ${milestone?.title || id}`,
    entityType: "Milestone",
    entityId: id,
    metadata: { comment, approvedById },
  });

  return c.json({ data: approval });
});

milestonesRoutes.post("/api/milestones/:id/revision-request", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  
  const id = c.req.param("id");
  const { approvedById, comment } = await c.req.json();

  const { data: approval, error } = await supabase
    .from("MilestoneApproval")
    .insert({
      milestoneId: id,
      approvedById,
      status: "REVISION_REQUESTED",
      comment
    })
    .select()
    .single();

  if (error) {
    console.error("Error requesting revision:", error);
    return c.json({ error: "Failed to submit revision request" }, 500);
  }

  // Update milestone status back to IN_PROGRESS or BLOCKED
  await supabase.from("Milestone").update({ status: "IN_PROGRESS" }).eq("id", id);

  const { data: milestone } = await supabase.from("Milestone").select("title").eq("id", id).single();

  await createActivityLog(supabase, {
    organizationId: orgId,
    userId: approvedById || "",
    action: `Milestone revision requested: ${milestone?.title || id}`,
    entityType: "Milestone",
    entityId: id,
    metadata: { comment, requestedBy: approvedById },
  });

  return c.json({ data: approval });
});

milestonesRoutes.delete("/api/milestones/:id", async (c) => {
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

  await supabase.from("Milestone").delete().eq("id", id);

  return c.json({ success: true });
});

milestonesRoutes.post("/api/milestones/:id/tasks", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  if (!isAdminCrmRequest(c)) return c.json({ error: "Admin only" }, 403);

  const id = c.req.param("id");
  const { title, description, assignedToId, dueDate, priority, status } = await c.req.json();

  const { data: task, error } = await supabase
    .from("Task")
    .insert({
      organizationId: orgId,
      milestoneId: id,
      title,
      description,
      assignedToId,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority: priority || "MEDIUM",
      status: status || "TODO"
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating milestone task:", error);
    return c.json({ error: "Failed to create task" }, 500);
  }

  return c.json({ data: task });
});

milestonesRoutes.patch("/api/milestones/:id/tasks/:taskId", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  if (!isAdminCrmRequest(c)) return c.json({ error: "Admin only" }, 403);

  const taskId = c.req.param("taskId");
  const { title, description, assignedToId, dueDate, priority, status } = await c.req.json();

  const { data: task, error } = await supabase
    .from("Task")
    .update({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(assignedToId !== undefined && { assignedToId }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate).toISOString() : null }),
      ...(priority && { priority }),
      ...(status && { status })
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Error updating milestone task:", error);
    return c.json({ error: "Failed to update task" }, 500);
  }

  return c.json({ data: task });
});

milestonesRoutes.patch("/api/milestones/:id/stage", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);
  if (!isAdminCrmRequest(c)) return c.json({ error: "Admin only" }, 403);

  const id = c.req.param("id");
  const { stageIndex, status, notes, completionDate } = await c.req.json();

  const { data: milestone } = await supabase
    .from("Milestone")
    .select("stageBreakdown")
    .eq("id", id)
    .single();

  if (!milestone) return c.json({ error: "Milestone not found" }, 404);

  const stageBreakdown = milestone.stageBreakdown as any[] || [];
  if (stageIndex < 0 || stageIndex >= stageBreakdown.length) {
    return c.json({ error: "Invalid stage index" }, 400);
  }

  stageBreakdown[stageIndex] = {
    ...stageBreakdown[stageIndex],
    status: status || stageBreakdown[stageIndex].status,
    notes: notes !== undefined ? notes : stageBreakdown[stageIndex].notes,
    completionDate: completionDate || (status === "DONE" ? new Date().toISOString() : stageBreakdown[stageIndex].completionDate)
  };

  const { data: updated, error } = await supabase
    .from("Milestone")
    .update({ stageBreakdown, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating stage:", error);
    return c.json({ error: "Failed to update stage" }, 500);
  }

  return c.json({ data: updated });
});

milestonesRoutes.post("/api/milestones/:id/updates/:updateId/comments", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const updateId = c.req.param("updateId");
  const { userId, content } = await c.req.json();

  const { data: comment, error } = await supabase
    .from("Comment")
    .insert({
      organizationId: orgId,
      entityType: "MILESTONE_UPDATE",
      entityId: updateId,
      userId,
      content
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    return c.json({ error: "Failed to add comment" }, 500);
  }

  return c.json({ data: comment });
});

milestonesRoutes.get("/api/milestones/:id/comments", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  if (!orgId) return c.json({ error: "Organization ID required" }, 400);

  const id = c.req.param("id");
  const { data: milestone } = await supabase
    .from("Milestone")
    .select("updates(id)")
    .eq("id", id)
    .single();

  if (!milestone) return c.json({ error: "Milestone not found" }, 404);

  const updateIds = (milestone.updates || []).map((u: any) => u.id);

  const { data: comments, error } = await supabase
    .from("Comment")
    .select("*")
    .eq("organizationId", orgId)
    .eq("entityType", "MILESTONE_UPDATE")
    .in("entityId", updateIds)
    .order("createdAt", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }

  return c.json({ data: comments });
});
