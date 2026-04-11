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
      const configuredClientWebUrl =
        typeof (env as any).CLIENT_WEB_URL === "string" && (env as any).CLIENT_WEB_URL.trim()
          ? (env as any).CLIENT_WEB_URL.trim()
          : "https://clientweb.futurexaai1.workers.dev";
      const clientWebBinding = (env as any).CLIENT_WEB as
        | { fetch: (request: Request) => Promise<Response> }
        | undefined;
      let clientWebUrl = configuredClientWebUrl;
      if (clientWebBinding) {
        try {
          const response = await clientWebBinding.fetch(new Request("https://internal/worker-info"));
          if (response.ok) {
            const data = (await response.json()) as { url?: string };
            const resolvedUrl = data?.url?.trim() ?? "";
            if (resolvedUrl && !/^https?:\/\/internal(?:\/|$)/i.test(resolvedUrl)) {
              clientWebUrl = resolvedUrl;
            }
          }
        } catch {}
      }
      return new Response(JSON.stringify({ clientWebUrl }), {
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
