import { Loader2, Rocket, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useDeployments } from "../hooks/useDeployments";
import { useProjects } from "../hooks/useProjects";
import { useState } from "react";

export default function DeploymentsPage() {
  const { deployments, loading, createDeployment, updateDeploymentStatus, deleteDeployment } = useDeployments();
  const { projects } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLogName, setNewLogName] = useState("");
  const [newLogEnv, setNewLogEnv] = useState("STAGING");
  const [newLogProjectId, setNewLogProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!newLogName.trim() || !newLogProjectId) return;
    setIsSubmitting(true);
    try {
      const orgId = (projects.find(p => p.id === newLogProjectId)?.organizationId as string) || "";
      await createDeployment(orgId, newLogName, newLogEnv, newLogProjectId);
      setIsModalOpen(false);
      setNewLogName("");
      setNewLogProjectId("");
      setNewLogEnv("STAGING");
    } catch (e: any) {
      alert(e?.message ?? "Failed to create deployment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (orgId: string, id: string, status: string) => {
    try {
      await updateDeploymentStatus(orgId || "", id, status);
    } catch (error: any) {
      alert(error?.message ?? "Failed to update deployment status");
    }
  };

  const handleDelete = async (orgId: string, id: string) => {
    if (!confirm("Are you sure you want to delete this deployment?")) return;
    try {
      await deleteDeployment(orgId || "", id);
    } catch (error: any) {
      alert(error?.message ?? "Failed to delete deployment");
    }
  };

  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Deployments</h3>
          <p className="text-sm text-gray-500 mt-1">Project deployments and version releases.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Log
        </button>
      </div>

      <div className="p-6 overflow-x-auto">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-medium">Loading deployments...</p>
          </div>
        ) : deployments.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center">
              <Rocket className="h-8 w-8" />
            </div>
            <p className="font-medium text-lg">No deployments found</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Version / Project</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Environment</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployed At</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deployments.map((d) => (
                <tr key={d.id as string} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900">{d.name as string}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{(d as any).project?.name || "Global"}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                      (d as any).environment === "PRODUCTION" ? "bg-purple-50 text-purple-700 border-purple-100" :
                      "bg-blue-50 text-blue-700 border-blue-100"
                    }`}>
                      {(d as any).environment || "PRODUCTION"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <select
                      value={d.status as string}
                      onChange={(e) => handleUpdateStatus(d.organizationId as string, d.id as string, e.target.value)}
                      className={`text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                        d.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        d.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border-amber-100" :
                        d.status === "FAILED" ? "bg-red-50 text-red-700 border-red-100" :
                        "bg-gray-50 text-gray-700 border-gray-100"
                      }`}
                    >
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="SUCCESS">Success</option>
                      <option value="FAILED">Failed</option>
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-500">
                      {(d as any).deployedAt ? new Date((d as any).deployedAt).toLocaleString() : ""}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => handleDelete(d.organizationId as string, d.id as string)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Deployment Log</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project</label>
                <select
                  value={newLogProjectId}
                  onChange={(e) => setNewLogProjectId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                >
                  <option value="">Select a project...</option>
                  {projects.map((p) => (
                    <option key={p.id as string} value={p.id as string}>{p.name as string}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Version / Name</label>
                <input
                  type="text"
                  value={newLogName}
                  onChange={(e) => setNewLogName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                  placeholder="e.g. v1.2.0 - Hotfix"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Environment</label>
                <select
                  value={newLogEnv}
                  onChange={(e) => setNewLogEnv(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                >
                  <option value="STAGING">Staging</option>
                  <option value="PRODUCTION">Production</option>
                </select>
              </div>
            </div>
            <div className="p-8 pt-0 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-12 rounded-xl border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newLogProjectId || !newLogName.trim() || isSubmitting}
                className="flex-1 h-12 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Log"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}