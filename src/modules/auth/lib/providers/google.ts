import { OAuthProvider } from '@prisma/client';
import { Check, OAuthConfig } from '../providerHelpers';

interface GoogleToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  id_token: string;
}

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export const Google: OAuthConfig<GoogleToken, GoogleUser> = () => ({
  key: OAuthProvider.GOOGLE,
  name: 'Google',
  check: Check.BOTH,
  authorization: {
    url: 'https://accounts.google.com/o/oauth2/auth',
    params: () => ({ scope: 'email profile' }),
  },
  token: {
    url: 'https://accounts.google.com/o/oauth2/token',
  },
  user: {
    url: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  profile(user) {
    return {
      id: user.sub,
      name: user.name,
      email: user.email,
      image: user.picture,
    };
  },
});
