import type { Route } from "./+types/dashboard-overview";
import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import OverviewSection from "../features/dashboard/components/OverviewSection";
import { resolveApiBaseUrl } from "../utils/api-base";
import { ensureDashboardAuth } from "../utils/dashboard-auth";

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
    let cancelled = false;

    async function bootstrapAuth() {
      try {
        const auth = await ensureDashboardAuth({
          supabaseUrl,
          supabaseAnonKey,
          apiBaseUrl,
        });

        if (!cancelled && auth) {
          setAccessToken(auth.accessToken);
          setOrganizationId(auth.organizationId);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    bootstrapAuth();
    return () => {
      cancelled = true;
    };
  }, [supabaseUrl, supabaseAnonKey, apiBaseUrl]);

  useEffect(() => {
    if (!organizationId || !accessToken) return;
    const controller = new AbortController();
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      try {
        const orgId = organizationId;
        if (!orgId) return;
        const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}`, "x-organization-id": orgId };
        const [pRes, mRes, tRes, ticRes, dRes, fRes, sRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/projects?limit=50&offset=0`, { headers, signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/milestones?limit=50&offset=0`, { headers, signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/tasks`, { headers, signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/tickets?limit=50&offset=0`, { headers, signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/deployments`, { headers, signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/files?limit=50&offset=0&includePreview=false`, { headers, signal: controller.signal }),
          fetch(`${apiBaseUrl}/api/billing/subscriptions?limit=50&offset=0`, { headers, signal: controller.signal }),
        ]);

        if (!cancelled && pRes.ok) {
          const json = await pRes.json() as any;
          setLiveProjects((json?.data ?? []).map((p: any) => ({ id: p.id, title: p.name, status: p.status || "ACTIVE" })));
        }
        if (!cancelled && mRes.ok) {
          const json = await mRes.json() as any;
          setLiveMilestones((json?.data ?? []).map((m: any) => {
            const status = m.status || "PENDING";
            const progress = status === "IN_PROGRESS" ? 70 : status === "READY_FOR_REVIEW" ? 90 : status === "SCHEDULED" ? 35 : 0;
            return { id: m.id, title: m.title || m.name, status, progress, dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "" };
          }));
        }
        if (!cancelled && tRes.ok) {
          const json = await tRes.json() as any;
          setLiveTasks((json?.data ?? []).map((t: any) => ({ id: t.id, title: t.title, status: t.status || "PENDING" })));
        }
        if (!cancelled && ticRes.ok) {
          const json = await ticRes.json() as any;
          setLiveTickets((json?.data ?? []).map((t: any) => ({ id: t.id, title: t.title, status: t.status || "OPEN" })));
        }
        if (!cancelled && dRes.ok) {
          const json = await dRes.json() as any;
          setLiveDeployments((json?.data ?? []).map((d: any) => ({ id: d.id, title: d.name, status: d.status || "SUCCESS" })));
        }
        if (!cancelled && fRes.ok) {
          const json = await fRes.json() as any;
          setLiveFiles((json?.data ?? []).map((f: any) => {
            const parts = String(f.fileUrl ?? "").split("/");
            const title = parts.length > 0 ? parts[parts.length - 1] : f.fileType || "file";
            return { id: f.id, title, status: f.fileType || "FILE" };
          }));
        }
        if (!cancelled && sRes.ok) {
          const json = await sRes.json() as any;
          setLiveSubscriptions((json?.data ?? []).map((s: any) => ({ id: s.id, title: s.planName || "Plan", status: s.status || "ACTIVE" })));
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Failed to fetch data", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
      controller.abort();
    };
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
