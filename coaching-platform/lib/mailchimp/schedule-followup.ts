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
  // Skip if we're in development and want to bypass Mailchimp calls
  if (process.env.NEXT_PUBLIC_SKIP_MAILCHIMP === 'true') {
    console.log('Skipping Mailchimp follow-up email in development mode');
    return { success: true, data: { skipped: true } };
  }

  try {
    // Log the attempt for debugging
    console.log(`Attempting to schedule follow-up email for: ${userData.email}`);

    // Determine the base URL for the API
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Prepare the request payload
    const payload = {
      userId: userData.userId,
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      scheduleHours: 24, // Schedule email 24 hours after signup
    };

    console.log('Making API request to:', `${baseUrl}/api/mailchimp`);
    console.log('With payload:', JSON.stringify(payload));

    // Make the API request
    const response = await fetch(`${baseUrl}/api/mailchimp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Log the response status for debugging
    console.log(`Mailchimp API response status: ${response.status} ${response.statusText}`);

    // Handle non-OK responses
    if (!response.ok) {
      // Try to extract detailed error information
      const responseText = await response.text();
      console.error('Failed to schedule follow-up email, response text:', responseText);
      
      let errorInfo;
      try {
        // Try to parse as JSON
        errorInfo = JSON.parse(responseText);
      } catch (parseError) {
        // If not JSON, use the raw text
        errorInfo = { rawText: responseText };
      }

      return { 
        success: false, 
        error: errorInfo.error || errorInfo.message || `API error: ${response.status} ${response.statusText}`,
        details: errorInfo
      };
    }

    // Parse successful response
    const result = await response.json();
    console.log('Successfully scheduled follow-up email:', result);
    return { success: true, data: result };
  } catch (error: any) {
    // Handle any unexpected errors
    console.error('Unexpected error scheduling follow-up email:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred while scheduling the follow-up email',
      stack: error.stack
    };
  }
}
