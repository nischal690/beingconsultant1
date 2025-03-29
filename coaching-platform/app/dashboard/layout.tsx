"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import SimpleTour, { TOUR_STATUS } from "@/app/components/SimpleTour"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  User,
  Briefcase,
  Award,
  FileCheck,
  Brain,
  Users,
  FileText,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  Plus,
  ChevronDown,
  UsersRound,
  Bot,
  CalendarDays,
  CalendarPlus,
  CalendarClock,
  GraduationCap,
  Calculator,
  UserRound,
  Trophy,
  Wrench,
  LayoutGrid,
  Video,
  Library,
  Dumbbell,
  FileDown,
  Mail,
  BarChart,
  Bookmark,
  Star,
  Heart,
  LineChart,
  CircleUser,
} from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserProfile } from "@/lib/firebase/firestore"
import { useRouter } from "next/navigation"
import { SettingsDialog } from "@/components/settings/settings-dialog"

// Custom component for the sidebar logo that hides text when collapsed
function SidebarLogo({ sidebarState }: { sidebarState: "expanded" | "collapsed" }) {
  const isCollapsed = sidebarState === "collapsed";
  
  return (
    <Link href="/dashboard" className="flex items-center gap-2 w-full">
      <div className="flex items-center justify-center w-full">
        <svg width="30" height="28" viewBox="-1 -1 147 139" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <path d="M85.2707 20.2907V113.5L134.797 122.377V74.6627H144.702V136.802L75.9635 123.487V12.5233L144.702 1.42695V62.4568H134.797V12.5233L85.2707 20.2907Z" fill="url(#paint0_linear_12_122)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M70.4129 123.487V12.5233L0.0859375 0.317322V135.693L70.4129 123.487ZM59.5171 20.2907L9.99114 12.5233V121.267L59.5171 113.5V73.5531H24.8489V62.4568H59.5171V20.2907Z" fill="url(#paint1_linear_12_122)"/>
          <defs>
            <linearGradient id="paint0_linear_12_122" x1="72.3939" y1="0.317322" x2="72.3939" y2="136.802" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="#040404"/>
            </linearGradient>
            <linearGradient id="paint1_linear_12_122" x1="72.3939" y1="0.317322" x2="72.3939" y2="136.802" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"/>
              <stop offset="1" stopColor="#040404"/>
            </linearGradient>
          </defs>
        </svg>
        {!isCollapsed && (
          <span className="font-semibold text-white uppercase tracking-wide text-sm leading-tight ml-2">
            BEING CONSULTANT
          </span>
        )}
      </div>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [runTour, setRunTour] = useState(true)
  const { user, logout } = useAuth()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [sidebarState, setSidebarState] = useState<"expanded" | "collapsed">("collapsed");
  const router = useRouter()

  // Define handleLogout function
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Check sidebar state from cookie
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('sidebar:state='));
      
      if (sidebarCookie) {
        const state = sidebarCookie.split('=')[1];
        setSidebarState(state === 'true' ? 'expanded' : 'collapsed');
      } else {
        // No cookie found, set default to collapsed and create the cookie
        document.cookie = 'sidebar:state=false; path=/; max-age=31536000'; // 1 year expiry
        setSidebarState('collapsed');
      }
    };

    checkSidebarState();
    
    // Set up an interval to check the cookie regularly
    const cookieObserver = setInterval(checkSidebarState, 300);
    
    return () => {
      clearInterval(cookieObserver);
    };
  }, []);
  
  // Define the tour steps
  const steps = [
    {
      target: "body",
      content: "Welcome to BeingConsultant Dashboard! Let's take a quick tour to help you navigate the platform.",
      placement: "center" as const,
      disableBeacon: true,
    },
    {
      target: ".sidebar-nav",
      content: "This is your navigation menu. Access different sections of the platform from here.",
      placement: "right" as const,
    },
    {
      target: ".coaching-section",
      content: "Find all your coaching programs here.",
      placement: "right" as const,
    },
    {
      target: ".ai-coach-section",
      content: "Try our AI Coach feature for instant guidance and support.",
      placement: "right" as const,
    },
    {
      target: ".resources-section",
      content: "Access valuable resources like personality assessments, cheatsheets, meditation guides, and CV/CL templates.",
      placement: "right" as const,
    },
    {
      target: ".learning-section",
      content: "Explore our learning materials including case interviews, frameworks, and industry insights.",
      placement: "right" as const,
    },
    {
      target: ".community-section",
      content: "Connect with other consultants, join events, and participate in discussions.",
      placement: "right" as const,
    },
    {
      target: ".profile-dropdown",
      content: "Access your profile settings, notifications, and account options here.",
      placement: "bottom" as const,
    },
    {
      target: ".main-content",
      content: "This is your main dashboard area where you'll see personalized content based on the section you're viewing.",
      placement: "left" as const,
    },
    {
      target: "body",
      content: "You're all set! Remember you can take this tour again anytime by clicking the 'Tour Guide' button at the bottom right.",
      placement: "center" as const,
    }
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status, step } = data;
    
    // Handle scrolling for specific steps
    if (status === TOUR_STATUS.RUNNING) {
      // Use setTimeout to ensure DOM is ready after the step change
      setTimeout(() => {
        // Scroll to the appropriate section based on the current step
        switch (step) {
          case 2: // Coaching section
            scrollToSection('.coaching-section');
            break;
          case 3: // AI Coach section
            scrollToSection('.ai-coach-section');
            break;
          case 4: // Resources section
            scrollToSection('.resources-section');
            break;
          case 5: // Learning section
            scrollToSection('.learning-section');
            break;
          case 6: // Community section
            scrollToSection('.community-section');
            break;
          default:
            break;
        }
      }, 100);
    }
    
    if (status === TOUR_STATUS.FINISHED || status === TOUR_STATUS.SKIPPED) {
      setRunTour(false);
    }
  };
  
  // Helper function to scroll to a section in the sidebar
  const scrollToSection = (selector: string) => {
    try {
      // Find the target element
      const targetElement = document.querySelector(selector);
      
      if (!targetElement) {
        console.warn(`Target element not found: ${selector}`);
        return;
      }
      
      // Use the browser's built-in scrollIntoView method
      // This will work regardless of which container is scrollable
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      console.log(`Scrolling to ${selector} using scrollIntoView`);
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen bg-black text-white">
          <DashboardHeader 
            activeDropdown={activeDropdown} 
            setActiveDropdown={setActiveDropdown} 
            sidebarState={sidebarState}
          />
          
          <div className="flex-1 flex">
            <Sidebar 
              className="sidebar-nav shadow-xl border-r border-sidebar-border bg-gradient-to-b from-sidebar-background to-sidebar-background/90 backdrop-blur-md z-50"
              collapsible="icon"
            >
              <div className="absolute top-4 right-0 translate-x-1/2 z-50">
                <SidebarTrigger className="text-white hover:text-white transition-colors duration-200 shadow-lg bg-black/80 border border-white/30" />
              </div>
              <SidebarHeader className="border-b border-sidebar-border p-4">
                <div className="flex items-center gap-4">
                  <SidebarLogo sidebarState={sidebarState} />
                </div>
              </SidebarHeader>
              <SidebarContent className="px-2 py-4">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === "/dashboard"} 
                      className="hover-lift"
                      tooltip="Dashboard"
                    >
                      <Link href="/dashboard" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                        <Home className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === "/dashboard/profile"} 
                      className="hover-lift"
                      tooltip="Profile"
                    >
                      <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                        <User className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>

                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Coaching
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="coaching-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === "/dashboard/coaching"} 
                          className="hover-lift"
                          tooltip="Land a job"
                        >
                          <Link href="/dashboard/coaching" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Briefcase className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Land a job</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === "/dashboard/coaching/career-excellence"} 
                          className="hover-lift"
                          tooltip="Career excellence"
                        >
                          <Link href="/dashboard/coaching/career-excellence" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Award className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Career excellence</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === "/dashboard/coaching/career-transition"} 
                          className="hover-lift"
                          tooltip="Career transition"
                        >
                          <Link href="/dashboard/coaching/career-transition" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <FileCheck className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Career transition</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    AI Coach
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="ai-coach-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === "/dashboard/ai-coach"} 
                          className="hover-lift"
                          tooltip="AI Coach"
                        >
                          <Link href="/dashboard/ai-coach" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Bot className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">AI Coach</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === "/dashboard/ai-coach/case-interview"} 
                          className="hover-lift"
                          tooltip="Case Interview"
                        >
                          <Link href="/dashboard/ai-coach/case-interview" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Brain className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Case Interview</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === "/dashboard/ai-coach/fit-interview"} 
                          className="hover-lift"
                          tooltip="FIT Interview"
                        >
                          <Link href="/dashboard/ai-coach/fit-interview" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Users className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">FIT Interview</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Resources
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="resources-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.startsWith("/dashboard/resources")} 
                          className="hover-lift"
                          tooltip="Toolkit"
                        >
                          <Link href="/dashboard/resources" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <FileText className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Toolkit</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.startsWith("/dashboard/stories")} 
                          className="hover-lift"
                          tooltip="Stories"
                        >
                          <Link href="/dashboard/stories" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Sparkles className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Stories</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Learning
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="learning-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.startsWith("/dashboard/learning")} 
                          className="hover-lift"
                          tooltip="Courses"
                        >
                          <Link href="/dashboard/learning" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <BookOpen className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Courses</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Whatsapp community
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="community-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.startsWith("/dashboard/community")} 
                          className="hover-lift"
                          tooltip="Join Community"
                        >
                          <Link href="/dashboard/community" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <MessageSquare className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Join</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="border-t border-sidebar-border p-4">
                <div className="flex flex-col space-y-4">
                  <SettingsDialog 
                    trigger={
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 hover-lift group-data-[collapsible=icon]:justify-center"
                        title="Settings"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                      </Button>
                    } 
                  />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover-lift group-data-[collapsible=icon]:justify-center"
                    onClick={handleLogout}
                    title="Log Out"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
                  </Button>
                </div>
              </SidebarFooter>
            </Sidebar>
            <main className="flex-1 min-h-[calc(100vh-4rem)] p-8">
              {children}
            </main>
          </div>
          
          {pathname === '/dashboard' && (
            <Button 
              className="tour-button fixed right-4 bottom-4 z-50 bg-primary hover:bg-primary/90 flex items-center gap-2 shadow-lg transition-all duration-200"
              onClick={() => setRunTour(true)}
            >
              <HelpCircle size={16} />
              <span>Tour Guide</span>
            </Button>
          )}
          
          {runTour && (
            <SimpleTour
              steps={steps}
              run={runTour}
              continuous={true}
              showSkipButton={true}
              callback={handleJoyrideCallback}
            />
          )}
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

