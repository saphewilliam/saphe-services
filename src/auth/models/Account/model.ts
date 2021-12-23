import { objectType } from 'nexus';
import { Account } from 'nexus-prisma';

export const AccountModel = objectType({
  name: Account.$name,
  description: Account.$description,
  definition(t) {
    t.field(Account.id);
  },
});
