import type { SupabaseClient } from "@supabase/supabase-js";

export async function createNotification(
  supabase: SupabaseClient,
  input: {
    organizationId: string;
    userId: string;
    title: string;
    body?: string | null;
    channel?: "IN_APP";
  }
): Promise<void> {
  try {
    await supabase.from("Notification").insert({
      organizationId: input.organizationId,
      userId: input.userId,
      title: input.title,
      body: input.body ?? null,
      channel: input.channel ?? "IN_APP",
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}

export async function createActivityLog(
  supabase: SupabaseClient,
  input: {
    organizationId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    const { data, error } = await supabase.from("ActivityLog").insert({
      organizationId: input.organizationId,
      userId: input.userId || null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? "",
      metadata: input.metadata ?? null,
    });

    if (error) {
      console.error("ActivityLog insert error:", JSON.stringify(error, null, 2));
    } else {
      console.log("ActivityLog created successfully:", data);
    }
  } catch (err) {
    console.error("ActivityLog catch error:", err);
  }
}
