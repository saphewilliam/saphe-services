import { ApolloServer } from 'apollo-server';
import { context } from './context';
import { environment } from './environment';
import { schema } from './schema';

const server = new ApolloServer({
  schema,
  context,
});

server
  .listen({
    port: environment.port,
  })
  .then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at: ${url}`);
  });
