const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  await prisma.$connect();
  const rows = await prisma.userAddress.findMany({
    orderBy: { createdAt: "desc" },
  });
  console.log(JSON.stringify(rows, null, 2));
  await prisma.$disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
