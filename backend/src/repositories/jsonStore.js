import { promises as fs } from 'node:fs';
import path from 'node:path';

export function createJsonStore({ dataFile, seedFile }) {
  let cache = null;
  let queue = Promise.resolve();

  async function persist(data) {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    const tempFile = `${dataFile}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2));
    await fs.rename(tempFile, dataFile);
  }

  async function load() {
    if (cache) return cache;
    try {
      cache = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      cache = JSON.parse(await fs.readFile(seedFile, 'utf8'));
      await persist(cache);
    }
    return cache;
  }

  async function read() {
    return structuredClone(await load());
  }

  function transaction(mutate) {
    const run = queue.then(async () => {
      const draft = structuredClone(await load());
      const result = await mutate(draft);
      await persist(draft);
      cache = draft;
      return result;
    });
    queue = run.catch(() => {});
    return run;
  }

  return { read, transaction };
}
