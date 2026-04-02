import { useState, useEffect } from "react";
import {
  Loader2, Ticket as TicketIcon, Clock, MessageSquare,
  Search, Filter, X, Send, Lock,
  AlertTriangle, Circle, History, GitBranch
} from "lucide-react";
import { getJson, sendJson } from "../lib/api";

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-100",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-100",
  WAITING_ON_CLIENT: "bg-purple-50 text-purple-700 border-purple-100",
  BLOCKED: "bg-red-50 text-red-700 border-red-100",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  CLOSED: "bg-gray-50 text-gray-700 border-gray-100"
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-gray-50 text-gray-600 border-gray-100",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
  HIGH: "bg-orange-50 text-orange-700 border-orange-100",
  CRITICAL: "bg-red-50 text-red-700 border-red-100"
};

const CATEGORIES = [
  { value: "BUG", label: "Bug" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "UI_UX_CHANGE", label: "UI/UX Change" },
  { value: "PAYMENT_BILLING", label: "Payment/Billing" },
  { value: "DEPLOYMENT_ISSUE", label: "Deployment Issue" },
  { value: "ACCESS_ISSUE", label: "Access Issue" },
  { value: "PERFORMANCE_ISSUE", label: "Performance Issue" },
  { value: "SECURITY_ISSUE", label: "Security Issue" },
  { value: "GENERAL_SUPPORT", label: "General Support" }
];

