import { OAuthProvider } from '@prisma/client';
import { Check, OAuthConfig } from '../providerHelpers';

interface InstagramToken {
  access_token: string;
  user_id: number;
}

interface InstagramUser {
  id: string;
  username: string;
  account_type: 'BUSINESS' | 'MEDIA_CREATOR' | 'PERSONAL';
}

export const Instagram: OAuthConfig<InstagramToken, InstagramUser> = () => ({
  key: OAuthProvider.INSTAGRAM,
  name: 'Instagram',
  check: Check.STATE,
  // https://developers.facebook.com/docs/instagram-basic-display-api/reference/oauth-authorize
  authorization: {
    url: 'https://api.instagram.com/oauth/authorize',
    params: {
      scope: 'user_profile',
    },
  },
  // https://developers.facebook.com/docs/instagram-basic-display-api/reference/oauth-access-token
  token: {
    url: 'https://api.instagram.com/oauth/access_token',
  },
  // https://developers.facebook.com/docs/instagram-basic-display-api/reference/me
  user: {
    url: 'https://graph.instagram.com/me',
    params: {
      fields: 'id,username,account_type,name',
    },
  },
  profile(user) {
    return {
      id: user.id,
      name: user.username,
      email: null,
      image: null,
    };
  },
});
