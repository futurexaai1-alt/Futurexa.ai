import type { Route } from "./+types/dashboard-activity";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Activity, User, Settings as SettingsIcon, Shield, FileText, Search, Filter } from "lucide-react";
import DashboardLayout, { getStoredAuth } from "../features/dashboard/components/DashboardLayout";
import { resolveApiBaseUrl } from "../utils/api-base";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

type ActivityItem = {
  id: string;
  title: string;
  entityType: string;
  createdAt: string;
  rawDate: Date;
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
    { title: "Activity | futurexa.ai" },
    { name: "description", content: "View your activity history" },
  ];
}

export default function DashboardActivity(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
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
        const res = await fetch(`${apiBaseUrl}/api/activity-logs`, { headers });

        if (res.ok) {
          const json = await res.json() as any;
          const data = json?.data ?? [];
          console.log("Activity logs fetched:", data.length, "activities");
          console.log("Sample activity:", data[0]);
          setActivities(data.map((a: any) => ({
            id: a.id,
            title: a.action || "Action Performed",
            entityType: a.entityType || "System",
            createdAt: a.createdAt ? new Date(a.createdAt).toLocaleString() : new Date().toLocaleString(),
            rawDate: a.createdAt ? new Date(a.createdAt) : new Date(),
          })).sort((a: ActivityItem, b: ActivityItem) => b.rawDate.getTime() - a.rawDate.getTime()));
        }
      } catch (e) {
        console.error("Failed to fetch activities", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [organizationId, accessToken, apiBaseUrl]);

  const getActivityIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("user") || lower.includes("auth")) return <User className="h-4 w-4 text-blue-500" />;
    if (lower.includes("setting") || lower.includes("config")) return <SettingsIcon className="h-4 w-4 text-gray-500" />;
    if (lower.includes("security") || lower.includes("login")) return <Shield className="h-4 w-4 text-emerald-500" />;
    if (lower.includes("file") || lower.includes("document")) return <FileText className="h-4 w-4 text-amber-500" />;
    return <Activity className="h-4 w-4 text-indigo-500" />;
  };

  const getActivityStyle = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("user") || lower.includes("auth")) return "bg-blue-50 border-blue-100 ring-blue-50";
    if (lower.includes("setting") || lower.includes("config")) return "bg-gray-50 border-gray-200 ring-gray-50";
    if (lower.includes("security") || lower.includes("login")) return "bg-emerald-50 border-emerald-100 ring-emerald-50";
    if (lower.includes("file") || lower.includes("document")) return "bg-amber-50 border-amber-100 ring-amber-50";
    return "bg-indigo-50 border-indigo-100 ring-indigo-50";
  };

  const filteredActivities = activities.filter(a => {
    if (filterType !== "ALL" && a.entityType !== filterType && filterType !== "System") return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      if (!a.title.toLowerCase().includes(q) && !a.entityType.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="activity">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  // Extract unique entity types for the filter dropdown
  const entityTypes = ["ALL", ...Array.from(new Set(activities.map(a => a.entityType)))];

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="activity">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
            <p className="mt-1 text-gray-500">Track all actions taken in your workspace.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            
            <div className="relative w-full sm:w-auto shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-8 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer"
              >
                {entityTypes.map(type => (
                  <option key={type} value={type}>{type === "ALL" ? "All Filters" : type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative border-l-2 border-gray-100 pl-6 ml-3 space-y-8">
            {filteredActivities.length === 0 ? (
              <div className="ml-[-25px] rounded-2xl border border-gray-100 bg-gray-50 p-12 text-center shadow-sm">
                <Activity className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-sm font-semibold text-gray-900">No activity found</p>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="relative group">
                  <div className={`absolute -left-[35px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border ring-4 ring-white transition-transform group-hover:scale-110 ${getActivityStyle(activity.entityType)}`}>
                    {getActivityIcon(activity.entityType)}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                        <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-600">
                          {activity.entityType}
                        </span>
                      </p>
                    </div>
                    <time className="text-xs font-semibold text-gray-400 shrink-0 mt-0.5 whitespace-nowrap">{activity.createdAt}</time>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
