import { OAuthProvider } from '@prisma/client';
import { Awaitable } from '@lib/helperTypes';

export enum Check {
  PKCE = 'PKCE',
  STATE = 'STATE',
  BOTH = 'BOTH',
  NONE = 'NONE',
}

// TODO rethink structure
interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Handler<Context, Return> extends Endpoint {
  /** Optionally configure the request from scratch */
  request?: (context: Context /*& {client}*/) => Awaitable<Return>;
}

// TODO document which params are added automatically
interface Endpoint {
  /** URL to be requested (excluding any URL parameters) */
  url: string;
  /** Optional object with request parameters */
  params?: Record<string, string>;
}

// type UserRequest<T> = { url: string; params?: Record<string, string>, request:  };

export type OAuthConfig<ProviderToken, ProviderProfile> = (options: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) => {
  key: OAuthProvider;
  name: string;
  authorization: Endpoint;
  token: Handler<{ params: { code: string; pkce?: string } }, ProviderToken>;
  user: Handler<{ token: ProviderToken }, ProviderProfile>;
  check: Check;
  profile: (profile: ProviderProfile) => Awaitable<Profile>;
};
