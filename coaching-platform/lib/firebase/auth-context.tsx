"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  OAuthProvider,
  sendEmailVerification,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";
import { auth } from "./config";
import { hasCompletedOnboarding, createUserProfile, getUserProfile } from "./firestore";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  checkOnboardingStatus: () => Promise<boolean>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Set persistence to LOCAL on initialization
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Firebase persistence set to LOCAL");
      } catch (error) {
        console.error("Error setting persistence:", error);
      }
    };
    
    setupPersistence();
  }, []);

  useEffect(() => {
    // Check for existing authentication
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User authenticated" : "No user");
      setUser(user);
      
      // If user is logged in and came from a social provider (Google/Apple)
      if (user && (user.providerData[0]?.providerId === 'google.com' || user.providerData[0]?.providerId === 'apple.com')) {
        try {
          // Check if user profile exists
          const userProfile = await getUserProfile(user.uid);
          
          // If user profile doesn't exist or was just created, add name and email
          if (!userProfile.success || !userProfile.data) {
            // Extract first and last name from displayName if available
            let firstName = '';
            let lastName = '';
            
            if (user.displayName) {
              const nameParts = user.displayName.split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            }
            
            await createUserProfile(user.uid, {
              firstName: firstName,
              lastName: lastName,
              email: user.email || '',
              photoURL: user.photoURL || '',
              providerId: user.providerData[0]?.providerId,
              displayName: user.displayName || '',
              emailVerified: user.emailVerified
            });
          }
        } catch (error) {
          console.error("Error creating/updating user profile:", error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send verification email after successful signup
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create or update user profile with Google data
      if (user) {
        // Extract first and last name from displayName if available
        let firstName = '';
        let lastName = '';
        
        if (user.displayName) {
          const nameParts = user.displayName.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        
        await createUserProfile(user.uid, {
          firstName: firstName,
          lastName: lastName,
          email: user.email || '',
          photoURL: user.photoURL || '',
          providerId: 'google.com',
          displayName: user.displayName || '',
          emailVerified: user.emailVerified
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create or update user profile with Apple data
      if (user) {
        // Extract first and last name from displayName if available
        let firstName = '';
        let lastName = '';
        
        if (user.displayName) {
          const nameParts = user.displayName.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        
        await createUserProfile(user.uid, {
          firstName: firstName,
          lastName: lastName,
          email: user.email || '',
          photoURL: user.photoURL || '',
          providerId: 'apple.com',
          displayName: user.displayName || '',
          emailVerified: user.emailVerified
        });
      }
    } catch (error) {
      console.error("Error signing in with Apple:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Only clear the current session, don't invalidate cookies on other subdomains
      await signOut(auth);
      // Don't force navigation after logout to maintain state across subdomains
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    if (!auth.currentUser) return;
    
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL
      });
      // Force refresh the user object
      setUser({ ...auth.currentUser });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const checkOnboardingStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const completed = await hasCompletedOnboarding(user.uid);
      return completed;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in");
    }
    
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    logout,
    resetPassword,
    updateUserProfile,
    checkOnboardingStatus,
    sendVerificationEmail
  };

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
