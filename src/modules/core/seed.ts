import { PrismaClient } from '@prisma/client';
import { AppData } from './models/App/data';

export async function coreSeed(prisma: PrismaClient): Promise<void> {
  for (const data of AppData) await prisma.app.create({ data });
}

export async function coreFlush(prisma: PrismaClient): Promise<void> {
  await prisma.app.deleteMany();
}
