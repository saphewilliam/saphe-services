import { environment } from '@lib/environment';
import { ApolloServer } from 'apollo-server';
import { createContext } from './context';
import { schema } from './schema';

const server = new ApolloServer({
  schema,
  context: createContext,
});

server
  .listen({
    port: environment.port,
  })
  .then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at: ${url}`);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('Error launching server:', err);
  });
