import type { Route } from "./+types/index";
import { redirect } from "react-router";

export function loader(_: Route.LoaderArgs) {
  return redirect("/signin");
}

export default function IndexRoute(_: Route.ComponentProps) {
  return null;
}

