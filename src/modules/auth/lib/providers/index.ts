import { OAuthProvider } from '@prisma/client';
import { OAuthConfig } from '../providerHelpers';
import { Discord } from './discord';
import { Facebook } from './facebook';
import { GitHub } from './github';
import { Google } from './google';
import { Instagram } from './instagram';
import { TikTok } from './tiktok';

type Providers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [P in keyof typeof OAuthProvider]: OAuthConfig<any, any>;
};

export const providers: Providers = {
  [OAuthProvider.DISCORD]: Discord,
  [OAuthProvider.FACEBOOK]: Facebook,
  [OAuthProvider.GITHUB]: GitHub,
  [OAuthProvider.GOOGLE]: Google,
  [OAuthProvider.INSTAGRAM]: Instagram,
  [OAuthProvider.TIKTOK]: TikTok,
};
