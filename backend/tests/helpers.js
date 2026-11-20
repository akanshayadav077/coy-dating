import { once } from 'node:events';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp } from '../src/app.js';
import { config } from '../src/config/index.js';

const seed = JSON.parse(await readFile(config.seedFile, 'utf8'));

export const likerId = seed.likes[0].fromUserId;
export const nonLikerId = seed.users.find(
  (user) => user.id !== config.currentUserId && !seed.likes.some((like) => like.fromUserId === user.id),
).id;

export async function startServer(dataFile) {
  const server = createApp({ dataFile }).listen(0);
  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const request = async (method, route, body) => {
    const response = await fetch(`${baseUrl}${route}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, body: response.status === 204 ? null : await response.json() };
  };

  return {
    get: (route) => request('GET', route),
    post: (route, body) => request('POST', route, body),
    patch: (route, body) => request('PATCH', route, body),
    delete: (route) => request('DELETE', route),
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

export async function withApi(testBody) {
  const directory = await mkdtemp(path.join(tmpdir(), 'coy-'));
  const dataFile = path.join(directory, 'db.json');
  const api = await startServer(dataFile);
  try {
    await testBody(api, dataFile);
  } finally {
    await api.close();
    await rm(directory, { recursive: true, force: true });
  }
}
