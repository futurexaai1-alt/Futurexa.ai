import { Loader2, CreditCard } from "lucide-react";
import { useBilling } from "../hooks/useBilling";

export default function BillingPage() {
  const { subscriptions, payments, invoices, loading } = useBilling();

  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Billing</h3>
          <p className="text-sm text-gray-500 mt-1">Subscriptions, invoices, and payments.</p>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-medium">Loading billing data...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Subscriptions</h4>
              {subscriptions.length === 0 ? (
                <p className="text-gray-500">No subscriptions found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Started</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {subscriptions.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-gray-900">{s.planName as string}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            s.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" :
                            s.status === "CANCELLED" ? "bg-red-50 text-red-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {s.status as string}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-500">
                            {s.startedAt ? new Date(s.startedAt as string).toLocaleDateString() : ""}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}