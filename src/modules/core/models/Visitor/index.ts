import { objectType } from 'nexus';
import { Visitor } from 'nexus-prisma';

export const VisitorModel = objectType({
  name: Visitor.$name,
  description: Visitor.$description,
  definition(t) {
    t.field(Visitor.id);
    t.field(Visitor.createdAt);
    t.field(Visitor.updatedAt);
    t.field(Visitor.app);
  },
});
