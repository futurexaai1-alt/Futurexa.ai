import { useState } from "react";
import { Building2, CheckCircle2, Loader2, Trash2, Users, Plus, XCircle, Edit3, Save, UserPlus, UserMinus, Search, Filter } from "lucide-react";
import { useOrganizations } from "../hooks/useOrganizations";
import { useUsers } from "../hooks/useUsers";

export default function OrganizationsPage() {
  const { organizations, loading, refetch, createOrganization, deleteOrganization } = useOrganizations();
  const { users } = useUsers();
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalNote, setInternalNote] = useState("");

  const handleCreate = async () => {
    if (!newOrgName.trim() || isCreating) return;
    setIsCreating(true);
    try {
      await createOrganization(newOrgName.trim());
      setNewOrgName("");
    } finally {
      setIsCreating(false);
    }
  };

  const openOrgDetail = (org: any) => {
    setSelectedOrg(org);
    setEditName(org.name || "");
    setEditStatus(org.status || "ACTIVE");
    setInternalNote("");
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedOrg || !editName.trim()) return;
    setIsSubmitting(true);
    try {
      const { updateOrganization } = await import("../lib/api");
      await updateOrganization({ id: selectedOrg.id, name: editName, status: editStatus });
      await refetch();
      const updated = organizations.find((o: any) => o.id === selectedOrg.id);
      if (updated) {
        setSelectedOrg({ ...updated, name: editName, status: editStatus });
      }
      setEditMode(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrg = async (id: string) => {
    if (!confirm("Delete this organization? This cannot be undone.")) return;
    try {
      await deleteOrganization(id);
      setSelectedOrg(null);
      await refetch();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete");
    }
  };

  const handleLinkUser = async (orgId: string, userId: string) => {
    if (!userId) return;
    try {
      const { addOrganizationMember } = await import("../lib/api");
      await addOrganizationMember(orgId, userId);
      setSelectedUserId("");
      await refetch();
    } catch (err: any) {
      alert(err?.message ?? "Failed to link user");
    }
  };

  const handleUnlinkUser = async (orgId: string, userId: string) => {
    if (!confirm("Remove this user from the organization?")) return;
    try {
      const { removeOrganizationMember } = await import("../lib/api");
      await removeOrganizationMember(orgId, userId);
      await refetch();
    } catch (err: any) {
      alert(err?.message ?? "Failed to unlink user");
    }
  };

  const filteredOrgs = organizations.filter((org: any) => {
    const matchesStatus = filterStatus === "ALL" || org.status === filterStatus;
    const matchesSearch = !searchQuery || (org.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const s = (status || "UNKNOWN").toUpperCase();
    let col = "bg-gray-50 text-gray-700 border-gray-200";
    if (s === "ACTIVE") col = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "SUSPENDED") col = "bg-amber-50 text-amber-700 border-amber-200";
    if (s === "ARCHIVED") col = "bg-rose-50 text-rose-700 border-rose-200";
    return (
      <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded-full border shadow-sm ${col}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Organizations</h3>
              <p className="text-gray-500 mt-1.5 font-medium">Manage client organizations and team members.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-5 py-2 rounded-full shadow-sm border border-blue-100/50">
                {filteredOrgs.length} Orgs
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[260px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search organizations..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-50 cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <input
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="New organization name"
              className="flex-1 max-w-md rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-50"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={!newOrgName.trim() || isCreating}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-2xl bg-gray-900 text-white font-bold text-sm transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-6">
              <div className="h-16 w-16 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
              <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Loading Organizations...</p>
            </div>
          ) : filteredOrgs.length === 0 ? (
            <div className="p-32 flex flex-col items-center justify-center gap-6 text-gray-400">
              <div className="h-24 w-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center shadow-inner">
                <Building2 className="h-10 w-10 text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-gray-900">No Organizations Found</p>
                <p className="text-sm mt-1">Create one to get started.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Organization</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Members</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Created</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80">
                {filteredOrgs.map((org: any) => (
                  <tr
                    key={org.id}
                    className="hover:bg-blue-50/30 transition-all cursor-pointer"
                    onClick={() => openOrgDetail(org)}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center font-bold text-indigo-600 shadow-sm">
                          {(org.name || "O").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{org.name}</p>
                          <p className="text-sm text-gray-500 mt-0.5">Code: {org.shortCode || org.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <StatusBadge status={org.status} />
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-bold text-gray-700">{org._count?.members ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm text-gray-500">
                        {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteOrg(org.id); }}
                        className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
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
      </section>

      {selectedOrg && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedOrg(null)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-10 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-2xl text-indigo-600 shadow-lg">
                  {(selectedOrg.name || "O").charAt(0).toUpperCase()}
                </div>
                <div>
                  {editMode ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-2xl font-black text-gray-900 border-b-2 border-indigo-300 outline-none bg-transparent"
                    />
                  ) : (
                    <h4 className="text-2xl font-black text-gray-900 tracking-tight">{selectedOrg.name}</h4>
                  )}
                  <p className="text-gray-500 font-medium mt-1">Organization Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="h-12 w-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all flex items-center justify-center shadow-sm"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h5 className="font-black text-xs uppercase tracking-widest text-gray-400">Organization Status</h5>
                {editMode ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-100 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-50"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                ) : (
                  <StatusBadge status={selectedOrg.status} />
                )}
              </div>

              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h5 className="font-black text-xs uppercase tracking-widest text-gray-400">Team Members</h5>
                  <span className="text-sm font-bold text-gray-500">{selectedOrg.members?.length ?? 0} members</span>
                </div>

                <div className="space-y-3">
                  {selectedOrg.members && selectedOrg.members.length > 0 ? (
                    selectedOrg.members.map((member: any) => (
                      <div
                        key={member.user?.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {(member.user?.name || member.user?.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{member.user?.name || "Unnamed"}</p>
                            <p className="text-xs text-gray-500">{member.user?.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnlinkUser(selectedOrg.id, member.user?.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 rounded-2xl border border-dashed border-gray-200">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium">No members yet</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-50"
                  >
                    <option value="">Select a user to add...</option>
                    {users
                      .filter((user: any) => !selectedOrg.members?.some((m: any) => m.userId === user.id || m.user?.id === user.id))
                      .map((user: any) => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.email || user.id}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => handleLinkUser(selectedOrg.id, selectedUserId)}
                    disabled={!selectedUserId}
                    className="h-11 px-5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h5 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Internal Notes</h5>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about this organization..."
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-50 resize-none"
                />
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 h-14 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSubmitting || !editName.trim()}
                    className="flex-[2] h-14 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 h-14 rounded-2xl border-2 border-indigo-100 bg-indigo-50 text-indigo-700 font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="h-5 w-5" />
                    Edit Organization
                  </button>
                  <button
                    onClick={() => handleDeleteOrg(selectedOrg.id)}
                    className="h-14 px-8 rounded-2xl border-2 border-rose-100 bg-rose-50 text-rose-700 font-bold text-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}