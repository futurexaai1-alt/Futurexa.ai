import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  CalendarClock,
  CreditCard,
  Files,
  FolderKanban,
  ListTodo,
  LogOut,
  Rocket,
  Settings,
  Ticket,
} from "lucide-react";
import { createSupabaseBrowserClient } from "../../../utils/supabase";

type DashboardLayoutProps = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
  activeKey: string;
  children: ReactNode;
};

type AuthData = {
  userName: string;
  userStatus: string;
  organizationId: string | null;
  accessToken: string | null;
};

export const AUTH_STORAGE_KEY = "futurexa_auth";

export const navItems = [
  { key: "overview", label: "Overview", icon: FolderKanban, path: "/dashboard" },
  { key: "milestones", label: "Milestones", icon: CalendarClock, path: "/dashboard/milestones" },
  { key: "tasks", label: "Tasks", icon: ListTodo, path: "/dashboard/tasks" },
  { key: "tickets", label: "Tickets", icon: Ticket, path: "/dashboard/ticket" },
  { key: "files", label: "Files", icon: Files, path: "/dashboard/files" },
  { key: "deployments", label: "Deployments", icon: Rocket, path: "/dashboard/deployments" },
  { key: "billing", label: "Billing", icon: CreditCard, path: "/dashboard/billing" },
  { key: "activity", label: "Activity", icon: Activity, path: "/dashboard/activity" },
  { key: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export function getStoredAuth(): AuthData | null {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function setStoredAuth(data: AuthData) {
  try {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function DashboardLayout({
  supabaseUrl,
  supabaseAnonKey,
  apiBaseUrl,
  activeKey,
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const supabase = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);

  const storedAuth = getStoredAuth();

  const [userName, setUserName] = useState(storedAuth?.userName || "Client");
  const [userStatus, setUserStatus] = useState(storedAuth?.userStatus || "NEW_USER");
  const [organizationId, setOrganizationId] = useState<string | null>(storedAuth?.organizationId || null);
  const [accessToken, setAccessToken] = useState<string | null>(storedAuth?.accessToken || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      // If we have stored auth, let the UI render immediately with cached data
      const existing = getStoredAuth();
      if (existing?.accessToken) {
        if (!cancelled) setIsLoading(false);
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        if (!cancelled) {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          navigate("/signin", { replace: true });
        }
        return;
      }

      const user = data.session.user;
      const token = data.session.access_token;
      const fallbackName = user.email?.split("@")[0] ?? "Client";
      const fullName = user.user_metadata?.full_name as string | undefined;
      const orgId = user.user_metadata?.organization_id as string | undefined;

      if (!cancelled) {
        setAccessToken(token);
        if (fullName || fallbackName) setUserName(fullName || fallbackName);
        if (orgId) setOrganizationId(orgId);
      }

      try {
        // Always refresh /api/me to get latest status and organizationId
        const res = await fetch(`${apiBaseUrl}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json() as any;
          const newStatus = json?.status ?? "NEW_USER";
          const newOrgId = json?.organizationId || orgId || null;
          const displayName = fullName || fallbackName;

          const updatedAuth: AuthData = {
            userName: displayName,
            userStatus: newStatus,
            organizationId: newOrgId,
            accessToken: token,
          };

          if (!cancelled) {
            setUserStatus(newStatus);
            if (newOrgId) setOrganizationId(newOrgId);
            setStoredAuth(updatedAuth);
          }
        }
      } catch (e) {
        console.error("Failed to fetch user status", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    await supabase.auth.signOut();
    navigate("/signin", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-100 bg-white p-4">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white font-bold">F</div>
          <div>
            <p className="font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userStatus}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                item.key === activeKey
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4">
          <button
            onClick={handleLogout}
            className="flex w-56 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}