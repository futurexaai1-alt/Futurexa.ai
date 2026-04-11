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
    const apiBaseUrlRaw =
      typeof (env as any).API_BASE_URL === "string" && (env as any).API_BASE_URL.length > 0
        ? String((env as any).API_BASE_URL).trim()
        : "";
    const apiBaseUrl =
      apiBaseUrlRaw
        ? (/^https?:\/\//i.test(apiBaseUrlRaw) ? apiBaseUrlRaw : `https://${apiBaseUrlRaw}`).replace(/\/+$/, "")
        : null;

    if (url.pathname === "/worker-info") {
      const workerUrl = typeof (env as any).WORKER_URL === "string" 
        ? (env as any).WORKER_URL 
        : `https://${url.host}`;
      return new Response(JSON.stringify({ url: workerUrl }), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

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

