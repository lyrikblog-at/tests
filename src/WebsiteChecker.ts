import { chromium, Browser, Page } from 'playwright';

export interface CheckResult {
  url: string;
  isOnline: boolean;
  statusCode: number | null;
  responseTimeMs: number | null;
  errorMessage: string | null;
  checkedAt: Date;
}

export class WebsiteChecker {
  private readonly url: string;
  private readonly timeoutMs: number;
  private browser: Browser | null = null;

  constructor(url: string, timeoutMs: number) {
    this.url = url;
    this.timeoutMs = timeoutMs;
  }

  async open(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async check(): Promise<CheckResult> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call open() first.');
    }

    const checkedAt = new Date();
    const page: Page = await this.browser.newPage();

    let statusCode: number | null = null;
    const start = Date.now();

    try {
      page.on('response', (response) => {
        if (response.url() === this.url || response.url() === `${this.url}/`) {
          statusCode = response.status();
        }
      });

      await page.goto(this.url, {
        timeout: this.timeoutMs,
        waitUntil: 'domcontentloaded',
      });

      const responseTimeMs = Date.now() - start;
      const isOnline = statusCode !== null ? statusCode < 400 : true;

      return {
        url: this.url,
        isOnline,
        statusCode,
        responseTimeMs,
        errorMessage: null,
        checkedAt,
      };
    } catch (error) {
      const responseTimeMs = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        url: this.url,
        isOnline: false,
        statusCode,
        responseTimeMs,
        errorMessage,
        checkedAt,
      };
    } finally {
      await page.close();
    }
  }
}
