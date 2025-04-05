"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Calendar, Clock, FileText, MessageSquare, Star, TrendingUp, Users, X, Download, BookOpen } from "lucide-react"
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
                {sessionMessage && console.log("Session Message:", sessionMessage)}
                {sessionMessage && console.log("Contains 'Book your first':", sessionMessage.includes("Book your first coaching session"))}
                {sessionMessage && console.log("Contains 'Schedule your first':", sessionMessage.includes("Schedule your first coaching session"))}
                {console.log("Condition result:", sessionMessage && (
                  sessionMessage.includes("Book your first coaching session") || 
                  sessionMessage.includes("Schedule your first coaching session")
                ))}
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
                  <Button className="relative overflow-hidden group font-medium">
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

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-black/40 dark:border-white/40">
            <TabsList className="border-none bg-transparent h-10 p-0 relative">
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
            className="space-y-4 pt-1 data-[state=active]:animate-fadeIn"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className={`col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-0 ${animationStage >= 2 ? 'animate-slideInUp opacity-100' : ''}`}>
                <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 group transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black/30 to-black/80 dark:from-white/30 dark:to-white/80"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                    <div className="absolute top-1 right-1 w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full blur-2xl -z-10"></div>
                    <CardTitle className="text-sm font-medium flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">1:1 Sessions</span>
                      <span className="text-xl mt-1">12</span>
                    </CardTitle>
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 group-hover:from-black/15 group-hover:to-black/10 dark:group-hover:from-white/15 dark:group-hover:to-white/10 transition-all duration-300">
                      <Clock className="h-5 w-5 text-black dark:text-white transition-transform duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="pt-2 relative">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total 1:1 coaching sessions</p>
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                          +2
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-black/30 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="absolute -right-3 -bottom-3 h-16 w-16 bg-black/5 dark:bg-white/5 rounded-full blur-md -z-10"></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 group transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black/30 to-black/80 dark:from-white/30 dark:to-white/80"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                    <div className="absolute top-1 right-1 w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full blur-2xl -z-10"></div>
                    <CardTitle className="text-sm font-medium flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">AI Sessions</span>
                      <span className="text-xl mt-1">5</span>
                    </CardTitle>
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 group-hover:from-black/15 group-hover:to-black/10 dark:group-hover:from-white/15 dark:group-hover:to-white/10 transition-all duration-300">
                      <MessageSquare className="h-5 w-5 text-black dark:text-white transition-transform duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="pt-2 relative">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total AI coaching sessions</p>
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                          +5
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-black/30 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <div className="absolute -right-3 -bottom-3 h-16 w-16 bg-black/5 dark:bg-white/5 rounded-full blur-md -z-10"></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 group transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black/30 to-black/80 dark:from-white/30 dark:to-white/80"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                    <div className="absolute top-1 right-1 w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full blur-2xl -z-10"></div>
                    <CardTitle className="text-sm font-medium flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">Resources</span>
                      <span className="text-xl mt-1">24</span>
                    </CardTitle>
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 group-hover:from-black/15 group-hover:to-black/10 dark:group-hover:from-white/15 dark:group-hover:to-white/10 transition-all duration-300">
                      <FileText className="h-5 w-5 text-black dark:text-white transition-transform duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="pt-2 relative">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total resources accessed</p>
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                          +7
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-black/30 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="absolute -right-3 -bottom-3 h-16 w-16 bg-black/5 dark:bg-white/5 rounded-full blur-md -z-10"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className={`col-span-4 overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 opacity-0 ${animationStage >= 5 ? 'animate-slideInUp opacity-100' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black/30 to-black/80 dark:from-white/30 dark:to-white/80"></div>
                <CardHeader className="relative z-10">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-black/5 dark:bg-white/5 rounded-full blur-3xl -z-10"></div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">AI Coach - Claim Free Trial</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-1 bg-black/10 text-black dark:text-white text-xs rounded-full font-medium">
                        Limited Time Offer
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Experience personalized coaching from AI-powered consultants</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Select a consultant to start your free coaching session</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Consultant 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="p-4">
                        <div className="aspect-[4/3] relative mb-3 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" 
                            alt="James, Associate" 
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-black/90 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                        </div>
                        <div>
                          <h4 className="font-medium">James, Associate</h4>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">00:00/00:14</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Consultant 2 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="p-4">
                        <div className="aspect-[4/3] relative mb-3 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" 
                            alt="Charles, Partner" 
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-black/90 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                        </div>
                        <div>
                          <h4 className="font-medium">Charles, Partner</h4>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">00:00/00:12</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Consultant 3 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="p-4">
                        <div className="aspect-[4/3] relative mb-3 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80" 
                            alt="Sandra, Principal" 
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-black/90 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                        </div>
                        <div>
                          <h4 className="font-medium">Sandra, Principal</h4>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">00:00/00:12</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Consultant 4 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="p-4">
                        <div className="aspect-[4/3] relative mb-3 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1519085360753-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" 
                            alt="David, Manager" 
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-black/90 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                        </div>
                        <div>
                          <h4 className="font-medium">David, Manager</h4>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">00:00/00:12</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Consultant 5 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="p-4">
                        <div className="aspect-[4/3] relative mb-3 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80" 
                            alt="Lyra, Consultant" 
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-black/90 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                        </div>
                        <div>
                          <h4 className="font-medium">Lyra, Consultant</h4>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">00:00/00:12</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Consultant 6 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="p-4">
                        <div className="aspect-[4/3] relative mb-3 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" 
                            alt="Samantha, Analyst" 
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-black/90 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                        </div>
                        <div>
                          <h4 className="font-medium">Samantha, Analyst</h4>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">00:00/00:12</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button className="bg-gradient-to-r from-black to-black/90 hover:from-black/90 hover:to-black/80 text-white shadow-md hover:shadow-lg transition-all duration-300 group">
                      Claim Your Free Trial
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className={`col-span-3 overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 opacity-0 ${animationStage >= 5 ? 'animate-slideInRight opacity-100' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black/30 to-black/80 dark:from-white/30 dark:to-white/80"></div>
                <CardHeader className="relative">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-black/5 dark:bg-white/5 rounded-full blur-3xl -z-10"></div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Resources</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-black dark:text-white hover:text-black/90 dark:hover:text-white/90 hover:bg-black/5 dark:hover:bg-white/5">
                      View all
                      <span className="sr-only">View all resources</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="group relative p-4 rounded-xl bg-black/5 hover:bg-black/10 transition-colors duration-300 flex items-start space-x-4 cursor-pointer overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-black/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/30 shadow-sm group-hover:shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-300">
                        <FileText className="h-5 w-5 text-black transition-transform duration-300" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm group-hover:text-black transition-colors duration-300 flex items-center">
                          <span className="truncate">Consulting Framework Guide</span>
                          <span className="ml-2 inline-flex items-center rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">New</span>
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Complete guide to the REACH consulting methodology</p>
                        <div className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3.5 w-3.5" /> Updated 2 days ago
                          </span>
                          <span className="mx-2">•</span>
                          <span>12 min read</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group relative p-4 rounded-xl bg-white/50 hover:bg-black/5 transition-colors duration-300 flex items-start space-x-4 cursor-pointer">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-black/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/30 shadow-sm">
                        <Users className="h-5 w-5 text-black transition-transform duration-300" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm group-hover:text-black transition-colors duration-300">Client Communication Templates</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Templates for effective client interaction and management</p>
                        <div className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3.5 w-3.5" /> Updated 1 week ago
                          </span>
                          <span className="mx-2">•</span>
                          <span>15 min read</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group relative p-4 rounded-xl bg-white/50 hover:bg-black/5 transition-colors duration-300 flex items-start space-x-4 cursor-pointer">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-black/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/30 shadow-sm">
                        <BarChart className="h-5 w-5 text-black transition-transform duration-300" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm group-hover:text-black transition-colors duration-300">Business Analysis Tools</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Advanced tools for analyzing business performance</p>
                        <div className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3.5 w-3.5" /> Updated 3 weeks ago
                          </span>
                          <span className="mx-2">•</span>
                          <span>20 min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-muted/20 pt-4">
                  <Button variant="outline" className="w-full group hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300">
                    <FileText className="mr-2 h-4 w-4 text-black group-hover:translate-x-0.5 transition-transform duration-300" />
                    <span>Browse All Resources</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent 
            value="upcoming" 
            className="space-y-4 pt-1 data-[state=active]:animate-fadeIn"
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                  </div>
                ) : coachingPrograms.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/10">
                      <BookOpen className="h-6 w-6 text-black dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium">No coaching programs yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                      You haven't enrolled in any coaching programs yet. Browse our programs to get started on your consulting journey.
                    </p>
                    <Button className="mt-4 relative overflow-hidden group">
                      <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 dark:from-white/80 dark:via-white/60 dark:to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-flow"></span>
                      <span className="relative z-10">Browse Programs</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coachingPrograms.map((program: CoachingProgram) => (
                      <div key={program.id} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 hover:bg-black/5 p-3 rounded-lg transition-colors duration-200">
                        <div className="space-y-2 mb-3 md:mb-0">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-black/20 to-black/10 dark:from-white/20 dark:to-white/10 mr-3">
                              <BookOpen className="h-5 w-5 text-black dark:text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-none">{program.programName}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <Clock className="mr-1 h-3.5 w-3.5" /> Enrolled: {formatDate(program.enrollmentDate)}
                                </span>
                                <span className="mx-2">•</span>
                                <span>Payment: {formatCurrency(program.amountPaid, program.currency)}</span>
                              </div>
                            </div>
                          </div>
                          {program.metadata && program.metadata.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 pl-13">
                              {program.metadata.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            {program.status || 'Active'}
                          </div>
                          {program.scheduledDate ? (
                            <Button variant="outline" size="sm" className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300">
                              View Details
                            </Button>
                          ) : (
                            <Button size="sm" className="relative overflow-hidden group">
                              <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 dark:from-white/80 dark:via-white/60 dark:to-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-flow"></span>
                              <Calendar className="mr-1.5 h-3.5 w-3.5 relative z-10" />
                              <span className="relative z-10">Schedule</span>
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
            className="space-y-4 pt-1 data-[state=active]:animate-fadeIn"
          >
            <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp">
              <CardHeader>
                <CardTitle>Recently Accessed Resources</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-black/5 transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/30 shadow-sm">
                      <FileText className="h-6 w-6 text-black transition-transform duration-300" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Case Interview Frameworks</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Essential frameworks and tips</p>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300">
                      Continue
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-black/5 transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/30 shadow-sm">
                      <Users className="h-6 w-6 text-black transition-transform duration-300" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Networking Strategies</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Video • 45 minutes • Last accessed 5 days ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300">
                      Continue
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-black/5 transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/30 shadow-sm">
                      <Star className="h-6 w-6 text-black transition-transform duration-300" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Personality Assessment</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Interactive • 30 minutes • Last accessed 1 week ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300">
                      Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Welcome modal with motion animation */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-[425px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl overflow-hidden animate-slideInUp">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-500 to-black dark:from-white dark:via-gray-500 dark:to-white"></div>
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-black/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl text-center pb-2 font-bold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Welcome to Your Dashboard</DialogTitle>
            <DialogDescription className="text-center">
              Track your consulting journey progress and access resources to enhance your skills.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-black/5 hover:bg-black/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/10">
                <TrendingUp className="h-5 w-5 text-black transition-transform duration-300" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Track your progress</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Monitor your consulting skill development over time.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-secondary/5 hover:bg-secondary/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10">
                <Calendar className="h-5 w-5 text-secondary transition-transform duration-300" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Schedule sessions</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Book one-on-one or group coaching sessions.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-black/5 hover:bg-black/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/20 to-black/10">
                <FileText className="h-5 w-5 text-black transition-transform duration-300" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Access resources</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Explore learning materials tailored to your consulting journey.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-muted/20 pt-4">
            <Button
              onClick={closeWelcomeModal}
              className="w-full relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Get Started</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DashboardPage
