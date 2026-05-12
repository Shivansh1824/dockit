import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingGoogleProfile, setPendingGoogleProfile] = useState(null);
  const syncedRef = useRef(false);

  // Helper to persist auth state
  const saveAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setPendingGoogleProfile(null);
    if (authToken) localStorage.setItem('dockit_token', authToken);
    if (userData) localStorage.setItem('dockit_user', JSON.stringify(userData));
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setPendingGoogleProfile(null);
    localStorage.removeItem('dockit_token');
    localStorage.removeItem('dockit_user');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Prioritize local session
        const storedToken = localStorage.getItem('dockit_token');
        const storedUser = localStorage.getItem('dockit_user');
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          // If we have a local session, we're good for now
          setLoading(false);
        }

        // 2. Check Supabase for Google sessions (only if not already synced)
        const { data: { session } } = await supabase.auth.getSession();
        if (session && !syncedRef.current && !storedToken) {
          syncedRef.current = true;
          await syncGoogleSession(session.access_token);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 3. Subscription for global auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session && !syncedRef.current) {
        // Only sync if we don't already have a local session matching this email
        const storedUser = localStorage.getItem('dockit_user');
        if (!storedUser || JSON.parse(storedUser).email !== session.user.email) {
            syncedRef.current = true;
            await syncGoogleSession(session.access_token);
        }
      } else if (event === 'SIGNED_OUT') {
        clearAuth();
        syncedRef.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncGoogleSession = async (accessToken) => {
    try {
      const { data } = await api.post('/auth/google-sync', { accessToken });
      if (data.needsOnboarding) {
        setPendingGoogleProfile({ ...data.profile, accessToken });
      } else {
        saveAuth(data.user, data.token);
      }
    } catch (err) {
      console.error('Google sync failed:', err);
      syncedRef.current = false;
    }
  };

  const login = (userData, authToken) => {
    saveAuth(userData, authToken);
  };

  const logout = async () => {
    clearAuth();
    syncedRef.current = false;
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
      pendingGoogleProfile,
      setPendingGoogleProfile,
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
