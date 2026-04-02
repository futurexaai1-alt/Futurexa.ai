const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

type ApiResponse<T> = {
  data: T;
};

type AdminPayload = {
  organizations: Array<Record<string, unknown>>;
  users: Array<Record<string, unknown>>;
  projectRequests: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  milestones: Array<Record<string, unknown>>;
  tasks: Array<Record<string, unknown>>;
  tickets: Array<Record<string, unknown>>;
  files: Array<Record<string, unknown>>;
  deployments: Array<Record<string, unknown>>;
  billingSubscriptions: Array<Record<string, unknown>>;
  billingPayments: Array<Record<string, unknown>>;
  billingInvoices: Array<Record<string, unknown>>;
  activityLogs: Array<Record<string, unknown>>;
  integrations: Array<Record<string, unknown>>;
  webhooks: Array<Record<string, unknown>>;
};

type AdminRequestOptions = {
  organizationId?: string;
};

function getAuthHeaders(options?: AdminRequestOptions) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-admin-crm": "true",
  };
  if (options?.organizationId) {
    headers["x-organization-id"] = options.organizationId;
  }
  return headers;
}

async function parseError(response: Response) {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text) as { error?: string };
    return parsed.error || text || `Request failed with status ${response.status}`;
  } catch {
    return text || `Request failed with status ${response.status}`;
  }
}

export async function getJson<T>(path: string, options?: AdminRequestOptions): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: "GET",
      headers: getAuthHeaders(options),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch";
    if (message.toLowerCase().includes("failed to fetch")) {
      throw new Error(`Cannot reach API at ${apiBaseUrl}. Make sure API server is running and CORS is configured.`);
    }
    throw error instanceof Error ? error : new Error(message);
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const payload = (await response.json()) as ApiResponse<T>;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }
  throw new Error(`Invalid response format from ${path}`);
}

export async function sendJson<T>(method: "POST" | "PATCH" | "PUT" | "DELETE", path: string, body?: unknown, options?: AdminRequestOptions): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers: getAuthHeaders(options),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch";
    if (message.toLowerCase().includes("failed to fetch")) {
      throw new Error(`Cannot reach API at ${apiBaseUrl}. Make sure API server is running and CORS is configured.`);
    }
    throw error instanceof Error ? error : new Error(message);
  }
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const payload = (await response.json()) as ApiResponse<T>;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }
  throw new Error(`Invalid response format from ${path}`);
}

