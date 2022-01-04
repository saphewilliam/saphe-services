import { OAuthProvider } from '@prisma/client';
import { OAuthConfig } from '.';

interface FacebookProfile {
  id: string;
  picture: { data: { url: string } };
}

export const Facebook: OAuthConfig<FacebookProfile> = {
  key: OAuthProvider.FACEBOOK,
  name: 'Facebook',
  authorization: 'https://www.facebook.com/v11.0/dialog/oauth?scope=email',
  token: 'https://graph.facebook.com/oauth/access_token',
  userinfo: {
    url: 'https://graph.facebook.com/me',
    // https://developers.facebook.com/docs/graph-api/reference/user/#fields
    params: { fields: 'id,name,email,picture' },
    async request({ tokens, client, provider }) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return await client.userinfo(tokens.access_token!, {
        params: provider.userinfo?.params,
      });
    },
  },
  profile(profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture.data.url,
    };
  },
};
