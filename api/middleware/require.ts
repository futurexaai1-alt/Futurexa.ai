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
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) throw new AuthError("Missing Authorization Bearer token", 401);

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
  if (userProfile.status !== "ACTIVE_CLIENT") {
    throw new AuthError("Workspace restricted: activate your account to access this resource", 403);
  }

  const membershipOrgId = await getOrganizationIdForUser(supabase, userProfile.id);
  if (!membershipOrgId || membershipOrgId !== orgId) throw new AuthError("Forbidden: organization mismatch", 403);

  return userProfile;
}

export async function requireNonSuspendedClientProfile(
  c: { env: Env; req: { header: (name: string) => string | undefined } },
  supabase: SupabaseClient,
  orgId: string
): Promise<SupabaseUserProfile> {
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) throw new AuthError("Missing Authorization Bearer token", 401);

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

  const membershipOrgId = await getOrganizationIdForUser(supabase, userProfile.id);
  if (!membershipOrgId || membershipOrgId !== orgId) throw new AuthError("Forbidden: organization mismatch", 403);

  return userProfile;
}

export async function requireClientProfileForRead(
  c: { env: Env; req: { header: (name: string) => string | undefined } },
  supabase: SupabaseClient,
  orgId: string
): Promise<SupabaseUserProfile> {
  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) throw new AuthError("Missing Authorization Bearer token", 401);

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile) throw new AuthError("Profile not found", 404);

  const { data: dbUser } = await supabase
    .from("User")
    .select("status")
    .eq("id", userProfile.id)
    .single();

  if (dbUser) userProfile.status = dbUser.status;

  if (userProfile.status === "DELETED") throw new AuthError("Account deleted", 403);
  if (userProfile.status !== "ACTIVE_CLIENT" && userProfile.status !== "SUSPENDED") {
    throw new AuthError("Workspace restricted: activate your account to access this resource", 403);
  }

  const membershipOrgId = await getOrganizationIdForUser(supabase, userProfile.id);
  if (!membershipOrgId || membershipOrgId !== orgId) throw new AuthError("Forbidden: organization mismatch", 403);

  return userProfile;
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