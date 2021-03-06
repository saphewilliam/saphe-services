import { fieldAuthorizePlugin, makeSchema, queryComplexityPlugin } from 'nexus';
import { FieldAuthorizePluginErrorConfig } from 'nexus/dist/plugins/fieldAuthorizePlugin';
import { join } from 'path';

export const schema = makeSchema({
  types: [],
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
