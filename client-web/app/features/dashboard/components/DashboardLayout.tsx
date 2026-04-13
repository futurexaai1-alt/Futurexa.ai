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
  Menu,
  X,
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
  userEmail?: string | null;
  organizationId: string | null;
  accessToken: string | null;
  profileSyncedAt?: number;
};

export const AUTH_STORAGE_KEY = "futurexa_auth";
export const PROFILE_CACHE_TTL_MS = 2 * 60 * 1000;

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

export function isProfileCacheFresh(cachedAuth: AuthData | null): boolean {
  if (!cachedAuth?.profileSyncedAt) return false;
  return Date.now() - cachedAuth.profileSyncedAt < PROFILE_CACHE_TTL_MS;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
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
      const displayName = fullName || fallbackName;
      const cachedForToken =
        existing?.accessToken && existing.accessToken === token ? existing : null;

      if (!cancelled) {
        setAccessToken(token);
        setUserName(displayName);
        if (orgId) setOrganizationId(orgId);
      }

      if (
        cachedForToken &&
        isProfileCacheFresh(cachedForToken) &&
        Boolean(cachedForToken.organizationId)
      ) {
        if (!cancelled) {
          setUserStatus(cachedForToken.userStatus || "NEW_USER");
          if (cachedForToken.organizationId) setOrganizationId(cachedForToken.organizationId);
          setStoredAuth({
            ...cachedForToken,
            userName: displayName,
            userEmail: user.email || cachedForToken.userEmail || null,
            accessToken: token,
          });
          setIsLoading(false);
        }
        return;
      }

      try {
        if (!apiBaseUrl) {
          if (!cancelled) setIsLoading(false);
          return;
        }

        const res = await fetch(`${apiBaseUrl}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json() as any;
          const newStatus = json?.status ?? "NEW_USER";
          const newOrgId = json?.organizationId || orgId || null;

          const updatedAuth: AuthData = {
            userName: displayName,
            userStatus: newStatus,
            userEmail: user.email || null,
            organizationId: newOrgId,
            accessToken: token,
            profileSyncedAt: Date.now(),
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
    <>
    <div className="flex h-[100dvh] flex-col md:flex-row bg-gray-50 overflow-hidden relative">
      {/* Background Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[100px] animate-orb" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-indigo-100/40 blur-[100px] animate-orb" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-[30%] left-[20%] h-[300px] w-[300px] rounded-full bg-purple-100/30 blur-[100px] animate-orb" style={{ animationDelay: "-10s" }} />
      </div>

      <div className="flex h-[100dvh] flex-col md:flex-row bg-transparent overflow-hidden relative z-10 w-full">
      
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
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate(item.path);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 md:py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
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
        {children}
      </main>
    </div>
    </div>
    </>
  );
}
