import { objectType } from 'nexus';
import {
  AccessToken,
  RefreshToken,
  EmailVerificationToken,
} from 'nexus-prisma';

export const TokenPayloadModel = objectType({
  name: 'TokenPayload',
  description: 'The payload returned when initiating or refreshing a session',
  definition(t) {
    t.string('access', {
      description: 'Token used to authenticate user against this api',
    });
    t.dateTime('accessExpiresAt', {
      description: 'After this date, the access token is no longer valid',
    });
    t.string('refresh', {
      description: 'Token used to refresh an expired access token',
    });
    t.dateTime('refreshExpiresAt', {
      description: 'After this date, the refresh token is no longer valid',
    });
  },
});

export const AccessTokenModel = objectType({
  name: AccessToken.$name,
  description: AccessToken.$description,
  definition(t) {
    t.field(AccessToken.id);
    t.field(AccessToken.createdAt);
    t.field(AccessToken.updatedAt);
    t.field(AccessToken.expiresAt);
    t.field(AccessToken.value);
    t.field(AccessToken.session);
  },
});

export const RefreshTokenModel = objectType({
  name: RefreshToken.$name,
  description: RefreshToken.$description,
  definition(t) {
    t.field(RefreshToken.id);
    t.field(RefreshToken.createdAt);
    t.field(RefreshToken.updatedAt);
    t.field(RefreshToken.expiresAt);
    t.field(RefreshToken.value);
    t.field(RefreshToken.session);
  },
});

export const EmailVerificationTokenModel = objectType({
  name: EmailVerificationToken.$name,
  description: EmailVerificationToken.$description,
  definition(t) {
    t.field(EmailVerificationToken.id);
    t.field(EmailVerificationToken.createdAt);
    t.field(EmailVerificationToken.updatedAt);
    t.field(EmailVerificationToken.expiresAt);
    t.field(EmailVerificationToken.value);
    t.field(EmailVerificationToken.user);
  },
});
