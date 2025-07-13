"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth-context"
import { trackResourceAccess } from "@/lib/utils/track-resource-access"

interface VideoPlayerDialogProps {
  videoUrl: string
  videoTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  masterclassId?: string
}

export function VideoPlayerDialog({ videoUrl, videoTitle, open, onOpenChange, masterclassId }: VideoPlayerDialogProps) {
  const [hasTrackedAccess, setHasTrackedAccess] = useState(false)
  const { user } = useAuth()
  // Track resource access when the dialog opens
  useEffect(() => {
    const trackAccess = async () => {
      console.log("[VideoPlayer] Video player dialog state:", { 
        open, 
        userId: user?.uid || 'no user', 
        masterclassId: masterclassId || 'no id', 
        hasTrackedAccess, 
        hasVideoUrl: !!videoUrl 
      });
      
      if (!open) {
        console.log("[VideoPlayer] Dialog not open, skipping tracking");
        return;
      }
      
      if (!user) {
        console.log("[VideoPlayer] No user found, skipping tracking");
        return;
      }
      
      if (!masterclassId) {
        console.log("[VideoPlayer] No masterclass ID provided, skipping tracking");
        return;
      }
      
      if (hasTrackedAccess) {
        console.log("[VideoPlayer] Already tracked access for this session, skipping");
        return;
      }
      
      if (!videoUrl) {
        console.log("[VideoPlayer] No video URL provided, skipping tracking");
        return;
      }
      
      console.log("[VideoPlayer] ✅ All conditions met, tracking masterclass access:", masterclassId);
      console.log("[VideoPlayer] User ID:", user.uid);
      console.log("[VideoPlayer] Video title:", videoTitle);
      
      try {
        await trackResourceAccess(user.uid, {
          id: masterclassId,
          name: videoTitle,
          type: "masterclass"
        });
        console.log("[VideoPlayer] ✅ Successfully tracked resource access");
        setHasTrackedAccess(true);
      } catch (error) {
        console.error("[VideoPlayer] ❌ Error tracking resource access:", error);
        console.error("[VideoPlayer] Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      }
    };
    
    trackAccess();
  }, [open, user, masterclassId, videoUrl, videoTitle, hasTrackedAccess]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-5xl w-[95vw] max-h-[90vh] bg-black p-0 rounded-xl border border-gray-800 shadow-xl z-50">
        <DialogTitle className="sr-only">{videoTitle}</DialogTitle>
        
        {/* Close button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Video player */}
        <div className="relative w-full aspect-video">
          <iframe 
            src={videoUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoTitle}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
