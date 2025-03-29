/**
 * Utility function to schedule a follow-up email via Mailchimp
 * This is called after user signup to schedule an email 24 hours later
 */

export async function scheduleFollowupEmail(userData: {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    // Call our API endpoint to schedule the email
    const response = await fetch('/api/mailchimp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userData.userId,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        scheduleHours: 24, // Schedule email 24 hours after signup
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to schedule follow-up email:', errorData);
      return { success: false, error: errorData.error };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error scheduling follow-up email:', error);
    return { success: false, error: error.message };
  }
}
