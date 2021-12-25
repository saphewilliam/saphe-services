import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

const prisma = new PrismaClient();

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> {
  return {
    prisma,
    req,
    res,
  };
}
