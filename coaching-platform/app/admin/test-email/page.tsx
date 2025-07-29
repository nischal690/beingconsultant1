/**
 * Admin Test Email Page
 * 
 * A page to test the Firebase Firestore Trigger Email extension
 */

import TestEmail from '@/components/admin/test-email';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Email | Being Consultant Admin',
  description: 'Test the email functionality using Firebase Firestore Trigger Email extension',
};

export default function TestEmailPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Email Testing Tool</h1>
      
      <div className="max-w-md mx-auto">
        <TestEmail />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">About Firebase Firestore Trigger Email</h2>
        <p className="mb-2">
          This page tests the Firebase Firestore Trigger Email extension integration. When you send a test email:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>A document is added to the Firestore &apos;mail&apos; collection</li>
          <li>The Firebase extension detects the new document</li>
          <li>The extension sends an email based on the document data</li>
          <li>The document is updated with metadata about the email delivery</li>
        </ol>
        <p className="mt-2 text-sm text-gray-600">
          For more information, see the <a href="/docs/firebase-email-integration.md" className="text-blue-600 hover:underline">Firebase Email Integration documentation</a>.
        </p>
      </div>
    </div>
  );
}
