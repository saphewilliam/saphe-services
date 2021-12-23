import { fieldAuthorizePlugin, makeSchema, queryComplexityPlugin } from 'nexus';
import NexusPrismaScalars from 'nexus-prisma/scalars';
import { FieldAuthorizePluginErrorConfig } from 'nexus/dist/plugins/fieldAuthorizePlugin';
import { join } from 'path';
import * as authTypes from './auth';
import * as coreTypes from './core';

export const schema = makeSchema({
  types: [NexusPrismaScalars, authTypes, coreTypes],
  plugins: [
    fieldAuthorizePlugin({
      formatError: ({ error }: FieldAuthorizePluginErrorConfig): Error =>
        error ?? new Error('Not authorized'),
    }),
    queryComplexityPlugin(),
  ],
  outputs: {
    typegen: join(process.cwd(), 'node_modules', '@types', 'nexus-typegen', 'index.d.ts'),
    schema: join(process.cwd(), 'schema.graphql'),
  },
  nonNullDefaults: {
    input: true,
    output: true,
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'src', 'context.ts'),
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});
