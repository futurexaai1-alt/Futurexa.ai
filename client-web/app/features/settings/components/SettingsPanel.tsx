import { useEffect, useState } from "react";
import { User, Shield, Save, Key, UserCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPanel({
  accessToken,
  apiBaseUrl,
  userName,
  onSaved,
}: {
  accessToken: string | null;
  apiBaseUrl: string;
  userName: string;
  onSaved: (nextName: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [draftName, setDraftName] = useState(userName);
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [address, setAddress] = useState("123 Futurexa St, Tech City, TC 10101");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setDraftName(userName);
  }, [userName]);

  async function handleSaveProfile() {
    if (!accessToken) {
      setError("Missing auth token");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${apiBaseUrl}/api/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ 
          name: draftName,
          phone: phone,
          address: address
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({} as any))) as any;
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as any;
      const nextName = json?.data?.name ?? draftName;
      onSaved(nextName || draftName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function handleSimulateSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 shrink-0">
        <nav className="flex lg:flex-col gap-3 p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60">
          <button
            onClick={() => { setActiveTab("profile"); setError(null); setSuccess(false); }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${
              activeTab === "profile" ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {activeTab === "profile" && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-white shadow-sm border border-gray-100/50" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <User className={`h-4 w-4 relative z-10 transition-colors ${activeTab === "profile" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
            <span className="relative z-10">Profile details</span>
          </button>

          <button
            onClick={() => { setActiveTab("security"); setError(null); setSuccess(false); }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${
              activeTab === "security" ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {activeTab === "security" && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-white shadow-sm border border-gray-100/50" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <Shield className={`h-4 w-4 relative z-10 transition-colors ${activeTab === "security" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
            <span className="relative z-10">Security & Access</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        <motion.div 
          layout
          className="rounded-[2.5rem] border border-white/80 bg-white/70 backdrop-blur-3xl shadow-2xl shadow-blue-500/5 overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-white/60 px-8 py-8 bg-white/30">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                {activeTab === "profile" ? <UserCircle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight font-outfit">
                  {activeTab === "profile" && "Profile Details"}
                  {activeTab === "security" && "Security & Password"}
                </h2>
                <p className="text-sm text-gray-500 font-medium tracking-tight">
                  {activeTab === "profile" && "Manage your professional presence and contact information."}
                  {activeTab === "security" && "Enhanced encryption and access control settings."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-10">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Status Messages inside motion div for smooth transition */}
                  {(error || success) && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      {error && (
                        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 mb-4">
                          <p className="text-sm font-bold text-red-600">{error}</p>
                        </div>
                      )}
                      {success && (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 mb-4">
                          <p className="text-sm font-bold text-emerald-800 tracking-tight">Changes synchronized successfully.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex items-center gap-8 pb-8 border-b border-gray-100/50">
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-black shadow-inner">
                        {draftName.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute inset-0 rounded-[2rem] bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <button className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200">
                        Change Avatar
                      </button>
                      <p className="mt-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Min. 512x512px • Max 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Identity Name</label>
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="w-full rounded-2xl border border-gray-100 bg-white/50 px-5 py-4 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                        placeholder="Futurexa Identity"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Contact Protocol</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-2xl border border-gray-100 bg-white/50 px-5 py-4 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                        placeholder="+0 (000) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Corporate Presence Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full rounded-2xl border border-gray-100 bg-white/50 px-5 py-4 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm resize-none"
                      placeholder="Verified business location"
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving || !draftName.trim()}
                      className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <Save className="h-5 w-5" />
                      {saving ? "Synchronizing..." : "Save Identity"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-blue-600 border-b border-blue-50 pb-4">
                      <Key className="h-5 w-5" />
                      <h3 className="text-sm font-black uppercase tracking-widest">Credential Rotation</h3>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-2">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Verification Code (Current)</label>
                         <input
                           type="password"
                           placeholder="••••••••"
                           className="w-full rounded-2xl border border-gray-100 bg-white/50 px-5 py-4 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                         />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">New Secure Cipher</label>
                          <input
                            type="password"
                            placeholder="New passphrase"
                            className="w-full rounded-2xl border border-gray-100 bg-white/50 px-5 py-4 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Cipher</label>
                          <input
                            type="password"
                            placeholder="Repeat passphrase"
                            className="w-full rounded-2xl border border-gray-100 bg-white/50 px-5 py-4 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleSimulateSave}
                      disabled={saving}
                      className="inline-flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-black text-white shadow-xl shadow-gray-200 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <Shield className="h-5 w-5 text-blue-400" />
                      {saving ? "Updating Vault..." : "Update Vault Access"}
                    </button>
                  </div>

                  <div className="mt-8 pt-10 border-t border-gray-100">
                    <div className="rounded-3xl bg-red-50/50 border border-red-100 p-8">
                       <h3 className="text-sm font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                         Destruction Protocol
                       </h3>
                       <p className="text-xs text-gray-500 font-bold mb-6 tracking-tight">Permanently erase your identity and associated project metadata. This action is irreversible.</p>
                       <button className="px-6 py-3 rounded-xl border border-red-200 bg-white text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all group active:scale-[0.98]">
                         Terminate Account
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

