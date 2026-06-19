import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, clearSession, getStoredToken, getStoredUser, mapUser, persistSession } from '../lib/api';

const Ctx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await apiRequest('/auth/me', { token });
        if (!ignore) {
          const normalized = mapUser(me);
          setUser(normalized);
          persistSession({ token, user: normalized });
        }
      } catch {
        if (!ignore) {
          clearSession();
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      ignore = true;
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      const normalized = mapUser(data.user);
      setToken(data.token);
      setUser(normalized);
      persistSession({ token: data.token, user: normalized });
      return { ok: true };
    } catch (error) {
      return { ok: false, msg: error.message };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: {
          name,
          email,
          password,
          password_confirmation: password,
          role,
        },
      });

      const normalized = mapUser(data.user);
      setToken(data.token);
      setUser(normalized);
      persistSession({ token: data.token, user: normalized });
      return { ok: true };
    } catch (error) {
      return { ok: false, msg: error.message };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiRequest('/auth/logout', { method: 'POST', token });
      }
    } catch {
    } finally {
      clearSession();
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      persistSession({ token, user: next });
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
