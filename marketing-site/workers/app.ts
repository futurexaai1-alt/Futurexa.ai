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
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/app-config") {
      const clientWebUrl =
        typeof (env as any).CLIENT_WEB_URL === "string" ? (env as any).CLIENT_WEB_URL : "";
      return new Response(JSON.stringify({ clientWebUrl }), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
