/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client';
// import { idMap } from './idMap';
// import seedUsers from './auth/User/seed';

const prisma = new PrismaClient();

async function seed(_prisma: PrismaClient): Promise<void> {
  console.log('Seeding Users...');
  // await seedUsers(prisma);
}

seed(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
