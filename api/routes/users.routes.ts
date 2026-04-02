import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { fetchSupabaseUserProfile, updateSupabaseUserStatus } from "../middleware/auth";
import { createNotification, createActivityLog } from "../services/notification.service";
import { sendResendEmail } from "../services/email.service";

export const usersRoutes = new Hono<{ Bindings: Env }>();

usersRoutes.get("/api/users", async (c) => {
  const supabase = getSupabaseClient(c.env);

  const { data: users, error } = await supabase
    .from("User")
    .select("id, email, name, status, createdAt")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }

  return c.json({ data: users });
});

usersRoutes.delete("/api/users/:id", async (c) => {
  const id = c.req.param("id");
  const supabase = getSupabaseClient(c.env);

  try {
    const { data: u } = await supabase
      .from("User")
      .select("id, email, (select count(*) from \"OrganizationMember\" where \"userId\" = id)")
      .eq("id", id)
      .single();

    if (!u) return c.json({ error: "User not found" }, 404);

    const memberCount = (u as any).OrganizationMember?.length || 0;
    if (memberCount > 0) {
      return c.json({ error: "Remove user from all organizations first" }, 400);
    }

    await Promise.all([
      supabase.from("Notification").delete().eq("userId", u.id),
      supabase.from("Comment").delete().eq("userId", u.id),
      supabase.from("LeadRequest").delete().eq("requestedById", u.id),
      supabase.from("OrganizationRequest").delete().eq("requestedById", u.id),
    ]);

    await supabase.from("User").delete().eq("id", u.id);

    return c.json({ success: true });
  } catch (err) {
    console.error("Error deleting user:", err);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

usersRoutes.patch("/api/users/:id/suspend", async (c) => {
  const id = c.req.param("id");
  const supabase = getSupabaseClient(c.env);

  try {
    const { reason } = await c.req.json().catch(() => ({}));

    const { data: user } = await supabase
      .from("User")
      .select("id, email, status")
      .eq("id", id)
      .single();

    if (!user) return c.json({ error: "User not found" }, 404);

    await supabase
      .from("User")
      .update({ status: "SUSPENDED" })
      .eq("id", id);

    updateSupabaseUserStatus(c.env, id, "SUSPENDED").catch(() => {});

    const { data: membership } = await supabase
      .from("OrganizationMember")
      .select("organizationId")
      .eq("userId", id)
      .limit(1)
      .single();

    if (membership) {
      await createActivityLog(supabase, {
        organizationId: membership.organizationId,
        userId: id,
        action: "User suspended",
        entityType: "User",
        entityId: id,
        metadata: { reason },
      });

      await createNotification(supabase, {
        organizationId: membership.organizationId,
        userId: id,
        title: "Account Suspended",
        body: reason ? `Your account has been suspended. Reason: ${reason}` : "Your account has been suspended. Please contact support.",
        channel: "IN_APP",
      });

      if (user.email) {
        await sendResendEmail(
          c.env,
          user.email,
          "Account Suspended",
          reason
            ? `Your Futurexa account has been suspended. Reason: ${reason}. Please contact support for more information.`
            : "Your Futurexa account has been suspended. Please contact support for more information."
        );
      }
    }

    return c.json({ success: true });
  } catch (err) {
    console.error("Error suspending user:", err);
    return c.json({ error: "Failed to suspend user" }, 500);
  }
});

usersRoutes.patch("/api/users/:id/unsuspend", async (c) => {
  const id = c.req.param("id");
  const supabase = getSupabaseClient(c.env);

  try {
    const { data: user } = await supabase
      .from("User")
      .select("id, email, status")
      .eq("id", id)
      .single();

    if (!user) return c.json({ error: "User not found" }, 404);

    await supabase
      .from("User")
      .update({ status: "ACTIVE_CLIENT" })
      .eq("id", id);

    updateSupabaseUserStatus(c.env, id, "ACTIVE_CLIENT").catch(() => {});

    const { data: membership } = await supabase
      .from("OrganizationMember")
      .select("organizationId")
      .eq("userId", id)
      .limit(1)
      .single();

    if (membership) {
      await createActivityLog(supabase, {
        organizationId: membership.organizationId,
        userId: id,
        action: "User unsuspended",
        entityType: "User",
        entityId: id,
      });

      await createNotification(supabase, {
        organizationId: membership.organizationId,
        userId: id,
        title: "Account Reactivated",
        body: "Your account has been reactivated. You now have full access to your workspace.",
        channel: "IN_APP",
      });

      if (user.email) {
        await sendResendEmail(
          c.env,
          user.email,
          "Account Reactivated",
          "Your Futurexa account has been reactivated. You now have full access to your workspace."
        );
      }
    }

    return c.json({ success: true });
  } catch (err) {
    console.error("Error unsuspending user:", err);
    return c.json({ error: "Failed to unsuspend user" }, 500);
  }
});

usersRoutes.patch("/api/users/:id/restore", async (c) => {
  const id = c.req.param("id");
  const supabase = getSupabaseClient(c.env);

  try {
    await supabase
      .from("User")
      .update({ status: "NEW_USER" })
      .eq("id", id);

    updateSupabaseUserStatus(c.env, id, "NEW_USER").catch(() => {});

    return c.json({ success: true });
  } catch (err) {
    console.error("Error restoring user:", err);
    return c.json({ error: "Failed to restore user" }, 500);
  }
});