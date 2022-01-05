import { OAuthProvider } from '@prisma/client';
import { Check, OAuthConfig } from '../providerHelpers';

interface TikTokToken {
  open_id: string;
  scope: string;
  access_token: string;
  expires_in: string;
  refresh_token: string;
  refresh_expires_in: string;
}

interface TikTokUser {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_url_200: string;
  avatar_large_url: string;
  display_name: string;
}

// TODO https://github.com/nextauthjs/next-auth/pull/2720/files

export const TikTok: OAuthConfig<TikTokToken, TikTokUser> = (options) => ({
  key: OAuthProvider.TIKTOK,
  name: 'TikTok',
  check: Check.STATE,
  // https://developers.tiktok.com/doc/login-kit-web
  authorization: {
    url: 'https://open-api.tiktok.com/platform/oauth/connect/',
    params: {
      client_key: options.clientId,
      scope: 'user.info.basic',
    },
  },
  // https://developers.tiktok.com/doc/login-kit-manage-user-access-tokens
  token: {
    url: 'https://open-api.tiktok.com/oauth/access_token/',
    params: {
      client_key: options.clientId,
    },
  },
  // https://developers.tiktok.com/doc/login-kit-user-info-basic
  user: {
    url: 'https://open-api.tiktok.com/user/info/',
    params: {},
  },
  profile(user) {
    return {
      email: null,
      image: user.avatar_url,
      id: user.open_id,
      name: user.display_name,
    };
  },
});
