import type { Route } from "./+types/dashboard";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarClock,
  CreditCard,
  Files,
  FolderKanban,
  ListTodo,
  Loader2,
  Lock,
  LogOut,
  Rocket,
  Settings,
  Ticket,
} from "lucide-react";
import { createSupabaseBrowserClient } from "../utils/supabase";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

type ListItem = {
  id: string | number;
  title: string;
  status: string;
};

type MilestoneItem = ListItem & {
  progress: number;
  dueDate: string;
};

function SettingsPanel({
  accessToken,
  apiBaseUrl,
  userName,
  onSaved,
}: {
  accessToken: string | null;
  apiBaseUrl: string;
  userName: string;
  onSaved: (nextName: string) => void;
}) {
  const [draft, setDraft] = useState(userName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(userName);
  }, [userName]);

  async function handleSave() {
    if (!accessToken) {
      setError("Missing auth token");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: draft }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({} as any))) as any;
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as any;
      const nextName = json?.data?.name ?? draft;
      onSaved(nextName || draft);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">Profile</p>
        <p className="mt-1 text-xs text-gray-500">Update your display name.</p>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Name</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Your name"
        />
      </label>

      {error && (
        <p className="text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="group relative inline-flex items-center justify-center gap-3 h-12 px-8 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as any;
  return {
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    apiBaseUrl: env.API_BASE_URL || "http://localhost:8787",
  } satisfies LoaderData;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "futurexa.ai | Customer Dashboard" },
    {
      name: "description",
      content:
        "Customer dashboard for projects, milestones, tasks, tickets, files, deployments, and billing.",
    },
  ];
}

const sideNav = [
  { key: "overview", label: "Overview", icon: FolderKanban },
  { key: "milestones", label: "Milestones", icon: CalendarClock },
  { key: "tasks", label: "Tasks", icon: ListTodo },
  { key: "tickets", label: "Tickets", icon: Ticket },
  { key: "files", label: "Files", icon: Files },
  { key: "deployments", label: "Deployments", icon: Rocket },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "activity", label: "Activity", icon: Activity },
  { key: "settings", label: "Settings", icon: Settings },
];

function navKeyToPath(key: string): string {
  switch (key) {
    case "overview":
      return "/dashboard";
    case "milestones":
      return "/dashboard/milestones";
    case "tasks":
      return "/dashboard/tasks";
    case "tickets":
      return "/dashboard/ticket";
    case "files":
      return "/dashboard/files";
    case "deployments":
      return "/dashboard/deployments";
    case "billing":
      return "/dashboard/billing";
    case "activity":
      return "/dashboard/activity";
    case "settings":
      return "/dashboard/settings";
    default:
      return "/dashboard";
  }
}

function pathToNavKey(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  const parts = trimmed.split("/");
  const last = parts[parts.length - 1];

  if (last === "dashboard" || parts.length === 1) return "overview";
  if (last === "ticket") return "tickets";
  if (last === "project") return "overview";
  if (last === "milestones") return "milestones";
  if (last === "tasks") return "tasks";
  if (last === "files") return "files";
  if (last === "deployments") return "deployments";
  if (last === "billing") return "billing";
  if (last === "activity") return "activity";
  if (last === "settings") return "settings";
  return "overview";
}

const projectList: ListItem[] = [
  { id: 1, title: "Futurexa Platform Launch", status: "IN_PROGRESS" },
  { id: 2, title: "Client Web Revamp", status: "ON_TRACK" },
  { id: 3, title: "Design System Rollout", status: "PLANNED" },
];

const milestoneList: MilestoneItem[] = [
  {
    id: 1,
    title: "UX Approval",
    status: "READY_FOR_REVIEW",
    progress: 90,
    dueDate: "Apr 05, 2026",
  },
  {
    id: 2,
    title: "Sprint Delivery",
    status: "IN_PROGRESS",
    progress: 68,
    dueDate: "Apr 12, 2026",
  },
  {
    id: 3,
    title: "QA Validation",
    status: "SCHEDULED",
    progress: 35,
    dueDate: "Apr 19, 2026",
  },
];

