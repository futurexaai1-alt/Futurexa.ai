import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const apiBinding = ((env as any).API ??
      (typeof (env as any).API_BASE_URL === "object" ? (env as any).API_BASE_URL : null)) as
      | { fetch: (request: Request) => Promise<Response> }
      | null;

    if (apiBinding && (url.pathname === "/api" || url.pathname.startsWith("/api/"))) {
      return apiBinding.fetch(request);
    }

    return requestHandler(request, {
      cloudflare: { env, ctx }
    });
  }
} satisfies ExportedHandler<Env>;

