import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Note: Cloudflare Workers need the /edge version of Prisma and usually Accelerate if not using D1/Hyperdrive.
 * However, since the user requested to 'avoid prisma acceleration' for now, we'll try to use the direct 
 * client if the environment supports it, or use the standard Postgres adapter if needed.
 * 
 * Given the pgbouncer connection in .dev.vars, we can use the direct pg driver if Cloudflare allows it via nodejs_compat.
 */

export const getPrismaClient = (databaseUrl: string) => {
  // Prisma 7 driver adapters: override the connection string via PrismaPg adapter.
  // This avoids unsupported `datasources` constructor options.
  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
};
