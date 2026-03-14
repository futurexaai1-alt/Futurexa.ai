import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "./db";
import type { AppContext } from "./types";

const app = new Hono<{
	Bindings: Env;
	Variables: {
		organizationId: string;
		userId: string;
		permissions: string[];
		isSuperAdmin: boolean;
	};
}>();

const permissionList = (value: string | undefined) =>
	value
		?.split(",")
		.map((item) => item.trim())
		.filter(Boolean) ?? [];

const requirePermission = (c: AppContext, permission: string) => {
	if (c.get("isSuperAdmin")) {
		return;
	}
	if (!c.get("permissions").includes(permission)) {
		return c.json({ error: "Forbidden" }, 403);
	}
};

const toDate = (value?: string) => (value ? new Date(value) : undefined);

const taskStatusSchema = z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "COMPLETED", "DONE", "BLOCKED"]);
const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const projectStatusSchema = z.enum(["ACTIVE", "ARCHIVED"]);
const entityTypeSchema = z.enum(["PROJECT", "TASK", "FILE", "COMMENT", "PROJECT_REQUEST", "MILESTONE", "TICKET", "DEPLOYMENT"]);
const projectRequestStatusSchema = z.enum(["NEW", "REVIEW", "APPROVED", "CONVERTED"]);
const milestoneStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETED"]);
const ticketStatusSchema = z.enum(["OPEN", "INVESTIGATING", "IN_PROGRESS", "RESOLVED", "CLOSED"]);
const environmentTypeSchema = z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]);
const deploymentStatusSchema = z.enum(["QUEUED", "IN_PROGRESS", "SUCCESS", "FAILED", "ROLLED_BACK"]);
const notificationEventSchema = z.enum(["TASK_ASSIGNED", "PROJECT_UPDATED", "COMMENT_ADDED", "DEADLINE_APPROACHING", "FILE_UPLOADED"]);
const notificationChannelSchema = z.enum(["IN_APP", "EMAIL", "SMS", "WEBHOOK"]);

app.use("*", async (c: AppContext, next) => {
	const organizationId = c.req.header("x-organization-id") ?? "";
	const userId = c.req.header("x-user-id") ?? "";
	const permissions = permissionList(c.req.header("x-permissions"));
	const isSuperAdmin = c.req.header("x-super-admin") === "true";
	if (!isSuperAdmin && (!organizationId || !userId)) {
		return c.json({ error: "Missing organization or user" }, 400);
	}
	c.set("organizationId", organizationId);
	c.set("userId", userId);
	c.set("permissions", permissions);
	c.set("isSuperAdmin", isSuperAdmin);
	await next();
});

app.get("/api/organizations", async (c) => {
	if (!c.get("isSuperAdmin")) {
		return c.json({ error: "Forbidden" }, 403);
	}
	const organizations = await prisma.organization.findMany({ where: { deletedAt: null } });
	return c.json({ data: organizations });
});

app.get("/api/organizations/current", async (c) => {
	const organization = await prisma.organization.findFirst({
		where: { id: c.get("organizationId"), deletedAt: null },
	});
	if (!organization) {
		return c.json({ error: "Not found" }, 404);
	}
	return c.json({ data: organization });
});

app.post("/api/organizations", async (c) => {
	if (!c.get("isSuperAdmin")) {
		return c.json({ error: "Forbidden" }, 403);
	}
	const body = z.object({ name: z.string().min(1), planId: z.string().optional() }).parse(await c.req.json());
	const organization = await prisma.organization.create({ data: { name: body.name, planId: body.planId } });
	return c.json({ data: organization }, 201);
});

app.get("/api/users", async (c) => {
	const users = await prisma.user.findMany({
		where: {
			memberships: {
				some: {
					organizationId: c.get("organizationId"),
					deletedAt: null,
				},
			},
		},
	});
	return c.json({ data: users });
});

app.post("/api/users", async (c) => {
	const denied = requirePermission(c, "invite_users");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			name: z.string().min(1),
			email: z.string().email(),
			passwordHash: z.string().min(1),
			roleId: z.string().optional(),
		})
		.parse(await c.req.json());
	const organizationId = c.get("organizationId");
	const user = await prisma.user.create({
		data: {
			name: body.name,
			email: body.email,
			passwordHash: body.passwordHash,
			memberships: {
				create: {
					organizationId,
					roleId: body.roleId,
				},
			},
		},
	});
	return c.json({ data: user }, 201);
});

