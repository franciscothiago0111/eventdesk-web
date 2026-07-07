const TOKEN_KEY = 'eventdesk.accessToken';

// MVP: token lives in localStorage (SPA, organizer-only dashboard, no XSS-sensitive
// third-party scripts). Revisit as an httpOnly cookie if that changes.
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