export async function fetchAdminPayload(organizationId?: string): Promise<AdminPayload> {
  const scoped = { organizationId };
  const [organizationsResult, usersResult, projectRequestsResult, projectsResult, milestonesResult, tasksResult, ticketsResult, filesResult, deploymentsResult, subscriptionsResult, paymentsResult, invoicesResult, activityLogsResult, integrationsResult, webhooksResult] = await Promise.allSettled([
    getJson<Array<Record<string, unknown>>>("/api/organizations", scoped),
    getJson<Array<Record<string, unknown>>>("/api/users", scoped),
    getJson<Array<Record<string, unknown>>>("/api/project-requests", scoped),
    getJson<Array<Record<string, unknown>>>("/api/projects", scoped),
    getJson<Array<Record<string, unknown>>>("/api/milestones", scoped),
    getJson<Array<Record<string, unknown>>>("/api/tasks", scoped),
    getJson<Array<Record<string, unknown>>>("/api/tickets", scoped),
    getJson<Array<Record<string, unknown>>>("/api/files", scoped),
    getJson<Array<Record<string, unknown>>>("/api/deployments", scoped),
    getJson<Array<Record<string, unknown>>>("/api/billing/subscriptions", scoped),
    getJson<Array<Record<string, unknown>>>("/api/billing/payments", scoped),
    getJson<Array<Record<string, unknown>>>("/api/billing/invoices", scoped),
    getJson<Array<Record<string, unknown>>>("/api/activity-logs", scoped),
    getJson<Array<Record<string, unknown>>>("/api/integrations", scoped),
    getJson<Array<Record<string, unknown>>>("/api/webhooks", scoped),
  ]);

  const organizations = organizationsResult.status === "fulfilled" ? organizationsResult.value : [];
  const users = usersResult.status === "fulfilled" ? usersResult.value : [];
  const projectRequests = projectRequestsResult.status === "fulfilled" ? projectRequestsResult.value : [];
  const projects = projectsResult.status === "fulfilled" ? projectsResult.value : [];
  const milestones = milestonesResult.status === "fulfilled" ? milestonesResult.value : [];
  const tasks = tasksResult.status === "fulfilled" ? tasksResult.value : [];
  const tickets = ticketsResult.status === "fulfilled" ? ticketsResult.value : [];
  const files = filesResult.status === "fulfilled" ? filesResult.value : [];
  const deployments = deploymentsResult.status === "fulfilled" ? deploymentsResult.value : [];
  const billingSubscriptions = subscriptionsResult.status === "fulfilled" ? subscriptionsResult.value : [];
  const billingPayments = paymentsResult.status === "fulfilled" ? paymentsResult.value : [];
  const billingInvoices = invoicesResult.status === "fulfilled" ? invoicesResult.value : [];
  const activityLogs = activityLogsResult.status === "fulfilled" ? activityLogsResult.value : [];
  const integrations = integrationsResult.status === "fulfilled" ? integrationsResult.value : [];
  const webhooks = webhooksResult.status === "fulfilled" ? webhooksResult.value : [];

  if (
    organizationsResult.status === "rejected" &&
    usersResult.status === "rejected" &&
    projectRequestsResult.status === "rejected" &&
    projectsResult.status === "rejected" &&
    milestonesResult.status === "rejected" &&
    tasksResult.status === "rejected" &&
    ticketsResult.status === "rejected"
  ) {
    throw usersResult.reason instanceof Error ? usersResult.reason : new Error("Unable to load admin data");
  }

  return {
    organizations,
    users,
    projectRequests,
    projects,
    milestones,
    tasks,
    tickets,
    files,
    deployments,
    billingSubscriptions,
    billingPayments,
    billingInvoices,
    activityLogs,
    integrations,
    webhooks,
  };
}

export async function createOrganization(name: string) {
  return sendJson<Record<string, unknown>>("POST", "/api/organizations", { name });
}

export async function deleteOrganization(id: string) {
  const response = await fetch(`${apiBaseUrl}/api/organizations/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function updateOrganization(payload: { id: string; name?: string; status?: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/organizations/${encodeURIComponent(payload.id)}`,
    { name: payload.name, status: payload.status }
  );
}

export async function addOrganizationMember(organizationId: string, userId: string) {
  return sendJson<Record<string, unknown>>("POST", "/api/organizations/members", {
    organizationId,
    userId,
  });
}

export async function removeOrganizationMember(organizationId: string, userId: string) {
  const response = await fetch(
    `${apiBaseUrl}/api/organizations/${encodeURIComponent(organizationId)}/members/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function createProject(payload: { organizationId: string; name: string; description?: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/projects",
    { name: payload.name, description: payload.description },
    { organizationId: payload.organizationId }
  );
}

export async function createMilestone(payload: { organizationId: string; projectId: string; title: string; dueDate?: string; description?: string; startDate?: string; status?: string; progressPercent?: number; stageBreakdown?: any; expectedDeliverables?: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/milestones",
    { 
      projectId: payload.projectId, 
      title: payload.title, 
      dueDate: payload.dueDate,
      description: payload.description,
      startDate: payload.startDate,
      status: payload.status,
      progressPercent: payload.progressPercent,
      stageBreakdown: payload.stageBreakdown,
      expectedDeliverables: payload.expectedDeliverables
    },
    { organizationId: payload.organizationId }
  );
}

export async function deleteMilestone(payload: { organizationId: string; id: string }) {
  const response = await fetch(`${apiBaseUrl}/api/milestones/${encodeURIComponent(payload.id)}`, {
    method: "DELETE",
    headers: getAuthHeaders({ organizationId: payload.organizationId }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}


export async function createTask(payload: { organizationId: string; projectId: string; title: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/tasks",
    { projectId: payload.projectId, title: payload.title },
    { organizationId: payload.organizationId }
  );
}

export async function createTicket(payload: { organizationId: string; projectId: string; title: string; type: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/tickets",
    { projectId: payload.projectId, title: payload.title, type: payload.type },
    { organizationId: payload.organizationId }
  );
}

export async function updateProject(payload: { organizationId: string; id: string; name?: string; description?: string; status?: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/projects/${encodeURIComponent(payload.id)}`,
    { name: payload.name, description: payload.description, status: payload.status },
    { organizationId: payload.organizationId }
  );
}

