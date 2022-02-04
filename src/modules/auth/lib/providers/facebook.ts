import { OAuthProvider } from '@prisma/client';
import { Check, OAuthConfig } from '../providerHelpers';

interface FacebookToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface FacebookUser {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}

// https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/

export const Facebook: OAuthConfig<FacebookToken, FacebookUser> = () => ({
  key: OAuthProvider.FACEBOOK,
  name: 'Facebook',
  check: Check.STATE,
  authorization: {
    url: 'https://www.facebook.com/v12.0/dialog/oauth',
    params: () => ({ scope: 'email,public_profile' }),
  },
  token: {
    url: 'https://graph.facebook.com/oauth/access_token',
  },
  user: {
    url: 'https://graph.facebook.com/me',
    params: () => ({ fields: 'id,name,email,picture' }),
  },
  profile(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.picture.data.url,
    };
  },
});
