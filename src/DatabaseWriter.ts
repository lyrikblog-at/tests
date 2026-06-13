import { Pool, PoolClient } from 'pg';
import { DatabaseConfig } from '../config/params';
import { CheckResult } from './WebsiteChecker';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS website_checks (
    id              SERIAL PRIMARY KEY,
    check_date      DATE        NOT NULL,
    check_hour      SMALLINT    NOT NULL,
    check_timestamp TIMESTAMPTZ NOT NULL,
    url             VARCHAR(255) NOT NULL,
    is_online       BOOLEAN     NOT NULL,
    status_code     SMALLINT,
    response_time_ms INTEGER,
    error_message   TEXT
  );
`;

export class DatabaseWriter {
  private readonly pool: Pool;

  constructor(dbConfig: DatabaseConfig) {
    this.pool = new Pool(dbConfig);
  }

  async initialize(): Promise<void> {
    await this.pool.query(CREATE_TABLE_SQL);
  }

  async writeResult(result: CheckResult): Promise<void> {
    const checkDate = result.checkedAt.toISOString().split('T')[0];
    const checkHour = result.checkedAt.getHours();

    await this.pool.query(
      `INSERT INTO website_checks
        (check_date, check_hour, check_timestamp, url, is_online, status_code, response_time_ms, error_message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        checkDate,
        checkHour,
        result.checkedAt,
        result.url,
        result.isOnline,
        result.statusCode,
        result.responseTimeMs,
        result.errorMessage,
      ]
    );
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