const taskList: ListItem[] = [
  { id: 1, title: "Finalize auth flows", status: "DONE" },
  { id: 2, title: "Connect dashboard data", status: "IN_PROGRESS" },
  { id: 3, title: "Review responsive layout", status: "PENDING" },
];

const ticketList: ListItem[] = [
  { id: 1, title: "Billing module clarification", status: "OPEN" },
  { id: 2, title: "Update user role labels", status: "IN_REVIEW" },
];

const fileList: ListItem[] = [
  { id: 1, title: "Design Brief v2.pdf", status: "UPLOADED" },
  { id: 2, title: "Sprint Plan.docx", status: "UPDATED" },
];

const deploymentList: ListItem[] = [
  { id: 1, title: "Production Deployment #142", status: "SUCCESS" },
  { id: 2, title: "Staging Deployment #417", status: "SUCCESS" },
];

export default function Dashboard(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const location = useLocation();

  const supabase = useMemo(() => {
    return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
  }, [supabaseUrl, supabaseAnonKey]);

  const [userName, setUserName] = useState("Client");
  const [userStatus, setUserStatus] = useState<string>("NEW_USER");
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [liveProjects, setLiveProjects] = useState<ListItem[]>([]);
  const [liveMilestones, setLiveMilestones] = useState<MilestoneItem[]>([]);
  const [liveTickets, setLiveTickets] = useState<ListItem[]>([]);
  const [liveTasks, setLiveTasks] = useState<ListItem[]>([]);
  const [liveFiles, setLiveFiles] = useState<ListItem[]>([]);
  const [liveDeployments, setLiveDeployments] = useState<ListItem[]>([]);
  const [liveSubscriptions, setLiveSubscriptions] = useState<ListItem[]>([]);
  const [liveActivity, setLiveActivity] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeNavKey, setActiveNavKey] = useState("overview");

  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Lightweight CRUD state (tasks, tickets, files)
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<string | null>(null);
  const [taskComments, setTaskComments] = useState<Record<string, string>>({});
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketProjectId, setTicketProjectId] = useState<string | null>(null);
  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});
  const [fileProjectId, setFileProjectId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchDashboardData = async (orgId: string, accessToken: string) => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": orgId };
      const [
        pRes,
        mRes,
        tRes,
        tasksRes,
        filesRes,
        deploymentsRes,
        billingRes,
        activityRes,
      ] = await Promise.all([
        fetch(`${apiBaseUrl}/api/projects`, { headers }),
        fetch(`${apiBaseUrl}/api/milestones`, { headers }),
        fetch(`${apiBaseUrl}/api/tickets`, { headers }),
        fetch(`${apiBaseUrl}/api/tasks`, { headers }),
        fetch(`${apiBaseUrl}/api/files`, { headers }),
        fetch(`${apiBaseUrl}/api/deployments`, { headers }),
        fetch(`${apiBaseUrl}/api/billing/subscriptions`, { headers }),
        fetch(`${apiBaseUrl}/api/activity-logs`, { headers }),
      ]);

      if (pRes.ok) {
        const json = (await pRes.json()) as any;
        const data = json?.data ?? [];
        setLiveProjects(data.map((p: any) => ({ id: p.id, title: p.name, status: p.status || "ACTIVE" })));
      }
      if (mRes.ok) {
        const json = (await mRes.json()) as any;
        const data = json?.data ?? [];
        setLiveMilestones(
          data.map((m: any) => {
            const status = m.status || "PENDING";
            const progress =
              status === "IN_PROGRESS" ? 70 : status === "READY_FOR_REVIEW" ? 90 : status === "SCHEDULED" ? 35 : 0;
            return {
              id: m.id,
              title: m.title || m.name,
              status,
              progress,
              dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "",
            };
          })
        );
      }
      if (tRes.ok) {
        const json = (await tRes.json()) as any;
        const data = json?.data ?? [];
        setLiveTickets(data.map((t: any) => ({ id: t.id, title: t.title || t.name, status: t.status || "OPEN" })));
      }
      if (tasksRes.ok) {
        const json = (await tasksRes.json()) as any;
        const data = json?.data ?? [];
        setLiveTasks(data.map((task: any) => ({ id: task.id, title: task.title, status: task.status || "PENDING" })));
      }
      if (filesRes.ok) {
        const json = (await filesRes.json()) as any;
        const data = json?.data ?? [];
        setLiveFiles(
          data.map((f: any) => {
            const parts = String(f.fileUrl ?? "").split("/");
            const title = parts.length > 0 ? parts[parts.length - 1] : f.fileType || "file";
            return { id: f.id, title, status: f.fileType || "FILE" };
          })
        );
      }
      if (deploymentsRes.ok) {
        const json = (await deploymentsRes.json()) as any;
        const data = json?.data ?? [];
        setLiveDeployments(data.map((d: any) => ({ id: d.id, title: d.name, status: d.status || "SUCCESS" })));
      }
      if (billingRes.ok) {
        const json = (await billingRes.json()) as any;
        const data = json?.data ?? [];
        setLiveSubscriptions(data.map((s: any) => ({ id: s.id, title: s.planName, status: s.status || "ACTIVE" })));
      }
      if (activityRes.ok) {
        const json = (await activityRes.json()) as any;
        const data = json?.data ?? [];
        setLiveActivity(
          data.map((a: any) => ({
            id: a.id,
            title: a.action,
            status: `${a.entityType ?? "entity"}:${a.entityId ?? ""}`.trim() || "ACTIVITY",
          }))
        );
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    }
  };

  useEffect(() => {
    setActiveNavKey(pathToNavKey(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      setErrorMessage("");
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      const user = data.session?.user;
      if (!user) {
        navigate("/signin", { replace: true });
        return;
      }

      const fallbackName = user.email?.split("@")[0] ?? "Client";
      const fullName = user.user_metadata?.full_name as string | undefined;

      if (!cancelled) {
        setUserName(fullName || fallbackName);
        
        try {
          const res = await fetch(`${apiBaseUrl}/api/me`, {
            headers: {
              Authorization: `Bearer ${data.session?.access_token}`,
            },
          });
          if (res.ok) {
            const profile = (await res.json()) as any;
            setUserName(profile.name || fullName || fallbackName);
            setUserStatus(profile.status || "NEW_USER");
            setOrganizationId(profile.organizationId);
            setAccessToken(data.session?.access_token ?? null);

            if (profile.status === "ACTIVE_CLIENT" && profile.organizationId && data.session?.access_token) {
              fetchDashboardData(profile.organizationId, data.session.access_token);
            }
          }
        } catch (e) {
          console.error("Failed to fetch user status", e);
        }

        setIsLoading(false);
      }
    }

    checkAuth().catch((error: unknown) => {
      if (!cancelled) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load dashboard"
        );
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [navigate, supabase]);

  useEffect(() => {
    const firstProjectId = liveProjects[0]?.id ? String(liveProjects[0].id) : null;
    if (!firstProjectId) return;
    setTaskProjectId((prev) => prev ?? firstProjectId);
    setTicketProjectId((prev) => prev ?? firstProjectId);
    setFileProjectId((prev) => prev ?? firstProjectId);
  }, [liveProjects]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/signin", { replace: true });
  }

  async function handleRequestProject() {
    setIsRequesting(true);
    setRequestError(null);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      const res = await fetch(`${apiBaseUrl}/api/lead-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          type: "PROJECT",
          description: "Requesting access to client dashboard from premium web app",
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({} as any))) as any;
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      setUserStatus("LEAD");
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setIsRequesting(false);
    }
  }

  async function refreshWorkspaceData() {
    if (!organizationId || !accessToken) return;
    await fetchDashboardData(organizationId, accessToken);
  }

  async function handleCreateTask() {
    if (!accessToken || !organizationId) return;
    if (!taskProjectId) {
      setErrorMessage("Select a project to create a task.");
      return;
    }
    const title = taskTitle.trim();
    if (!title) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({ projectId: taskProjectId, title }),
      });
      if (!res.ok)
        throw new Error(
          ((await res.json().catch(() => ({} as any))) as any).error || `HTTP ${res.status}`
        );
      setTaskTitle("");
      await refreshWorkspaceData();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to create task");
    }
  }

  async function handleUpdateTaskStatus(taskId: string | number, status: string, comment?: string) {
    if (!accessToken || !organizationId) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks/${encodeURIComponent(String(taskId))}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({
          status,
          description: comment?.trim() ? comment.trim() : undefined,
        }),
      });
      if (!res.ok)
        throw new Error(
          ((await res.json().catch(() => ({} as any))) as any).error || `HTTP ${res.status}`
        );
      await refreshWorkspaceData();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to update task");
    }
  }

  async function handleDeleteTask(taskId: string | number) {
    if (!accessToken || !organizationId) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks/${encodeURIComponent(String(taskId))}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
      });
      if (!res.ok)
        throw new Error(
          ((await res.json().catch(() => ({} as any))) as any).error || `HTTP ${res.status}`
        );
      await refreshWorkspaceData();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to delete task");
    }
  }

  async function handleCreateTicket() {
    if (!accessToken || !organizationId) return;
    if (!ticketProjectId) {
      setErrorMessage("Select a project to create a ticket.");
      return;
    }
    const title = ticketTitle.trim();
    if (!title) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({ projectId: ticketProjectId, title }),
      });
      if (!res.ok)
        throw new Error(
          ((await res.json().catch(() => ({} as any))) as any).error || `HTTP ${res.status}`
        );
      setTicketTitle("");
      await refreshWorkspaceData();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to create ticket");
    }
  }

  async function handleUpdateTicketStatus(ticketId: string | number, status: string, reply?: string) {
    if (!accessToken || !organizationId) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/tickets/${encodeURIComponent(String(ticketId))}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({
          status,
          description: reply?.trim() ? reply.trim() : undefined,
        }),
      });
      if (!res.ok)
        throw new Error(
          ((await res.json().catch(() => ({} as any))) as any).error || `HTTP ${res.status}`
        );
      await refreshWorkspaceData();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to update ticket");
    }
  }

  async function handleDeleteTicket(ticketId: string | number) {
    if (!accessToken || !organizationId) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/tickets/${encodeURIComponent(String(ticketId))}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
      });
      if (!res.ok)
        throw new Error(
          ((await res.json().catch(() => ({} as any))) as any).error || `HTTP ${res.status}`
        );
      await refreshWorkspaceData();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to delete ticket");
    }
  }

  async function handleUploadFile() {
    if (!accessToken || !organizationId) return;
    if (!uploadFile) {
      setUploadError("Choose a file first.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", uploadFile);
      form.append("fileName", uploadFile.name);
      form.append("fileType", uploadFile.type || "");
      if (fileProjectId) form.append("projectId", fileProjectId);

      const res = await fetch(`${apiBaseUrl}/api/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
        body: form,
      });

      if (!res.ok)
        throw new Error(
          ((await res.json().catch(() => ({} as any))) as any).error || `HTTP ${res.status}`
        );
      setUploadFile(null);
      await refreshWorkspaceData();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "File upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteFile(fileId: string | number) {
    if (!accessToken || !organizationId) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/files/${encodeURIComponent(String(fileId))}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
      });
      if (!res.ok)
        throw new Error(
          ((await res.json().catch(() => ({} as any))) as any).error || `HTTP ${res.status}`
        );
      await refreshWorkspaceData();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Failed to delete file");
    }
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  const genericItemsBySection: Record<string, ListItem[]> = {
    overview: liveProjects,
    milestones: liveMilestones,
    tasks: liveTasks,
    tickets: liveTickets,
    files: liveFiles,
    deployments: liveDeployments,
    billing: liveSubscriptions,
    activity: liveActivity,
    settings: [],
  };

  const selectedItems = genericItemsBySection[activeNavKey] ?? [];

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-4 text-sm font-semibold text-gray-700 shadow-sm">
          Loading your dashboard...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-[780px] w-[780px] rounded-full bg-blue-100/50 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[620px] w-[620px] rounded-full bg-purple-100/40 blur-[110px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-56">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-600/30">
              F
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Customer Dashboard
              </p>
              <p className="text-lg font-bold tracking-tight">futurexa.ai</p>
            </div>
          </div>

          <div className="hidden w-[28rem] items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-2.5 shadow-sm md:flex">
            <p className="text-sm font-medium text-gray-500">
              Unified workspace overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <button
              onClick={signOut}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 pl-2">
              <div className="hidden flex-col items-end sm:flex">
                <p className="text-xs font-bold text-gray-900">{userName}</p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">
                  Verified Account
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 shadow-sm ring-1 ring-gray-100">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-10 pt-6 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-blue-100/20 backdrop-blur-xl lg:h-[calc(100vh-8.2rem)] lg:sticky lg:top-24">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Navigation
            </p>
            <h2 className="text-base font-bold text-gray-900">My Workspace</h2>
          </div>
          <nav className="space-y-1.5">
            {sideNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === activeNavKey;
              const isLocked = userStatus !== "ACTIVE_CLIENT";

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (isLocked) return;
                    navigate(navKeyToPath(item.key));
                  }}
                  disabled={isLocked}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : isLocked 
                        ? "text-gray-400 opacity-60 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {isLocked && <Lock className="h-3 w-3 ml-auto text-gray-300" />}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-2"
          >
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {getGreeting()},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {userName}
              </span>
            </h1>
            <div className="mt-1 flex items-center gap-3">
              <p className="text-gray-500 font-medium">
                Here&apos;s what&apos;s happening in your workspace today.
              </p>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${userStatus === "ACTIVE_CLIENT" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {userStatus.replace("_", " ")}
              </span>
            </div>
          </motion.section>

          {userStatus !== "ACTIVE_CLIENT" ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-12 text-center shadow-2xl shadow-blue-100/30 backdrop-blur-2xl max-w-3xl mx-auto mt-12"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
              
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50/50 shadow-inner">
                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-blue-100">
                   <Lock className="h-8 w-8 text-blue-600" />
                 </div>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Workspace Restricted</h2>
              <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                Your account is currently pending activation. Request a project demo to unlock your full dashboard workspace.
              </p>

              {requestError && (
                <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold flex items-center gap-3 justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {requestError}
                </div>
              )}

              <button
                onClick={handleRequestProject}
                disabled={isRequesting || userStatus === "LEAD"}
                className="group relative inline-flex items-center gap-3 h-16 px-10 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isRequesting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : userStatus === "LEAD" ? (
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                ) : (
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                )}
                <span className="text-lg">
                  {userStatus === "LEAD" ? "Request Pending Review" : "Request Project Demo"}
                </span>
              </button>
              
              <div className="mt-12 grid grid-cols-3 gap-6 opacity-40 grayscale">
                 {[Files, Rocket, CreditCard].map((Icon, i) => (
                   <div key={i} className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                   </div>
                 ))}
              </div>
            </motion.div>
          ) : (
            <>
              {activeNavKey === "overview" && (
            <section className="grid gap-4 md:grid-cols-4">
              {[
                {
                  label: "Projects",
                  value: String(liveProjects.length),
                  sub: "Active workspace projects",
                },
                {
                  label: "Milestones",
                  value: String(liveMilestones.length),
                  sub: "Tracked delivery milestones",
                },
                {
                  label: "Tasks",
                  value: String(liveTasks.length),
                  sub: "Current task items",
                },
                {
                  label: "Tickets",
                  value: String(liveTickets.length),
                  sub: "Open support tickets",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-blue-100/20 backdrop-blur-xl"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{item.sub}</p>
                </motion.div>
              ))}
            </section>
          )}

          {activeNavKey === "overview" && (
            <section className="grid gap-6 xl:grid-cols-5">
              <div className="xl:col-span-2 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
                <h3 className="text-lg font-bold">Project Overview</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Live project records from your organization.
                </p>
                <div className="mt-5 space-y-3">
                  {liveProjects.slice(0, 4).map((project) => (
                    <div
                      key={project.id}
                      className="rounded-xl border border-gray-100 bg-white px-4 py-3"
                    >
                      <p className="text-xs font-semibold text-gray-500">
                        Project
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {project.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {project.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="xl:col-span-3 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Upcoming Milestones</h3>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {liveMilestones.length} total
                  </span>
                </div>
                <div className="space-y-3">
                  {liveMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="rounded-xl border border-gray-100 bg-white p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {milestone.title}
                        </p>
                        <span className="text-xs font-semibold text-gray-500">
                          {milestone.status}
                        </span>
                      </div>
                      <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Due: {milestone.dueDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeNavKey === "overview" && (
            <section className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
                <h3 className="mb-4 text-lg font-bold">Tasks</h3>
                <div className="space-y-2">
                  {liveTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-gray-100 bg-white px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {task.title}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {task.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
                <h3 className="mb-4 text-lg font-bold">Tickets & Support</h3>
                <div className="space-y-2">
                  {liveTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="rounded-xl border border-gray-100 bg-white px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {ticket.title}
                        </p>
                        <span className="text-xs font-semibold text-blue-700">
                          {ticket.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Customer support
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
                <h3 className="mb-4 text-lg font-bold">Deployments & Billing</h3>
                <div className="space-y-2">
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Rocket className="h-3.5 w-3.5 text-blue-600" />
                      Deployments
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {liveDeployments.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Files className="h-3.5 w-3.5 text-blue-600" />
                      Files
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {liveFiles.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                      Billing
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {liveSubscriptions.length} subscriptions
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeNavKey !== "overview" && (
            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
              <h3 className="text-lg font-bold capitalize">{activeNavKey}</h3>
              {activeNavKey === "settings" ? (
                <SettingsPanel
                  accessToken={accessToken}
                  apiBaseUrl={apiBaseUrl}
                  userName={userName}
                  onSaved={(nextName) => setUserName(nextName)}
                />
              ) : activeNavKey === "tasks" ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">Create Task</p>
                    <div className="mt-3 space-y-3">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700">Project</span>
                        <select
                          value={taskProjectId ?? ""}
                          onChange={(e) => setTaskProjectId(e.target.value || null)}
                          disabled={liveProjects.length === 0}
                          className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          {liveProjects.map((p) => (
                            <option key={p.id} value={String(p.id)}>
                              {p.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700">Title</span>
                        <input
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          placeholder="Task title"
                        />
                      </label>
                      <button
                        onClick={handleCreateTask}
                        disabled={!taskProjectId || !taskTitle.trim() || !accessToken || !organizationId}
                        className="group relative inline-flex items-center justify-center gap-3 h-12 px-8 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                      >
                        Create
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {liveTasks.map((task) => (
                      <div key={task.id} className="rounded-xl border border-gray-100 bg-white px-4 py-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                          <p className="mt-1 text-xs text-gray-500">{task.status}</p>
                          <textarea
                            rows={2}
                            value={taskComments[String(task.id)] ?? ""}
                            onChange={(e) =>
                              setTaskComments((prev) => ({
                                ...prev,
                                [String(task.id)]: e.target.value,
                              }))
                            }
                            className="mt-2 w-[220px] max-w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Add a completion comment (saved when you change status)"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleUpdateTaskStatus(
                                task.id,
                                e.target.value,
                                taskComments[String(task.id)] ?? ""
                              )
                            }
                            className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {["PENDING", "IN_PROGRESS", "DONE"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                    {liveTasks.length === 0 && (
                      <p className="text-sm text-gray-500">No records available.</p>
                    )}
                  </div>
                </div>
              ) : (
                activeNavKey === "tickets" ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">Create Ticket</p>
                      <div className="mt-3 space-y-3">
                        <label className="block">
                          <span className="text-sm font-medium text-gray-700">Project</span>
                          <select
                            value={ticketProjectId ?? ""}
                            onChange={(e) => setTicketProjectId(e.target.value || null)}
                            disabled={liveProjects.length === 0}
                            className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {liveProjects.map((p) => (
                              <option key={p.id} value={String(p.id)}>
                                {p.title}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-sm font-medium text-gray-700">Title</span>
                          <input
                            value={ticketTitle}
                            onChange={(e) => setTicketTitle(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Ticket title"
                          />
                        </label>
                        <button
                          onClick={handleCreateTicket}
                          disabled={!ticketProjectId || !ticketTitle.trim() || !accessToken || !organizationId}
                          className="group relative inline-flex items-center justify-center gap-3 h-12 px-8 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                        >
                          Create
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {liveTickets.map((ticket) => (
                        <div key={ticket.id} className="rounded-xl border border-gray-100 bg-white px-4 py-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{ticket.title}</p>
                            <p className="mt-1 text-xs text-gray-500">{ticket.status}</p>
                          <textarea
                            rows={2}
                            value={ticketReplies[String(ticket.id)] ?? ""}
                            onChange={(e) =>
                              setTicketReplies((prev) => ({
                                ...prev,
                                [String(ticket.id)]: e.target.value,
                              }))
                            }
                            className="mt-2 w-[220px] max-w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Add a reply (saved when you change status)"
                          />
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={ticket.status}
                              onChange={(e) =>
                                handleUpdateTicketStatus(
                                  ticket.id,
                                  e.target.value,
                                  ticketReplies[String(ticket.id)] ?? ""
                                )
                              }
                              className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            >
                              {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {liveTickets.length === 0 && (
                        <p className="text-sm text-gray-500">No records available.</p>
                      )}
                    </div>
                  </div>
                ) : activeNavKey === "files" ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">Upload File</p>
                      <div className="mt-3 space-y-3">
                        <label className="block">
                          <span className="text-sm font-medium text-gray-700">Project</span>
                          <select
                            value={fileProjectId ?? ""}
                            onChange={(e) => setFileProjectId(e.target.value || null)}
                            disabled={liveProjects.length === 0}
                            className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            {liveProjects.map((p) => (
                              <option key={p.id} value={String(p.id)}>
                                {p.title}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-sm font-medium text-gray-700">File</span>
                          <input
                            type="file"
                            onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                            className="mt-1 w-full"
                          />
                        </label>
                        {uploadError && (
                          <p className="text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                            {uploadError}
                          </p>
                        )}
                        <button
                          onClick={handleUploadFile}
                          disabled={!uploadFile || !accessToken || !organizationId || isUploading}
                          className="group relative inline-flex items-center justify-center gap-3 h-12 px-8 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                        >
                          {isUploading ? "Uploading..." : "Upload"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {liveFiles.map((file) => (
                        <div key={file.id} className="rounded-xl border border-gray-100 bg-white px-4 py-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{file.title}</p>
                            <p className="mt-1 text-xs text-gray-500">{file.status}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      {liveFiles.length === 0 && (
                        <p className="text-sm text-gray-500">No records available.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    {selectedItems.slice(0, 12).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-gray-100 bg-white px-4 py-3"
                      >
                        <p className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{item.status}</p>
                      </div>
                    ))}
                    {selectedItems.length === 0 && (
                      <p className="text-sm text-gray-500">No records available.</p>
                    )}
                  </div>
                )
              )}
            </section>
          )}
        </>
      )}

      {errorMessage && (
            <section className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
              {errorMessage}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
