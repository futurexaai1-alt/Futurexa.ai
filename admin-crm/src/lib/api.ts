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

async function getJson<T>(path: string, options?: AdminRequestOptions): Promise<T> {
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

async function sendJson<T>(method: "POST" | "PATCH", path: string, body: unknown, options?: AdminRequestOptions): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers: getAuthHeaders(options),
      body: JSON.stringify(body),
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

export async function createProject(payload: { organizationId: string; name: string; description?: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/projects",
    { name: payload.name, description: payload.description },
    { organizationId: payload.organizationId }
  );
}

export async function createMilestone(payload: { organizationId: string; projectId: string; title: string }) {
  return sendJson<Record<string, unknown>>(
    "POST",
    "/api/milestones",
    { projectId: payload.projectId, title: payload.title },
    { organizationId: payload.organizationId }
  );
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

export async function updateRequestStatus(payload: { organizationId: string; id: string; status: string }) {
  return sendJson<Record<string, unknown>>(
    "PATCH",
    `/api/project-requests/${encodeURIComponent(payload.id)}/status`,
    { status: payload.status },
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
