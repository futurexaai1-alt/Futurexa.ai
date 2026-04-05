import type { Route } from "./+types/auth-callback";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "../utils/supabase";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as any;
  const apiBaseUrlRaw =
    typeof env.API_BASE_URL === "string" && env.API_BASE_URL.length > 0
      ? env.API_BASE_URL.trim()
      : "";
  const configuredApiBaseUrl =
    apiBaseUrlRaw
      ? /^https?:\/\//i.test(apiBaseUrlRaw)
        ? apiBaseUrlRaw
        : `https://${apiBaseUrlRaw}`
      : env.API || (typeof env.API_BASE_URL === "object" && env.API_BASE_URL)
        ? ""
        : "";

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

        if (data.session) {
          const onboardingRes = await fetch(`${apiBaseUrl}/api/onboarding`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.session.access_token}`,
            },
          });

          if (!onboardingRes.ok) {
            const errorBody = await onboardingRes.text().catch(() => "");
            console.error("Onboarding failed:", {
              status: onboardingRes.status,
              statusText: onboardingRes.statusText,
              body: errorBody,
            });
          }
        }

        window.history.replaceState({}, document.title, "/auth/callback");

        if (data.session) navigate("/dashboard", { replace: true });
        else navigate("/signin", { replace: true });
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Auth callback failed");
        navigate("/signin", { replace: true });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate, supabase, apiBaseUrl]);

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1>Signing you in...</h1>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
    </main>
  );
}
