/**
 * Test Email Component
 * 
 * A simple component to test sending emails using the Firebase Firestore Trigger Email extension
 */

"use client";

import { useState } from 'react';
import { sendEmail } from '@/lib/firebase/email';
import { toast } from 'sonner';

export default function TestEmail() {
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState('nischalnayak2000@gmail.com');
  
  const handleSendTestEmail = async () => {
    if (!recipient || !recipient.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await sendEmail({
        to: recipient,
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
      
      toast.success(`Test email sent to ${recipient}`);
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Test Email Functionality</h2>
      
      <div className="mb-4">
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
          Recipient Email
        </label>
        <input
          type="email"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter email address"
        />
      </div>
      
      <button
        onClick={handleSendTestEmail}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This will send a test email using the Firebase Firestore Trigger Email extension.</p>
        <p>Check the recipient's inbox to verify delivery.</p>
      </div>
    </div>
  );
}
