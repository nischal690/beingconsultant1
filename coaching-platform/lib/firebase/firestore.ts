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
export const timestampToDate = (timestamp: Timestamp) => {
  if (!timestamp) return null;
  return timestamp.toDate();
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
  paymentMethod: 'razorpay' | 'stripe';
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
  paymentMethod: 'razorpay' | 'stripe';
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
      
      coachingPrograms.push({
        id: doc.id,
        ...data,
        enrollmentDate,
        paymentDate
      });
    });
    
    return { success: true, data: coachingPrograms };
  } catch (error) {
    console.error("Error getting user coaching programs:", error);
    return { success: false, error };
  }
};
