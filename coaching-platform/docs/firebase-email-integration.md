# Firebase Firestore Trigger Email Integration

This document outlines how the Firebase Firestore Trigger Email extension is integrated into the Being Consultant coaching platform to send automated emails.

## Overview

The Firebase Firestore Trigger Email extension watches a Firestore collection (`mail`) and sends emails when new documents are added to this collection. This allows us to send emails programmatically from both client-side code and Firebase Functions.

## Current Status

- **Extension**: firebase/firestore-send-email
- **Version**: 0.2.4
- **Status**: ACTIVE
- **Last Updated**: July 22, 2025

## How It Works

1. **Trigger**: The extension watches the `mail` collection in Firestore.
2. **Action**: When a new document is added to the collection, the extension sends an email based on the document's data.
3. **Cleanup**: After sending the email, the extension adds metadata to the document indicating the email was sent.

## Document Structure

Documents in the `mail` collection should have the following structure:

```javascript
{
  to: 'recipient@example.com',
  message: {
    subject: 'Email Subject',
    html: '<p>Email content in HTML format</p>'
    // Optional: text: 'Plain text version'
  },
  // Optional fields
  cc: 'cc@example.com',
  bcc: 'bcc@example.com',
  from: 'sender@example.com', // Overrides default sender
  replyTo: 'reply@example.com',
  template: {
    name: 'template-name',
    data: {
      // Variables to use in the template
      first_name: 'John',
      last_name: 'Doe'
    }
  }
}
```

## Email Templates

We've created a utility file (`lib/firebase/email-templates.ts`) to manage email templates. Templates can be stored in the `templates` collection in Firestore with the following structure:

```javascript
{
  name: 'welcome-email',
  subject: 'Welcome to Being Consultant!',
  html: '<p>Welcome {{first_name}}!</p>...'
}
```

The extension uses Handlebars syntax for template variables (e.g., `{{first_name}}`).

## Implementation in Our Project

### 1. Email Utility

We've created a reusable email utility (`lib/firebase/email.ts`) that provides functions for:

- Sending direct emails by adding documents to the `mail` collection
- Using templates from the `templates` collection
- Managing email templates

### 2. Client-Side Integration

The email utility is used in the authentication context (`lib/firebase/auth-context.tsx`) to send welcome emails when users sign up.

### 3. Server-Side Integration

Firebase Functions (`functions/index.js`) include triggers to send emails for various events:

- Welcome emails when new users are created
- Purchase confirmation emails when coaching programs are purchased

### 4. Contact Form

The contact form component (`components/contact/contact-form.tsx`) uses the email utility to send contact form submissions to administrators and confirmation emails to users.

## Configuration

The extension requires SMTP configuration in the Firebase Console:

1. **SMTP Connection URI**: Format `smtp(s)://username:password@host:port`
   - For Gmail, you can use an App Password with `smtps://your-email@gmail.com:app-password@smtp.gmail.com:465`

2. **Default FROM Address**: The default sender email address

3. **Default REPLY-TO Address**: Optional, the default reply-to email address

## Testing

We've created several ways to test the email functionality:

### 1. Admin Test Page

We've created a dedicated admin page for testing emails at `/admin/test-email`. This page provides a simple interface to:
- Enter a recipient email address (default: nischalnayak2000@gmail.com)
- Send a test email with a formatted HTML template
- View success/error notifications

To access this page, navigate to: `https://your-domain.com/admin/test-email`

### 2. Using the Email Utility Directly

You can use the email utility in your code to send test emails:

```typescript
import { sendEmail } from '@/lib/firebase/email';

await sendEmail({
  to: 'recipient@example.com',
  message: {
    subject: 'Test Subject',
    html: '<p>Test content</p>'
  }
});
```

### 3. Manual Testing via Firestore

You can also test by manually adding a document to the `mail` collection:

1. Navigate to the Firebase Console > Firestore
2. Add a document to the `mail` collection with the required fields
3. The extension will automatically process the document and send the email
4. Check the document for metadata about the email delivery status

## Troubleshooting

If emails are not being sent:

1. Check the Firebase Console for extension logs
2. Verify SMTP credentials are correct
3. Ensure the document structure in the `mail` collection is correct
4. Check for any quota limitations

## Resources

- [Firebase Extensions Documentation](https://firebase.google.com/docs/extensions)
- [Firestore Trigger Email Extension](https://firebase.google.com/products/extensions/firebase-firestore-send-email)
- [Handlebars Template Syntax](https://handlebarsjs.com/guide/)
