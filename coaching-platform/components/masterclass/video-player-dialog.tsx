"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth-context"
import { trackResourceAccess } from "@/lib/utils/track-resource-access"

// Helper function to modify video URLs to disable download functionality
function getSecureVideoUrl(url: string): string {
  // For YouTube videos
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    // Extract video ID from YouTube URL
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('watch?v=')[1];
      // Remove any additional parameters
      if (videoId.includes('&')) {
        videoId = videoId.split('&')[0];
      }
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
      // Remove any additional parameters
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }
    
    if (videoId) {
      // Use YouTube embed URL with parameters to disable download options but keep fullscreen
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&iv_load_policy=3`;
    }
  }
  
  // For Vimeo videos
  if (url.includes('vimeo.com')) {
    // Extract Vimeo ID
    const vimeoRegex = /vimeo\.com\/(?:video\/)?([0-9]+)/;
    const match = url.match(vimeoRegex);
    
    if (match && match[1]) {
      const vimeoId = match[1];
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&pip=0&dnt=1&download=0`;
    }
    
    // If regex fails, add parameters to the original URL
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}autoplay=1&title=0&byline=0&portrait=0&pip=0&dnt=1&download=0`;
  }
  
  // For direct MP4 links - wrap in a custom player
  if (url.includes('.mp4')) {
    // Return the original URL, but we'll handle it with a custom video element
    return url;
  }
  
  // For Google Drive links
  if (url.includes('drive.google.com')) {
    // Convert to embed URL if it's a viewable link
    if (url.includes('/view')) {
      const fileId = url.match(/[-\w]{25,}/);
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId[0]}/preview`;
      }
    }
  }
  
  // Default case - return URL as is
  return url;
}

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
        
        {/* Video player with download protection */}
        <div 
          className="relative w-full aspect-video" 
          onContextMenu={(e) => e.preventDefault()}
        >
          {videoUrl.includes('.mp4') ? (
            /* Custom HTML5 video player for MP4 files with disabled downloads but enabled fullscreen */
            <video
              src={videoUrl}
              className="absolute inset-0 w-full h-full"
              controls
              controlsList="nodownload"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              style={{ pointerEvents: 'auto' }}
              autoPlay
              playsInline
            >
              <track kind="captions" />
              Your browser does not support the video tag.
            </video>
          ) : (
            /* Iframe for YouTube, Vimeo, etc. */
            <iframe 
              src={getSecureVideoUrl(videoUrl)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={videoTitle}
              style={{ pointerEvents: 'auto' }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
