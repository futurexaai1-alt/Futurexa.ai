import { Loader2, Bell } from "lucide-react";
import { useWebhooks } from "../hooks/useWebhooks";

export default function WebhooksPage() {
  const { webhooks, loading } = useWebhooks();

  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Webhooks</h3>
          <p className="text-sm text-gray-500 mt-1">HTTP callbacks for event notifications.</p>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-medium">Loading webhooks...</p>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center">
              <Bell className="h-8 w-8" />
            </div>
            <p className="font-medium text-lg">No webhooks found</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">URL</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Events</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {webhooks.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-900 truncate max-w-xs">{(w as any).url || w.endpoint as string || "—"}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-700">{(w as any).events?.join(", ") || "ALL"}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      w.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" :
                      w.status === "INACTIVE" ? "bg-gray-100 text-gray-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {(w.status as string) || "ACTIVE"}
                    </span>
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