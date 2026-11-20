import * as usersRepository from '../repositories/usersRepository.js';
import * as swipesRepository from '../repositories/swipesRepository.js';

export function createFeedService({ store, currentUserId }) {
  return {
    async getFeed(limit) {
      const db = await store.read();
      const swipedIds = swipesRepository.findTargetIds(db, currentUserId);
      const unseen = usersRepository
        .findAll(db)
        .filter((user) => user.id !== currentUserId && !swipedIds.has(user.id));
      const profiles = unseen.slice(0, limit);
      return { profiles, remaining: unseen.length - profiles.length };
    },
  };
}
