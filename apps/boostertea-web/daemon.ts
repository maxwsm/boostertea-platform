import { startBot } from './src/api/bot';
import { startWorker } from './src/api/worker';

console.log('🤖🚀 [WSM Ecosystem] Starting dedicated PM2 Daemon for Telegram Bot & BullMQ Workers...');

try {
  startBot();
  startWorker();
} catch (e) {
  console.error('[DAEMON ERROR]', e);
}
