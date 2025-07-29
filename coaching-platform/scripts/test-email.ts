/**
 * Test script for sending an email using the Firebase Firestore Trigger Email extension
 * 
 * This script uses our existing email utility to send a test email
 * Run with: npx ts-node scripts/test-email.ts
 */

import { sendEmail } from '../lib/firebase/email';

async function sendTestEmail() {
  try {
    console.log('Sending test email to nischalnayak2000@gmail.com...');
    
    await sendEmail({
      to: 'nischalnayak2000@gmail.com',
      message: {
        subject: 'Test Email from Being Consultant',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #0F4C5C; color: white; padding: 10px; text-align: center; }
              .content { padding: 20px; }
              .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Test Email</h1>
              </div>
              <div class="content">
                <p>This is a test email from the Being Consultant platform.</p>
                <p>If you're receiving this, the Firebase Firestore Trigger Email extension is working correctly!</p>
                <p>Time sent: ${new Date().toLocaleString()}</p>
              </div>
              <div class="footer">
                <p>Being Consultant - Coaching Platform</p>
              </div>
            </div>
          </body>
          </html>
        `
      }
    });
    
    console.log('Test email sent successfully!');
    console.log('Check your inbox for the test email.');
    
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Execute the function
sendTestEmail();
