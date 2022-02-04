import { extendType, arg, stringArg, objectType } from 'nexus';
import pkceChallenge from 'pkce-challenge';
import { getProvider, makeProviderUrl } from './lib/authHelpers';
import { Check } from './lib/providerHelpers';

export * from './models/Provider';
export * from './models/Session';
export * from './models/Token';
export * from './models/User';

export const AuthorizeTypeModel = objectType({
  name: 'AuthorizeType', // TODO rename
  description:
    'The parameters necessary to start an OAuth2.0 flow with an external provider',
  definition(t) {
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
        appId: stringArg({
          description: 'The ID of the application the user would like to enter',
        }),
        provider: arg({
          type: 'OAuthProvider',
          description: 'Provider you wish to request authorization from',
        }),
        redirectUri: stringArg({
          description:
            'Url to where the user should be redirected after authorizing',
        }),
      },
      async resolve(_root, args, ctx) {
        const { provider, clientId } = await getProvider(ctx, args);
        const { check, authorization } = provider;

        let state: string | null = null;
        let pkce: string | null = null;
        const [authorizeUrl] = makeProviderUrl(authorization.url, () => {
          const params = authorization.params ? authorization.params({}) : {};

          params['client_id'] = clientId;
          params['redirect_uri'] = args.redirectUri;
          params['response_type'] = 'code';

          if (check === Check.STATE || check === Check.BOTH) {
            state = `${Math.random() * 1117878}`;
            params['state'] = state;
          }

          if (check === Check.PKCE || check === Check.BOTH) {
            const { code_challenge, code_verifier } = pkceChallenge();
            pkce = code_verifier;
            params['code_challenge_method'] = 'S256';
            params['code_challenge'] = code_challenge;
          }

          return params;
        });

        return { url: authorizeUrl.toString(), state, pkce };
      },
    });
  },
});
