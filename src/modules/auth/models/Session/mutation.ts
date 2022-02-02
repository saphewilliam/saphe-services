import axios, { AxiosResponse } from 'axios';
import { extendType, arg, stringArg, nullable } from 'nexus';
import {
  getNewAccessToken,
  getNewRefreshToken,
  getProvider,
  makeProviderUrl,
} from '@auth/lib/authHelpers';
import { Check } from '../../lib/providerHelpers';

export const SessionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('logout', {
      type: 'Session',
      description: 'Invalidate a session',
      async authorize(_root, _args, ctx) {
        return ctx.session !== null;
      },
      async resolve(_root, _args, ctx) {
        if (!ctx.session) throw Error('Session not found');

        await ctx.prisma.accessToken.updateMany({
          where: {
            sessionId: ctx.session.id,
            expiresAt: { gte: new Date() },
          },
          data: { expiresAt: new Date() },
        });
        await ctx.prisma.refreshToken.updateMany({
          where: {
            sessionId: ctx.session.id,
            expiresAt: { gte: new Date() },
          },
          data: { expiresAt: new Date() },
        });

        return await ctx.prisma.session.findUnique({
          where: { id: ctx.session.id },
          rejectOnNotFound: true,
        });
      },
    });
    t.field('login', {
      type: 'Session',
      description: 'Log in a user',
      args: {
        appId: stringArg({
          description: 'The ID of the application the user would like to enter',
        }),
        provider: arg({
          type: 'OAuthProvider',
          description: 'Provider you used to log in with',
        }),
        redirectUri: stringArg({
          description: 'Uri where the user should be redirected to',
        }),
        code: stringArg({
          description: 'Code received from provider to log in',
        }),
        expectedState: nullable(
          stringArg({
            description: 'Expected state (from cookie)',
          }),
        ),
        state: nullable(
          stringArg({
            description: 'Actual state (from callback url parameters)',
          }),
        ),
        pkce: nullable(
          stringArg({
            description: 'PKCE verifier token',
          }),
        ),
      },
      async authorize(_root, args, ctx) {
        const app = await ctx.prisma.app.findUnique({
          where: { id: args.appId },
        });
        return app !== undefined;
      },
      async resolve(_root, args, ctx) {
        const p = await getProvider(ctx, args);
        const { provider, clientId, clientSecret, config } = p;

        // Assemble and validate access token params
        const [tokenUrl, tokenParams] = makeProviderUrl(
          provider.token.url,
          () => {
            const params = provider.token.params
              ? provider.token.params({
                  callbackParams: { code: args.code, pkce: args.pkce },
                })
              : {};

            params['client_id'] = clientId;
            params['client_secret'] = clientSecret;
            params['redirect_uri'] = args.redirectUri;
            params['code'] = args.code;
            params['grant_type'] = 'authorization_code';

            if (
              provider.check === Check.STATE ||
              provider.check === Check.BOTH
            ) {
              if (!args.state || !args.expectedState)
                throw Error(
                  `Provider ${provider.name} requires both state and expectedState to be set`,
                );
              if (args.expectedState !== args.state)
                throw Error('State mismatch');
            }

            if (
              provider.check === Check.PKCE ||
              provider.check === Check.BOTH
            ) {
              if (!args.pkce)
                throw Error(
                  `Provider ${provider.name} requires pkce to be set`,
                );
              params['code_verifier'] = args.pkce;
            }

            return params;
          },
        );

        // Create access token
        let tokenResponse: AxiosResponse;
        if (provider.token.request)
          tokenResponse = await provider.token.request({
            callbackParams: { code: args.code, pkce: args.pkce },
            url: tokenUrl,
            params: tokenParams,
          });
        else
          tokenResponse = await axios({
            method: 'POST',
            url: tokenUrl.toString(),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: tokenUrl.searchParams.toString(),
          });

        let tokenData: { access_token: string };
        if (provider.token.data)
          tokenData = await provider.token.data(tokenResponse);
        else tokenData = await tokenResponse.data;

        // Assemble and validate access user data params
        const [userUrl, userParams] = makeProviderUrl(provider.user.url, () => {
          const params = provider.user.params
            ? provider.user.params({ token: tokenData })
            : {};

          params['access_token'] = tokenData.access_token;
          return params;
        });

        // Fetch user data
        let userResponse: AxiosResponse;
        if (provider.user.request)
          userResponse = await provider.user.request({
            token: tokenData,
            url: userUrl,
            params: userParams,
          });
        else
          userResponse = await axios({
            method: 'GET',
            url: userUrl.toString(),
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });

        let userData;
        if (provider.user.data)
          userData = await provider.user.data(userResponse);
        else userData = await userResponse.data;

        // Authenticate user
        const profile = await provider.profile(userData);
        let account = await ctx.prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              providerAccountId: profile.id,
              provider: provider.key,
            },
          },
        });

        if (account === null) {
          // Check if there exists a user with this email address
          if (profile.email !== null) {
            const user = await ctx.prisma.user.findUnique({
              where: { email: profile.email },
            });
            if (user !== null)
              throw Error(
                'There already exists a user with this email address through a different provider',
              );
          }

          // Create user and account
          account = await ctx.prisma.account.create({
            data: {
              provider: provider.key,
              providerAccountId: profile.id,
              user: {
                create: {
                  app: { connect: { clientId: args.appId } },
                  name: profile.name,
                  email: profile.email,
                  image: profile.image,
                },
              },
            },
          });
        }

        return await ctx.prisma.session.create({
          data: {
            accessTokens: { create: { ...getNewAccessToken(config) } },
            refreshTokens: { create: { ...getNewRefreshToken(config) } },
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            user: { connect: { id: account!.userId } },
          },
        });
      },
    });
  },
});