app.get("/api/organization-members", async (c) => {
	const members = await prisma.organizationMember.findMany({
		where: { organizationId: c.get("organizationId"), deletedAt: null },
		include: { user: true, role: true },
	});
	return c.json({ data: members });
});

app.post("/api/organization-members", async (c) => {
	const denied = requirePermission(c, "invite_users");
	if (denied) {
		return denied;
	}
	const body = z.object({ userId: z.string().min(1), roleId: z.string().optional() }).parse(await c.req.json());
	const member = await prisma.organizationMember.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: body.userId,
			roleId: body.roleId,
		},
	});
	return c.json({ data: member }, 201);
});

app.get("/api/roles", async (c) => {
	const roles = await prisma.role.findMany({
		where: {
			OR: [{ organizationId: c.get("organizationId") }, { organizationId: null }],
			deletedAt: null,
		},
	});
	return c.json({ data: roles });
});

app.post("/api/roles", async (c) => {
	const denied = requirePermission(c, "manage_roles");
	if (denied) {
		return denied;
	}
	const body = z.object({ name: z.string().min(1), description: z.string().optional() }).parse(await c.req.json());
	const role = await prisma.role.create({
		data: {
			organizationId: c.get("organizationId"),
			name: body.name,
			description: body.description,
		},
	});
	return c.json({ data: role }, 201);
});

app.get("/api/project-requests", async (c) => {
	const requests = await prisma.projectRequest.findMany({
		where: { organizationId: c.get("organizationId") },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: requests });
});

app.post("/api/project-requests", async (c) => {
	const body = z
		.object({
			projectTitle: z.string().min(1),
			description: z.string().min(1),
			businessGoals: z.string().optional(),
			budgetRange: z.string().optional(),
			deadline: z.string().datetime().optional(),
			preferredTechnologies: z.string().optional(),
			attachments: z.any().optional(),
		})
		.parse(await c.req.json());
	const request = await prisma.projectRequest.create({
		data: {
			organizationId: c.get("organizationId"),
			projectTitle: body.projectTitle,
			description: body.description,
			businessGoals: body.businessGoals,
			budgetRange: body.budgetRange,
			deadline: toDate(body.deadline),
			preferredTechnologies: body.preferredTechnologies,
			attachments: body.attachments,
			createdById: c.get("userId"),
		},
	});
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "project_request_created",
			entityType: "PROJECT_REQUEST",
			entityId: request.id,
		},
	});
	return c.json({ data: request }, 201);
});

app.patch("/api/project-requests/:id/status", async (c) => {
	const denied = requirePermission(c, "review_project_requests");
	if (denied) {
		return denied;
	}
	const id = c.req.param("id");
	const body = z.object({ status: projectRequestStatusSchema }).parse(await c.req.json());
	const request = await prisma.projectRequest.update({
		where: { id },
		data: { status: body.status },
	});
	return c.json({ data: request });
});

app.post("/api/project-requests/:id/convert", async (c) => {
	const denied = requirePermission(c, "create_project");
	if (denied) {
		return denied;
	}
	const id = c.req.param("id");
	const body = z.object({ status: projectStatusSchema.optional() }).parse(await c.req.json());
	const request = await prisma.projectRequest.findFirst({
		where: { id, organizationId: c.get("organizationId") },
	});
	if (!request) {
		return c.json({ error: "Project request not found" }, 404);
	}
	const project = await prisma.project.create({
		data: {
			organizationId: c.get("organizationId"),
			name: request.projectTitle,
			description: request.description,
			status: body.status,
			createdById: c.get("userId"),
		},
	});
	const updatedRequest = await prisma.projectRequest.update({
		where: { id: request.id },
		data: {
			status: "CONVERTED",
			convertedProjectId: project.id,
			reviewedById: c.get("userId"),
		},
	});
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "project_request_converted",
			entityType: "PROJECT_REQUEST",
			entityId: updatedRequest.id,
			metadata: { projectId: project.id },
		},
	});
	return c.json({ data: { request: updatedRequest, project } }, 201);
});

app.get("/api/projects", async (c) => {
	const projects = await prisma.project.findMany({
		where: { organizationId: c.get("organizationId"), deletedAt: null },
		include: {
			milestones: true,
			tasks: true,
			tickets: true,
			deployments: true,
		},
	});
	return c.json({ data: projects });
});

