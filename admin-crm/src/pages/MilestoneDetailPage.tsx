import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ArrowLeft, Loader2, Plus, Edit2,
  CheckCircle2, Clock, AlertCircle, FileText,
  MessageSquare, Calendar, Target,
  ChevronRight, Download, Eye,
  Flag, Layout, Activity, ShieldAlert, BarChart3,
  ExternalLink, Upload, CheckCircle, X,
  Send, ThumbsUp, AlertTriangle, Circle, CheckSquare,
  ListTodo, File, Image, Code, Archive
} from "lucide-react";
import {
  useMilestoneDetail,
  useMilestones
} from "../hooks/useMilestones";
import {
  uploadFile,
  addMilestoneTask,
  updateMilestoneTask,
  updateMilestoneStage,
  approveMilestone,
  requestMilestoneRevision,
  getMilestoneComments,
  addCommentToUpdate
} from "../lib/api";

interface MilestoneDetailPageProps {
  milestoneId: string;
  organizationId: string;
  onBack: () => void;
}

const defaultStages = [
  { name: "Planning", status: "PENDING", estimatedDays: 5, notes: "Initial planning and resource allocation." },
  { name: "Design", status: "PENDING", estimatedDays: 10, notes: "UI/UX design and prototyping." },
  { name: "Development", status: "PENDING", estimatedDays: 20, notes: "Core development and integration." },
  { name: "Testing", status: "PENDING", estimatedDays: 7, notes: "QA, testing, and bug fixes." },
  { name: "Deployment", status: "PENDING", estimatedDays: 3, notes: "Production deployment and monitoring." },
  { name: "Handover", status: "PENDING", estimatedDays: 2, notes: "Documentation and client training." }
];

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600 border-gray-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-100 text-red-700 border-red-200"
};

const statusIcons: Record<string, any> = {
  TODO: Circle,
  IN_PROGRESS: Activity,
  DONE: CheckCircle2,
  BLOCKED: AlertTriangle
};

const statusColors: Record<string, string> = {
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  DONE: "bg-emerald-100 text-emerald-600",
  BLOCKED: "bg-red-100 text-red-600",
  PENDING: "bg-gray-100 text-gray-500"
};

