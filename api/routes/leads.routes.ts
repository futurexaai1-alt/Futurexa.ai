import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { extractBearerToken, fetchSupabaseUserProfile, updateSupabaseUserStatus } from "../middleware/auth";

export const leadsRoutes = new Hono<{ Bindings: Env }>();

leadsRoutes.get("/api/project-requests", async (c) => {
  const supabase = getSupabaseClient(c.env);

  const { data: requests, error } = await supabase
    .from("LeadRequest")
    .select(`
      *,
      requestedBy:User(*),
      organization:Organization(*)
    `)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching project requests:", error);
    return c.json({ error: "Failed to fetch requests" }, 500);
  }

  return c.json({ data: requests });
});

leadsRoutes.post("/api/lead-requests", async (c) => {
  let supabase;
  try {
    supabase = getSupabaseClient(c.env);
    console.log("Supabase client created successfully");
  } catch (err) {
    console.error("Failed to create supabase client:", err);
    return c.json({ error: "Server configuration error" }, 500);
  }

  const token = extractBearerToken(c.req.header("authorization") ?? undefined);
  if (!token) return c.json({ error: "Missing Authorization Bearer token" }, 401);

  const userProfile = await fetchSupabaseUserProfile(c.env, token);
  if (!userProfile?.id) return c.json({ error: "User not found" }, 404);

  const { type, description } = await c.req.json();

  const { data: existingUser } = await supabase
    .from("User")
    .select("id")
    .eq("id", userProfile.id)
    .single();

  if (!existingUser) {
    const { error: userError } = await supabase.from("User").insert({
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      status: userProfile.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (userError) {
      console.error("Error creating user:", userError);
      return c.json({ error: "Failed to create user: " + userError.message }, 500);
    }
  }

  let { data: membership } = await supabase
    .from("OrganizationMember")
    .select("organizationId")
    .eq("userId", userProfile.id)
    .limit(1)
    .single();

  if (!membership) {
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orgError || !organization) {
      console.error("Error creating organization:", JSON.stringify(orgError));
      return c.json({ error: "Failed to create organization: " + orgError?.message }, 500);
    }

    const { data: newMembership, error: memberError } = await supabase
      .from("OrganizationMember")
      .insert({
        organizationId: organization.id,
        userId: userProfile.id,
        joinedAt: new Date().toISOString(),
      })
      .select("organizationId")
      .single();

    if (memberError) {
      console.error("Error creating membership:", memberError);
      return c.json({ error: "Failed to create membership" }, 500);
    }

    membership = newMembership;
  }

  const { data: leadRequest, error } = await supabase
    .from("LeadRequest")
    .insert({
      organizationId: membership.organizationId,
      requestedById: userProfile.id,
      type: type || "DEMO",
      status: "SUBMITTED",
      description: description ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating lead request:", error);
    return c.json({ error: "Failed to create lead request" }, 500);
  }

  return c.json({ data: leadRequest }, 201);
});

leadsRoutes.patch("/api/project-requests/:id/status", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");
  const { status, internalNote, rejectionReason } = await c.req.json();

  try {
    const { data: existingRequest } = await supabase
      .from("LeadRequest")
      .select("*, requestedBy:User(*)")
      .eq("id", id)
      .single();

    if (!existingRequest) {
      return c.json({ error: "Lead request not found" }, 404);
    }

    const { data: request, error } = await supabase
      .from("LeadRequest")
      .update({
        status,
        internalNote: internalNote ?? null,
        rejectionReason: rejectionReason ?? null,
      })
      .eq("id", id)
      .select("*, requestedBy:User(*)")
      .single();

    if (error) {
      console.error("Error updating request:", error);
      return c.json({ error: "Failed to update request" }, 500);
    }

    if (status === "APPROVED" && existingRequest.requestedById) {
      await Promise.all([
        supabase
          .from("User")
          .update({ status: "ACTIVE_CLIENT" })
          .eq("id", existingRequest.requestedById),
        supabase
          .from("Organization")
          .update({ status: "ACTIVE" })
          .eq("id", existingRequest.organizationId),
      ]);

      updateSupabaseUserStatus(c.env, existingRequest.requestedById, "ACTIVE_CLIENT").catch(() => {});
    }

    return c.json({ data: request });
  } catch (err) {
    console.error("Error updating project request status:", err);
    return c.json({ error: err instanceof Error ? err.message : "Failed to update status" }, 500);
  }
});

leadsRoutes.delete("/api/project-requests/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const id = c.req.param("id");

  try {
    const { data: existingRequest } = await supabase
      .from("LeadRequest")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingRequest) {
      return c.json({ error: "Lead request not found" }, 404);
    }

    await supabase.from("LeadRequest").delete().eq("id", id);

    return c.json({ success: true });
  } catch (err) {
    console.error("Error deleting project request:", err);
    return c.json({ error: "Failed to delete request" }, 500);
  }
});
