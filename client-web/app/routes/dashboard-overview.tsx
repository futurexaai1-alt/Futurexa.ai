import type { Route } from "./+types/dashboard-overview";
import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import OverviewSection from "../features/dashboard/components/OverviewSection";
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

type StoredAuth = {
  accessToken: string | null;
  organizationId: string | null;
};

const AUTH_KEY = "futurexa_auth";

function getStoredAuth(): StoredAuth | null {
  try {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored) return JSON.parse(stored) as StoredAuth;
  } catch {}
  return null;
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | futurexa.ai" },
    { name: "description", content: "Your dashboard overview" },
  ];
}

export default function DashboardOverview(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;

  const [liveProjects, setLiveProjects] = useState<ListItem[]>([]);
  const [liveMilestones, setLiveMilestones] = useState<MilestoneItem[]>([]);
  const [liveTasks, setLiveTasks] = useState<ListItem[]>([]);
  const [liveTickets, setLiveTickets] = useState<ListItem[]>([]);
  const [liveDeployments, setLiveDeployments] = useState<ListItem[]>([]);
  const [liveFiles, setLiveFiles] = useState<ListItem[]>([]);
  const [liveSubscriptions, setLiveSubscriptions] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.accessToken && stored?.organizationId) {
      setAccessToken(stored.accessToken);
      setOrganizationId(stored.organizationId);
      setIsLoading(false);
    } else {
      const checkAuth = async () => {
        const res = await fetch(`${apiBaseUrl}/api/me`, {
          headers: { Authorization: `Bearer ${stored?.accessToken}` },
        });
        if (res.ok) {
          const json = await res.json() as { organizationId?: string | null };
          setOrganizationId(json?.organizationId || stored?.organizationId || null);
          setAccessToken(stored?.accessToken || null);
        }
        setIsLoading(false);
      };
      if (stored?.accessToken) {
        checkAuth();
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!organizationId || !accessToken) return;

    async function fetchData() {
      try {
        const orgId = organizationId;
        if (!orgId) return;
        const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}`, "x-organization-id": orgId };
        const [pRes, mRes, tRes, ticRes, dRes, fRes, sRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/projects`, { headers }),
          fetch(`${apiBaseUrl}/api/milestones`, { headers }),
          fetch(`${apiBaseUrl}/api/tasks`, { headers }),
          fetch(`${apiBaseUrl}/api/tickets`, { headers }),
          fetch(`${apiBaseUrl}/api/deployments`, { headers }),
          fetch(`${apiBaseUrl}/api/files`, { headers }),
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
        if (sRes.ok) {
          const json = await sRes.json() as any;
          setLiveSubscriptions((json?.data ?? []).map((s: any) => ({ id: s.id, title: s.planName || "Plan", status: s.status || "ACTIVE" })));
        }
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [organizationId, accessToken, apiBaseUrl]);

  if (isLoading) {
    return (
      <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="overview">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="overview">
      <OverviewSection
        liveProjects={liveProjects}
        liveMilestones={liveMilestones}
        liveTasks={liveTasks}
        liveTickets={liveTickets}
        liveDeployments={liveDeployments}
        liveFiles={liveFiles}
        liveSubscriptions={liveSubscriptions}
      />
    </DashboardLayout>
  );
}
