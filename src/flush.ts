/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function flush(_prisma: PrismaClient): Promise<void> {
  console.log('Flushing db...');
}

flush(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
