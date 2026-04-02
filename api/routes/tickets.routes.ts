import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader, decodeJwtPayload, extractBearerToken } from "../middleware/auth";
import { createActivityLog } from "../services/notification.service";

export const ticketsRoutes = new Hono<{ Bindings: Env }>();

const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "WAITING_ON_CLIENT", "BLOCKED", "RESOLVED", "CLOSED"];
const TICKET_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const TICKET_CATEGORIES = ["BUG", "FEATURE_REQUEST", "UI_UX_CHANGE", "PAYMENT_BILLING", "DEPLOYMENT_ISSUE", "ACCESS_ISSUE", "PERFORMANCE_ISSUE", "SECURITY_ISSUE", "GENERAL_SUPPORT"];

const SLA_HOURS: Record<string, number> = {
  CRITICAL: 1,
  HIGH: 6,
  MEDIUM: 24,
  LOW: 72
};

function calculateSlaDueAt(priority: string): string {
  const hours = SLA_HOURS[priority] || 24;
  const dueDate = new Date();
  dueDate.setHours(dueDate.getHours() + hours);
  return dueDate.toISOString();
}

function generateTicketNumber(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "FUT-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

ticketsRoutes.get("/api/tickets", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const adminMode = isAdminCrmRequest(c);
  const orgIdHeader = getOrgIdFromHeader(c);
  const { status, priority, category, search } = await c.req.query();

  if (!adminMode && !orgIdHeader) {
    return c.json({ error: "Admin access or Organization ID required" }, 403);
  }

  let query = supabase
    .from("Ticket")
    .select(`
      *,
      project:Project(id, name),
      organization:Organization(id, name)
    `)
    .order("createdAt", { ascending: false });

  if (!adminMode && orgIdHeader) {
    query = query.eq("organizationId", orgIdHeader);
  }

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data: tickets, error } = await query;

  if (error) {
    console.error("Error fetching tickets:", error);
    return c.json({ error: "Failed to fetch tickets" }, 500);
  }
  return c.json({ data: tickets });
});

ticketsRoutes.get("/api/tickets/stats", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const adminMode = isAdminCrmRequest(c);
  if (!adminMode) return c.json({ error: "Admin access required" }, 403);

  const { data: tickets } = await supabase
    .from("Ticket")
    .select("status, priority, slaDueAt");

  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter((t: any) => t.status === "OPEN").length || 0,
    inProgress: tickets?.filter((t: any) => t.status === "IN_PROGRESS").length || 0,
    waitingOnClient: tickets?.filter((t: any) => t.status === "WAITING_ON_CLIENT").length || 0,
    blocked: tickets?.filter((t: any) => t.status === "BLOCKED").length || 0,
    resolved: tickets?.filter((t: any) => t.status === "RESOLVED").length || 0,
    closed: tickets?.filter((t: any) => t.status === "CLOSED").length || 0,
    highPriority: tickets?.filter((t: any) => t.priority === "HIGH" || t.priority === "CRITICAL").length || 0,
    slaOverdue: tickets?.filter((t: any) => {
      if (!t.slaDueAt) return false;
      if (["CLOSED", "RESOLVED"].includes(t.status)) return false;
      return new Date(t.slaDueAt) < new Date();
    }).length || 0,
  };

  return c.json({ data: stats });
});