export default function MilestoneDetailPage({ milestoneId, organizationId, onBack }: MilestoneDetailPageProps) {
  const { milestone, loading, error, refetch } = useMilestoneDetail(organizationId, milestoneId);
  const { addUpdate, addBlocker, updateBlocker, addDeliverable, updateMilestone } = useMilestones(organizationId);

  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "updates" | "deliverables" | "blockers" | "approval">("overview");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isBlockerModalOpen, setIsBlockerModalOpen] = useState(false);
  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateForm, setUpdateForm] = useState({ title: "", message: "", tags: "PROGRESS" });
  const [blockerForm, setBlockerForm] = useState({ title: "", description: "", severity: "MEDIUM" });
  const [deliverableForm, setDeliverableForm] = useState({ type: "DOCUMENT", file: null as File | null, description: "" });
  const [editForm, setEditForm] = useState({ title: "", description: "", dueDate: "", startDate: "", status: "", progressPercent: 0, expectedDeliverables: "" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedToId: "", dueDate: "", priority: "MEDIUM", status: "TODO" });
  const [approvalForm, setApprovalForm] = useState({ comment: "" });

  const fetchComments = useCallback(async () => {
    if (!milestone?.updates) return;
    const allComments: Record<string, any[]> = {};
    for (const update of milestone.updates) {
      try {
        const data = await getMilestoneComments(organizationId, milestoneId);
        const updateComments = (data || []).filter((c: any) => c.entityId === update.id);
        if (updateComments.length > 0) allComments[update.id] = updateComments;
      } catch (e) { console.error("Failed to fetch comments"); }
    }
    setComments(allComments);
  }, [milestone?.updates, organizationId, milestoneId]);

  useEffect(() => {
    if (activeTab === "updates") fetchComments();
  }, [activeTab, fetchComments]);

  const handleAddUpdate = async () => {
    if (!updateForm.title || !updateForm.message) return;
    setIsSubmitting(true);
    try {
      await addUpdate(organizationId, milestoneId, { ...updateForm, createdById: "Admin" });
      setIsUpdateModalOpen(false);
      setUpdateForm({ title: "", message: "", tags: "PROGRESS" });
      refetch();
    } catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleAddBlocker = async () => {
    if (!blockerForm.title) return;
    setIsSubmitting(true);
    try {
      await addBlocker(organizationId, milestoneId, { ...blockerForm, createdById: "Admin" });
      setIsBlockerModalOpen(false);
      setBlockerForm({ title: "", description: "", severity: "MEDIUM" });
      refetch();
    } catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleResolveBlocker = async (blockerId: string) => {
    try {
      await updateBlocker(organizationId, milestoneId, blockerId, { status: "RESOLVED" });
      refetch();
    } catch (e: any) { alert(e.message); }
  };

  const handleAddDeliverable = async () => {
    if (!deliverableForm.file) return;
    setIsSubmitting(true);
    try {
      const uploadRes = await uploadFile({ organizationId, file: deliverableForm.file, name: deliverableForm.file.name, projectId: milestone.projectId });
      await addDeliverable(organizationId, milestoneId, { fileAssetId: uploadRes.data.id, type: deliverableForm.type, uploadedById: "Admin", description: deliverableForm.description });
      setIsDeliverableModalOpen(false);
      setDeliverableForm({ type: "DOCUMENT", file: null, description: "" });
      refetch();
    } catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleEditMilestone = async () => {
    setIsSubmitting(true);
    try {
      await updateMilestone(organizationId, milestoneId, editForm);
      setIsEditModalOpen(false);
      refetch();
    } catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleAddTask = async () => {
    if (!taskForm.title) return;
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateMilestoneTask(organizationId, milestoneId, editingTask.id, { title: taskForm.title, description: taskForm.description, assignedToId: taskForm.assignedToId || undefined, dueDate: taskForm.dueDate || undefined, priority: taskForm.priority, status: taskForm.status });
      } else {
        await addMilestoneTask(organizationId, milestoneId, { title: taskForm.title, description: taskForm.description, assignedToId: taskForm.assignedToId || undefined, dueDate: taskForm.dueDate || undefined, priority: taskForm.priority, status: taskForm.status });
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      setTaskForm({ title: "", description: "", assignedToId: "", dueDate: "", priority: "MEDIUM", status: "TODO" });
      refetch();
    } catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try { await updateMilestoneTask(organizationId, milestoneId, taskId, { status }); refetch(); }
    catch (e: any) { alert(e.message); }
  };

  const handleSendForReview = async () => {
    setIsSubmitting(true);
    try { await updateMilestone(organizationId, milestoneId, { status: "READY_FOR_REVIEW" }); refetch(); }
    catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try { await approveMilestone({ organizationId, milestoneId, approvedById: "Client", comment: approvalForm.comment }); setIsApprovalModalOpen(false); refetch(); }
    catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleRequestRevision = async () => {
    setIsSubmitting(true);
    try { await requestMilestoneRevision({ organizationId, milestoneId, approvedById: "Client", comment: approvalForm.comment }); setIsApprovalModalOpen(false); refetch(); }
    catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const handleAddComment = async (updateId: string) => {
    if (!newComment[updateId]?.trim()) return;
    setIsSubmitting(true);
    try {
      await addCommentToUpdate({ organizationId, milestoneId, updateId, userId: "Admin", content: newComment[updateId] });
      setNewComment((prev) => ({ ...prev, [updateId]: "" }));
      fetchComments();
    } catch (e: any) { alert(e.message); }
    finally { setIsSubmitting(false); }
  };

  const openEditModal = () => {
    setEditForm({ title: milestone.title, description: milestone.description || "", dueDate: milestone.dueDate ? new Date(milestone.dueDate).toISOString().split("T")[0] : "", startDate: milestone.startDate ? new Date(milestone.startDate).toISOString().split("T")[0] : "", status: milestone.status, progressPercent: milestone.progressPercent || 0, expectedDeliverables: milestone.expectedDeliverables || "" });
    setIsEditModalOpen(true);
  };

  const openTaskModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({ title: task.title, description: task.description || "", assignedToId: task.assignedToId || "", dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "", priority: task.priority || "MEDIUM", status: task.status });
    } else {
      setEditingTask(null);
      setTaskForm({ title: "", description: "", assignedToId: "", dueDate: "", priority: "MEDIUM", status: "TODO" });
    }
    setIsTaskModalOpen(true);
  };

  const stats = useMemo(() => {
    if (!milestone) return null;
    const totalTasks = milestone.tasks?.length || 0;
    const completedTasks = milestone.tasks?.filter((t: any) => t.status === "DONE" || t.status === "COMPLETED").length || 0;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : milestone.progressPercent || 0;
    const openBlockers = milestone.blockers?.filter((b: any) => b.status === "OPEN").length || 0;
    const criticalBlockers = milestone.blockers?.filter((b: any) => b.status === "OPEN" && b.severity === "CRITICAL").length || 0;
    const deliverablesCount = milestone.deliverables?.length || 0;
    let daysRemaining = 0, isOverdue = false;
    if (milestone.dueDate) {
      const diff = Math.ceil((new Date(milestone.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.max(0, diff);
      isOverdue = diff < 0;
    }
    const stages = milestone.stageBreakdown || defaultStages;
    return { totalTasks, completedTasks, progress, openBlockers, criticalBlockers, deliverablesCount, daysRemaining, isOverdue, completedStages: stages.filter((s: any) => s.status === "DONE").length, totalStages: stages.length };
  }, [milestone]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
      <p className="text-gray-500 font-black tracking-widest uppercase text-[10px]">Loading Milestone Details...</p>
    </div>
  );

  if (error || !milestone) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center mb-6"><ShieldAlert className="h-10 w-10 text-red-500" /></div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">Error Loading Milestone</h3>
      <p className="text-gray-500 font-medium max-w-xs mb-8">{error || "Milestone not found."}</p>
      <button onClick={onBack} className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-all">Go Back</button>
    </div>
  );

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "tasks", label: "Tasks", icon: ListTodo },
    { key: "updates", label: "Updates", icon: Activity },
    { key: "deliverables", label: "Deliverables", icon: File },
    { key: "blockers", label: "Blockers", icon: AlertTriangle },
    { key: "approval", label: "Approval", icon: CheckCircle }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm"><ArrowLeft className="h-5 w-5" /></button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">{milestone.project?.name}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase ${milestone.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : milestone.status === "BLOCKED" ? "bg-red-100 text-red-700" : milestone.status === "READY_FOR_REVIEW" ? "bg-amber-100 text-amber-700" : milestone.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{milestone.status.replace(/_/g, " ")}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{milestone.title}</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={openEditModal} className="h-12 px-6 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"><Edit2 className="h-4 w-4" />Edit Milestone</button>
          <button onClick={() => setIsUpdateModalOpen(true)} className="h-12 px-6 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center gap-2"><Plus className="h-4 w-4" />Add Update</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MiniStatCard icon={BarChart3} label="Progress" value={`${stats?.progress}%`} color={stats?.progress >= 75 ? "emerald" : stats?.progress >= 50 ? "amber" : "red"} />
        <MiniStatCard icon={ListTodo} label="Tasks" value={`${stats?.completedTasks}/${stats?.totalTasks}`} color="blue" />
        <MiniStatCard icon={CheckSquare} label="Stages" value={`${stats?.completedStages}/${stats?.totalStages}`} color="indigo" />
        <MiniStatCard icon={Calendar} label={stats?.isOverdue ? "Overdue" : "Days Left"} value={stats?.isOverdue ? `${Math.abs(stats?.daysRemaining || 0)}d` : `${stats?.daysRemaining}d`} color={stats?.isOverdue ? "red" : stats?.daysRemaining <= 3 ? "amber" : "emerald"} />
        <MiniStatCard icon={AlertTriangle} label="Blockers" value={stats?.openBlockers || 0} color={stats?.criticalBlockers ? "red" : stats?.openBlockers ? "amber" : "emerald"} />
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
          {activeTab === "tasks" && <TasksTab tasks={milestone.tasks || []} onAddTask={() => openTaskModal()} onEditTask={(task) => openTaskModal(task)} onUpdateStatus={handleUpdateTaskStatus} />}
          {activeTab === "updates" && <UpdatesTab updates={milestone.updates || []} comments={comments} expandedComments={expandedComments} newComment={newComment} onToggleComments={(id) => setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }))} onCommentChange={(id, value) => setNewComment((prev) => ({ ...prev, [id]: value }))} onAddComment={handleAddComment} />}
          {activeTab === "deliverables" && <DeliverablesTab deliverables={milestone.deliverables || []} />}
          {activeTab === "blockers" && <BlockersTab blockers={milestone.blockers || []} onResolve={handleResolveBlocker} />}
          {activeTab === "approval" && <ApprovalTab milestone={milestone} approvals={milestone.approvals || []} onSendForReview={handleSendForReview} />}
        </div>
      </div>

      {isUpdateModalOpen && <Modal onClose={() => setIsUpdateModalOpen(false)} title="Post Update">
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label><input type="text" value={updateForm.title} onChange={(e) => setUpdateForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g., API integration completed" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Message</label><textarea value={updateForm.message} onChange={(e) => setUpdateForm((p) => ({ ...p, message: e.target.value }))} placeholder="Describe the progress made..." rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none" /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tag</label><select value={updateForm.tags} onChange={(e) => setUpdateForm((p) => ({ ...p, tags: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"><option value="PROGRESS">Progress</option><option value="ISSUE">Issue</option><option value="DEPLOYMENT">Deployment</option><option value="REVIEW">Review Needed</option></select></div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => setIsUpdateModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">Cancel</button><button onClick={handleAddUpdate} disabled={isSubmitting || !updateForm.title || !updateForm.message} className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? "Posting..." : "Post Update"}</button></div>
        </div>
      </Modal>}

      {isBlockerModalOpen && <Modal onClose={() => setIsBlockerModalOpen(false)} title="Report Blocker">
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label><input type="text" value={blockerForm.title} onChange={(e) => setBlockerForm((p) => ({ ...p, title: e.target.value }))} placeholder="Brief description of the blocker" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Severity</label><select value={blockerForm.severity} onChange={(e) => setBlockerForm((p) => ({ ...p, severity: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="CRITICAL">Critical</option></select></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label><textarea value={blockerForm.description} onChange={(e) => setBlockerForm((p) => ({ ...p, description: e.target.value }))} placeholder="Detailed explanation..." rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none" /></div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => setIsBlockerModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">Cancel</button><button onClick={handleAddBlocker} disabled={isSubmitting || !blockerForm.title} className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all disabled:opacity-50">{isSubmitting ? "Adding..." : "Report Blocker"}</button></div>
        </div>
      </Modal>}

      {isDeliverableModalOpen && <Modal onClose={() => setIsDeliverableModalOpen(false)} title="Upload Deliverable">
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Type</label><select value={deliverableForm.type} onChange={(e) => setDeliverableForm((p) => ({ ...p, type: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"><option value="DESIGN">Design</option><option value="DOCUMENT">Document</option><option value="PDF">PDF</option><option value="CODE">Code</option><option value="IMAGE">Image</option></select></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">File</label><input type="file" onChange={(e) => setDeliverableForm((p) => ({ ...p, file: e.target.files?.[0] || null }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description (Optional)</label><textarea value={deliverableForm.description} onChange={(e) => setDeliverableForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none" /></div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => setIsDeliverableModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">Cancel</button><button onClick={handleAddDeliverable} disabled={isSubmitting || !deliverableForm.file} className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all disabled:opacity-50">{isSubmitting ? "Uploading..." : "Upload"}</button></div>
        </div>
      </Modal>}

      {isEditModalOpen && <Modal onClose={() => setIsEditModalOpen(false)} title="Edit Milestone">
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label><input type="text" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label><textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Start Date</label><input type="date" value={editForm.startDate} onChange={(e) => setEditForm((p) => ({ ...p, startDate: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Due Date</label><input type="date" value={editForm.dueDate} onChange={(e) => setEditForm((p) => ({ ...p, dueDate: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" /></div></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label><select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"><option value="NOT_STARTED">Not Started</option><option value="IN_PROGRESS">In Progress</option><option value="BLOCKED">Blocked</option><option value="ON_HOLD">On Hold</option><option value="COMPLETED">Completed</option></select></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Progress: {editForm.progressPercent}%</label><input type="range" min="0" max="100" value={editForm.progressPercent} onChange={(e) => setEditForm((p) => ({ ...p, progressPercent: parseInt(e.target.value) }))} className="w-full accent-indigo-600" /></div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">Cancel</button><button onClick={handleEditMilestone} disabled={isSubmitting} className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all disabled:opacity-50">{isSubmitting ? "Saving..." : "Save Changes"}</button></div>
        </div>
      </Modal>}

      {isTaskModalOpen && <Modal onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }} title={editingTask ? "Edit Task" : "Add Task"}>
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Task Title</label><input type="text" value={taskForm.title} onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))} placeholder="Enter task title" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label><textarea value={taskForm.description} onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Task details..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Priority</label><select value={taskForm.priority} onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label><select value={taskForm.status} onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"><option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="DONE">Done</option><option value="BLOCKED">Blocked</option></select></div></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Due Date</label><input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" /></div>
          <div className="flex justify-end gap-3 pt-4"><button onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); }} className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">Cancel</button><button onClick={handleAddTask} disabled={isSubmitting || !taskForm.title} className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? "Saving..." : editingTask ? "Update Task" : "Add Task"}</button></div>
        </div>
      </Modal>}

      {isApprovalModalOpen && <Modal onClose={() => setIsApprovalModalOpen(false)} title="Client Approval">
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200"><p className="text-sm font-medium text-amber-800">This will notify the client that the milestone is ready for review and approval.</p></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Comment (Optional)</label><textarea value={approvalForm.comment} onChange={(e) => setApprovalForm((p) => ({ ...p, comment: e.target.value }))} rows={3} placeholder="Add a note for the client..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none" /></div>
          <div className="flex gap-3 pt-4"><button onClick={handleRequestRevision} disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all disabled:opacity-50">Request Revision</button><button onClick={handleApprove} disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all disabled:opacity-50">{isSubmitting ? "Processing..." : "Approve"}</button></div>
        </div>
      </Modal>}
    </div>
  );
}

function MiniStatCard({ icon: Icon, label, value, color }: any) {
  const colorMap: Record<string, string> = { indigo: "bg-indigo-50 text-indigo-600", blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600", gray: "bg-gray-50 text-gray-600" };
  return (<div className={`rounded-2xl p-4 ${colorMap[color] || colorMap.gray}`}><div className="flex items-center gap-2 mb-2"><Icon className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div><span className="text-xl font-black">{value}</span></div>);
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} /><div className="relative bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200"><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-black text-gray-900">{title}</h2><button onClick={onClose} className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all"><X className="h-5 w-5" /></button></div>{children}</div></div>);
}

function OverviewTab({ milestone, stats }: { milestone: any; stats: any }) {
  const stages = milestone.stageBreakdown || defaultStages;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div><h3 className="text-lg font-black text-gray-900 mb-4">Milestone Overview</h3><div className="space-y-4"><OverviewField label="Goal / Objective" value={milestone.description || "No description provided"} /><OverviewField label="Current Stage" value={milestone.status.replace(/_/g, " ")} /><OverviewField label="Expected Output" value={milestone.expectedDeliverables || "Not specified"} /><OverviewField label="Estimated Completion" value={milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "No due date"} /></div></div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6"><h3 className="text-lg font-black text-gray-900 mb-4">Progress</h3><div className="relative h-8 w-full rounded-full bg-white overflow-hidden shadow-inner mb-4"><div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000" style={{ width: `${stats?.progress}%` }} /></div><div className="flex justify-between text-xs font-bold text-gray-500"><span>{stats?.progress}% Complete</span><span>{stats?.completedTasks} of {stats?.totalTasks} tasks done</span></div></div>
          <div className={`rounded-3xl p-6 ${stats?.openBlockers ? "bg-red-50" : "bg-emerald-50"}`}><div className="flex items-center gap-2 mb-3"><div className={`h-3 w-3 rounded-full ${stats?.openBlockers ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} /><span className="text-sm font-black">{stats?.openBlockers ? `${stats.openBlockers} Active Blocker${stats.openBlockers > 1 ? "s" : ""}` : "On Track"}</span></div>{stats?.openBlockers > 0 && <p className="text-xs text-red-600">Critical issues need attention</p>}</div>
        </div>
      </div>
      <div><h3 className="text-lg font-black text-gray-900 mb-4">Delivery Timeline</h3><div className="space-y-0 relative"><div className="absolute left-[22px] top-8 bottom-8 w-[2px] bg-gray-100 hidden lg:block" />{stages.map((stage: any, idx: number) => (<div key={idx} className="relative pl-0 lg:pl-20 pb-10 last:pb-0 group"><div className={`absolute left-0 lg:left-4 top-1 h-6 w-6 rounded-full border-4 border-white shadow-md z-10 transition-all ${stage.status === "DONE" ? "bg-emerald-500 scale-125" : stage.status === "IN_PROGRESS" ? "bg-blue-500 animate-pulse" : "bg-gray-200"}`} /><div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"><div><h4 className={`text-lg font-black ${stage.status === "DONE" ? "text-gray-900" : "text-gray-500"}`}>{stage.name}</h4><p className="text-sm font-medium text-gray-400 mt-1">{stage.notes || "Phase in progress..."}</p></div><div className="flex items-center gap-4">{stage.estimatedDays && <span className="text-xs font-bold text-gray-400">~{stage.estimatedDays} days</span>}{stage.completionDate && <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest">{new Date(stage.completionDate).toLocaleDateString()}</span>}</div></div></div>))}</div></div>
    </div>
  );
}

function OverviewField({ label, value }: { label: string; value: string }) {
  return (<div className="flex flex-col gap-1"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span><span className="text-sm font-medium text-gray-700">{value}</span></div>);
}

function TasksTab({ tasks, onAddTask, onEditTask, onUpdateStatus }: any) {
  const statusOptions = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-black text-gray-900">Tasks ({tasks.length})</h3><button onClick={onAddTask} className="h-10 px-6 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"><Plus className="h-4 w-4" />Add Task</button></div>
      {tasks.length === 0 ? <div className="py-16 flex flex-col items-center justify-center text-center"><ListTodo className="h-12 w-12 text-gray-200 mb-4" /><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No tasks yet</p></div> : <div className="space-y-3">{tasks.map((task: any) => { const StatusIcon = statusIcons[task.status] || Circle; return (<div key={task.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-100 hover:bg-white transition-all group"><div className="flex items-start gap-4"><button onClick={() => { const currentIdx = statusOptions.indexOf(task.status); onUpdateStatus(task.id, statusOptions[(currentIdx + 1) % statusOptions.length]); }} className="mt-1 shrink-0"><StatusIcon className={`h-5 w-5 ${statusColors[task.status] || "text-gray-400"}`} /></button><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h4 className="font-black text-gray-900">{task.title}</h4><span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>{task.priority}</span></div>{task.description && <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>}<div className="flex items-center gap-4 mt-2">{task.dueDate && <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(task.dueDate).toLocaleDateString()}</span>}<span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${statusColors[task.status]}`}>{task.status.replace(/_/g, " ")}</span></div></div><button onClick={() => onEditTask(task)} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"><Edit2 className="h-4 w-4" /></button></div></div>); })}</div>}
    </div>
  );
}

function UpdatesTab({ updates, comments, expandedComments, newComment, onToggleComments, onCommentChange, onAddComment }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-black text-gray-900">Activity Updates</h3></div>
      {updates.length === 0 ? <div className="py-16 flex flex-col items-center justify-center text-center"><Activity className="h-12 w-12 text-gray-200 mb-4" /><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No updates yet</p></div> : <div className="space-y-6">{[...updates].reverse().map((update: any) => (<div key={update.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white transition-all"><div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-xs">{update.createdById?.substring(0, 1).toUpperCase() || "A"}</div><div><h4 className="font-black text-gray-900">{update.title}</h4><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(update.createdAt).toLocaleString()}</p></div></div>{update.tags && <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${update.tags === "ISSUE" ? "bg-red-100 text-red-600" : update.tags === "DEPLOYMENT" ? "bg-purple-100 text-purple-600" : update.tags === "REVIEW" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>{update.tags}</span>}</div><p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap mb-4">{update.message}</p><div className="flex items-center gap-4"><button onClick={() => onToggleComments(update.id)} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors"><MessageSquare className="h-4 w-4" />{comments[update.id]?.length || 0} Comments</button><button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-emerald-600 transition-colors"><ThumbsUp className="h-4 w-4" />React</button></div>{expandedComments[update.id] && <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">{comments[update.id]?.map((comment: any) => (<div key={comment.id} className="flex items-start gap-3 pl-4 border-l-2 border-indigo-100"><div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">{comment.userId?.substring(0, 1).toUpperCase() || "U"}</div><div><p className="text-sm font-medium text-gray-900">{comment.content}</p><p className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p></div></div>))}<div className="flex items-center gap-3"><input type="text" value={newComment[update.id] || ""} onChange={(e) => onCommentChange(update.id, e.target.value)} placeholder="Add a comment..." className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none" /><button onClick={() => onAddComment(update.id)} className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all"><Send className="h-4 w-4" /></button></div></div>}</div>))}</div>}
    </div>
  );
}

function DeliverablesTab({ deliverables }: any) {
  const typeIcons: Record<string, any> = { DESIGN: Layout, DOCUMENT: FileText, PDF: File, CODE: Code, IMAGE: Image };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-black text-gray-900">Deliverables ({deliverables.length})</h3></div>
      {deliverables.length === 0 ? <div className="py-16 flex flex-col items-center justify-center text-center"><Archive className="h-12 w-12 text-gray-200 mb-4" /><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No deliverables yet</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{deliverables.map((d: any) => { const TypeIcon = typeIcons[d.type] || FileText; return (<div key={d.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-100 hover:bg-white transition-all group"><div className="flex items-start gap-4"><div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 group-hover:border-indigo-200 transition-all"><TypeIcon className="h-6 w-6 text-indigo-500" /></div><div className="flex-1 min-w-0"><h4 className="font-black text-gray-900 truncate">{d.fileAsset?.originalFilename || "Document"}</h4><div className="flex items-center gap-2 mt-1"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.type}</span><span className="text-[10px] text-gray-300">•</span><span className="text-[10px] font-bold text-gray-400">{new Date(d.uploadedAt).toLocaleDateString()}</span></div>{d.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{d.description}</p>}</div></div><div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100"><a href={d.fileAsset?.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 h-10 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all"><Download className="h-4 w-4" />Download</a><button className="h-10 w-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-all"><Eye className="h-4 w-4" /></button></div></div>); })}</div>}
    </div>
  );
}

function BlockersTab({ blockers, onResolve }: any) {
  const openBlockers = blockers.filter((b: any) => b.status === "OPEN");
  const resolvedBlockers = blockers.filter((b: any) => b.status === "RESOLVED");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><h3 className="text-lg font-black text-gray-900">Blockers</h3>{openBlockers.length > 0 && <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-black">{openBlockers.length} Active</span>}</div></div>
      {openBlockers.length === 0 && resolvedBlockers.length === 0 ? <div className="py-16 flex flex-col items-center justify-center text-center"><CheckCircle className="h-12 w-12 text-emerald-100 mb-4" /><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No blockers</p></div> : <div className="space-y-4">{openBlockers.map((blocker: any) => (<div key={blocker.id} className="p-6 rounded-2xl bg-red-50/50 border border-red-100"><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-2"><span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${blocker.severity === "CRITICAL" ? "bg-red-500 text-white" : blocker.severity === "MEDIUM" ? "bg-amber-500 text-white" : "bg-gray-500 text-white"}`}>{blocker.severity}</span><span className="text-xs font-bold text-gray-400">{new Date(blocker.createdAt).toLocaleDateString()}</span></div><span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[8px] font-black uppercase">Active</span></div><h4 className="font-black text-gray-900 mb-2">{blocker.title}</h4><p className="text-sm text-gray-600 leading-relaxed mb-4">{blocker.description}</p><button onClick={() => onResolve(blocker.id)} className="text-xs font-black text-red-600 uppercase tracking-widest hover:underline">Mark Resolved</button></div>))}{resolvedBlockers.length > 0 && <div className="pt-6"><h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Resolved</h4><div className="space-y-3">{resolvedBlockers.map((blocker: any) => (<div key={blocker.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-60"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><h4 className="text-sm font-bold text-gray-500 line-through">{blocker.title}</h4></div></div>))}</div></div>}</div>}
    </div>
  );
}

function ApprovalTab({ milestone, approvals, onSendForReview }: any) {
  const latestApproval = approvals?.[approvals.length - 1];
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-black text-gray-900">Approval & Sign-off</h3>
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4"><div className={`h-3 w-3 rounded-full ${milestone.status === "COMPLETED" ? "bg-emerald-400" : milestone.status === "READY_FOR_REVIEW" ? "bg-amber-400 animate-pulse" : "bg-white/30"}`} /><span className="text-sm font-black uppercase tracking-widest">{milestone.status === "COMPLETED" ? "Approved" : milestone.status === "READY_FOR_REVIEW" ? "Pending Client Review" : "Not Submitted"}</span></div>
        {latestApproval && <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm mt-4"><div className="flex items-center gap-2 mb-2"><span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">{latestApproval.status === "APPROVED" ? "Approved" : "Revision Requested"}</span><span className="text-[10px] text-indigo-200">{latestApproval.approvedAt ? new Date(latestApproval.approvedAt).toLocaleString() : ""}</span></div>{latestApproval.comment && <p className="text-sm text-white/80">{latestApproval.comment}</p>}</div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="p-5 rounded-2xl bg-gray-50 border border-gray-100"><div className="flex items-center gap-2 mb-2"><Clock className="h-4 w-4 text-gray-400" /><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Created</span></div><p className="text-sm font-bold text-gray-900">{new Date(milestone.createdAt).toLocaleDateString()}</p></div><div className="p-5 rounded-2xl bg-gray-50 border border-gray-100"><div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-gray-400" /><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</span></div><p className="text-sm font-bold text-gray-900">{milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "Not set"}</p></div><div className="p-5 rounded-2xl bg-gray-50 border border-gray-100"><div className="flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4 text-gray-400" /><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span></div><p className="text-sm font-bold text-gray-900">{milestone.progressPercent || 0}%</p></div></div>
      {milestone.status !== "COMPLETED" && milestone.status !== "READY_FOR_REVIEW" && <button onClick={onSendForReview} className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"><ExternalLink className="h-4 w-4" />Send for Client Review</button>}
    </div>
  );
}