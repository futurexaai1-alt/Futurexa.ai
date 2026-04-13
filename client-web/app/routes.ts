import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("signin", "routes/signin.tsx"),
  route("signup", "routes/signup.tsx"),
  route("auth/callback", "routes/auth-callback.tsx"),
  route("favicon.ico", "routes/favicon.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/overview", "routes/dashboard-overview.tsx"),
  route("dashboard/project", "routes/dashboard-project.tsx"),
  route("dashboard/ticket", "routes/dashboard-ticket.tsx"),
  route("dashboard/files", "routes/dashboard-files.tsx"),
  route("dashboard/milestones", "routes/dashboard-milestones.tsx"),
  route("dashboard/milestones/:id", "routes/dashboard-milestone-detail.tsx"),
  route("dashboard/tasks", "routes/dashboard-tasks.tsx"),
  route("dashboard/deployments", "routes/dashboard-deployments.tsx"),
  route("dashboard/billing", "routes/dashboard-billing.tsx"),
  route("dashboard/activity", "routes/dashboard-activity.tsx"),
  route("dashboard/settings", "routes/dashboard-settings.tsx"),
] satisfies RouteConfig;
