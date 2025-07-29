/**
 * Test script to send a BC PLUS welcome email
 * 
 * This script demonstrates how to send a BC PLUS welcome email using the email utility
 * Run with: node scripts/test-bcplus-email.js
 */

// Import Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyDCdUDWBUmSXLYQwx5LnN0s9UrHi5QjJvA",
  authDomain: "beingconsultant-e5c75.firebaseapp.com",
  projectId: "beingconsultant-e5c75",
  storageBucket: "beingconsultant-e5c75.appspot.com",
  messagingSenderId: "1002457203633",
  appId: "1:1002457203633:web:c4c2e0c6e1d3d7e5c0f8f8",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Import the email utility functions (using CommonJS require)
const { sendBCPlusWelcomeEmail } = require('../lib/firebase/email');

// Function to send a test BC PLUS welcome email
async function sendTestBCPlusEmail() {
  try {
    console.log('Sending BC PLUS welcome email to nischalnayak2000@gmail.com...');
    
    // Send the BC PLUS welcome email
    const result = await sendBCPlusWelcomeEmail('nischalnayak2000@gmail.com', 'Nischal');
    
    console.log('BC PLUS welcome email document created with ID:', result.id);
    console.log('Check your inbox for the BC PLUS welcome email.');
    
  } catch (error) {
    console.error('Error sending BC PLUS welcome email:', error);
  }
}

// Execute the function
sendTestBCPlusEmail();
