import type { Route } from "./+types/favicon";

// Simple route to prevent React Router "No route matches /favicon.ico" noise during local dev.
export function loader() {
  return new Response(null, {
    status: 204,
    headers: {
      "Content-Type": "image/x-icon",
    },
  });
}

export default function Favicon(_: Route.ComponentProps) {
  return null;
}

