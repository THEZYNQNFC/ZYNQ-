import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { AppUser } from '../types/auth';

/**
 * Transforms Firebase authentication error codes into clear, user-friendly messages.
 */
export function formatAuthError(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Your email or password is incorrect.';
      case 'auth/user-not-found':
        return 'No account was found with this email address.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Access is temporarily locked. Please try again later or reset your password.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled before completion.';
      case 'auth/popup-blocked':
        return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/unauthorized-domain':
        return `Domain not authorized for Google Sign-In. Please add "${typeof window !== 'undefined' ? window.location.hostname : 'this domain'}" to Authorized Domains in your Firebase Console (Authentication > Settings > Authorized domains).`;
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/operation-not-allowed':
        return 'This sign-in provider is not enabled in Firebase Console. Please enable Email/Password and Google in Firebase Console > Authentication > Sign-in method.';
      case 'auth/requires-recent-login':
        return 'This action requires recent authentication. Please sign in again.';
      default:
        return authError.message?.replace(/^Firebase:\s*/, '') || 'Authentication failed. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export const authService = {
  isReady(): boolean {
    return isFirebaseConfigured && auth !== null;
  },

  async login(email: string, pass: string): Promise<AppUser> {
    if (!this.isReady() || !auth) {
      throw new Error(
        'Firebase is not configured. Please add your VITE_FIREBASE_* credentials to your environment variables.'
      );
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const uid = credential.user.uid;
      return await this.fetchOrCreateUserData(
        uid,
        credential.user.email || email.trim(),
        credential.user.displayName || '',
        credential.user.photoURL
      );
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  },

  async signup(name: string, email: string, pass: string): Promise<AppUser> {
    if (!this.isReady() || !auth) {
      throw new Error(
        'Firebase is not configured. Please add your VITE_FIREBASE_* credentials to your environment variables.'
      );
    }

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    let uid: string;
    let photoURL: string | null = null;

    try {
      const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
      uid = credential.user.uid;
      photoURL = credential.user.photoURL;

      if (trimmedName) {
        await updateProfile(credential.user, { displayName: trimmedName });
      }
    } catch (err: any) {
      // If the Auth account already exists (e.g. from a prior attempt), sign in seamlessly
      if (err?.code === 'auth/email-already-in-use') {
        try {
          const loginCred = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
          uid = loginCred.user.uid;
          photoURL = loginCred.user.photoURL;
        } catch {
          throw new Error(formatAuthError(err));
        }
      } else {
        throw new Error(formatAuthError(err));
      }
    }

    const userData: AppUser = {
      userId: uid,
      email: trimmedEmail,
      name: trimmedName || trimmedEmail.split('@')[0],
      role: trimmedEmail === 'anshalkale99@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      photoURL: photoURL || null,
      onboardingCompleted: false,
    };

    // Attempt to persist the user document to Firestore if available
    if (db) {
      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, userData);
      } catch (err) {
        console.warn('Firestore write deferred or blocked by security rules; preserving authenticated session in memory:', err);
      }
    }

    try {
      localStorage.setItem(`tapcard_user_${uid}`, JSON.stringify(userData));
    } catch {}

    return userData;
  },

  async loginWithGoogle(): Promise<AppUser> {
    if (!this.isReady() || !auth) {
      throw new Error(
        'Firebase is not configured. Please add your VITE_FIREBASE_* credentials to your environment variables.'
      );
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(auth, provider);
      const uid = credential.user.uid;

      return await this.fetchOrCreateUserData(
        uid,
        credential.user.email || '',
        credential.user.displayName || '',
        credential.user.photoURL
      );
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  },

  async resetPassword(email: string): Promise<void> {
    if (!this.isReady() || !auth) {
      throw new Error(
        'Firebase is not configured. Please add your VITE_FIREBASE_* credentials to your environment variables.'
      );
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      throw new Error(formatAuthError(err));
    }
  },

  async logout(): Promise<void> {
    if (auth) {
      await firebaseSignOut(auth);
    }
  },

  async fetchOrCreateUserData(
    uid: string,
    email: string,
    displayName: string,
    photoURL?: string | null
  ): Promise<AppUser> {
    const fallbackUser: AppUser = {
      userId: uid,
      email,
      name: displayName || email.split('@')[0] || 'User',
      role: email === 'anshalkale99@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      photoURL: photoURL || null,
      onboardingCompleted: false,
    };

    if (!db) {
      return fallbackUser;
    }

    const userDocRef = doc(db, 'users', uid);

    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap && userSnap.exists()) {
        return userSnap.data() as AppUser;
      }

      // If document doesn't exist, create it
      await setDoc(userDocRef, fallbackUser);
      return fallbackUser;
    } catch (err) {
      console.warn('Firestore read/write could not complete; falling back to authenticated Firebase profile:', err);

      try {
        const cached = localStorage.getItem(`tapcard_user_${uid}`);
        if (cached) return JSON.parse(cached) as AppUser;
      } catch {}

      return fallbackUser;
    }
  },
};
