import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/AppError.js';
import { toMatchView } from '../utils/toMatchView.js';
import * as usersRepository from '../repositories/usersRepository.js';
import * as swipesRepository from '../repositories/swipesRepository.js';
import * as likesRepository from '../repositories/likesRepository.js';
import * as matchesRepository from '../repositories/matchesRepository.js';

export function createSwipeService({ store, currentUserId }) {
  function assertSwipeAllowed(db, targetId) {
    if (targetId === currentUserId) {
      throw new AppError(400, 'INVALID_TARGET', 'You cannot swipe on yourself.');
    }
    if (!usersRepository.findById(db, targetId)) {
      throw new AppError(404, 'PROFILE_NOT_FOUND', 'That profile does not exist.');
    }
    if (swipesRepository.hasSwiped(db, currentUserId, targetId)) {
      throw new AppError(409, 'ALREADY_SWIPED', 'You have already swiped on this profile.');
    }
  }

  return {
    swipe({ targetId, action }) {
      return store.transaction((db) => {
        assertSwipeAllowed(db, targetId);

        const createdAt = new Date().toISOString();
        swipesRepository.add(db, { userId: currentUserId, targetId, action, createdAt });

        const isMutualLike = action === 'like' && likesRepository.exists(db, targetId, currentUserId);
        if (!isMutualLike) return { match: null };

        const match = matchesRepository.add(db, {
          id: `m_${randomUUID()}`,
          userId: currentUserId,
          matchedUserId: targetId,
          createdAt,
        });
        return { match: toMatchView(match, usersRepository.findById(db, targetId)) };
      });
    },
  };
}
