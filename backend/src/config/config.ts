import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3002'),
  DB_HOST: z.string().default('mysql'),
  DB_PORT: z.string().transform(Number).default('3306'),
  DB_NAME: z.string().default('jurassic_park'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default('root'),
  JWT_SECRET: z.string().default('your_jwt_secret'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  RATE_LIMIT_WINDOW: z.string().default('15'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  TEST_DB_NAME: z.string().default('jurassic_park_test'),
  SWAGGER_API_URL: z.string().default('/api-docs'),
  DOCKER_NODE_VERSION: z.string().default('20-alpine'),
});

const env = envSchema.parse(process.env);

export const config = env;
