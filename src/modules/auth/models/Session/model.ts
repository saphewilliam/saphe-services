import { objectType } from 'nexus';
import { Session } from 'nexus-prisma';

export const SessionModel = objectType({
  name: Session.$name,
  description: Session.$description,
  definition(t) {
    t.field(Session.id);
    t.field(Session.createdAt);
    t.field(Session.updatedAt);
    t.field(Session.data);
    t.field(Session.user);

    t.nullable.field('accessToken', {
      type: 'AccessToken',
      async resolve(root, _args, ctx) {
        const tokens = await ctx.prisma.session
          .findUnique({
            where: { id: root.id },
          })
          .accessTokens();
        if (tokens.length === 0) return null;
        // TODO is the first token always the most recent one?
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        else return tokens[0]!;
      },
    });
    t.nullable.field('refreshToken', {
      type: 'RefreshToken',
      async resolve(root, _args, ctx) {
        const tokens = await ctx.prisma.session
          .findUnique({
            where: { id: root.id },
          })
          .refreshTokens();
        if (tokens.length === 0) return null;
        // TODO is the first token always the most recent one?
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        else return tokens[0]!;
      },
    });
  },
});