app.post("/api/projects", async (c) => {
	const denied = requirePermission(c, "create_project");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			name: z.string().min(1),
			description: z.string().optional(),
			status: projectStatusSchema.optional(),
		})
		.parse(await c.req.json());
	const project = await prisma.project.create({
		data: {
			organizationId: c.get("organizationId"),
			name: body.name,
			description: body.description,
			status: body.status,
			createdById: c.get("userId"),
		},
	});
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "project_created",
			entityType: "PROJECT",
			entityId: project.id,
		},
	});
	return c.json({ data: project }, 201);
});

app.get("/api/milestones", async (c) => {
	const milestones = await prisma.milestone.findMany({
		where: { organizationId: c.get("organizationId") },
		orderBy: { dueDate: "asc" },
	});
	return c.json({ data: milestones });
});

app.post("/api/milestones", async (c) => {
	const denied = requirePermission(c, "manage_projects");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			projectId: z.string().min(1),
			title: z.string().min(1),
			dueDate: z.string().datetime().optional(),
			status: milestoneStatusSchema.optional(),
			completionPercentage: z.number().int().min(0).max(100).optional(),
		})
		.parse(await c.req.json());
	const milestone = await prisma.milestone.create({
		data: {
			organizationId: c.get("organizationId"),
			projectId: body.projectId,
			title: body.title,
			dueDate: toDate(body.dueDate),
			status: body.status,
			completionPercentage: body.completionPercentage,
			createdById: c.get("userId"),
		},
	});
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "milestone_created",
			entityType: "MILESTONE",
			entityId: milestone.id,
		},
	});
	return c.json({ data: milestone }, 201);
});

app.get("/api/tasks", async (c) => {
	const tasks = await prisma.task.findMany({
		where: { organizationId: c.get("organizationId"), deletedAt: null },
	});
	return c.json({ data: tasks });
});

app.post("/api/tasks", async (c) => {
	const denied = requirePermission(c, "create_task");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			projectId: z.string().min(1),
			milestoneId: z.string().optional(),
			title: z.string().min(1),
			description: z.string().optional(),
			status: taskStatusSchema.optional(),
			priority: taskPrioritySchema.optional(),
			dueDate: z.string().datetime().optional(),
			assignedToId: z.string().optional(),
		})
		.parse(await c.req.json());
	const task = await prisma.task.create({
		data: {
			organizationId: c.get("organizationId"),
			projectId: body.projectId,
			milestoneId: body.milestoneId,
			title: body.title,
			description: body.description,
			status: body.status,
			priority: body.priority,
			dueDate: toDate(body.dueDate),
			assignedToId: body.assignedToId,
		},
	});
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "task_created",
			entityType: "TASK",
			entityId: task.id,
		},
	});
	return c.json({ data: task }, 201);
});

app.get("/api/tickets", async (c) => {
	const tickets = await prisma.ticket.findMany({
		where: { organizationId: c.get("organizationId") },
		orderBy: { updatedAt: "desc" },
	});
	return c.json({ data: tickets });
});

app.post("/api/tickets", async (c) => {
	const body = z
		.object({
			projectId: z.string().min(1),
			milestoneId: z.string().optional(),
			taskId: z.string().optional(),
			title: z.string().min(1),
			description: z.string().optional(),
			type: z.string().min(1),
			status: ticketStatusSchema.optional(),
			assignedToId: z.string().optional(),
		})
		.parse(await c.req.json());
	const ticket = await prisma.ticket.create({
		data: {
			organizationId: c.get("organizationId"),
			projectId: body.projectId,
			milestoneId: body.milestoneId,
			taskId: body.taskId,
			title: body.title,
			description: body.description,
			type: body.type,
			status: body.status,
			createdById: c.get("userId"),
			assignedToId: body.assignedToId,
		},
	});
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "ticket_created",
			entityType: "TICKET",
			entityId: ticket.id,
		},
	});
	return c.json({ data: ticket }, 201);
});

app.patch("/api/tickets/:id/status", async (c) => {
	const body = z.object({ status: ticketStatusSchema }).parse(await c.req.json());
	const ticket = await prisma.ticket.update({
		where: { id: c.req.param("id") },
		data: {
			status: body.status,
			closedAt: body.status === "CLOSED" ? new Date() : undefined,
		},
	});
	return c.json({ data: ticket });
});

app.get("/api/files", async (c) => {
	const files = await prisma.file.findMany({
		where: { organizationId: c.get("organizationId"), deletedAt: null },
	});
	return c.json({ data: files });
});

