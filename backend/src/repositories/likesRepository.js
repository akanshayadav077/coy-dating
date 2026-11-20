export const exists = (db, fromUserId, toUserId) =>
  db.likes.some((like) => like.fromUserId === fromUserId && like.toUserId === toUserId);
