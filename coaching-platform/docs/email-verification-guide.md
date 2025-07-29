# Email Functionality Verification Guide

This guide provides step-by-step instructions to verify that the Firebase Firestore Trigger Email extension is working correctly in the Being Consultant platform.

## Prerequisites

1. Access to the Firebase Console for the Being Consultant project
2. A test email account (e.g., nischalnayak2000@gmail.com)

## Verification Methods

### Method 1: Using the Firebase Console

1. **Check Extension Installation**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project (beingconsultant-e5c75)
   - Navigate to Extensions in the left sidebar
   - Verify that "firestore-send-email" is listed and shows as "Active"

2. **Check Extension Configuration**
   - Click on the "firestore-send-email" extension
   - Verify the following configuration:
     - SMTP Connection URI is properly set
     - Default FROM address is configured
     - Collection name is set to "mail"

3. **Test via Firestore**
   - Navigate to Firestore Database in the Firebase Console
   - Create a new document in the "mail" collection with the following fields:
     ```
     to: "nischalnayak2000@gmail.com"
     message: {
       subject: "Test Email from Firebase Console",
       html: "<p>This is a test email sent from the Firebase Console.</p>"
     }
     ```
   - After creating the document, refresh and check if metadata fields were added (indicating the email was processed)

### Method 2: Using the Application

1. **Test User Registration**
   - Create a new user account in the application
   - Use a real email address where you can check for the welcome email
   - Complete the registration process
   - Check the inbox for the welcome email with the updated template

2. **Check Firestore**
   - After registration, check the "mail" collection in Firestore
   - Look for a document with the "to" field matching your registration email
   - Verify that metadata fields were added showing the email was sent

### Method 3: Using the Test Component

1. **Access the Test Page**
   - Navigate to `/admin/test-email` in your local development environment
   - If you encounter issues accessing this page, you can:
     - Check for any console errors
     - Verify the route is properly set up
     - Ensure the component is correctly imported

2. **Send a Test Email**
   - Enter "nischalnayak2000@gmail.com" in the recipient field
   - Click the "Send Test Email" button
   - Check for success/error notifications

3. **Verify Email Delivery**
   - Check the inbox of nischalnayak2000@gmail.com for the test email
   - Verify that the email content matches the expected template

## Troubleshooting

If emails are not being sent or received:

1. **Check SMTP Configuration**
   - Verify that the SMTP Connection URI is correct in the extension settings
   - For Gmail, ensure you're using an App Password if 2FA is enabled

2. **Check Firestore Documents**
   - Look for error fields in the mail documents
   - Common errors include authentication failures or invalid recipient addresses

3. **Check Extension Logs**
   - In the Firebase Console, go to Extensions > firestore-send-email > Logs
   - Look for any error messages or warnings

4. **Check Firebase Functions Logs**
   - The extension uses Firebase Functions to send emails
   - Check the Functions logs for any errors related to email sending

## Next Steps After Verification

Once you've verified that the email functionality is working:

1. **Update Email Templates**
   - Consider initializing all email templates in Firestore for easier management
   - Use the `email-templates.ts` utility to manage templates

2. **Add More Email Triggers**
   - Implement additional email notifications for important user actions
   - Examples: password reset, appointment confirmations, etc.

3. **Monitor Email Delivery**
   - Regularly check the Firestore "mail" collection for any failed emails
   - Consider implementing a retry mechanism for failed emails

## Resources

- [Firebase Extensions Documentation](https://firebase.google.com/docs/extensions)
- [Firestore Trigger Email Extension](https://firebase.google.com/products/extensions/firebase-firestore-send-email)
- [Project Email Integration Documentation](./firebase-email-integration.md)
