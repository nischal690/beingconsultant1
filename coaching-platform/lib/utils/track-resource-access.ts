import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

/**
 * Tracks when a user accesses a resource by adding it to their resourceaccessed array
 * 
 * @param userId The user's ID
 * @param resourceData Object containing resource details to track
 * @returns Promise with success status and any error
 */
export const trackResourceAccess = async (
  userId: string,
  resourceData: {
    id: string;
    name: string;
    type: string;
  }
) => {
  console.log(`[TrackResource][START] ====================================`);
  try {
    console.log(`[TrackResource] Tracking resource access for user ${userId}:`, resourceData);
    console.log(`[TrackResource] User ID: ${userId}`);
    console.log(`[TrackResource] Resource ID: ${resourceData.id}`);
    console.log(`[TrackResource] Resource Name: ${resourceData.name}`);
    console.log(`[TrackResource] Resource Type: ${resourceData.type}`);
    
    if (!userId) {
      console.error("[TrackResource] No user ID provided");
      return { success: false, error: "No user ID provided" };
    }

    // Reference to the user document
    const userDocRef = doc(db, `users/${userId}`);
    console.log(`[TrackResource] User document path: users/${userId}`);
    
    // Check if user document exists
    const userDocSnap = await getDoc(userDocRef);
    console.log(`[TrackResource] User document exists: ${userDocSnap.exists()}`);
    
    if (!userDocSnap.exists()) {
      console.error("[TrackResource] User document not found");
      return { success: false, error: "User document not found" };
    }

    // Create the resource access entry with timestamp
    // Using new Date() instead of serverTimestamp() because serverTimestamp() can't be used with arrayUnion()
    const currentDate = new Date().toISOString();
    const resourceAccessEntry = {
      ...resourceData,
      accessedDate: currentDate
    };
    
    console.log(`[TrackResource] Created resource entry with timestamp:`, resourceAccessEntry);
    console.log(`[TrackResource] Timestamp: ${currentDate}`);

    // Get current user data to check if resourceaccessed exists
    const userData = userDocSnap.data();
    const hasResourceAccessed = userData && userData.resourceaccessed && Array.isArray(userData.resourceaccessed);
    
    console.log(`[TrackResource] Current resourceaccessed array:`, 
      hasResourceAccessed ? 
      `Found with ${userData.resourceaccessed.length} items` : 
      'Not found or empty');
    
    // Update the user document with the new resource access
    console.log(`[TrackResource] Updating document with arrayUnion...`);
    
    if (!hasResourceAccessed) {
      // If resourceaccessed doesn't exist yet, initialize it as an array with the new entry
      console.log(`[TrackResource] resourceaccessed array doesn't exist, initializing it`);
      await updateDoc(userDocRef, {
        resourceaccessed: [resourceAccessEntry]
      });
    } else {
      // If resourceaccessed already exists, use arrayUnion to add the new entry
      console.log(`[TrackResource] Using arrayUnion to add to existing resourceaccessed array`);
      await updateDoc(userDocRef, {
        resourceaccessed: arrayUnion(resourceAccessEntry)
      });
    }
    
    // Verify the update
    const updatedDocSnap = await getDoc(userDocRef);
    const updatedData = updatedDocSnap.data();
    console.log(`[TrackResource] After update - resourceaccessed array:`, 
      updatedData && updatedData.resourceaccessed ? 
      `Found with ${updatedData.resourceaccessed.length} items` : 
      'Not found or empty');

    console.log("[TrackResource] Resource access tracked successfully");
    console.log(`[TrackResource][END] ====================================`);
    return { success: true };
  } catch (error) {
    console.error("[TrackResource] Error tracking resource access:", error);
    console.error("[TrackResource] Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.log(`[TrackResource][ERROR-END] ====================================`);
    return { success: false, error };
  }
};
