import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  currentUserId: 'u_000',
  dataFile: path.join(backendRoot, 'data', 'db.json'),
  seedFile: path.join(backendRoot, 'data', 'db.seed.json'),
  swipeActions: ['like', 'pass'],
  feed: { defaultLimit: 20, maxLimit: 50 },
};
