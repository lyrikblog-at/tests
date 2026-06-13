import { AppConfig } from '../config/params';
import { WebsiteChecker, CheckResult } from './WebsiteChecker';
import { DatabaseWriter } from './DatabaseWriter';

export class UptimeMonitor {
  private readonly checker: WebsiteChecker;
  private readonly writer: DatabaseWriter;

  constructor(config: AppConfig) {
    this.checker = new WebsiteChecker(config.targetUrl, config.requestTimeoutMs);
    this.writer = new DatabaseWriter(config.database);
  }

  async run(): Promise<CheckResult> {
    await this.writer.initialize();
    await this.checker.open();

    try {
      const result = await this.checker.check();
      await this.writer.writeResult(result);
      return result;
    } finally {
      await this.checker.close();
      await this.writer.close();
    }
  }
}