function DashboardHeader({ activeDropdown, setActiveDropdown, sidebarState }: { activeDropdown: string | null, setActiveDropdown: (dropdown: string | null) => void, sidebarState: "expanded" | "collapsed" }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeDropdownLocal, setActiveDropdownLocal] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.uid) {
        try {
          const result = await getUserProfile(user.uid);
          if (result.success && result.data && result.data.firstName) {
            setFirstName(result.data.firstName);
          } else if (user.displayName) {
            // Fallback to displayName if firstName is not in Firestore
            const displayNameParts = user.displayName.split(' ');
            setFirstName(displayNameParts[0]);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/70 border-b border-white/10 transition-all duration-300">
      <div className="max-w-[1920px] mx-auto">
        {/* Subtle gradient top border */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        <div className="flex h-16 items-center px-8 relative">
          {/* Left section with logo only */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              {/* Logo and text removed */}
            </Link>
          </div>
          
          {/* Welcome message */}
          <div className="hidden md:flex items-center ml-8">
            <p className="text-white/90 text-sm font-medium">
              {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            </p>
          </div>
          
          {/* Center navigation with dropdown menus - adjusted to be truly centered and responsive to sidebar state */}
          <nav className={`flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${sidebarState === "collapsed" ? "ml-[1rem]" : "ml-[3.5rem]"}`}>
            {/* Coaching Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('coaching')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/dashboard/coaching">
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'coaching' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  <span>Coaching</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Link>
              {activeDropdown === 'coaching' && (
                <div className="absolute top-full left-0 mt-1 w-[800px] rounded-md bg-black/90 backdrop-blur-lg border border-white/10 shadow-lg shadow-black/40 overflow-hidden z-50">
                  <div className="p-6">
                    <div className="grid grid-cols-4 gap-6">
                      {/* First column */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          One-on-One Coaching
                        </h3>
                        <p className="text-xs text-white/60 mb-3">All you need to stand out in every dimension of the case interview.</p>
                        <div className="space-y-2">
                          <Link href="/dashboard/coaching/one-on-one/case-interview" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <CircleUser className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Case Interview
                          </Link>
                          <Link href="/dashboard/coaching/one-on-one/fit-interview" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <CircleUser className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Fit Interview
                          </Link>
                          <Link href="/dashboard/coaching/one-on-one/personal-experience" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <CircleUser className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Personal Experience Interview
                          </Link>
                        </div>
                      </div>
                      
                      {/* Second column */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                          <UsersRound className="h-4 w-4 mr-2 text-primary" />
                          Group Coaching
                        </h3>
                        <p className="text-xs text-white/60 mb-3">Preparation for the kind of math problems you'll face in a case.</p>
                        <div className="space-y-2">
                          <Link href="/dashboard/coaching/group/case-workshops" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <Users className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Case Workshops
                          </Link>
                          <Link href="/dashboard/coaching/group/industry-sessions" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <Briefcase className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Industry Sessions
                          </Link>
                        </div>
                      </div>
                      
                      {/* Third column */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                          <Bot className="h-4 w-4 mr-2 text-primary" />
                          AI Coaching
                        </h3>
                        <p className="text-xs text-white/60 mb-3">All you need to excel in consulting fit interviews.</p>
                        <div className="space-y-2">
                          <Link href="/dashboard/coaching/ai-coach/case-practice" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <BarChart className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Case Practice
                          </Link>
                          <Link href="/dashboard/coaching/ai-coach/fit-practice" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <MessageSquare className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Fit Practice
                          </Link>
                          <Link href="/dashboard/coaching/ai-coach/resume-review" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <FileText className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Resume Review
                          </Link>
                        </div>
                      </div>
                      
                      {/* Fourth column */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                          Schedule
                        </h3>
                        <p className="text-xs text-white/60 mb-3">Preparation for McKinsey's Personal Experience Interview (PEI).</p>
                        <div className="space-y-2">
                          <Link href="/dashboard/coaching/schedule/book-session" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <CalendarPlus className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Book a Session
                          </Link>
                          <Link href="/dashboard/coaching/schedule/upcoming" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <CalendarClock className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Upcoming Sessions
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Practice Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('practice')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/dashboard/practice">
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'practice' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  <span>Practice</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Link>
              {activeDropdown === 'practice' && (
                <div className="absolute top-full left-0 mt-1 w-[800px] rounded-md bg-black/90 backdrop-blur-lg border border-white/10 shadow-lg shadow-black/40 overflow-hidden z-50">
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="col-span-2">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                          Interview Prep Courses
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Link href="/dashboard/practice/case-interview" className="block px-3 py-2 text-xs font-medium text-white hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                              <MessageSquare className="h-3.5 w-3.5 mr-2 text-white/60" />
                              Case Interview
                            </Link>
                            <p className="text-xs text-white/60 ml-7 mt-1">All you need to stand out in every dimension of the case interview.</p>
                          </div>
                          
                          <div>
                            <Link href="/dashboard/practice/case-math" className="block px-3 py-2 text-xs font-medium text-white hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                              <Calculator className="h-3.5 w-3.5 mr-2 text-white/60" />
                              Case Math
                            </Link>
                            <p className="text-xs text-white/60 ml-7 mt-1">Preparation for the kind of math problems you'll face in a case.</p>
                          </div>
                          
                          <div>
                            <Link href="/dashboard/practice/fit-interview" className="block px-3 py-2 text-xs font-medium text-white hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                              <UserRound className="h-3.5 w-3.5 mr-2 text-white/60" />
                              Fit Interview
                            </Link>
                            <p className="text-xs text-white/60 ml-7 mt-1">All you need to excel in consulting fit interviews.</p>
                          </div>
                          
                          <div>
                            <Link href="/dashboard/practice/personal-experience" className="block px-3 py-2 text-xs font-medium text-white hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                              <Trophy className="h-3.5 w-3.5 mr-2 text-white/60" />
                              Personal Experience Interview
                            </Link>
                            <p className="text-xs text-white/60 ml-7 mt-1">Preparation for McKinsey's Personal Experience Interview (PEI).</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-2 mt-6">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                          <Wrench className="h-4 w-4 mr-2 text-primary" />
                          Practice Tools
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Link href="/dashboard/practice/frameworks" className="block px-3 py-2 text-xs font-medium text-white hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                              <LayoutGrid className="h-3.5 w-3.5 mr-2 text-white/60" />
                              Frameworks
                            </Link>
                            <p className="text-xs text-white/60 ml-7 mt-1">Essential frameworks for solving different types of cases.</p>
                          </div>
                          
                          <div>
                            <Link href="/dashboard/practice/mock-interviews" className="block px-3 py-2 text-xs font-medium text-white hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                              <Video className="h-3.5 w-3.5 mr-2 text-white/60" />
                              Mock Interviews
                            </Link>
                            <p className="text-xs text-white/60 ml-7 mt-1">Practice with realistic interview simulations.</p>
                          </div>
                          
                          <div>
                            <Link href="/dashboard/practice/case-library" className="block px-3 py-2 text-xs font-medium text-white hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                              <Library className="h-3.5 w-3.5 mr-2 text-white/60" />
                              Case Library
                            </Link>
                            <p className="text-xs text-white/60 ml-7 mt-1">Extensive collection of practice cases with solutions.</p>
                          </div>
                          
                          <div>
                            <Link href="/dashboard/practice/drills" className="block px-3 py-2 text-xs font-medium text-white hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                              <Dumbbell className="h-3.5 w-3.5 mr-2 text-white/60" />
                              Practice Drills
                            </Link>
                            <p className="text-xs text-white/60 ml-7 mt-1">Focused exercises to build specific case skills.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('resources')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/dashboard/resources">
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'resources' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  <span>Resources</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Link>
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-1 w-[800px] rounded-md bg-black/90 backdrop-blur-lg border border-white/10 shadow-lg shadow-black/40 overflow-hidden z-50">
                  <div className="p-5">
                    <div className="grid grid-cols-4 gap-4">
                      {/* First column */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          Free Resume Courses
                        </h3>
                        <p className="text-xs text-white/60 mb-2">Write successful applications to top firms.</p>
                        <div className="space-y-1">
                          <Link href="/dashboard/resources/resume/for-students" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <GraduationCap className="h-3.5 w-3.5 mr-2 text-white/60" />
                            For Students
                          </Link>
                          <Link href="/dashboard/resources/resume/for-mba" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <BookOpen className="h-3.5 w-3.5 mr-2 text-white/60" />
                            For MBA Candidates
                          </Link>
                          <Link href="/dashboard/resources/resume/for-professionals" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <Briefcase className="h-3.5 w-3.5 mr-2 text-white/60" />
                            For Professionals
                          </Link>
                        </div>
                      </div>
                      
                      {/* Second column */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                          <FileDown className="h-4 w-4 mr-2 text-primary" />
                          Templates & Tools
                        </h3>
                        <p className="text-xs text-white/60 mb-2">Video tutorials and templates.</p>
                        <div className="space-y-1">
                          <Link href="/dashboard/resources/templates/cv" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <FileText className="h-3.5 w-3.5 mr-2 text-white/60" />
                            CV Templates
                          </Link>
                          <Link href="/dashboard/resources/templates/cover-letter" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Cover Letter Templates
                          </Link>
                        </div>
                      </div>
                      
                      {/* Third column */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                          <BarChart className="h-4 w-4 mr-2 text-primary" />
                          Assessments
                        </h3>
                        <p className="text-xs text-white/60 mb-2">Discover your strengths.</p>
                        <div className="space-y-1">
                          <Link href="/dashboard/resources/assessments/personality" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <User className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Personality Assessments
                          </Link>
                          <Link href="/dashboard/resources/assessments/skills" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <Star className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Skills Assessments
                          </Link>
                        </div>
                      </div>
                      
                      {/* Fourth column */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                          <Bookmark className="h-4 w-4 mr-2 text-primary" />
                          Other Resources
                        </h3>
                        <p className="text-xs text-white/60 mb-2">Additional tools to help you.</p>
                        <div className="space-y-1">
                          <Link href="/dashboard/resources/cheatsheets" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <FileCheck className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Cheatsheets
                          </Link>
                          <Link href="/dashboard/resources/meditation" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <Heart className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Meditation Guides
                          </Link>
                          <Link href="/dashboard/resources/industry-insights" className="block px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors duration-200 flex items-center">
                            <LineChart className="h-3.5 w-3.5 mr-2 text-white/60" />
                            Industry Insights
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
          
          {/* Right section with profile dropdown */}
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30 transition-colors duration-200">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <SettingsDialog 
              trigger={
                <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white/20 hover:bg-white/10 hover:border-white/30 transition-colors duration-200">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              } 
            />
            
            <div className="profile-dropdown">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-transparent hover:bg-white/10 transition-colors duration-200">
                    <Avatar className="h-9 w-9 border border-white/20">
                      <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/AjRKyR2dPa4q3GuHOle8Vz37jl0.jpg?alt=media&token=73072a47-91b6-47ab-bb50-948f02186228" alt={user?.displayName || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/order-history')}>
                    <FileCheck className="mr-2 h-4 w-4" />
                    <span>Order History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
