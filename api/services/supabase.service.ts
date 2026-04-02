import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Env } from "../types";

export function getSupabaseClient(env: Env): SupabaseClient {
  const rawKey = env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const rawUrl = env.SUPABASE_URL ?? "";
  const serviceRoleKey = rawKey.replace(/^"|"$/g, "").trim();
  const supabaseUrl = rawUrl.replace(/^"|"$/g, "").trim();

  if (!serviceRoleKey || !supabaseUrl) {
    console.error("Missing config:", { 
      hasKey: !!rawKey, 
      hasUrl: !!rawUrl,
      keyLength: rawKey.length,
      urlLength: rawUrl.length
    });
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL");
  }

  if (!supabaseUrl.startsWith("https://")) {
    throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createSupabaseClientWithToken(env: Env, token: string): SupabaseClient {
  const anonKey = env.SUPABASE_ANON_KEY?.replace(/^"|"$/g, "") || "";
  const supabaseUrl = env.SUPABASE_URL?.replace(/^"|"$/g, "") || "";

  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export interface Database {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          status: string;
          suspendedReason: string | null;
          deletedAt: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          status?: string;
          suspendedReason?: string | null;
          deletedAt?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          status?: string;
          suspendedReason?: string | null;
          deletedAt?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Organization: {
        Row: {
          id: string;
          shortCode: string | null;
          name: string;
          status: string;
          planId: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          shortCode?: string | null;
          name: string;
          status?: string;
          planId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          shortCode?: string | null;
          name?: string;
          status?: string;
          planId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      OrganizationMember: {
        Row: {
          id: string;
          organizationId: string;
          userId: string;
          roleId: string | null;
          joinedAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          userId: string;
          roleId?: string | null;
          joinedAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          userId?: string;
          roleId?: string | null;
          joinedAt?: string;
        };
      };
      FileAsset: {
        Row: {
          id: string;
          organizationId: string;
          projectId: string | null;
          uploadedById: string | null;
          uploadedByRole: string | null;
          originalFilename: string;
          r2ObjectKey: string;
          mimeType: string;
          fileSize: number;
          folder: string | null;
          fileUrl: string;
          fileType: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
          deletedAt: string | null;
        };
        Insert: {
          id?: string;
          organizationId: string;
          projectId?: string | null;
          uploadedById?: string | null;
          uploadedByRole?: string | null;
          originalFilename: string;
          r2ObjectKey: string;
          mimeType: string;
          fileSize: number;
          folder?: string | null;
          fileUrl: string;
          fileType?: string | null;
          status?: string;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
        Update: {
          id?: string;
          organizationId?: string;
          projectId?: string | null;
          uploadedById?: string | null;
          uploadedByRole?: string | null;
          originalFilename?: string;
          r2ObjectKey?: string;
          mimeType?: string;
          fileSize?: number;
          folder?: string | null;
          fileUrl?: string;
          fileType?: string | null;
          status?: string;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
      };
      FileAuditLog: {
        Row: {
          id: string;
          organizationId: string;
          userId: string | null;
          fileAssetId: string | null;
          action: string;
          ipAddress: string | null;
          userAgent: string | null;
          metadata: Record<string, any> | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          userId?: string | null;
          fileAssetId?: string | null;
          action: string;
          ipAddress?: string | null;
          userAgent?: string | null;
          metadata?: Record<string, any> | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          userId?: string | null;
          fileAssetId?: string | null;
          action?: string;
          ipAddress?: string | null;
          userAgent?: string | null;
          metadata?: Record<string, any> | null;
          createdAt?: string;
        };
      };
      ActivityLog: {
        Row: {
          id: string;
          organizationId: string;
          userId: string | null;
          action: string;
          entityType: string;
          entityId: string;
          metadata: Record<string, any> | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          userId?: string | null;
          action: string;
          entityType: string;
          entityId: string;
          metadata?: Record<string, any> | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          userId?: string | null;
          action?: string;
          entityType?: string;
          entityId?: string;
          metadata?: Record<string, any> | null;
          createdAt?: string;
        };
      };
      Project: {
        Row: {
          id: string;
          organizationId: string;
          name: string;
          description: string | null;
          status: string;
          createdById: string | null;
          createdAt: string;
          updatedAt: string;
          deletedAt: string | null;
        };
        Insert: {
          id?: string;
          organizationId: string;
          name: string;
          description?: string | null;
          status?: string;
          createdById?: string | null;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
        Update: {
          id?: string;
          organizationId?: string;
          name?: string;
          description?: string | null;
          status?: string;
          createdById?: string | null;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
      };
      Milestone: {
        Row: {
          id: string;
          organizationId: string;
          projectId: string;
          title: string;
          description: string | null;
          status: string;
          dueDate: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          projectId: string;
          title: string;
          description?: string | null;
          status?: string;
          dueDate?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          projectId?: string;
          title?: string;
          description?: string | null;
          status?: string;
          dueDate?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Ticket: {
        Row: {
          id: string;
          organizationId: string;
          projectId: string | null;
          title: string;
          description: string | null;
          status: string;
          createdById: string | null;
          assignedToId: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          projectId?: string | null;
          title: string;
          description?: string | null;
          status?: string;
          createdById?: string | null;
          assignedToId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          projectId?: string | null;
          title?: string;
          description?: string | null;
          status?: string;
          createdById?: string | null;
          assignedToId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Task: {
        Row: {
          id: string;
          organizationId: string;
          projectId: string | null;
          title: string;
          description: string | null;
          status: string;
          createdById: string | null;
          assignedToId: string | null;
          dueDate: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          projectId?: string | null;
          title: string;
          description?: string | null;
          status?: string;
          createdById?: string | null;
          assignedToId?: string | null;
          dueDate?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          projectId?: string | null;
          title?: string;
          description?: string | null;
          status?: string;
          createdById?: string | null;
          assignedToId?: string | null;
          dueDate?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      LeadRequest: {
        Row: {
          id: string;
          organizationId: string;
          requestedById: string;
          type: string;
          status: string;
          description: string | null;
          internalNote: string | null;
          rejectionReason: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          requestedById: string;
          type: string;
          status?: string;
          description?: string | null;
          internalNote?: string | null;
          rejectionReason?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          requestedById?: string;
          type?: string;
          status?: string;
          description?: string | null;
          internalNote?: string | null;
          rejectionReason?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      OrganizationRequest: {
        Row: {
          id: string;
          organizationId: string;
          requestedById: string;
          status: string;
          rejectionReason: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          requestedById: string;
          status?: string;
          rejectionReason?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          requestedById?: string;
          status?: string;
          rejectionReason?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Notification: {
        Row: {
          id: string;
          organizationId: string;
          userId: string;
          title: string;
          body: string | null;
          channel: string;
          readAt: string | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          userId: string;
          title: string;
          body?: string | null;
          channel?: string;
          readAt?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          userId?: string;
          title?: string;
          body?: string | null;
          channel?: string;
          readAt?: string | null;
          createdAt?: string;
        };
      };
      Deployment: {
        Row: {
          id: string;
          organizationId: string;
          projectId: string | null;
          name: string;
          status: string;
          environment: string | null;
          deployedAt: string;
          metadata: Record<string, any> | null;
        };
        Insert: {
          id?: string;
          organizationId: string;
          projectId?: string | null;
          name: string;
          status?: string;
          environment?: string | null;
          deployedAt?: string;
          metadata?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          organizationId?: string;
          projectId?: string | null;
          name?: string;
          status?: string;
          environment?: string | null;
          deployedAt?: string;
          metadata?: Record<string, any> | null;
        };
      };
      Integration: {
        Row: {
          id: string;
          organizationId: string;
          projectId: string | null;
          provider: string;
          name: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          projectId?: string | null;
          provider: string;
          name?: string | null;
          status?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          projectId?: string | null;
          provider?: string;
          name?: string | null;
          status?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Webhook: {
        Row: {
          id: string;
          organizationId: string;
          integrationId: string | null;
          url: string;
          secret: string | null;
          events: Record<string, any> | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          integrationId?: string | null;
          url: string;
          secret?: string | null;
          events?: Record<string, any> | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          integrationId?: string | null;
          url?: string;
          secret?: string | null;
          events?: Record<string, any> | null;
          createdAt?: string;
        };
      };
      Subscription: {
        Row: {
          id: string;
          organizationId: string;
          planName: string;
          status: string;
          startedAt: string;
          endedAt: string | null;
        };
        Insert: {
          id?: string;
          organizationId: string;
          planName: string;
          status?: string;
          startedAt?: string;
          endedAt?: string | null;
        };
        Update: {
          id?: string;
          organizationId?: string;
          planName?: string;
          status?: string;
          startedAt?: string;
          endedAt?: string | null;
        };
      };
      Invoice: {
        Row: {
          id: string;
          organizationId: string;
          subscriptionId: string | null;
          amount: number;
          currency: string;
          status: string;
          issuedAt: string;
          dueAt: string | null;
        };
        Insert: {
          id?: string;
          organizationId: string;
          subscriptionId?: string | null;
          amount: number;
          currency?: string;
          status?: string;
          issuedAt?: string;
          dueAt?: string | null;
        };
        Update: {
          id?: string;
          organizationId?: string;
          subscriptionId?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          issuedAt?: string;
          dueAt?: string | null;
        };
      };
      Payment: {
        Row: {
          id: string;
          organizationId: string;
          subscriptionId: string | null;
          invoiceId: string | null;
          amount: number;
          currency: string;
          status: string;
          paidAt: string | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          subscriptionId?: string | null;
          invoiceId?: string | null;
          amount: number;
          currency?: string;
          status?: string;
          paidAt?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          subscriptionId?: string | null;
          invoiceId?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          paidAt?: string | null;
          createdAt?: string;
        };
      };
      Comment: {
        Row: {
          id: string;
          organizationId: string;
          entityType: string;
          entityId: string;
          userId: string;
          content: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          organizationId: string;
          entityType: string;
          entityId: string;
          userId: string;
          content: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          organizationId?: string;
          entityType?: string;
          entityId?: string;
          userId?: string;
          content?: string;
          createdAt?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type User = Database["public"]["Tables"]["User"]["Row"];
export type Organization = Database["public"]["Tables"]["Organization"]["Row"];
export type OrganizationMember = Database["public"]["Tables"]["OrganizationMember"]["Row"];
export type FileAsset = Database["public"]["Tables"]["FileAsset"]["Row"];
export type FileAuditLog = Database["public"]["Tables"]["FileAuditLog"]["Row"];
export type ActivityLog = Database["public"]["Tables"]["ActivityLog"]["Row"];
export type Project = Database["public"]["Tables"]["Project"]["Row"];
export type Milestone = Database["public"]["Tables"]["Milestone"]["Row"];
export type Ticket = Database["public"]["Tables"]["Ticket"]["Row"];
export type Task = Database["public"]["Tables"]["Task"]["Row"];
export type LeadRequest = Database["public"]["Tables"]["LeadRequest"]["Row"];
export type OrganizationRequest = Database["public"]["Tables"]["OrganizationRequest"]["Row"];
export type Notification = Database["public"]["Tables"]["Notification"]["Row"];
export type Deployment = Database["public"]["Tables"]["Deployment"]["Row"];
export type Integration = Database["public"]["Tables"]["Integration"]["Row"];
export type Webhook = Database["public"]["Tables"]["Webhook"]["Row"];
export type Subscription = Database["public"]["Tables"]["Subscription"]["Row"];
export type Invoice = Database["public"]["Tables"]["Invoice"]["Row"];
export type Payment = Database["public"]["Tables"]["Payment"]["Row"];
export type Comment = Database["public"]["Tables"]["Comment"]["Row"];

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}