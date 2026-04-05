import type { Route } from "./+types/dashboard-deployments";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Rocket, Server, Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import DashboardLayout, { getStoredAuth } from "../features/dashboard/components/DashboardLayout";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

type Deployment = {
  id: string;
  title: string;
  status: string;
  environment?: string;
  deployedAt: string;
};

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as any;
  const configuredApiBaseUrl =
    typeof env.API_BASE_URL === "string" && env.API_BASE_URL.length > 0
      ? env.API_BASE_URL
      : env.API || (typeof env.API_BASE_URL === "object" && env.API_BASE_URL)
        ? ""
        : "http://localhost:8787";

  return {
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    apiBaseUrl: configuredApiBaseUrl,
  } satisfies LoaderData;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Deployments | futurexa.ai" },
    { name: "description", content: "Manage your deployments" },
  ];
}

export default function DashboardDeployments(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [deployments, setDeployments] = useState<Deployment[]>([]);
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

    async function fetchData() {
      try {
        const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId as string };
        const res = await fetch(`${apiBaseUrl}/api/deployments`, { headers });

        if (res.ok) {
          const json = await res.json() as any;
          const data = json?.data ?? [];
          setDeployments(data.map((d: any) => ({
            id: d.id,
            title: d.name,
            status: d.status || "SUCCESS",
            environment: d.environment || "Production",
            deployedAt: d.deployedAt ? new Date(d.deployedAt).toLocaleString() : new Date().toLocaleString(),
          })));
        }
      } catch (e) {
        console.error("Failed to fetch deployments", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [organizationId, accessToken, apiBaseUrl]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "SUCCESS": return { icon: <CheckCircle className="h-4 w-4" />, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
      case "FAILED": return { icon: <XCircle className="h-4 w-4" />, color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
      case "IN_PROGRESS": return { icon: <Activity className="h-4 w-4 animate-pulse" />, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" };
      default: return { icon: <Clock className="h-4 w-4" />, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" };
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="deployments">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="deployments">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Deployment History</h1>
          <p className="mt-1 text-gray-500">Track and view logs for all your project environments.</p>
        </div>

        <div className="relative border-l-2 border-dashed border-gray-200 pl-4 py-2 ml-4">
          {deployments.length === 0 ? (
            <div className="ml-[-17px] rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                <Rocket className="h-8 w-8 text-indigo-300" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-900">No deployments found</p>
              <p className="mt-1 text-sm text-gray-500">Your deployment logs will appear here once triggered.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {deployments.map((deployment) => {
                const statusConfig = getStatusConfig(deployment.status);
                return (
                  <div key={deployment.id} className="relative group">
                    <div className="absolute -left-[27px] top-4 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow ring-4 ring-white group-hover:scale-125 transition-transform" />
                    
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            deployment.environment?.toLowerCase().includes("prod") ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-500"
                          }`}>
                            <Server className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900">{deployment.title}</h3>
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                {statusConfig.icon}
                                {deployment.status.replace("_", " ")}
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                              <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                {deployment.environment}
                              </span>
                              <span>•</span>
                              <span>{deployment.deployedAt}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
