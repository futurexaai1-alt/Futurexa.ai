import type { Env, SupabaseUserProfile } from "../types";
import { fetchSupabaseUserProfile, extractBearerToken } from "./auth";
import { getSupabaseClient } from "../services/supabase.service";
import type { SupabaseClient } from "@supabase/supabase-js";

export class AuthError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message);
    this.name = "AuthError";
  }
}

type CachedAuthEntry = {
  profile: SupabaseUserProfile;
  orgId: string;
  mode: "active" | "nonSuspended" | "read";
  expiresAt: number;
};

const authProfileCache = new Map<string, CachedAuthEntry>();
const userToAuthCacheKeys = new Map<string, Set<string>>();

function isAuthCacheEnabled(env: Env): boolean {
  return (env.AUTH_CACHE_V1 ?? "").toLowerCase() === "true";
}

function shouldBypassAuthCache(
  c: { req: { header: (name: string) => string | undefined } }
): boolean {
  return (c.req.header("x-no-auth-cache") ?? "").toLowerCase() === "true";
}

function getAuthCacheTtlMs(env: Env): number {
  const parsed = Number(env.AUTH_CACHE_TTL_MS ?? "30000");
  if (!Number.isFinite(parsed) || parsed <= 0) return 30000;
  return Math.min(parsed, 120000);
}

function buildAuthCacheKey(token: string, orgId: string, mode: CachedAuthEntry["mode"]): string {
  return `${mode}:${orgId}:${token}`;
}

function getCachedAuthEntry(key: string): CachedAuthEntry | null {
  const cached = authProfileCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    authProfileCache.delete(key);
    return null;
  }
  return cached;
}

function setCachedAuthEntry(
  key: string,
  userId: string,
  orgId: string,
  mode: CachedAuthEntry["mode"],
  profile: SupabaseUserProfile,
  ttlMs: number
): void {
  authProfileCache.set(key, {
    profile,
    orgId,
    mode,
    expiresAt: Date.now() + ttlMs,
  });

  let keys = userToAuthCacheKeys.get(userId);
  if (!keys) {
    keys = new Set<string>();
    userToAuthCacheKeys.set(userId, keys);
  }
  keys.add(key);
}

export function invalidateAuthCacheForUser(userId: string): void {
  const keys = userToAuthCacheKeys.get(userId);
  if (!keys) return;
  for (const key of keys) {
    authProfileCache.delete(key);
  }
  userToAuthCacheKeys.delete(userId);
}

async function requireProfileWithMode(
  c: { env: Env; req: { header: (name: string) => string | undefined } },
  supabase: SupabaseClient,
  orgId: string,
  mode: CachedAuthEntry["mode"]
): Promise<SupabaseUserProfile> {
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) throw new AuthError("Missing Authorization Bearer token", 401);

  const useCache = isAuthCacheEnabled(c.env) && !shouldBypassAuthCache(c);
  const cacheKey = buildAuthCacheKey(token, orgId, mode);
  if (useCache) {
    const cached = getCachedAuthEntry(cacheKey);
    if (cached) return { ...cached.profile };
  }

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile) throw new AuthError("Profile not found", 404);

  const { data: dbUser } = await supabase
    .from("User")
    .select("status")
    .eq("id", userProfile.id)
    .single();

  if (dbUser) userProfile.status = dbUser.status;

  if (userProfile.status === "SUSPENDED") throw new AuthError("Account suspended", 403);
  if (userProfile.status === "DELETED") throw new AuthError("Account deleted", 403);
  if (mode === "active" && userProfile.status !== "ACTIVE_CLIENT") {
    throw new AuthError("Workspace restricted: activate your account to access this resource", 403);
  }
  if (mode === "read" && userProfile.status !== "ACTIVE_CLIENT" && userProfile.status !== "SUSPENDED") {
    throw new AuthError("Workspace restricted: activate your account to access this resource", 403);
  }

  const membershipOrgId = await getOrganizationIdForUser(supabase, userProfile.id);
  if (!membershipOrgId || membershipOrgId !== orgId) throw new AuthError("Forbidden: organization mismatch", 403);

  if (useCache) {
    setCachedAuthEntry(
      cacheKey,
      userProfile.id,
      orgId,
      mode,
      { ...userProfile },
      getAuthCacheTtlMs(c.env)
    );
  }

  return userProfile;
}

export async function getOrganizationIdForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("OrganizationMember")
    .select("organizationId")
    .eq("userId", userId)
    .limit(1)
    .single();

  return data?.organizationId ?? null;
}

export async function requireActiveClientProfile(
  c: { env: Env; req: { header: (name: string) => string | undefined } },
  supabase: SupabaseClient,
  orgId: string
): Promise<SupabaseUserProfile> {
  return requireProfileWithMode(c, supabase, orgId, "active");
}

export async function requireNonSuspendedClientProfile(
  c: { env: Env; req: { header: (name: string) => string | undefined } },
  supabase: SupabaseClient,
  orgId: string
): Promise<SupabaseUserProfile> {
  return requireProfileWithMode(c, supabase, orgId, "nonSuspended");
}

export async function requireClientProfileForRead(
  c: { env: Env; req: { header: (name: string) => string | undefined } },
  supabase: SupabaseClient,
  orgId: string
): Promise<SupabaseUserProfile> {
  return requireProfileWithMode(c, supabase, orgId, "read");
}

export async function requireAnyAuthProfile(
  c: { env: Env; req: { header: (name: string) => string | undefined } }
): Promise<SupabaseUserProfile> {
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) throw new AuthError("Missing Authorization Bearer token", 401);

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile) throw new AuthError("Profile not found", 404);

  return userProfile;
}
