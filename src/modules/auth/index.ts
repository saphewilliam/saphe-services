import fetch from 'cross-fetch';
import { extendType, arg, stringArg, objectType, nullable } from 'nexus';
import pkceChallenge from 'pkce-challenge';
import { Check } from './lib/providerHelpers';
import { providers } from './lib/providers';

export * from './models/Account';
export * from './models/Provider';
export * from './models/Session';
export * from './models/Token';
export * from './models/User';

export const AuthorizeTypeModel = objectType({
  name: 'AuthorizeType', // TODO rename
  description:
    'The parameters necessary to start an OAuth2.0 flow with an external provider',
  definition(t) {
    // t.string('provider', {
    //   description: 'The provider associated with these values',
    // });
    t.string('url', {
      description:
        'The endpoint to which an OAuth2.0 authorize request must be sent',
    });
    t.nullable.string('state', {
      description: 'State generated for this request (save as cookie)',
    });
    t.nullable.string('pkce', {
      description: 'PKCE verifier generated for this request (save as cookie)',
    });
  },
});

export const AuthQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('authorize', {
      type: 'AuthorizeType',
      description:
        'Get the information to send an authorization request from the client',
      args: {
        provider: arg({
          type: 'OAuthProvider',
          description: 'Provider you wish to request authorization from',
        }),
        redirectUri: stringArg({
          description:
            'Url to where the user should be redirected after authorizing',
        }),
      },
      async resolve(_root, args) {
        // TODO fetch client_id & client_secret from database and validate their existence
        const clientId =
          process.env[`${args.provider}_CLIENT_ID`] ?? 'NO_CLIENT_ID';
        const clientSecret =
          process.env[`${args.provider}_CLIENT_SECRET`] ?? 'NO_CLIENT_SECRET';
        const { redirectUri } = args;
        const provider = providers[args.provider]({
          clientId,
          clientSecret,
          redirectUri,
        });

        const authorizeUrl = new URL(provider.authorization.url);
        const params = provider.authorization.params ?? {};

        params['client_id'] = clientId;
        params['redirect_uri'] = redirectUri;
        params['response_type'] = 'code';

        let state: string | null = null;
        if (provider.check === Check.STATE || provider.check === Check.BOTH) {
          state = `${Math.random() * 1117878}`;
          params['state'] = state;
        }

        let pkce: string | null = null;
        if (provider.check === Check.PKCE || provider.check === Check.BOTH) {
          const { code_challenge, code_verifier } = pkceChallenge();
          pkce = code_verifier;
          params['code_challenge_method'] = 'S256';
          params['code_challenge'] = code_challenge;
        }

        Object.entries(params).map(([key, value]) =>
          authorizeUrl.searchParams.set(key, value),
        );

        return {
          url: authorizeUrl.toString(),
          state,
          pkce,
        };
      },
    });
  },
});

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('login', {
      // TODO type: 'Session',
      type: 'Json',
      description: 'Log in a user',
      args: {
        provider: arg({
          type: 'OAuthProvider',
          description: 'Provider you used to log in with',
        }),
        redirectUri: stringArg({
          description: 'Uri where the user should be redirected to',
        }),
        code: stringArg({
          description: 'Code received from provider to log in',
        }),
        expectedState: nullable(
          stringArg({
            description: 'Expected state (from cookie)',
          }),
        ),
        state: nullable(
          stringArg({
            description: 'Actual state (from callback url parameters)',
          }),
        ),
        pkce: nullable(
          stringArg({
            description: 'PKCE verifier token',
          }),
        ),
      },
      async resolve(_root, args) {
        // TODO fetch client_id & client_secret from database and validate their existence
        const clientId =
          process.env[`${args.provider}_CLIENT_ID`] ?? 'NO_CLIENT_ID';
        const clientSecret =
          process.env[`${args.provider}_CLIENT_SECRET`] ?? 'NO_CLIENT_SECRET';
        const { redirectUri, code } = args;
        const provider = providers[args.provider]({
          clientId,
          clientSecret,
          redirectUri,
        });

        const tokenUrl = new URL(provider.token.url);
        const tokenParams = provider.token.params ?? {};

        tokenParams['client_id'] = clientId;
        tokenParams['client_secret'] = clientSecret;
        tokenParams['redirect_uri'] = redirectUri;
        tokenParams['code'] = code;
        tokenParams['grant_type'] = 'authorization_code';

        if (provider.check === Check.STATE || provider.check === Check.BOTH) {
          if (!args.state || !args.expectedState)
            throw Error(
              `Provider ${provider.name} requires both state and expectedState to be set`,
            );
          if (args.expectedState !== args.state) throw Error('State mismatch');
        }

        if (provider.check === Check.PKCE || provider.check === Check.BOTH) {
          if (!args.pkce)
            throw Error(`Provider ${provider.name} requires pkce to be set`);
          tokenParams['code_verifier'] = args.pkce;
        }

        Object.entries(tokenParams).map(([key, value]) => {
          tokenUrl.searchParams.set(key, value);
        });

        const tokenResponse = await fetch(tokenUrl.toString(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: tokenUrl.searchParams.toString(),
        });
        const tokenData = (await tokenResponse.json()) as {
          access_token: string;
          token_type?: string;
        };

        // console.log(tokenData);

        const userUrl = new URL(provider.user.url);
        const userParams = provider.user.params ?? {};

        userParams['access_token'] = tokenData.access_token;

        Object.entries(userParams).map(([key, value]) =>
          userUrl.searchParams.set(key, value),
        );

        const userResponse = await fetch(userUrl.toString(), {
          headers: {
            Accept: 'application/json',
            Authorization: `${tokenData.token_type ?? 'Bearer'} ${
              tokenData.access_token
            }`,
          },
        });
        const userData = await userResponse.json();

        return userData;
      },
    });
  },
});
