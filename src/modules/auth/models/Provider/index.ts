import { enumType } from 'nexus';
import { AuthProvider } from 'nexus-prisma';

export const AuthProviderModel = enumType(AuthProvider);

interface Provider {
  url: string;
  params: Record<string, any>;
}

export const providers: Record<string, Provider> = {
  github: {
    url: 'https://github.com/login/oauth/authorize',
    params: [{}],
  },
};
