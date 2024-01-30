import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      {
        name: 'trueuser_admin',
        description: 'Admin role for trueuser',
        permission: 'all'
      },
      {
        name: 'trueuser',
        description: 'Standard role for trueuser',
        permission: 'standard'
      },
      {
        name: 'trueuser_superadmin',
        description: 'SuperAdmin role for trueuser',
        permission: 'all'
      },
      {
        name: 'truesmart_admin',
        description: 'Admin role for truesmart',
        permission: 'all'
      },
      {
        name: 'truesmart_user',
        description: 'Standard role for truesmart',
        permission: 'standard'
      },
      {
        name: 'truemarketplace_admin',
        description: 'Admin role for truemarketplace',
        permission: 'all'
      },
      {
        name: 'truemarketplace_user',
        description: 'Standard role for truemarketplace',
        permission: 'standard'
      },
    ],
  });
  
 
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
