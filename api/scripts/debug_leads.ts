import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Fetching all LeadRequests...");
  const requests = await prisma.leadRequest.findMany({
    include: {
      requestedBy: true,
      organization: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log(`Found ${requests.length} requests:`);
  requests.forEach((r, i) => {
    console.log(`[${i}] ID: ${r.id} | Status: ${r.status} | User: ${r.requestedBy?.email} | Org: ${r.organization?.name} | CreatedAt: ${r.createdAt}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
