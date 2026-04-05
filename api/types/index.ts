export type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  DATABASE_URL: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ENDPOINT: string;
  R2_BUCKET_NAME: string;
};

export type SupabaseUserProfile = {
  id: string;
  email: string;
  name: string | null;
  status: string;
};

export type UserStatus = "NEW_USER" | "PENDING" | "LEAD" | "ACTIVE_CLIENT" | "SUSPENDED" | "DELETED";

export type LeadRequestStatus = "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export type NotificationChannel = "IN_APP" | "EMAIL";

export type RequestContext = {
  env: Env;
  prisma: ReturnType<typeof import("../workers/db").getPrismaClient>;
};
