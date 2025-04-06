"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Calendar, Clock, FileText, MessageSquare, Star, TrendingUp, Users, X, Download, BookOpen, Play } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserProfile, getUserCoachingPrograms } from "@/lib/firebase/firestore"
import { useRouter } from "next/navigation"

// Define interface for coaching program
interface CoachingProgram {
  id: string;
  programId: string;
  programName: string;
  amountPaid: number;
  currency: string;
  transactionId: string;
  paymentMethod: 'razorpay' | 'stripe';
  enrollmentDate: string | Date;
  paymentDate: string | Date;
  status: string;
  scheduledDate?: string | Date;
  metadata?: {
    description?: string;
    [key: string]: any;
  };
  [key: string]: any; // Allow other properties
}

const DashboardPage = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)
  const [userName, setUserName] = useState("User")
  const [coachingPrograms, setCoachingPrograms] = useState<CoachingProgram[]>([])
  const [isLoadingCoaching, setIsLoadingCoaching] = useState(true)
  const [sessionMessage, setSessionMessage] = useState("")
  const [hasCoaching, setHasCoaching] = useState(false)
  const [upcomingSessions, setUpcomingSessions] = useState(0)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Show welcome modal after a delay
    const timer = setTimeout(() => {
      setShowWelcomeModal(true)
    }, 500)

    // Set loading state for animations
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    // Trigger staggered animations
    const staggerInterval = setInterval(() => {
      setAnimationStage(prev => {
        if (prev < 5) return prev + 1
        clearInterval(staggerInterval)
        return prev
      })
    }, 150)

    // Fetch user profile data
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profileResult = await getUserProfile(user.uid)
          if (profileResult.success && profileResult.data) {
            const userData = profileResult.data
            // Use firstName if available, otherwise use displayName or email
            if (userData.firstName) {
              setUserName(userData.firstName)
            } else if (userData.displayName) {
              // Extract first name from display name
              const nameParts = userData.displayName.split(' ')
              setUserName(nameParts[0] || "User")
            } else if (user.displayName) {
              // Fallback to Firebase user displayName
              const nameParts = user.displayName.split(' ')
              setUserName(nameParts[0] || "User")
            } else if (user.email) {
              // Fallback to email username
              const emailParts = user.email.split('@')
              setUserName(emailParts[0] || "User")
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      }
    }

    // Fetch user's coaching programs
    const fetchCoachingPrograms = async () => {
      if (user) {
        setIsLoadingCoaching(true)
        try {
          const coachingResult = await getUserCoachingPrograms(user.uid)
          if (coachingResult.success) {
            const coachingData = coachingResult.data || [];
            setCoachingPrograms(coachingData);
            setHasCoaching(coachingData.length > 0);
            
            // If user has coaching programs, check for scheduled dates
            if (coachingData.length > 0) {
              updateSessionMessage(coachingData);
            } else {
              setSessionMessage("Book your first coaching session to start your journey.");
            }
          }
        } catch (error) {
          console.error("Error fetching coaching programs:", error);
        } finally {
          setIsLoadingCoaching(false);
        }
      }
    }

    // Update session message based on upcoming or past sessions
    const updateSessionMessage = (coachingData: CoachingProgram[]) => {
      const now = new Date();
      console.log("Current date (local):", now.toLocaleString());
      console.log("Updating session message with coaching data:", coachingData);
      
      // Helper function to parse dates consistently
      const parseScheduledDate = (scheduledDate: any): Date => {
        if (!scheduledDate) return new Date(0);
        
        // Handle Firestore Timestamp object
        if (typeof scheduledDate === 'object' && scheduledDate.seconds) {
          const milliseconds = scheduledDate.seconds * 1000 + (scheduledDate.nanoseconds || 0) / 1000000;
          return new Date(milliseconds);
        }
        
        // Handle string dates
        if (typeof scheduledDate === 'string') {
          try {
            // First try direct parsing
            const date = new Date(scheduledDate);
            if (!isNaN(date.getTime())) return date;
            
            // Try parsing UTC format
            if (scheduledDate.includes('UTC')) {
              const match = scheduledDate.match(/(\w+ \d+, \d+) at (\d+:\d+:\d+ [AP]M) UTC([+-]\d+:\d+)/);
              if (match) {
                const [_, datePart, timePart, timezone] = match;
                return new Date(`${datePart} ${timePart} GMT${timezone}`);
              }
            }
          } catch (error) {
            console.error("Error parsing date:", error);
          }
        }
        
        // Return epoch time as fallback
        return new Date(0);
      };

      // Helper function to calculate days between dates
      const getDaysDifference = (date1: Date, date2: Date): number => {
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
        // Use UTC to avoid timezone issues
        const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return Math.floor((utc2 - utc1) / oneDay);
      };

      // Filter and sort future coaching sessions
      const futureCoachingSessions = coachingData
        .filter((program: CoachingProgram) => {
          if (!program.scheduledDate) return false;
          const sessionDate = parseScheduledDate(program.scheduledDate);
          return sessionDate.getTime() > now.getTime();
        })
        .sort((a: CoachingProgram, b: CoachingProgram) => {
          const dateA = parseScheduledDate(a.scheduledDate);
          const dateB = parseScheduledDate(b.scheduledDate);
          return dateA.getTime() - dateB.getTime();
        });

      // Update the number of upcoming sessions
      setUpcomingSessions(futureCoachingSessions.length);

      // Filter and sort past coaching sessions
      const pastCoachingSessions = coachingData
        .filter((program: CoachingProgram) => {
          if (!program.scheduledDate) return false;
          const sessionDate = parseScheduledDate(program.scheduledDate);
          return sessionDate.getTime() <= now.getTime();
        })
        .sort((a: CoachingProgram, b: CoachingProgram) => {
          const dateA = parseScheduledDate(a.scheduledDate);
          const dateB = parseScheduledDate(b.scheduledDate);
          return dateB.getTime() - dateA.getTime(); // Sort in descending order for past sessions
        });

      if (futureCoachingSessions.length > 0) {
        const nextSession = futureCoachingSessions[0];
        const sessionDate = parseScheduledDate(nextSession.scheduledDate);
        const daysUntil = getDaysDifference(now, sessionDate);
        
        let timeMessage;
        if (daysUntil === 0) {
          timeMessage = "today";
        } else if (daysUntil === 1) {
          timeMessage = "tomorrow";
        } else {
          timeMessage = `in ${daysUntil} days`;
        }
        
        setSessionMessage(`Your next session for ${nextSession.programName} is ${timeMessage}`);
        
      } else if (pastCoachingSessions.length > 0) {
        const lastSession = pastCoachingSessions[0];
        const sessionDate = parseScheduledDate(lastSession.scheduledDate);
        const daysSince = getDaysDifference(sessionDate, now);
        
        let timeMessage;
        if (daysSince === 0) {
          timeMessage = "today";
        } else if (daysSince === 1) {
          timeMessage = "yesterday";
        } else {
          timeMessage = `${daysSince} days ago`;
        }
        
        setSessionMessage(`Your last session for ${lastSession.programName} was ${timeMessage}`);
      } else {
        setSessionMessage("No sessions scheduled yet");
      }
    };

    fetchUserProfile()
    fetchCoachingPrograms()

    return () => {
      clearTimeout(timer)
      clearInterval(staggerInterval)
    }
  }, [user])

  useEffect(() => {
    if (sessionMessage) {
      console.log("Session Message:", sessionMessage);
      console.log("Contains 'Book your first':", sessionMessage.includes("Book your first coaching session"));
      console.log("Contains 'Schedule your first':", sessionMessage.includes("Schedule your first coaching session"));
      console.log("Condition result:", sessionMessage && (
        sessionMessage.includes("Book your first coaching session") || 
        sessionMessage.includes("Schedule your first coaching session")
      ));
    }
  }, [sessionMessage])

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false)
  }

  // Format date for display
  const formatDate = (date: string | number | Date | undefined) => {
    if (!date) return 'N/A'
    
    try {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return 'Invalid date'
    }
  }

  // Format currency for display
  const formatCurrency = (amount: string | number | bigint | null | undefined, currency = 'INR') => {
    if (amount === undefined || amount === null) return 'N/A'
    
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
      }).format(amount)
    } catch (error) {
      console.error("Error formatting currency:", error)
      return `${amount} ${currency}`
    }
  }

  return (
    <>
      <div className={`space-y-6 opacity-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : ''}`}>
        <div className={`relative transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Decorative background elements with enhanced animations */}
          <div className="absolute -top-4 -left-6 w-72 h-72 bg-gradient-to-br from-black/10 to-black/5 rounded-full blur-3xl -z-10 dark:from-white/10 dark:to-white/5 animate-pulse-glow"></div>
          <div className="absolute top-10 right-20 w-36 h-36 bg-gradient-to-br from-black/5 to-gray-500/10 rounded-full blur-3xl -z-10 dark:from-white/5 dark:to-gray-400/10 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-gradient-to-tr from-black/5 to-gray-500/5 rounded-full blur-3xl -z-10 dark:from-white/5 dark:to-gray-400/5 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
          
          {/* Modern welcome header with enhanced styling */}
          <div className="relative z-10 p-6 rounded-2xl welcome-gradient welcome-shadow welcome-border-gradient overflow-hidden animate-gradient-flow transition-all duration-500">
            {/* Decorative accent line with animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/50 to-transparent dark:via-white/50 animate-border-shine"></div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent dark:via-white/30 animate-border-shine" style={{ animationDelay: '1.5s' }}></div>
            
            {/* Subtle light effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/5 dark:bg-white/10 blur-2xl animate-pulse-glow"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white/5 dark:bg-white/10 blur-2xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
            
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-1 bg-gradient-to-b from-black/80 to-black/40 dark:from-white/80 dark:to-white/40 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.4)] dark:shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-pulse-glow"></div>
                  <h2 className="text-3xl font-bold tracking-tight welcome-text-gradient animate-gradient-flow">Welcome back, {userName}!</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-base max-w-md relative z-10">
                  {sessionMessage ? (
                    sessionMessage.includes("Book your first coaching session") || 
                    sessionMessage.includes("Schedule your first coaching session") ? (
                      <span className="font-medium text-black dark:text-white relative inline-block animate-float">{sessionMessage}</span>
                    ) : (
                      <>
                        Here's what's happening with your consulting journey today.{" "}
                        <span className="font-medium text-black dark:text-white ml-1 relative inline-block animate-float">{sessionMessage}</span>
                      </>
                    )
                  ) : null}
                </p>
                
                {/* Quick stats summary with enhanced styling */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 group/stat transition-all duration-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/5 dark:from-white/20 dark:to-white/5 shadow-sm group-hover:shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-300">
                      <Clock className="h-4 w-4 text-black dark:text-white transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming</p>
                      <p className="text-sm font-semibold welcome-text-gradient animate-gradient-flow">
                        {upcomingSessions} {upcomingSessions === 1 ? 'Session' : 'Sessions'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {upcomingSessions > 0 ? (
                  <Button className="relative overflow-hidden group font-medium">
                    <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 dark:from-white/80 dark:via-white/60 dark:to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-flow"></span>
                    <Clock className="mr-2 h-4 w-4 relative z-10 transition-transform duration-300" />
                    <span>Join Session</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={() => router.push('/dashboard/coaching')} 
                    className="relative overflow-hidden group font-medium"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 dark:from-white/80 dark:via-white/60 dark:to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-flow"></span>
                    <Calendar className="mr-2 h-4 w-4 relative z-10 transition-transform duration-300" />
                    <span>Book a Session</span>
                  </Button>
                )}
                {upcomingSessions > 1 && (
                  <Button variant="outline" className="font-medium group hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300">
                    <Users className="mr-2 h-4 w-4 text-black dark:text-white transition-transform duration-300" />
                    <span>View All Sessions</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-black/40 dark:border-white/40">
            <TabsList className="border-none bg-transparent h-10 p-0 relative w-full">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/40 dark:bg-white/40"></div>
              <TabsTrigger 
                value="overview" 
                className="relative h-10 px-4 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black dark:data-[state=active]:text-white group transition-all duration-300"
              >
                <span>Overview</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-white scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="relative h-10 px-4 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black dark:data-[state=active]:text-white group transition-all duration-300"
              >
                <span>Upcoming Sessions</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-white scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="relative h-10 px-4 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black dark:data-[state=active]:text-white group transition-all duration-300"
              >
                <span>Resources</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-white scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300"></span>
              </TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="h-8 gap-1 group border-black/20 dark:border-white/20 hover:border-black/50 dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300">
                <Download className="h-3.5 w-3.5 text-black dark:text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                <span>Export</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                <BarChart className="h-4 w-4" />
                <span className="sr-only">Show chart view</span>
              </Button>
            </div>
          </div>

          <TabsContent 
            value="overview" 
            className="w-full space-y-4 pt-1 data-[state=active]:animate-fadeIn"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-[#245D66] text-white p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#245D66]/10 rounded-full blur-2xl transform translate-x-16 -translate-y-8"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-[#245D66]/10 rounded-lg">
                      <FileText className="h-6 w-6 text-[#245D66]" />
                    </div>
                    <h3 className="text-lg font-semibold">Coaching Sessions</h3>
                  </div>
                  <button className="text-white/60 hover:text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="currentColor"/>
                      <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="currentColor"/>
                      <path d="M19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-white/60">Available</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Used</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-6">Be prepared to answer any question that can come your way, with clarity.</p>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/coaching')} 
                  className="w-full bg-transparent border-white/20 hover:bg-white/10 text-white"
                >
                  Book a Session
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-2 h-4 w-4">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </Card>

              <Card className="bg-[#245D66] text-white p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#245D66]/10 rounded-full blur-2xl transform translate-x-16 -translate-y-8"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-[#245D66]/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-[#245D66]" />
                    </div>
                    <h3 className="text-lg font-semibold">AI Mock Practice</h3>
                  </div>
                  <button className="text-white/60 hover:text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="currentColor"/>
                      <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="currentColor"/>
                      <path d="M19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-white/60">Available</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Used</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-6">Practice with our AI to improve your consulting skills and confidence.</p>
                <Button variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/10 text-white">
                  Start Practice
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-2 h-4 w-4">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </Card>

              <Card className="bg-[#245D66] text-white p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#245D66]/10 rounded-full blur-2xl transform translate-x-16 -translate-y-8"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-[#245D66]/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-[#245D66]" />
                    </div>
                    <h3 className="text-lg font-semibold">Toolkit Purchases</h3>
                  </div>
                  <button className="text-white/60 hover:text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="currentColor"/>
                      <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="currentColor"/>
                      <path d="M19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-white/60">Available</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Used</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-6">Nervousness is a given, but you learn how to best deal with it.</p>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/resources')}
                  className="w-full bg-transparent border-white/20 hover:bg-white/10 text-white"
                >
                  Browse Toolkits
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-2 h-4 w-4">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent 
            value="upcoming" 
            className="w-full space-y-4 pt-1 data-[state=active]:animate-fadeIn"
          >
            <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp">
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled coaching and training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4 hover:bg-black/5 p-2 rounded-lg transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Case Interview Practice</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Group Session • 8 participants</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Tomorrow, 2:00 PM</div>
                      <Button variant="outline" size="sm" className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300">
                        Join
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4 hover:bg-black/5 p-2 rounded-lg transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">CV Review Session</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1:1 Coaching • 45 minutes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Friday, 10:00 AM</div>
                      <Button variant="outline" size="sm" className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300">
                        Join
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between hover:bg-black/5 p-2 rounded-lg transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Consulting Industry Insights</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Webinar • 120 participants
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Next Monday, 6:00 PM</div>
                      <Button variant="outline" size="sm" className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coaching Programs Card */}
            <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp">
              <CardHeader>
                <CardTitle>Your Coaching Programs</CardTitle>
                <CardDescription>Programs you've enrolled in</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCoaching ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#245D66] dark:border-[#7BA7AE]"></div>
                  </div>
                ) : coachingPrograms.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#245D66]/20 to-[#245D66]/10">
                      <BookOpen className="h-6 w-6 text-[#245D66] dark:text-[#7BA7AE]" />
                    </div>
                    <h3 className="text-lg font-medium">No coaching programs yet</h3>
                    <p className="text-sm text-[#245D66]/80 dark:text-[#7BA7AE]/80 mt-2 max-w-md mx-auto">
                      You haven't enrolled in any coaching programs yet. Browse our programs to get started on your consulting journey.
                    </p>
                    <Button 
                      onClick={() => router.push('/dashboard/resources')}
                      className="mt-4 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/80 to-[#245D66]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative">Browse Programs</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coachingPrograms.map((program: CoachingProgram) => (
                      <div key={program.id} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 hover:bg-black/5 p-3 rounded-lg transition-colors duration-200">
                        <div className="space-y-2 mb-3 md:mb-0">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#245D66]/10">
                              <BookOpen className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-none">{program.programName}</p>
                              <div className="flex items-center mt-1 text-xs text-[#245D66]/80 dark:text-[#7BA7AE]/80">
                                <span className="flex items-center">
                                  <Clock className="mr-1 h-3.5 w-3.5" /> Enrolled: {formatDate(program.enrollmentDate)}
                                </span>
                                <span className="mx-2">•</span>
                                <span>Payment: {formatCurrency(program.amountPaid, program.currency)}</span>
                              </div>
                            </div>
                          </div>
                          {program.metadata && program.metadata.description && (
                            <p className="text-xs text-[#245D66]/80 dark:text-[#7BA7AE]/80 pl-13">
                              {program.metadata.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs px-2 py-1 rounded-full bg-[#245D66]/20 dark:bg-[#7BA7AE]/20 text-[#245D66] dark:text-[#7BA7AE]">
                            {program.status || 'Active'}
                          </div>
                          {program.scheduledDate ? (
                            <Button variant="outline" size="sm" className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300">
                              View Details
                            </Button>
                          ) : (
                            <Button size="sm" className="relative overflow-hidden group">
                              <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/80 via-[#245D66]/60 to-[#245D66]/80 dark:from-[#7BA7AE]/80 dark:via-[#7BA7AE]/60 dark:to-[#7BA7AE]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-flow"></span>
                              <Calendar className="mr-1.5 h-3.5 w-3.5 relative z-10" />
                              <span className="relative">Schedule</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent 
            value="resources" 
            className="w-full space-y-4 pt-1 data-[state=active]:animate-fadeIn"
          >
            <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp">
              <CardHeader>
                <CardTitle>Recently Accessed Resources</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-black/5 transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#245D66]/10">
                      <BookOpen className="h-6 w-6 text-[#245D66] dark:text-[#7BA7AE]" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">Case Interview Preparation Guide</h3>
                      <p className="text-sm text-[#245D66]/80 dark:text-[#7BA7AE]/80">Last accessed 2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300">
            <CardHeader className="pb-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-[#245D66]/20 flex items-center justify-center">
                  <Star className="h-8 w-8 text-[#245D66] dark:text-[#7BA7AE]" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#245D66] to-[#245D66] dark:from-[#7BA7AE] dark:to-[#7BA7AE] bg-clip-text text-transparent">AI Case Interview Coach</CardTitle>
                  <CardDescription className="text-lg mt-2">Your personal AI coach to ace case interviews with realistic practice and guided feedback</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Practice Mock Interview */}
                <div className="group relative p-6 rounded-xl bg-gradient-to-br from-[#245D66]/5 via-white/80 to-white/90 dark:from-[#245D66]/20 dark:via-black/80 dark:to-black/90 hover:shadow-lg transition-all duration-300 border border-[#245D66]/10 dark:border-[#245D66]/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                    <Image 
                      src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/WhatsApp%20Image%202025-03-28%20at%2013.26.37_bfd03797.jpg?alt=media&token=12472b60-cdad-4e74-947f-fc0fbe628b35"
                      alt="Practice Mock Interview"
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#245D66]/40 to-transparent"></div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#245D66]/10 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="h-6 w-6 text-[#245D66] dark:text-[#7BA7AE]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#245D66] dark:text-[#7BA7AE]">Practice Realistic Mock Case Interview</h3>
                  </div>
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-[#245D66]/80 dark:text-[#7BA7AE]/80">Real-time voice interaction with slide sharing and on-demand case fact introduction.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#245D66] group-hover/item:scale-150 transition-transform duration-300"></div>
                        <span className="text-[#245D66]/90 dark:text-[#7BA7AE]/90">Get personalized Gap Analysis scorecard</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#245D66] group-hover/item:scale-150 transition-transform duration-300"></div>
                        <span className="text-[#245D66]/90 dark:text-[#7BA7AE]/90">Perfect for real interview simulation</span>
                      </li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full bg-white dark:bg-[#245D66]/10 hover:bg-[#245D66]/5 dark:hover:bg-[#245D66]/20 font-medium relative overflow-hidden group/btn border-[#245D66]/20 hover:border-[#245D66]/30 text-[#245D66] dark:text-[#7BA7AE]">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative">Start Practice</span>
                  </Button>
                </div>

                {/* Guided Coaching */}
                <div className="group relative p-6 rounded-xl bg-gradient-to-br from-[#245D66]/5 via-white/80 to-white/90 dark:from-[#245D66]/20 dark:via-black/80 dark:to-black/90 hover:shadow-lg transition-all duration-300 border border-[#245D66]/10 dark:border-[#245D66]/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                    <Image 
                      src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/WhatsApp%20Image%202025-03-28%20at%2013.27.42_b1735854.jpg?alt=media&token=4d8b7281-4bce-43e9-9bb1-2ba5d13454bc"
                      alt="Guided Case Interview Coaching"
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#245D66]/40 to-transparent"></div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#245D66]/10 group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-6 w-6 text-[#245D66] dark:text-[#7BA7AE]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#245D66] dark:text-[#7BA7AE]">Guided Case Interview Coaching</h3>
                  </div>
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-[#245D66]/80 dark:text-[#7BA7AE]/80">Receive feedback after each interaction —perfect for candidates familiarizing themselves with the case interview format.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#245D66] group-hover/item:scale-150 transition-transform duration-300"></div>
                        <span className="text-[#245D66]/90 dark:text-[#7BA7AE]/90">Sharpen responses with guided answers</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#245D66] group-hover/item:scale-150 transition-transform duration-300"></div>
                        <span className="text-[#245D66]/90 dark:text-[#7BA7AE]/90">See ideal responses for each stage</span>
                      </li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full bg-white dark:bg-[#245D66]/10 hover:bg-[#245D66]/5 dark:hover:bg-[#245D66]/20 font-medium relative overflow-hidden group/btn border-[#245D66]/20 hover:border-[#245D66]/30 text-[#245D66] dark:text-[#7BA7AE]">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative">Start Practice</span>
                  </Button>
                </div>

                {/* Interview Simulator */}
                <div className="group relative p-6 rounded-xl bg-gradient-to-br from-[#245D66]/5 via-white/80 to-white/90 dark:from-[#245D66]/20 dark:via-black/80 dark:to-black/90 hover:shadow-lg transition-all duration-300 border border-[#245D66]/10 dark:border-[#245D66]/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-black">
                    <video 
                      src="https://firebasestorage.googleapis.com/v0/b/managementconsultant-3f20b.appspot.com/o/Landingvideo.mp4?alt=media&token=92ef4468-02cf-417e-9856-2bd16537000c"
                      className="w-full h-full object-cover opacity-80"
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-[#245D66]/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#7BA7AE]/30">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#245D66]/80 to-transparent pointer-events-none"></div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#245D66]/10 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-6 w-6 text-[#245D66] dark:text-[#7BA7AE]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#245D66] dark:text-[#7BA7AE]">Mock Case Interview Simulator</h3>
                  </div>
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-[#245D66]/80 dark:text-[#7BA7AE]/80">Watch how our AI-powered case interview simulator works with real-time feedback and interactive features.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#245D66] group-hover/item:scale-150 transition-transform duration-300"></div>
                        <span className="text-[#245D66]/90 dark:text-[#7BA7AE]/90">Safeguards key facts until appropriate moments</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#245D66] group-hover/item:scale-150 transition-transform duration-300"></div>
                        <span className="text-[#245D66]/90 dark:text-[#7BA7AE]/90">Adaptive learning from user feedback</span>
                      </li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full bg-white dark:bg-[#245D66]/10 hover:bg-[#245D66]/5 dark:hover:bg-[#245D66]/20 font-medium relative overflow-hidden group/btn border-[#245D66]/20 hover:border-[#245D66]/30 text-[#245D66] dark:text-[#7BA7AE]">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative">Watch Demo</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome modal with motion animation */}
        <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
          <DialogContent className="sm:max-w-[425px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl overflow-hidden animate-slideInUp">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#245D66] via-gray-500 to-[#245D66] dark:from-[#7BA7AE] dark:via-gray-500 dark:to-[#7BA7AE]"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#245D66]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-[#245D66]/10 rounded-full blur-3xl -z-10"></div>
            
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-2xl text-center pb-2 font-bold tracking-tight bg-gradient-to-r from-[#245D66] to-[#245D66] dark:from-[#7BA7AE] dark:to-[#7BA7AE] bg-clip-text text-transparent">Welcome to Your Dashboard</DialogTitle>
              <DialogDescription className="text-center">
                Track your consulting journey progress and access resources to enhance your skills.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-4 py-4">
              <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-[#245D66]/5 hover:bg-[#245D66]/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#245D66]/10">
                  <TrendingUp className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE]" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Track your progress</p>
                  <p className="text-xs text-[#245D66]/80 dark:text-[#7BA7AE]/80">
                    Monitor your consulting skill development over time.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-[#245D66]/5 hover:bg-[#245D66]/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#245D66]/10">
                  <Calendar className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE]" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Schedule sessions</p>
                  <p className="text-xs text-[#245D66]/80 dark:text-[#7BA7AE]/80">
                    Book one-on-one or group coaching sessions.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-[#245D66]/5 hover:bg-[#245D66]/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#245D66]/10">
                  <FileText className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE]" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Access resources</p>
                  <p className="text-xs text-[#245D66]/80 dark:text-[#7BA7AE]/80">
                    Explore learning materials tailored to your consulting journey.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t border-[#245D66]/20 pt-4">
              <Button
                onClick={closeWelcomeModal}
                className="w-full relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/80 to-[#245D66]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Get Started</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ... */}
    </>
  )
}

export default DashboardPage
