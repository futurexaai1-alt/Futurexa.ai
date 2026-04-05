import type { Route } from "./+types/dashboard-settings";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import DashboardLayout, { getStoredAuth } from "../features/dashboard/components/DashboardLayout";
import SettingsPanel from "../features/settings/components/SettingsPanel";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
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

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.accessToken && stored?.organizationId) {
      setAccessToken(stored.accessToken);
      setOrganizationId(stored.organizationId);
      setUserName(stored.userName || "Client");
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

  if (isLoading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-500">Manage your account settings</p>
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
