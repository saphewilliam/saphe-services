import { extendType, objectType } from 'nexus';

export * from './models/Account/model';
export * from './models/Session/model';
export * from './models/Token/model';
export * from './models/User/model';

export const AuthQuery = objectType({
  name: 'AuthQuery',
  definition(t) {
    t.boolean('ok', {
      resolve() {
        return true;
      },
    });
  },
});

export const AuthMutation = objectType({
  name: 'AuthMutation',
  definition(t) {
    t.boolean('ok', {
      resolve() {
        return true;
      },
    });
  },
});

export const ExtendAuthQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('auth', {
      type: 'AuthQuery',
      resolve: () => ({}),
    });
  },
});

export const ExtendAuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('auth', {
      type: 'AuthMutation',
      resolve: () => ({}),
    });
  },
});
