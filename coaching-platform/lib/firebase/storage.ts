import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

// Upload a file to Firebase Storage
export const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL, path };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error };
  }
};

// Get a download URL for a file
export const getFileURL = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    
    return { success: true, url };
  } catch (error) {
    console.error("Error getting file URL:", error);
    return { success: false, error };
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error };
  }
};

// Generate a unique file path for uploading
export const generateFilePath = (userId: string, fileName: string, folder = "uploads") => {
  const timestamp = new Date().getTime();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, "_");
  return `${folder}/${userId}/${timestamp}_${cleanFileName}`;
};
