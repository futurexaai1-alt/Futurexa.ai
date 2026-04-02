const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const DATABASE_URL = "postgresql://postgres:iqb8kWnxB2791a0i@db.efootsmlltfdsqfxtwdo.supabase.co:6543/postgres?pgbouncer=true";
const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const orgs = await prisma.organization.findMany({ where: { shortCode: null } });
  console.log('Found', orgs.length, 'organizations without shortCode');

  for (const org of orgs) {
    let shortCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    await prisma.organization.update({
      where: { id: org.id },
      data: { shortCode }
    });
    console.log('Updated', org.name, 'with shortCode:', shortCode);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());