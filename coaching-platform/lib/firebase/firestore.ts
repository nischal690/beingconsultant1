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

// Helper function to validate date strings
function isValidDateString(dateStr: string): boolean {
  if (!dateStr) return false;
  
  // Check if it's a valid ISO date string or other common formats
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// User profile operations
export const createUserProfile = async (userId: string, userData: any) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Document exists, update it with new data but preserve existing data
      const existingData = userSnap.data();
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Document doesn't exist, create it
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
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

export const updateUserProfileWithOnboarding = async (userId: string, userData: any) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Document exists, update it
      await updateDoc(userRef, {
        ...userData,
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Document doesn't exist, create it
      await setDoc(userRef, {
        ...userData,
        onboardingCompleted: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating user onboarding data:", error);
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
      'firstName',
      'lastName',
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
export const timestampToDate = (timestamp: any) => {
  if (!timestamp) return null;
  
  // Check if it's a Firestore Timestamp object with toDate method
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // Check if it's a timestamp object with seconds and nanoseconds
  if (timestamp && timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
    // Convert Firebase server timestamp format to Date
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
  
  // If it's already a Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If it's a string or number, try to create a Date
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  // If we can't convert it, return null
  return null;
};

// Coupon operations
export const verifyCoupon = async (code: string, productId?: string) => {
  try {
    console.log(`[verifyCoupon] Starting verification for coupon code: "${code}", productId: "${productId || 'none'}"`);
    
    const couponsRef = collection(db, "coupon");
    const q = query(couponsRef, where("code", "==", code));
    console.log(`[verifyCoupon] Querying Firestore with: collection="coupon", where code="${code}"`);
    
    const querySnapshot = await getDocs(q);
    console.log(`[verifyCoupon] Query result: found ${querySnapshot.size} documents`);
    
    if (querySnapshot.empty) {
      console.log(`[verifyCoupon] ERROR: Coupon "${code}" not found in database`);
      return { success: false, error: "Coupon not found" };
    }
    
    const couponDoc = querySnapshot.docs[0];
    const couponData = couponDoc.data();
    console.log(`[verifyCoupon] Coupon found: ${JSON.stringify(couponData, null, 2)}`);
    
    // Get current time
    const now = new Date();
    console.log(`[verifyCoupon] Current time: ${now.toISOString()}`);
    
    // Check if coupon is valid based on time range
    const validFrom = timestampToDate(couponData.validFrom);
    const validTo = timestampToDate(couponData.validTo);
    
    console.log(`[verifyCoupon] Validity period: ${validFrom ? validFrom.toISOString() : 'none'} to ${validTo ? validTo.toISOString() : 'none'}`);
    
    if (validFrom && now < validFrom) {
      console.log(`[verifyCoupon] ERROR: Coupon not yet active. Current: ${now.toISOString()}, ValidFrom: ${validFrom.toISOString()}`);
      return { success: false, error: "Coupon is not yet active" };
    }
    
    if (validTo && now > validTo) {
      console.log(`[verifyCoupon] ERROR: Coupon expired. Current: ${now.toISOString()}, ValidTo: ${validTo.toISOString()}`);
      return { success: false, error: "Coupon has expired" };
    }
    
    // Check usage limit
    console.log(`[verifyCoupon] Usage count: ${couponData.usageCount || 0}/${couponData.usageLimit || 'unlimited'}`);
    if (couponData.usageLimit !== undefined && couponData.usageCount >= couponData.usageLimit) {
      console.log(`[verifyCoupon] ERROR: Usage limit reached (${couponData.usageCount}/${couponData.usageLimit})`);
      return { success: false, error: "Coupon usage limit reached" };
    }
    
    // Check if product-specific coupon applies to this product
    if (couponData.product && couponData.product !== "allproducts" && productId && couponData.product !== productId) {
      console.log(`[verifyCoupon] ERROR: Product mismatch. Coupon for: ${couponData.product}, Requested for: ${productId}`);
      return { success: false, error: "Coupon not valid for this product" };
    }
    
    console.log(`[verifyCoupon] SUCCESS: Coupon "${code}" is valid. Discount: ${couponData.discount}${couponData.discountType === 'percentage' ? '%' : ' fixed'}`);
    return { 
      success: true, 
      data: {
        code: couponData.code,
        discount: couponData.discount,
        discountType: couponData.discountType || "percentage",
        product: couponData.product
      }
    };
  } catch (error) {
    console.error("[verifyCoupon] Error verifying coupon:", error);
    return { success: false, error: "Error verifying coupon" };
  }
};

// Update coupon usage count
export const incrementCouponUsage = async (code: string) => {
  try {
    console.log(`[incrementCouponUsage] Starting increment for coupon: "${code}"`);
    
    const couponsRef = collection(db, "coupon");
    const q = query(couponsRef, where("code", "==", code));
    console.log(`[incrementCouponUsage] Querying Firestore with: collection="coupon", where code="${code}"`);
    
    const querySnapshot = await getDocs(q);
    console.log(`[incrementCouponUsage] Query result: found ${querySnapshot.size} documents`);
    
    if (querySnapshot.empty) {
      console.log(`[incrementCouponUsage] ERROR: Coupon "${code}" not found in database`);
      return { success: false, error: "Coupon not found" };
    }
    
    const couponDoc = querySnapshot.docs[0];
    const couponRef = doc(db, "coupon", couponDoc.id);
    const currentUsageCount = couponDoc.data().usageCount || 0;
    
    console.log(`[incrementCouponUsage] Current usage count: ${currentUsageCount}, incrementing to ${currentUsageCount + 1}`);
    
    await updateDoc(couponRef, {
      usageCount: currentUsageCount + 1,
      updatedAt: serverTimestamp()
    });
    
    console.log(`[incrementCouponUsage] SUCCESS: Usage count updated for coupon "${code}"`);
    return { success: true };
  } catch (error) {
    console.error("[incrementCouponUsage] Error updating coupon usage:", error);
    return { success: false, error: "Error updating coupon usage" };
  }
};

// Check if a subcollection exists for a user
export const checkSubcollectionExists = async (userId: string, subcollectionName: string): Promise<boolean> => {
  try {
    console.log(`[Firestore Debug] Checking if ${subcollectionName} subcollection exists for user ${userId}`);
    const subcollectionRef = collection(db, "users", userId, subcollectionName);
    const snapshot = await getDocs(subcollectionRef);
    const exists = !snapshot.empty;
    console.log(`[Firestore Debug] Subcollection ${subcollectionName} exists check result: ${exists}, document count: ${snapshot.size}`);
    return exists;
  } catch (error) {
    console.error(`[Firestore Error] Error checking if ${subcollectionName} subcollection exists:`, error);
    return false;
  }
};

// Ensure a subcollection exists for a user
export const ensureSubcollectionExists = async (userId: string, subcollectionName: string): Promise<boolean> => {
  try {
    console.log(`[Firestore Debug] Checking if ${subcollectionName} subcollection exists for user ${userId}`);
    const exists = await checkSubcollectionExists(userId, subcollectionName);
    console.log(`[Firestore Debug] Subcollection ${subcollectionName} exists: ${exists}`);
    
    if (!exists) {
      console.log(`[Firestore Debug] Creating placeholder document for ${subcollectionName} subcollection`);
      // Create a placeholder document that we'll delete immediately
      // This ensures the subcollection exists in Firestore
      const placeholderRef = doc(collection(db, "users", userId, subcollectionName), "placeholder");
      await setDoc(placeholderRef, {
        created: serverTimestamp(),
        placeholder: true
      });
      console.log(`[Firestore Debug] Placeholder document created successfully`);
      
      // Delete the placeholder document
      console.log(`[Firestore Debug] Deleting placeholder document`);
      await deleteDoc(placeholderRef);
      console.log(`[Firestore Debug] Placeholder document deleted successfully`);
    }
    
    console.log(`[Firestore Debug] ${subcollectionName} subcollection is now ready`);
    return true;
  } catch (error) {
    console.error(`[Firestore Error] Error ensuring ${subcollectionName} subcollection exists:`, error);
    return false;
  }
};

// Transaction history operations
export const createTransactionRecord = async (userId: string, transactionData: {
  transactionId: string;
  amount: number;
  currency: string;
  status: 'successful' | 'failed';
  paymentMethod: 'razorpay' | 'stripe' | 'free';
  productId: string;
  productTitle: string;
  documentId?: string;
  couponCode?: string;
  couponDiscount?: number;
  couponDiscountType?: 'percentage' | 'fixed';
  errorMessage?: string;
  metadata?: Record<string, any>;
}) => {
  try {
    // Ensure transactions subcollection exists
    await ensureSubcollectionExists(userId, "transactions");
    
    // Create transaction document
    const transactionRef = doc(
      collection(db, "users", userId, "transactions"), 
      transactionData.transactionId
    );
    
    await setDoc(transactionRef, {
      ...transactionData,
      timestamp: serverTimestamp(),
    });
    
    return { success: true, id: transactionRef.id };
  } catch (error) {
    console.error("Error creating transaction record:", error);
    return { success: false, error };
  }
};

// User purchased products operations
export const addProductToUserLibrary = async (userId: string, productData: {
  productId: string;
  productTitle: string;
  productCategory: string;
  transactionId: string;
  paymentId: string;
  documentId?: string;
  price: number;
  currency: string;
  metadata?: Record<string, any>;
}) => {
  try {
    // Ensure products subcollection exists
    await ensureSubcollectionExists(userId, "products");
    
    // Create product document
    const productRef = doc(
      collection(db, "users", userId, "products"), 
      productData.productId
    );
    
    // Check if product already exists in user's library
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      // Product already exists, update access time
      await updateDoc(productRef, {
        lastAccessed: serverTimestamp(),
        // Add new transaction to the transactions array
        transactions: [...(productDoc.data().transactions || []), {
          transactionId: productData.transactionId,
          paymentId: productData.paymentId,
          timestamp: new Date().toISOString() // Use ISO string instead of serverTimestamp()
        }]
      });
    } else {
      // Product doesn't exist, create it
      await setDoc(productRef, {
        ...productData,
        firstAccessed: serverTimestamp(),
        lastAccessed: serverTimestamp(),
        transactions: [{
          transactionId: productData.transactionId,
          paymentId: productData.paymentId,
          timestamp: new Date().toISOString() // Use ISO string instead of serverTimestamp()
        }]
      });
    }
    
    return { success: true, id: productRef.id };
  } catch (error) {
    console.error("Error adding product to user library:", error);
    return { success: false, error };
  }
};

// Get user's purchased products
export const getUserProducts = async (userId: string) => {
  try {
    const productsRef = collection(db, "users", userId, "products");
    const q = query(productsRef, orderBy("firstAccessed", "desc"));
    
    const querySnapshot = await getDocs(q);
    const products: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error getting user products:", error);
    return { success: false, error };
  }
};

// Get user's transaction history
export const getUserTransactions = async (userId: string, limit?: number) => {
  try {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const constraints: QueryConstraint[] = [orderBy("timestamp", "desc")];
    
    if (limit) {
      constraints.push(limitQuery(limit));
    }
    
    const q = query(transactionsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    const transactions: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error getting user transactions:", error);
    return { success: false, error };
  }
};

// Products operations
export const getProductsByCategory = async (category: string, limit?: number) => {
  try {
    console.log(`Attempting to fetch products with category: ${category}`);
    const productsRef = collection(db, "products");
    const constraints: QueryConstraint[] = [
      where("category", "==", category)
    ];
    
    if (limit) {
      constraints.push(limitQuery(limit));
    }
    
    const q = query(productsRef, ...constraints);
    console.log("Executing Firestore query with constraints:", constraints);
    const querySnapshot = await getDocs(q);
    console.log(`Query returned ${querySnapshot.size} documents`);
    
    const products: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      console.log(`Processing document with ID: ${doc.id}`);
      console.log("Document data:", doc.data());
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    console.log(`Returning ${products.length} products`);
    return { success: true, data: products };
  } catch (error) {
    console.error("Error getting products by category:", error);
    return { success: false, error };
  }
};

// Get products by type
export const getProductsByType = async (type: string, limit?: number) => {
  try {
    console.log(`Attempting to fetch products with type: ${type}`);
    const productsRef = collection(db, "products");
    const constraints: QueryConstraint[] = [
      where("type", "==", type)
    ];

    if (limit) {
      constraints.push(limitQuery(limit));
    }

    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const products: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`[getProductsByType] Fetched ${products.length} products:`, products);
    return { success: true, data: products };
  } catch (error) {
    console.error("Error getting products by type:", error);
    return { success: false, error };
  }
};

// Get a specific product by ID
export const getProduct = async (productId: string) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return { 
        success: true, 
        data: {
          id: productSnap.id,
          ...productSnap.data()
        } 
      };
    } else {
      return { success: false, error: "Product not found" };
    }
  } catch (error) {
    console.error("Error getting product:", error);
    return { success: false, error };
  }
};

// Add coaching program to user's coaching subcollection
export const addCoachingToUserProfile = async (userId: string, coachingData: {
  programId: string;
  programName: string;
  amountPaid: number;
  currency: string;
  transactionId: string;
  paymentMethod: 'razorpay' | 'stripe' | 'free';
  metadata?: Record<string, any>;
}) => {
  try {
    console.log("[Firestore Debug] Starting addCoachingToUserProfile with userId:", userId);
    console.log("[Firestore Debug] Coaching data received:", JSON.stringify(coachingData, null, 2));
    
    // Ensure coaching subcollection exists
    console.log("[Firestore Debug] Ensuring coaching subcollection exists");
    const subcollectionResult = await ensureSubcollectionExists(userId, "coaching");
    console.log("[Firestore Debug] Subcollection result:", subcollectionResult);
    
    // Create coaching document with programId as the document ID
    console.log("[Firestore Debug] Creating coaching document with programId:", coachingData.programId);
    const coachingRef = doc(
      collection(db, "users", userId, "coaching"), 
      coachingData.programId
    );
    
    // Check if coaching program already exists in user's profile
    console.log("[Firestore Debug] Checking if coaching program already exists");
    const coachingDoc = await getDoc(coachingRef);
    
    if (coachingDoc.exists()) {
      console.log("[Firestore Debug] Coaching program already exists, updating");
      // Coaching program already exists, update with new payment information
      await updateDoc(coachingRef, {
        lastUpdated: serverTimestamp(),
        amountPaid: coachingData.amountPaid,
        currency: coachingData.currency,
        lastTransactionId: coachingData.transactionId,
        paymentMethod: coachingData.paymentMethod,
        paymentDate: serverTimestamp(),
        ...coachingData.metadata
      });
      console.log("[Firestore Debug] Coaching program updated successfully");
    } else {
      console.log("[Firestore Debug] Coaching program doesn't exist, creating new document");
      // Coaching program doesn't exist, create it
      const docData = {
        programId: coachingData.programId,
        programName: coachingData.programName,
        amountPaid: coachingData.amountPaid,
        currency: coachingData.currency,
        transactionId: coachingData.transactionId,
        paymentMethod: coachingData.paymentMethod,
        enrollmentDate: serverTimestamp(),
        paymentDate: serverTimestamp(),
        status: 'active',
        ...coachingData.metadata
      };
      
      console.log("[Firestore Debug] Document data to be written:", JSON.stringify(docData, null, 2));
      
      await setDoc(coachingRef, docData);
      console.log("[Firestore Debug] Coaching program created successfully");
    }
    
    console.log("[Firestore Debug] addCoachingToUserProfile completed successfully");
    return { success: true, id: coachingRef.id };
  } catch (error) {
    console.error("[Firestore Error] Error adding coaching program to user profile:", error);
    return { success: false, error };
  }
};

// Get user's coaching programs
export const getUserCoachingPrograms = async (userId: string) => {
  try {
    // Check if coaching subcollection exists
    const hasCoaching = await checkSubcollectionExists(userId, "coaching");
    
    if (!hasCoaching) {
      return { success: true, data: [] };
    }
    
    // Get coaching programs
    const coachingRef = collection(db, "users", userId, "coaching");
    const querySnapshot = await getDocs(coachingRef);
    
    const coachingPrograms: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert timestamps to dates for easier handling in the UI
      const enrollmentDate = data.enrollmentDate ? timestampToDate(data.enrollmentDate) : null;
      const paymentDate = data.paymentDate ? timestampToDate(data.paymentDate) : null;
      const scheduledDate = data.scheduledDate ? timestampToDate(data.scheduledDate) : null;
      
      coachingPrograms.push({
        id: doc.id,
        ...data,
        enrollmentDate,
        paymentDate,
        scheduledDate
      });
    });
    
    return { success: true, data: coachingPrograms };
  } catch (error) {
    console.error("Error getting user coaching programs:", error);
    return { success: false, error };
  }
};

