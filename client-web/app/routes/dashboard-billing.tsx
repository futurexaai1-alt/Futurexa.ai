import type { Route } from "./+types/dashboard-billing";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Download, Receipt } from "lucide-react";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import { resolveApiBaseUrl } from "../utils/api-base";
import { ensureDashboardAuth } from "../utils/dashboard-auth";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

type Subscription = {
  id: string;
  title: string;
  status: string;
  startedAt: string;
  endedAt?: string;
};

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as any;
  const configuredApiBaseUrl = resolveApiBaseUrl(env);

  return {
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    apiBaseUrl: configuredApiBaseUrl,
  } satisfies LoaderData;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Billing | futurexa.ai" },
    { name: "description", content: "Manage your billing and subscriptions" },
  ];
}

export default function DashboardBilling(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>("NEW_USER");
  const [statusConfirmed, setStatusConfirmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function bootstrapAuth() {
      try {
        const auth = await ensureDashboardAuth({
          supabaseUrl,
          supabaseAnonKey,
          apiBaseUrl,
        });

        if (!cancelled) {
          if (!auth) {
            setIsLoading(false);
            navigate("/signin");
            return;
          }

          setAccessToken(auth.accessToken);
          setOrganizationId(auth.organizationId);
          setUserStatus(auth.userStatus || "NEW_USER");

          const status = auth.userStatus || "NEW_USER";
          setUserStatus(status);
          if (status !== "ACTIVE_CLIENT" && status !== "PENDING_CLIENT") {
            setIsLoading(false);
            navigate("/dashboard");
            return;
          }
          setStatusConfirmed(true);
        }
      } catch {
        if (!cancelled) {
          setIsLoading(false);
          navigate("/signin");
        }
      }
    }

    bootstrapAuth();
    return () => { cancelled = true; };
  }, [navigate, supabaseUrl, supabaseAnonKey, apiBaseUrl]);

  useEffect(() => {
    if (!organizationId || !accessToken || !statusConfirmed) return;
    const controller = new AbortController();
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      try {
        const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId as string };
        const res = await fetch(`${apiBaseUrl}/api/billing/subscriptions?limit=50&offset=0`, {
          headers,
          signal: controller.signal,
        });

        if (!cancelled && res.ok) {
          const json = await res.json() as any;
          const data = json?.data ?? [];
          setSubscriptions(data.map((s: any) => ({
            id: s.id,
            title: s.planName || "Enterprise Plan",
            status: s.status || "ACTIVE",
            startedAt: s.startedAt ? new Date(s.startedAt).toLocaleDateString() : new Date().toLocaleDateString(),
            endedAt: s.endedAt ? new Date(s.endedAt).toLocaleDateString() : undefined,
          })));
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Failed to fetch subscriptions", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [organizationId, accessToken, apiBaseUrl, statusConfirmed]);

  if (isLoading) {
    return (
      <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="billing">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  const activeSub = subscriptions.find(s => s.status === "ACTIVE") || subscriptions[0];

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="billing">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h1>
            <p className="mt-1 text-gray-500">Manage your active plans, invoices, and payment methods.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">Current Plan</h2>
              </div>
              
              {activeSub ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 h-32 w-32 -mr-8 -mt-8 rounded-full bg-blue-500/10 transition-transform group-hover:scale-150 duration-700" />
                  <div className="relative">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 mb-3">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {activeSub.status}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">{activeSub.title}</h3>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mt-8">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Started On</p>
                        <p className="font-semibold text-gray-900">{activeSub.startedAt}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Billing Cycle</p>
                        <p className="font-semibold text-gray-900">Monthly</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">No active subscription</p>
                  <p className="mt-1 text-sm text-gray-500">You are not currently subscribed to any plan.</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-gray-400" />
                  <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
                </div>
              </div>
              
              <div className="space-y-3">
                {subscriptions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No recent invoices.</p>
                ) : (
                  [1, 2].map(i => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-400">
                          <Receipt className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Invoice #{Math.floor(Math.random() * 10000) + 1000}</p>
                          <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">PAID</span>
                        <p className="font-bold text-gray-900">$1,250.00</p>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 transition-colors" title="Download PDF">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="rounded-xl border border-gray-200 p-4 flex items-center gap-3 bg-gray-50">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-800 text-white font-bold text-xs">VISA</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">•••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/28</p>
                </div>
              </div>
              <button disabled className="mt-4 w-full rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
                Update Method
              </button>
            </div>
            
            <div className="rounded-3xl border border-gray-100 bg-gray-900 p-6 shadow-sm text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 h-32 w-32 -mr-8 -mt-8 rounded-full bg-white/5" />
               <div className="relative">
                 <h2 className="text-lg font-bold mb-2">Need Help?</h2>
                 <p className="text-sm text-gray-400 mb-6">Have questions regarding your billing or invoices?</p>
                 <a href="/dashboard/ticket" className="inline-block rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 text-sm font-semibold transition-colors">
                   Contact Support
                 </a>
               </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
