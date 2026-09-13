import { config } from './config/params';
import { UptimeMonitor } from './src/UptimeMonitor';

function resolveHeadless(): boolean {
  if (process.argv.includes('--no-headless')) return false;
  if (process.argv.includes('--headless')) return true;
  return config.headless;
}

async function main(): Promise<void> {
  const headless = resolveHeadless();
  const monitor = new UptimeMonitor({ ...config, headless });
  console.log(`Mode    : ${headless ? 'headless' : 'non-headless (browser visible)'}`);

  console.log(`Checking ${config.targetUrl}...`);

  const result = await monitor.run();

  console.log(`Status  : ${result.isOnline ? 'ONLINE' : 'OFFLINE'}`);
  console.log(`HTTP    : ${result.statusCode ?? 'N/A'}`);
  console.log(`Time    : ${result.responseTimeMs ?? 'N/A'} ms`);
  console.log(`Date    : ${result.checkedAt.toISOString().split('T')[0]}`);
  console.log(`Hour    : ${result.checkedAt.getHours()}`);
  if (result.errorMessage) {
    console.log(`Error   : ${result.errorMessage}`);
  }
  console.log('Result written to database.');
}

main().catch((err) => {
  console.error('Monitor failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
