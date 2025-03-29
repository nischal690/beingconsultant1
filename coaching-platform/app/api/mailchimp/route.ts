import { NextRequest, NextResponse } from 'next/server';
import { getMailchimpClient } from '@/lib/mailchimp/mailchimp';
import { auth } from '@/lib/firebase/config';
import { getUserProfile } from '@/lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { userId, email, firstName, lastName, scheduleHours = 24 } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and email are required' },
        { status: 400 }
      );
    }

    // Get Mailchimp client
    const mailchimpClient = getMailchimpClient();

    // Add user to Mailchimp audience
    await mailchimpClient.addOrUpdateMember(
      email,
      firstName || '',
      lastName || '',
      ['new-signup'] // Tag for new signups
    );

    // Calculate scheduled time (24 hours from now by default)
    const scheduledTime = new Date();
    scheduledTime.setHours(scheduledTime.getHours() + scheduleHours);

    // Schedule follow-up email
    const templateId = parseInt(process.env.MAILCHIMP_WELCOME_TEMPLATE_ID || '0', 10);
    
    if (!templateId) {
      throw new Error('Mailchimp welcome template ID is not configured');
    }

    const result = await mailchimpClient.scheduleEmail(
      email,
      templateId,
      'Welcome to Being Consultant - Next Steps',
      'Being Consultant Team',
      process.env.MAILCHIMP_REPLY_TO_EMAIL || 'support@beingconsultant.com',
      scheduledTime
    );

    // Return success response
    return NextResponse.json({
      success: true,
      scheduledTime: scheduledTime.toISOString(),
      result
    });
  } catch (error: any) {
    console.error('Error scheduling Mailchimp email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to schedule email' },
      { status: 500 }
    );
  }
}