ticketsRoutes.get("/api/tickets/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");

  const { data: ticket, error } = await supabase
    .from("Ticket")
    .select(`
      *,
      project:Project(id, name),
      organization:Organization(id, name),
      comments:TicketComment(*),
      history:TicketHistory(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching ticket:", error);
    return c.json({ error: "Failed to fetch ticket" }, 500);
  }

  if (!ticket) return c.json({ error: "Ticket not found" }, 404);

  return c.json({ data: ticket });
});

ticketsRoutes.post("/api/tickets", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const adminMode = isAdminCrmRequest(c);

  const jsonBody = await c.req.json().catch(() => ({}));
  const {
    organizationId: bodyOrgId,
    projectId,
    email: bodyEmail,
    title,
    description,
    priority,
    category,
    createdById,
    userRole,
    userId
  } = jsonBody;

  const organizationId = bodyOrgId || getOrgIdFromHeader(c);

  let email = bodyEmail;
  if (!email && !adminMode) {
    const authHeader = c.req.header("authorization");
    const token = extractBearerToken(authHeader || "");
    const decodedToken = token ? decodeJwtPayload(token) : null;
    email = decodedToken?.email || null;
  }

  const ticketNumber = generateTicketNumber();
  const ticketPriority = TICKET_PRIORITIES.includes(priority) ? priority : "MEDIUM";
  const ticketCategory = TICKET_CATEGORIES.includes(category) ? category : "GENERAL_SUPPORT";

  if (!adminMode) {
    if (!organizationId || !title) {
      return c.json({ error: "Organization ID and title are required" }, 400);
    }
  }

  const insertData: any = {
    ticketNumber,
    title,
    description: description ?? null,
    status: "OPEN",
    priority: ticketPriority,
    category: ticketCategory,
    slaDueAt: calculateSlaDueAt(ticketPriority),
    updatedAt: new Date().toISOString(),
  };

  if (organizationId) insertData.organizationId = organizationId;
  if (projectId) insertData.projectId = projectId;
  if (email) insertData.email = email;
  if (createdById) insertData.createdById = createdById;

  const { data: ticket, error } = await supabase
    .from("Ticket")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error creating ticket:", error);
    return c.json({ error: "Failed to create ticket: " + error.message }, 500);
  }

  if (organizationId) {
    console.log("Creating activity log for ticket:", { organizationId, createdById, ticketId: ticket.id });
    await createActivityLog(supabase, {
      organizationId,
      userId: createdById || "",
      action: "Ticket created",
      entityType: "Ticket",
      entityId: ticket.id,
      metadata: { title, priority: ticketPriority, category: ticketCategory },
    });
  } else {
    console.log("No organizationId - skipping activity log", { bodyOrgId, headerOrgId: getOrgIdFromHeader(c) });
  }

  return c.json({ data: ticket }, 201);
});

ticketsRoutes.patch("/api/tickets/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const adminMode = isAdminCrmRequest(c);
  if (!adminMode) return c.json({ error: "Admin access required" }, 403);

  const { status, priority, category, assignedToId, resolutionSummary } = await c.req.json();
  const id = c.req.param("id");

  const { data: existingTicket } = await supabase
    .from("Ticket")
    .select("*")
    .eq("id", id)
    .single();

  if (!existingTicket) return c.json({ error: "Ticket not found" }, 404);

  const updates: Record<string, any> = { updatedAt: new Date().toISOString() };

  if (status && TICKET_STATUSES.includes(status)) {
    updates.status = status;
    if (status === "CLOSED") updates.closedAt = new Date().toISOString();
  }

  if (priority && TICKET_PRIORITIES.includes(priority)) {
    updates.priority = priority;
    updates.slaDueAt = calculateSlaDueAt(priority);
  }

  if (category && TICKET_CATEGORIES.includes(category)) {
    updates.category = category;
  }

  if (assignedToId !== undefined) {
    updates.assignedToId = assignedToId || null;
  }

  if (resolutionSummary !== undefined) {
    updates.resolutionSummary = resolutionSummary;
  }

  const { data: ticket, error } = await supabase
    .from("Ticket")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating ticket:", error);
    return c.json({ error: "Failed to update ticket" }, 500);
  }

  if (status && status !== existingTicket.status) {
    await supabase.from("TicketHistory").insert({
      ticketId: id,
      userId: "admin",
      action: "status_changed",
      field: "status",
      oldValue: existingTicket.status,
      newValue: status,
    });
  }

  if (priority && priority !== existingTicket.priority) {
    await supabase.from("TicketHistory").insert({
      ticketId: id,
      userId: "admin",
      action: "priority_changed",
      field: "priority",
      oldValue: existingTicket.priority,
      newValue: priority,
    });
  }

  return c.json({ data: ticket });
});

ticketsRoutes.post("/api/tickets/:id/comments", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");
  const { message, userId, userRole, isInternalNote } = await c.req.json();

  if (!message?.trim()) return c.json({ error: "Message is required" }, 400);

  const { data: comment, error } = await supabase
    .from("TicketComment")
    .insert({
      ticketId: id,
      userId: userId || null,
      userRole: userRole || "CLIENT",
      message: message.trim(),
      isInternalNote: isInternalNote || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    return c.json({ error: "Failed to add comment" }, 500);
  }

  await supabase
    .from("Ticket")
    .update({
      lastReplyAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id);

  return c.json({ data: comment }, 201);
});

ticketsRoutes.get("/api/tickets/:id/comments", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");
  const adminMode = isAdminCrmRequest(c);

  const { data: comments, error } = await supabase
    .from("TicketComment")
    .select("*")
    .eq("ticketId", id)
    .order("createdAt", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }

  if (!adminMode) {
    const filteredComments = (comments || []).filter((c: any) => !c.isInternalNote);
    return c.json({ data: filteredComments });
  }

  return c.json({ data: comments });
});

ticketsRoutes.post("/api/tickets/:id/convert-to-task", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const adminMode = isAdminCrmRequest(c);
  if (!adminMode) return c.json({ error: "Admin access required" }, 403);

  const id = c.req.param("id");
  const { assignedToId } = await c.req.json();

  const { data: ticket } = await supabase
    .from("Ticket")
    .select("*")
    .eq("id", id)
    .single();

  if (!ticket) return c.json({ error: "Ticket not found" }, 404);

  const { data: task, error } = await supabase
    .from("Task")
    .insert({
      organizationId: ticket.organizationId,
      projectId: ticket.projectId,
      milestoneId: null,
      title: `[FUT-TASK] ${ticket.title}`,
      description: ticket.description,
      priority: ticket.priority,
      status: "TODO",
      createdById: ticket.createdById,
      assignedToId: assignedToId || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error converting to task:", error);
    return c.json({ error: "Failed to convert to task" }, 500);
  }

  await supabase.from("Ticket").update({ status: "IN_PROGRESS" }).eq("id", id);

  await supabase.from("TicketHistory").insert({
    ticketId: id,
    userId: "admin",
    action: "converted_to_task",
    field: "taskId",
    newValue: task.id,
  });

  return c.json({ ticketId: id, taskId: task.id, task });
});

ticketsRoutes.delete("/api/tickets/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const adminMode = isAdminCrmRequest(c);
  if (!adminMode) return c.json({ error: "Admin access required" }, 403);

  const id = c.req.param("id");

  await supabase.from("TicketComment").delete().eq("ticketId", id);
  await supabase.from("TicketHistory").delete().eq("ticketId", id);
  await supabase.from("Ticket").delete().eq("id", id);

  return c.json({ success: true });
});