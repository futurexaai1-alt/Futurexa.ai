import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("services/:slug", "routes/service-detail.tsx"),
  route("case-studies", "routes/case-studies.tsx"),
  route("case-studies/:slug", "routes/case-study-detail.tsx"),
  route("about", "routes/about.tsx"),
  route("careers", "routes/careers.tsx"),
  route("blog", "routes/blog.tsx"),
  route("blog/:slug", "routes/blog-post.tsx"),
  route("pricing", "routes/pricing.tsx"),
  route("contact", "routes/contact.tsx"),
  route("industries", "routes/industries.tsx"),
  route("resources", "routes/resources.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
] satisfies RouteConfig;
