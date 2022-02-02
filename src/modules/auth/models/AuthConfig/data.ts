import { Prisma } from '@prisma/client';
import { AppIds } from '@core/models/App/data';

export const AuthConfigData: Prisma.AuthConfigCreateInput[] = [
  {
    app: { connect: { id: AppIds.TEST_APP } },
    discordClientId: process.env.DISCORD_CLIENT_ID || null,
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET || null,
    facebookClientId: process.env.FACEBOOK_CLIENT_ID || null,
    facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET || null,
    gitHubClientId: process.env.GITHUB_CLIENT_ID || null,
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET || null,
    googleClientId: process.env.GOOGLE_CLIENT_ID || null,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || null,
    instagramClientId: process.env.INSTAGRAM_CLIENT_ID || null,
    instagramClientSecret: process.env.INSTAGRAM_CLIENT_SECRET || null,
    tikTokClientId: process.env.TIKTOK_CLIENT_ID || null,
    tikTokClientSecret: process.env.TIKTOK_CLIENT_SECRET || null,
  },
];
