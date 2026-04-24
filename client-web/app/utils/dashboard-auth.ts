import {
  getStoredAuth,
  isProfileCacheFresh,
  setStoredAuth,
} from "../features/dashboard/components/DashboardLayout";
import { createSupabaseBrowserClient } from "./supabase";

export type DashboardAuthBootstrap = {
  accessToken: string;
  organizationId: string;
  userStatus: string;
  userName: string;
  userEmail: string | null;
};

type EnsureDashboardAuthOptions = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

let inflightKey: string | null = null;
let inflightPromise: Promise<DashboardAuthBootstrap | null> | null = null;

export async function ensureDashboardAuth(
  options: EnsureDashboardAuthOptions
): Promise<DashboardAuthBootstrap | null> {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = options;
  const supabase = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (!session) return null;

  const token = session.access_token;
  const user = session.user;
  const fallbackName = user.email?.split("@")[0] ?? "Client";
  const fullName = (user.user_metadata?.full_name as string | undefined) ?? fallbackName;
  const metadataOrgId = (user.user_metadata?.organization_id as string | undefined) ?? null;
  const cached = getStoredAuth();
  const cacheMatch = cached?.accessToken === token ? cached : null;

  if (
    cacheMatch?.organizationId &&
    cacheMatch.userStatus &&
    isProfileCacheFresh(cacheMatch)
  ) {
    return {
      accessToken: token,
      organizationId: cacheMatch.organizationId,
      userStatus: cacheMatch.userStatus,
      userName: fullName,
      userEmail: user.email ?? null,
    };
  }

  const requestKey = `${token}:${apiBaseUrl}`;
  if (inflightPromise && inflightKey === requestKey) {
    return inflightPromise;
  }

  inflightKey = requestKey;
  inflightPromise = (async () => {
    const meEndpoint = apiBaseUrl ? `${apiBaseUrl}/api/me` : "/api/me";
    const res = await fetch(meEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as any;
    const nextOrgId = (json?.organizationId as string | null) || metadataOrgId;
    const nextStatus = (json?.status as string | undefined) ?? "NEW_USER";

    if (!nextOrgId) return null;

    setStoredAuth({
      userName: fullName,
      userStatus: nextStatus,
      userEmail: user.email ?? null,
      organizationId: nextOrgId,
      accessToken: token,
      profileSyncedAt: Date.now(),
    });

    return {
      accessToken: token,
      organizationId: nextOrgId,
      userStatus: nextStatus,
      userName: fullName,
      userEmail: user.email ?? null,
    };
  })();

  try {
    return await inflightPromise;
  } finally {
    if (inflightKey === requestKey) {
      inflightKey = null;
      inflightPromise = null;
    }
  }
}
