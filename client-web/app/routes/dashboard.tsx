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
  X,
  Menu,
} from "lucide-react";
import { createSupabaseBrowserClient } from "../utils/supabase";
import SettingsPanel from "../features/settings/components/SettingsPanel";
import OverviewSection from "../features/dashboard/components/OverviewSection";
import TasksPanel from "../features/dashboard/components/TasksPanel";
import TicketsPanel from "../features/dashboard/components/TicketsPanel";
import FilesPanel from "../features/dashboard/components/FilesPanel";
import SelectedItemsPanel from "../features/dashboard/components/SelectedItemsPanel";
import DemoRequestModal from "../features/dashboard/components/DemoRequestModal";
import DemoRequestPage from "../features/dashboard/components/DemoRequestPage";
import LockedState from "../features/dashboard/components/LockedState";
import { resolveApiBaseUrl } from "../utils/api-base";

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

const AUTH_KEY = "futurexa_auth";

function getStoredAuth(): { userName: string; userStatus: string; organizationId: string | null; accessToken: string | null } | null {
  try {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function setStoredAuth(data: { userName: string; userStatus: string; organizationId: string | null; accessToken: string | null }) {
  try {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } catch {}
}

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as any;
  const configuredApiBaseUrl = resolveApiBaseUrl(env);

  return {
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    apiBaseUrl: configuredApiBaseUrl,
  } satisfies LoaderData;
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
  { id: 1, title: "UX Approval", status: "READY_FOR_REVIEW", progress: 90, dueDate: "Apr 05, 2026" },
  { id: 2, title: "Sprint Delivery", status: "IN_PROGRESS", progress: 68, dueDate: "Apr 12, 2026" },
  { id: 3, title: "QA Validation", status: "SCHEDULED", progress: 35, dueDate: "Apr 19, 2026" },
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
  const [userEmail, setUserEmail] = useState("");
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeNavKey, setActiveNavKey] = useState(pathToNavKey(location.pathname));

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);

  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketProjectId, setTicketProjectId] = useState<string | null>(null);
  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});

  const [fileProjectId, setFileProjectId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<string | null>(null);
  const [taskComments, setTaskComments] = useState<Record<string, string>>({});

  useEffect(() => {
    setActiveNavKey(pathToNavKey(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const stored = getStoredAuth();

    let cancelled = false;

    async function checkAuth() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        if (!cancelled) navigate("/signin", { replace: true });
        return;
      }

      const user = data.session.user;
      const token = data.session.access_token;
      const fallbackName = user.email?.split("@")[0] ?? "Client";
      const fullName = user.user_metadata?.full_name as string | undefined;
      const orgId = user.user_metadata?.organization_id as string | undefined;

      if (!cancelled) {
        setUserName(fullName || fallbackName);
        setUserEmail(user.email || "");
        setAccessToken(token);
        if (orgId) setOrganizationId(orgId);
      }

      try {
        const res = await fetch(`${apiBaseUrl}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json() as any;
          if (!cancelled) {
            const newStatus = json?.status ?? "NEW_USER";
            const newOrgId = json?.organizationId || orgId || null;
            setUserStatus(newStatus);
            if (newOrgId) setOrganizationId(newOrgId);

            const authData = { userName: fullName || fallbackName, userStatus: newStatus, organizationId: newOrgId, accessToken: token };
            setStoredAuth(authData);
          }
        }
      } catch (e) {
        console.error("Failed to fetch user status", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    if (stored?.accessToken) {
      setUserName(stored.userName);
      setUserStatus(stored.userStatus);
      setOrganizationId(stored.organizationId);
      setAccessToken(stored.accessToken);
    }

    checkAuth().catch(() => {
      if (!cancelled) navigate("/signin", { replace: true });
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!accessToken || !organizationId) return;

    let cancelled = false;

    async function fetchData() {
      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId as string
        };

        const [pRes, mRes, tRes, ticRes, dRes, fRes, notifRes, sRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/projects`, { headers }),
          fetch(`${apiBaseUrl}/api/milestones`, { headers }),
          fetch(`${apiBaseUrl}/api/tasks`, { headers }),
          fetch(`${apiBaseUrl}/api/tickets`, { headers }),
          fetch(`${apiBaseUrl}/api/deployments`, { headers }),
          fetch(`${apiBaseUrl}/api/files`, { headers }),
          fetch(`${apiBaseUrl}/api/notifications`, { headers }),
          fetch(`${apiBaseUrl}/api/billing/subscriptions`, { headers }),
        ]);

        if (pRes.ok) {
          const json = await pRes.json() as any;
          setLiveProjects((json?.data ?? []).map((p: any) => ({ id: p.id, title: p.name, status: p.status || "ACTIVE" })));
        }

        if (mRes.ok) {
          const json = await mRes.json() as any;
          setLiveMilestones((json?.data ?? []).map((m: any) => {
            const status = m.status || "PENDING";
            const progress = status === "IN_PROGRESS" ? 70 : status === "READY_FOR_REVIEW" ? 90 : status === "SCHEDULED" ? 35 : 0;
            return { id: m.id, title: m.title || m.name, status, progress, dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "" };
          }));
        }

        if (tRes.ok) {
          const json = await tRes.json() as any;
          setLiveTasks((json?.data ?? []).map((t: any) => ({ id: t.id, title: t.title, status: t.status || "PENDING" })));
        }

        if (ticRes.ok) {
          const json = await ticRes.json() as any;
          setLiveTickets((json?.data ?? []).map((t: any) => ({ id: t.id, title: t.title, status: t.status || "OPEN" })));
        }

        if (dRes.ok) {
          const json = await dRes.json() as any;
          setLiveDeployments((json?.data ?? []).map((d: any) => ({ id: d.id, title: d.name, status: d.status || "SUCCESS" })));
        }

        if (fRes.ok) {
          const json = await fRes.json() as any;
          setLiveFiles((json?.data ?? []).map((f: any) => {
            const parts = String(f.fileUrl ?? "").split("/");
            const title = parts.length > 0 ? parts[parts.length - 1] : f.fileType || "file";
            return { id: f.id, title, status: f.fileType || "FILE" };
          }));
        }

        if (notifRes.ok) {
          const json = await notifRes.json() as any;
          const data = json?.data ?? [];
          setNotifications(data);
          setUnreadNotificationsCount(data.filter((n: any) => !n.readAt).length);
        }

        if (sRes.ok) {
          const json = await sRes.json() as any;
          setLiveSubscriptions((json?.data ?? []).map((s: any) => ({ id: s.id, title: s.planName || "Plan", status: s.status || "ACTIVE" })));
        }
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [organizationId, accessToken, apiBaseUrl]);

  const handleLogout = async () => {
    sessionStorage.removeItem(AUTH_KEY);
    await supabase.auth.signOut();
    navigate("/signin", { replace: true });
  };

  const handleCreateTask = async () => {
    if (!taskProjectId || !taskTitle.trim() || !accessToken || !organizationId) return;
    if (userStatus !== "ACTIVE_CLIENT") {
      alert("Only active clients can create tasks");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId as string,
        },
        body: JSON.stringify({ projectId: taskProjectId, title: taskTitle }),
      });

      if (res.ok) {
        setTaskTitle("");
        setTaskProjectId(null);
        const { data } = await fetch(`${apiBaseUrl}/api/tasks`, {
          headers: { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId as string },
        }).then(r => r.json()) as { data: any };
        setLiveTasks((data?.data ?? []).map((t: any) => ({ id: t.id, title: t.title, status: t.status || "PENDING" })));
      }
    } catch (e) {
      console.error("Failed to create task", e);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string | number, status: string, _comment?: string) => {
    if (!accessToken || !organizationId) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks/${encodeURIComponent(String(taskId))}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId as string,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setLiveTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status } : t))
        );
      }
    } catch (e) {
      console.error("Failed to update task", e);
    }
  };

  const handleDeleteTask = async (taskId: string | number) => {
    if (!accessToken || !organizationId) return;
    if (!confirm("Delete this task?")) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks/${encodeURIComponent(String(taskId))}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId as string,
        },
      });

      if (res.ok) {
        setLiveTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketProjectId || !ticketTitle.trim() || !accessToken || !organizationId) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId as string,
        },
        body: JSON.stringify({ projectId: ticketProjectId, title: ticketTitle }),
      });

      if (res.ok) {
        setTicketTitle("");
        setTicketProjectId(null);
        const { data } = await fetch(`${apiBaseUrl}/api/tickets`, {
          headers: { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId as string },
        }).then(r => r.json()) as { data: any };
        setLiveTickets((data?.data ?? []).map((t: any) => ({ id: t.id, title: t.title, status: t.status || "OPEN" })));
      }
    } catch (e) {
      console.error("Failed to create ticket", e);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string | number, status: string, _comment?: string) => {
    if (!accessToken || !organizationId) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/tickets/${encodeURIComponent(String(ticketId))}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId as string,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setLiveTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
        );
      }
    } catch (e) {
      console.error("Failed to update ticket", e);
    }
  };

  const handleDeleteTicket = async (ticketId: string | number) => {
    if (!accessToken || !organizationId) return;
    if (!confirm("Delete this ticket?")) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/tickets/${encodeURIComponent(String(ticketId))}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId as string,
        },
      });

      if (res.ok) {
        setLiveTickets((prev) => prev.filter((t) => t.id !== ticketId));
      }
    } catch (e) {
      console.error("Failed to delete ticket", e);
    }
  };

  const handleUploadFile = async () => {
    if (!fileProjectId || !uploadFile || !accessToken || !organizationId) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("projectId", fileProjectId);

    try {
      const res = await fetch(`${apiBaseUrl}/api/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId as string,
        },
        body: formData,
      });

      if (res.ok) {
        setUploadFile(null);
        setFileProjectId(null);
        const { data } = await fetch(`${apiBaseUrl}/api/files`, {
          headers: { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId as string },
        }).then(r => r.json()) as { data: any };
        setLiveFiles((data?.data ?? []).map((f: any) => {
          const parts = String(f.fileUrl ?? "").split("/");
          const title = parts.length > 0 ? parts[parts.length - 1] : f.fileType || "file";
          return { id: f.id, title, status: f.fileType || "FILE" };
        }));
      } else {
        const json = await res.json() as any;
        setUploadError(json?.error || "Upload failed");
      }
    } catch (e) {
      console.error("Failed to upload file", e);
      setUploadError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string | number) => {
    if (!accessToken || !organizationId) return;
    if (!confirm("Delete this file?")) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/files/${encodeURIComponent(String(fileId))}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
      });

      if (res.ok) {
        setLiveFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    } catch (e) {
      console.error("Failed to delete file", e);
    }
  };

  const navItems = [
    { key: "overview", label: "Overview", icon: FolderKanban, path: "/dashboard" },
    { key: "milestones", label: "Milestones", icon: CalendarClock, path: "/dashboard/milestones", requiresActive: true },
    { key: "tasks", label: "Tasks", icon: ListTodo, path: "/dashboard/tasks", requiresActive: true },
    { key: "tickets", label: "Tickets", icon: Ticket, path: "/dashboard/ticket", requiresActive: true },
    { key: "files", label: "Files", icon: Files, path: "/dashboard/files", requiresActive: true },
    { key: "deployments", label: "Deployments", icon: Rocket, path: "/dashboard/deployments", requiresActive: true },
    { key: "billing", label: "Billing", icon: CreditCard, path: "/dashboard/billing", requiresActive: true },
    { key: "activity", label: "Activity", icon: Activity, path: "/dashboard/activity", requiresActive: true },
    { key: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings", requiresActive: true },
  ];

  const isActive = userStatus === "ACTIVE_CLIENT" || userStatus === "PENDING_CLIENT";

  const handleNavClick = (item: typeof navItems[0]) => {
    if (!isActive && item.requiresActive) {
      // If already a LEAD (submitted request), don't re-open the modal
      if (userStatus === "LEAD") return;
      setShowRequestModal(true);
      return;
    }
    setActiveNavKey(item.key);
    setIsMobileMenuOpen(false);
    navigate(item.path);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="flex h-[100dvh] flex-col md:flex-row bg-gray-50 overflow-hidden">
      
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between border-b border-gray-100 bg-white p-4 shrink-0 shadow-sm z-30 relative">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 text-white font-bold text-sm">F</div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{userName}</p>
            <p className="text-[10px] text-gray-500 leading-tight">{userStatus}</p>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-50 rounded-lg active:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-100 bg-white p-4 transition-transform duration-300 ease-out md:relative md:translate-x-0 flex flex-col ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white font-bold">F</div>
            <div className="hidden md:block">
              <p className="font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userStatus}</p>
            </div>
            <div className="md:hidden flex items-center gap-2 text-gray-900 font-bold text-lg">
              Navigation
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg active:bg-gray-200">
             <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isLocked = item.requiresActive && !isActive;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 md:py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
                  activeNavKey === item.key
                    ? "bg-gray-900 text-white"
                    : isLocked
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isLocked ? "opacity-50" : ""}`} />
                {item.label}
                {isLocked && <Lock className="h-3 w-3 ml-auto opacity-50" />}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-gray-100 mt-auto shrink-0">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 md:py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">{activeNavKey}</h1>
              <p className="mt-1 text-gray-500">Welcome back, {userName}</p>
            </div>
          </div>

          {userStatus === "CLOSED" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-12 text-center shadow-2xl shadow-blue-100/30 backdrop-blur-2xl max-w-3xl mx-auto mt-12"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-rose-600" />
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-rose-50/50 shadow-inner">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-rose-100">
                  <Lock className="h-8 w-8 text-rose-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Account Closed</h2>
              <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                Your account is currently closed. Please contact futurexa support if you believe this is an error.
              </p>
            </motion.div>
          ) : (
            <>
              {userStatus === "SUSPENDED" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-8 shadow-2xl shadow-amber-100/30 backdrop-blur-2xl max-w-3xl mx-auto mt-12"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600" />
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Account Suspended</h2>
                  <p className="text-gray-500">
                    You can view your workspace in read-only mode until your account is reactivated.
                  </p>
                </motion.div>
              )}
              {activeNavKey === "overview" && (
                isActive ? (
                  <OverviewSection
                    liveProjects={liveProjects}
                    liveMilestones={liveMilestones}
                    liveTasks={liveTasks}
                    liveTickets={liveTickets}
                    liveDeployments={liveDeployments}
                    liveFiles={liveFiles}
                    liveSubscriptions={liveSubscriptions}
                  />
                ) : userStatus === "LEAD" ? (
                  <LockedState
                    userName={userName}
                    userStatus={userStatus}
                    onRequestDemo={() => setShowRequestModal(true)}
                  />
                ) : (
                  <DemoRequestPage
                    userName={userName}
                    userEmail={userEmail}
                    apiBaseUrl={apiBaseUrl}
                    accessToken={accessToken || ""}
                    onSuccess={() => {
                      setUserStatus("LEAD");
                      // Persist immediately so a page refresh shows the pending state, not the form
                      setStoredAuth({
                        userName,
                        userStatus: "LEAD",
                        organizationId,
                        accessToken,
                      });
                    }}
                  />
                )
              )}

              {activeNavKey === "tasks" && (
                isActive ? (
                  <TasksPanel
                    userStatus={userStatus}
                    accessToken={accessToken}
                    organizationId={organizationId}
                    liveProjects={liveProjects}
                    liveTasks={liveTasks}
                    taskProjectId={taskProjectId}
                    taskTitle={taskTitle}
                    setTaskProjectId={setTaskProjectId}
                    setTaskTitle={setTaskTitle}
                    handleCreateTask={handleCreateTask}
                    taskComments={taskComments}
                    setTaskComments={setTaskComments}
                    handleUpdateTaskStatus={handleUpdateTaskStatus}
                    handleDeleteTask={handleDeleteTask}
                  />
                ) : (
                  <LockedState
                    userName={userName}
                    userStatus={userStatus}
                    onRequestDemo={() => setShowRequestModal(true)}
                  />
                )
              )}

              {activeNavKey === "tickets" && (
                isActive ? (
                  <TicketsPanel
                    userStatus={userStatus}
                    accessToken={accessToken}
                    organizationId={organizationId}
                    liveProjects={liveProjects}
                    liveTickets={liveTickets}
                    ticketProjectId={ticketProjectId}
                    ticketTitle={ticketTitle}
                    setTicketProjectId={setTicketProjectId}
                    setTicketTitle={setTicketTitle}
                    handleCreateTicket={handleCreateTicket}
                    ticketReplies={ticketReplies}
                    setTicketReplies={setTicketReplies}
                    handleUpdateTicketStatus={handleUpdateTicketStatus}
                    handleDeleteTicket={handleDeleteTicket}
                  />
                ) : (
                  <LockedState
                    userName={userName}
                    userStatus={userStatus}
                    onRequestDemo={() => setShowRequestModal(true)}
                  />
                )
              )}

              {activeNavKey === "files" && (
                isActive ? (
                  <FilesPanel
                    userStatus={userStatus}
                    accessToken={accessToken}
                    organizationId={organizationId}
                    liveProjects={liveProjects}
                    liveFiles={liveFiles}
                    fileProjectId={fileProjectId}
                    setFileProjectId={setFileProjectId}
                    uploadFile={uploadFile}
                    setUploadFile={setUploadFile}
                    uploadError={uploadError}
                    isUploading={isUploading}
                    handleUploadFile={handleUploadFile}
                    handleDeleteFile={handleDeleteFile}
                  />
                ) : (
                  <LockedState
                    userName={userName}
                    userStatus={userStatus}
                    onRequestDemo={() => setShowRequestModal(true)}
                  />
                )
              )}

              {activeNavKey === "settings" && (
                <SettingsPanel
                  accessToken={accessToken}
                  apiBaseUrl={apiBaseUrl}
                  userName={userName}
                  onSaved={(nextName) => setUserName(nextName)}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>

    <DemoRequestModal
      isOpen={showRequestModal}
      onClose={() => setShowRequestModal(false)}
      userName={userName}
      userEmail={userEmail}
      apiBaseUrl={apiBaseUrl}
      accessToken={accessToken || ""}
      onSuccess={() => {
        setUserStatus("LEAD");
      }}
    />
    </>
  );
}
