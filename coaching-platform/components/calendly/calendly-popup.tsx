"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserProfile } from "@/lib/firebase/firestore"

interface CalendlyPopupProps {
  isOpen: boolean
  onClose: () => void
  onScheduled: (scheduledInfo: any) => void
  programName: string
  coachingId: string
}

export function CalendlyPopup({ isOpen, onClose, onScheduled, programName, coachingId }: CalendlyPopupProps) {
  const [calendlyUrl, setCalendlyUrl] = useState("")
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        setIsLoading(true)
        try {
          const profileResult = await getUserProfile(user.uid)
          if (profileResult.success && profileResult.data) {
            setUserProfile(profileResult.data)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (isOpen && user) {
      fetchUserProfile()
    }
  }, [user, isOpen])

  useEffect(() => {
    if (isLoading) return

    // Set the Calendly URL with UTM parameters and prefill information
    const url = "https://calendly.com/beingconsultant/1on1coaching"
    
    // Add UTM parameters and prefill information
    const urlWithParams = new URL(url)
    urlWithParams.searchParams.append("utm_source", "coaching_platform")
    urlWithParams.searchParams.append("utm_medium", "dashboard")
    urlWithParams.searchParams.append("utm_campaign", "session_scheduling")
    
    // Add prefill information for coaching program
    urlWithParams.searchParams.append("a1", coachingId) // Custom answer for tracking the coaching ID
    
    // Add user information from profile
    if (userProfile) {
      // Get full name from profile or use displayName as fallback
      let fullName = ""
      if (userProfile.firstName && userProfile.lastName) {
        fullName = `${userProfile.firstName} ${userProfile.lastName}`
      } else if (userProfile.displayName) {
        fullName = userProfile.displayName
      } else if (user?.displayName) {
        fullName = user.displayName
      }
      
      // Get email from profile or use user email as fallback
      const email = userProfile.email || user?.email || ""
      
      // Add name and email to Calendly URL
      if (fullName) urlWithParams.searchParams.append("name", fullName)
      if (email) urlWithParams.searchParams.append("email", email)
      
      // Add program name as a custom answer
      urlWithParams.searchParams.append("a2", programName)
    }
    
    setCalendlyUrl(urlWithParams.toString())
  }, [programName, coachingId, userProfile, isLoading, user])

  // Add event listener for custom Calendly event
  useEffect(() => {
    const handleCustomEvent = (e: any) => {
      // Extract event details from the custom event
      const scheduledEvent = e.detail
      console.log("[Calendly] Event scheduled - raw event:", scheduledEvent)
      
      // Ensure we have a valid payload structure
      if (!scheduledEvent) {
        console.error("[Calendly] Invalid event data received")
        toast.error("Invalid scheduling data received. Please try again.")
        return
      }
      
      // Create a properly structured event object
      try {
        // Prepare the event object with the necessary fields
        const processedEvent = {
          event: {
            // Try to extract the start time from the payload
            start_time: scheduledEvent.event?.start_time || 
                       scheduledEvent.event?.startTime || 
                       scheduledEvent.scheduled_time || 
                       scheduledEvent.invitee?.start_time,
            uri: scheduledEvent.uri || scheduledEvent.event?.uri,
            // Include all original data for debugging
            original: scheduledEvent
          },
          invitee: {
            uri: scheduledEvent.invitee?.uri,
            name: scheduledEvent.invitee?.name,
            email: scheduledEvent.invitee?.email,
            timezone: scheduledEvent.invitee?.timezone
          },
          // Include the raw payload for complete access to all fields
          payload: scheduledEvent
        }
        
        console.log("[Calendly] Processed event data:", processedEvent)
        
        // Call the onScheduled callback with the processed event details
        onScheduled(processedEvent)
        
        // Show success message
        toast.success("Session scheduled successfully!")
        
        // Close the dialog after a short delay
        setTimeout(() => {
          onClose()
        }, 1500)
      } catch (error) {
        console.error("[Calendly] Error processing event data:", error)
        toast.error("Error processing scheduling data. Please try again.")
      }
    }
    
    // Listen for the custom event
    window.addEventListener("calendlyEventScheduled", handleCustomEvent)
    
    return () => {
      window.removeEventListener("calendlyEventScheduled", handleCustomEvent)
    }
  }, [onScheduled, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] max-h-[70vh] p-0 border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl overflow-hidden relative">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 hover:bg-muted"
          aria-label="Close scheduler"
        >
          <X className="h-5 w-5" />
        </Button>
        <DialogHeader className="absolute z-50 sr-only">
          <DialogTitle>Schedule Your Session</DialogTitle>
        </DialogHeader>
        {/* Render Calendly widget only when we have a valid scheduling URL */}
        {calendlyUrl ? (
          <>
            <div
              className="calendly-inline-widget w-full"
              data-url={calendlyUrl}
              style={{ minWidth: "320px", height: "550px" }}
            />
            {/* Load Calendly script */}
            <Script
              type="text/javascript"
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="afterInteractive"
            />
          </>
        ) : (
          // Simple placeholder while we build the URL
          <div className="flex items-center justify-center w-full h-[700px] bg-muted/20">
            <span className="text-muted-foreground">Preparing scheduler…</span>
          </div>
        )}
        
        {/* Script to listen for Calendly events with enhanced debugging */}
        <Script id="calendly-listener" strategy="afterInteractive">
          {`
            window.addEventListener('message', function(e) {
              // Log all messages from Calendly for debugging
              if (e.data && e.data.event && e.data.event.indexOf('calendly') === 0) {
                console.log('[Calendly Debug] Received message:', e.data.event, e.data);
                
                const eventName = e.data.event.split('.')[1];
                if (eventName === 'event_scheduled') {
                  console.log('[Calendly Debug] Event scheduled - full payload:', JSON.stringify(e.data, null, 2));
                  
                  // Create a more comprehensive payload with all available data
                  const fullPayload = {
                    ...e.data.payload,
                    event: e.data.payload.event || {},
                    invitee: e.data.payload.invitee || {},
                    questions_and_answers: e.data.payload.questions_and_answers || [],
                    tracking: e.data.payload.tracking || {},
                    _rawData: e.data
                  };
                  
                  // Dispatch the event with the enhanced payload
                  window.dispatchEvent(new CustomEvent('calendlyEventScheduled', { 
                    detail: fullPayload 
                  }));
                }
              }
            });
          `}
        </Script>
      </DialogContent>
    </Dialog>
  )
}
