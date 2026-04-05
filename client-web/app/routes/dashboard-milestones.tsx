import type { Route } from "./+types/dashboard-milestones";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarClock, AlertCircle, CheckCircle2, 
  Target, Clock, ChevronRight, Layers,
  ListTodo, Info, ArrowUpRight, Loader2
} from "lucide-react";
import DashboardLayout, { getStoredAuth } from "../features/dashboard/components/DashboardLayout";
import { resolveApiBaseUrl } from "../utils/api-base";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

type Milestone = {
  id: string;
  title: string;
  status: string;
  progress: number;
  dueDate: string;
  description?: string;
  isOverdue: boolean;
  taskCount: number;
  project?: { name: string };
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
    { title: "Project Roadmap | Futurexa.ai" },
    { name: "description", content: "Track your project's progress and key milestones." },
  ];
}

export default function DashboardMilestones(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.accessToken && stored?.organizationId) {
      setAccessToken(stored.accessToken);
      setOrganizationId(stored.organizationId);
      setUserStatus(stored.userStatus || null);
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    if (!organizationId || !accessToken) return;
    
    async function fetchData() {
      setIsLoading(true);
      try {
        const headers: Record<string, string> = { 
          Authorization: `Bearer ${accessToken}`, 
          "x-organization-id": organizationId as string 
        };
        const res = await fetch(`${apiBaseUrl}/api/milestones`, { headers });

        if (res.ok) {
          const json = await res.json() as any;
          const data = json?.data ?? [];
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          setMilestones(data.map((m: any) => {
            const status = m.status || "PENDING";
            
            // Calculate progress based on status
            let progress = 0;
            if (status === "COMPLETED") progress = 100;
            else if (status === "READY_FOR_REVIEW") progress = 90;
            else if (status === "IN_PROGRESS") progress = 65;
            else if (status === "SCHEDULED") progress = 35;
            else progress = 10;

            const due = m.dueDate ? new Date(m.dueDate) : null;
            const isOverdue = !!due && due < now && status !== "COMPLETED";

            return {
              id: m.id,
              title: m.title || m.name,
              status,
              progress,
              dueDate: due ? due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD",
              description: m.description,
              isOverdue,
              taskCount: m.tasks?.length || 0,
              project: m.project
            };
          }));
        }
      } catch (e) {
        console.error("Failed to fetch milestones", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [organizationId, accessToken, apiBaseUrl]);

  const stats = useMemo(() => {
    const completed = milestones.filter(m => m.status === "COMPLETED").length;
    const overdue = milestones.filter(m => m.isOverdue).length;
    const total = milestones.length;
    const overallProgress = total > 0 
      ? Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / total) 
      : 0;

    return { completed, overdue, total, overallProgress };
  }, [milestones]);

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="milestones">
      <div className="mx-auto max-w-6xl pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <p className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">Live Project Roadmap</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">Milestones</h1>
            <p className="text-lg text-gray-500 font-medium max-w-lg leading-relaxed">
              Track your project's evolution through key phases and delivery targets.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-4"
          >
            <div className="px-6 py-4 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Completed</p>
                <p className="text-xl font-black text-gray-900">{stats.completed}/{stats.total}</p>
              </div>
            </div>
            <div className="px-6 py-4 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Progress</p>
                <p className="text-xl font-black text-gray-900">{stats.overallProgress}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Overview Stats Card (Mobile only) */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:hidden">
            <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-lg font-black text-emerald-600">{stats.completed} Done</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Average</p>
                <p className="text-lg font-black text-blue-600">{stats.overallProgress}%</p>
            </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Roadmap...</p>
              </div>
            ) : milestones.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-8"
              >
                <div className="h-20 w-20 rounded-[2rem] bg-gray-50 flex items-center justify-center mb-6">
                  <Layers className="h-10 w-10 text-gray-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Roadmap Pending</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  Your project milestones are currently being drafted by the team. They will appear here once finalized.
                </p>
              </motion.div>
            ) : (
              milestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white border-t-2 border-l-2 p-8 md:p-10 shadow-xl shadow-blue-100/10 hover:shadow-2xl hover:shadow-blue-200/20 hover:-translate-y-1 transition-all duration-500"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${
                    milestone.status === "COMPLETED" ? "bg-emerald-500" :
                    milestone.isOverdue ? "bg-red-500" :
                    "bg-blue-600"
                  }`} />

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                          milestone.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                          milestone.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                          milestone.status === "READY_FOR_REVIEW" ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {milestone.status.replace(/_/g, " ")}
                        </span>
                        {milestone.isOverdue && (
                          <span className="px-4 py-1.5 rounded-full bg-red-500 text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-lg shadow-red-200">
                            <AlertCircle className="h-3 w-3" />
                            Overdue
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                          <Target className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[150px]">{milestone.project?.name || "Global"}</span>
                        </div>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {milestone.title}
                      </h3>
                      
                      {milestone.description && (
                        <p className="text-gray-500 font-medium leading-relaxed max-w-2xl mb-6">
                          {milestone.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                            <ListTodo className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tasks Linked</p>
                            <p className="text-sm font-black text-gray-900">{milestone.taskCount} Updates</p>
                          </div>
                        </div>
                        <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 md:h-12 md:w-12 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                            milestone.isOverdue ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100"
                          }`}>
                            <CalendarClock className={`h-5 w-5 ${milestone.isOverdue ? "text-red-500" : "text-gray-400 group-hover:text-blue-500"}`} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Date</p>
                            <p className={`text-sm font-black ${milestone.isOverdue ? "text-red-600" : "text-gray-900"}`}>{milestone.dueDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-72 shrink-0">
                      <div className="flex items-center justify-between mb-3 text-sm font-black text-gray-900">
                        <span className="uppercase tracking-widest text-[10px] text-gray-400">Total Progress</span>
                        <span className="text-blue-600">{milestone.progress}%</span>
                      </div>
                      <div className="relative h-4 w-full rounded-full bg-gray-100 overflow-hidden shadow-inner">
                        <motion.div 
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                            milestone.status === "COMPLETED" ? "bg-emerald-500" :
                            milestone.isOverdue ? "bg-red-500" :
                            "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${milestone.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-progress-shine" />
                      </div>
                      
                      <div className="mt-8">
                        <button 
                          onClick={() => navigate(`/dashboard/milestones/${milestone.id}`)}
                          className="w-full h-12 rounded-2xl bg-gray-50 border border-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-sm"
                        >
                          <Info className="h-4 w-4" />
                          View Phase Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Right Decoration */}
                  <div className="absolute top-6 right-6 p-2 rounded-xl bg-gray-50/50 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer">
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Support Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-10 rounded-[3rem] bg-indigo-600 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white mb-2">Need to adjust the roadmap?</h3>
            <p className="text-indigo-100 font-medium max-w-md">
              Schedule a call with your project manager to discuss changes to upcoming milestones or delivery schedules.
            </p>
          </div>
          <button 
            onClick={() => navigate("/dashboard/ticket")}
            className="relative z-10 h-14 px-10 rounded-2xl bg-white text-indigo-600 font-black hover:bg-indigo-50 hover:-translate-y-1 transition-all active:translate-y-0 shadow-xl shadow-indigo-900/20"
          >
            Open Support Ticket
          </button>
          
          {/* Decorative background circles */}
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        </motion.div>
      </div>

      <style>{`
        @keyframes progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-shine {
          animation: progress-shine 3s infinite;
        }
      `}</style>
    </DashboardLayout>
  );
}
