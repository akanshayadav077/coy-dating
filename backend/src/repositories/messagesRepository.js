export function findByMatchId(db, matchId) {
  return (db.messages ?? []).filter((message) => message.matchId === matchId);
}

export function findLatestByMatchId(db, matchId) {
  const list = findByMatchId(db, matchId);
  return list.length ? list[list.length - 1] : null;
}

export function add(db, message) {
  if (!Array.isArray(db.messages)) db.messages = [];
  db.messages.push(message);
  return message;
}
