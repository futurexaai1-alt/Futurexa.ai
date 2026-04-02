import { Loader2, ExternalLink, MessageCircle, Github, CreditCard, Box, Zap, Settings2 } from "lucide-react";
import { useIntegrations } from "../hooks/useIntegrations";
import { useState, useEffect } from "react";

export default function IntegrationsPage() {
  const { integrations, loading } = useIntegrations();
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialToggles: Record<string, boolean> = {};
    const connectedNames = integrations.map((i) => (i.name as string)?.toLowerCase());
    
    // Default dummy state + actual DB state
    const apps = ["slack", "github", "stripe", "linear", "intercom"];
    apps.forEach(app => {
      initialToggles[app] = connectedNames.includes(app);
    });
    // Let's force some to be active for the demo if DB is empty
    if (integrations.length === 0) {
      initialToggles["slack"] = true;
      initialToggles["stripe"] = true;
    }
    setActiveToggles(initialToggles);
  }, [integrations]);

  const toggleIntegration = (id: string) => {
    setActiveToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const integrationList = [
    { id: "slack", name: "Slack", description: "Send notifications and alerts to Slack channels.", icon: MessageCircle, color: "text-rose-500", bg: "bg-rose-50" },
    { id: "github", name: "GitHub", description: "Link commits and pull requests to tasks and tickets.", icon: Github, color: "text-gray-900", bg: "bg-gray-100" },
    { id: "stripe", name: "Stripe", description: "Sync billing data, invoices, and payment statuses.", icon: CreditCard, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: "linear", name: "Linear", description: "Two-way sync for issues, projects, and milestones.", icon: Box, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "intercom", name: "Intercom", description: "Sync chat widgets and support tickets.", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Integrations</h3>
          <p className="text-sm text-gray-500 mt-1">Connect third-party tools to sync data across your workspace.</p>
        </div>
        <button className="h-10 px-5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          API Keys
        </button>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-medium">Loading integrations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrationList.map((app) => {
              const Icon = app.icon;
              const isActive = activeToggles[app.id];
              return (
                <div key={app.id} className={`p-6 rounded-3xl border-2 transition-all duration-300 ${
                  isActive ? "border-emerald-500/20 bg-emerald-50/30 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl ${app.bg} ${app.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <button
                      onClick={() => toggleIntegration(app.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                        isActive ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    >
                      <span className="sr-only">Toggle {app.name}</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">{app.name}</h4>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{app.description}</p>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${isActive ? "text-emerald-600" : "text-gray-400"}`}>
                      {isActive ? "Connected" : "Not Connected"}
                    </span>
                    {isActive && (
                      <button className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors">
                        Configure
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}