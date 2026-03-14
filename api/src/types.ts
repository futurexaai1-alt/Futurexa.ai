import type { Context } from "hono";

export type AppContext = Context<{
	Bindings: Env;
	Variables: {
		organizationId: string;
		userId: string;
		permissions: string[];
		isSuperAdmin: boolean;
	};
}>;