const STATUSES = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "WAITING_ON_CLIENT", label: "Waiting on Client" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" }
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    search: ""
  });

  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.priority) params.set("priority", filters.priority);
      if (filters.category) params.set("category", filters.category);
      if (filters.search) params.set("search", filters.search);

      const [ticketsRes, statsRes] = await Promise.all([
        getJson<any[]>(`/api/tickets?${params.toString()}`),
        getJson<any>("/api/tickets/stats")
      ]);

      setTickets(ticketsRes || []);
      setStats(statsRes);
    } catch (e: any) {
      console.error("Failed to fetch tickets:", e);
      setError(e.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters.status, filters.priority, filters.category, filters.search]);

  const fetchTicketDetail = async (id: string) => {
    try {
      const data = await getJson<any>(`/api/tickets/${id}`);
      setSelectedTicket(data);
    } catch (e: any) {
      console.error("Failed to fetch ticket:", e);
      setError(e.message || "Failed to load ticket details");
    }
  };

  const openDetail = async (ticket: any) => {
    await fetchTicketDetail(ticket.id);
    setIsDetailOpen(true);
    setReplyMessage("");
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedTicket(null);
    setReplyMessage("");
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsSubmitting(true);
    try {
      await sendJson("PATCH", `/api/tickets/${id}`, { status });
      await fetchTickets();
      if (selectedTicket?.id === id) await fetchTicketDetail(id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePriority = async (id: string, priority: string) => {
    setIsSubmitting(true);
    try {
      await sendJson("PATCH", `/api/tickets/${id}`, { priority });
      await fetchTickets();
      if (selectedTicket?.id === id) await fetchTicketDetail(id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    setIsSubmitting(true);
    try {
      await sendJson("POST", `/api/tickets/${selectedTicket.id}/comments`, {
        message: replyMessage,
        userRole: "ADMIN",
        isInternalNote: false
      });
      setReplyMessage("");
      await fetchTicketDetail(selectedTicket.id);
      await fetchTickets();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertToTask = async (id: string) => {
    if (!confirm("Convert this ticket to a task?")) return;
    setIsSubmitting(true);
    try {
      await sendJson("POST", `/api/tickets/${id}/convert-to-task`, {});
      await fetchTickets();
      if (selectedTicket?.id === id) await fetchTicketDetail(id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkClose = async () => {
    if (selectedTickets.length === 0) return;
    if (!confirm(`Close ${selectedTickets.length} selected tickets?`)) return;
    setIsSubmitting(true);
    try {
      for (const id of selectedTickets) {
        await sendJson("PATCH", `/api/tickets/${id}`, { status: "CLOSED" });
      }
      setSelectedTickets([]);
      await fetchTickets();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map((t: any) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredTickets = tickets.filter((t: any) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(searchLower);
      const matchEmail = t.email?.toLowerCase().includes(searchLower);
      const matchOrg = t.organization?.name?.toLowerCase().includes(searchLower);
      const matchTicketNumber = t.ticketNumber?.toLowerCase().includes(searchLower);
      if (!matchTitle && !matchEmail && !matchOrg && !matchTicketNumber) return false;
    }
    return true;
  });

  const isSlaOverdue = (ticket: any) => {
    if (!ticket.slaDueAt || ["CLOSED", "RESOLVED"].includes(ticket.status)) return false;
    return new Date(ticket.slaDueAt) < new Date();
  };

  const getTimeRemaining = (slaDueAt: string) => {
    const diff = new Date(slaDueAt).getTime() - new Date().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours < 0) return `${Math.abs(hours)}h overdue`;
    if (hours < 1) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard icon={Circle} label="Open" value={stats.open} color="blue" />
          <StatCard icon={AlertTriangle} label="High Priority" value={stats.highPriority} color="orange" />
          <StatCard icon={Clock} label="SLA Overdue" value={stats.slaOverdue} color="red" />
          <StatCard icon={MessageSquare} label="Waiting" value={stats.waitingOnClient} color="purple" />
          <StatCard icon={TicketIcon} label="Total" value={stats.total} color="gray" />
          <StatCard icon={Circle} label="In Progress" value={stats.inProgress} color="amber" />
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  placeholder="Search tickets, email, org..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${showFilters ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"}`}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            {selectedTickets.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selectedTickets.length} selected</span>
                <button
                  onClick={handleBulkClose}
                  className="h-9 px-4 rounded-lg bg-gray-900 text-white text-xs font-bold"
                >
                  Close Selected
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                className="h-9 px-3 rounded-lg bg-white border border-gray-100 text-xs"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
                className="h-9 px-3 rounded-lg bg-white border border-gray-100 text-xs"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                className="h-9 px-3 rounded-lg bg-white border border-gray-100 text-xs"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {(filters.status || filters.priority || filters.category) && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, status: "", priority: "", category: "" }))}
                  className="h-9 px-3 rounded-lg text-xs text-red-500 hover:bg-red-50"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="font-medium">Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-red-300 mx-auto mb-4" />
              <p className="font-medium text-red-500 mb-2">{error}</p>
              <button onClick={fetchTickets} className="text-sm text-blue-500 underline">Retry</button>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <TicketIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="font-medium text-gray-400">No tickets found</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-200"
                    />
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Ticket</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Organization</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Email</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Project</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Priority</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">SLA</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTickets.map((t: any) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={() => openDetail(t)}>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedTickets.includes(t.id)}
                        onChange={() => toggleSelect(t.id)}
                        className="h-4 w-4 rounded border-gray-200"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.ticketNumber}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{t.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{t.organization?.name || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{t.email || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-500">{t.project?.name || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={t.status}
                        onChange={(e) => { e.stopPropagation(); handleUpdateStatus(t.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${STATUS_COLORS[t.status] || "bg-gray-50"}`}
                      >
                        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={t.priority}
                        onChange={(e) => { e.stopPropagation(); handleUpdatePriority(t.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${PRIORITY_COLORS[t.priority] || PRIORITY_COLORS.MEDIUM}`}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      {t.slaDueAt && !["CLOSED", "RESOLVED"].includes(t.status) ? (
                        <span className={`text-xs font-bold ${isSlaOverdue(t) ? "text-red-600" : "text-gray-600"}`}>
                          {isSlaOverdue(t) ? <AlertTriangle className="h-3 w-3 inline mr-1" /> : <Clock className="h-3 w-3 inline mr-1" />}
                          {getTimeRemaining(t.slaDueAt)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-400">
                        {new Date(t.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isDetailOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={closeDetail} />
          <div className="relative ml-auto w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{selectedTicket.ticketNumber}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${STATUS_COLORS[selectedTicket.status] || ""}`}>
                    {selectedTicket.status?.replace(/_/g, " ")}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-1">{selectedTicket.title}</h2>
              </div>
              <button onClick={closeDetail} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase block">Organization</span>
                  <span className="text-gray-900 font-medium">{selectedTicket.organization?.name || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase block">Email</span>
                  <span className="text-gray-900 font-medium">{selectedTicket.email || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase block">Project</span>
                  <span className="text-gray-900 font-medium">{selectedTicket.project?.name || "—"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase block">Category</span>
                  <span className="text-gray-900 font-medium">
                    {CATEGORIES.find((c) => c.value === selectedTicket.category)?.label || selectedTicket.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Conversation</h3>
              <div className="space-y-4">
                {selectedTicket.description && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        U
                      </div>
                      <span className="text-xs font-bold text-gray-500">User</span>
                      <span className="text-[10px] text-gray-400">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                )}

                {(selectedTicket.comments || []).map((comment: any) => {
                  const isAdmin = comment.userRole === "ADMIN";
                  return (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-2xl max-w-[85%] ${isAdmin ? "bg-blue-50 border border-blue-100 ml-auto" : "bg-gray-50 border border-gray-100"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isAdmin ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-600"}`}>
                          {isAdmin ? "A" : "U"}
                        </div>
                        <span className="text-xs font-bold text-gray-500">{isAdmin ? "Admin" : "User"}</span>
                        <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.message}</p>
                    </div>
                  );
                })}
              </div>

              {selectedTicket.history && selectedTicket.history.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <History className="h-4 w-4" /> History
                  </h3>
                  <div className="space-y-2">
                    {selectedTicket.history.map((h: any) => (
                      <div key={h.id} className="flex items-center gap-3 text-xs">
                        <Clock className="h-3 w-3 text-gray-300" />
                        <span className="text-gray-400">{new Date(h.createdAt).toLocaleString()}</span>
                        <span className="text-gray-600">{h.action.replace(/_/g, " ")}</span>
                        {h.oldValue && <span className="text-gray-400">from {h.oldValue}</span>}
                        {h.newValue && <span className="text-gray-600">to {h.newValue}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 shrink-0">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Reply to user..."
                  rows={3}
                  className="w-full text-sm bg-transparent outline-none resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-400">This reply will be visible to the user</span>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim() || isSubmitting}
                    className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    Send Reply
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleConvertToTask(selectedTicket.id)}
                  disabled={isSubmitting}
                  className="flex-1 h-10 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50"
                >
                  <GitBranch className="h-4 w-4" />
                  Convert to Task
                </button>
                <select
                  onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                  value={selectedTicket.status}
                  className="h-10 px-4 rounded-xl border border-gray-100 text-sm"
                >
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className={`rounded-2xl p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-2xl font-black">{value || 0}</span>
    </div>
  );
}