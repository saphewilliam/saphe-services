import { extendType, objectType } from 'nexus';

export * from './models/App';

export const CoreQuery = objectType({
  name: 'CoreQuery',
  definition(t) {
    t.boolean('ok', {
      resolve() {
        return true;
      },
    });
  },
});

export const CoreMutation = objectType({
  name: 'CoreMutation',
  definition(t) {
    t.boolean('ok', {
      resolve() {
        return true;
      },
    });
  },
});

export const ExtendCoreQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('core', {
      type: 'CoreQuery',
      resolve: () => ({}),
    });
  },
});

export const ExtendCoreMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('core', {
      type: 'CoreMutation',
      resolve: () => ({}),
    });
  },
});
