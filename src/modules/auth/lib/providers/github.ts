import { OAuthProvider } from '@prisma/client';
import { Check, OAuthConfig } from '../providerHelpers';

interface GitHubToken {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: true | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export const GitHub: OAuthConfig<GitHubToken, GitHubUser> = () => ({
  key: OAuthProvider.GITHUB,
  name: 'GitHub',
  check: Check.STATE,
  // https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
  authorization: {
    url: 'https://github.com/login/oauth/authorize',
    params: () => ({ scope: 'read:user+user:email' }),
  },
  // https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
  token: {
    url: 'https://github.com/login/oauth/access_token',
  },
  // https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#3-use-the-access-token-to-access-the-api
  user: {
    url: 'https://api.github.com/user',
  },
  profile(user) {
    // TODO
    //     // If user has email hidden, get their primary email from the GitHub API
    //     if (!profile.email) {
    //       const emails = await (
    //         await fetch('https://api.github.com/user/emails', {
    //           headers: { Authorization: `token ${tokens.access_token}` },
    //         })
    //       ).json();

    //       if (emails?.length > 0) {
    //         // Get primary email
    //         profile.email = emails.find((email) => email.primary)?.email;
    //         // And if for some reason it doesn't exist, just use the first
    //         if (!profile.email) profile.email = emails[0].email;
    //       }
    //     }

    //     return profile;
    return {
      id: String(user.id),
      name: user.name ?? user.login,
      email: user.email,
      image: user.avatar_url,
    };
  },
});
