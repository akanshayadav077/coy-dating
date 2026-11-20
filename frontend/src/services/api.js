const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Check your connection and try again.');
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.error?.code ?? 'UNKNOWN',
      body?.error?.message ?? 'Something went wrong. Please try again.',
    );
  }
  return body;
}

export const api = {
  getMe: () => request('/me'),
  getFeed: (limit) => request(`/feed?limit=${limit}`),
  swipe: (targetId, action) => request('/swipe', { method: 'POST', body: JSON.stringify({ targetId, action }) }),
  getMatches: () => request('/matches'),
  getMessages: (matchId) => request(`/matches/${encodeURIComponent(matchId)}/messages`),
  sendMessage: (matchId, text) =>
    request(`/matches/${encodeURIComponent(matchId)}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
  getAccount: () => request('/account'),
  login: (phone) => request('/account/login', { method: 'POST', body: JSON.stringify({ phone }) }),
  updateAccount: (changes) => request('/account', { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteAccount: () => request('/account', { method: 'DELETE' }),
  resetDemo: () => request('/demo/reset', { method: 'POST' }),
};
