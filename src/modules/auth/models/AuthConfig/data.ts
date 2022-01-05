import { Prisma } from '@prisma/client';
import { AppIds } from '@core/models/App/data';

export const AuthConfigData: Prisma.AuthConfigCreateInput[] = [
  {
    app: { connect: { id: AppIds.TEST_APP } },
    DiscordClientId: process.env.DISCORD_CLIENT_ID || null,
    DiscordClientSecret: process.env.DISCORD_CLIENT_SECRET || null,
    FacebookClientId: process.env.FACEBOOK_CLIENT_ID || null,
    FacebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET || null,
    GitHubClientId: process.env.GITHUB_CLIENT_ID || null,
    GitHubClientSecret: process.env.GITHUB_CLIENT_SECRET || null,
    GoogleClientId: process.env.GOOGLE_CLIENT_ID || null,
    GoogleClientSecret: process.env.GOOGLE_CLIENT_SECRET || null,
    InstagramClientId: process.env.INSTAGRAM_CLIENT_ID || null,
    InstagramClientSecret: process.env.INSTAGRAM_CLIENT_SECRET || null,
    TikTokClientId: process.env.TIKTOK_CLIENT_ID || null,
    TikTokClientSecret: process.env.TIKTOK_CLIENT_SECRET || null,
  },
];
