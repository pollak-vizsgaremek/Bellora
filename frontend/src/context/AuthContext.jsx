import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      const cachedUser = authService.getCurrentUser();
      if (cachedUser) {
        setUser(cachedUser);
        // Fetch fresh user data from server to keep profile_image etc. in sync
        try {
          const { default: api } = await import('../services/api');
          const response = await api.get('/auth/me');
          const freshUser = response.data.user;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (e) {
          // token invalid or server down — keep cached user
        }
      }
      setLoading(false);
    };
    initUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await authService.register(username, email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    setUser(data.user);
    return data;
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
