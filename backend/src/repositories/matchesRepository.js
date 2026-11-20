export const findForUser = (db, userId) => db.matches.filter((match) => match.userId === userId);

export function add(db, match) {
  db.matches.push(match);
  return match;
}

export function removeForUser(db, userId) {
  db.matches = db.matches.filter((match) => match.userId !== userId);
}