app.post("/api/files", async (c) => {
	const denied = requirePermission(c, "manage_files");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			fileUrl: z.string().url(),
			fileType: z.string().min(1),
			entityType: entityTypeSchema,
			entityId: z.string().min(1),
		})
		.parse(await c.req.json());
	const file = await prisma.file.create({
		data: {
			organizationId: c.get("organizationId"),
			uploadedById: c.get("userId"),
			fileUrl: body.fileUrl,
			fileType: body.fileType,
			entityType: body.entityType,
			entityId: body.entityId,
		},
	});
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "file_uploaded",
			entityType: "FILE",
			entityId: file.id,
		},
	});
	return c.json({ data: file }, 201);
});

app.get("/api/project-secrets", async (c) => {
	const denied = requirePermission(c, "manage_secrets");
	if (denied) {
		return denied;
	}
	const secrets = await prisma.projectSecret.findMany({
		where: { organizationId: c.get("organizationId") },
		select: {
			id: true,
			projectId: true,
			keyName: true,
			environment: true,
			createdAt: true,
			updatedAt: true,
		},
	});
	return c.json({ data: secrets });
});

app.post("/api/project-secrets", async (c) => {
	const denied = requirePermission(c, "manage_secrets");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			projectId: z.string().min(1),
			keyName: z.string().min(1),
			encryptedValue: z.string().min(1),
			environment: environmentTypeSchema,
		})
		.parse(await c.req.json());
	const secret = await prisma.projectSecret.create({
		data: {
			organizationId: c.get("organizationId"),
			projectId: body.projectId,
			keyName: body.keyName,
			encryptedValue: body.encryptedValue,
			environment: body.environment,
		},
	});
	return c.json({ data: { id: secret.id, keyName: secret.keyName, environment: secret.environment } }, 201);
});

app.get("/api/environments", async (c) => {
	const environments = await prisma.environment.findMany({
		where: { organizationId: c.get("organizationId") },
		include: { deployments: true },
	});
	return c.json({ data: environments });
});

app.post("/api/environments", async (c) => {
	const denied = requirePermission(c, "manage_projects");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			projectId: z.string().min(1),
			name: z.string().min(1),
			type: environmentTypeSchema,
			url: z.string().url().optional(),
			version: z.string().optional(),
		})
		.parse(await c.req.json());
	const environment = await prisma.environment.create({
		data: {
			organizationId: c.get("organizationId"),
			projectId: body.projectId,
			name: body.name,
			type: body.type,
			url: body.url,
			version: body.version,
		},
	});
	return c.json({ data: environment }, 201);
});

app.get("/api/deployments", async (c) => {
	const deployments = await prisma.deployment.findMany({
		where: { organizationId: c.get("organizationId") },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: deployments });
});

app.post("/api/deployments", async (c) => {
	const denied = requirePermission(c, "manage_deployments");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			projectId: z.string().min(1),
			environmentId: z.string().min(1),
			version: z.string().min(1),
			status: deploymentStatusSchema.optional(),
			deployedAt: z.string().datetime().optional(),
		})
		.parse(await c.req.json());
	const deployment = await prisma.deployment.create({
		data: {
			organizationId: c.get("organizationId"),
			projectId: body.projectId,
			environmentId: body.environmentId,
			version: body.version,
			status: body.status,
			deployedAt: toDate(body.deployedAt),
		},
	});
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "deployment_created",
			entityType: "DEPLOYMENT",
			entityId: deployment.id,
		},
	});
	return c.json({ data: deployment }, 201);
});

app.get("/api/comments", async (c) => {
	const comments = await prisma.comment.findMany({
		where: { organizationId: c.get("organizationId") },
		include: { mentions: true, replies: true },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: comments });
});

app.post("/api/comments", async (c) => {
	const body = z
		.object({
			entityType: entityTypeSchema,
			entityId: z.string().min(1),
			content: z.string().min(1),
			parentId: z.string().optional(),
			threadId: z.string().optional(),
			mentionUserIds: z.array(z.string()).optional(),
		})
		.parse(await c.req.json());
	const comment = await prisma.comment.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			entityType: body.entityType,
			entityId: body.entityId,
			content: body.content,
			parentId: body.parentId,
			threadId: body.threadId,
		},
	});
	if (body.mentionUserIds?.length) {
		await prisma.mention.createMany({
			data: body.mentionUserIds.map((mentionedUserId) => ({
				organizationId: c.get("organizationId"),
				commentId: comment.id,
				userId: mentionedUserId,
			})),
			skipDuplicates: true,
		});
	}
	await prisma.activityLog.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: c.get("userId"),
			action: "comment_added",
			entityType: "COMMENT",
			entityId: comment.id,
		},
	});
	return c.json({ data: comment }, 201);
});

