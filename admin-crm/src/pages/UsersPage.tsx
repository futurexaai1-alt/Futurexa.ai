import { CheckCircle2, Loader2, Trash2, XCircle, Filter } from "lucide-react";
import { useState } from "react";
import { useUsers } from "../hooks/useUsers";

export default function UsersPage() {
  const { users, loading, deleteUser, suspendUser, unsuspendUser, restoreUser } = useUsers();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredUsers = users.filter((u) => statusFilter === "ALL" || u.status === statusFilter);

  const StatusBadge = ({ status }: { status: string }) => {
    const s = (status || "UNKNOWN").toUpperCase();
    let col = "bg-gray-50 text-gray-700 border-gray-200";
    if (s === "ACTIVE") col = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "SUSPENDED") col = "bg-amber-50 text-amber-700 border-amber-200";
    if (s === "DELETED") col = "bg-rose-50 text-rose-700 border-rose-200";
    if (s === "PENDING") col = "bg-blue-50 text-blue-700 border-blue-200";
    return (
      <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded-full border shadow-sm ${col}`}>
        {s}
      </span>
    );
  };

  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Users</h3>
          <p className="text-sm text-gray-500 mt-1">Supabase profiles and lifecycle status.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-4 py-2 bg-white font-medium outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DELETED">Deleted</option>
          </select>
        </div>
      </div>
      <div className="p-6 overflow-x-auto">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-medium">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-20 text-center text-gray-500">
            <p>No users found matching the filter.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u.id as string} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-sm">
                        {((u.name as string) || (u.email as string) || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{(u.name as string) || "Unknown Name"}</p>
                        <p className="text-xs text-gray-500">{u.email as string}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status as string} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {u.status === "SUSPENDED" ? (
                        <button
                          onClick={() => unsuspendUser(u.id as string)}
                          className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 transition-all"
                          title="Unsuspend user"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      ) : u.status === "DELETED" ? (
                        <button
                          onClick={() => restoreUser(u.id as string)}
                          className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 transition-all"
                          title="Restore user"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => suspendUser(u.id as string)}
                          className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-600 hover:border-amber-100 hover:bg-amber-50 transition-all"
                          title="Suspend user"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}

                      {u.status === "DELETED" ? null : (
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this user? This cannot be undone.")) return;
                            try {
                              await deleteUser(u.id as string);
                            } catch (err: any) {
                              alert(err?.message ?? "Failed to delete user");
                            }
                          }}
                          className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all"
                          title="Soft-delete user"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}