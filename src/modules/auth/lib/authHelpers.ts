import { AuthConfig, OAuthProvider } from '@prisma/client';
import { nanoid } from 'nanoid';
import { OAuthConfig, Params } from '@auth/lib/providerHelpers';
import { Context } from '@src/context';
import { providers } from './providers';

export function getClientIdAndSecret(
  config: AuthConfig,
  provider: OAuthProvider,
): { clientId: string; clientSecret: string } {
  let data: { clientId: string | null; clientSecret: string | null };
  switch (provider) {
    case OAuthProvider.DISCORD:
      data = {
        clientId: config.discordClientId,
        clientSecret: config.discordClientSecret,
      };
      break;
    case OAuthProvider.FACEBOOK:
      data = {
        clientId: config.facebookClientId,
        clientSecret: config.facebookClientSecret,
      };
      break;
    case OAuthProvider.GITHUB:
      data = {
        clientId: config.gitHubClientId,
        clientSecret: config.gitHubClientSecret,
      };
      break;
    case OAuthProvider.GOOGLE:
      data = {
        clientId: config.googleClientId,
        clientSecret: config.googleClientSecret,
      };
      break;
    case OAuthProvider.INSTAGRAM:
      data = {
        clientId: config.instagramClientId,
        clientSecret: config.instagramClientSecret,
      };
      break;
    case OAuthProvider.TIKTOK:
      data = {
        clientId: config.tikTokClientId,
        clientSecret: config.tikTokClientSecret,
      };
      break;
  }

  if (data.clientId === null || data.clientSecret === null)
    throw Error(
      `This app is not set up to handle OAuth2.0 provider '${provider.toLowerCase()}'`,
    );
  return data as { clientId: string; clientSecret: string };
}

export async function getProvider(
  ctx: Context,
  args: {
    provider: OAuthProvider;
    appId: string;
    redirectUri: string;
  },
): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: ReturnType<OAuthConfig<any, any>>;
  clientId: string;
  clientSecret: string;
  config: AuthConfig;
}> {
  const { provider, appId, redirectUri } = args;

  const config = await ctx.prisma.app
    .findUnique({
      where: { clientId: appId },
    })
    .authConfig();
  if (config === null) throw Error('Authentication config not found');

  const { clientId, clientSecret } = getClientIdAndSecret(config, provider);

  return {
    provider: providers[provider]({
      clientId,
      clientSecret,
      redirectUri,
    }),
    clientId,
    clientSecret,
    config,
  };
}

export function makeProviderUrl(
  providerUrl: string,
  makeParams: () => Params,
): [URL, Params] {
  const url = new URL(providerUrl);
  const params = makeParams();

  Object.entries(params).map(([key, value]) => {
    if (typeof value == 'object')
      for (const str of value) url.searchParams.append(key, str);
    else url.searchParams.append(key, value);
  });

  return [url, params];
}

export function getNewAccessToken(config: {
  accessExpires: number | null;
  refreshExpires: number | null;
}): { expiresAt: Date; value: string } {
  const accessExpiresDate = new Date();
  accessExpiresDate.setSeconds(
    accessExpiresDate.getSeconds() + (config.accessExpires ?? 3600),
  );

  return { expiresAt: accessExpiresDate, value: nanoid(32) };
}

export function getNewRefreshToken(config: {
  accessExpires: number | null;
  refreshExpires: number | null;
}): { expiresAt: Date; value: string } {
  const refreshExpiresDate = new Date();
  refreshExpiresDate.setSeconds(
    refreshExpiresDate.getSeconds() + (config.refreshExpires ?? 2592000),
  );

  return { expiresAt: refreshExpiresDate, value: nanoid(32) };
}
