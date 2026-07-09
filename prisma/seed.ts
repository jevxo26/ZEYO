import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultRoles = [
  {
    name: 'admin',
    description: 'Full system access',
  },
  {
    name: 'manager',
    description: 'Can manage users and team data',
  },
  {
    name: 'employee',
    description: 'Standard application user',
  },
];

async function main() {
  for (const role of defaultRoles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
      },
      create: role,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });