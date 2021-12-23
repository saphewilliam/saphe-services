import { objectType, extendType } from 'nexus';

export const AppModel = objectType({
  name: 'App',
  description: 'Web entity or Application which is registered to use some or all services',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('clientId');
    t.string('clientSecret');
  },
});

export const AppMutation = extendType({
  type: 'CoreMutation',
  definition(t) {},
});
