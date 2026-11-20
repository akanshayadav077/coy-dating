import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { session } from '../services/demoAuth.js';

export const AccountContext = createContext(null);

const LOGGED_OUT = { status: 'loggedOut', account: null, error: null };

export function AccountProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', account: null, error: null });
  const [attempt, setAttempt] = useState(0);

  const applyAccount = useCallback((account) => {
    if (!account.phone) {
      session.clear();
      setState(LOGGED_OUT);
      return;
    }
    setState({ status: account.firstName ? 'ready' : 'needsName', account, error: null });
  }, []);

  useEffect(() => {
    if (!session.isActive()) {
      setState(LOGGED_OUT);
      return undefined;
    }
    let isActive = true;
    setState({ status: 'loading', account: null, error: null });
    api
      .getAccount()
      .then((account) => isActive && applyAccount(account))
      .catch((error) => isActive && setState({ status: 'error', account: null, error }));
    return () => {
      isActive = false;
    };
  }, [attempt, applyAccount]);

  const login = useCallback(
    async (phone) => {
      const account = await api.login(phone);
      session.start();
      applyAccount(account);
    },
    [applyAccount],
  );

  const update = useCallback(async (changes) => applyAccount(await api.updateAccount(changes)), [applyAccount]);

  const logout = useCallback(() => {
    session.clear();
    setState(LOGGED_OUT);
  }, []);

  const remove = useCallback(async () => {
    await api.deleteAccount();
    session.clear();
    setState(LOGGED_OUT);
  }, []);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  const value = useMemo(
    () => ({ ...state, login, update, logout, remove, retry }),
    [state, login, update, logout, remove, retry],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
