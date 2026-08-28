const AUTH_TOKEN_KEY = "pastizza_admin_auth_token";

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin";

export const login = (username: string, password: string): boolean => {
  if (username.trim() !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return false;
  }

  // Create a simple browser-persistent token.
  // For production, this should come from your backend/auth provider.
  const token = btoa(`${VALID_USERNAME}:${VALID_PASSWORD}:${Date.now()}`);

  localStorage.setItem(AUTH_TOKEN_KEY, token);

  return true;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();

  return Boolean(token);
};
