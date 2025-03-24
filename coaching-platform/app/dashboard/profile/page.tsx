"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import { uploadFile, generateFilePath } from "@/lib/firebase/storage"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Upload, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  Filter, 
  Heart, 
  ChevronRight,
  Info,
  MessageCircle,
  Video
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || "Robert Smith")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoURL || null)
  const [currentMonth, setCurrentMonth] = useState("March")
  const [selectedDate, setSelectedDate] = useState(5)
  
  // Mock data for the UI
  const role = "Product Designer"
  const email = user?.email || "robertsmith94@gmail.com"
  const phone = "(943) 555-6474"
  const timeSlot = "April, 2024"
  const meetings = 3
  const ongoingProjects = [
    { 
      name: "Web Designing", 
      date: "March 05, 2024", 
      status: "Prototyping", 
      progress: 45, 
      team: ["A", "B", "C"],
      daysLeft: 2
    },
    { 
      name: "Mobile App", 
      date: "March 08, 2024", 
      status: "Design", 
      progress: 65, 
      team: ["D", "E", "F"],
      daysLeft: 3
    },
    { 
      name: "Dashboard", 
      date: "March 12, 2024", 
      status: "Wireframe", 
      progress: 25, 
      team: ["G", "H", "I"],
      daysLeft: 5
    }
  ]
  
  const inboxMessages = [
    {
      sender: "Web Designing",
      avatar: "W",
      message: "Hey tell me about progress of project? Waiting for your response",
      time: "2h ago"
    },
    {
      sender: "Stephanie",
      avatar: "S",
      message: "I got your first assignment. It was quite good!",
      time: "4h ago"
    },
    {
      sender: "William",
      avatar: "W",
      message: "I want some changes to previous work you delivered. Will pay extra",
      time: "Yesterday"
    }
  ]
  
  // Calendar data
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1 <= 31 ? i + 1 : null)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoFile(file)
    
    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      let photoURL = user.photoURL

      // Upload new photo if selected
      if (photoFile) {
        const path = generateFilePath(user.uid, photoFile.name, "profile")
        const result = await uploadFile(photoFile, path)
        
        if (result.success) {
          photoURL = result.url
        } else {
          throw new Error("Failed to upload profile photo")
        }
      }

      // Update profile
      await updateUserProfile(displayName, photoURL || null)
      
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-5 bg-black text-white min-h-screen">
      {/* Back button and status */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="mr-1" size={20} />
          <span className="text-lg font-medium">My Profile</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-gray-400">Pending</span>
          <span className="text-gray-400">|</span>
          <span>{currentMonth}, 2024</span>
          <button className="ml-2 text-gray-300 hover:text-white">
            <Calendar size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left column - Profile info */}
        <div className="space-y-5">
          {/* Profile card */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative p-6">
                <div className="flex justify-between">
                  <Avatar className="w-20 h-20 border-2 border-primary/20">
                    <AvatarImage src={photoPreview || ""} alt={displayName} />
                    <AvatarFallback className="bg-amber-500 text-black text-2xl">
                      {displayName ? displayName.charAt(0).toUpperCase() : <User size={32} />}
                    </AvatarFallback>
                  </Avatar>
                  <button className="text-gray-400 hover:text-white">
                    <Info size={20} />
                  </button>
                </div>
                
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">{displayName}</h2>
                  <p className="text-gray-400">{role}</p>
                </div>
                
                <div className="flex mt-5 space-x-4">
                  <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <Mail size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <MessageCircle size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <Video size={18} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Time Slots */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Time Slots</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">{timeSlot}</div>
                <button className="text-gray-400 hover:text-white">
                  <Calendar size={18} />
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Meetings */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Meetings</CardTitle>
                <Badge className="bg-zinc-800 text-white hover:bg-zinc-700">{meetings}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Meeting content would go here */}
            </CardContent>
          </Card>
          
          {/* Detailed Information */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Detailed Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Full Name</p>
                  <p className="font-medium">{displayName}</p>
                </div>
                <Badge className="bg-green-900 text-green-300 hover:bg-green-800">Online</Badge>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                  <Mail size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="font-medium">{email}</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Mail size={16} />
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                  <Phone size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Contact Number</p>
                  <p className="font-medium">{phone}</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Phone size={16} />
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                  <Briefcase size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Designation</p>
                  <p className="font-medium">{role}</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Info size={16} />
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-3">
                  <Clock size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Availability</p>
                  <p className="font-medium">Schedule the time slot</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Calendar size={16} />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Middle column - Projects */}
        <div className="space-y-5">
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Ongoing Projects</CardTitle>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <Heart size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <Filter size={16} />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ongoingProjects.map((project, index) => (
                <div key={index} className="p-4 bg-zinc-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-400">{project.date}</div>
                    <button className="text-gray-400 hover:text-white">
                      <Info size={16} />
                    </button>
                  </div>
                  
                  <h3 className="font-medium mb-2">{project.name}</h3>
                  
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-amber-900/30 text-amber-300 hover:bg-amber-900/50">
                      {project.status}
                    </Badge>
                    <Badge className="bg-zinc-700 text-white hover:bg-zinc-600">
                      Progress
                    </Badge>
                  </div>
                  
                  <Progress value={project.progress} className="h-1.5 mb-3" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {project.team.map((member, i) => (
                        <Avatar key={i} className="w-6 h-6 border border-zinc-800">
                          <AvatarFallback className="bg-amber-500 text-black text-xs">
                            {member}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Badge className="bg-zinc-700 text-white hover:bg-zinc-600">
                      {project.daysLeft} days left
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Calendar */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Calendar</CardTitle>
                <button className="text-gray-400 hover:text-white">
                  <Info size={16} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <button className="text-gray-400 hover:text-white">
                  <ChevronLeft size={18} />
                </button>
                <h3 className="font-medium">{currentMonth}</h3>
                <button className="text-gray-400 hover:text-white">
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day, i) => (
                  <div key={i} className="text-center text-xs text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <div 
                    key={i} 
                    className={`
                      h-8 flex items-center justify-center rounded-full text-sm
                      ${!day ? 'invisible' : ''}
                      ${day === selectedDate ? 'bg-red-500 text-white' : 'hover:bg-zinc-800 cursor-pointer'}
                      ${day === 8 ? 'bg-blue-500/20 text-blue-300' : ''}
                      ${day === 12 ? 'bg-red-500/20 text-red-300' : ''}
                      ${day === 27 ? 'bg-amber-500/20 text-amber-300' : ''}
                    `}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Inbox */}
        <div className="space-y-5">
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Inbox</CardTitle>
                <Badge className="bg-zinc-800 text-white hover:bg-zinc-700">3</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {inboxMessages.map((message, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-zinc-800/50 rounded-lg transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-amber-500 text-black text-xs">
                      {message.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm truncate">{message.sender}</h4>
                      <button className="text-gray-400 hover:text-white ml-2">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{message.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
