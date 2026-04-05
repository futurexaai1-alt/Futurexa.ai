import type { Route } from "./+types/dashboard-tasks";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import DashboardLayout, { getStoredAuth } from "../features/dashboard/components/DashboardLayout";
import TasksPanel from "../features/dashboard/components/TasksPanel";
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

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as any;
  const configuredApiBaseUrl = resolveApiBaseUrl(env);

  return {
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    apiBaseUrl: configuredApiBaseUrl,
  } satisfies LoaderData;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tasks | futurexa.ai" },
    { name: "description", content: "Manage your tasks" },
  ];
}

export default function DashboardTasks(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [liveProjects, setLiveProjects] = useState<ListItem[]>([]);
  const [liveTasks, setLiveTasks] = useState<ListItem[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<string | null>(null);
  const [taskComments, setTaskComments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>("NEW_USER");

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.accessToken && stored?.organizationId) {
      setAccessToken(stored.accessToken);
      setOrganizationId(stored.organizationId);
      setUserStatus(stored.userStatus || "NEW_USER");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    if (!organizationId || !accessToken) return;
    if (userStatus && userStatus !== "ACTIVE_CLIENT" && userStatus !== "PENDING_CLIENT") {
      navigate("/dashboard");
      return;
    }
  }, [navigate, organizationId, accessToken, userStatus]);

  useEffect(() => {
    if (!organizationId || !accessToken) return;

    async function fetchData() {
      try {
        const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId as string };
        const [pRes, tasksRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/projects`, { headers }),
          fetch(`${apiBaseUrl}/api/tasks`, { headers }),
        ]);

        if (pRes.ok) {
          const json = await pRes.json() as any;
          const data = json?.data ?? [];
          setLiveProjects(data.map((p: any) => ({ id: p.id, title: p.name, status: p.status || "ACTIVE" })));
        }

        if (tasksRes.ok) {
          const json = await tasksRes.json() as any;
          const data = json?.data ?? [];
          setLiveTasks(data.map((t: any) => ({ id: t.id, title: t.title, status: t.status || "PENDING" })));
        }
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [organizationId, accessToken, apiBaseUrl]);

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
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({ projectId: taskProjectId, title: taskTitle }),
      });

      if (res.ok) {
        setTaskTitle("");
        const tasksRes = await fetch(`${apiBaseUrl}/api/tasks`, {
          headers: { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId },
        });
        if (tasksRes.ok) {
          const json = await tasksRes.json() as any;
          const data = json?.data ?? [];
          setLiveTasks(data.map((t: any) => ({ id: t.id, title: t.title, status: t.status || "PENDING" })));
        }
      }
    } catch (e) {
      console.error("Failed to create task", e);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string | number, status: string) => {
    if (!accessToken || !organizationId) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/tasks/${encodeURIComponent(String(taskId))}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
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
          "x-organization-id": organizationId,
        },
      });

      if (res.ok) {
        setLiveTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      supabaseUrl={supabaseUrl}
      supabaseAnonKey={supabaseAnonKey}
      apiBaseUrl={apiBaseUrl}
      activeKey="tasks"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-gray-500">Manage your project tasks</p>
        </div>

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
      </div>
    </DashboardLayout>
  );
}
