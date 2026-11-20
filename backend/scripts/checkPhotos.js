import { readFile } from 'node:fs/promises';
import { config } from '../src/config/index.js';

const seed = JSON.parse(await readFile(config.seedFile, 'utf8'));

async function isReachable(user) {
  try {
    const response = await fetch(user.photoUrl, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

const results = await Promise.all(seed.users.map(async (user) => ({ user, ok: await isReachable(user) })));
const broken = results.filter(({ ok }) => !ok);

console.log(`${results.length - broken.length}/${results.length} photos load.`);
broken.forEach(({ user }) => console.log(`BROKEN ${user.id} ${user.photoUrl}`));
process.exitCode = broken.length ? 1 : 0;
