  import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Briefcase,
  Flag,
  Ticket,
  FileBox,
  CreditCard,
  Activity,
  UserCheck,
  Search,
  Bell,
  Loader2,
  ExternalLink,
  ListTodo,
  Rocket,
} from "lucide-react";
import "./index.css";

import PendingLeadsPage from "./pages/PendingLeadsPage";
import OrganizationsPage from "./pages/OrganizationsPage";
import UsersPage from "./pages/UsersPage";
import ProjectsPage from "./pages/ProjectsPage";
import MilestonesPage from "./pages/MilestonesPage";
import TasksPage from "./pages/TasksPage";
import TicketsPage from "./pages/TicketsPage";
import BillingPage from "./pages/BillingPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import DeploymentsPage from "./pages/DeploymentsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import WebhooksPage from "./pages/WebhooksPage";
import FilesPage from "./pages/FilesPage";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";

type Stats = {
  organizations: number;
  users: number;
  pendingLeads: number;
};

const sections: Array<{ name: string; icon: typeof Building2; key: "organizations" | "users" | "pendingLeads" | null }> = [
  { name: "Organizations", icon: Building2, key: "organizations" },
  { name: "Users", icon: Users, key: "users" },
  { name: "Pending Leads", icon: UserCheck, key: "pendingLeads" },
  { name: "Projects", icon: Briefcase, key: null },
  { name: "Milestones", icon: Flag, key: null },
  { name: "Tasks", icon: ListTodo, key: null },
  { name: "Tickets", icon: Ticket, key: null },
  { name: "Files", icon: FileBox, key: null },
  { name: "Deployments", icon: Rocket, key: null },
  { name: "Integrations", icon: ExternalLink, key: null },
  { name: "Webhooks", icon: Bell, key: null },
  { name: "Billing", icon: CreditCard, key: null },
  { name: "Activity Logs", icon: Activity, key: null },
];

function sectionNameToPath(sectionName: string | null) {
  if (!sectionName) return "/admin";
  switch (sectionName) {
    case "Organizations": return "/admin/organizations";
    case "Users": return "/admin/users";
    case "Pending Leads": return "/admin/leads";
    case "Projects": return "/admin/project";
    case "Milestones": return "/admin/milestones";
    case "Tasks": return "/admin/tasks";
    case "Tickets": return "/admin/ticket";
    case "Files": return "/admin/files";
    case "Deployments": return "/admin/deployments";
    case "Integrations": return "/admin/integrations";
    case "Webhooks": return "/admin/webhooks";
    case "Billing": return "/admin/billing";
    case "Activity Logs": return "/admin/activity";
    default: return "/admin";
  }
}

function pathToSectionName(pathname: string): string | null {
  const trimmed = pathname.replace(/\/+$/, "");
  const parts = trimmed.split("/");
  const last = parts[parts.length - 1];
  switch (last) {
    case "admin": case "": return null;
    case "organizations": return "Organizations";
    case "users": return "Users";
    case "leads": return "Pending Leads";
    case "project": return "Projects";
    case "milestones": return "Milestones";
    case "tasks": return "Tasks";
    case "ticket": return "Tickets";
    case "files": return "Files";
    case "deployments": return "Deployments";
    case "integrations": return "Integrations";
    case "webhooks": return "Webhooks";
    case "billing": return "Billing";
    case "activity": return "Activity Logs";
    default: return null;
  }
}

export default function App() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const statsRes = await fetch(`${API_BASE}/api/admin/stats`);
      const statsData = await statsRes.json();
      if (statsData?.data) setStats(statsData.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const syncFromPath = () => {
      setActiveSection(pathToSectionName(window.location.pathname));
    };

    syncFromPath();
    window.addEventListener("popstate", syncFromPath);
    return () => window.removeEventListener("popstate", syncFromPath);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((r) => r.json())
      .then((p) => setApiStatus(p.status ?? (p.ok ? "ok" : "unknown")))
      .catch(() => setApiStatus("unreachable"));

    fetchStats();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans selection:bg-blue-100 selection:text-blue-900 text-gray-900">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 z-50 shadow-sm">
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Admin CRM</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                <div className={`h-2 w-2 rounded-full ${apiStatus === "ok" ? "bg-green-500" : "bg-red-500"}`} />
                API: {apiStatus}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <button
            onClick={() => {
              setActiveSection(null);
              window.history.pushState({}, "", sectionNameToPath(null));
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
              activeSection === null
                ? 'bg-gray-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Building2 className={`h-5 w-5 ${activeSection === null ? 'text-white' : 'text-gray-400'}`} />
            Overview Dashboard
          </button>

          <div className="pt-6 pb-2 px-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</p>
          </div>

          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.name;
            const count = section.key !== null && stats ? stats[section.key] : null;

            return (
              <button
                key={section.name}
                onClick={() => {
                  setActiveSection(section.name);
                  window.history.pushState({}, "", sectionNameToPath(section.name));
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {section.name}
                </div>
                {count !== null && count > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-8 flex-shrink-0 z-40">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search anything..." className="h-10 pl-10 pr-4 rounded-full bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all w-64 text-gray-900" />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <Bell className="h-5 w-5" />
              {stats?.pendingLeads ? <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white" /> : null}
            </button>
            <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 w-full max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeSection ? activeSection : 'Platform Overview'}
              </h2>
              <p className="text-gray-500 font-medium">
                {activeSection
                  ? `Manage and monitor all ${activeSection.toLowerCase()}`
                  : 'Monitor system events, organizations, and lifecycle approvals.'}
              </p>
            </div>
            <button onClick={fetchStats} className="h-10 px-5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-md flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
              {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Data"}
            </button>
          </div>

          {!activeSection && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {sections.map((section) => {
                const Icon = section.icon;
                const count = section.key !== null && stats ? stats[section.key] : null;

                return (
                  <div
                    key={section.name}
                    onClick={() => {
                      setActiveSection(section.name);
                      window.history.pushState({}, "", sectionNameToPath(section.name));
                    }}
                    className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:translate-x-2 duration-500 pointer-events-none">
                      <Icon className="h-24 w-24" />
                    </div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="h-12 w-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      {statsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
                      ) : count !== null ? (
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          {count}
                        </span>
                      ) : null}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{section.name}</h3>
                      <p className="text-gray-500 text-sm">Click to manage</p>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {(!activeSection || activeSection === "Pending Leads") && <PendingLeadsPage />}
          {activeSection === "Organizations" && <OrganizationsPage />}
          {activeSection === "Users" && <UsersPage />}
          {activeSection === "Projects" && <ProjectsPage />}
          {activeSection === "Milestones" && <MilestonesPage />}
          {activeSection === "Tasks" && <TasksPage />}
          {activeSection === "Tickets" && <TicketsPage />}
          {activeSection === "Files" && <FilesPage />}
          {activeSection === "Deployments" && <DeploymentsPage />}
          {activeSection === "Integrations" && <IntegrationsPage />}
          {activeSection === "Webhooks" && <WebhooksPage />}
          {activeSection === "Billing" && <BillingPage />}
          {activeSection === "Activity Logs" && <ActivityLogsPage />}
        </main>
      </div>
    </div>
  );
}