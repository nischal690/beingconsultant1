"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GritFramework from "@/components/grit-framework"
import { 
  BarChart, 
  Calendar, 
  ChevronRight, 
  Clock, 
  FileText, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users, 
  X, 
  Download, 
  BookOpen, 
  Play, 
  Brain, 
  CheckCircle, 
  Sparkles 
} from "lucide-react"
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
import { getUserProfile, getUserCoachingPrograms, getRecentlyAccessedResources } from "@/lib/firebase/firestore"
import { useRouter } from "next/navigation"
import { useProducts } from "@/context/products-context"

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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false) // Permanently disabled
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)
  const [userName, setUserName] = useState("User")
  const [coachingPrograms, setCoachingPrograms] = useState<CoachingProgram[]>([])
  const [hasCoaching, setHasCoaching] = useState(false)
  const [isLoadingCoaching, setIsLoadingCoaching] = useState(true)
  const [upcomingSessions, setUpcomingSessions] = useState(0)
  const [sessionMessage, setSessionMessage] = useState("")
  const [aiSessionsUsed, setAiSessionsUsed] = useState(0)
  const [aiSessionsTotal, setAiSessionsTotal] = useState(0)
  const [toolkitResourcesUsed, setToolkitResourcesUsed] = useState(0)
  const [availableCoachingSessions, setAvailableCoachingSessions] = useState(0)
  const [usedCoachingSessions, setUsedCoachingSessions] = useState(0)
  const [recentlyAccessedResources, setRecentlyAccessedResources] = useState<any[]>([])
  const [isLoadingRecentResources, setIsLoadingRecentResources] = useState(true)
  const { user } = useAuth()
  const { products } = useProducts()
  const router = useRouter()

  // Helper function to parse dates consistently
  const parseScheduledDate = (scheduledDate: any): Date => {
    if (!scheduledDate) {
      return new Date();
    }
    
    if (scheduledDate instanceof Date) {
      return scheduledDate;
    }
    
    // Handle Firestore timestamp
    if (scheduledDate && typeof scheduledDate.toDate === 'function') {
      return scheduledDate.toDate();
    }
    
    // Handle ISO string
    if (typeof scheduledDate === 'string') {
      // Try to parse the date string
      const parsedDate = new Date(scheduledDate);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    
    // If we get here, we couldn't parse the date
    return new Date();
  };
  
  // Helper function to check if a session is upcoming
  const isUpcomingSession = (program: CoachingProgram): boolean => {
    if (!program.scheduledDate) return false;
    
    const scheduledDate = parseScheduledDate(program.scheduledDate);
    const now = new Date();
    
    return scheduledDate.getTime() > now.getTime();
  };

  useEffect(() => {
    // Welcome modal is now disabled
    // No longer showing the welcome modal on load

    // Log products cache for debugging
    console.log('[Dashboard] Products cache:', products);

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

    // Fetch toolkit resources data from Firestore
    const fetchToolkitResourcesData = async () => {
      console.log('[Dashboard] Starting toolkit resources data fetch...')
      if (user) {
        console.log('[Dashboard] User authenticated for toolkit resources:', user.uid)
        try {
          // Import Firestore functions
          const { getFirestore, doc, getDoc } = await import('firebase/firestore')
          const db = getFirestore()
          
          // Get the user document
          const userDocRef = doc(db, `users/${user.uid}`)
          const userDocSnap = await getDoc(userDocRef)
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data()
            
            // Check if resourceaccessed field exists and count unique resource IDs
            let resourcesCount = 0
            if (userData.resourceaccessed && Array.isArray(userData.resourceaccessed)) {
              // Create a Set to track unique IDs
              const uniqueResourceIds = new Set(
                userData.resourceaccessed.map(resource => resource.id)
              );
              resourcesCount = uniqueResourceIds.size;
              console.log('[Dashboard] Found unique resourceaccessed items:', resourcesCount)
              console.log('[Dashboard] Resources data:', userData.resourceaccessed)
            }
            
            setToolkitResourcesUsed(resourcesCount)
            console.log('[Dashboard] Toolkit resources data loaded successfully:', { used: resourcesCount, total: 54 })
          } else {
            console.log('[Dashboard] User document not found')
            setToolkitResourcesUsed(0)
          }
        } catch (error) {
          console.error('[Dashboard] Error fetching toolkit resources:', error)
          console.error('[Dashboard] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
          setToolkitResourcesUsed(0)
        }
      } else {
        console.log('[Dashboard] No user found, skipping toolkit resources fetch')
      }
    }
    
    // Fetch AI sessions data from Firestore
    const fetchAiSessionsData = async () => {
      console.log('[Dashboard] Starting AI sessions data fetch...')
      if (user) {
        console.log('[Dashboard] User authenticated:', user.uid)
        try {
          // Import Firestore functions
          const { getFirestore, collection, query, getDocs, where } = await import('firebase/firestore')
          const db = getFirestore()
          console.log('[Dashboard] Firestore initialized')
          
          // Get the aisessions subcollection for the current user
          const aiSessionsPath = `users/${user.uid}/aisessions`
          console.log('[Dashboard] Attempting to fetch from path:', aiSessionsPath)
          const aiSessionsRef = collection(db, aiSessionsPath)
          const aiSessionsSnapshot = await getDocs(aiSessionsRef)
          
          // Count used sessions
          const usedSessions = aiSessionsSnapshot.size
          console.log('[Dashboard] AI Sessions documents found:', usedSessions)
          console.log('[Dashboard] AI Sessions data:', aiSessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
          
          setAiSessionsUsed(usedSessions)
          
          // Get total sessions from the first document if available
          let totalSessions = 0; // Default to 0 if not found
          if (aiSessionsSnapshot.docs.length > 0) {
            const firstDoc = aiSessionsSnapshot.docs[0].data();
            if (firstDoc.totalsessions) {
              totalSessions = firstDoc.totalsessions;
              console.log('[Dashboard] Found totalsessions in document:', totalSessions);
            }
          }
          
          setAiSessionsTotal(totalSessions);
          
          console.log('[Dashboard] AI Sessions data loaded successfully:', { used: usedSessions, total: totalSessions })
        } catch (error) {
          console.error('[Dashboard] Error fetching AI sessions:', error)
          console.error('[Dashboard] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
          // Set default values in case of error
          setAiSessionsUsed(0)
          setAiSessionsTotal(5)
        }
      } else {
        console.log('[Dashboard] No user found, skipping AI sessions fetch')
      }
    }

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

    // Fetch recently accessed resources
    const fetchRecentlyAccessedResources = async () => {
      if (user) {
        setIsLoadingRecentResources(true)
        try {
          console.log('[Dashboard] Fetching recently accessed resources...')
          const recentResourcesResult = await getRecentlyAccessedResources(user.uid, 5)
          if (recentResourcesResult.success) {
            setRecentlyAccessedResources(recentResourcesResult.data || [])
            console.log('[Dashboard] Recently accessed resources loaded:', recentResourcesResult.data)
          } else {
            console.error('[Dashboard] Failed to fetch recently accessed resources:', recentResourcesResult.error)
            setRecentlyAccessedResources([])
          }
        } catch (error) {
          console.error('[Dashboard] Error fetching recently accessed resources:', error)
          setRecentlyAccessedResources([])
        } finally {
          setIsLoadingRecentResources(false)
        }
      } else {
        setIsLoadingRecentResources(false)
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
            const typedCoachingData = coachingData as CoachingProgram[];
            
            // Debug: Log the raw data structure of each coaching program
            console.log("[Dashboard] Raw coaching data from Firebase:", JSON.stringify(coachingData, null, 2));
            typedCoachingData.forEach((program, index) => {
              console.log(`[Dashboard] Program ${index} details:`);
              console.log(`  - ID: ${program.id}`);
              console.log(`  - Program Name: ${program.programName}`);
              console.log(`  - Scheduled Date: ${program.scheduledDate}`);
              console.log(`  - Location:`, program.location);
              console.log(`  - Type of scheduledDate:`, typeof program.scheduledDate);
              if (program.scheduledDate) {
                try {
                  const parsedDate = new Date(program.scheduledDate);
                  console.log(`  - Parsed Date: ${parsedDate.toISOString()}`);
                  console.log(`  - Is valid date: ${!isNaN(parsedDate.getTime())}`);
                } catch (e) {
                  console.log(`  - Error parsing date: ${e}`);
                }
              }
            });
            
            // Filter out coaching programs that have scheduled dates
            const scheduledCoaching = typedCoachingData.filter(program => program.scheduledDate);
            
            // Log for debugging
            console.log("[Dashboard] All coaching programs:", typedCoachingData);
            console.log("[Dashboard] Scheduled coaching programs:", scheduledCoaching);
            
            setCoachingPrograms(typedCoachingData);
            setHasCoaching(typedCoachingData.length > 0);
            
            // Current date for comparison
            const now = new Date();
            console.log("[Dashboard] Current date for comparison:", now.toISOString());
            
            // Count upcoming sessions with detailed logging
            const upcomingPrograms = scheduledCoaching.filter(program => {
              if (!program.scheduledDate) {
                console.log("[Dashboard] Program has no scheduledDate:", program.id);
                return false;
              }
              
              console.log("[Dashboard] Checking program:", program.id, program.programName);
              console.log("[Dashboard] Raw scheduledDate:", program.scheduledDate);
              
              const scheduledDate = parseScheduledDate(program.scheduledDate);
              console.log("[Dashboard] Parsed scheduledDate:", scheduledDate.toISOString());
              
              // Compare dates
              const isUpcoming = scheduledDate.getTime() > now.getTime();
              console.log("[Dashboard] Is upcoming?", isUpcoming, "(scheduled:", scheduledDate.toISOString(), "vs now:", now.toISOString(), ")");
              
              return isUpcoming;
            });
            
            console.log("[Dashboard] Upcoming programs:", upcomingPrograms);
            
            // Force a re-render by creating a new array with the filtered programs
            const upcomingProgramsArray = [...upcomingPrograms];
            console.log("[Dashboard] Setting upcoming sessions count to:", upcomingProgramsArray.length);
            
            // Update state with the upcoming programs count
            setUpcomingSessions(upcomingProgramsArray.length);
            
            // Calculate available and used coaching sessions
            const availableSessions = upcomingProgramsArray.length;
            
            // Count past sessions (those with scheduledDate in the past)
            const pastSessions = scheduledCoaching.filter(program => {
              if (!program.scheduledDate) return false;
              
              const scheduledDate = parseScheduledDate(program.scheduledDate);
              return scheduledDate.getTime() <= now.getTime();
            }).length;
            
            console.log("[Dashboard] Available coaching sessions:", availableSessions);
            console.log("[Dashboard] Used coaching sessions:", pastSessions);
            
            // Update state with the counts
            setAvailableCoachingSessions(availableSessions);
            setUsedCoachingSessions(pastSessions);
            
            // Also update the coaching programs state to include only upcoming programs
            // This ensures the UI will show the correct programs
            if (upcomingProgramsArray.length > 0) {
              console.log("[Dashboard] We have upcoming programs, updating state");
              // Keep all programs in state but make sure the upcoming ones are included
              setCoachingPrograms(prevPrograms => {
                // Make sure we don't lose any programs but also include the upcoming ones
                return [...typedCoachingData];
              });
            }
            
            // If user has coaching programs, check for scheduled dates
            if (typedCoachingData.length > 0) {
              updateSessionMessage(typedCoachingData);
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
    fetchAiSessionsData()
    fetchToolkitResourcesData()
    fetchRecentlyAccessedResources()

    return () => {
      // timer for welcome modal has been removed
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
      // Convert string to number if needed
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
      }).format(Number(numericAmount))
    } catch (error) {
      console.error("Error formatting currency:", error)
      return `${amount} ${currency}`
    }
  }

  return (
    <>
      <div className={`space-y-6 opacity-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : ''} px-6 sm:px-8 md:px-12 lg:px-16 py-8`}>
        <div className={`relative transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Decorative background elements with enhanced animations */}
          <div className="absolute -top-4 -left-6 w-72 h-72 bg-gradient-to-br from-black/10 to-black/5 rounded-full blur-3xl -z-10 dark:from-white/10 dark:to-white/5 animate-pulse-glow"></div>
          <div className="absolute top-10 right-20 w-36 h-36 bg-gradient-to-br from-black/5 to-gray-500/10 rounded-full blur-3xl -z-10 dark:from-white/5 dark:to-gray-400/10 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-gradient-to-tr from-black/5 to-gray-500/5 rounded-full blur-3xl -z-10 dark:from-white/5 dark:to-gray-400/5 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
          
          {/* Modern welcome header with enhanced styling */}
          <div className="relative z-10 p-6 rounded-2xl welcome-gradient welcome-shadow welcome-border-gradient overflow-hidden animate-gradient-flow transition-all duration-500">
            {/* Decorative accent line with animation - Removed white line at top */}
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
                      <span className="font-medium text-black dark:text-white relative inline-block">{sessionMessage}</span>
                    ) : sessionMessage === "No sessions scheduled yet" ? (
                      <>
                        Here's what's happening with your consulting journey today.{" "}
                        <span className="font-medium text-black dark:text-white ml-1 relative inline-block py-2">{sessionMessage}</span>
                      </>
                    ) : (
                      <>
                        Here's what's happening with your consulting journey today.{" "}
                        <span className="font-medium text-black dark:text-white ml-1 relative inline-block">{sessionMessage}</span>
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
                  <Button 
                    onClick={() => {
                      // Find the next upcoming session
                      const upcomingPrograms = coachingPrograms
                        .filter((program) => {
                          if (!program.scheduledDate) return false;
                          const scheduledDate = parseScheduledDate(program.scheduledDate);
                          return scheduledDate > new Date();
                        })
                        .sort((a, b) => {
                          const dateA = parseScheduledDate(a.scheduledDate);
                          const dateB = parseScheduledDate(b.scheduledDate);
                          return dateA.getTime() - dateB.getTime();
                        });
                      
                      if (upcomingPrograms.length > 0) {
                        const nextSession = upcomingPrograms[0];
                        // Check if location is an object with join_url or a string containing zoom.us
                        if (nextSession.location && typeof nextSession.location === 'object' && nextSession.location.join_url) {
                          window.open(nextSession.location.join_url, '_blank');
                        } else if (nextSession.location && typeof nextSession.location === 'string' && nextSession.location.includes('zoom.us')) {
                          window.open(nextSession.location, '_blank');
                        } else {
                          router.push('/dashboard/coaching');
                        }
                      } else {
                        router.push('/dashboard/coaching');
                      }
                    }}
                    className="relative overflow-hidden group font-medium"
                  >
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
                  <Button 
                    variant="outline" 
                    className="font-medium group hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                    onClick={() => {
                      // Find the tab trigger element and click it
                      const upcomingTabTrigger = document.querySelector('[value="upcoming"]');
                      if (upcomingTabTrigger instanceof HTMLElement) {
                        upcomingTabTrigger.click();
                      }
                    }}
                  >
                    <Users className="mr-2 h-4 w-4 text-black dark:text-white transition-transform duration-300" />
                    <span>View All Sessions</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full space-y-4">
          <div className="flex justify-between items-center pb-3 relative overflow-hidden">
            {/* Subtle gradient background for tabs */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/5 via-black/0 to-[#245D66]/5 opacity-50 dark:from-[#245D66]/10 dark:via-white/0 dark:to-[#245D66]/10"></div>
            
            <TabsList className="border-none bg-transparent h-12 p-0 relative w-full z-10 gap-2">
              <TabsTrigger 
                value="overview" 
                className="relative h-10 px-6 py-2 rounded-full bg-transparent data-[state=active]:bg-[#245D66]/10 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-[0_0_15px_rgba(36,93,102,0.2)] data-[state=active]:text-[#245D66] dark:data-[state=active]:text-white group transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 font-medium">Overview</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/0 via-[#245D66]/5 to-[#245D66]/0 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-300"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="relative h-10 px-6 py-2 rounded-full bg-transparent data-[state=active]:bg-[#245D66]/10 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-[0_0_15px_rgba(36,93,102,0.2)] data-[state=active]:text-[#245D66] dark:data-[state=active]:text-white group transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 font-medium">Upcoming Sessions</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/0 via-[#245D66]/5 to-[#245D66]/0 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-300"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="relative h-10 px-6 py-2 rounded-full bg-transparent data-[state=active]:bg-[#245D66]/10 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-[0_0_15px_rgba(36,93,102,0.2)] data-[state=active]:text-[#245D66] dark:data-[state=active]:text-white group transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 font-medium">Resources</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#245D66]/0 via-[#245D66]/5 to-[#245D66]/0 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-300"></span>
              </TabsTrigger>
            </TabsList>
            <div className="flex space-x-2 relative z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full bg-[#245D66]/5 text-[#245D66] hover:bg-[#245D66]/10 hover:text-[#245D66] transition-all duration-300 shadow-sm"
              >
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
              <Card variant="light" className="p-6 rounded-xl relative overflow-hidden shadow-md z-10 group-hover:z-50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-100 rounded-full blur-2xl transform translate-x-16 -translate-y-8"></div>
                {/* Coaching Sessions Image - hover dialog and effect removed */}
                <div className="absolute -bottom-20 right-0 w-80 h-80 overflow-visible z-0">
                  <img 
                    src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Container1_Coaching.png?alt=media&token=94a9472a-ea5a-4aec-bde6-2d7e8b1ceed0" 
                    alt="Coaching Sessions" 
                    className="w-full h-full object-contain transform translate-x-8 translate-y-0 opacity-80"
                  />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-[#245D66]/20 dark:bg-[#245D66]/20 rounded-lg">
                      <FileText className="h-6 w-6 text-[#245D66]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-800">Coaching Sessions</h3>
                  </div>
                  <button className="text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-800">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="currentColor"/>
                      <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="currentColor"/>
                      <path d="M19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                {/* Added a max-width container to ensure content doesn't overlap with image */}
                <div className="max-w-[65%] relative z-10">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Available</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-800">{availableCoachingSessions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Used</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-800">{usedCoachingSessions}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-600 mb-6">Be prepared to answer any question that can come your way, with clarity.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard/coaching')} 
                    className="w-full bg-transparent dark:bg-transparent border-[#245D66]/20 dark:border-[#245D66]/20 hover:bg-[#245D66]/10 dark:hover:bg-[#245D66]/10 text-[#245D66] dark:text-[#245D66] relative"
                  >
                    Book a Session
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-2 h-4 w-4">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </div>
              </Card>

              <Card variant="light" className="p-6 rounded-xl relative overflow-hidden shadow-md transition-opacity duration-300 adjacent-card">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-100 rounded-full blur-2xl transform translate-x-16 -translate-y-8"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-[#245D66]/20 dark:bg-[#245D66]/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-[#245D66]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-800">AI Mock Practice</h3>
                  </div>
                  <button className="text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-800">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="currentColor"/>
                      <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="currentColor"/>
                      <path d="M19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Available</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-800">{aiSessionsTotal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Used</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-800">{aiSessionsUsed}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-600 mb-6">Practice with our AI to improve your consulting skills and confidence.</p>
                <Button variant="outline" className="w-full bg-transparent dark:bg-transparent border-[#245D66]/20 dark:border-[#245D66]/20 hover:bg-[#245D66]/10 dark:hover:bg-[#245D66]/10 text-white dark:text-white" onClick={() => window.location.href = 'https://aicoach.beingconsultant.com/auth'}>
                  Start Practice
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-2 h-4 w-4">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </Card>

              <Card variant="light" className="p-6 rounded-xl relative overflow-hidden shadow-md transition-opacity duration-300 adjacent-card">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-100 rounded-full blur-2xl transform translate-x-16 -translate-y-8"></div>
                {/* Toolkit Image */}
                <div className="absolute bottom-2 right-0 w-40 h-40 overflow-visible z-0">
                  <img 
                    src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/container_3_toolkit.png?alt=media&token=54206a93-7af5-466b-a5a5-24ac6849e8b5" 
                    alt="Resource Library" 
                    className="w-full h-full object-contain transform translate-x-4 translate-y-0 opacity-80"
                  />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-[#245D66]/20 dark:bg-[#245D66]/20 rounded-lg">
                      <BookOpen className="h-6 w-6 text-[#245D66]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-800">Resource Library</h3>
                  </div>
                  <button className="text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-800">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="currentColor"/>
                      <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="currentColor"/>
                      <path d="M19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                {/* Added a max-width container to ensure content doesn't overlap with image */}
                <div className="max-w-[65%] relative z-10">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Available</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-800">54</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Used</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-800">{toolkitResourcesUsed}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-600 mb-6">Get ready to Break Into Consulting with these tools.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard/masterclass')}
                    className="w-full bg-transparent dark:bg-transparent border-[#245D66]/20 dark:border-[#245D66]/20 hover:bg-[#245D66]/10 dark:hover:bg-[#245D66]/10 text-[#245D66] dark:text-[#245D66] relative"
                  >
                    Browse Toolkits
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-2 h-4 w-4">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </div>
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
                {isLoadingCoaching ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#245D66] dark:border-[#7BA7AE]"></div>
                  </div>
                ) : coachingPrograms.filter(program => {
                    if (!program.scheduledDate) return false;
                    const scheduledDate = parseScheduledDate(program.scheduledDate);
                    return scheduledDate.getTime() > new Date().getTime();
                  }).length > 0 ? (
                  <div className="space-y-6">
                    {/* Sessions will be dynamically loaded from user data */}
                    {coachingPrograms
                      .filter((program) => {
                        // Only show programs with scheduled dates that are in the future
                        if (!program.scheduledDate) {
                          console.log("[Dashboard Tab] Program has no scheduledDate:", program.id);
                          return false;
                        }
                        
                        console.log("[Dashboard Tab] Checking program for display:", program.id, program.programName);
                        console.log("[Dashboard Tab] Raw scheduledDate:", program.scheduledDate);
                        
                        const scheduledDate = parseScheduledDate(program.scheduledDate);
                        const now = new Date();
                        
                        // Use getTime() for reliable comparison
                        const isUpcoming = scheduledDate.getTime() > now.getTime();
                        console.log("[Dashboard Tab] Is upcoming for display?", isUpcoming, 
                          "(scheduled:", scheduledDate.toISOString(), 
                          "vs now:", now.toISOString(), ")");
                        
                        return isUpcoming;
                      })
                      .sort((a, b) => {
                        // Sort by date (earliest first)
                        const dateA = parseScheduledDate(a.scheduledDate);
                        const dateB = parseScheduledDate(b.scheduledDate);
                        return dateA.getTime() - dateB.getTime();
                      })
                      .map((program, index) => {
                        const scheduledDate = parseScheduledDate(program.scheduledDate);
                        const formattedDate = formatDate(scheduledDate);
                        const isToday = new Date().toDateString() === scheduledDate.toDateString();
                        const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === scheduledDate.toDateString();
                        
                        // Format time
                        const hours = scheduledDate.getHours();
                        const minutes = scheduledDate.getMinutes();
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        const formattedHours = hours % 12 || 12;
                        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                        const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
                        
                        return (
                          <div key={`session-${program.id}-${index}`} className="flex items-center justify-between border-b pb-4 hover:bg-black/5 p-2 rounded-lg transition-colors duration-200 hover:translate-x-1 transform">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{program.programName}</p>
                              <div className="flex items-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID: {program.transactionId?.substring(0, 10)}...</p>
                                {program.eventUri && (
                                  <a href={program.eventUri} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-[#245D66] hover:underline">View details</a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="text-sm font-medium text-black dark:text-white">
                                  {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : formattedDate}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{timeString}</div>
                              </div>
                              {program.location && typeof program.location === 'object' && program.location.join_url ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="hover:bg-[#245D66]/10 hover:text-[#245D66] hover:border-[#245D66]/30 transition-colors duration-300"
                                  onClick={() => window.open(program.location.join_url, '_blank')}
                                >
                                  Join
                                </Button>
                              ) : program.location && typeof program.location === 'string' && program.location.includes('zoom.us') ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="hover:bg-[#245D66]/10 hover:text-[#245D66] hover:border-[#245D66]/30 transition-colors duration-300"
                                  onClick={() => window.open(program.location, '_blank')}
                                >
                                  Join
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="hover:bg-black/10 hover:text-black hover:border-black/30 transition-colors duration-300"
                                  onClick={() => router.push('/dashboard/coaching')}
                                >
                                  Details
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#245D66]/20 to-[#245D66]/10">
                      <Calendar className="h-6 w-6 text-[#245D66] dark:text-[#7BA7AE]" />
                    </div>
                    <h3 className="text-lg font-medium">No upcoming sessions</h3>
                    <p className="text-sm text-[#245D66]/80 dark:text-[#7BA7AE]/80 mt-2 max-w-md mx-auto">
                      You don't have any scheduled coaching sessions. Book a session to get started.
                    </p>
                    {/* "Book a Session" button removed as requested */}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Sessions Card */}
            <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-black/80 dark:to-black/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp">
              <CardHeader>
                <CardTitle>Past Sessions</CardTitle>
                <CardDescription>Your completed coaching and training sessions</CardDescription>
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
                            // Only show schedule button for programs that are not past sessions
                            <Button 
                              size="sm" 
                              className="relative overflow-hidden group"
                              style={{ display: 'none' }} // Hide schedule button for past sessions
                            >
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
                {isLoadingRecentResources ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#245D66]/20 to-[#245D66]/10">
                      <BookOpen className="h-6 w-6 text-[#245D66] dark:text-[#7BA7AE] animate-pulse" />
                    </div>
                    <h3 className="text-lg font-medium mt-4">Loading...</h3>
                    <p className="text-sm text-[#245D66]/80 dark:text-[#7BA7AE]/80 mt-2 max-w-md mx-auto">
                      Fetching your recently accessed resources...
                    </p>
                  </div>
                ) : recentlyAccessedResources.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#245D66]/10">
                          <Clock className="h-4 w-4 text-[#245D66] dark:text-[#7BA7AE]" />
                        </div>
                        <h3 className="text-md font-medium">Continue where you left off</h3>
                      </div>
                    </div>
                    
                    {recentlyAccessedResources.map((resource, index) => (
                      <div 
                        key={`${resource.id}-${resource.action}-${index}`}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-[#245D66]/5 to-transparent hover:from-[#245D66]/10 transition-all duration-200 cursor-pointer group hover:shadow-md hover:-translate-y-0.5"
                        onClick={() => {
                          // Navigate to resource based on its type
                          if (resource.type === 'masterclass') {
                            router.push(`/dashboard/masterclass?id=${resource.id}`)
                          } else if (resource.type === 'ebook') {
                            router.push(`/dashboard/ebooks/${resource.id}`)
                          } else if (resource.category === 'product') {
                            router.push(`/dashboard/resources/${resource.id}`)
                          }
                        }}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#245D66]/20 to-[#245D66]/10 group-hover:from-[#245D66]/30 group-hover:to-[#245D66]/20 transition-all duration-300">
                          {resource.type === 'ebook' ? (
                            <BookOpen className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] group-hover:scale-110 transition-transform duration-300" />
                          ) : resource.type === 'masterclass' ? (
                            <Star className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] group-hover:scale-110 transition-transform duration-300" />
                          ) : resource.type === 'video' ? (
                            <Play className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] group-hover:scale-110 transition-transform duration-300" />
                          ) : resource.type === 'assessment' ? (
                            <Brain className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] group-hover:scale-110 transition-transform duration-300" />
                          ) : resource.action === 'download' ? (
                            <Download className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <FileText className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] group-hover:scale-110 transition-transform duration-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate group-hover:text-[#245D66] dark:group-hover:text-[#7BA7AE] transition-colors">
                            {resource.title || resource.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#245D66]/60 dark:text-[#7BA7AE]/60 capitalize">
                              {resource.action === 'access' ? 'Accessed' : resource.action === 'download' ? 'Downloaded' : 'Viewed'}
                            </span>
                            <span className="text-xs text-[#245D66]/40 dark:text-[#7BA7AE]/40">•</span>
                            <span className="text-xs text-[#245D66]/60 dark:text-[#7BA7AE]/60">
                              {resource.accessedDate ? new Date(resource.accessedDate).toLocaleDateString() : 
                               resource.accessedAt ? new Date(resource.accessedAt).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#245D66]/10 text-[#245D66]/80 dark:text-[#7BA7AE]/80 capitalize opacity-0 group-hover:opacity-100 transition-all duration-300">
                            {resource.type || 'Resource'}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <ChevronRight className="h-4 w-4 text-[#245D66]/60 dark:text-[#7BA7AE]/60" />
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#245D66]/20 to-[#245D66]/10">
                      <BookOpen className="h-6 w-6 text-[#245D66] dark:text-[#7BA7AE]" />
                    </div>
                    <h3 className="text-lg font-medium mt-4">No resources yet</h3>
                    <p className="text-sm text-[#245D66]/80 dark:text-[#7BA7AE]/80 mt-2 max-w-md mx-auto">
                      You haven't accessed any resources yet. Browse our toolkits to enhance your consulting skills.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 border-[#245D66]/20 text-[#245D66] dark:text-[#7BA7AE] hover:bg-[#245D66]/10"
                      onClick={() => router.push('/dashboard/resources')}
                    >
                      Browse Resources
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* THE GRIT FRAMEWORK Section */}
        <GritFramework />
       

        <div className="mt-8">
          <Card className="overflow-hidden bg-sidebar border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#245D66] via-[#7BA7AE] to-[#245D66]"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#245D66]/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-[#245D66]/5 rounded-full blur-3xl -z-10"></div>
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#245D66] to-[#7BA7AE] shadow-md">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#245D66] to-[#7BA7AE] bg-clip-text text-transparent">AI Case Interview Coach</CardTitle>
                  <CardDescription className="text-lg mt-2 text-gray-600 dark:text-gray-300">Your personal AI coach to ace case interviews with realistic practice and guided feedback</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Practice Mock Interview */}
                <div className="group relative p-0 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 dark:border-white/5 bg-white dark:bg-black/40 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  
                  {/* Image section with overlay */}
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image 
                      src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/WhatsApp%20Image%202025-03-28%20at%2013.26.37_bfd03797.jpg?alt=media&token=12472b60-cdad-4e74-947f-fc0fbe628b35"
                      alt="Practice Mock Interview"
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#245D66] dark:text-[#7BA7AE] shadow-md border border-[#245D66]/20 dark:border-[#7BA7AE]/20">
                      Premium
                    </div>
                    
                    {/* Title overlay on image */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-xl font-bold text-white">Practice Realistic Mock Case Interview</h3>
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#245D66] to-[#7BA7AE] group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Real-time voice interaction with slide sharing and on-demand case fact introduction.</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm group/item">
                          <CheckCircle className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] mt-0.5 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200">Get personalized Gap Analysis scorecard with detailed feedback</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm group/item">
                          <CheckCircle className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] mt-0.5 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200">Perfect for real interview simulation with adaptive challenges</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-[#245D66] to-[#7BA7AE] hover:from-[#7BA7AE] hover:to-[#245D66] text-white font-medium py-2 relative overflow-hidden group/btn transition-all duration-500 border-0 shadow-md hover:shadow-lg"
                      onClick={() => window.open('https://aicoach.beingconsultant.com', '_self')}
                    >
                      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        <Play className="h-4 w-4" />
                        Start Practice
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Guided Coaching */}
                <div className="group relative p-0 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 dark:border-white/5 bg-white dark:bg-black/40 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  
                  {/* Image section with overlay */}
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image 
                      src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/WhatsApp%20Image%202025-03-28%20at%2013.27.42_b1735854.jpg?alt=media&token=4d8b7281-4bce-43e9-9bb1-2ba5d13454bc"
                      alt="Guided Case Interview Coaching"
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#245D66] dark:text-[#7BA7AE] shadow-md border border-[#245D66]/20 dark:border-[#7BA7AE]/20">
                      Popular
                    </div>
                    
                    {/* Title overlay on image */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-xl font-bold text-white">Guided Case Interview Coaching</h3>
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#245D66] to-[#7BA7AE] group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Receive feedback after each interaction —perfect for candidates familiarizing themselves with the case interview format.</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm group/item">
                          <CheckCircle className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] mt-0.5 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200">Sharpen responses with guided answers and expert tips</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm group/item">
                          <CheckCircle className="h-5 w-5 text-[#245D66] dark:text-[#7BA7AE] mt-0.5 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200">See ideal responses for each stage of the case interview</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-white hover:bg-gray-50 dark:bg-black/60 dark:hover:bg-black/80 text-[#245D66] dark:text-[#7BA7AE] font-medium py-2 relative overflow-hidden group/btn transition-all duration-500 border border-[#245D66]/30 dark:border-[#7BA7AE]/30 shadow-md hover:shadow-lg"
                      disabled
                    >
                      <span className="absolute inset-0 bg-[#245D66]/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Coming soon
                      </span>
                    </Button>
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome modal with motion animation */}
        <Dialog open={false} onOpenChange={setShowWelcomeModal}>
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
