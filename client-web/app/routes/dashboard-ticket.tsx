import type { Route } from "./+types/dashboard-ticket";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Ticket as TicketIcon, Plus, X, Loader2, Search, Filter,
  Clock, AlertTriangle, MessageSquare, Send, ChevronRight,
  CheckCircle2, Circle, ArrowLeft, Layers
} from "lucide-react";
import DashboardLayout, { getStoredAuth } from "../features/dashboard/components/DashboardLayout";
import { resolveApiBaseUrl } from "../utils/api-base";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

type Ticket = {
  id: string;
  ticketNumber: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  slaDueAt?: string;
  lastReplyAt?: string;
};

type TicketComment = {
  id: string;
  message: string;
  userRole: string;
  createdAt: string;
  isInternalNote: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  WAITING_ON_CLIENT: "bg-purple-50 text-purple-700",
  BLOCKED: "bg-red-50 text-red-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-gray-50 text-gray-700"
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-50 text-red-700"
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
    { title: "Tickets | futurexa.ai" },
    { name: "description", content: "Manage your support tickets" },
  ];
}

export default function DashboardTicket(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>("NEW_USER");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketComments, setTicketComments] = useState<TicketComment[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIUM");
  const [newCategory, setNewCategory] = useState("GENERAL_SUPPORT");
  const [newProjectId, setNewProjectId] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [replyMessage, setReplyMessage] = useState("");
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });
  const [showFilters, setShowFilters] = useState(false);

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
  }, [navigate, organizationId, accessToken, userStatus]);

  const fetchTickets = async () => {
    if (!organizationId || !accessToken) return;
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.priority) params.set("priority", filters.priority);
      if (filters.search) params.set("search", filters.search);

      const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId };
      const res = await fetch(`${apiBaseUrl}/api/tickets?${params.toString()}`, { headers });
      if (res.ok) {
        const json = await res.json() as any;
        const data = json?.data ?? [];
        setTickets(data.map((t: any) => ({
          id: t.id,
          ticketNumber: t.ticketNumber || t.id?.substring(0, 8),
          title: t.title,
          description: t.description,
          status: t.status || "OPEN",
          priority: t.priority || "MEDIUM",
          category: t.category || "GENERAL_SUPPORT",
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          slaDueAt: t.slaDueAt,
          lastReplyAt: t.lastReplyAt
        })));
      }
    } catch (e) {
      console.error("Failed to fetch tickets", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketDetail = async (id: string) => {
    if (!organizationId || !accessToken) return;
    try {
      const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId };
      const res = await fetch(`${apiBaseUrl}/api/tickets/${id}`, { headers });
      if (res.ok) {
        const json = await res.json() as any;
        const t = json?.data;
        setSelectedTicket({
          id: t.id,
          ticketNumber: t.ticketNumber || t.id?.substring(0, 8),
          title: t.title,
          description: t.description,
          status: t.status || "OPEN",
          priority: t.priority || "MEDIUM",
          category: t.category || "GENERAL_SUPPORT",
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          slaDueAt: t.slaDueAt,
          lastReplyAt: t.lastReplyAt
        });
        setTicketComments((t.comments || []).map((c: any) => ({
          id: c.id,
          message: c.message,
          userRole: c.userRole,
          createdAt: c.createdAt,
          isInternalNote: c.isInternalNote
        })));
      }
    } catch (e) {
      console.error("Failed to fetch ticket", e);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [organizationId, accessToken, apiBaseUrl, filters]);

  const fetchProjects = async () => {
    if (!organizationId || !accessToken) return;
    try {
      const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId };
      const res = await fetch(`${apiBaseUrl}/api/projects`, { headers });
      if (res.ok) {
        const json = await res.json() as any;
        setProjects(json?.data ?? []);
      }
    } catch (e) {
      console.error("Failed to fetch projects", e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [organizationId, accessToken, apiBaseUrl]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !accessToken || !organizationId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          priority: newPriority,
          category: newCategory,
          projectId: newProjectId || undefined
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewDescription("");
        setNewPriority("MEDIUM");
        setNewCategory("GENERAL_SUPPORT");
        setNewProjectId("");
        setIsModalOpen(false);
        await fetchTickets();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket || !accessToken || !organizationId) return;

    setIsReplySubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/tickets/${selectedTicket.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-organization-id": organizationId,
        },
        body: JSON.stringify({
          message: replyMessage,
          userRole: "CLIENT"
        }),
      });

      if (res.ok) {
        setReplyMessage("");
        await fetchTicketDetail(selectedTicket.id);
        await fetchTickets();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsReplySubmitting(false);
    }
  };

  const isSlaOverdue = (ticket: Ticket) => {
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

  const filteredTickets = useMemo(() => tickets, [tickets]);

  if (isLoading) {
    return (
      <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="tickets">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="tickets">
      {selectedTicket ? (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedTicket(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </button>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-gray-500">{selectedTicket.ticketNumber}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[selectedTicket.status]}`}>
                  {selectedTicket.status.replace(/_/g, " ")}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${PRIORITY_COLORS[selectedTicket.priority]}`}>
                  {selectedTicket.priority}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedTicket.title}</h1>
            </div>

            <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-50">
              <div className="lg:col-span-2 p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Conversation</h3>

                {selectedTicket.description && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        {organizationId?.substring(0, 1) || "C"}
                      </div>
                      <span className="text-xs font-bold text-gray-500">You</span>
                      <span className="text-[10px] text-gray-400">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                )}

                {ticketComments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${comment.userRole === "ADMIN" ? "bg-indigo-100 text-indigo-600" : "bg-blue-100 text-blue-600"}`}>
                        {comment.userRole === "ADMIN" ? "A" : "C"}
                      </div>
                      <span className="text-xs font-bold text-gray-500">{comment.userRole === "ADMIN" ? "Support" : "You"}</span>
                      <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.message}</p>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={3}
                      className="w-full text-sm bg-transparent outline-none resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim() || isReplySubmitting}
                        className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        {isReplySubmitting ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50/50 space-y-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Ticket Info</h3>

                <div className="space-y-4">
                  <InfoItem label="Category" value={CATEGORIES.find((c) => c.value === selectedTicket.category)?.label || selectedTicket.category} />
                  <InfoItem label="Priority" value={selectedTicket.priority} />
                  <InfoItem label="Status" value={STATUSES.find((s) => s.value === selectedTicket.status)?.label || selectedTicket.status} />
                  <InfoItem label="Created" value={new Date(selectedTicket.createdAt).toLocaleDateString()} />
                  <InfoItem label="Last Updated" value={new Date(selectedTicket.updatedAt).toLocaleDateString()} />
                  {selectedTicket.slaDueAt && (
                    <InfoItem
                      label="SLA"
                      value={getTimeRemaining(selectedTicket.slaDueAt)}
                      highlight={isSlaOverdue(selectedTicket)}
                    />
                  )}
                </div>

                {["RESOLVED", "CLOSED"].includes(selectedTicket.status) && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        if (selectedTicket.status === "RESOLVED") {
                          setSelectedTicket(null);
                        }
                      }}
                      className="w-full h-10 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
                    >
                      {selectedTicket.status === "RESOLVED" ? "Confirm Resolution" : "Closed"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
              <p className="mt-1 text-gray-500">Support tickets and requests</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Ticket
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    placeholder="Search tickets..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                  {(filters.status || filters.priority) && (
                    <button
                      onClick={() => setFilters((f) => ({ ...f, status: "", priority: "" }))}
                      className="h-9 px-3 rounded-lg text-xs text-red-500 hover:bg-red-50"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {tickets.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <TicketIcon className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">No tickets</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new support ticket.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Ticket
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => fetchTicketDetail(ticket.id)}
                    className="p-6 hover:bg-gray-50/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-500">{ticket.ticketNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[ticket.status]}`}>
                            {ticket.status.replace(/_/g, " ")}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${PRIORITY_COLORS[ticket.priority]}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 truncate">{ticket.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">{ticket.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-gray-400">
                            {CATEGORIES.find((c) => c.value === ticket.category)?.label}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">
                            Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                          </span>
                          {ticket.slaDueAt && isSlaOverdue(ticket) && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                SLA Overdue
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Create New Ticket</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 sm:text-sm appearance-none bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 sm:text-sm appearance-none bg-white"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                {projects.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project (Optional)</label>
                    <div className="relative mt-1">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <select
                        value={newProjectId}
                        onChange={(e) => setNewProjectId(e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 sm:text-sm appearance-none bg-white"
                      >
                        <option value="">No Project</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 sm:text-sm resize-none"
                    placeholder="Please describe the issue or request in detail. Include any relevant steps to reproduce, expected vs actual results, etc."
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="inline-flex items-center justify-center min-w-[120px] rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-300 transition-colors"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      <p className={`text-sm font-medium mt-1 ${highlight ? "text-red-600" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
