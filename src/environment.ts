export interface Environment {
  env: string;
  nodeEnv: string;
  port: number;
}

export const environment: Environment = {
  env: process.env.ENVIRONMENT ?? 'no_environment_found',
  nodeEnv: process.env.NODE_ENV ?? 'no_node_environment_found',
  port: parseInt(process.env.PORT ?? '5000'),
};
