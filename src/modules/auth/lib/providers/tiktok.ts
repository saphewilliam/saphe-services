import { OAuthProvider } from '@prisma/client';
import axios from 'axios';
import { Check, OAuthConfig } from '../providerHelpers';

interface TikTokToken {
  access_token: string;
  captcha: string;
  desc_url: string;
  description: string;
  error_code: number;
  expires_in: number;
  log_id: string;
  open_id: string;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
}

interface TikTokUser {
  open_id: string;
  // union_id: string;
  avatar_url: string;
  // avatar_url_100: string;
  // avatar_url_200: string;
  // avatar_large_url: string;
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
    params: () => ({
      client_key: options.clientId,
      scope: 'user.info.basic',
    }),
  },
  // https://developers.tiktok.com/doc/login-kit-manage-user-access-tokens
  token: {
    url: 'https://open-api.tiktok.com/oauth/access_token/',
    params: () => ({ client_key: options.clientId }),
    data: (response) => response.data.data,
  },
  // https://developers.tiktok.com/doc/login-kit-user-info-basic
  user: {
    url: 'https://open-api.tiktok.com/user/info/',
    params: ({ token }) => ({
      open_id: token.open_id,
      fields: ['open_id', 'display_name', 'avatar_url'],
    }),
    request: async ({ url, params }) => {
      return await axios({
        method: 'POST',
        url: url.toString(),
        headers: { 'Content-Type': 'application/json' },
        data: params,
      });
    },
    data: (response) => response.data.data,
  },
  profile(user) {
    return {
      id: user.open_id,
      name: user.display_name,
      email: null,
      image: user.avatar_url,
    };
  },
});
