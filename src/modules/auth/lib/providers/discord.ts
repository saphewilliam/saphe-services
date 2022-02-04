import { OAuthProvider } from '@prisma/client';
import { Check, OAuthConfig } from '../providerHelpers';

interface DiscordToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: 0;
  flags: 0;
  banner: null | string;
  banner_color: null | string;
  accent_color: null | string;
  locale: string;
  mfa_enabled: boolean;
  email: string;
  verified: boolean;
}

export const Discord: OAuthConfig<DiscordToken, DiscordUser> = () => ({
  key: OAuthProvider.DISCORD,
  name: 'Discord',
  check: Check.STATE,
  // https://discord.com/developers/docs/topics/oauth2#authorization-code-grant
  authorization: {
    url: 'https://discord.com/api/oauth2/authorize',
    params: () => ({ scope: 'identify email' }),
  },
  token: {
    url: 'https://discord.com/api/oauth2/token',
  },
  user: {
    url: 'https://discord.com/api/users/@me',
  },
  profile(user) {
    let image_url = '';
    if (user.avatar === null) {
      const defaultAvatarNumber = parseInt(user.discriminator) % 5;
      image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    } else {
      const format = user.avatar.startsWith('a_') ? 'gif' : 'png';
      image_url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}`;
    }
    return {
      id: user.id,
      name: user.username,
      email: user.email,
      image: image_url,
    };
  },
});
