import { useState } from "react";
import { Building2, CheckCircle2, ExternalLink, Loader2, Trash2, UserCheck, XCircle, Info, ChevronRight, FileText, MessageSquare, AlertCircle, Flag, Clock } from "lucide-react";
import { useLeads } from "../hooks/useLeads";

export default function PendingLeadsPage() {
  const { leads, loading, updateStatus, deleteRequest } = useLeads();
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [internalNote, setInternalNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highPriority, setHighPriority] = useState<Set<string>>(new Set());

  const handleTogglePriority = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHighPriority((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (status === "REJECTED" && !rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStatus("", id, status, internalNote, rejectionReason);
      setSelectedLead(null);
      setInternalNote("");
      setRejectionReason("");
    } catch (error: any) {
      alert(error?.message ?? "Failed to update lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead request?")) return;
    try {
      await deleteRequest(id);
      setSelectedLead(null);
    } catch (error: any) {
      alert(error?.message ?? "Failed to delete request");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-gray-50/80 to-white">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Project Demo Requests</h3>
            <p className="text-gray-500 mt-1.5 font-medium">Review and activate workspace access for new system leads.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-5 py-2 rounded-full shadow-sm border border-blue-100/50">
              {leads.filter((r) => r.status === "SUBMITTED").length} Pending
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-6">
              <div className="h-16 w-16 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
              <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Synchronizing Leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-32 flex flex-col items-center justify-center gap-6 text-gray-400">
              <div className="h-24 w-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center shadow-inner">
                <UserCheck className="h-10 w-10 text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-gray-900">Queue is Empty</p>
                <p className="text-sm mt-1">All project requests have been processed.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact Information</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Project / Intent</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80">
                {leads.map((request) => (
                  <tr key={request.id} className="hover:bg-blue-50/30 transition-all group cursor-pointer" onClick={() => setSelectedLead(request)}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                          {((request.requestedBy as any)?.name || "U").charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 text-lg leading-tight">{(request.requestedBy as any)?.name || "Unknown User"}</p>
                            {highPriority.has(request.id) && (
                              <Flag className="h-4 w-4 text-rose-500 fill-rose-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{(request.requestedBy as any)?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 w-fit rounded-lg bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gray-200">
                          <FileText className="h-3 w-3" />
                          {request.type as string}
                        </div>
                        <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {(request.organization as any)?.name || "Direct Inquiry"}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase ${
                        request.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        request.status === "REJECTED" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                        "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        <div className={`h-2 w-2 rounded-full ${
                          request.status === "APPROVED" ? "bg-emerald-500" :
                          request.status === "REJECTED" ? "bg-rose-500" :
                          "bg-amber-500 animate-pulse"
                        }`} />
                        {request.status as string}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button className="p-3 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm">
                          <ChevronRight className="h-5 w-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-xl shadow-blue-200">
                  {((selectedLead.requestedBy?.name || "U") as string).charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-3xl font-black text-gray-900 tracking-tight">{selectedLead.requestedBy?.name || "Lead Request"}</h4>
                    <button 
                      onClick={(e) => handleTogglePriority(e, selectedLead.id)}
                      className={`p-2 rounded-xl transition-all ${highPriority.has(selectedLead.id) ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                      title="Mark as High Priority"
                    >
                      <Flag className={`h-5 w-5 ${highPriority.has(selectedLead.id) ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                  <p className="text-gray-500 font-medium text-lg mt-1">{selectedLead.requestedBy?.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="h-12 w-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all flex items-center justify-center shadow-sm">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-blue-600">
                  <Info className="h-5 w-5" />
                  <h5 className="font-black text-xs uppercase tracking-[0.2em]">Form Submission Details</h5>
                </div>
                <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100/50 space-y-8">
                  {selectedLead.description ? (
                    <div className="grid grid-cols-1 gap-8">
                      {selectedLead.description.split("\n\n").map((part: string, idx: number) => {
                        const [label, ...val] = part.split(": ");
                        return (
                          <div key={idx} className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                            <p className="text-gray-900 font-bold leading-relaxed">{val.join(": ") || "Not specified"}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
                      <AlertCircle className="h-10 w-10 opacity-30" />
                      <p className="font-bold italic">No specific form data provided.</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedLead.status === "SUBMITTED" && (
                <div className="space-y-8 border-t border-gray-100 pt-12">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-indigo-600">
                        <MessageSquare className="h-5 w-5" />
                        <h5 className="font-black text-xs uppercase tracking-[0.2em]">Review & Operation</h5>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Internal Note (Visible to Admins Only)</label>
                           <textarea
                             value={internalNote}
                             onChange={(e) => setInternalNote(e.target.value)}
                             rows={3}
                             className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm placeholder:text-gray-300 resize-none"
                             placeholder="Add any internal context about this lead before approving..."
                           />
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-rose-400">Rejection Reason (Required for rejection)</label>
                           <textarea
                             value={rejectionReason}
                             onChange={(e) => setRejectionReason(e.target.value)}
                             rows={2}
                             className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-rose-50 transition-all font-medium text-sm placeholder:text-gray-300 resize-none"
                             placeholder="Ex: Requirements don't match our service spectrum..."
                           />
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpdateStatus(selectedLead.id, "REJECTED")}
                        disabled={isSubmitting || !rejectionReason.trim()}
                        className="flex-1 h-14 rounded-3xl border-2 border-rose-100 bg-rose-50 text-rose-700 font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <XCircle className="h-5 w-5" />
                        Reject
                      </button>
                      <button
                        onClick={() => {
                           alert("Lead deferred for follow-up.");
                           setSelectedLead(null);
                        }}
                        className="flex-1 h-14 rounded-3xl border-2 border-amber-100 bg-amber-50 text-amber-700 font-black text-xs uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Clock className="h-5 w-5" />
                        Defer
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedLead.id, "APPROVED")}
                        disabled={isSubmitting}
                        className="flex-[2] h-14 rounded-3xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-black hover:scale-[1.02] transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                        Approve & Activate
                      </button>
                   </div>
                </div>
              )}

              {selectedLead.status !== "SUBMITTED" && (
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processing Finished</p>
                        <p className="text-gray-900 font-bold mt-1">This lead is already {selectedLead.status.toLowerCase()}.</p>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedLead.id)}
                      className="h-12 px-6 rounded-2xl border border-rose-100 text-rose-600 text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Purge Request
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}