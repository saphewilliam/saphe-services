import { Prisma } from '@prisma/client';

export const AppIds = {
  TEST_APP: '5fab37a0-eb63-4fc3-8b38-be2162ff6563',
};

export const AppData: Prisma.AppCreateInput[] = [
  {
    id: AppIds.TEST_APP,
    name: 'Test App',
    clientId: 'TEST_APP_CLIENT_ID',
    clientSecret: 'TEST_APP_CLIENT_SECRET',
  },
];
