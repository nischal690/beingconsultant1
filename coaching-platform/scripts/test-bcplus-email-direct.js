/**
 * Test script to send a BC PLUS welcome email directly
 * 
 * This script demonstrates how to send a BC PLUS welcome email directly using Firestore
 * Run with: node scripts/test-bcplus-email-direct.js
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
const db = getFirestore(app);

// Function to send a test BC PLUS welcome email
async function sendTestBCPlusEmail() {
  try {
    console.log('Sending BC PLUS welcome email to nischalnayak2000@gmail.com...');
    
    const firstName = 'Nischal';
    
    // Create the email document directly
    const mailCollection = collection(db, 'mail');
    const result = await addDoc(mailCollection, {
      to: 'nischalnayak2000@gmail.com',
      message: {
        subject: '🎉 Welcome to BC PLUS – Your Consulting Prep Journey Begins!',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to BC PLUS</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #0F4C5C;
      padding: 30px 0;
      text-align: center;
    }
    .content {
      padding: 30px 40px;
    }
    .footer {
      background-color: #f7f7f7;
      padding: 20px 40px;
      text-align: center;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background-color: #0F4C5C;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .social-icons {
      margin-top: 20px;
    }
    .social-icons img {
      width: 24px;
      height: 24px;
      margin: 0 5px;
    }
    .feature-list {
      padding-left: 20px;
    }
    .feature-list li {
      margin-bottom: 10px;
    }
    .emoji {
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/unnamed%20(1).png?alt=media&token=842dff21-a873-4039-b713-16aff46b0b82" alt="Being Consultant" width="120" style="display:block; margin: 0 auto;">
    </div>
    
    <div class="content">
      <p><strong>Dear ${firstName || 'Consultant'},</strong></p>
      
      <p>Welcome to Being Consultant – the premier community built to help you break into top consulting firms!</p>
      <p>We're thrilled to have you onboard with the <strong>BC PLUS Membership</strong>. You now have access to our exclusive resources, tools, and expert guidance to accelerate your case interview prep.</p>
      
      <p><strong>✅ Start Here:</strong><br>
      Explore our GRITS Framework – a structured, proven roadmap to master each stage of the consulting interview process. It's the perfect way to build confidence and skill, step by step.</p>
      
      <p><strong>🚀 What's Included in Your BC PLUS Membership:</strong></p>
      <ul class="feature-list">
        <li>Full access to our GRITS-based training modules</li>
        <li>Practice drills across Framing, Analysis & Recommendation</li>
        <li>AI-powered mock interviews</li>
        <li>1:1 coaching & feedback sessions</li>
        <li>Community Q&A and daily support</li>
      </ul>
      
      <p><strong>👉 Get Started Now:</strong><br>
      Log in to your dashboard and begin your learning journey today:</p>
      
      <p style="text-align: center;">
        <a href="https://app.beingconsultant.com/dashboard" class="button">Login</a>
      </p>
      
      <p><strong>💡 Have questions or need help?</strong> Reach out to us anytime at support@beingconsultant.com or chat with us inside the platform.</p>
      
      <p>We're excited to be part of your journey to consulting success!</p>
      
      <p>Best regards,<br>
      Team Being Consultant<br>
      <a href="https://www.beingconsultant.com">www.beingconsultant.com</a></p>
    </div>
    
    <div class="footer">
      <p>Follow our socials so that you never miss an update.</p>
      
      <div class="social-icons">
        <a href="https://www.beingconsultant.com"><img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Beingconsultantmaillogo.png?alt=media&token=00a48ee1-0aa6-45d5-b9a1-a164beb11688" alt="Website"></a>
        <a href="https://www.linkedin.com/company/beingconsultant"><img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.appspot.com/o/social%2Flinkedin.png?alt=media" alt="LinkedIn"></a>
        <a href="https://www.instagram.com/beingconsultant"><img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.appspot.com/o/social%2Finstagram.png?alt=media" alt="Instagram"></a>
        <a href="https://www.youtube.com/c/BeingConsultant"><img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.appspot.com/o/social%2Fyoutube.png?alt=media" alt="YouTube"></a>
        <a href="https://open.spotify.com/show/5BkWOeoSxTvgPVGUISXFxF"><img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.appspot.com/o/social%2Fspotify.png?alt=media" alt="Spotify"></a>
      </div>
    </div>
  </div>
</body>
</html>`
      }
    });
    
    console.log('BC PLUS welcome email document created with ID:', result.id);
    console.log('Check your inbox for the BC PLUS welcome email.');
    
  } catch (error) {
    console.error('Error sending BC PLUS welcome email:', error);
  }
}

// Execute the function
sendTestBCPlusEmail();
