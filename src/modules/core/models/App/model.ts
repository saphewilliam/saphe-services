import { objectType } from 'nexus';
import { App } from 'nexus-prisma';

export const AppModel = objectType({
  name: App.$name,
  description: App.$description,
  definition(t) {
    t.field(App.id);
    t.field(App.createdAt);
    t.field(App.updatedAt);
    t.field(App.name);
    t.field(App.clientId);
  },
});