// Find coaching program by transaction ID
export const findCoachingByTransactionId = async (userId: string, transactionId: string) => {
  try {
    console.log("[Firestore Debug] Finding coaching program by transactionId:", transactionId);
    
    // Check if coaching subcollection exists
    const hasCoaching = await checkSubcollectionExists(userId, "coaching");
    
    if (!hasCoaching) {
      console.error("[Firestore Error] No coaching subcollection found for user");
      return { success: false, error: "No coaching programs found", programId: null };
    }
    
    // Query the coaching subcollection for documents with matching transactionId
    const coachingRef = collection(db, "users", userId, "coaching");
    const q = query(coachingRef, where("transactionId", "==", transactionId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error("[Firestore Error] No coaching program found with transactionId:", transactionId);
      return { success: false, error: "No matching coaching program found", programId: null };
    }
    
    // Get the first matching document
    const coachingDoc = querySnapshot.docs[0];
    console.log("[Firestore Debug] Found coaching program with ID:", coachingDoc.id);
    
    return { success: true, programId: coachingDoc.id, data: coachingDoc.data() };
  } catch (error) {
    console.error("[Firestore Error] Error finding coaching by transactionId:", error);
    return { success: false, error, programId: null };
  }
};

// Update coaching record with scheduled date
export const updateCoachingScheduledDate = async (
  userId: string,
  programId: string,
  scheduledInfo: {
    scheduledDate: Date;
    eventUri?: string;
    eventName?: string;
    inviteeEmail?: string;
    additionalInfo?: Record<string, any>;
  },
  transactionId?: string
) => {
  try {
    console.log("[Firestore Debug] Updating coaching scheduled date for userId:", userId);
    
    let coachingDocId = programId;
    
    // If transactionId is provided, try to find the coaching program by transactionId
    if (transactionId) {
      const findResult = await findCoachingByTransactionId(userId, transactionId);
      if (findResult.success && findResult.programId) {
        coachingDocId = findResult.programId;
        console.log("[Firestore Debug] Found coaching program by transactionId:", coachingDocId);
      }
    }
    
    // Reference to the coaching document
    const coachingRef = doc(db, "users", userId, "coaching", coachingDocId);
    
    // Check if coaching program exists
    const coachingDoc = await getDoc(coachingRef);
    
    if (!coachingDoc.exists()) {
      console.error("[Firestore Error] Coaching program not found");
      return { success: false, error: "Coaching program not found" };
    }
    
    // Update the document with scheduled date information
    await updateDoc(coachingRef, {
      scheduledDate: Timestamp.fromDate(scheduledInfo.scheduledDate),
      lastUpdated: serverTimestamp(),
      eventUri: scheduledInfo.eventUri || null,
      eventName: scheduledInfo.eventName || null,
      inviteeEmail: scheduledInfo.inviteeEmail || null,
      sessionStatus: "scheduled",
      ...scheduledInfo.additionalInfo
    });
    
    console.log("[Firestore Debug] Coaching scheduled date updated successfully");
    return { success: true };
  } catch (error) {
    console.error("[Firestore Error] Error updating coaching scheduled date:", error);
    return { success: false, error };
  }
};

// Update coaching booking details from Calendly event
export const updateCoachingBookingDetails = async (
  userId: string,
  programId: string,
  transactionId: string,
  bookingDetails: {
    eventUuid: string;
    scheduledDate: string;
    endTime: string;
    location?: string;
    status?: string;
    lastUpdated?: string;
  }
) => {
  try {
    console.log("[Firestore Debug] ===== UPDATING COACHING BOOKING DETAILS =====");
    console.log("[Firestore Debug] User ID:", userId);
    console.log("[Firestore Debug] Program ID:", programId);
    console.log("[Firestore Debug] Transaction ID:", transactionId);
    console.log("[Firestore Debug] Booking Details:", JSON.stringify(bookingDetails, null, 2));
    
    // First try to find the coaching document by transactionId
    console.log("[Firestore Debug] Looking up coaching by transaction ID...");
    const findResult = await findCoachingByTransactionId(userId, transactionId);
    let coachingDocId = programId;
    
    if (findResult.success && findResult.programId) {
      coachingDocId = findResult.programId;
      console.log("[Firestore Debug] Found coaching program by transactionId:", coachingDocId);
    } else {
      console.log("[Firestore Debug] Using provided program ID as document ID:", programId);
    }
    
    // Reference to the coaching document
    const coachingRef = doc(db, "users", userId, "coaching", coachingDocId);
    console.log("[Firestore Debug] Coaching document path:", coachingRef.path);
    
    // Check if coaching program exists
    console.log("[Firestore Debug] Checking if coaching document exists...");
    const coachingDoc = await getDoc(coachingRef);
    
    if (!coachingDoc.exists()) {
      console.error("[Firestore Error] Coaching program not found at path:", coachingRef.path);
      return { success: false, error: "Coaching program not found" };
    }
    
    console.log("[Firestore Debug] Existing coaching data:", JSON.stringify(coachingDoc.data(), null, 2));
    
    // Convert string dates to Firestore timestamps
    console.log("[Firestore Debug] Converting dates to Firestore timestamps");
    console.log("[Firestore Debug] Original scheduled date:", bookingDetails.scheduledDate);
    console.log("[Firestore Debug] Original end time:", bookingDetails.endTime);
    
    // Validate date strings before conversion
    if (!bookingDetails.scheduledDate || !isValidDateString(bookingDetails.scheduledDate)) {
      console.error("[Firestore Error] Invalid scheduled date received:", bookingDetails.scheduledDate);
      return { success: false, error: "Invalid scheduled date format" };
    }
    
    if (!bookingDetails.endTime || !isValidDateString(bookingDetails.endTime)) {
      console.error("[Firestore Error] Invalid end time received:", bookingDetails.endTime);
      return { success: false, error: "Invalid end time format" };
    }
    
    const scheduledDate = new Date(bookingDetails.scheduledDate);
    const endTime = new Date(bookingDetails.endTime);
    
    // Additional validation after conversion
    if (isNaN(scheduledDate.getTime()) || isNaN(endTime.getTime())) {
      console.error("[Firestore Error] Date conversion resulted in invalid date");
      console.error("[Firestore Error] scheduledDate valid:", !isNaN(scheduledDate.getTime()));
      console.error("[Firestore Error] endTime valid:", !isNaN(endTime.getTime()));
      return { success: false, error: "Date conversion failed" };
    }
    
    try {
      console.log("[Firestore Debug] Converted scheduled date:", scheduledDate.toISOString());
      console.log("[Firestore Debug] Converted end time:", endTime.toISOString());
    } catch (e) {
      console.error("[Firestore Error] Error converting dates to ISO string:", e);
      return { success: false, error: "Date conversion to ISO string failed" };
    }
    
    // Prepare update data
    const updateData = {
      eventUuid: bookingDetails.eventUuid,
      scheduledDate: Timestamp.fromDate(scheduledDate),
      endTime: Timestamp.fromDate(endTime),
      location: bookingDetails.location || "Online",
      sessionStatus: bookingDetails.status || "confirmed",
      lastUpdated: serverTimestamp(),
      bookingCompleted: true
    };
    
    console.log("[Firestore Debug] Updating document with data:", JSON.stringify(updateData, null, 2));
    
    // Update the document with booking details
    await updateDoc(coachingRef, updateData);
    
    console.log("[Firestore Debug] Coaching booking details updated successfully!");
    console.log("[Firestore Debug] ===== UPDATE COMPLETE =====");
    return { success: true };
  } catch (error) {
    console.error("[Firestore Error] Error updating coaching booking details:", error);
    console.error("[Firestore Error] Stack trace:", (error as Error).stack);
    return { success: false, error };
  }
};

// Job board operations
export const getJobFilterOptions = async () => {
  try {
    console.log("Starting getJobFilterOptions function");
    
    // Get all jobs first
    const jobsResult = await getJobs();
    
    if (jobsResult.error || !jobsResult.jobs || jobsResult.jobs.length === 0) {
      console.error("Failed to fetch jobs for filter options:", jobsResult.error);
      return {
        countries: ["All Countries"],
        locations: ["All Locations"],
        companies: ["All Companies"],
        error: jobsResult.error || "No jobs found"
      };
    }
    
    // Extract unique values for each filter
    const countries = new Set<string>();
    const locations = new Set<string>();
    const companies = new Set<string>();
    
    // Add default "All" options
    countries.add("All Countries");
    locations.add("All Locations");
    companies.add("All Companies");
    
    // Process each job to extract filter values
    jobsResult.jobs.forEach(job => {
      if (job.country && typeof job.country === 'string') {
        countries.add(job.country);
      }
      
      if (job.location && typeof job.location === 'string') {
        locations.add(job.location);
      }
      
      if (job.company && typeof job.company === 'string') {
        companies.add(job.company);
      }
    });
    
    console.log(`Filter options extracted: ${countries.size} countries, ${locations.size} locations, ${companies.size} companies`);
    
    return {
      countries: Array.from(countries),
      locations: Array.from(locations),
      companies: Array.from(companies),
      error: null
    };
  } catch (error) {
    console.error("Error fetching job filter options:", error);
    return {
      countries: ["All Countries"],
      locations: ["All Locations"],
      companies: ["All Companies"],
      error: `Failed to fetch filter options: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const getJobs = async (featured?: boolean, limitCount?: number) => {
  try {
    console.log("Starting getJobs function");
    
    // Try different collection names to find the right one
    const collectionNames = ["jobboard", "Jobboard", "jobs", "Jobs"];
    let jobs: any[] = [];
    let foundCollection = false;
    
    for (const collName of collectionNames) {
      try {
        console.log(`Trying collection name: ${collName}`);
        const collectionRef = collection(db, collName);
        
        // Create a query
        const constraints: QueryConstraint[] = [];
        
        // Apply filters if provided
        if (featured !== undefined) {
          console.log(`Adding featured filter: ${featured}`);
          constraints.push(where("featured", "==", featured));
        }
        
        // Apply limit if provided
        if (limitCount && limitCount > 0) {
          console.log(`Adding limit: ${limitCount}`);
          constraints.push(limitQuery(limitCount));
        }
        
        // Create the query with constraints
        const jobQuery = query(collectionRef, ...constraints);
        console.log(`Created query with constraints for ${collName}`);
        
        // Execute the query
        console.log(`Executing query on ${collName}...`);
        const snapshot = await getDocs(jobQuery);
        console.log(`Query executed on ${collName}. Found ${snapshot.docs.length} documents`);
        
        if (snapshot.docs.length > 0) {
          foundCollection = true;
          
          // Convert to array of jobs
          jobs = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // Ensure ID is available in both formats for compatibility
            return {
              id: doc.id, // Keep lowercase id for compatibility
              ID: doc.id, // Add uppercase ID to match Firestore field
              ...data
            };
          });
          
          console.log(`Jobs fetched from ${collName}:`, jobs.length);
          console.log(`First job sample:`, jobs.length > 0 ? jobs[0] : "No jobs");
          break; // Exit the loop if we found jobs
        }
      } catch (collError) {
        console.error(`Error trying collection ${collName}:`, collError);
        // Continue to the next collection name
      }
    }
    
    if (!foundCollection) {
      console.warn("No jobs found in any of the attempted collections");
    }
    
    return { jobs, error: null };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], error: `Failed to fetch jobs: ${error instanceof Error ? error.message : String(error)}` };
  }
};

// Resource access tracking operations
export const trackResourceAccess = async (userId: string, resourceData: {
  id: string;
  title: string;
  type: 'ebook' | 'video' | 'document' | 'assessment' | 'other';
  action: 'view' | 'download' | 'access';
  category?: string;
  metadata?: Record<string, any>;
}) => {
  try {
    console.log(`[trackResourceAccess] Tracking ${resourceData.action} for resource ${resourceData.id} by user ${userId}`);
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error(`[trackResourceAccess] User document not found: ${userId}`);
      return { success: false, error: "User not found" };
    }
    
    const userData = userSnap.data();
    const currentResourceAccessed = userData.resourceaccessed || [];
    
    // Create the resource access record
    const accessRecord = {
      id: resourceData.id,
      title: resourceData.title,
      type: resourceData.type,
      action: resourceData.action,
      category: resourceData.category || 'general',
      accessedAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
      metadata: resourceData.metadata || {}
    };
    
    // Check if this exact resource access already exists (same id and action)
    const existingIndex = currentResourceAccessed.findIndex(
      (item: any) => item.id === resourceData.id && item.action === resourceData.action
    );
    
    let updatedResourceAccessed;
    
    if (existingIndex !== -1) {
      // Update existing record - move to front and update timestamp
      updatedResourceAccessed = [...currentResourceAccessed];
      updatedResourceAccessed[existingIndex] = accessRecord;
      // Move to front
      const [updatedRecord] = updatedResourceAccessed.splice(existingIndex, 1);
      updatedResourceAccessed.unshift(updatedRecord);
    } else {
      // Add new record to the front
      updatedResourceAccessed = [accessRecord, ...currentResourceAccessed];
    }
    
    // Keep only the most recent 50 records to prevent unlimited growth
    if (updatedResourceAccessed.length > 50) {
      updatedResourceAccessed = updatedResourceAccessed.slice(0, 50);
    }
    
    // Update the user document
    await updateDoc(userRef, {
      resourceaccessed: updatedResourceAccessed,
      updatedAt: serverTimestamp()
    });
    
    console.log(`[trackResourceAccess] Successfully tracked ${resourceData.action} for resource ${resourceData.id}`);
    return { success: true };
  } catch (error) {
    console.error("[trackResourceAccess] Error tracking resource access:", error);
    return { success: false, error };
  }
};

// Get recently accessed resources
export const getRecentlyAccessedResources = async (userId: string, limit: number = 10) => {
  try {
    console.log(`[getRecentlyAccessedResources] Getting recent resources for user ${userId}`);
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error(`[getRecentlyAccessedResources] User document not found: ${userId}`);
      return { success: false, error: "User not found" };
    }
    
    const userData = userSnap.data();
    const resourceAccessed = userData.resourceaccessed || [];
    
    // Sort by accessedAt timestamp (most recent first) and limit results
    const recentResources = resourceAccessed
      .sort((a: any, b: any) => {
        const dateA = new Date(a.accessedAt || 0).getTime();
        const dateB = new Date(b.accessedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
    
    console.log(`[getRecentlyAccessedResources] Found ${recentResources.length} recent resources`);
    return { success: true, data: recentResources };
  } catch (error) {
    console.error("[getRecentlyAccessedResources] Error getting recently accessed resources:", error);
    return { success: false, error };
  }
};

// Update existing product access time (for purchased products)
export const updateProductAccessTime = async (userId: string, productId: string) => {
  try {
    console.log(`[updateProductAccessTime] Updating access time for product ${productId} by user ${userId}`);
    
    // Update in products subcollection
    const productRef = doc(db, "users", userId, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      await updateDoc(productRef, {
        lastAccessed: serverTimestamp()
      });
      console.log(`[updateProductAccessTime] Updated product access time for ${productId}`);
    }
    
    // Also track in the main resourceaccessed array
    const productData = productSnap.data();
    if (productData) {
      await trackResourceAccess(userId, {
        id: productId,
        title: productData.productTitle || productData.title || 'Unknown Product',
        type: 'ebook', // Assuming most products are ebooks, can be made dynamic
        action: 'access',
        category: productData.productCategory || 'product',
        metadata: {
          price: productData.price,
          currency: productData.currency
        }
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("[updateProductAccessTime] Error updating product access time:", error);
    return { success: false, error };
  }
};
