import { useState, useMemo } from "react";
import {
  ArrowLeft, Loader2, CheckCircle2, Clock, FileText,
  MessageSquare, Calendar, BarChart3,
  Download, Eye, ShieldAlert, Activity,
  ThumbsUp, AlertTriangle, CheckSquare, ListTodo,
  File, Image, Code, Archive, Send, ExternalLink
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";

interface MilestoneData {
  id: string;
  title: string;
  description: string;
  status: string;
  progressPercent: number;
  dueDate: string;
  startDate: string;
  createdAt: string;
  expectedDeliverables: string;
  stageBreakdown: any[];
  project: { name: string };
  tasks: any[];
  updates: any[];
  deliverables: any[];
  blockers: any[];
  approvals: any[];
}

interface ClientMilestoneDetailProps {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
}

export default function ClientMilestoneDetail({ supabaseUrl, supabaseAnonKey, apiBaseUrl }: ClientMilestoneDetailProps) {
  const navigate = useNavigate();
  const params = useParams();
  const milestoneId = params.milestoneId;

  const [activeTab, setActiveTab] = useState<"overview" | "updates" | "deliverables">("overview");
  const [milestone, setMilestone] = useState<MilestoneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  const defaultStages = [
    { name: "Planning", status: "PENDING", estimatedDays: 5, notes: "Initial planning and resource allocation." },
    { name: "Design", status: "PENDING", estimatedDays: 10, notes: "UI/UX design and prototyping." },
    { name: "Development", status: "PENDING", estimatedDays: 20, notes: "Core development and integration." },
    { name: "Testing", status: "PENDING", estimatedDays: 7, notes: "QA, testing, and bug fixes." },
    { name: "Deployment", status: "PENDING", estimatedDays: 3, notes: "Production deployment and monitoring." },
    { name: "Handover", status: "PENDING", estimatedDays: 2, notes: "Documentation and client training." }
  ];

  const stats = useMemo(() => {
    if (!milestone) return null;
    const totalTasks = milestone.tasks?.length || 0;
    const completedTasks = milestone.tasks?.filter((t: any) => t.status === "DONE" || t.status === "COMPLETED").length || 0;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : milestone.progressPercent || 0;
    const openBlockers = milestone.blockers?.filter((b: any) => b.status === "OPEN").length || 0;
    const deliverablesCount = milestone.deliverables?.length || 0;
    let daysRemaining = 0;
    if (milestone.dueDate) {
      const diff = Math.ceil((new Date(milestone.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.max(0, diff);
    }
    const stages = milestone.stageBreakdown || defaultStages;
    return { totalTasks, completedTasks, progress, openBlockers, deliverablesCount, daysRemaining, completedStages: stages.filter((s: any) => s.status === "DONE").length, totalStages: stages.length };
  }, [milestone]);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const storedAuth = sessionStorage.getItem("futurexa_auth");
      const authData = storedAuth ? JSON.parse(storedAuth) : {};
      const token = authData.accessToken;

      const response = await fetch(`${apiBaseUrl}/api/milestones/${milestoneId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-organization-id": authData.organizationId
        },
        body: JSON.stringify({
          approvedById: authData.userId || "client",
          comment: approvalComment
        })
      });

      if (!response.ok) throw new Error("Failed to approve");
      setIsApprovalModalOpen(false);
      setApprovalComment("");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRevision = async () => {
    setIsSubmitting(true);
    try {
      const storedAuth = sessionStorage.getItem("futurexa_auth");
      const authData = storedAuth ? JSON.parse(storedAuth) : {};
      const token = authData.accessToken;

      const response = await fetch(`${apiBaseUrl}/api/milestones/${milestoneId}/revision-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-organization-id": authData.organizationId
        },
        body: JSON.stringify({
          approvedById: authData.userId || "client",
          comment: approvalComment
        })
      });

      if (!response.ok) throw new Error("Failed to request revision");
      setIsApprovalModalOpen(false);
      setApprovalComment("");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="milestones">
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-black tracking-widest uppercase text-[10px]">Loading Milestone...</p>
      </div>
    </DashboardLayout>
  );

  if (error || !milestone) return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="milestones">
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center mb-6"><ShieldAlert className="h-10 w-10 text-red-500" /></div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Error Loading Milestone</h3>
        <p className="text-gray-500 font-medium max-w-xs mb-8">{error || "Milestone not found."}</p>
        <button onClick={() => navigate("/dashboard/milestones")} className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-all">Go Back</button>
      </div>
    </DashboardLayout>
  );

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "updates", label: "Updates", icon: Activity },
    { key: "deliverables", label: "Deliverables", icon: File }
  ];

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="milestones">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard/milestones")} className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm"><ArrowLeft className="h-5 w-5" /></button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">{milestone.project?.name}</span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase ${milestone.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : milestone.status === "BLOCKED" ? "bg-red-100 text-red-700" : milestone.status === "READY_FOR_REVIEW" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{milestone.status.replace(/_/g, " ")}</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{milestone.title}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniStatCard icon={BarChart3} label="Progress" value={`${stats?.progress}%`} color={stats?.progress >= 75 ? "emerald" : stats?.progress >= 50 ? "amber" : "red"} />
          <MiniStatCard icon={CheckSquare} label="Tasks" value={`${stats?.completedTasks}/${stats?.totalTasks}`} color="blue" />
          <MiniStatCard icon={Calendar} label="Days Left" value={`${stats?.daysRemaining}d`} color={stats?.daysRemaining <= 3 ? "amber" : "emerald"} />
          <MiniStatCard icon={File} label="Files" value={stats?.deliverablesCount || 0} color="gray" />
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.key ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
                <tab.icon className="h-4 w-4" />{tab.label}
              </button>
            ))}
          </div>
          <div className="p-8">
            {activeTab === "overview" && <OverviewTab milestone={milestone} stats={stats} />}
            {activeTab === "updates" && <UpdatesTab updates={milestone.updates || []} expandedComments={expandedComments} newComment={newComment} onToggleComments={(id) => setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }))} onCommentChange={(id, value) => setNewComment((prev) => ({ ...prev, [id]: value }))} />}
            {activeTab === "deliverables" && <DeliverablesTab deliverables={milestone.deliverables || []} />}
          </div>
        </div>

        {milestone.status === "READY_FOR_REVIEW" && (
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-widest">Review Required</span>
            </div>
            <p className="text-white/80 mb-4">This milestone is ready for your review. Please review the deliverables and either approve or request revisions.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsApprovalModalOpen(true)} className="flex-1 h-12 rounded-xl bg-white text-indigo-600 font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4" />Review & Approve</button>
            </div>
          </div>
        )}

        {milestone.status === "COMPLETED" && (
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-lg font-black uppercase tracking-widest">Milestone Approved</span>
            </div>
          </div>
        )}

        {isApprovalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsApprovalModalOpen(false)} />
            <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
              <h2 className="text-xl font-black text-gray-900 mb-6">Review Milestone</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200"><p className="text-sm font-medium text-amber-800">Please review all deliverables and updates before approving this milestone.</p></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Comment (Optional)</label><textarea value={approvalComment} onChange={(e) => setApprovalComment(e.target.value)} rows={3} placeholder="Add feedback or notes..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none resize-none" /></div>
                <div className="flex gap-3 pt-4">
                  <button onClick={handleRequestRevision} disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all disabled:opacity-50">Request Revision</button>
                  <button onClick={handleApprove} disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all disabled:opacity-50">{isSubmitting ? "Processing..." : "Approve"}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function MiniStatCard({ icon: Icon, label, value, color }: any) {
  const colorMap: Record<string, string> = { indigo: "bg-indigo-50 text-indigo-600", blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600", gray: "bg-gray-50 text-gray-600" };
  return (<div className={`rounded-2xl p-4 ${colorMap[color]}`}><div className="flex items-center gap-2 mb-2"><Icon className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div><span className="text-xl font-black">{value}</span></div>);
}

