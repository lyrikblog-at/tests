import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface AppConfig {
  targetUrl: string;
  requestTimeoutMs: number;
  database: DatabaseConfig;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectionTimeoutMillis: number;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config: AppConfig = {
  targetUrl: optionalEnv('TARGET_URL', 'https://www.lyrikblog.at'),
  requestTimeoutMs: parseInt(optionalEnv('REQUEST_TIMEOUT_MS', '15000'), 10),
  database: {
    host: optionalEnv('DB_HOST', 'localhost'),
    port: parseInt(optionalEnv('DB_PORT', '5432'), 10),
    database: optionalEnv('DB_NAME', 'uptime_monitor'),
    user: optionalEnv('DB_USER', 'postgres'),
    password: requireEnv('DB_PASSWORD'),
    connectionTimeoutMillis: parseInt(optionalEnv('DB_CONNECT_TIMEOUT_MS', '5000'), 10),
  },
};
