import { promises as fs } from 'node:fs';

export function createDemoService({ store, seedFile }) {
  return {
    async resetDemo() {
      const seed = JSON.parse(await fs.readFile(seedFile, 'utf8'));
      return store.transaction((db) => {
        db.users = seed.users;
        db.likes = seed.likes;
        db.swipes = [];
        db.matches = [];
        db.messages = [];
        return { reset: true };
      });
    },
  };
}
