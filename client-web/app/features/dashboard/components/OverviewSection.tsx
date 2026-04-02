import { motion } from "framer-motion";
import { CreditCard, Files, Rocket, Briefcase, Flag, CheckSquare, Ticket as TicketIcon, Clock } from "lucide-react";

export default function OverviewSection({
  liveProjects,
  liveMilestones,
  liveTasks,
  liveTickets,
  liveDeployments,
  liveFiles,
  liveSubscriptions,
}: {
  liveProjects: Array<{ id: string | number; title: string; status: string }>;
  liveMilestones: Array<{
    id: string | number;
    title: string;
    status: string;
    progress: number;
    dueDate: string;
  }>;
  liveTasks: Array<{ id: string | number; title: string; status: string }>;
  liveTickets: Array<{ id: string | number; title: string; status: string }>;
  liveDeployments: Array<{ id: string | number; title: string; status: string }>;
  liveFiles: Array<{ id: string | number; title: string; status: string }>;
  liveSubscriptions: Array<{ id: string | number; title: string; status: string }>;
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const topStats = [
    { label: "Projects", value: liveProjects.length, sub: "Active workspaces", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Milestones", value: liveMilestones.length, sub: "Tracked phases", icon: Flag, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Tasks", value: liveTasks.length, sub: "Action items", icon: CheckSquare, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Tickets", value: liveTickets.length, sub: "Support requests", icon: TicketIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topStats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} transition-transform group-hover:scale-110`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project & Milestones Context (Takes up 2 cols) */}
        <motion.div variants={item} className="lg:col-span-2 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm flex flex-col relative overflow-hidden group/card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />
          
          <div className="mb-8 flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Project Roadmap</h3>
              <p className="text-sm text-gray-500 font-medium">Upcoming delivery targets and phases</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform group-hover/card:scale-110">
                <Flag className="h-5 w-5" />
            </div>
          </div>
          
          <div className="space-y-5 flex-1 relative z-10">
            {liveMilestones.length === 0 ? (
              <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-gray-50 p-8 text-center bg-gray-50/30">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-3">
                    <Flag className="h-6 w-6 text-gray-200" />
                </div>
                <p className="text-sm font-bold text-gray-400">No milestones tracked yet.</p>
              </div>
            ) : (
              liveMilestones.slice(0, 3).map((milestone) => {
                const isOverdue = milestone.dueDate && new Date(milestone.dueDate) < new Date() && milestone.status !== "COMPLETED";
                return (
                  <div key={milestone.id} className="group/item relative rounded-3xl border border-gray-50 bg-gray-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-0.5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${isOverdue ? "bg-red-500 animate-pulse" : "bg-indigo-500"}`} />
                        <p className="font-black text-gray-900 tracking-tight">{milestone.title}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        milestone.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" :
                        isOverdue ? "bg-red-50 text-red-600" :
                        "bg-indigo-50 text-indigo-600"
                      }`}>
                        {milestone.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 mb-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                            milestone.status === "COMPLETED" ? "bg-emerald-500" :
                            isOverdue ? "bg-red-500" : "bg-indigo-500"
                        }`} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-bold">
                            <Clock className="h-3 w-3" />
                            {milestone.dueDate || "TBD"}
                        </span>
                      </div>
                      <span className="text-indigo-600 font-black">{milestone.progress}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Quick Operations panel */}
        <motion.div variants={item} className="flex flex-col gap-6">
          <div className="flex-1 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Recent Tasks</h3>
            <div className="space-y-3">
              {liveTasks.length === 0 ? (
                <div className="flex h-[100px] items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500">
                  No active tasks.
                </div>
              ) : (
                liveTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/50 p-3 transition-colors hover:bg-white hover:shadow-sm">
                    <p className="truncate text-sm font-medium text-gray-800 pr-4">{task.title}</p>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-1 rounded-md">{task.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg text-white relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-1">Operations</h3>
              <p className="text-xs text-gray-400 mb-5">Quick workspace stats</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <Rocket className="mb-2 h-5 w-5 text-blue-400" />
                  <p className="text-2xl font-bold">{liveDeployments.length}</p>
                  <p className="text-xs text-gray-300">Deployments</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <Files className="mb-2 h-5 w-5 text-emerald-400" />
                  <p className="text-2xl font-bold">{liveFiles.length}</p>
                  <p className="text-xs text-gray-300">Files</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
