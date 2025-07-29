import { db } from './config';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Email service using Firebase Extensions - Firestore Trigger Email
 * This service requires the Firebase Extension "Trigger Email" to be installed
 * https://extensions.dev/extensions/firebase/firestore-send-email
 */

interface EmailMessage {
  subject: string;
  html: string;
  text?: string;
}

interface EmailTemplate {
  name: string;
  data?: Record<string, any>;
}

interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  replyTo?: string;
  message?: EmailMessage;
  template?: EmailTemplate;
}

/**
 * Send an email using Firebase Extension - Firestore Trigger Email
 * @param options Email options including recipients, message content or template
 * @returns Promise with the document reference
 */
export async function sendEmail(options: EmailOptions) {
  try {
    // Validate required fields
    if (!options.to) {
      throw new Error('Recipient (to) is required');
    }
    
    if (!options.message && !options.template) {
      throw new Error('Either message or template is required');
    }
    
    // Convert single email to array if needed
    const toArray = Array.isArray(options.to) ? options.to : [options.to];
    
    // Create the email document
    const emailData: Record<string, any> = {
      to: toArray,
    };
    
    // Add optional fields if they exist
    if (options.cc) emailData.cc = Array.isArray(options.cc) ? options.cc : [options.cc];
    if (options.bcc) emailData.bcc = Array.isArray(options.bcc) ? options.bcc : [options.bcc];
    if (options.from) emailData.from = options.from;
    if (options.replyTo) emailData.replyTo = options.replyTo;
    
    // Add either message or template
    if (options.message) {
      emailData.message = options.message;
    }
    
    if (options.template) {
      emailData.template = options.template;
    }
    
    // Add the document to the 'mail' collection
    const mailCollection = collection(db, 'mail');
    const docRef = await addDoc(mailCollection, emailData);
    
    console.log('Email queued for sending with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Create an email template in Firestore
 * @param templateId Unique ID for the template
 * @param subject Email subject
 * @param html HTML content with optional Handlebars variables {{like_this}}
 * @returns Promise with the document reference
 */
/**
 * Send a welcome email to users who have been upgraded to BC PLUS membership
 * @param email Recipient email address
 * @param firstName First name of the user (optional)
 * @returns Promise with the document reference
 */
export async function sendBCPlusWelcomeEmail(email: string, firstName: string = '') {
  // If no first name provided, try to extract from email
  if (!firstName && email) {
    firstName = email.split('@')[0].split('.')[0];
    // Capitalize first letter
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  }

  return sendEmail({
    to: email,
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
}

export async function createEmailTemplate(
  templateId: string,
  subject: string,
  html: string
) {
  try {
    const templatesCollection = collection(db, 'templates');
    const templateData = {
      subject,
      html,
    };
    
    // Use template ID as the document ID
    const docRef = await addDoc(templatesCollection, templateData);
    console.log('Email template created with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error creating email template:', error);
    throw error;
  }
}