export async function deleteProject(payload: { organizationId: string; id: string }) {
  const response = await fetch(`${apiBaseUrl}/api/projects/${encodeURIComponent(payload.id)}`, {
    method: "DELETE",
    headers: getAuthHeaders({ organizationId: payload.organizationId }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function createDeployment(payload: { organizationId: string; projectId?: string; name: string; environment?: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/deployments",
    { projectId: payload.projectId, name: payload.name, environment: payload.environment, status: "IN_PROGRESS", metadata: {} },
    { organizationId: payload.organizationId }
  );
}

export async function updateDeploymentStatus(payload: { organizationId: string; id: string; status: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/deployments/${encodeURIComponent(payload.id)}`,
    { status: payload.status },
    { organizationId: payload.organizationId }
  );
}

export async function deleteDeployment(payload: { organizationId: string; id: string }) {
  const response = await fetch(`${apiBaseUrl}/api/deployments/${encodeURIComponent(payload.id)}`, {
    method: "DELETE",
    headers: getAuthHeaders({ organizationId: payload.organizationId }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}


export async function updateMilestone(payload: { 
  organizationId: string; 
  id: string; 
  title?: string; 
  description?: string; 
  status?: string; 
  dueDate?: string;
  startDate?: string;
  progressPercent?: number;
  stageBreakdown?: any;
  expectedDeliverables?: string;
}) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/milestones/${encodeURIComponent(payload.id)}`,
    { 
      title: payload.title, 
      description: payload.description, 
      status: payload.status, 
      dueDate: payload.dueDate,
      startDate: payload.startDate,
      progressPercent: payload.progressPercent,
      stageBreakdown: payload.stageBreakdown,
      expectedDeliverables: payload.expectedDeliverables
    },
    { organizationId: payload.organizationId }
  );
}

export async function getMilestone(organizationId: string, id: string) {
  return getJson<Record<string, any>>(`/api/milestones/${encodeURIComponent(id)}`, { organizationId });
}

export async function addMilestoneUpdate(payload: {
  organizationId: string;
  milestoneId: string;
  title: string;
  message: string;
  attachments?: any;
  tags?: string;
  createdById: string;
}) {
  return sendJson<Record<string, any>>(
    "POST",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/updates`,
    { 
      title: payload.title, 
      message: payload.message, 
      attachments: payload.attachments, 
      tags: payload.tags, 
      createdById: payload.createdById 
    },
    { organizationId: payload.organizationId }
  );
}

export async function addMilestoneDeliverable(payload: {
  organizationId: string;
  milestoneId: string;
  fileAssetId: string;
  type: string;
  description?: string;
  uploadedById: string;
}) {
  return sendJson<Record<string, any>>(
    "POST",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/deliverables`,
    { 
      fileAssetId: payload.fileAssetId, 
      type: payload.type, 
      description: payload.description, 
      uploadedById: payload.uploadedById 
    },
    { organizationId: payload.organizationId }
  );
}

export async function addMilestoneBlocker(payload: {
  organizationId: string;
  milestoneId: string;
  title: string;
  description: string;
  severity: string;
  status?: string;
  createdById: string;
  assignedResolverId?: string;
  expectedResolutionDate?: string;
}) {
  return sendJson<Record<string, any>>(
    "POST",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/blockers`,
    { 
      title: payload.title, 
      description: payload.description, 
      severity: payload.severity, 
      status: payload.status, 
      createdById: payload.createdById,
      assignedResolverId: payload.assignedResolverId,
      expectedResolutionDate: payload.expectedResolutionDate
    },
    { organizationId: payload.organizationId }
  );
}

export async function updateMilestoneBlocker(payload: {
  organizationId: string;
  milestoneId: string;
  blockerId: string;
  status: string;
  resolutionDate?: string;
  assignedResolverId?: string;
}) {
  return sendJson<Record<string, any>>(
    "PATCH",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/blockers/${encodeURIComponent(payload.blockerId)}`,
    { 
      status: payload.status, 
      resolutionDate: payload.resolutionDate,
      assignedResolverId: payload.assignedResolverId
    },
    { organizationId: payload.organizationId }
  );
}

export async function approveMilestone(payload: {
  organizationId: string;
  milestoneId: string;
  approvedById: string;
  comment?: string;
}) {
  return sendJson<Record<string, any>>(
    "POST",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/approve`,
    { 
      approvedById: payload.approvedById, 
      comment: payload.comment 
    },
    { organizationId: payload.organizationId }
  );
}

export async function requestMilestoneRevision(payload: {
  organizationId: string;
  milestoneId: string;
  approvedById: string;
  comment: string;
}) {
  return sendJson<Record<string, any>>(
    "POST",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/revision-request`,
    {
      approvedById: payload.approvedById,
      comment: payload.comment
    },
    { organizationId: payload.organizationId }
  );
}

export async function addMilestoneTask(payload: {
  organizationId: string;
  milestoneId: string;
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
}) {
  return sendJson<Record<string, any>>(
    "POST",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/tasks`,
    {
      title: payload.title,
      description: payload.description,
      assignedToId: payload.assignedToId,
      dueDate: payload.dueDate,
      priority: payload.priority || "MEDIUM",
      status: payload.status || "TODO"
    },
    { organizationId: payload.organizationId }
  );
}

export async function updateMilestoneTask(payload: {
  organizationId: string;
  milestoneId: string;
  taskId: string;
  title?: string;
  description?: string;
  assignedToId?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
}) {
  return sendJson<Record<string, any>>(
    "PATCH",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/tasks/${encodeURIComponent(payload.taskId)}`,
    {
      title: payload.title,
      description: payload.description,
      assignedToId: payload.assignedToId,
      dueDate: payload.dueDate,
      priority: payload.priority,
      status: payload.status
    },
    { organizationId: payload.organizationId }
  );
}

export async function updateMilestoneStage(payload: {
  organizationId: string;
  milestoneId: string;
  stageIndex: number;
  status?: string;
  notes?: string;
  completionDate?: string;
}) {
  return sendJson<Record<string, any>>(
    "PATCH",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/stage`,
    {
      stageIndex: payload.stageIndex,
      status: payload.status,
      notes: payload.notes,
      completionDate: payload.completionDate
    },
    { organizationId: payload.organizationId }
  );
}

export async function addCommentToUpdate(payload: {
  organizationId: string;
  milestoneId: string;
  updateId: string;
  userId: string;
  content: string;
}) {
  return sendJson<Record<string, any>>(
    "POST",
    `/api/milestones/${encodeURIComponent(payload.milestoneId)}/updates/${encodeURIComponent(payload.updateId)}/comments`,
    {
      userId: payload.userId,
      content: payload.content
    },
    { organizationId: payload.organizationId }
  );
}

export async function getMilestoneComments(organizationId: string, milestoneId: string) {
  return getJson<Array<Record<string, unknown>>>(`/api/milestones/${encodeURIComponent(milestoneId)}/comments`, { organizationId });
}


export async function updateRequestStatus(payload: { organizationId: string; id: string; status: string; internalNote?: string; rejectionReason?: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/project-requests/${encodeURIComponent(payload.id)}/status`,
    { status: payload.status, internalNote: payload.internalNote, rejectionReason: payload.rejectionReason },
    { organizationId: payload.organizationId }
  );
}


export async function updateTicketStatus(payload: { organizationId: string; id: string; status: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/tickets/${encodeURIComponent(payload.id)}/status`,
    { status: payload.status },
    { organizationId: payload.organizationId }
  );
}

export async function deleteRequest(id: string) {
  const response = await fetch(`${apiBaseUrl}/api/project-requests/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function updateTask(payload: { organizationId: string; id: string; title?: string; description?: string; status?: string; dueDate?: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/tasks/${encodeURIComponent(payload.id)}`,
    { title: payload.title, description: payload.description, status: payload.status, dueDate: payload.dueDate },
    { organizationId: payload.organizationId }
  );
}

export async function deleteTask(payload: { organizationId: string; id: string }) {
  const response = await fetch(`${apiBaseUrl}/api/tasks/${encodeURIComponent(payload.id)}`, {
    method: "DELETE",
    headers: getAuthHeaders({ organizationId: payload.organizationId }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function updateFile(payload: { organizationId: string; id: string; visibility?: string }) {
  const response = await fetch(`${apiBaseUrl}/api/files/${encodeURIComponent(payload.id)}`, {
    method: "PATCH",
    headers: { ...getAuthHeaders({ organizationId: payload.organizationId }), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function deleteUser(id: string) {

  const response = await fetch(`${apiBaseUrl}/api/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function suspendUser(payload: { id: string; reason: string }) {
  const response = await fetch(`${apiBaseUrl}/api/users/${encodeURIComponent(payload.id)}/suspend`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason: payload.reason }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function unsuspendUser(id: string) {
  const response = await fetch(`${apiBaseUrl}/api/users/${encodeURIComponent(id)}/unsuspend`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function restoreUser(id: string) {
  const response = await fetch(`${apiBaseUrl}/api/users/${encodeURIComponent(id)}/restore`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
export async function createIntegration(payload: { organizationId: string; name: string; provider: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/integrations",
    { name: payload.name, provider: payload.provider, status: "ACTIVE" },
    { organizationId: payload.organizationId }
  );
}

export async function updateIntegrationStatus(payload: { organizationId: string; id: string; status: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/integrations/${encodeURIComponent(payload.id)}`,
    { status: payload.status },
    { organizationId: payload.organizationId }
  );
}

export async function deleteIntegration(payload: { organizationId: string; id: string }) {
  const response = await fetch(`${apiBaseUrl}/api/integrations/${encodeURIComponent(payload.id)}`, {
    method: "DELETE",
    headers: getAuthHeaders({ organizationId: payload.organizationId }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function createWebhook(payload: { organizationId: string; integrationId: string; url: string; secret?: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/webhooks",
    { integrationId: payload.integrationId, url: payload.url, secret: payload.secret, events: {} },
    { organizationId: payload.organizationId }
  );
}

export async function updateWebhook(payload: { organizationId: string; id: string; url?: string; secret?: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/webhooks/${encodeURIComponent(payload.id)}`,
    { url: payload.url, secret: payload.secret },
    { organizationId: payload.organizationId }
  );
}

export async function deleteWebhook(payload: { organizationId: string; id: string }) {
  const response = await fetch(`${apiBaseUrl}/api/webhooks/${encodeURIComponent(payload.id)}`, {
    method: "DELETE",
    headers: getAuthHeaders({ organizationId: payload.organizationId }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function deleteTicket(payload: { organizationId: string; id: string }) {
  const response = await fetch(`${apiBaseUrl}/api/tickets/${encodeURIComponent(payload.id)}`, {
    method: "DELETE",
    headers: getAuthHeaders({ organizationId: payload.organizationId }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function uploadFile(payload: {
  organizationId: string;
  file: File;
  name?: string;
  fileType?: string;
  projectId?: string;
}) {
  const form = new FormData();
  form.append("file", payload.file);
  if (payload.name) form.append("name", payload.name);
  if (payload.fileType) form.append("fileType", payload.fileType);
  if (payload.projectId) form.append("projectId", payload.projectId);

  const response = await fetch(`${apiBaseUrl}/api/files`, {
    method: "POST",
    headers: {
      "x-admin-crm": "true",
      "x-organization-id": payload.organizationId,
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function updateFileStatus(payload: { organizationId: string; id: string; fileType?: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/files/${encodeURIComponent(payload.id)}`,
    { fileType: payload.fileType },
    { organizationId: payload.organizationId }
  );
}

export async function deleteFile(payload: { organizationId: string; id: string }) {
  const response = await fetch(`${apiBaseUrl}/api/files/${encodeURIComponent(payload.id)}`, {
    method: "DELETE",
    headers: getAuthHeaders({ organizationId: payload.organizationId }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

