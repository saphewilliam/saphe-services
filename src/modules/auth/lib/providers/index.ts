import { OAuthProvider } from '@prisma/client';
import { Awaitable } from '@lib/helperTypes';
import { Discord } from './discord';
import { Facebook } from './facebook';
import { GitHub } from './github';
import { Google } from './google';
import { Instagram } from './instagram';
import type {
  AuthorizationParameters,
  CallbackParamsType,
  Issuer,
  TokenSetParameters,
} from 'openid-client';

// Based on https://github.com/nextauthjs/next-auth/tree/main/src/providers

type UrlParams = Record<string, unknown>;

export enum Check {
  PKCE = 'PKCE',
  STATE = 'STATE',
  BOTH = 'BOTH',
  NONE = 'NONE',
}

interface Profile {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface EndpointHandler<
  Params extends UrlParams,
  Context = any,
  ReturnType = any,
> {
  url?: string;
  params?: Params;
  request?: (
    context: Context & {
      client: InstanceType<Issuer['Client']>;
    },
  ) => Awaitable<ReturnType>;
}

export interface OAuthConfig<ProviderProfile> {
  key: OAuthProvider;
  name: string;
  /** The login process will be initiated by sending the user to this URL. */
  authorization?: string | EndpointHandler<AuthorizationParameters>;
  /** After authorization, a token is created and retrieved at this URL. */
  token?:
    | string
    | EndpointHandler<
        UrlParams,
        { params: CallbackParamsType },
        { tokens: TokenSetParameters }
      >;
  /** Information about the user is fetched from this URL. */
  userinfo?:
    | string
    | EndpointHandler<UrlParams, { tokens: TokenSetParameters }, Profile>;
  profile?: (
    profile: ProviderProfile,
    tokens: TokenSetParameters,
  ) => Awaitable<Profile>;
  check?: Check;
}

type Providers = {
  [P in keyof typeof OAuthProvider]: OAuthConfig<any>;
};

export const providers: Providers = {
  [OAuthProvider.DISCORD]: Discord,
  [OAuthProvider.FACEBOOK]: Facebook,
  [OAuthProvider.GITHUB]: GitHub,
  [OAuthProvider.GOOGLE]: Google,
  [OAuthProvider.INSTAGRAM]: Instagram,
};

// export const providers: Record<string, OAuthProvider> = {
//   github: {
//     url: 'https://github.com/login/oauth/authorize',
//     params: [{}],
//   },
//   google: {},
// };
