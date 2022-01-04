import { OAuthProvider } from '@prisma/client';
import { OAuthConfig } from '.';

export const Instagram: OAuthConfig = {
  key: OAuthProvider.INSTAGRAM,
  authorization: 'https://api.instagram.com/oauth/authorize?scope=user_profile',
  token: 'https://api.instagram.com/oauth/access_token',
  userinfo:
    'https://graph.instagram.com/me?fields=id,username,account_type,name',
  profile(profile) {
    return {
      id: profile.id,
      name: profile.username,
      email: null,
      image: null,
    };
  },
};
