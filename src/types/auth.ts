export type UserRole = 'user' | 'admin';

export interface AppUser {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  photoURL?: string | null;
  username?: string;
  profileId?: string;
  profileImage?: string;
  onboardingCompleted?: boolean;
  subscriptionPlan?: string;
  updatedAt?: string;
}

export interface AuthState {
  currentUser: AppUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

