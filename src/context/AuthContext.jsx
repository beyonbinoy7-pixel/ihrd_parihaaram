import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiAuth } from '../services/api.service.js';
import { TOKEN_KEY, USER_KEY } from '../services/apiClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);

  // Initialize and verify session against real backend
  const verifySession = useCallback(async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiAuth.getMe();
      if (res && res.success && res.data) {
        setCurrentUser(res.data);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        setBackendOffline(false);
      }
    } catch (err) {
      if (err.isOffline) {
        setBackendOffline(true);
      } else if (err.status === 401 || err.status === 403) {
        // Token invalid or expired
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();

    // Listen for global unauthorized events
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('parihaaram:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('parihaaram:unauthorized', handleUnauthorized);
  }, [verifySession]);

  const login = async (username, password) => {
    try {
      const res = await apiAuth.login(username, password);
      if (res && res.success && res.data) {
        const { accessToken, user } = res.data;
        setToken(accessToken);
        setCurrentUser(user);
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        sessionStorage.setItem(TOKEN_KEY, accessToken);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        setBackendOffline(false);
        return { success: true, user };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (error) {
      if (error.isOffline) {
        setBackendOffline(true);
      }
      return {
        success: false,
        message: error.message || 'Authentication error',
        isOffline: !!error.isOffline
      };
    }
  };

  const register = async (studentData) => {
    try {
      const res = await apiAuth.register(studentData);
      if (res && res.success && res.data) {
        const { accessToken, user } = res.data;
        setToken(accessToken);
        setCurrentUser(user);
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setBackendOffline(false);
        return { success: true, user };
      }
      return { success: false, message: res?.message || 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
        isOffline: !!error.isOffline
      };
    }
  };

  const logout = () => {
    apiAuth.logout();
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const isStudent = currentUser?.role === 'STUDENT';
  const isCollegeAdmin = currentUser?.role === 'COLLEGE_ADMIN';
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAdmin = isCollegeAdmin || isSuperAdmin;
  const isAuthenticated = !!token && !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        backendOffline,
        isAuthenticated,
        isStudent,
        isAdmin,
        isCollegeAdmin,
        isSuperAdmin,
        login,
        register,
        logout,
        verifySession,
        setBackendOffline
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      token: null,
      loading: false,
      backendOffline: false,
      isAuthenticated: false,
      isStudent: false,
      isAdmin: false,
      login: async () => ({ success: false, message: 'Auth context unavailable' }),
      logout: () => {},
      register: async () => ({ success: false, message: 'Auth context unavailable' })
    };
  }
  return context;
}