app.get("/api/threads", async (c) => {
	const threads = await prisma.thread.findMany({
		where: { organizationId: c.get("organizationId") },
		include: { comments: true },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: threads });
});

app.post("/api/threads", async (c) => {
	const body = z.object({
		entityType: entityTypeSchema,
		entityId: z.string().min(1),
		title: z.string().optional(),
	}).parse(await c.req.json());
	const thread = await prisma.thread.create({
		data: {
			organizationId: c.get("organizationId"),
			entityType: body.entityType,
			entityId: body.entityId,
			title: body.title,
		},
	});
	return c.json({ data: thread }, 201);
});

app.get("/api/notifications", async (c) => {
	const notifications = await prisma.notification.findMany({
		where: { organizationId: c.get("organizationId"), userId: c.get("userId") },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: notifications });
});

app.post("/api/notifications", async (c) => {
	const denied = requirePermission(c, "send_notifications");
	if (denied) {
		return denied;
	}
	const body = z
		.object({
			userId: z.string().min(1),
			event: notificationEventSchema,
			channel: notificationChannelSchema,
			title: z.string().min(1),
			message: z.string().min(1),
		})
		.parse(await c.req.json());
	const notification = await prisma.notification.create({
		data: {
			organizationId: c.get("organizationId"),
			userId: body.userId,
			event: body.event,
			channel: body.channel,
			title: body.title,
			message: body.message,
		},
	});
	return c.json({ data: notification }, 201);
});

app.get("/api/billing/subscriptions", async (c) => {
	const subscriptions = await prisma.subscription.findMany({
		where: { organizationId: c.get("organizationId") },
		include: { plan: true },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: subscriptions });
});

app.get("/api/billing/payments", async (c) => {
	const payments = await prisma.payment.findMany({
		where: { subscription: { organizationId: c.get("organizationId") } },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: payments });
});

app.get("/api/billing/invoices", async (c) => {
	const invoices = await prisma.invoice.findMany({
		where: { subscription: { organizationId: c.get("organizationId") } },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: invoices });
});

app.get("/api/usage-metrics", async (c) => {
	const usage = await prisma.usageMetric.findMany({
		where: { organizationId: c.get("organizationId") },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: usage });
});

app.get("/api/integrations", async (c) => {
	const integrations = await prisma.organizationIntegration.findMany({
		where: { organizationId: c.get("organizationId") },
		include: { integration: true },
	});
	return c.json({ data: integrations });
});

app.post("/api/integrations", async (c) => {
	const denied = requirePermission(c, "manage_integrations");
	if (denied) {
		return denied;
	}
	const body = z.object({
		integrationId: z.string().min(1),
		config: z.any().optional(),
		enabled: z.boolean().optional(),
	}).parse(await c.req.json());
	const integration = await prisma.organizationIntegration.create({
		data: {
			organizationId: c.get("organizationId"),
			integrationId: body.integrationId,
			config: body.config,
			enabled: body.enabled,
		},
	});
	return c.json({ data: integration }, 201);
});

app.get("/api/webhooks", async (c) => {
	const webhooks = await prisma.webhook.findMany({
		where: { organizationId: c.get("organizationId") },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: webhooks });
});

app.post("/api/webhooks", async (c) => {
	const denied = requirePermission(c, "manage_integrations");
	if (denied) {
		return denied;
	}
	const body = z.object({
		url: z.string().url(),
		secret: z.string().optional(),
		event: z.string().min(1),
		enabled: z.boolean().optional(),
	}).parse(await c.req.json());
	const webhook = await prisma.webhook.create({
		data: {
			organizationId: c.get("organizationId"),
			url: body.url,
			secret: body.secret,
			event: body.event,
			enabled: body.enabled,
		},
	});
	return c.json({ data: webhook }, 201);
});

app.get("/api/activity-logs", async (c) => {
	const logs = await prisma.activityLog.findMany({
		where: { organizationId: c.get("organizationId") },
		orderBy: { createdAt: "desc" },
	});
	return c.json({ data: logs });
});

export default app;
