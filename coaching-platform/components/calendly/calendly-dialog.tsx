"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Script from "next/script"

interface CalendlyDialogProps {
  isOpen: boolean
  onClose: () => void
  onScheduled: (scheduledInfo: any) => void
  programName: string
  coachingId: string
}

export function CalendlyDialog({ isOpen, onClose, onScheduled, programName, coachingId }: CalendlyDialogProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [calendlyUrl, setCalendlyUrl] = useState("")

  useEffect(() => {
    // Set the Calendly URL with UTM parameters and prefill information
    const url = "https://calendly.com/nischalcredmate/30min"
    
    // Add UTM parameters and prefill information
    const urlWithParams = new URL(url)
    urlWithParams.searchParams.append("utm_source", "coaching_platform")
    urlWithParams.searchParams.append("utm_medium", "dashboard")
    urlWithParams.searchParams.append("utm_campaign", "session_scheduling")
    
    // Add prefill information
    urlWithParams.searchParams.append("name", programName)
    urlWithParams.searchParams.append("a1", coachingId) // Custom answer for tracking the coaching ID
    
    setCalendlyUrl(urlWithParams.toString())
    setIsLoading(false)
  }, [programName, coachingId])

  // Handle Calendly events
  const handleCalendlyEvent = (e: any) => {
    if (e.data.event && e.data.event.indexOf("calendly") === 0) {
      const eventName = e.data.event.split(".")[1]
      
      if (eventName === "event_scheduled") {
        // Extract event details from the Calendly response
        const scheduledEvent = e.data.payload
        console.log("[Calendly] Event scheduled:", scheduledEvent)
        
        // Call the onScheduled callback with the event details
        onScheduled(scheduledEvent)
        
        // Show success message
        toast.success("Session scheduled successfully!")
        
        // Close the dialog after a short delay
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    }
  }

  // Add event listener for Calendly events
  useEffect(() => {
    window.addEventListener("message", handleCalendlyEvent)
    
    return () => {
      window.removeEventListener("message", handleCalendlyEvent)
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#245D66] via-gray-500 to-[#245D66] dark:from-[#7BA7AE] dark:via-gray-500 dark:to-[#7BA7AE]"></div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#245D66]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-[#245D66]/10 rounded-full blur-3xl -z-10"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl text-center pb-2 font-bold tracking-tight bg-gradient-to-r from-[#245D66] to-[#245D66] dark:from-[#7BA7AE] dark:to-[#7BA7AE] bg-clip-text text-transparent">Schedule Your Session</DialogTitle>
          <DialogDescription className="text-center">
            Select a date and time for your "{programName}" coaching session.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#245D66] dark:border-[#7BA7AE]"></div>
            </div>
          ) : (
            <>
              <div 
                className="calendly-inline-widget w-full" 
                data-url={calendlyUrl} 
                style={{minWidth: "320px", height: "700px"}}
              />
              <Script 
                type="text/javascript" 
                src="https://assets.calendly.com/assets/external/widget.js" 
                strategy="afterInteractive"
              />
            </>
          )}
        </div>
        
        <DialogFooter className="border-t border-[#245D66]/20 pt-4 flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
