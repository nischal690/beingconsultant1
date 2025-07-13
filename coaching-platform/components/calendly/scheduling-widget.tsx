"use client";

import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CalendlyWidgetProps {
  schedulingUrl: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
  utm?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  };
  embedType?: "popup" | "inline";
  inlineHeight?: number;
  className?: string;
  onEventScheduled?: (eventData: {
    event: string;
    payload: {
      event: {
        uuid: string;
        start_time: string;
        end_time: string;
        location?: string;
      };
      invitee: {
        uuid: string;
        email: string;
        name: string;
      };
    };
  }) => void;
  userId?: string;
  programId?: string;
  transactionId?: string;
}

declare global {
  interface Window {
    Calendly: any;
  }
}

export function CalendlyWidget({
  schedulingUrl,
  prefill,
  utm,
  embedType = "popup",
  inlineHeight = 700,
  className = "",
  onEventScheduled,
  userId,
  programId,
  transactionId,
}: CalendlyWidgetProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = React.useState(false);
  const inlineContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Calendly script if not already loaded
    const existingScript = document.getElementById("calendly-script") as HTMLScriptElement | null;
    if (!window.Calendly && !existingScript) {
      // First time: inject script
      const script = document.createElement("script");
      script.id = "calendly-script";
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => {
        console.log("[Calendly] Script loaded successfully");
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        console.error("[Calendly] Failed to load script");
      };
      document.body.appendChild(script);
    } else if (window.Calendly) {
      // Script already loaded
      setIsScriptLoaded(true);
    } else if (existingScript) {
      // Script tag exists but Calendly not yet available – attach onload listener
      const handleLoad = () => {
        console.log("[Calendly] Existing script finished loading");
        setIsScriptLoaded(true);
      };
      existingScript.addEventListener("load", handleLoad);
      // Fallback: after 3 s check anyway
      const timeout = setTimeout(() => {
        if (window.Calendly) setIsScriptLoaded(true);
      }, 3000);
      return () => {
        existingScript.removeEventListener("load", handleLoad);
        clearTimeout(timeout);
      };
    }

    return () => {
      // Clean up popup if it exists
      if (window.Calendly && embedType === "popup") {
        window.Calendly.closePopupWidget();
      }
    };
  }, []);

  // Set up event listener for Calendly events
  useEffect(() => {
    if (!isScriptLoaded || !window.Calendly) return;
    
    // Function to handle Calendly events
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf("calendly.") === 0) {
        // If this is a booking completion event
        if (e.data.event === "calendly.event_scheduled") {
          console.log("[Calendly] Booking completed!");
          
          // Call the callback if provided
          if (onEventScheduled) {
            onEventScheduled(e.data);
          }
          
          // Update booking details in Firebase with the payload
          updateBookingInFirebase(e.data);
        }
      }
    };
    
    // Function to update booking details in Firebase
    const updateBookingInFirebase = async (eventData: any) => {
      try {
        // Import Firebase functions and Calendly API dynamically
        const { updateCoachingBookingDetails } = await import('@/lib/firebase/firestore');
        const { fetchScheduledEventDetails } = await import('@/lib/calendly/api');
        
        // Only proceed if we have a valid userId
        if (!userId) {
          console.error('[Calendly] Cannot update booking: userId is undefined');
          return;
        }
        
        // Extract the event UUID from the payload
        let eventUuid = '';
        
        // Based on the actual payload structure:
        // {
        //   "event": "calendly.event_scheduled",
        //   "payload": {
        //     "event": {
        //       "uri": "https://api.calendly.com/scheduled_events/3eb3f4ee-bd8a-4a5a-a094-329380f10bf3"
        //     },
        //     "invitee": {
        //       "uri": "https://api.calendly.com/scheduled_events/3eb3f4ee-bd8a-4a5a-a094-329380f10bf3/invitees/40eadd2a-bfea-40b3-9e1e-05fc14eeba48"
        //     }
        //   }
        // }
        
        // Primary method: Extract from event.uri
        if (eventData.payload?.event?.uri) {
          const uriParts = eventData.payload.event.uri.split('/');
          eventUuid = uriParts[uriParts.length - 1];
          console.log('[Calendly] Extracted UUID from event.uri:', eventUuid);
        }
        // Fallback method: Extract from invitee.uri
        else if (eventData.payload?.invitee?.uri) {
          const matches = eventData.payload.invitee.uri.match(/scheduled_events\/([^\/]+)\/invitees/);
          if (matches && matches[1]) {
            eventUuid = matches[1];
            console.log('[Calendly] Extracted UUID from invitee.uri using regex:', eventUuid);
          }
        }
        
        if (!eventUuid) {
          console.error('[Calendly] Could not extract event UUID from payload');
          console.log('[Calendly] Available payload keys:', Object.keys(eventData.payload || {}));
          return;
        }
        
        // Get the Calendly API token
        const token = process.env.NEXT_PUBLIC_CALENDLY_API_TOKEN || '';
        
        if (!token) {
          console.error('[Calendly] API token is missing');
          return;
        }
        
        // Fetch the scheduled event details using the Calendly API

        const eventDetails = await fetchScheduledEventDetails(token, eventUuid);
        
        if (!eventDetails.success) {
          console.error('[Calendly] Failed to fetch event details:', eventDetails.error);
          return;
        }
        
        const { schedulingInfo } = eventDetails;
        
        // Make sure schedulingInfo exists before using it
        if (!schedulingInfo) {
          console.error('[Calendly] Scheduling information is missing in event details');
          return;
        }
        

        
        // Update the coaching record with booking details
        await updateCoachingBookingDetails(userId, programId || '', transactionId || '', {
          eventUuid: eventUuid,
          scheduledDate: schedulingInfo?.start_time || '',
          endTime: schedulingInfo?.end_time || '',
          location: schedulingInfo?.location || 'Online',
          status: 'confirmed',
          lastUpdated: new Date().toISOString()
        });
        

      } catch (error) {
        console.error('[Calendly] Error updating booking in Firebase:', error);
        console.error('[Calendly] Error details:', error instanceof Error ? error.message : String(error));
        console.error('[Calendly] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      }
    };
    
    // Add event listener
    window.addEventListener('message', handleCalendlyEvent);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, [isScriptLoaded, onEventScheduled, userId, programId, transactionId]);

  useEffect(() => {
    // Do not attempt to initialise if we don't yet have a scheduling URL
    if (!isScriptLoaded || !window.Calendly || !schedulingUrl) return;

    // Build widget options safely – strip null/undefined values
    const options: Record<string, any> = { url: schedulingUrl };

    // Safe prefill
    if (prefill) {
      const safePrefill: Record<string, any> = {};
      if (prefill.name) safePrefill.name = prefill.name;
      if (prefill.email) safePrefill.email = prefill.email;

      if (prefill.customAnswers) {
        const answers: Record<string, string> = {};
        Object.entries(prefill.customAnswers).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") {
            answers[k] = String(v);
          }
        });
        if (Object.keys(answers).length) safePrefill.customAnswers = answers;
      }
      if (Object.keys(safePrefill).length) options.prefill = safePrefill;
    }

    // Safe UTM params
    if (utm) {
      const safeUtm: Record<string, string> = {};
      if (utm.utmSource) safeUtm.utmSource = utm.utmSource;
      if (utm.utmMedium) safeUtm.utmMedium = utm.utmMedium;
      if (utm.utmCampaign) safeUtm.utmCampaign = utm.utmCampaign;
      if (utm.utmTerm) safeUtm.utmTerm = utm.utmTerm;
      if (utm.utmContent) safeUtm.utmContent = utm.utmContent;
      if (Object.keys(safeUtm).length) options.utm = safeUtm;
    }

    // Initialize Calendly widget based on embed type
    if (embedType === "popup") {
      window.Calendly.initPopupWidget(options);
      setIsLoaded(true);
    } else if (embedType === "inline" && inlineContainerRef.current) {
      window.Calendly.initInlineWidget({
        ...options,
        parentElement: inlineContainerRef.current,
        height: inlineHeight,
      });
      setIsLoaded(true);
    }
  }, [isScriptLoaded, schedulingUrl, prefill, utm, embedType, inlineHeight]);

  if (embedType === "inline") {
    return (
      <div className={className}>
        {!isLoaded && <Skeleton className="w-full h-[700px]" />}
        <div 
          ref={inlineContainerRef} 
          // prevent Calendly auto-scan; we'll initialise manually
          className="" 
          data-calendly="false"
          style={{ minWidth: '320px', height: `${inlineHeight}px` }}
        />
      </div>
    );
  }

  // For popup type, we just need a button to trigger it
  return null;
}
