import { objectType } from 'nexus';
import { Session } from 'nexus-prisma';

export const SessionModel = objectType({
  name: Session.$name,
  description: Session.$description,
  definition(t) {
    t.field(Session.id);
  },
});

// export const SessionQuery = extendType({
//   type: 'Query',
//   definition(t) {

//   }
// })
