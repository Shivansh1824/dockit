import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Check for local session first
      const storedToken = localStorage.getItem('dockit_token');
      const storedUser = localStorage.getItem('dockit_user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('dockit_token');
          localStorage.removeItem('dockit_user');
        }
      }

      // 2. Check for Supabase session (Google Login)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && !storedToken) {
        try {
          const { data } = await api.post('/auth/google-sync', {
            accessToken: session.access_token
          });
          login(data.user, data.token);
        } catch (err) {
          console.error('Failed to sync Google account:', err);
        }
      }

      // 3. Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data } = await api.post('/auth/google-sync', {
              accessToken: session.access_token
            });
            login(data.user, data.token);
          } catch (err) {
            console.error('Auth state change sync failed:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      });

      setLoading(false);
      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('dockit_token', authToken);
    localStorage.setItem('dockit_user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dockit_token');
    localStorage.removeItem('dockit_user');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      loading,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
