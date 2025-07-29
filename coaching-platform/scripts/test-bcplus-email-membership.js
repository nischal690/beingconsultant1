// Test script to verify BC PLUS welcome email for membership upgrade
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase config from your environment
const firebaseConfig = {
  apiKey: "AIzaSyDCjcYy-pnIWKhJdWlDjMXJFHpXbz96HVQ",
  authDomain: "beingconsultant-coaching.firebaseapp.com",
  projectId: "beingconsultant-coaching",
  storageBucket: "beingconsultant-coaching.appspot.com",
  messagingSenderId: "1000303159196",
  appId: "1:1000303159196:web:8c7d9b7c2b5b2c5c5c5c5c",
  measurementId: "G-MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test email data
const testEmail = 'nischalnayak2000@gmail.com'; // Replace with your test email
const firstName = 'Nischal';

// HTML template for BC PLUS welcome email
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to BC PLUS!</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #245D66; padding: 20px; text-align: center; }
    .header img { max-width: 200px; }
    .content { padding: 20px; background-color: #ffffff; }
    h1 { color: #245D66; margin-top: 0; }
    .benefits { margin: 20px 0; }
    .benefit { margin-bottom: 15px; }
    .cta-button { display: inline-block; background-color: #245D66; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .social-links { margin: 15px 0; }
    .social-links a { margin: 0 10px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-coaching.appspot.com/o/assets%2Flogo-light.png?alt=media" alt="Being Consultant Logo">
    </div>
    <div class="content">
      <h1>Welcome to BC PLUS, ${firstName || 'Consultant'}!</h1>
      <p>Congratulations on becoming a BC PLUS member! You've just unlocked exclusive access to premium resources that will accelerate your consulting career journey.</p>
      
      <div class="benefits">
        <div class="benefit">
          <strong>🔓 Unlimited Access:</strong> Explore our entire library of premium case studies, frameworks, and interview guides.
        </div>
        <div class="benefit">
          <strong>🎯 Personalized Learning:</strong> Track your progress and receive tailored recommendations based on your strengths and areas for improvement.
        </div>
        <div class="benefit">
          <strong>👥 Community Access:</strong> Connect with fellow consultants and industry professionals in our exclusive BC PLUS community.
        </div>
        <div class="benefit">
          <strong>🎓 Priority Support:</strong> Get your questions answered quickly with priority support from our team.
        </div>
      </div>
      
      <a href="https://beingconsultant.com/dashboard" class="cta-button">Access Your Dashboard</a>
      
      <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:support@beingconsultant.com">support@beingconsultant.com</a>.</p>
      
      <p>Best regards,<br>The Being Consultant Team</p>
    </div>
    <div class="footer">
      <img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-coaching.appspot.com/o/assets%2Flogo-dark.png?alt=media" alt="Being Consultant" style="max-width: 150px;">
      <p>© 2023 Being Consultant. All rights reserved.</p>
      <div class="social-links">
        <a href="https://www.linkedin.com/company/beingconsultant">LinkedIn</a> |
        <a href="https://www.instagram.com/beingconsultant">Instagram</a> |
        <a href="https://www.youtube.com/c/BeingConsultant">YouTube</a>
      </div>
      <p>You're receiving this email because you've signed up for BC PLUS membership.</p>
    </div>
  </div>
</body>
</html>
`;

// Function to send test email
async function sendTestEmail() {
  try {
    // Create a document in the 'mail' collection
    const mailRef = await addDoc(collection(db, 'mail'), {
      to: testEmail,
      message: {
        subject: '🎉 Welcome to BC PLUS – Your Consulting Prep Journey Begins!',
        html: htmlContent
      }
    });
    
    console.log('BC PLUS welcome email sent successfully with ID:', mailRef.id);
  } catch (error) {
    console.error('Error sending BC PLUS welcome email:', error);
  }
}

// Execute the function
sendTestEmail();
