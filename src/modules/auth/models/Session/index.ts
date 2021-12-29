import { extendType, objectType } from 'nexus';
import { Session } from 'nexus-prisma';

export const SessionModel = objectType({
  name: Session.$name,
  description: Session.$description,
  definition(t) {
    t.field(Session.id);
  },
});

export const SessionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('login', {
      type: 'Session',
      description: 'Log in a user',
      resolve(source, args, ctx) {},
    });
  },
});
