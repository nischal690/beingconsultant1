import { generateSchedulingLink, fetchEventTypes, fetchAvailableTimeSlots } from "./api";
import { updateCoachingScheduledDate } from "@/lib/firebase/firestore";

// Calendly configuration
const CALENDLY_TOKEN = process.env.NEXT_PUBLIC_CALENDLY_API_TOKEN || '';
const CALENDLY_ORG_URI = process.env.NEXT_PUBLIC_CALENDLY_ORG_URI || '';

/**
 * Get the event type URI for a specific coaching program
 * In a real implementation, you would map program IDs to event type URIs
 * or fetch them from your database
 */
export const getEventTypeForProgram = async (programId: string) => {
  try {
    console.log('[Calendly Service Debug] Getting event type for program ID:', programId);
    
    // In a real implementation, you might fetch this mapping from your database
    // For now, we'll fetch all event types and find the one that matches the program name
    
    const result = await fetchEventTypes(CALENDLY_TOKEN, CALENDLY_ORG_URI);
    
    if (!result.success || !result.data.collection) {
      console.error('[Calendly Service] Failed to fetch event types');
      return { success: false, error: 'Failed to fetch event types' };
    }
    
    console.log('[Calendly Service Debug] Available event types:', result.data.collection.map(et => ({
      name: et.name,
      uri: et.uri,
      slug: et.slug
    })));
    
    // Always select the first event type (index 0)
    // In a real implementation, you would map program IDs to specific event types
    if (result.data.collection.length === 0) {
      console.error('[Calendly Service] No event types found');
      return { success: false, error: 'No event types found' };
    }
    
    // Make sure we have at least one event type
    if (result.data.collection.length < 1) {
      console.error('[Calendly Service] No event types found');
      return { success: false, error: 'No event types found' };
    }
    
    const eventType = result.data.collection[0]; // Always select the first event type (index 0)
    console.log('[Calendly Service Debug] Selected event type:', {
      name: eventType.name,
      uri: eventType.uri,
      slug: eventType.slug
    });
    
    return { success: true, eventTypeUri: eventType.uri };
  } catch (error) {
    console.error('[Calendly Service] Error getting event type for program:', error);
    if (error instanceof Error) {
      console.error('[Calendly Service Debug] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return { success: false, error };
  }
};

/**
 * Create a scheduling flow for a coaching program after payment
 */
export const createSchedulingFlow = async ({
  userId,
  programId,
  programName,
  transactionId,
  userEmail,
  userName
}: {
  userId: string;
  programId: string;
  programName: string;
  transactionId: string;
  userEmail?: string;
  userName?: string;
}) => {
  try {
    // 1. Get the event type URI for this program
    const eventTypeResult = await getEventTypeForProgram(programId);
    
    if (!eventTypeResult.success) {
      return eventTypeResult;
    }
    
    // 2. Generate a single-use scheduling link
    const linkResult = await generateSchedulingLink(
      CALENDLY_TOKEN,
      eventTypeResult.eventTypeUri,
      1 // Max event count = 1
    );
    
    if (!linkResult.success) {
      return linkResult;
    }
    
    // 3. Return the scheduling URL and other relevant information
    return {
      success: true,
      schedulingUrl: linkResult.data.resource.booking_url,
      eventTypeUri: eventTypeResult.eventTypeUri,
      // Include prefill data for the Calendly widget
      prefill: {
        name: userName,
        email: userEmail,
        customAnswers: {
          // These custom questions must be configured in your Calendly event type
          'User ID': userId,
          'Transaction ID': transactionId,
          'Program ID': programId,
          'Program Name': programName
        }
      }
    };
  } catch (error) {
    console.error('[Calendly Service] Error creating scheduling flow:', error);
    return { success: false, error };
  }
};

/**
 * Get available time slots for a coaching program
 */
export const getAvailableTimeSlots = async ({
  programId,
  startTime,
  endTime,
  timezone
}: {
  programId: string;
  startTime: string;
  endTime: string;
  timezone: string;
}) => {
  try {
    // 1. Get the event type URI for this program
    const eventTypeResult = await getEventTypeForProgram(programId);
    
    if (!eventTypeResult.success) {
      return eventTypeResult;
    }
    
    // 2. Fetch available time slots
    return await fetchAvailableTimeSlots(
      CALENDLY_TOKEN,
      eventTypeResult.eventTypeUri,
      startTime,
      endTime,
      timezone
    );
  } catch (error) {
    console.error('[Calendly Service] Error getting available time slots:', error);
    return { success: false, error };
  }
};
