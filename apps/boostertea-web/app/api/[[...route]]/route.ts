import { handle } from 'hono/vercel';
import { honoApp } from '../../../src/api/index';

// Export the Hono app wrapper for Vercel Serverless environment
export const GET = handle(honoApp);
export const POST = handle(honoApp);
export const PUT = handle(honoApp);
export const DELETE = handle(honoApp);
export const OPTIONS = handle(honoApp);
