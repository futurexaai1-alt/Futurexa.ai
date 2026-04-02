import { useState, useMemo } from "react";
import { 
  Loader2, Plus, Edit2, Trash2, Milestone as MilestoneIcon, 
  XCircle, Calendar, CheckCircle2, ChevronRight, 
  Target, Clock, AlertCircle, Building2, Search,
  Filter, Layers, MoreVertical
} from "lucide-react";
import { useMilestones } from "../hooks/useMilestones";
import { useProjects } from "../hooks/useProjects";
import { useOrganizations } from "../hooks/useOrganizations";

export default function MilestonesPage({ onViewDetail }: { onViewDetail: (id: string, orgId: string) => void }) {
  const { organizations } = useOrganizations();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");
  
  const { milestones, loading, createMilestone, updateMilestone, deleteMilestone } = useMilestones(selectedOrganizationId);
  const { projects } = useProjects();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    dueDate: "",
    status: "PLANNED"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProjects = useMemo(() => {
    if (!selectedOrganizationId) return [];
    return projects.filter((p: any) => p.organizationId === selectedOrganizationId);
  }, [projects, selectedOrganizationId]);

  const filteredMilestones = useMemo(() => {
    return (milestones as any[]).filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (m.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesProject = selectedProjectId === "all" || m.projectId === selectedProjectId;
      return matchesSearch && matchesProject;
    });
  }, [milestones, searchQuery, selectedProjectId]);

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.projectId || !selectedOrganizationId) return;
    setIsSubmitting(true);
    try {
      await createMilestone(selectedOrganizationId, formData.projectId, formData.title, formData.dueDate || undefined, formData.description || undefined);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      alert(error?.message ?? "Failed to add milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingMilestone || !formData.title.trim()) return;
    setIsSubmitting(true);
    try {
      await updateMilestone(selectedOrganizationId, editingMilestone.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate
      });
      setEditingMilestone(null);
      resetForm();
    } catch (error: any) {
      alert(error?.message ?? "Failed to update milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone? This will unlinked all associated tasks.")) return;
    try {
      await deleteMilestone(selectedOrganizationId, id);
    } catch (error: any) {
      alert(error?.message ?? "Failed to delete milestone");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      projectId: "",
      dueDate: "",
      status: "PLANNED"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-500 text-white shadow-emerald-200";
      case "IN_PROGRESS": return "bg-blue-500 text-white shadow-blue-200";
      case "READY_FOR_REVIEW": return "bg-amber-500 text-white shadow-amber-200";
      default: return "bg-gray-400 text-white shadow-gray-200";
    }
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <MilestoneIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-black tracking-[0.2em] text-indigo-600 uppercase">Roadmap</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Milestones</h1>
          <p className="text-gray-500 mt-2 font-medium max-w-md leading-relaxed">
            Define and track key delivery phases for your client organizations.
          </p>
        </div>
        
        <button
          onClick={() => {
            if (selectedProjectId && selectedProjectId !== "all") {
              setFormData((prev) => ({ ...prev, projectId: selectedProjectId }));
            }
            setIsCreateModalOpen(true);
          }}
          disabled={!selectedOrganizationId}
          className="group relative h-14 px-8 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-black hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-gray-200 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="h-5 w-5" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/70 backdrop-blur-md p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-72">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedOrganizationId}
            onChange={(e) => {
              setSelectedOrganizationId(e.target.value);
              setSelectedProjectId("all");
            }}
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-none bg-gray-50 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer transition-all"
          >
            <option value="">Select Organization</option>
            {organizations.map((org: any) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        {selectedOrganizationId && (
          <>
            <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
            
            <div className="relative w-full md:w-64">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-none bg-gray-50 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Projects</option>
                {filteredProjects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search milestones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-none bg-gray-50 text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
              />
            </div>
          </>
        )}
      </div>

      {/* Milestones Display */}
      {!selectedOrganizationId ? (
        <div className="py-32 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mb-6 animate-pulse">
            <Building2 className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Select an Organization</h3>
          <p className="text-gray-500 font-medium max-w-xs">
            Choose an organization from the dropdown above to manage its project roadmap.
          </p>
        </div>
      ) : loading ? (
        <div className="py-32 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500 font-black tracking-widest uppercase text-[10px]">Syncing Data...</p>
        </div>
      ) : filteredMilestones.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mb-6">
            <MilestoneIcon className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Milestones Found</h3>
          <p className="text-gray-500 font-medium max-w-xs">
            {searchQuery || selectedProjectId !== "all" 
              ? "No results match your filters. Try adjusting them."
              : "This organization doesn't have any milestones yet. Create one to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMilestones.map((milestone) => {
            const dueDate = milestone.dueDate ? new Date(milestone.dueDate) : null;
            const isOverdue = dueDate && dueDate < new Date() && milestone.status !== "COMPLETED";
            
            return (
              <div 
                key={milestone.id} 
                className="group relative bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm ${getStatusColor(milestone.status)}`}>
                    {milestone.status.replace(/_/g, " ")}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onViewDetail(milestone.id, selectedOrganizationId)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="View Details"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setEditingMilestone(milestone);
                        setFormData({
                          title: milestone.title,
                          description: milestone.description || "",
                          projectId: milestone.projectId,
                          dueDate: milestone.dueDate ? milestone.dueDate.split('T')[0] : "",
                          status: milestone.status
                        });
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(milestone.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-gray-900 line-clamp-1 mb-2">{milestone.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-4">
                    <Target className="h-3 w-3" />
                    <span>{milestone.project?.name}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 line-clamp-3 leading-relaxed min-h-[4.5rem]">
                    {milestone.description || "No description provided for this milestone phase."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Tasks</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="text-sm font-bold text-gray-900">{milestone.tasks?.length || 0} Linked</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`h-3.5 w-3.5 ${isOverdue ? "text-red-500" : "text-emerald-500"}`} />
                      <span className={`text-sm font-bold ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                        {dueDate ? dueDate.toLocaleDateString() : "TBD"}
                      </span>
                    </div>
                  </div>
                </div>

                {isOverdue && (
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white border-4 border-white shadow-lg animate-bounce">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      </div>

      {(isCreateModalOpen || editingMilestone) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl shadow-black/20 overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 md:p-12 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  {editingMilestone ? "Edit Milestone" : "New Milestone"}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {editingMilestone ? "Modify the phase details and tracking." : "Define a new target phase for the project."}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingMilestone(null);
                  resetForm();
                }}
                className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Milestone Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-300"
                    placeholder="e.g. Design Prototype"
                  />
                </div>
                {!editingMilestone && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Associated Project</label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all"
                    >
                      <option value="">Select Project</option>
                      {filteredProjects.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {editingMilestone && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phase Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all"
                    >
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="READY_FOR_REVIEW">Ready for Review</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Detailed Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-6 rounded-[2rem] bg-gray-50 border-none text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all resize-none placeholder:text-gray-300"
                  placeholder="Describe the goals and deliverables for this milestone..."
                />
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Target Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-gray-50 border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 pt-0 flex gap-4">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingMilestone(null);
                  resetForm();
                }}
                className="flex-1 h-14 rounded-2xl border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                Discard
              </button>
              <button
                onClick={editingMilestone ? handleUpdate : handleCreate}
                disabled={!formData.title.trim() || (!editingMilestone && !formData.projectId) || isSubmitting}
                className="flex-[2] h-14 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                {isSubmitting ? "Processing..." : (editingMilestone ? "Save Changes" : "Create Milestone")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}