import { App, PrismaClient, Session, User } from '@prisma/client';
import { Request, Response } from 'express';

export interface Context {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  session:
    | (Session & {
        user: User & {
          app: App;
        };
      })
    | null;
}

const prisma = new PrismaClient();

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> {
  const authHeader = req.headers.authorization;
  let session: Context['session'] = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const access = await prisma.accessToken.findUnique({
      where: { value: token },
    });

    if (access && access.expiresAt > new Date())
      session = await prisma.session.findUnique({
        where: { id: access.sessionId },
        include: { user: { include: { app: true } } },
      });
  }

  return {
    req,
    res,
    prisma,
    session,
  };
}
