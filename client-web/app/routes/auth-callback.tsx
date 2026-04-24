import type { Route } from "./+types/auth-callback";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "../utils/supabase";
import { resolveApiBaseUrl } from "../utils/api-base";
import { Loader2, AlertCircle } from "lucide-react";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
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

export default function AuthCallback(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const supabase = useMemo(() => {
    return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
  }, [supabaseUrl, supabaseAnonKey]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError(null);

      const url = new URL(window.location.href);
      const authCode = url.searchParams.get("code");

      const hashParams = new URLSearchParams(
        url.hash.startsWith("#") ? url.hash.slice(1) : url.hash
      );
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      try {
        if (authCode) {
          await supabase.auth.exchangeCodeForSession(authCode);
        } else if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }

        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (session) {
          window.history.replaceState({}, document.title, "/auth/callback");
          navigate("/dashboard", { replace: true });

          if (apiBaseUrl) {
            fetch(`${apiBaseUrl}/api/onboarding`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
            })
              .then(async (onboardingRes) => {
                if (!onboardingRes.ok) {
                  const errorBody = await onboardingRes.text().catch(() => "");
                  console.error("Onboarding failed:", {
                    status: onboardingRes.status,
                    statusText: onboardingRes.statusText,
                    body: errorBody,
                  });
                }
              })
              .catch((onboardingError) => {
                console.error("Onboarding request error:", onboardingError);
              });
          }
          return;
        }

        window.history.replaceState({}, document.title, "/auth/callback");
        navigate("/signin", { replace: true });
      } catch (e) {
        if (cancelled) return;
        const fallbackMessage = e instanceof Error ? e.message : "Auth callback failed";
        setError(fallbackMessage);

        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            navigate("/dashboard", { replace: true });
            return;
          }
        } catch {}

        navigate("/signin", { replace: true });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate, supabase, apiBaseUrl]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100 font-sans relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] h-[780px] w-[780px] rounded-full bg-blue-100/50 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[620px] w-[620px] rounded-full bg-purple-100/40 blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/70 border border-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-blue-100/30 flex flex-col items-center text-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-6" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900 tracking-tight">
          Authenticating
        </h1>
        <p className="text-gray-500 font-medium">
          Securely signing you in...
        </p>

        {error && (
          <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium w-full text-left">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
