import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { extractBearerToken, fetchSupabaseUserProfile } from "../middleware/auth";

export const authRoutes = new Hono<{ Bindings: Env }>();

authRoutes.post("/api/onboarding", async (c) => {
  const env = c.env;
  let supabase;
  try {
    supabase = getSupabaseClient(env);
  } catch (e: any) {
    console.error("onboarding getSupabaseClient failed:", e?.message);
    return c.json({ error: "Service configuration error" }, 500);
  }

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) return c.json({ error: "Missing Authorization Bearer token" }, 401);

  const userProfile = await fetchSupabaseUserProfile(env, token);
  if (!userProfile?.id) return c.json({ error: "User not found" }, 404);

  const { data: existingMembership } = await supabase
    .from("OrganizationMember")
    .select("organizationId")
    .eq("userId", userProfile.id)
    .order("joinedAt", { ascending: false })
    .limit(1);

  if (existingMembership && existingMembership.length > 0) {
    return c.json({ success: true, organizationId: existingMembership[0].organizationId, isNew: false });
  }

  const { data: existingUser } = await supabase
    .from("User")
    .select("id")
    .eq("id", userProfile.id)
    .single();

  if (!existingUser) {
    await supabase.from("User").insert({
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      status: userProfile.status,
    });
  }

  let shortCode: string;
  let exists = true;
  while (exists) {
    shortCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const { data } = await supabase
      .from("Organization")
      .select("id")
      .eq("shortCode", shortCode)
      .limit(1);
    exists = data && data.length > 0;
  }

  const { data: organization, error: orgError } = await supabase
    .from("Organization")
    .insert({
      name: `${userProfile.name || userProfile.email}'s Organization`,
      status: "PENDING_APPROVAL",
      shortCode: shortCode,
    })
    .select()
    .single();

  if (orgError || !organization) {
    return c.json({ error: "Failed to create organization" }, 500);
  }

  const { data: orgRequest } = await supabase
    .from("OrganizationRequest")
    .insert({
      organizationId: organization.id,
      requestedById: userProfile.id,
      status: "SUBMITTED",
    })
    .select()
    .single();

  return c.json({
    success: true,
    organizationId: organization.id,
    requestId: orgRequest?.id,
    status: orgRequest?.status || "SUBMITTED",
    isNew: true
  });
});

authRoutes.get("/api/me", async (c) => {
  const env = c.env;
  let supabase;
  try {
    supabase = getSupabaseClient(env);
  } catch (e: any) {
    console.error("getSupabaseClient failed:", e.message);
    return c.json({ error: "Service configuration error" }, 500);
  }

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) return c.json({ error: "Missing Authorization Bearer token" }, 401);

  const userProfile = await fetchSupabaseUserProfile(env, token);
  if (!userProfile?.id) return c.json({ error: "User not found" }, 404);

  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("id, email, name, status, createdAt")
    .eq("id", userProfile.id)
    .single();

  if (userError) {
    console.error("Error fetching userData:", userError);
  }

  const { data: pendingLeadRequest, error: leadError } = await supabase
    .from("LeadRequest")
    .select("id, status, organizationId")
    .eq("requestedById", userProfile.id)
    .in("status", ["SUBMITTED", "IN_REVIEW"])
    .limit(1);

  if (leadError) {
    console.error("Error fetching pendingLeadRequest:", leadError);
  }

  const { data: approvedLeadRequest } = await supabase
    .from("LeadRequest")
    .select("id, status, organizationId")
    .eq("requestedById", userProfile.id)
    .eq("status", "APPROVED")
    .limit(1);

  let effectiveStatus = userData?.status ?? userProfile.status;
  let organizationId: string | null = null;

  if (pendingLeadRequest && pendingLeadRequest.length > 0) {
    effectiveStatus = "LEAD";
    organizationId = pendingLeadRequest[0]?.organizationId ?? null;
  } else if (approvedLeadRequest && approvedLeadRequest.length > 0) {
    effectiveStatus = "ACTIVE_CLIENT";
    organizationId = approvedLeadRequest[0]?.organizationId ?? null;
  }

  if (!userData) {
    const defaultEmail = userProfile.email || `${userProfile.id}@no-email.app`;
    const { data: newUser, error: insertError } = await supabase
      .from("User")
      .insert({
        id: userProfile.id,
        email: defaultEmail,
        name: userProfile.name || "Unknown User",
        status: effectiveStatus,
      })
      .select("id, email, name, status, createdAt")
      .single();

    if (insertError || !newUser) {
      console.error("Error creating user in /api/me:", insertError);
      return c.json({ error: "Failed to create user", details: insertError }, 500);
    }

    return c.json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      status: effectiveStatus,
      organizationId: organizationId,
    });
  }

  const { data: membership } = await supabase
    .from("OrganizationMember")
    .select("organizationId")
    .eq("userId", userProfile.id)
    .order("joinedAt", { ascending: false })
    .limit(1);

  const finalOrgId = organizationId ?? membership?.[0]?.organizationId ?? null;

  return c.json({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    status: effectiveStatus,
    organizationId: finalOrgId,
  });
});
