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
    const isApiRequest = url.pathname === "/api" || url.pathname.startsWith("/api/");
    const apiBinding = ((env as any).API ??
      (typeof (env as any).API_BASE_URL === "object" ? (env as any).API_BASE_URL : null)) as
      | { fetch: (request: Request) => Promise<Response> }
      | null;
    const apiBaseUrl =
      typeof (env as any).API_BASE_URL === "string" && (env as any).API_BASE_URL.length > 0
        ? (env as any).API_BASE_URL.replace(/\/+$/, "")
        : null;

    if (apiBinding && isApiRequest) {
      return apiBinding.fetch(request);
    }

    if (apiBaseUrl && isApiRequest) {
      const forwardUrl = `${apiBaseUrl}${url.pathname}${url.search}`;
      return fetch(new Request(forwardUrl, request));
    }

    return requestHandler(request, {
      cloudflare: { env, ctx }
    });
  }
} satisfies ExportedHandler<Env>;

