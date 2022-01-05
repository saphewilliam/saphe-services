/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client';
import { authSeed } from '@auth/seed';
import { coreSeed } from '@core/seed';

const prisma = new PrismaClient();

async function seed(prisma: PrismaClient): Promise<void> {
  console.log('Seeding Core...');
  await coreSeed(prisma);

  console.log('Seeding Auth...');
  await authSeed(prisma);
}

seed(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
