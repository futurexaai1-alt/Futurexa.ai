import type { Route } from "./+types/dashboard-settings";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import SettingsPanel from "../features/settings/components/SettingsPanel";
import { resolveApiBaseUrl } from "../utils/api-base";
import { ensureDashboardAuth } from "../utils/dashboard-auth";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
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
    { title: "Settings | futurexa.ai" },
    { name: "description", content: "Manage your account settings" },
  ];
}

export default function DashboardSettings(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Client");
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
          setUserName(auth.userName || "Client");
          setUserStatus(auth.userStatus || "NEW_USER");

          const status = auth.userStatus || "NEW_USER";
          if (status !== "ACTIVE_CLIENT" && status !== "PENDING_CLIENT") {
            setIsLoading(false);
            navigate("/dashboard");
            return;
          }
          setStatusConfirmed(true);
          setIsLoading(false);
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

  if (isLoading || !statusConfirmed) {
    return (
      <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="settings">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="settings">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter font-outfit">Settings</h1>
          <p className="mt-2 text-gray-500 font-medium tracking-tight">Configure your identity and workspace security vault.</p>
        </div>

        <SettingsPanel
          accessToken={accessToken}
          apiBaseUrl={apiBaseUrl}
          userName={userName}
          onSaved={(nextName) => setUserName(nextName)}
        />
      </div>
    </DashboardLayout>
  );
}
