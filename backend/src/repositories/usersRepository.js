export const findAll = (db) => db.users;

export const findById = (db, userId) => db.users.find((user) => user.id === userId) ?? null;
