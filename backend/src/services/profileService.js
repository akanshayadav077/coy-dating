import * as usersRepository from '../repositories/usersRepository.js';
import * as accountRepository from '../repositories/accountRepository.js';

export function createProfileService({ store, currentUserId }) {
  return {
    async getCurrentUser() {
      const db = await store.read();
      const user = usersRepository.findById(db, currentUserId);
      const { firstName } = accountRepository.get(db);
      return firstName ? { ...user, name: firstName } : user;
    },
  };
}
