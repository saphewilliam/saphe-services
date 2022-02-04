import { extendType, stringArg } from 'nexus';
import { getNewAccessToken, getNewRefreshToken } from '@auth/lib/authHelpers';

export const TokenMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('refresh', {
      type: 'TokenPayload',
      description: 'Refresh an expired access token',
      args: {
        refresh: stringArg({
          description:
            'The latest active refresh token associated with the session',
        }),
      },
      async resolve(_root, args, ctx) {
        const refresh = await ctx.prisma.refreshToken.findUnique({
          where: { value: args.refresh },
          select: {
            id: true,
            used: true,
            expiresAt: true,
            session: {
              select: { id: true, user: { select: { appId: true } } },
            },
          },
        });

        // Validate refresh token
        if (!refresh) throw Error('Invalid refresh token');
        if (refresh.expiresAt < new Date())
          throw Error('Expired refresh token');
        if (refresh.used) {
          await ctx.prisma.refreshToken.updateMany({
            where: {
              sessionId: refresh.session.id,
              expiresAt: { gte: new Date() },
            },
            data: { expiresAt: new Date() },
          });
          throw Error('Refresh reuse detected');
        }
        await ctx.prisma.refreshToken.update({
          where: { value: args.refresh },
          data: { used: true },
        });

        const config = await ctx.prisma.app
          .findUnique({ where: { id: refresh.session.user.appId } })
          .authConfig({
            select: { accessExpires: true, refreshExpires: true },
          });
        if (config === null)
          throw Error(`This app is not set up to handle authentication`);

        // Create new set of tokens
        const accessToken = await ctx.prisma.accessToken.create({
          data: { ...getNewAccessToken(config), sessionId: refresh.id },
        });
        const refreshToken = await ctx.prisma.refreshToken.create({
          data: { ...getNewRefreshToken(config), sessionId: refresh.id },
        });

        return {
          access: accessToken.value,
          accessExpiresAt: accessToken.expiresAt,
          refresh: refreshToken.value,
          refreshExpiresAt: refreshToken.expiresAt,
        };
      },
    });
  },
});
