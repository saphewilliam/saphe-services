/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client';
import { authFlush } from '@auth/seed';
import { coreFlush } from '@core/seed';

const prisma = new PrismaClient();

async function flush(prisma: PrismaClient): Promise<void> {
  console.log('Flushing db...');
  await authFlush(prisma);
  await coreFlush(prisma);
}

flush(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
