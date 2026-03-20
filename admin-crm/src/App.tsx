import { useEffect, useState } from "react";
import { Users, Briefcase, Flag, Ticket, FileBox, CreditCard, Activity, Building2, UserCheck, Search, Bell, Loader2, CheckCircle2, XCircle, ExternalLink, ListTodo, Rocket, Upload } from "lucide-react";
import "./index.css";
import { fetchAdminPayload, updateRequestStatus } from "./lib/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";

type Stats = {
  organizations: number;
  users: number;
  pendingLeads: number;
};

type LeadRequest = {
  id: string;
  status: string;
  type: string;
  description: string;
  requestedBy?: { name: string; email: string };
  organization?: { name: string };
  createdAt: string;
};

type Organization = {
  id: string;
  name: string;
  status: string;
  planId: string | null;
  createdAt: string;
};

type User = {
  id: string;
  email: string;
  name: string | null;
  status: string;
  createdAt: string;
};

type ActivityLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  user?: { email: string; name: string | null };
  organization?: { name: string };
};

type Subscription = {
  id: string;
  planName: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  organization?: { name: string };
};

export default function App() {
  const sections: Array<{ name: string; icon: typeof Building2; key: "organizations" | "users" | "pendingLeads" | null }> = [
    { name: "Organizations", icon: Building2, key: "organizations" },
    { name: "Users", icon: Users, key: "users" },
    { name: "Pending Leads", icon: UserCheck, key: "pendingLeads" },
    { name: "Projects", icon: Briefcase, key: null },
    { name: "Milestones", icon: Flag, key: null },
    { name: "Tasks", icon: ListTodo, key: null },
    { name: "Tickets", icon: Ticket, key: null },
    { name: "Files", icon: FileBox, key: null },
    { name: "Deployments", icon: Rocket, key: null },
    { name: "Integrations", icon: ExternalLink, key: null },
    { name: "Webhooks", icon: Bell, key: null },
    { name: "Billing", icon: CreditCard, key: null },
    { name: "Activity Logs", icon: Activity, key: null },
  ];

  function sectionNameToPath(sectionName: string | null) {
    if (!sectionName) return "/dashboard";
    switch (sectionName) {
      case "Organizations":
        return "/dashboard/organizations";
      case "Users":
        return "/dashboard/users";
      case "Pending Leads":
        return "/dashboard/leads";
      case "Projects":
        return "/dashboard/project";
      case "Milestones":
        return "/dashboard/milestones";
      case "Tickets":
        return "/dashboard/ticket";
      case "Files":
        return "/dashboard/files";
      case "Billing":
        return "/dashboard/billing";
      case "Activity Logs":
        return "/dashboard/activity";
      default:
        return "/dashboard";
    }
  }

  function pathToSectionName(pathname: string): string | null {
    const trimmed = pathname.replace(/\/+$/, "");
    const parts = trimmed.split("/");
    const last = parts[parts.length - 1];
    switch (last) {
      case "dashboard":
      case "":
        return null;
      case "organizations":
        return "Organizations";
      case "users":
        return "Users";
      case "leads":
        return "Pending Leads";
      case "project":
        return "Projects";
      case "milestones":
        return "Milestones";
      case "ticket":
        return "Tickets";
      case "files":
        return "Files";
      case "billing":
        return "Billing";
      case "activity":
        return "Activity Logs";
      default:
        return null;
    }
  }

  const [apiStatus, setApiStatus] = useState("checking");
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [requests, setRequests] = useState<LeadRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [billingPayments, setBillingPayments] = useState<any[]>([]);
  const [billingInvoices, setBillingInvoices] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [taskCreateTitle, setTaskCreateTitle] = useState("");
  const [taskCreateProjectId, setTaskCreateProjectId] = useState<string>("");
  const [fileUploadProjectId, setFileUploadProjectId] = useState<string>("");
  const [fileUploadType, setFileUploadType] = useState<string>("");
  const [fileUploadName, setFileUploadName] = useState<string>("");
  const [fileUploadFile, setFileUploadFile] = useState<File | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deploymentCreateName, setDeploymentCreateName] = useState("");
  const [deploymentCreateEnvironment, setDeploymentCreateEnvironment] = useState("staging");
  const [deploymentCreateProjectId, setDeploymentCreateProjectId] = useState<string>("");
  const [integrationCreateProvider, setIntegrationCreateProvider] = useState("github");
  const [integrationCreateName, setIntegrationCreateName] = useState("");
  const [webhookCreateIntegrationId, setWebhookCreateIntegrationId] = useState<string>("");
  const [webhookCreateUrl, setWebhookCreateUrl] = useState("");
  const [webhookCreateSecret, setWebhookCreateSecret] = useState("");
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const fetchData = async () => {
    setStatsLoading(true);
    setRequestsLoading(true);

    try {
      const statsRes = await fetch(`${API_BASE}/api/admin/stats`);
      const statsData = await statsRes.json();
      if (statsData?.data) setStats(statsData.data);

      const reqRes = await fetch(`${API_BASE}/api/project-requests`);
      const reqData = await reqRes.json();
      if (reqData?.data) setRequests(reqData.data);

      // Initial payload (no org scope) to discover organizations
      const initial = await fetchAdminPayload();
      setOrganizations((initial.organizations as any[]) ?? []);
      setUsers((initial.users as any[]) ?? []);

      const firstOrgId = (initial.organizations?.[0] as any)?.id as string | null;
      setActiveOrgId(firstOrgId);

      if (firstOrgId) {
        const scoped = await fetchAdminPayload(firstOrgId);
        setProjects(scoped.projects as any[]);
        setMilestones(scoped.milestones as any[]);
        setTasks(scoped.tasks as any[]);
        setTickets(scoped.tickets as any[]);
        setFiles(scoped.files as any[]);
        setDeployments(scoped.deployments as any[]);
        setIntegrations(scoped.integrations as any[]);
        setWebhooks(scoped.webhooks as any[]);
        setSubscriptions(scoped.billingSubscriptions as any[]);
        setBillingPayments(scoped.billingPayments as any[]);
        setBillingInvoices(scoped.billingInvoices as any[]);
        setActivityLogs(scoped.activityLogs as any[]);
      } else {
        setProjects([]);
        setMilestones([]);
        setTasks([]);
        setTickets([]);
        setFiles([]);
        setDeployments([]);
        setIntegrations([]);
        setWebhooks([]);
        setSubscriptions([]);
        setBillingPayments([]);
        setBillingInvoices([]);
        setActivityLogs([]);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setStatsLoading(false);
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    const syncFromPath = () => {
      setActiveSection(pathToSectionName(window.location.pathname));
    };

    syncFromPath();
    window.addEventListener("popstate", syncFromPath);
    return () => window.removeEventListener("popstate", syncFromPath);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((r) => r.json())
      .then((p) => setApiStatus(p.status ?? (p.ok ? "ok" : "unknown")))
      .catch(() => setApiStatus("unreachable"));

    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateRequestStatus({
        organizationId: activeOrgId ?? "",
        id,
        status,
      });
      fetchData();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const adminHeaders = (overrideOrgId?: string | null) => ({
    "Content-Type": "application/json",
    "x-admin-crm": "true",
    "x-organization-id": overrideOrgId ?? activeOrgId ?? "",
  });

  const createTask = async () => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      if (!taskCreateProjectId.trim()) throw new Error("Select a project");
      if (!taskCreateTitle.trim()) throw new Error("Enter a task title");

      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ projectId: taskCreateProjectId, title: taskCreateTitle }),
      });

      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);

      setTaskCreateTitle("");
      // Refresh lists
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to create task");
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/tasks/${encodeURIComponent(taskId)}`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to update task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/tasks/${encodeURIComponent(taskId)}`, {
        method: "DELETE",
        headers: {
          "x-admin-crm": "true",
          "x-organization-id": activeOrgId,
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete task");
    }
  };

  const createDeployment = async () => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      if (!deploymentCreateName.trim()) throw new Error("Enter a deployment name");

      const res = await fetch(`${API_BASE}/api/deployments`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({
          projectId: deploymentCreateProjectId.trim() ? deploymentCreateProjectId : null,
          name: deploymentCreateName,
          status: "IN_PROGRESS",
          environment: deploymentCreateEnvironment || null,
          metadata: {},
        }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
      setDeploymentCreateName("");
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to create deployment");
    }
  };

  const updateDeploymentStatus = async (deploymentId: string, status: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/deployments/${encodeURIComponent(deploymentId)}`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to update deployment");
    }
  };

  const deleteDeployment = async (deploymentId: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/deployments/${encodeURIComponent(deploymentId)}`, {
        method: "DELETE",
        headers: {
          "x-admin-crm": "true",
          "x-organization-id": activeOrgId,
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete deployment");
    }
  };

  const createIntegration = async () => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      if (!integrationCreateName.trim()) throw new Error("Enter an integration name");
      const res = await fetch(`${API_BASE}/api/integrations`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({
          projectId: null,
          provider: integrationCreateProvider,
          name: integrationCreateName,
          status: "ACTIVE",
        }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
      setIntegrationCreateName("");
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to create integration");
    }
  };

  const updateIntegrationStatus = async (integrationId: string, status: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/integrations/${encodeURIComponent(integrationId)}`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to update integration");
    }
  };

  const deleteIntegration = async (integrationId: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/integrations/${encodeURIComponent(integrationId)}`, {
        method: "DELETE",
        headers: {
          "x-admin-crm": "true",
          "x-organization-id": activeOrgId,
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete integration");
    }
  };

  const createWebhook = async () => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      if (!webhookCreateIntegrationId.trim()) throw new Error("Select an integration");
      if (!webhookCreateUrl.trim()) throw new Error("Enter a webhook URL");

      const res = await fetch(`${API_BASE}/api/webhooks`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({
          integrationId: webhookCreateIntegrationId,
          url: webhookCreateUrl,
          secret: webhookCreateSecret || null,
          events: {},
        }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);
      setWebhookCreateUrl("");
      setWebhookCreateSecret("");
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to create webhook");
    }
  };

  const updateWebhook = async (webhookId: string, patch: Record<string, unknown>) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/webhooks/${encodeURIComponent(webhookId)}`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to update webhook");
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/webhooks/${encodeURIComponent(webhookId)}`, {
        method: "DELETE",
        headers: {
          "x-admin-crm": "true",
          "x-organization-id": activeOrgId,
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete webhook");
    }
  };

  const updateMilestoneStatus = async (milestoneId: string, status: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/milestones/${encodeURIComponent(milestoneId)}`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to update milestone");
    }
  };

  const deleteMilestone = async (milestoneId: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/milestones/${encodeURIComponent(milestoneId)}`, {
        method: "DELETE",
        headers: {
          "x-admin-crm": "true",
          "x-organization-id": activeOrgId,
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete milestone");
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/tickets/${encodeURIComponent(ticketId)}/status`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to update ticket");
    }
  };

  const deleteTicket = async (ticketId: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/tickets/${encodeURIComponent(ticketId)}`, {
        method: "DELETE",
        headers: {
          "x-admin-crm": "true",
          "x-organization-id": activeOrgId,
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete ticket");
    }
  };

  const uploadFileAdmin = async () => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      if (!fileUploadFile) throw new Error("Select a file");

      setIsFileUploading(true);
      const form = new FormData();
      form.append("file", fileUploadFile);
      form.append("fileName", fileUploadName || fileUploadFile.name);
      form.append("fileType", fileUploadType || fileUploadFile.type || "");
      if (fileUploadProjectId.trim()) form.append("projectId", fileUploadProjectId.trim());

      const res = await fetch(`${API_BASE}/api/files/upload`, {
        method: "POST",
        headers: {
          "x-admin-crm": "true",
          "x-organization-id": activeOrgId,
        },
        body: form,
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) throw new Error(j?.error || `HTTP ${res.status}`);

      setFileUploadFile(null);
      setFileUploadType("");
      setFileUploadName("");
      setFileUploadProjectId("");
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "File upload failed");
    } finally {
      setIsFileUploading(false);
    }
  };

  const updateFileType = async (fileId: string, nextFileType: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/files/${encodeURIComponent(fileId)}`, {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ fileType: nextFileType }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to update file metadata");
    }
  };

  const deleteFileAdmin = async (fileId: string) => {
    try {
      if (!activeOrgId) throw new Error("No active organization selected");
      const res = await fetch(`${API_BASE}/api/files/${encodeURIComponent(fileId)}`, {
        method: "DELETE",
        headers: {
          "x-admin-crm": "true",
          "x-organization-id": activeOrgId,
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      await fetchData();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete file");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 z-50 shadow-sm hidden md:flex">
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Admin CRM</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                 <div className={`h-2 w-2 rounded-full ${apiStatus === "ok" ? "bg-green-500" : "bg-red-500"}`} />
                 API: {apiStatus}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <button
            onClick={() => {
              const next = null;
              setActiveSection(next);
              window.history.pushState({}, "", sectionNameToPath(next));
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
              activeSection === null 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Building2 className={`h-5 w-5 ${activeSection === null ? 'text-white' : 'text-gray-400'}`} />
            Overview Dashboard
          </button>
          
          <div className="pt-6 pb-2 px-4">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</p>
          </div>

          {sections.map(section => {
             const Icon = section.icon;
             const isActive = activeSection === section.name;
             const count = section.key !== null && stats ? stats[section.key] : null;

             return (
               <button
                 key={section.name}
                  onClick={() => {
                    const next = section.name;
                    setActiveSection(next);
                    window.history.pushState({}, "", sectionNameToPath(next));
                  }}
                 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
                   isActive
                     ? 'bg-gray-900 text-white shadow-md'
                     : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {section.name}
                 </div>
                 {count !== null && count > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {count}
                    </span>
                 )}
               </button>
             );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between md:justify-end px-8 flex-shrink-0 z-40">
           {/* Mobile Branding */}
           <div className="md:hidden flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <h1 className="text-lg font-bold text-gray-900">Admin CRM</h1>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input type="text" placeholder="Search anything..." className="h-10 pl-10 pr-4 rounded-full bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all w-64 text-gray-900" />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
                 <Bell className="h-5 w-5" />
                 {stats?.pendingLeads ? <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white" /> : null}
              </button>
              <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 w-full max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
               <h2 className="text-3xl font-bold text-gray-900 mb-2">
                 {activeSection ? activeSection : 'Platform Overview'}
               </h2>
               <p className="text-gray-500 font-medium">
                 {activeSection 
                   ? `Manage and monitor all ${activeSection.toLowerCase()}` 
                   : 'Monitor system events, organizations, and lifecycle approvals.'}
               </p>
             </div>
             <button onClick={fetchData} className="h-10 px-5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-md flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
               {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Data"}
             </button>
          </div>

          {!activeSection && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {sections.map((section) => {
                const Icon = section.icon;
                const count = section.key !== null && stats ? stats[section.key] : null;

                return (
                <div
                  key={section.name}
                  onClick={() => {
                    const next = section.name;
                    setActiveSection(next);
                    window.history.pushState({}, "", sectionNameToPath(next));
                  }}
                  className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:translate-x-2 duration-500 pointer-events-none">
                     <Icon className="h-24 w-24" />
                  </div>
                  <div className="flex items-start justify-between mb-4 relative z-10">
                     <div className="h-12 w-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                       <Icon className="h-6 w-6" />
                     </div>
                     {statsLoading ? (
                       <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
                     ) : count !== null ? (
                       <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                         {count}
                       </span>
                     ) : null}
                  </div>
                  <div className="relative z-10">
                     <h3 className="text-lg font-bold text-gray-900 mb-1">{section.name}</h3>
                     <p className="text-gray-500 text-sm">Click to manage</p>
                  </div>
                </div>
                );
              })}
            </section>
          )}

        {/* Pending Requests Section */}
        {(!activeSection || activeSection === "Pending Leads") && (
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
           <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Project Demo Requests</h3>
                <p className="text-sm text-gray-500 mt-1">Review and approve workspace access for new leads.</p>
              </div>
              <span className="bg-white border border-gray-100 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                {requests.filter(r => r.status === "SUBMITTED").length} Pending
              </span>
           </div>
           
           <div className="overflow-x-auto">
              {requestsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                   <Loader2 className="h-10 w-10 animate-spin" />
                   <p className="font-medium">Loading requests...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                   <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center">
                      <UserCheck className="h-8 w-8" />
                   </div>
                   <p className="font-medium text-lg">No requests found</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-gray-50/30">
                         <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                         <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Type / Organization</th>
                         <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                         <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {requests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {(request.requestedBy?.name || 'U').charAt(0)}
                                 </div>
                                 <div>
                                    <p className="font-bold text-gray-900">{request.requestedBy?.name || 'Unknown User'}</p>
                                    <p className="text-xs text-gray-500">{request.requestedBy?.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                                 {request.type}
                              </div>
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                 <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                 {request.organization?.name || 'Personal Workspace'}
                              </p>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                 request.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" :
                                 request.status === "REJECTED" ? "bg-red-50 text-red-700" :
                                 "bg-amber-50 text-amber-700"
                              }`}>
                                 <div className={`h-1.5 w-1.5 rounded-full ${
                                    request.status === "APPROVED" ? "bg-emerald-500" :
                                    request.status === "REJECTED" ? "bg-red-500" :
                                    "bg-amber-500 animate-pulse"
                                 }`} />
                                 {request.status}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              {request.status === "SUBMITTED" ? (
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                     onClick={() => handleUpdateStatus(request.id, "REJECTED")}
                                     className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all"
                                   >
                                      <XCircle className="h-5 w-5" />
                                   </button>
                                   <button 
                                     onClick={() => handleUpdateStatus(request.id, "APPROVED")}
                                     className="h-9 px-4 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
                                   >
                                      <CheckCircle2 className="h-4 w-4" />
                                      Approve
                                   </button>
                                </div>
                              ) : (
                                <button className="h-9 px-4 rounded-xl border border-gray-100 text-gray-400 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 ml-auto">
                                   <ExternalLink className="h-4 w-4" />
                                   View Project
                                </button>
                              )}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              )}
           </div>
        </section>
        )}

        {/* Organizations */}
        {activeSection === "Organizations" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Organizations</h3>
                <p className="text-sm text-gray-500 mt-1">All tenant organizations.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading organizations...</p>
                </div>
              ) : organizations.length === 0 ? (
                <p className="text-gray-500">No organizations found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {organizations.map((org) => (
                      <tr key={org.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{org.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{org.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{org.planId ?? "—"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Users */}
        {activeSection === "Users" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Users</h3>
                <p className="text-sm text-gray-500 mt-1">Supabase profiles and lifecycle status.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{u.name ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{u.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Projects */}
        {activeSection === "Projects" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Projects</h3>
                <p className="text-sm text-gray-500 mt-1">Workspace projects for the selected organization.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <p className="text-gray-500">No projects found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Milestones */}
        {activeSection === "Milestones" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Milestones</h3>
                <p className="text-sm text-gray-500 mt-1">Delivery milestones for projects.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading milestones...</p>
                </div>
              ) : milestones.length === 0 ? (
                <p className="text-gray-500">No milestones found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Due</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {milestones.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{m.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={m.status}
                              onChange={(e) => updateMilestoneStatus(String(m.id), e.target.value)}
                              className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            >
                              {["PLANNED", "IN_PROGRESS", "READY_FOR_REVIEW", "SCHEDULED"].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{m.dueDate ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteMilestone(String(m.id))}
                            className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Tasks */}
        {activeSection === "Tasks" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tasks</h3>
                <p className="text-sm text-gray-500 mt-1">Create tasks for clients and track completion.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto space-y-5">
              <div className="rounded-xl border border-gray-100 bg-white px-4 py-4">
                <h4 className="text-sm font-bold text-gray-900">Create Task</h4>
                <div className="mt-3 space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Project</span>
                    <select
                      value={taskCreateProjectId}
                      onChange={(e) => setTaskCreateProjectId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      disabled={projects.length === 0}
                    >
                      <option value="">Select a project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Title</span>
                    <input
                      value={taskCreateTitle}
                      onChange={(e) => setTaskCreateTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Task title"
                    />
                  </label>

                  <button
                    onClick={createTask}
                    disabled={!activeOrgId || !taskCreateTitle.trim() || !taskCreateProjectId.trim()}
                    className="group relative inline-flex items-center justify-center gap-3 h-10 px-6 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>

              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <p className="text-gray-500">No tasks found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tasks.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{t.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={t.status}
                            onChange={(e) => updateTaskStatus(String(t.id), e.target.value)}
                            className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {["PENDING", "IN_PROGRESS", "DONE"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteTask(String(t.id))}
                            className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Deployments */}
        {activeSection === "Deployments" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Deployments</h3>
                <p className="text-sm text-gray-500 mt-1">Track deployment progress per workspace.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto space-y-5">
              <div className="rounded-xl border border-gray-100 bg-white px-4 py-4">
                <h4 className="text-sm font-bold text-gray-900">Create Deployment</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <input
                      value={deploymentCreateName}
                      onChange={(e) => setDeploymentCreateName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Deployment name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Environment</span>
                    <input
                      value={deploymentCreateEnvironment}
                      onChange={(e) => setDeploymentCreateEnvironment(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="staging/production"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">Project (optional)</span>
                    <select
                      value={deploymentCreateProjectId}
                      onChange={(e) => setDeploymentCreateProjectId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">No project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="md:col-span-2">
                    <button
                      onClick={createDeployment}
                      disabled={!activeOrgId || !deploymentCreateName.trim()}
                      className="group relative inline-flex items-center justify-center gap-3 h-10 px-6 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>

              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading deployments...</p>
                </div>
              ) : deployments.length === 0 ? (
                <p className="text-gray-500">No deployments found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Environment</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {deployments.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{d.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{d.environment ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={d.status}
                            onChange={(e) => updateDeploymentStatus(String(d.id), e.target.value)}
                            className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {["SUCCESS", "IN_PROGRESS", "FAILED"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteDeployment(String(d.id))}
                            className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Integrations */}
        {activeSection === "Integrations" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Integrations</h3>
                <p className="text-sm text-gray-500 mt-1">Connect external providers to your workspace.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto space-y-5">
              <div className="rounded-xl border border-gray-100 bg-white px-4 py-4">
                <h4 className="text-sm font-bold text-gray-900">Create Integration</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Provider</span>
                    <input
                      value={integrationCreateProvider}
                      onChange={(e) => setIntegrationCreateProvider(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="github"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <input
                      value={integrationCreateName}
                      onChange={(e) => setIntegrationCreateName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Integration name"
                    />
                  </label>
                  <div className="md:col-span-2">
                    <button
                      onClick={createIntegration}
                      disabled={!activeOrgId || !integrationCreateName.trim()}
                      className="group relative inline-flex items-center justify-center gap-3 h-10 px-6 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>

              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading integrations...</p>
                </div>
              ) : integrations.length === 0 ? (
                <p className="text-gray-500">No integrations found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Provider</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {integrations.map((i) => (
                      <tr key={i.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{i.provider}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{i.name ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={i.status}
                            onChange={(e) => updateIntegrationStatus(String(i.id), e.target.value)}
                            className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {["ACTIVE", "INACTIVE", "PAUSED"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteIntegration(String(i.id))}
                            className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Webhooks */}
        {activeSection === "Webhooks" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Webhooks</h3>
                <p className="text-sm text-gray-500 mt-1">Configure callback endpoints for integrations.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto space-y-5">
              <div className="rounded-xl border border-gray-100 bg-white px-4 py-4">
                <h4 className="text-sm font-bold text-gray-900">Create Webhook</h4>
                <div className="mt-3 space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Integration</span>
                    <select
                      value={webhookCreateIntegrationId}
                      onChange={(e) => setWebhookCreateIntegrationId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      disabled={integrations.length === 0}
                    >
                      <option value="">Select an integration</option>
                      {integrations.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.provider} {i.name ? `- ${i.name}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">URL</span>
                    <input
                      value={webhookCreateUrl}
                      onChange={(e) => setWebhookCreateUrl(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="https://example.com/webhook"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Secret (optional)</span>
                    <input
                      value={webhookCreateSecret}
                      onChange={(e) => setWebhookCreateSecret(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="shared secret"
                    />
                  </label>

                  <button
                    onClick={createWebhook}
                    disabled={!activeOrgId || !webhookCreateIntegrationId.trim() || !webhookCreateUrl.trim()}
                    className="group relative inline-flex items-center justify-center gap-3 h-10 px-6 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>

              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading webhooks...</p>
                </div>
              ) : webhooks.length === 0 ? (
                <p className="text-gray-500">No webhooks found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">URL</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Integration</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {webhooks.map((w) => (
                      <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{w.url}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {w.integration?.provider ?? "—"} {w.integration?.name ? `- ${w.integration.name}` : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const newUrl = window.prompt("Webhook URL", w.url) ?? w.url;
                                const newSecret = window.prompt("Webhook secret (optional)", w.secret ?? "") ?? (w.secret ?? "");
                                updateWebhook(String(w.id), { url: newUrl, secret: newSecret || null });
                              }}
                              className="h-9 px-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteWebhook(String(w.id))}
                              className="h-9 px-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Tickets */}
        {activeSection === "Tickets" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tickets</h3>
                <p className="text-sm text-gray-500 mt-1">Support tickets across projects.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <p className="text-gray-500">No tickets found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">{t.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={t.status}
                            onChange={(e) => updateTicketStatus(String(t.id), e.target.value)}
                            className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteTicket(String(t.id))}
                            className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Files */}
        {activeSection === "Files" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Files</h3>
                <p className="text-sm text-gray-500 mt-1">Uploaded files with metadata.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto space-y-5">
              <div className="rounded-xl border border-gray-100 bg-white px-4 py-4">
                <h4 className="text-sm font-bold text-gray-900">Upload File</h4>
                <div className="mt-3 space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Project (optional)</span>
                    <select
                      value={fileUploadProjectId}
                      onChange={(e) => setFileUploadProjectId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">No project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">File</span>
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setFileUploadFile(f);
                        setFileUploadName(f?.name ?? "");
                        setFileUploadType(f?.type ?? "");
                      }}
                      className="mt-1 w-full"
                    />
                  </label>

                  <button
                    onClick={uploadFileAdmin}
                    disabled={!activeOrgId || !fileUploadFile || isFileUploading}
                    className="group relative inline-flex items-center justify-center gap-3 h-10 px-6 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                  >
                    {isFileUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>

              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading files...</p>
                </div>
              ) : files.length === 0 ? (
                <p className="text-gray-500">No files found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">File</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {files.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {String(f.fileUrl ?? "").split("/").pop() || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{f.fileType ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const next = window.prompt("File type (e.g. text/plain)", String(f.fileType ?? "")) ?? null;
                                if (next === null) return;
                                updateFileType(String(f.id), next);
                              }}
                              className="h-9 px-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteFileAdmin(String(f.id))}
                              className="h-9 px-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Billing */}
        {activeSection === "Billing" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Billing</h3>
                <p className="text-sm text-gray-500 mt-1">Subscriptions (and related invoices/payments).</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading billing...</p>
                </div>
              ) : subscriptions.length === 0 ? (
                <p className="text-gray-500">No subscriptions found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Organization</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{sub.organization?.name ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{sub.planName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{sub.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Activity Logs */}
        {activeSection === "Activity Logs" && (
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Activity Logs</h3>
                <p className="text-sm text-gray-500 mt-1">Most recent organization/user actions.</p>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              {statsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Loading activity logs...</p>
                </div>
              ) : activityLogs.length === 0 ? (
                <p className="text-gray-500">No activity logs found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Entity</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Organization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{log.action}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {log.entityType}:{log.entityId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {log.user?.email ?? "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {log.organization?.name ?? "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>
      </div>
    </div>
  );
}