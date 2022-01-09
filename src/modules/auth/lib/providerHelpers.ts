import { OAuthProvider } from '@prisma/client';
import { AxiosResponse } from 'axios';
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

type Params = Record<string, string | string[]>;

interface EndpointHandler<Context, Return> extends Endpoint<Context> {
  /** Optionally configure the request from scratch */
  request?: (
    context: Context & { url: URL; params: Params },
  ) => Awaitable<AxiosResponse>;
  /** Optionally extract the required data from the raw response */
  data?: (response: AxiosResponse) => Awaitable<Return>;
}

// TODO document which params are added automatically
interface Endpoint<Context> {
  /** URL to be requested (excluding any URL parameters) */
  url: string;
  /** Optional object with request parameters */
  params?: (context: Context) => Params;
}

export type OAuthConfig<ProviderToken, ProviderUser> = (options: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) => {
  key: OAuthProvider;
  name: string;
  check: Check;
  authorization: Endpoint<Record<string, never>>;
  token: EndpointHandler<
    { callbackParams: { code: string; pkce?: string | null } },
    ProviderToken
  >;
  user: EndpointHandler<{ token: ProviderToken }, ProviderUser>;
  profile: (profile: ProviderUser) => Awaitable<Profile>;
};
