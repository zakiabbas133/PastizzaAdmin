import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'dashboard_auth_token';
const IS_AUTHENTICATED_KEY = 'isAuthenticated';
// Very basic token generator for demo purposes.
// Replace with a real JWT (or whatever your backend returns) once
// you wire up an actual authentication API.
const generateToken = (username) => {
  const payload = {
    username,
    issuedAt: Date.now(),
  };
  return btoa(JSON.stringify(payload));
};

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token));
    return Boolean(payload?.username);
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  useEffect(() => {
    setIsAuth(isTokenValid(token));
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (username === 'admin' && password === 'admin') {
      const token = generateToken(username);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setIsAuth(true);

      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid username or password.',
    };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(IS_AUTHENTICATED_KEY);

    setIsAuth(false);
  };

  const value = useMemo(
    () => ({
      isAuth,
      loading,
      login,
      logout,
    }),
    [isAuth, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
};