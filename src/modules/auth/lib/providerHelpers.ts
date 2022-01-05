import { OAuthProvider } from '@prisma/client';
import { Awaitable } from '@lib/helperTypes';

export enum Check {
  PKCE = 'PKCE',
  STATE = 'STATE',
  BOTH = 'BOTH',
  NONE = 'NONE',
}

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface URL {
  url: string;
  params?: Record<string, string>;
}

export type OAuthConfig<ProviderToken, ProviderProfile> = (options: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) => {
  key: OAuthProvider;
  name: string;
  authorization: URL;
  token: URL;
  user: URL;
  check: Check;
  profile: (profile: ProviderProfile) => Awaitable<Profile>;
};
