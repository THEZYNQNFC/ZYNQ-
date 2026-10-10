import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { AppUser, UserRole } from '../types/auth';
import { Profile } from '../types/profile';
import { authService, formatAuthError } from '../services/authService';

export interface AuthContextType {
  currentUser: AppUser | null;
  user: AppUser | null; // Backwards-compatible alias for currentUser
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isFirebaseConfigured: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  enableDemoUser: (role: UserRole) => void;
  clearError: () => void;
  updateUserData: (data: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Optional demo users for sandbox preview if Firebase env vars are not configured
const DEMO_USER: AppUser = {
  userId: 'yyyImTnGbNQIL6qIQk4Jb2yIE1r1',
  email: 'demo@tapcard.in',
  name: 'Demo TapCard User',
  role: 'user',
  createdAt: '2026-01-15T10:00:00Z',
  photoURL: null,
  username: 'demouser',
};

const DEMO_ADMIN: AppUser = {
  userId: 'usr_admin_001',
  email: 'admin@tapcard.in',
  name: 'Platform Administrator',
  role: 'admin',
  createdAt: '2026-01-01T08:00:00Z',
  photoURL: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('tapcard_current_user');
      if (saved) return JSON.parse(saved) as AppUser;
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return Boolean(
        localStorage.getItem('tapcard_current_user') ||
        localStorage.getItem('tapcard_demo_mode') === 'true'
      );
    } catch {
      return false;
    }
  });

  // Persistent Firebase Authentication State Listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      if (!currentUser) {
        try {
          const saved = localStorage.getItem('tapcard_current_user');
          if (saved) {
            setCurrentUser(JSON.parse(saved) as AppUser);
            setIsDemoMode(true);
          }
        } catch {}
      }
      setLoading(false);
      return;
    }

    // Auto-authenticate with demo user if in demo mode and not signed in
    if (isDemoMode && !auth.currentUser) {
      authService.login('demo@tapcard.in', 'Demo123456!').catch(() => {});
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        if (!isDemoMode) {
          setCurrentUser(null);
        }
        setLoading(false);
        return;
      }

      try {
        let loadedUser: AppUser | null = null;

        if (db) {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            loadedUser = snap.data() as AppUser;
          }
        }

        // Check canonical profile document from Firestore FIRST
        let profileData: Partial<Profile> | null = null;
        if (db) {
          try {
            const profileSnap = await getDoc(doc(db, 'profiles', fbUser.uid));
            if (profileSnap.exists()) {
              profileData = profileSnap.data() as Profile;
            }
          } catch (profileErr) {
            console.warn('Notice reading profile from Firestore:', profileErr);
          }
        }

        const resolvedUser: AppUser = {
          userId: fbUser.uid,
          email: fbUser.email || '',
          name:
            profileData?.fullName ||
            loadedUser?.name ||
            fbUser.displayName ||
            fbUser.email?.split('@')[0] ||
            'User',
          role: loadedUser?.role || (fbUser.email === 'anshalkale99@gmail.com' ? 'admin' : 'user'),
          createdAt: loadedUser?.createdAt || new Date().toISOString(),
          photoURL:
            profileData?.profileImage ||
            loadedUser?.photoURL ||
            fbUser.photoURL ||
            null,
          username:
            profileData?.username ||
            loadedUser?.username ||
            fbUser.displayName?.toLowerCase().replace(/[^a-z0-9_-]/g, '') ||
            fbUser.email?.split('@')[0].replace(/[^a-z0-9_-]/g, '') ||
            'user',
        };

        setCurrentUser(resolvedUser);
        try {
          localStorage.setItem(`tapcard_user_${fbUser.uid}`, JSON.stringify(resolvedUser));
          localStorage.setItem('tapcard_current_user', JSON.stringify(resolvedUser));
          if (resolvedUser.username) {
            const cleanU = resolvedUser.username.replace(/^@+/, '').toLowerCase();
            localStorage.setItem('tapcard_last_saved_username', cleanU);
            localStorage.setItem('tapcard_last_saved_userid', fbUser.uid);
            const mapStr = localStorage.getItem('tapcard_username_to_userid_map') || '{}';
            const map = JSON.parse(mapStr);
            map[cleanU] = fbUser.uid;
            map[`@${cleanU}`] = fbUser.uid;
            localStorage.setItem('tapcard_username_to_userid_map', JSON.stringify(map));
          }
        } catch {}

        // Auto-seed canonical Firestore profile if not yet created
        if (db && !profileData) {
          try {
            const cleanU = (resolvedUser.username || fbUser.email?.split('@')[0] || 'user').replace(/^@+/, '').toLowerCase();
            const initProfile = {
              userId: fbUser.uid,
              username: cleanU,
              fullName: resolvedUser.name || 'Anshal Kale',
              email: fbUser.email || '',
              profileImage: resolvedUser.photoURL || '',
              title: 'Digital Business Card',
              company: '',
              bio: '',
              phone: '',
              whatsapp: '',
              website: '',
              location: '',
              theme: 'modern-slate',
              socialLinks: {},
              links: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'profiles', fbUser.uid), initProfile, { merge: true });
            localStorage.setItem(`tapcard_profile_${fbUser.uid}`, JSON.stringify(initProfile));
            localStorage.setItem('tapcard_current_profile', JSON.stringify(initProfile));
          } catch (initProfileErr) {
            console.warn('Notice seeding initial Firestore profile document:', initProfileErr);
          }
        }
      } catch (err: unknown) {
        console.warn('Error fetching Firestore document; falling back to authenticated Firebase profile:', err);
        let cachedUser: AppUser | null = null;
        let cachedProfile: Partial<Profile> | null = null;
        try {
          const cached = localStorage.getItem(`tapcard_user_${fbUser.uid}`);
          if (cached) cachedUser = JSON.parse(cached) as AppUser;
          const cachedP = localStorage.getItem(`tapcard_profile_${fbUser.uid}`);
          if (cachedP) cachedProfile = JSON.parse(cachedP) as Profile;
        } catch {}

        const fallbackUser: AppUser = cachedUser || {
          userId: fbUser.uid,
          email: fbUser.email || '',
          name:
            cachedProfile?.fullName ||
            fbUser.displayName ||
            fbUser.email?.split('@')[0] ||
            'User',
          role: fbUser.email === 'anshalkale99@gmail.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
          photoURL: cachedProfile?.profileImage || fbUser.photoURL || null,
          username:
            cachedProfile?.username ||
            fbUser.displayName?.toLowerCase().replace(/[^a-z0-9_-]/g, '') ||
            fbUser.email?.split('@')[0].replace(/[^a-z0-9_-]/g, ''),
        };

        if (cachedProfile) {
          if (cachedProfile.fullName) fallbackUser.name = cachedProfile.fullName;
          if (cachedProfile.username) fallbackUser.username = cachedProfile.username;
          if (cachedProfile.profileImage) fallbackUser.photoURL = cachedProfile.profileImage;
        }

        setCurrentUser(fallbackUser);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const login = useCallback(async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        throw new Error(
          'Firebase credentials are not configured. Please add VITE_FIREBASE_* variables to your environment.'
        );
      }
      const loggedUser = await authService.login(email, pass);
      setCurrentUser(loggedUser);
      setIsDemoMode(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : formatAuthError(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        throw new Error(
          'Firebase credentials are not configured. Please add VITE_FIREBASE_* variables to your environment.'
        );
      }
      const newUser = await authService.signup(name, email, pass);
      setCurrentUser(newUser);
      setIsDemoMode(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : formatAuthError(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        throw new Error(
          'Firebase credentials are not configured. Please add VITE_FIREBASE_* variables to your environment.'
        );
      }
      const gUser = await authService.loginWithGoogle();
      setCurrentUser(gUser);
      setIsDemoMode(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : formatAuthError(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        await authService.logout();
      }
      setCurrentUser(null);
      setIsDemoMode(false);
      try {
        localStorage.removeItem('tapcard_current_user');
        localStorage.removeItem('tapcard_demo_mode');
      } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setError(null);
    if (!isFirebaseConfigured) {
      throw new Error(
        'Firebase credentials are not configured. Please add VITE_FIREBASE_* variables to your environment.'
      );
    }
    await authService.resetPassword(email);
  }, []);

  const enableDemoUser = useCallback((role: UserRole) => {
    setIsDemoMode(true);
    try {
      localStorage.setItem('tapcard_demo_mode', 'true');
    } catch {}

    if (role === 'admin') {
      setCurrentUser(DEMO_ADMIN);
      try {
        localStorage.setItem('tapcard_current_user', JSON.stringify(DEMO_ADMIN));
      } catch {}
    } else {
      let baseUser: AppUser = { ...DEMO_USER };
      try {
        const cachedUserStr =
          localStorage.getItem('tapcard_current_user') ||
          localStorage.getItem('tapcard_user_usr_demo_101');
        if (cachedUserStr) {
          const parsed = JSON.parse(cachedUserStr);
          baseUser = { ...baseUser, ...parsed };
        }
        const cachedPStr =
          localStorage.getItem('tapcard_current_profile') ||
          localStorage.getItem('tapcard_profile_usr_demo_101');
        if (cachedPStr) {
          const p = JSON.parse(cachedPStr);
          if (p.fullName) baseUser.name = p.fullName;
          if (p.username) baseUser.username = p.username;
          if (p.profileImage !== undefined) baseUser.photoURL = p.profileImage || null;
        }
      } catch {}

      setCurrentUser(baseUser);
      try {
        localStorage.setItem('tapcard_current_user', JSON.stringify(baseUser));
        localStorage.setItem('tapcard_user_usr_demo_101', JSON.stringify(baseUser));
      } catch {}
    }

    setError(null);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const updateUserData = useCallback((data: Partial<AppUser>) => {
    setCurrentUser((prev) => {
      const active = prev || DEMO_USER;
      const updated = { ...active, ...data };
      try {
        localStorage.setItem(`tapcard_user_${updated.userId}`, JSON.stringify(updated));
        localStorage.setItem('tapcard_current_user', JSON.stringify(updated));
        if (updated.username) {
          localStorage.setItem('tapcard_last_saved_username', updated.username);
        }
      } catch {}
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser, // alias
        loading,
        error,
        isAuthenticated: Boolean(currentUser),
        isAdmin: currentUser?.role === 'admin' || currentUser?.email === 'anshalkale99@gmail.com',
        isFirebaseConfigured,
        isDemoMode,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        enableDemoUser,
        clearError,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export default useAuth;
