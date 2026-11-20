export const findTargetIds = (db, userId) =>
  new Set(db.swipes.filter((swipe) => swipe.userId === userId).map((swipe) => swipe.targetId));

export const hasSwiped = (db, userId, targetId) =>
  db.swipes.some((swipe) => swipe.userId === userId && swipe.targetId === targetId);

export function add(db, swipe) {
  db.swipes.push(swipe);
  return swipe;
}

export function removeForUser(db, userId) {
  db.swipes = db.swipes.filter((swipe) => swipe.userId !== userId);
}
