import { useState, useMemo } from "react";
import { Loader2, Plus, Trash2, ListTodo, CheckCircle2, Clock, Edit2, XCircle, User, Building2, Search } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { useOrganizations } from "../hooks/useOrganizations";

export default function TasksPage() {
  const { organizations } = useOrganizations();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");

  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks(selectedOrganizationId);
  const { projects } = useProjects();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProjectId, setNewTaskProjectId] = useState("");
  const [newTaskMilestoneId, setNewTaskMilestoneId] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProjectId, setFilterProjectId] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    if (!selectedOrganizationId) return [];
    return projects.filter((p: any) => p.organizationId === selectedOrganizationId);
  }, [projects, selectedOrganizationId]);

  const filteredTasks = useMemo(() => {
    return (tasks as any[]).filter((t) => {
      const matchesSearch = (t.title as string)?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = filterProjectId === "all" || t.projectId === filterProjectId;
      return matchesSearch && matchesProject;
    });
  }, [tasks, searchQuery, filterProjectId]);

  const handleCreate = async () => {
    if (!newTaskTitle.trim() || !selectedOrganizationId) return;
    setIsSubmitting(true);
    try {
      await createTask(selectedOrganizationId, newTaskProjectId || null, newTaskTitle, {
        priority: newTaskPriority,
        milestoneId: newTaskMilestoneId || undefined,
        dueDate: newTaskDueDate || undefined
      });
      setIsCreateModalOpen(false);
      setNewTaskTitle("");
      setNewTaskProjectId("");
      setNewTaskMilestoneId("");
      setNewTaskPriority("MEDIUM");
      setNewTaskDueDate("");
    } catch (error: any) {
      alert(error?.message ?? "Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (orgId: string, id: string, patch: { title?: string; status?: string; priority?: string }) => {
    try {
      await updateTask(orgId || "", id, patch);
    } catch (error: any) {
      alert(error?.message ?? "Failed to update task");
    }
  };

  const handleDelete = async (orgId: string, id: string) => {
    if (!confirm("Delete task?")) return;
    try {
      await deleteTask(orgId || "", id);
    } catch (error: any) {
      alert(error?.message ?? "Failed to delete task");
    }
  };

  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Task Backlog</h3>
            <p className="text-sm text-gray-500 mt-1">Operational tasks and action items across projects.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!selectedOrganizationId}
            className="h-10 px-5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-3 min-w-[200px]">
            <Building2 className="h-4 w-4 text-gray-400" />
            <select
              value={selectedOrganizationId}
              onChange={(e) => {
                setSelectedOrganizationId(e.target.value);
                setFilterProjectId("all");
              }}
              className="flex-1 h-10 px-4 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm font-medium"
            >
              <option value="">Select Organization...</option>
              {(organizations as any[]).map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 h-10 px-4 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
          </div>

          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            disabled={!selectedOrganizationId}
            className="h-10 px-4 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm disabled:opacity-50"
          >
            <option value="all">All Projects</option>
            {filteredProjects.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-medium">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center">
              <ListTodo className="h-8 w-8" />
            </div>
            <p className="font-medium text-lg">No tasks found</p>
            {selectedOrganizationId && <p className="text-sm">Create a task to get started</p>}
            {!selectedOrganizationId && <p className="text-sm">Select an organization to view tasks</p>}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Milestone</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTasks.map((t) => (
                <tr key={t.id as string} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    {editingTask === t.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full text-sm font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent outline-none py-1"
                        />
                        <button
                          onClick={() => {
                            if (editTitle.trim() !== t.title) {
                              handleUpdate(t.organizationId as string, t.id as string, { title: editTitle.trim() });
                            }
                            setEditingTask(null);
                          }}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <p className={`text-sm font-bold ${(t.status === "COMPLETED" || t.status === "DONE") ? "line-through text-gray-400" : "text-gray-900"}`}>
                        {t.title as string}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <select
                      value={t.status as string}
                      onChange={(e) => handleUpdate(t.organizationId as string, t.id as string, { status: e.target.value })}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                        (t.status === "COMPLETED" || t.status === "DONE") ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                        t.status === "IN_PROGRESS" ? "bg-blue-50 border-blue-100 text-blue-700" :
                        t.status === "BLOCKED" ? "bg-red-50 border-red-100 text-red-700" :
                        "bg-gray-50 border-gray-100 text-gray-600"
                      }`}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                      <option value="BLOCKED">Blocked</option>
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                      t.priority === "CRITICAL" ? "bg-red-50 border-red-100 text-red-700" :
                      t.priority === "HIGH" ? "bg-orange-50 border-orange-100 text-orange-700" :
                      t.priority === "MEDIUM" ? "bg-amber-50 border-amber-100 text-amber-700" :
                      "bg-gray-50 border-gray-100 text-gray-600"
                    }`}>
                      {t.priority || "MEDIUM"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">{(t as any).milestone?.title || "No Milestone"}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditTitle(t.title as string);
                          setEditingTask(t.id as string);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.organizationId as string, t.id as string)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create Task</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900">
                <Clock className="h-6 w-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project (Optional)</label>
                <select
                  value={newTaskProjectId}
                  onChange={(e) => setNewTaskProjectId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                >
                  <option value="">No Project</option>
                  {filteredProjects.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                  placeholder="Enter task title..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="p-8 pt-0 flex gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 h-12 rounded-xl border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTaskTitle.trim() || isSubmitting}
                className="flex-1 h-12 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}