import { PrismaClient } from '@prisma/client';
import { AuthConfigData } from './models/AuthConfig/data';

export async function authSeed(prisma: PrismaClient): Promise<void> {
  for (const data of AuthConfigData) await prisma.authConfig.create({ data });
}

export async function authFlush(prisma: PrismaClient): Promise<void> {
  await prisma.authConfig.deleteMany();
  // TODO why doesn't it cascade?
  // await prisma.accessToken.deleteMany();
  // await prisma.refreshToken.deleteMany();
  // await prisma.emailVerificationToken.deleteMany();
  await prisma.user.deleteMany();
}
