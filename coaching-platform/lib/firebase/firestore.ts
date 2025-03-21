import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as limitQuery,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// User profile operations
export const createUserProfile = async (userId: string, userData: any) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { success: false, error };
  }
};

export const updateUserProfile = async (userId: string, userData: any) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
};

// Check if user has completed onboarding
export const hasCompletedOnboarding = async (userId: string): Promise<boolean> => {
  try {
    const result = await getUserProfile(userId);
    if (!result.success || !result.data) return false;
    
    // Required onboarding fields
    const requiredFields = [
      'fullName',
      'phone',
      'email',
      'linkedInProfile',
      'workExperience',
      'education',
      'location',
      'currentRole',
      'currentCompany',
      'previousCompanies',
      'areasOfExpertise',
      'interests'
    ];
    
    // Check if all required fields exist and are not empty
    return requiredFields.every(field => 
      result.data && 
      result.data[field] !== undefined && 
      result.data[field] !== null && 
      result.data[field] !== ''
    );
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};

// Update user profile with onboarding data
export const updateUserOnboarding = async (userId: string, onboardingData: any) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...onboardingData,
      onboardingCompleted: true,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user onboarding data:", error);
    return { success: false, error };
  }
};

// Session operations
export const createSession = async (sessionData: any) => {
  try {
    const sessionsRef = collection(db, "sessions");
    const newSessionRef = doc(sessionsRef);
    await setDoc(newSessionRef, {
      ...sessionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: newSessionRef.id };
  } catch (error) {
    console.error("Error creating session:", error);
    return { success: false, error };
  }
};

export const getUserSessions = async (userId: string) => {
  try {
    const sessionsRef = collection(db, "sessions");
    const q = query(
      sessionsRef,
      where("userId", "==", userId),
      orderBy("scheduledAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const sessions: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, data: sessions };
  } catch (error) {
    console.error("Error getting user sessions:", error);
    return { success: false, error };
  }
};

// Resources operations
export const getResources = async (category?: string, limit?: number) => {
  try {
    const resourcesRef = collection(db, "resources");
    const constraints: QueryConstraint[] = [];
    
    if (category) {
      constraints.push(where("category", "==", category));
    }
    
    constraints.push(orderBy("createdAt", "desc"));
    
    if (limit) {
      constraints.push(limitQuery(limit));
    }
    
    const q = query(resourcesRef, ...constraints);
    const querySnapshot = await getDocs(q);
    const resources: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, data: resources };
  } catch (error) {
    console.error("Error getting resources:", error);
    return { success: false, error };
  }
};

export const getResource = async (resourceId: string) => {
  try {
    const resourceRef = doc(db, "resources", resourceId);
    const resourceSnap = await getDoc(resourceRef);
    
    if (resourceSnap.exists()) {
      return { 
        success: true, 
        data: {
          id: resourceSnap.id,
          ...resourceSnap.data()
        } 
      };
    } else {
      return { success: false, error: "Resource not found" };
    }
  } catch (error) {
    console.error("Error getting resource:", error);
    return { success: false, error };
  }
};

// Forum operations
export const createForumPost = async (postData: any) => {
  try {
    const postsRef = collection(db, "forumPosts");
    const newPostRef = doc(postsRef);
    await setDoc(newPostRef, {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      comments: 0,
    });
    return { success: true, id: newPostRef.id };
  } catch (error) {
    console.error("Error creating forum post:", error);
    return { success: false, error };
  }
};

export const getForumPosts = async (category?: string) => {
  try {
    const postsRef = collection(db, "forumPosts");
    const constraints: QueryConstraint[] = [];
    
    if (category) {
      constraints.push(where("category", "==", category));
    }
    
    constraints.push(orderBy("createdAt", "desc"));
    
    const q = query(postsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    const posts: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, data: posts };
  } catch (error) {
    console.error("Error getting forum posts:", error);
    return { success: false, error };
  }
};

// Helper to convert Firestore timestamp to JavaScript Date
export const timestampToDate = (timestamp: Timestamp) => {
  return timestamp?.toDate();
};
