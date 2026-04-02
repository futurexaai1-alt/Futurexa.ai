-- RLS Policies for Supabase
-- Run this in Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrganizationMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Role" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Permission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RolePermission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrganizationRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Milestone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ticket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FileAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FileAuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ActivityLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Deployment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Integration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Webhook" ENABLE ROW LEVEL SECURITY;

-- Service role policies (bypass RLS)
DROP POLICY IF EXISTS "User service role all" ON "User";
CREATE POLICY "User service role all" ON "User" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Organization service role all" ON "Organization";
CREATE POLICY "Organization service role all" ON "Organization" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "OrganizationMember service role all" ON "OrganizationMember";
CREATE POLICY "OrganizationMember service role all" ON "OrganizationMember" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Role service role all" ON "Role";
CREATE POLICY "Role service role all" ON "Role" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Permission service role all" ON "Permission";
CREATE POLICY "Permission service role all" ON "Permission" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "RolePermission service role all" ON "RolePermission";
CREATE POLICY "RolePermission service role all" ON "RolePermission" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "OrganizationRequest service role all" ON "OrganizationRequest";
CREATE POLICY "OrganizationRequest service role all" ON "OrganizationRequest" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "LeadRequest service role all" ON "LeadRequest";
CREATE POLICY "LeadRequest service role all" ON "LeadRequest" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Project service role all" ON "Project";
CREATE POLICY "Project service role all" ON "Project" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Milestone service role all" ON "Milestone";
CREATE POLICY "Milestone service role all" ON "Milestone" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Ticket service role all" ON "Ticket";
CREATE POLICY "Ticket service role all" ON "Ticket" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Task service role all" ON "Task";
CREATE POLICY "Task service role all" ON "Task" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "FileAsset service role all" ON "FileAsset";
CREATE POLICY "FileAsset service role all" ON "FileAsset" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "FileAuditLog service role all" ON "FileAuditLog";
CREATE POLICY "FileAuditLog service role all" ON "FileAuditLog" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Subscription service role all" ON "Subscription";
CREATE POLICY "Subscription service role all" ON "Subscription" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Invoice service role all" ON "Invoice";
CREATE POLICY "Invoice service role all" ON "Invoice" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Payment service role all" ON "Payment";
CREATE POLICY "Payment service role all" ON "Payment" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "ActivityLog service role all" ON "ActivityLog";
CREATE POLICY "ActivityLog service role all" ON "ActivityLog" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Comment service role all" ON "Comment";
CREATE POLICY "Comment service role all" ON "Comment" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Notification service role all" ON "Notification";
CREATE POLICY "Notification service role all" ON "Notification" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Deployment service role all" ON "Deployment";
CREATE POLICY "Deployment service role all" ON "Deployment" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Integration service role all" ON "Integration";
CREATE POLICY "Integration service role all" ON "Integration" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Webhook service role all" ON "Webhook";
CREATE POLICY "Webhook service role all" ON "Webhook" FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
