"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Clock, Star, Users, BookOpen, Play, Download, Eye, FileText } from "lucide-react"
import { VideoPlayerDialog } from "./video-player-dialog"

interface LearningDialogProps {
  masterclass: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LearningDialog({ masterclass, open, onOpenChange }: LearningDialogProps) {
  // State for video player dialog
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState({ url: '', title: '' })
  
  // When dialog opens, scroll to top of page
  const handleOpenChange = (open: boolean) => {
    if (open) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    onOpenChange(open)
  }
  
  // Handle opening video player
  const handlePlayVideo = (url: string, title: string) => {
    setCurrentVideo({ url, title })
    setVideoPlayerOpen(true)
  }

  if (!masterclass) return null

  return (
    <>
      <VideoPlayerDialog 
        videoUrl={currentVideo.url}
        videoTitle={currentVideo.title}
        open={videoPlayerOpen}
        onOpenChange={setVideoPlayerOpen}
        masterclassId={masterclass.id}
      />
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-4xl w-[90vw] max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 p-0 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl z-50">
        <DialogTitle className="sr-only">{masterclass.title || 'Masterclass Learning Resources'}</DialogTitle>
        {/* Decorative elements */}
        <div className="absolute -z-10 top-0 right-0 w-[300px] h-[300px] bg-[#245D66]/10 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 bottom-0 left-0 w-[300px] h-[300px] bg-[#245D66]/10 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-[#245D66]">{masterclass.title}</h2>
          <p className="text-gray-500 dark:text-gray-400">Start your learning journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left column: Cover image */}
          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
            {masterclass.thumbnail ? (
              <Image
                src={masterclass.thumbnail}
                alt={masterclass.title || 'Masterclass cover image'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover bg-gray-900 transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 text-center">
                <Play className="h-16 w-16 text-gray-500 hover:scale-110 transition-transform duration-300 mb-3" />
                <h4 className="text-[#245D66] text-sm font-medium line-clamp-2 bg-white/90 px-3 py-1 rounded transition-colors duration-300">
                  {masterclass.title}
                </h4>
              </div>
            )}
            
            {/* Overlay title for image */}
            {masterclass.thumbnail && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <h4 className="text-white text-xs font-medium line-clamp-2">
                  {masterclass.title}
                </h4>
              </div>
            )}
          </div>
          
          {/* Right column: Description and metadata */}
          <div className="md:col-span-2 flex flex-col">
            {/* Metadata */}
            <div className="flex flex-wrap gap-2 mb-4">
              {masterclass.category && (
                <Badge variant="outline" className="bg-[#245D66]/10 text-[#245D66] border-[#245D66]/20">
                  {masterclass.category}
                </Badge>
              )}
              {masterclass.level && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                  {masterclass.level}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{masterclass.duration || ''}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{masterclass.rating || ''}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{masterclass.students ? `${masterclass.students.toLocaleString()} students` : ''}</span>
              </div>
            </div>
            
            {/* Instructor */}
            {masterclass.instructor && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Instructor</h4>
                <p className="text-base font-medium">{masterclass.instructor}</p>
              </div>
            )}
            
            {/* Description */}
            <div className="mb-6">
              {/* 'About this masterclass' heading removed for cleaner UI */}
              <p className="text-gray-700 dark:text-gray-300">{masterclass.description}</p>
            </div>
            
            {/* Learning resources */}
            <div className="mt-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Learning Resources</h4>
              
              {/* Main video resources */}
              {masterclass.productlinks && masterclass.productlinks.length > 0 ? (
                // Map through all video links
                masterclass.productlinks.map((link: string, index: number) => {
                  // Only process video links
                  if (link.includes('.mp4') || link.includes('youtube.com') || link.includes('vimeo.com')) {
                    const videoName = `${masterclass.title} ${masterclass.productlinks.length > 1 ? `Part ${index + 1}` : ''}`;
                    
                    return (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="bg-[#245D66]/10 p-3 rounded-lg">
                            <Play className="h-6 w-6 text-[#245D66]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {videoName}
                            </h4>
                            {/* File path display removed for cleaner UI */}
                          </div>
                        </div>
                        
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mt-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <div className="text-center p-6">
                            <Play className="h-12 w-12 text-[#245D66] mx-auto mb-3 animate-pulse" />
                            <h4 className="text-lg font-medium mb-2">{videoName}</h4>
                            <Button 
                              className="bg-[#245D66] hover:bg-[#1a474f] text-white"
                              onClick={() => handlePlayVideo(link, videoName)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Learning
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                // Fallback if no videos are available
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="bg-[#245D66]/10 p-3 rounded-lg">
                      <Play className="h-6 w-6 text-[#245D66]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {masterclass.title} Video
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full masterclass video</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#245D66] text-[#245D66] hover:bg-[#245D66]/10"
                      onClick={() => {
                        alert('Video is not available at this time.');
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start Learning
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Additional resources */}
              {masterclass.resources && masterclass.resources.length > 0 && (
                <div className="space-y-3">
                  {masterclass.resources.map((resource: any, index: number) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#245D66]/10 p-3 rounded-lg">
                          <FileText className="h-6 w-6 text-[#245D66]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {resource.title || `Resource ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {resource.description || 'Supplementary material'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {resource.viewLink && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-[#245D66] text-[#245D66] hover:bg-[#245D66]/10"
                            onClick={() => {
                              const link = resource.viewLink;
                              window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(link)}&embedded=true`, '_blank');
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                        {resource.downloadLink && (
                          <Button 
                            size="sm" 
                            className="bg-[#245D66] hover:bg-[#1a474f] text-white"
                            onClick={() => window.open(resource.downloadLink, '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
