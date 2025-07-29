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
import { sendEmail } from "./email";
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
        
        // Send welcome email
        try {
          // Get user's first name if available
          let firstName = '';
          if (userCredential.user && userCredential.user.displayName) {
            const nameParts = userCredential.user.displayName.split(' ');
            firstName = nameParts[0] || '';
          } else if (email) {
            // Extract name from email as fallback (e.g., john@example.com -> John)
            firstName = email.split('@')[0].split('.')[0];
            // Capitalize first letter
            firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
          }
          
          await sendEmail({
            to: email,
            message: {
              subject: "Welcome to the Being Consultant Community",
              html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Being Consultant</title>
  <style>
    /* General resets */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    body { margin:0; padding:0; width:100% !important; height:100% !important; }
    /* Container */
    .email-container { max-width:600px; margin:0 auto; }
    /* Button */
    .btn { display:inline-block; padding:12px 24px; background-color:#0F4C5C; color:#ffffff; text-decoration:none; border-radius:4px; }
    /* Mobile */
    @media screen and (max-width: 600px) {
      .email-container { width:100% !important; }
    }
  </style>
</head>
<body style="background-color:#f4f4f4; padding:20px 0; font-family:Arial, sans-serif; color:#333333;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <!--[if mso]>
        <table border="0" cellspacing="0" cellpadding="0" width="600"><tr><td>
        <![endif]-->
        <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border-radius:6px; overflow:hidden;">
          
          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding: 30px 0; background-color:#0F4C5C;">
              <img src="https://app.beingconsultant.com/assets/logo.png" alt="Being Consultant" width="120" style="display:block;"/>
            </td>
          </tr>

          <!-- Hero / Title -->
          <tr>
            <td style="padding:30px 40px 20px;">
              <h1 style="margin:0; font-size:24px; line-height:1.3; color:#0F4C5C;">Master the Consulting Journey</h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:0 40px 20px;">
              <p style="margin:0 0 16px; font-size:16px; line-height:1.5;">
                <strong>Dear ${firstName || 'Consultant'},</strong>
              </p>
              <p style="margin:0 0 16px; font-size:16px; line-height:1.5;">
                Congratulations on taking the first step toward a rewarding career in consulting! We're thrilled to welcome you to <strong>Being Consultant</strong>—the only community built to guide you end‑to‑end on your consulting journey.
              </p>
            </td>
          </tr>

          <!-- Content Steps -->
          <tr>
            <td style="padding:0 40px 20px;">
              <ol style="margin:0 0 16px; padding-left:20px; font-size:16px; line-height:1.5;">
                <li><strong>Explore the GRITS Framework</strong><br/>
                  Master Goals, Research, Insights, Tactics & Strategy with your personalized roadmap.
                </li>
                <li style="margin-top:12px;"><strong>Log In & Dive In</strong><br/>
                  Access on‑demand lessons, track progress, and start practicing cases.
                </li>
                <li style="margin-top:12px;"><strong>Join Our Live Sessions</strong><br/>
                  Weekly workshops with former consultants from McKinsey, BCG, and Bain.
                </li>
                <li style="margin-top:12px;"><strong>Connect & Collaborate</strong><br/>
                  Share cases, swap insights, and build your network in our community forums.
                </li>
              </ol>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:0 40px 30px;">
              <a href="https://app.beingconsultant.com/auth/login" class="btn">Login to Your Dashboard</a>
            </td>
          </tr>

          <!-- Benefits -->
          <tr>
            <td style="padding:0 40px 30px; font-size:16px; line-height:1.5;">
              <p style="margin:0 0 8px;"><strong>As part of Being Consultant, you'll also enjoy:</strong></p>
              <ul style="margin:0; padding-left:20px;">
                <li>24/7 access to a library of curated case studies</li>
                <li>Monthly office hours with industry experts</li>
                <li>Interview readiness checklists & mock‑interview feedback</li>
                <li>Exclusive job board featuring top consulting openings</li>
              </ul>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding:0 40px 30px; font-size:16px; line-height:1.5;">
              <p style="margin:0 0 16px;">
                Thank you for joining us. We can't wait to see the amazing milestones you'll achieve. If you have any questions or need support, just reply to this email or reach out at <a href="mailto:support@beingconsultant.com">support@beingconsultant.com</a>.
              </p>
              <p style="margin:0;">See you on the inside!</p>
              <p style="margin:16px 0 0;"><strong>Warm regards,</strong><br/>Gaurav<br/>Founder &amp; CEO, Being Consultant</p>
            </td>
          </tr>

          <!-- Footer Socials -->
          <tr>
            <td style="padding:20px 40px; border-top:1px solid #e0e0e0; font-size:12px; text-align:center; color:#888888;">
              Follow us on<br/>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">🌐</a>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">LinkedIn</a>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">Instagram</a>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">YouTube</a>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">Spotify</a>
            </td>
          </tr>

          <!-- Footer Logo -->
          <tr>
            <td align="center" style="padding:10px 0 30px;">
              <img src="https://app.beingconsultant.com/assets/logo-footer.png" alt="Being Consultant" width="60" style="display:block;"/>
            </td>
          </tr>

        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>

</body>
</html>`
            }
          });
          console.log("Welcome email sent successfully");
        } catch (emailError) {
          // Don't fail the signup if email sending fails
          console.error("Error sending welcome email:", emailError);
        }
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
