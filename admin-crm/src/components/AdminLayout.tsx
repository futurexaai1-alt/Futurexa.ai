import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Activity,
  Bell,
  Briefcase,
  Building2,
  CreditCard,
  ExternalLink,
  FileBox,
  Flag,
  ListTodo,
  Rocket,
  Ticket,
  UserCheck,
  Users,
} from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

export const navItems = [
  { name: "Organizations", icon: Building2, path: "/admin/organizations" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Pending Leads", icon: UserCheck, path: "/admin/leads" },
  { name: "Projects", icon: Briefcase, path: "/admin/project" },
  { name: "Milestones", icon: Flag, path: "/admin/milestones" },
  { name: "Tasks", icon: ListTodo, path: "/admin/tasks" },
  { name: "Tickets", icon: Ticket, path: "/admin/ticket" },
  { name: "Files", icon: FileBox, path: "/admin/files" },
  { name: "Deployments", icon: Rocket, path: "/admin/deployments" },
  { name: "Integrations", icon: ExternalLink, path: "/admin/integrations" },
  { name: "Webhooks", icon: Bell, path: "/admin/webhooks" },
  { name: "Billing", icon: CreditCard, path: "/admin/billing" },
  { name: "Activity Logs", icon: Activity, path: "/admin/activity" },
];

function pathToKey(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  const parts = trimmed.split("/");
  const last = parts[parts.length - 1];
  const pathToKeyMap: Record<string, string> = {
    "admin": "Organizations",
    "organizations": "Organizations",
    "users": "Users",
    "leads": "Pending Leads",
    "project": "Projects",
    "milestones": "Milestones",
    "tasks": "Tasks",
    "ticket": "Tickets",
    "files": "Files",
    "deployments": "Deployments",
    "integrations": "Integrations",
    "webhooks": "Webhooks",
    "billing": "Billing",
    "activity": "Activity Logs",
  };
  return pathToKeyMap[last] || "Organizations";
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection = pathToKey(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-100 bg-white p-4 flex flex-col">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white font-bold">
            A
          </div>
          <div>
            <p className="font-semibold text-gray-900">Admin CRM</p>
            <p className="text-xs text-gray-500">Management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                item.name === activeSection
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}