import type { Route } from "./+types/home";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  FolderKanban,
  ListTodo,
  Files,
  MessageCircle,
  CreditCard,
  Activity,
  Ticket,
  CalendarClock,
  Rocket,
  Settings,
  Plus,
  CircleCheckBig,
  Clock3,
} from "lucide-react";
import { clsx } from "clsx";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "futurexa.ai | Customer Dashboard" },
    { name: "description", content: "Customer dashboard for projects, milestones, tasks, tickets, files, deployments, and billing." },
  ];
}

const sideNav = [
  { key: "overview", label: "Overview", icon: FolderKanban },
  { key: "milestones", label: "Milestones", icon: CalendarClock },
  { key: "tasks", label: "Tasks", icon: ListTodo },
  { key: "tickets", label: "Tickets", icon: Ticket },
  { key: "files", label: "Files", icon: Files },
  { key: "deployments", label: "Deployments", icon: Rocket },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "activity", label: "Activity", icon: Activity },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Home(_: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-[780px] w-[780px] rounded-full bg-blue-100/50 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[620px] w-[620px] rounded-full bg-purple-100/40 blur-[110px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-56">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-600/30">
              F
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Customer Dashboard</p>
              <p className="text-lg font-bold tracking-tight">futurexa.ai</p>
            </div>
          </div>
          <div className="hidden w-[28rem] items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-2.5 shadow-sm md:flex">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Search projects, tasks, files..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:block">
              Secure Tenant
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-10 pt-6 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-blue-100/20 backdrop-blur-xl lg:h-[calc(100vh-8.2rem)] lg:sticky lg:top-24">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Navigation</p>
            <h2 className="text-base font-bold text-gray-900">My Workspace</h2>
          </div>
          <nav className="space-y-1.5">
            {sideNav.map((item, i) => {
              const Icon = item.icon;
              const isActive = i === 0;
              return (
                <button
                  key={item.key}
                  className={clsx(
                    "w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </aside>

        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Project Status", value: "In Progress", sub: "SaaS Platform v1" },
              { label: "Overall Progress", value: "68%", sub: "Target launch in 42 days" },
              { label: "Open Tasks", value: "19", sub: "7 due this week" },
              { label: "Open Tickets", value: "5", sub: "2 high priority" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-blue-100/20 backdrop-blur-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="mt-1 text-sm text-gray-500">{item.sub}</p>
              </motion.div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-5">
            <div className="xl:col-span-2 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
              <h3 className="text-lg font-bold">Project Overview</h3>
              <p className="mt-1 text-sm text-gray-500">Primary project details and timeline context for customer visibility.</p>
              <div className="mt-5 space-y-3">
                {[
                  { label: "Project", value: "B2B SaaS Platform" },
                  { label: "Current Phase", value: "Development" },
                  { label: "Deadline", value: "2026-07-30" },
                  { label: "Team", value: "1 PM, 2 Developers, 1 Designer" },
                ].map((row) => (
                  <div key={row.label} className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-xs font-semibold text-gray-500">{row.label}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-3 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Upcoming Milestones</h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">5 Phases</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Discovery", due: "2026-03-20", progress: 100, status: "Completed" },
                  { title: "Design", due: "2026-04-05", progress: 100, status: "Completed" },
                  { title: "Development", due: "2026-06-30", progress: 62, status: "In Progress" },
                  { title: "Testing", due: "2026-07-14", progress: 0, status: "Pending" },
                  { title: "Deployment", due: "2026-07-30", progress: 0, status: "Pending" },
                ].map((milestone) => (
                  <div key={milestone.title} className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{milestone.title}</p>
                      <span className="text-xs font-semibold text-gray-500">{milestone.status}</span>
                    </div>
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${milestone.progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-500">Due: {milestone.due}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-bold">Tasks</h3>
              <div className="space-y-2">
                {[
                  { title: "Implement authentication flow", status: "In Progress", icon: Clock3 },
                  { title: "Create database schema", status: "Review", icon: Clock3 },
                  { title: "Design landing page", status: "Completed", icon: CircleCheckBig },
                ].map((task) => {
                  const Icon = task.icon;
                  return (
                    <div key={task.title} className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <Icon className={clsx("h-4 w-4", task.status === "Completed" ? "text-emerald-600" : "text-blue-600")} />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{task.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-bold">Tickets & Support</h3>
              <div className="space-y-2">
                {[
                  { id: "TCK-104", type: "Bug Report", status: "Investigating" },
                  { id: "TCK-099", type: "Feature Request", status: "In Progress" },
                  { id: "TCK-096", type: "Infrastructure", status: "Resolved" },
                ].map((ticketItem) => (
                  <div key={ticketItem.id} className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{ticketItem.id}</p>
                      <span className="text-xs font-semibold text-blue-700">{ticketItem.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{ticketItem.type}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/20 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-bold">Deployments & Billing</h3>
              <div className="space-y-2">
                {[
                  { icon: Rocket, label: "Latest Deployment", value: "v1.1.0 on Staging" },
                  { icon: Files, label: "Shared Files", value: "126 assets in R2" },
                  { icon: CreditCard, label: "Current Plan", value: "Pro - Monthly" },
                  { icon: CreditCard, label: "Pending Invoices", value: "2 invoices due" },
                  { icon: MessageCircle, label: "Recent Comment", value: "@client please review design" },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <Icon className="h-3.5 w-3.5 text-blue-600" />
                        {row.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{row.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
