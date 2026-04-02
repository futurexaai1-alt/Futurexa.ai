import { useEffect, useState } from "react";
import { User, Bell, Shield, Save, Key, Mail, Smartphone } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");
  const [draftName, setDraftName] = useState(userName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Mock preferences state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

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
        body: JSON.stringify({ name: draftName }),
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
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => { setActiveTab("profile"); setError(null); setSuccess(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "profile" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <User className="h-4 w-4" />
            Profile details
          </button>
          <button
            onClick={() => { setActiveTab("notifications"); setError(null); setSuccess(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "notifications" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button
            onClick={() => { setActiveTab("security"); setError(null); setSuccess(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "security" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Shield className="h-4 w-4" />
            Security & Access
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-2xl">
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden min-h-[400px]">
          
          {/* Header */}
          <div className="border-b border-gray-100 px-6 sm:px-8 py-6 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === "profile" && "Profile Details"}
              {activeTab === "notifications" && "Notification Preferences"}
              {activeTab === "security" && "Security & Password"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "profile" && "Manage your personal information and display name."}
              {activeTab === "notifications" && "Choose what updates you want to receive."}
              {activeTab === "security" && "Protect your account with a strong password."}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
            {/* Status Messages */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-800">Changes saved successfully!</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-2xl font-bold">
                    {draftName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <button className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                      Change Avatar
                    </button>
                    <p className="mt-2 text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider text-[11px]">Display Name</label>
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving || !draftName.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500 mt-0.5">Receive updates about your account activity via email.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Push Notifications</p>
                        <p className="text-xs text-gray-500 mt-0.5">Get real-time alerts on your devices.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-amber-50 p-2 text-amber-600">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Marketing & News</p>
                        <p className="text-xs text-gray-500 mt-0.5">Receive news, updates, and special offers.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" checked={marketingEmails} onChange={(e) => setMarketingEmails(e.target.checked)} />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSimulateSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Key className="h-4 w-4 text-gray-400" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSimulateSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-xs text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

