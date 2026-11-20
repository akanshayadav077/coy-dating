export const createEmptyAccount = () => ({
  phone: null,
  firstName: null,
  email: null,
  alertsEnabled: true,
  referralCode: null,
});

export const get = (db) => db.account ?? createEmptyAccount();

export function save(db, account) {
  db.account = account;
  return account;
}