function OverviewTab({ milestone, stats }: { milestone: any; stats: any }) {
  const stages = milestone.stageBreakdown || [
    { name: "Planning", status: "PENDING", estimatedDays: 5, notes: "Initial planning and resource allocation." },
    { name: "Design", status: "PENDING", estimatedDays: 10, notes: "UI/UX design and prototyping." },
    { name: "Development", status: "PENDING", estimatedDays: 20, notes: "Core development and integration." },
    { name: "Testing", status: "PENDING", estimatedDays: 7, notes: "QA, testing, and bug fixes." },
    { name: "Deployment", status: "PENDING", estimatedDays: 3, notes: "Production deployment and monitoring." },
    { name: "Handover", status: "PENDING", estimatedDays: 2, notes: "Documentation and client training." }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div><h3 className="text-lg font-black text-gray-900 mb-4">Milestone Overview</h3><div className="space-y-4"><OverviewField label="Goal / Objective" value={milestone.description || "No description provided"} /><OverviewField label="Expected Output" value={milestone.expectedDeliverables || "Not specified"} /><OverviewField label="Estimated Completion" value={milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "No due date"} /></div></div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6"><h3 className="text-lg font-black text-gray-900 mb-4">Progress</h3><div className="relative h-8 w-full rounded-full bg-white overflow-hidden shadow-inner mb-4"><div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" style={{ width: `${stats?.progress}%` }} /></div><div className="flex justify-between text-xs font-bold text-gray-500"><span>{stats?.progress}% Complete</span><span>{stats?.completedTasks} of {stats?.totalTasks} tasks done</span></div></div>
          <div className={`rounded-3xl p-6 ${stats?.openBlockers ? "bg-red-50" : "bg-emerald-50"}`}><div className="flex items-center gap-2 mb-3"><div className={`h-3 w-3 rounded-full ${stats?.openBlockers ? "bg-red-500" : "bg-emerald-500"}`} /><span className="text-sm font-black">{stats?.openBlockers ? `${stats.openBlockers} Active Blocker${stats.openBlockers > 1 ? "s" : ""}` : "On Track"}</span></div></div>
        </div>
      </div>
      <div><h3 className="text-lg font-black text-gray-900 mb-4">Delivery Timeline</h3><div className="space-y-0 relative"><div className="absolute left-[22px] top-8 bottom-8 w-[2px] bg-gray-100 hidden lg:block" />{stages.map((stage: any, idx: number) => (<div key={idx} className="relative pl-0 lg:pl-20 pb-10 last:pb-0"><div className={`absolute left-0 lg:left-4 top-1 h-6 w-6 rounded-full border-4 border-white shadow-md z-10 ${stage.status === "DONE" ? "bg-emerald-500" : stage.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-gray-200"}`} /><div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"><div><h4 className={`text-lg font-black ${stage.status === "DONE" ? "text-gray-900" : "text-gray-500"}`}>{stage.name}</h4><p className="text-sm font-medium text-gray-400 mt-1">{stage.notes || "Phase in progress..."}</p></div><div className="flex items-center gap-4">{stage.estimatedDays && <span className="text-xs font-bold text-gray-400">~{stage.estimatedDays} days</span>}{stage.completionDate && <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase">{new Date(stage.completionDate).toLocaleDateString()}</span>}</div></div></div>))}</div></div>
    </div>
  );
}

