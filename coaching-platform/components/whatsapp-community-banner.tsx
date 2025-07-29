"use client"

import { useState, useEffect } from "react"
import { X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/firebase/auth-context"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useSidebar } from "@/components/ui/sidebar"

export function WhatsAppCommunityBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const { user } = useAuth()
  const { state: sidebarState } = useSidebar()
  
  useEffect(() => {
    // Only show for logged in users
    if (!user?.uid) return
    
    const checkBannerDismissed = async () => {
      try {
        // Check if user has dismissed the banner before
        const userPrefsRef = doc(db, "users", user.uid, "preferences", "notifications")
        const userPrefs = await getDoc(userPrefsRef)
        
        if (userPrefs.exists()) {
          const { whatsappBannerDismissed } = userPrefs.data()
          setIsVisible(!whatsappBannerDismissed)
        } else {
          // If no preferences exist yet, show the banner
          setIsVisible(true)
        }
      } catch (error) {
        console.error("Error checking banner preferences:", error)
        // Default to showing the banner if there's an error
        setIsVisible(true)
      }
    }
    
    checkBannerDismissed()
  }, [user])
  
  const dismissBanner = async () => {
    if (!user?.uid) return
    
    try {
      // Save the user's preference to dismiss the banner
      const userPrefsRef = doc(db, "users", user.uid, "preferences", "notifications")
      await setDoc(userPrefsRef, {
        whatsappBannerDismissed: true
      }, { merge: true })
      
      setIsVisible(false)
    } catch (error) {
      console.error("Error saving banner preferences:", error)
    }
  }
  
  if (!isVisible) return null
  
  return (
    <div className={`relative bg-gradient-to-r from-[#25D366]/10 via-[#25D366]/15 to-[#25D366]/10 border-b border-[#25D366]/20 py-3 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${sidebarState === "expanded" ? "ml-[280px]" : "ml-[80px]"}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366]/20">
            <MessageSquare className="h-4 w-4 text-[#25D366]" />
          </div>
          <p className="ml-3 text-sm font-medium">
            Join our WhatsApp community for exclusive updates and support!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="https://link.beingconsultant.com/communityjoining" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              size="sm" 
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              Join Now
            </Button>
          </Link>
          <button
            type="button"
            className="inline-flex rounded-md p-1 text-gray-500 hover:bg-gray-100 focus:outline-none"
            onClick={dismissBanner}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
