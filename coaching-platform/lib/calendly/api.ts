import { toast } from "sonner";

const CALENDLY_API_URL = 'https://api.calendly.com';

/**
 * Fetch event types from Calendly API
 * @param token - Calendly API token
 * @param orgUri - Organization URI
 */
export const fetchEventTypes = async (token: string, orgUri: string) => {
  try {
    const requestUrl = `${CALENDLY_API_URL}/event_types?organization=${orgUri}`;
    
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });


    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error('[Calendly] Error fetching event types. Status:', response.status, 'Error data:', errorData);
        return { success: false, error: errorData };
      } catch (jsonError) {
        const textError = await response.text();
        console.error('[Calendly] Error parsing error response as JSON:', jsonError);
        console.error('[Calendly] Raw error response:', textError);
        return { success: false, error: { message: textError || 'Unknown error', status: response.status } };
      }
    }

    try {
      const data = await response.json();

      return { success: true, data };
    } catch (jsonError) {
      console.error('[Calendly] Error parsing success response as JSON:', jsonError);
      return { success: false, error: { message: 'Failed to parse response', error: jsonError } };
    }
  } catch (error) {
    console.error('[Calendly] Error fetching event types:', error);

    return { success: false, error };
  }
};

/**
 * Fetch available time slots for an event type
 * @param token - Calendly API token
 * @param eventTypeUri - Event type URI
 * @param startTime - Start time in ISO format
 * @param endTime - End time in ISO format
 * @param timezone - User's timezone
 */
export const fetchAvailableTimeSlots = async (
  token: string, 
  eventTypeUri: string, 
  startTime: string, 
  endTime: string, 
  timezone: string
) => {
  try {
    const url = new URL(`${CALENDLY_API_URL}/event_type_available_times`);
    url.searchParams.append('event_type', eventTypeUri);
    url.searchParams.append('start_time', startTime);
    url.searchParams.append('end_time', endTime);
    url.searchParams.append('timezone', timezone);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });


    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error('[Calendly] Error fetching available time slots. Status:', response.status, 'Error data:', errorData);
        return { success: false, error: errorData };
      } catch (jsonError) {
        const textError = await response.text();
        console.error('[Calendly] Error parsing error response as JSON:', jsonError);
        console.error('[Calendly] Raw error response:', textError);
        return { success: false, error: { message: textError || 'Unknown error', status: response.status } };
      }
    }

    try {
      const data = await response.json();
  
      return { success: true, data };
    } catch (jsonError) {
      console.error('[Calendly] Error parsing success response as JSON:', jsonError);
      return { success: false, error: { message: 'Failed to parse response', error: jsonError } };
    }
  } catch (error) {
    console.error('[Calendly] Error fetching available time slots:', error);

    return { success: false, error };
  }
};

/**
 * Generate a single-use scheduling link
 * @param token - Calendly API token
 * @param eventTypeUri - Event type URI
 * @param maxEventCount - Maximum number of events that can be scheduled (default: 1)
 */
export const generateSchedulingLink = async (
  token: string, 
  eventTypeUri: string, 
  maxEventCount: number = 1
) => {
  try {
    const response = await fetch(`${CALENDLY_API_URL}/scheduling_links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        owner: eventTypeUri,
        owner_type: "EventType",
        max_event_count: maxEventCount
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Calendly] Error generating scheduling link:', errorData);
      return { success: false, error: errorData };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error('[Calendly] Error generating scheduling link:', error);
    return { success: false, error };
  }
};

/**
 * Configure a webhook subscription for Calendly events
 * @param token - Calendly API token
 * @param orgUri - Organization URI
 * @param webhookUrl - URL to receive webhook events
 * @param events - Array of event types to subscribe to
 */
export const configureWebhook = async (
  token: string,
  orgUri: string,
  webhookUrl: string,
  events: string[] = ['invitee.created']
) => {
  try {
    const response = await fetch(`${CALENDLY_API_URL}/webhook_subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: webhookUrl,
        events,
        organization: orgUri,
        scope: 'organization'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Calendly] Error configuring webhook:', errorData);
      return { success: false, error: errorData };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error('[Calendly] Error configuring webhook:', error);
    return { success: false, error };
  }
};

/**
 * Fetch details for a scheduled event
 * @param token - Calendly API token
 * @param eventUuid - UUID of the scheduled event
 */
export const fetchScheduledEventDetails = async (token: string, eventUuid: string) => {
  try {
    const requestUrl = `${CALENDLY_API_URL}/scheduled_events/${eventUuid}`;
    
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });


    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error('[Calendly] Error fetching scheduled event. Status:', response.status, 'Error data:', errorData);
        return { success: false, error: errorData };
      } catch (jsonError) {
        const textError = await response.text();
        console.error('[Calendly] Error parsing error response as JSON:', jsonError);
        console.error('[Calendly] Raw error response:', textError);
        return { success: false, error: { message: textError || 'Unknown error', status: response.status } };
      }
    }

    try {
      const data = await response.json();
      // Extract the important scheduling information
      const schedulingInfo = {
        start_time: data.resource.start_time,
        end_time: data.resource.end_time,
        location: data.resource.location,
        status: data.resource.status,
        uri: data.resource.uri,
        name: data.resource.name,
        event_type: data.resource.event_type,
        invitees_counter: data.resource.invitees_counter
      };
      return { success: true, data, schedulingInfo };
    } catch (jsonError) {
      console.error('[Calendly] Error parsing success response as JSON:', jsonError);
      return { success: false, error: { message: 'Failed to parse response', error: jsonError } };
    }
  } catch (error) {
    console.error('[Calendly] Error fetching scheduled event details:', error);
    if (error instanceof Error) {
      console.error('[Calendly Debug] Error name:', error.name);
      console.error('[Calendly Debug] Error message:', error.message);
      console.error('[Calendly Debug] Error stack:', error.stack);
    }
    return { success: false, error };
  }
};
