import type React from "react";
import { useState } from "react";
import { List, LayoutGrid, Plus, Filter, MessageSquare, Trash2, CheckCircle2, Clock } from "lucide-react";

export default function TasksPanel({
  userStatus,
  accessToken,
  organizationId,
  liveProjects,
  liveTasks,
  taskProjectId,
  taskTitle,
  setTaskProjectId,
  setTaskTitle,
  handleCreateTask,
  taskComments,
  setTaskComments,
  handleUpdateTaskStatus,
  handleDeleteTask,
}: {
  userStatus: string;
  accessToken: string | null;
  organizationId: string | null;
  liveProjects: Array<{ id: string | number; title: string }>;
  liveTasks: Array<{ id: string | number; title: string; status: string }>;
  taskProjectId: string | null;
  taskTitle: string;
  setTaskProjectId: (next: string | null) => void;
  setTaskTitle: (next: string) => void;
  handleCreateTask: () => Promise<void> | void;
  taskComments: Record<string, string>;
  setTaskComments: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleUpdateTaskStatus: (taskId: string | number, status: string, comment?: string) => Promise<void> | void;
  handleDeleteTask: (taskId: string | number) => Promise<void> | void;
}) {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const filteredTasks = liveTasks.filter(task => {
    if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "IN_PROGRESS": return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "IN_PROGRESS": return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <span className="h-2 w-2 rounded-full bg-gray-400 mx-1" />;
    }
  };

  const renderTaskCard = (task: typeof liveTasks[0]) => (
    <div key={task.id} className="group relative rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{task.title}</p>
          <div className="flex items-center gap-1 shrink-0">
            <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
              {task.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 mt-2">
          <div className="flex-1">
            <div className="relative">
              <MessageSquare className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
              <textarea
                rows={1}
                value={taskComments[String(task.id)] ?? ""}
                onChange={(e) =>
                  setTaskComments((prev) => ({
                    ...prev,
                    [String(task.id)]: e.target.value,
                  }))
                }
                className="w-full resize-none rounded-lg border border-gray-100 bg-gray-50 pl-8 pr-3 py-2 text-xs text-gray-700 placeholder:text-gray-400 outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                placeholder="Add comment..."
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <select
              title="Update Status"
              value={task.status}
              onChange={(e) =>
                handleUpdateTaskStatus(task.id, e.target.value, taskComments[String(task.id)] ?? "")
              }
              disabled={userStatus !== "ACTIVE_CLIENT"}
              className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 outline-none hover:bg-gray-50 focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:opacity-50"
            >
              {["PENDING", "IN_PROGRESS", "DONE"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            
            <button
              title="Delete Task"
              onClick={() => handleDeleteTask(task.id)}
              disabled={userStatus !== "ACTIVE_CLIENT"}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-transparent border-none text-sm font-medium text-gray-700 outline-none focus:ring-0 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2 sm:mx-auto bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <List className="h-4 w-4" />
            List
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === "kanban" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </button>
        </div>

        <div>
          <button
            onClick={() => setIsTaskFormOpen(!isTaskFormOpen)}
            disabled={userStatus !== "ACTIVE_CLIENT"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <Plus className={`h-4 w-4 transition-transform ${isTaskFormOpen ? "rotate-45" : ""}`} />
            New Task
          </button>
        </div>
      </div>

      {/* Create Task Form (Expandable) */}
      {isTaskFormOpen && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex-1 block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Project</span>
              <select
                value={taskProjectId ?? ""}
                onChange={(e) => setTaskProjectId(e.target.value || null)}
                disabled={liveProjects.length === 0}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all appearance-none disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="" disabled>Select a project</option>
                {liveProjects.map((p) => (
                  <option key={p.id} value={String(p.id)}>{p.title}</option>
                ))}
              </select>
            </label>
            <label className="flex-[2] block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Task Title</span>
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                placeholder="What needs to be done?"
              />
            </label>
            <div className="flex items-end">
              <button
                onClick={async () => {
                  await handleCreateTask();
                  setIsTaskFormOpen(false);
                }}
                disabled={!taskProjectId || !taskTitle.trim() || !accessToken || !organizationId || userStatus !== "ACTIVE_CLIENT"}
                className="h-[42px] px-6 rounded-xl bg-gray-900 text-white font-semibold transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                Add Task
              </button>
            </div>
          </div>
          {liveProjects.length === 0 && (
            <p className="mt-3 text-xs text-red-500">You must have an active project to create tasks.</p>
          )}
        </div>
      )}

      {/* Task Views */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-500 font-medium">No tasks found in this view.</p>
          <p className="text-sm text-gray-400 mt-1">Try changing filters or adding a new task.</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="grid gap-3 animate-in fade-in duration-300">
          {filteredTasks.map(renderTaskCard)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start animate-in fade-in duration-300">
          {["PENDING", "IN_PROGRESS", "DONE"].map((columnStatus) => (
            <div key={columnStatus} className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-4 border border-gray-100 min-h-[500px]">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{columnStatus.replace("_", " ")}</h3>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                  {filteredTasks.filter(t => t.status === columnStatus).length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {filteredTasks.filter(t => t.status === columnStatus).map(renderTaskCard)}
                {filteredTasks.filter(t => t.status === columnStatus).length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200/60 bg-transparent py-8 text-center bg-gray-50/50">
                    <p className="text-xs font-medium text-gray-400">Empty</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

