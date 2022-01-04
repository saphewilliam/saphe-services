import { extendType, objectType, arg } from 'nexus';
import { generators } from 'openid-client';
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
    t.string('url', {
      description:
        'The endpoint to which an OAuth2.0 authorize request must be sent',
    });
  },
});

export const AuthQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('authorize', {
      type: 'AuthorizeType',
      description:
        'Get all information required to send an authorization request from the client',
      args: {
        provider: arg({
          type: 'OAuthProvider',
          description: 'Provider you wish to request authorization from',
        }),
      },
      resolve(_root, args) {
        const provider = providers[args.provider];
        const state = generators.state();

        return {
          url: provider.authorization,
        };
        // TODO
      },
    });
  },
});
