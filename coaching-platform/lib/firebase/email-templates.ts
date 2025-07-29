import { db } from './config';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Email templates for the Firebase Extension - Firestore Trigger Email
 * This file contains predefined templates that can be used with the email service
 */

interface EmailTemplateDefinition {
  id: string;
  subject: string;
  html: string;
}

/**
 * Initialize all email templates in Firestore
 * Call this function once during app initialization or from an admin panel
 */
export async function initializeEmailTemplates() {
  try {
    console.log('Initializing email templates...');
    
    // Create each template
    for (const template of emailTemplates) {
      await setDoc(doc(db, 'templates', template.id), {
        subject: template.subject,
        html: template.html
      });
      console.log(`Template created: ${template.id}`);
    }
    
    console.log('All email templates initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing email templates:', error);
    return false;
  }
}

/**
 * List of email templates used in the application
 * Each template can use Handlebars syntax for dynamic content: {{variable_name}}
 */
export const emailTemplates: EmailTemplateDefinition[] = [
  {
    id: 'welcome',
    subject: 'Welcome to Being Consultant!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="text-align: center;">
          <img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/unnamed%20(1).png?alt=media&token=842dff21-a873-4039-b713-16aff46b0b82" alt="Being Consultant Header" style="width: 100%; max-width: 600px;">
        </div>
        <div style="padding: 20px;">
          <p>Hello {{name}},</p>
          <p>Thank you for joining our platform. We're excited to have you on board!</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Explore our coaching resources</li>
            <li>Book a coaching session</li>
          </ul>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Being Consultant Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; padding-bottom: 20px;">
          <img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Beingconsultantmaillogo.png?alt=media&token=00a48ee1-0aa6-45d5-b9a1-a164beb11688" alt="Being Consultant Logo" style="max-width: 150px;">
        </div>
      </div>
    `
  },
  {
    id: 'purchase_confirmation',
    subject: 'Your Purchase: {{programName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Purchase Confirmation</h1>
        <p>Thank you for purchasing {{programName}}!</p>
        <p>Purchase Details:</p>
        <ul>
          <li><strong>Program:</strong> {{programName}}</li>
          <li><strong>Amount:</strong> {{currency}} {{amount}}</li>
          <li><strong>Date:</strong> {{date}}</li>
        </ul>
        <p>You can access your program in your dashboard.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Being Consultant Team</p>
      </div>
    `
  },
  {
    id: 'session_reminder',
    subject: 'Reminder: Your Upcoming Coaching Session',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Coaching Session Reminder</h1>
        <p>Hello {{name}},</p>
        <p>This is a friendly reminder about your upcoming coaching session:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Session:</strong> {{sessionType}}</p>
          <p><strong>Date:</strong> {{date}}</p>
          <p><strong>Time:</strong> {{time}}</p>
          <p><strong>Coach:</strong> {{coachName}}</p>
          {{#if meetingLink}}
          <p><strong>Meeting Link:</strong> <a href="{{meetingLink}}">Join Meeting</a></p>
          {{/if}}
        </div>
        <p>Please make sure to join the session on time. If you need to reschedule, please do so at least 24 hours in advance.</p>
        <p>Best regards,<br>The Being Consultant Team</p>
      </div>
    `
  },
  {
    id: 'password_reset',
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{resetLink}}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all;">{{resetLink}}</p>
        <p>Best regards,<br>The Being Consultant Team</p>
      </div>
    `
  },
  {
    id: 'contact_form',
    subject: 'New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Contact Form Submission</h1>
        <p>A new contact form has been submitted with the following details:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> {{name}}</p>
          <p><strong>Email:</strong> {{email}}</p>
          <p><strong>Subject:</strong> {{subject}}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #fff; padding: 10px; border-radius: 3px;">
            <p>{{message}}</p>
          </div>
        </div>
        <p>Please respond to this inquiry at your earliest convenience.</p>
      </div>
    `
  }
];
