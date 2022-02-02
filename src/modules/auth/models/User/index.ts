import { objectType } from 'nexus';
import { User } from 'nexus-prisma';

export const UserModel = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.createdAt);
    t.field(User.updatedAt);

    t.field(User.email);
    t.field(User.emailVerified);
    t.field(User.name);
    t.field(User.image);
    t.field(User.ref);
    t.field(User.blocked);
  },
});
