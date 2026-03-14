import { motion } from "framer-motion";
import {
  Building2,
  Users,
  ClipboardList,
  FolderKanban,
  ListTodo,
  Files,
  Ticket,
  Rocket,
  KeyRound,
  CreditCard,
  ChartNoAxesCombined,
  Activity,
  Plug,
  Bell,
  ShieldCheck,
  Search,
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

const navItems = [
  { id: "overview", label: "Overview", icon: ChartNoAxesCombined },
  { id: "organizations", label: "Organizations", icon: Building2 },
  { id: "users", label: "Users", icon: Users },
  { id: "requests", label: "Project Requests", icon: ClipboardList },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "deployments", label: "Deployments", icon: Rocket },
  { id: "secrets", label: "Secrets", icon: KeyRound },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "logs", label: "Activity Logs", icon: Activity },
  { id: "integrations", label: "Integrations", icon: Plug },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-indigo-100/50 blur-[110px]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[560px] w-[560px] rounded-full bg-blue-100/45 blur-[110px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Super Admin CRM</p>
              <p className="text-lg font-bold tracking-tight">futurexa.ai</p>
            </div>
          </div>

          <div className="hidden w-[28rem] items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-2.5 shadow-sm md:flex">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Search organizations, requests, users..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="hidden rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 sm:block">
              Super Admin
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 pb-10 pt-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-indigo-100/20 backdrop-blur-xl lg:h-[calc(100vh-8.2rem)] lg:sticky lg:top-24">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Navigation</p>
            <h2 className="text-base font-bold text-gray-900">Control Modules</h2>
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={clsx(
                    "w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
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
        </aside>

        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Organizations", value: "52", sub: "4 pending onboarding" },
              { label: "Project Requests", value: "18", sub: "6 waiting review" },
              { label: "Open Tickets", value: "27", sub: "8 high priority" },
              { label: "MRR", value: "$84,230", sub: "+11.8% this month" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-indigo-100/20 backdrop-blur-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="mt-1 text-sm text-gray-500">{item.sub}</p>
              </motion.div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-5">
            <div className="xl:col-span-2 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-indigo-100/20 backdrop-blur-xl">
              <h3 className="text-lg font-bold">Client Request Pipeline</h3>
              <p className="mt-1 text-sm text-gray-500">New → Review → Approved → Converted to Project</p>
              <div className="mt-4 space-y-3">
                {[
                  { title: "Build SaaS platform", status: "New", budget: "$50k - $80k" },
                  { title: "Enterprise admin panel", status: "Review", budget: "$35k - $60k" },
                  { title: "Cloud migration", status: "Approved", budget: "$40k - $55k" },
                  { title: "AI support layer", status: "Converted", budget: "$18k - $26k" },
                ].map((request) => (
                  <div key={request.title} className="rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{request.title}</p>
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{request.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Budget: {request.budget}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-3 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-indigo-100/20 backdrop-blur-xl">
              <h3 className="text-lg font-bold">Delivery Operations</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { title: "Milestones", value: "142 active", icon: ListTodo },
                  { title: "Tasks", value: "1,284 open", icon: ListTodo },
                  { title: "Tickets", value: "27 open", icon: Ticket },
                  { title: "Deployments", value: "14 this week", icon: Rocket },
                  { title: "Secrets", value: "96 managed", icon: KeyRound },
                  { title: "Files", value: "2.4 TB stored", icon: Files },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      </div>
                      <p className="mt-3 text-sm font-medium text-gray-700">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-indigo-100/20 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-bold">Billing Control</h3>
              <div className="space-y-2">
                {[
                  "Plans and subscriptions",
                  "Payments and settlements",
                  "Invoices and dunning",
                  "Usage-based pricing prep",
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-indigo-100/20 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-bold">Security & Compliance</h3>
              <div className="space-y-2">
                {[
                  "Authentication and session audits",
                  "Authorization and RBAC policy checks",
                  "Tenant isolation verification",
                  "Rate limiting and abuse control",
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-indigo-100/20 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-bold">Integrations & Alerts</h3>
              <div className="space-y-2">
                {[
                  "Slack, GitHub, Zapier, Google Drive",
                  "Webhooks for external systems",
                  "Resend email notifications",
                  "Twilio SMS notifications",
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
