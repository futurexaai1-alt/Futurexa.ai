import { useState } from "react";
import { Loader2, Plus, Trash2, FolderKanban } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useOrganizations } from "../hooks/useOrganizations";

export default function ProjectsPage() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { organizations } = useOrganizations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectOrgId, setNewProjectOrgId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!newProjectName.trim() || !newProjectOrgId) return;
    setIsSubmitting(true);
    try {
      await createProject(newProjectOrgId, newProjectName, newProjectDescription);
      setIsCreateModalOpen(false);
      setNewProjectName("");
      setNewProjectDescription("");
      setNewProjectOrgId("");
    } catch (error: any) {
      alert(error?.message ?? "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (orgId: string, id: string) => {
    if (!confirm("Delete project?")) return;
    try {
      await deleteProject(orgId || "", id);
    } catch (error: any) {
      alert(error?.message ?? "Failed to delete project");
    }
  };

  const handleStatusChange = async (orgId: string, id: string, status: string) => {
    try {
      await updateProject(orgId || "", id, { status });
    } catch (error: any) {
      alert(error?.message ?? "Failed to update project status");
    }
  };

  return (
    <>
      <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Projects</h3>
            <p className="text-sm text-gray-500 mt-1">Workspace projects for the selected organization.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 px-5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="font-medium">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
              <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center">
                <FolderKanban className="h-8 w-8" />
              </div>
              <p className="font-medium text-lg">No projects found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name / Description</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right text-transparent">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projects.map((p) => (
                  <tr key={p.id as string} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-900">{p.name as string}</p>
                      <p className="text-xs text-gray-500 mt-1">{(p.description as string) || "No description"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={p.status as string}
                        onChange={(e) => handleStatusChange(p.organizationId as string, p.id as string, e.target.value)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border outline-none cursor-pointer ${
                          p.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          p.status === "COMPLETED" ? "bg-blue-50 text-blue-700 border-blue-100" :
                          p.status === "ON_HOLD" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          "bg-gray-50 text-gray-700 border-gray-100"
                        }`}
                      >
                        <option value="PLANNING">Planning</option>
                        <option value="ACTIVE">Active</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(p.organizationId as string, p.id as string)}
                          className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Create Project</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
                <select
                  value={newProjectOrgId}
                  onChange={(e) => setNewProjectOrgId(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>Select an organization...</option>
                  {organizations.map((org) => (
                    <option key={org.id as string} value={org.id as string}>
                      {org.name as string}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 h-12 rounded-xl border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newProjectName.trim() || isSubmitting}
                className="flex-1 h-12 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}