

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserStatus {
  NEW_USER
  LEAD
  ACTIVE_CLIENT
  SUSPENDED
}

enum LeadRequestType {
  DEMO
  PROJECT
}
test
enum LeadRequestStatus {
  SUBMITTED
  IN_REVIEW
  APPROVED
  REJECTED
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum NotificationChannel {
  IN_APP
  EMAIL
  SMS
}

model Organization {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  status    String
  planId    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members       OrganizationMember[]
  projects      Project[]
  milestones    Milestone[]
  tickets       Ticket[]
  files         FileAsset[]
  subscriptions Subscription[]
  invoices      Invoice[]
  payments      Payment[]
  activityLogs  ActivityLog[]
  comments      Comment[]
  notifications Notification[]
  leadRequests  LeadRequest[]
}

model User {
  id        String     @id @default(uuid()) @db.Uuid
  email     String     @unique
  name      String?
  status    UserStatus @default(NEW_USER)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  memberships   OrganizationMember[]
  leadRequests  LeadRequest[]
  tickets       Ticket[]        @relation("TicketReporter")
  assignedTo    Ticket[]        @relation("TicketAssignee")
  files         FileAsset[]
  activityLogs  ActivityLog[]
  comments      Comment[]
  notifications Notification[]
}

model OrganizationMember {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  userId         String   @db.Uuid
  roleId         String?  @db.Uuid
  joinedAt       DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id])
  user         User         @relation(fields: [userId], references: [id])
  role         Role?        @relation(fields: [roleId], references: [id])

  @@unique([organizationId, userId])
}

model Role {
  id          String   @id @default(uuid()) @db.Uuid
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  permissions RolePermission[]
  members     OrganizationMember[]
}

model Permission {
  id          String   @id @default(uuid()) @db.Uuid
  key         String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  roles RolePermission[]
}

model RolePermission {
  id           String   @id @default(uuid()) @db.Uuid
  roleId       String   @db.Uuid
  permissionId String   @db.Uuid

  role       Role       @relation(fields: [roleId], references: [id])
  permission Permission @relation(fields: [permissionId], references: [id])

  @@unique([roleId, permissionId])
}

model LeadRequest {
  id             String             @id @default(uuid()) @db.Uuid
  organizationId String             @db.Uuid
  requestedById  String             @db.Uuid
  type           LeadRequestType
  status         LeadRequestStatus  @default(SUBMITTED)
  description    String?
  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id])
  requestedBy  User         @relation(fields: [requestedById], references: [id])
}

model Project {
  id             String     @id @default(uuid()) @db.Uuid
  organizationId String     @db.Uuid
  name           String
  description    String?
  status         String
  createdById    String?    @db.Uuid
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  deletedAt      DateTime?

  organization Organization @relation(fields: [organizationId], references: [id])
  milestones   Milestone[]
  tickets      Ticket[]
  files        FileAsset[]
}

model Milestone {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  projectId      String   @db.Uuid
  title          String
  description    String?
  status         String
  dueDate        DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id])
  project      Project      @relation(fields: [projectId], references: [id])
}

model Ticket {
  id             String       @id @default(uuid()) @db.Uuid
  organizationId String       @db.Uuid
  projectId      String?      @db.Uuid
  title          String
  description    String?
  status         TicketStatus @default(OPEN)
  createdById    String?      @db.Uuid
  assignedToId   String?      @db.Uuid
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id])
  project      Project?     @relation(fields: [projectId], references: [id])
  createdBy    User?        @relation("TicketReporter", fields: [createdById], references: [id])
  assignedTo   User?        @relation("TicketAssignee", fields: [assignedToId], references: [id])
}

model FileAsset {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  projectId      String?  @db.Uuid
  uploadedById   String?  @db.Uuid
  fileUrl        String
  fileType       String?
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id])
  project      Project?     @relation(fields: [projectId], references: [id])
  uploadedBy   User?        @relation(fields: [uploadedById], references: [id])
}

model Subscription {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  planName       String
  status         String
  startedAt      DateTime @default(now())
  endedAt        DateTime?

  organization Organization @relation(fields: [organizationId], references: [id])
  invoices     Invoice[]
  payments     Payment[]
}

model Invoice {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  subscriptionId String?  @db.Uuid
  amount         Decimal
  currency       String
  status         String
  issuedAt       DateTime @default(now())
  dueAt          DateTime?

  organization Organization  @relation(fields: [organizationId], references: [id])
  subscription Subscription? @relation(fields: [subscriptionId], references: [id])
  payments     Payment[]
}

model Payment {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  subscriptionId String?  @db.Uuid
  invoiceId      String?  @db.Uuid
  amount         Decimal
  currency       String
  status         String
  paidAt         DateTime?
  createdAt      DateTime @default(now())

  organization Organization  @relation(fields: [organizationId], references: [id])
  subscription Subscription? @relation(fields: [subscriptionId], references: [id])
  invoice      Invoice?      @relation(fields: [invoiceId], references: [id])
}

model ActivityLog {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  userId         String?  @db.Uuid
  action         String
  entityType     String
  entityId       String
  metadata       Json?
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id])
  user         User?        @relation(fields: [userId], references: [id])
}

model Comment {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  entityType     String
  entityId       String
  userId         String   @db.Uuid
  content        String
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id])
  user         User         @relation(fields: [userId], references: [id])
}

model Notification {
  id             String              @id @default(uuid()) @db.Uuid
  organizationId String              @db.Uuid
  userId         String              @db.Uuid
  title          String
  body           String?
  channel        NotificationChannel @default(IN_APP)
  readAt         DateTime?
  createdAt      DateTime            @default(now())

  organization Organization @relation(fields: [organizationId], references: [id])
  user         User         @relation(fields: [userId], references: [id])
}