function OverviewField({ label, value }: { label: string; value: string }) {
  return (<div className="flex flex-col gap-1"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span><span className="text-sm font-medium text-gray-700">{value}</span></div>);
}

function UpdatesTab({ updates, expandedComments, newComment, onToggleComments, onCommentChange }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-black text-gray-900">Activity Updates</h3></div>
      {updates.length === 0 ? <div className="py-16 flex flex-col items-center justify-center text-center"><Activity className="h-12 w-12 text-gray-200 mb-4" /><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No updates yet</p></div> : <div className="space-y-6">{[...updates].reverse().map((update: any) => (<div key={update.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100"><div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-xs">{update.createdById?.substring(0, 1).toUpperCase() || "A"}</div><div><h4 className="font-black text-gray-900">{update.title}</h4><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(update.createdAt).toLocaleString()}</p></div></div>{update.tags && <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${update.tags === "ISSUE" ? "bg-red-100 text-red-600" : update.tags === "DEPLOYMENT" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>{update.tags}</span>}</div><p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">{update.message}</p><div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100"><button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-emerald-600 transition-colors"><ThumbsUp className="h-4 w-4" />React</button></div></div>))}</div>}
    </div>
  );
}

function DeliverablesTab({ deliverables }: any) {
  const typeIcons: Record<string, any> = { DESIGN: File, DOCUMENT: FileText, PDF: File, CODE: Code, IMAGE: Image };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-black text-gray-900">Deliverables ({deliverables.length})</h3></div>
      {deliverables.length === 0 ? <div className="py-16 flex flex-col items-center justify-center text-center"><Archive className="h-12 w-12 text-gray-200 mb-4" /><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No deliverables yet</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{deliverables.map((d: any) => { const TypeIcon = typeIcons[d.type] || FileText; return (<div key={d.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100"><div className="flex items-start gap-4"><div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0"><TypeIcon className="h-6 w-6 text-indigo-500" /></div><div className="flex-1 min-w-0"><h4 className="font-black text-gray-900 truncate">{d.fileAsset?.originalFilename || "Document"}</h4><div className="flex items-center gap-2 mt-1"><span className="text-[10px] font-black text-gray-400 uppercase">{d.type}</span><span className="text-[10px] text-gray-300">•</span><span className="text-[10px] font-bold text-gray-400">{new Date(d.uploadedAt).toLocaleDateString()}</span></div>{d.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{d.description}</p>}</div></div><div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100"><a href={d.fileAsset?.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 h-10 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all"><Download className="h-4 w-4" />Download</a></div></div>); })}</div>}
    </div>
  );
}