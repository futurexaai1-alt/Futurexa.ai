import type { Route } from "./+types/dashboard-project";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FolderKanban } from "lucide-react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import { resolveApiBaseUrl } from "../utils/api-base";
import { ensureDashboardAuth } from "../utils/dashboard-auth";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

type Project = {
  id: string;
  title: string;
  status: string;
  description?: string;
  createdAt: string;
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
    { title: "Projects | futurexa.ai" },
    { name: "description", content: "Manage your projects" },
  ];
}

export default function DashboardProject(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>("NEW_USER");
  const [statusConfirmed, setStatusConfirmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function bootstrapAuth() {
      try {
        const auth = await ensureDashboardAuth({
          supabaseUrl,
          supabaseAnonKey,
          apiBaseUrl,
        });

        if (!cancelled) {
          if (!auth) {
            setIsLoading(false);
            navigate("/signin");
            return;
          }

          setAccessToken(auth.accessToken);
          setOrganizationId(auth.organizationId);
          setUserStatus(auth.userStatus || "NEW_USER");

          const status = auth.userStatus || "NEW_USER";
          setUserStatus(status);
          if (status !== "ACTIVE_CLIENT" && status !== "PENDING_CLIENT") {
            setIsLoading(false);
            navigate("/dashboard");
            return;
          }
          setStatusConfirmed(true);
        }
      } catch {
        if (!cancelled) {
          setIsLoading(false);
          navigate("/signin");
        }
      }
    }

    bootstrapAuth();
    return () => { cancelled = true; };
  }, [navigate, supabaseUrl, supabaseAnonKey, apiBaseUrl]);

  useEffect(() => {
    if (!organizationId || !accessToken || !statusConfirmed) return;
    const controller = new AbortController();
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      try {
        const orgId = organizationId;
        if (!orgId) return;
        const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}`, "x-organization-id": orgId };
        const res = await fetch(`${apiBaseUrl}/api/projects?limit=100&offset=0`, {
          headers,
          signal: controller.signal,
        });

        if (!cancelled && res.ok) {
          const json = await res.json() as any;
          const data = json?.data ?? [];
          setProjects(data.map((p: any) => ({
            id: p.id,
            title: p.name,
            status: p.status || "ACTIVE",
            description: p.description,
            createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
          })));
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Failed to fetch projects", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [organizationId, accessToken, apiBaseUrl, statusConfirmed]);

  if (isLoading) {
    return (
      <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="overview">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="overview">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-gray-500">Manage your organization projects</p>
        </div>

        <div className="grid gap-4">
          {projects.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
              <FolderKanban className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No projects found</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="rounded-xl border border-gray-100 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    {project.description && (
                      <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">Created: {project.createdAt}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    project.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" :
                    project.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700" :
                    "bg-gray-50 text-gray-700"
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
