/**
 * Test script for Firebase Firestore Trigger Email extension
 * 
 * This script adds a test document to the 'mail' collection to trigger an email send
 * Run with: node scripts/test-email.js
 */

// Import Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

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

// Get Firestore instance
const db = getFirestore(app);

// Function to send a test email
async function sendTestEmail() {
  try {
    console.log('Sending test email to nischalnayak2000@gmail.com...');
    
    // Create a test email document
    const mailCollection = collection(db, 'mail');
    const result = await addDoc(mailCollection, {
      to: 'nischalnayak2000@gmail.com', // Test email recipient
      message: {
        subject: 'Test Email from Being Consultant',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; }
              .header { text-align: center; }
              .header img { width: 100%; max-width: 600px; }
              .content { padding: 20px; }
              .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; padding-bottom: 20px; }
              .footer img { max-width: 150px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="https://beingconsultant-e5c75.web.app/mailheader.png" alt="Being Consultant Header" />
              </div>
              <div class="content">
                <p>This is a test email from the Being Consultant platform.</p>
                <p>If you're receiving this, the Firebase Firestore Trigger Email extension is working correctly!</p>
                <p>Time sent: ${new Date().toLocaleString()}</p>
              </div>
              <div class="footer">
                <img src="https://beingconsultant-e5c75.web.app/beingconsultantmaillogo.png" alt="Being Consultant Logo" />
                <p>Being Consultant - Coaching Platform</p>
              </div>
            </div>
          </body>
          </html>
        `
      }
    });
    
    console.log('Test email document created with ID:', result.id);
    console.log('Check your inbox for the test email.');
    
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Execute the function
sendTestEmail();
