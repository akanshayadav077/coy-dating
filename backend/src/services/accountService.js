import { AppError } from '../utils/AppError.js';
import { generateReferralCode } from '../utils/referralCode.js';
import * as accountRepository from '../repositories/accountRepository.js';
import * as swipesRepository from '../repositories/swipesRepository.js';
import * as matchesRepository from '../repositories/matchesRepository.js';

export function createAccountService({ store, currentUserId }) {
  return {
    async getAccount() {
      return accountRepository.get(await store.read());
    },

    login(phone) {
      return store.transaction((db) => {
        const current = accountRepository.get(db);
        if (current.phone === phone) return current;
        return accountRepository.save(db, {
          ...accountRepository.createEmptyAccount(),
          phone,
          referralCode: generateReferralCode(),
        });
      });
    },

    update(changes) {
      return store.transaction((db) => {
        const current = accountRepository.get(db);
        if (!current.phone) throw new AppError(401, 'NOT_LOGGED_IN', 'Log in before changing your account.');
        return accountRepository.save(db, { ...current, ...changes });
      });
    },

    remove() {
      return store.transaction((db) => {
        accountRepository.save(db, accountRepository.createEmptyAccount());
        swipesRepository.removeForUser(db, currentUserId);
        matchesRepository.removeForUser(db, currentUserId);
      });
    },
  };
}
