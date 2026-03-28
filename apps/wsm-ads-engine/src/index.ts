import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'wsm-ads-engine',
    engine: 'Google Gemini 1.5 Pro / Vertex AI',
  });
});

const port = Number(process.env.PORT) || 3004;

console.log(`🤖 Starting WSM Ads Automation Engine on port ${port}...`);

// Initialize BullMQ Workers natively within the app instance
import './queue.js';

serve({
  fetch: app.fetch,
  port,
});
