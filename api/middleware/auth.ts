import type { Env, SupabaseUserProfile } from "../types";

export function extractBearerToken(authHeader: string | undefined): string | null {
  const value = authHeader ?? "";
  return value.startsWith("Bearer ") ? value.slice("Bearer ".length) : null;
}

export function decodeJwtPayload(jwt: string): any | null {
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return null;
    const payloadB64Url = parts[1];
    const payloadB64 = payloadB64Url.replaceAll("-", "+").replaceAll("_", "/");
    const pad = payloadB64.length % 4 === 0 ? "" : "=".repeat(4 - (payloadB64.length % 4));
    const binary = atob(payloadB64 + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export async function fetchSupabaseUserProfile(
  env: Env,
  token: string
): Promise<SupabaseUserProfile | null> {
  const decodedJwt = decodeJwtPayload(token);
  const decodedId: string | null = decodedJwt?.sub ?? decodedJwt?.user_id ?? null;
  const decodedEmail: string | null =
    decodedJwt?.email ?? decodedJwt?.user_metadata?.email ?? null;
  const decodedName: string | null =
    decodedJwt?.user_metadata?.full_name ?? decodedJwt?.user_metadata?.name ?? null;

  const anonKey = (env.SUPABASE_ANON_KEY || "").trim().replace(/^"|"$/g, "");
  const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY || "").trim().replace(/^"|"$/g, "");
  const supabaseUrl = (env.SUPABASE_URL || "").trim().replace(/^"|"$/g, "");

  const payloadRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      // Must use anonKey when providing a user's Bearer token
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!payloadRes.ok) {
    const text = await payloadRes.text().catch(() => "failed to read body");
    console.error("fetchSupabaseUserProfile: failed to get user from auth, body:", text);
    if (!decodedId) return null;

    const userRes = await fetch(
      `${supabaseUrl}/rest/v1/User?id=eq.${encodeURIComponent(decodedId)}&select=id,email,name,status&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    if (userRes.ok) {
      const userData = (await userRes.json()) as SupabaseUserProfile[];
      if (userData?.length > 0) return userData[0];
    } else {
      const restText = await userRes.text().catch(() => "failed to read rest body");
      console.error("fetchSupabaseUserProfile: fallback /rest/v1/User failed:", restText);
    }

    if (!decodedEmail) return null;
    return { id: decodedId, email: decodedEmail, name: decodedName, status: "NEW_USER" };
  }

  const payload = await payloadRes.json() as any;
  const userId = payload?.id;
  const email = payload?.email;
  const name = payload?.user_metadata?.full_name || payload?.user_metadata?.name || null;

  return { id: userId, email, name, status: "NEW_USER" };
}

export async function updateSupabaseUserStatus(
  env: Env,
  userId: string,
  status: string
): Promise<void> {
  try {
    const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY || "").replace(/^"|"$/g, "");
    const supabaseUrl = (env.SUPABASE_URL || "").trim().replace(/^"|"$/g, "");
    const res = await fetch(`${supabaseUrl}/rest/v1/User?id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`Supabase user status update failed: ${text}`);
    }
  } catch (err) {
    console.error("Failed to update Supabase user status:", err);
  }
}

export function isAdminCrmRequest(c: { req: { header: (name: string) => string | undefined } }): boolean {
  return c.req.header("x-admin-crm") === "true";
}

export function getOrgIdFromHeader(c: { req: { header: (name: string) => string | undefined } }): string | null {
  return c.req.header("x-organization-id") ?? null;
}