import { extendType, objectType, arg } from 'nexus';

export * from './models/Account';
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
      resolve() {
        //TODO
      },
    });
    t.json('parameters', {
      description:
        'The parameters which should be sent with the OAuth2.0 authorize request',
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
          type: 'AuthProvider',
          description: 'Provider you wish to request authorization from',
        }),
      },
      resolve() {
        // TODO
      },
    });
  },
});
