import { useState, useEffect, useMemo } from "react";
import { Loader2, Activity, Download, Filter, X, ChevronDown, Calendar, Search } from "lucide-react";
import { useOrganizations } from "../hooks/useOrganizations";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

const ENTITY_TYPES = ["File", "Milestone", "Task", "Deployment", "Organization", "User", "Ticket", "Project"];

const ACTION_COLORS: Record<string, string> = {
  created: "bg-emerald-50 text-emerald-700 border-emerald-100",
  updated: "bg-blue-50 text-blue-700 border-blue-100",
  deleted: "bg-red-50 text-red-700 border-red-100",
  approved: "bg-purple-50 text-purple-700 border-purple-100",
  uploaded: "bg-amber-50 text-amber-700 border-amber-100",
  added: "bg-teal-50 text-teal-700 border-teal-100",
  removed: "bg-orange-50 text-orange-700 border-orange-100",
  requested: "bg-cyan-50 text-cyan-700 border-cyan-100",
  default: "bg-gray-50 text-gray-700 border-gray-100"
};

const ENTITY_ICONS: Record<string, string> = {
  File: "📄",
  Milestone: "🎯",
  Task: "✅",
  Deployment: "🚀",
  Organization: "🏢",
  User: "👤",
  Ticket: "🎫",
  Project: "📁"
};

function getActionColor(action: string): string {
  const lower = action.toLowerCase();
  if (lower.includes("created")) return ACTION_COLORS.created;
  if (lower.includes("updated") || lower.includes("changed")) return ACTION_COLORS.updated;
  if (lower.includes("deleted") || lower.includes("removed")) return ACTION_COLORS.deleted;
  if (lower.includes("approved")) return ACTION_COLORS.approved;
  if (lower.includes("uploaded")) return ACTION_COLORS.uploaded;
  if (lower.includes("added")) return ACTION_COLORS.added;
  if (lower.includes("removed")) return ACTION_COLORS.removed;
  if (lower.includes("requested")) return ACTION_COLORS.requested;
  return ACTION_COLORS.default;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function ActivityLogsPage() {
  const { organizations } = useOrganizations();
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(50);

  const [filters, setFilters] = useState({
    entityType: "",
    search: "",
    from: "",
    to: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async () => {
    console.log("fetchLogs called, selectedOrgId:", selectedOrgId);
    setLoading(true);
    try {
      console.log("Fetching activity logs for org:", selectedOrgId || "ALL");
      const params = new URLSearchParams();
      params.set("limit", limit.toString());
      params.set("offset", offset.toString());
      if (filters.entityType) params.set("entityType", filters.entityType);
      if (filters.search) params.set("action", filters.search);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);

      const headers: Record<string, string> = {
        "x-admin-crm": "true",
      };
      if (selectedOrgId) {
        headers["x-organization-id"] = selectedOrgId;
      }

      console.log("API request to:", `${apiBaseUrl}/api/activity-logs?${params.toString()}`);
      const res = await fetch(`${apiBaseUrl}/api/activity-logs?${params.toString()}`, { headers });
      console.log("API response status:", res.status);
      if (res.ok) {
        const json = await res.json();
        console.log("API response data:", json.data?.length, "items");
        setLogs(json.data || []);
        setTotal(json.pagination?.total || 0);
      } else {
        console.error("API error:", res.status);
      }
    } catch (e) {
      console.error("Failed to fetch activity logs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("ActivityLogsPage: selectedOrgId changed to:", selectedOrgId);
    fetchLogs();
  }, [selectedOrgId, offset, filters.entityType, filters.from, filters.to]);

  const handleSearch = () => {
    setOffset(0);
    fetchLogs();
  };

  const exportToCSV = () => {
    const headers = ["Date", "Action", "Entity Type", "User", "Details"];
    const rows = logs.map((log: any) => [
      new Date(log.createdAt).toLocaleString(),
      log.action,
      log.entityType,
      log.user?.email || log.user?.name || "System",
      JSON.stringify(log.metadata || {})
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${selectedOrgId}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilters({ entityType: "", search: "", from: "", to: "" });
    setOffset(0);
  };

  const hasActiveFilters = filters.entityType || filters.search || filters.from || filters.to;
  const hasMore = total > offset + limit;

  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Activity Logs</h3>
            <p className="text-sm text-gray-500 mt-1">Audit trail of all actions.</p>
          </div>
          <div className="flex items-center gap-3">
            {logs.length > 0 && (
              <button
                onClick={exportToCSV}
                className="h-10 px-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition-all flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search actions..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="relative">
            <select
              value={selectedOrgId}
              onChange={(e) => {
                setSelectedOrgId(e.target.value);
                setOffset(0);
              }}
              className="h-11 px-4 rounded-xl bg-white border border-gray-100 text-sm font-medium appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="">Select Organization</option>
              {organizations.map((org: any) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              showFilters ? "bg-gray-900 text-white" : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
                className="h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-100 text-sm"
                placeholder="From"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
                className="h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-100 text-sm"
                placeholder="To"
              />
            </div>
            <select
              value={filters.entityType}
              onChange={(e) => setFilters((f) => ({ ...f, entityType: e.target.value }))}
              className="h-10 px-3 rounded-xl bg-white border border-gray-100 text-sm"
            >
              <option value="">All Entity Types</option>
              {ENTITY_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="h-10 px-3 rounded-xl text-sm text-red-500 hover:bg-red-50 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-medium">Loading activity logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center">
              <Activity className="h-8 w-8" />
            </div>
            <p className="font-medium text-lg">No activity logs found</p>
            <p className="text-sm">Try adjusting your filters or create some activities</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {logs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg">
                    {ENTITY_ICONS[log.entityType] || "📌"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getActionColor(log.action)}`}>
                        {log.entityType}
                      </span>
                      {log.organization && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                          {log.organization.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      by {log.user?.name || log.user?.email || "System"}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <span className="ml-2 text-gray-400">
                          • {JSON.stringify(log.metadata).substring(0, 50)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-gray-400 font-medium">{formatDate(log.createdAt)}</p>
                    <p className="text-[10px] text-gray-300 mt-1">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {total > limit && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {offset + 1} - {Math.min(offset + limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={offset === 0}
                    className="h-9 px-4 rounded-lg bg-white border border-gray-100 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setOffset(offset + limit)}
                    disabled={!hasMore}
                    className="h-9 px-4 rounded-lg bg-white border border-gray-100 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
