import { OAuthConfig } from '.';

export const Google: OAuthConfig = {
  wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
  authorization: { params: { scope: 'openid email profile' } },
  idToken: true,
  checks: ['pkce', 'state'],
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },
};
