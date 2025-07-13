"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  SidebarSeparator,
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
  Smile,
  Headphones,
  Unlock,
  Lock,
  ArrowUpRight,
  Infinity,
  ArrowRightLeft,
  MoveRight,
  ArrowRight,
  Crown,
} from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserProfile, timestampToDate } from "@/lib/firebase/firestore"
import { useRouter } from "next/navigation"
import { SettingsDialog } from "@/components/settings/settings-dialog"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { HeaderProvider, useHeader } from "@/lib/context/header-context"

// Function to format date in DD/MON/YYYY format
function formatDateToDDMonYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Custom component for the sidebar logo that hides name logo when collapsed
function SidebarLogo({ sidebarState }: { sidebarState: "expanded" | "collapsed" }) {
  const isCollapsed = sidebarState === "collapsed";
  
  return (
    <Link href="/dashboard" className="flex items-center gap-2 w-full">
      <div className="flex items-center justify-center w-full">
        {/* Main logo icon - always visible */}
        <svg width="30" height="28" viewBox="-1 -1 147 139" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <path d="M85.2707 20.2907V113.5L134.797 122.377V74.6627H144.702V136.802L75.9635 123.487V12.5233L144.702 1.42695V62.4568H134.797V12.5233L85.2707 20.2907Z" fill="url(#paint0_linear_12_122)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M70.4129 123.487V12.5233L0.0859375 0.317322V135.693L70.4129 123.487ZM59.5171 20.2907L9.99114 12.5233V121.267L59.5171 113.5V73.5531H24.8489V62.4568H59.5171V20.2907Z" fill="url(#paint1_linear_12_122)"/>
          <defs>
            <linearGradient id="paint0_linear_12_122" x1="72.3939" y1="0.317322" x2="72.3939" y2="136.802" gradientUnits="userSpaceOnUse">
              <stop stopColor="#245D66"/>
              <stop offset="1" stopColor="#245D66"/>
            </linearGradient>
            <linearGradient id="paint1_linear_12_122" x1="72.3939" y1="0.317322" x2="72.3939" y2="136.802" gradientUnits="userSpaceOnUse">
              <stop stopColor="#245D66"/>
              <stop offset="1" stopColor="#245D66"/>
            </linearGradient>
          </defs>
        </svg>
        
        {/* Name logo - only visible when sidebar is expanded */}
        {!isCollapsed && (
          <div className="ml-3">
            <Image 
              src="/beingconsultantlogo.png" 
              alt="Being Consultant" 
              width={150} 
              height={40} 
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        )}
      </div>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </HeaderProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const { user, logout } = useAuth()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isHeaderVisible } = useHeader();
  const [sidebarState, setSidebarState] = useState<"expanded" | "collapsed">("collapsed");
  const router = useRouter()
  const [isMember, setIsMember] = useState(false)
  const [membershipExpiry, setMembershipExpiry] = useState<string | null>(null)

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
    
    window.addEventListener('resize', checkSidebarState)
    return () => window.removeEventListener('resize', checkSidebarState)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch membership status
  useEffect(() => {
    async function fetchMembership() {
      if (!user) {
        setIsMember(false);
        return;
      }
      try {
        const res = await getUserProfile(user.uid);
        if (res.success && res.data) {
          setIsMember(!!res.data.isMember);
          if (res.data.membershipExpiry) {
            const expiryVal: any = res.data.membershipExpiry;
            let expiryText: string | null = null;
            // Detect Firestore Timestamp (has seconds & nanoseconds)
            if (typeof expiryVal === 'object' && 'seconds' in expiryVal && 'nanoseconds' in expiryVal) {
              const d = timestampToDate(expiryVal);
              expiryText = formatDateToDDMonYYYY(d);
            } else {
              // For strings, keep as-is; for millis/ISO try Date
              const parsed = new Date(expiryVal);
              expiryText = isNaN(parsed.getTime()) ? String(expiryVal) : formatDateToDDMonYYYY(parsed);
            }
            if (expiryText) {
              setMembershipExpiry(expiryText);
            }
          }
        } else {
          setIsMember(false);
        }
      } catch (err) {
        console.error("Error fetching membership status", err);
        setIsMember(false);
      }
    }

    fetchMembership();
  }, [user])

  if (!isMounted) {
    return null
  }

  // Check if current route is the personality assessment
  const isPersonalityAssessment = pathname.includes('/assessments/personality');

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen w-full bg-black text-white">
         {/* Dashboard header - conditionally rendered based on context */}
         {!isPersonalityAssessment && isHeaderVisible && (
           <DashboardHeader activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} sidebarState={sidebarState} />
         )}
          <div className="flex-1 flex w-full">
            {!isPersonalityAssessment && (
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
  </SidebarMenu>
                <SidebarSeparator className="my-2 hidden group-data-[collapsible=icon]:block" />
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Coaching
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="offerings-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === "/dashboard/coaching" || pathname.includes("/dashboard/coaching/one-on-one")} 
                          className="hover-lift"
                          tooltip="1-1 Coaching"
                        >
                          <Link href="/dashboard/coaching" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <UserRound className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">1-1 Coaching</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.includes("/dashboard/group-coaching")} 
                          className="hover-lift"
                          tooltip="Group Coaching"
                        >
                          <Link href="/dashboard/group-coaching" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Users className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Group Coaching</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator className="my-2 hidden group-data-[collapsible=icon]:block" />
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Practice
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="practice-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          className="hover-lift"
                          tooltip="AI Coach"
                        >
                          <Link href="https://aicoach.beingconsultant.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Bot className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">AI Coach</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="my-2 hidden group-data-[collapsible=icon]:block" />
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Resources Library
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="resources-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.includes("/dashboard/video-courses")} 
                          className="hover-lift"
                          tooltip="Video Courses"
                        >
                          <Link href="/dashboard/video-courses" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Video className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Video Courses</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.includes("/dashboard/masterclass")} 
                          className="hover-lift"
                          tooltip="Masterclass"
                        >
                          <Link href="/dashboard/masterclass" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <GraduationCap className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Masterclass</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.includes("/dashboard/ebooks")} 
                          className="hover-lift"
                          tooltip="Ebooks/Guides"
                        >
                          <Link href="/dashboard/ebooks" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <BookOpen className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Ebooks/Guides</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.includes("/dashboard/assessments")} 
                          className="hover-lift"
                          tooltip="Assessment"
                        >
                          <Link href="/dashboard/assessments" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <FileCheck className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Assessment</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator className="my-2 hidden group-data-[collapsible=icon]:block" />
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Community
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="community-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.includes("/dashboard/events")} 
                          className="hover-lift"
                          tooltip="Events"
                        >
                          <Link href="/dashboard/events" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <CalendarDays className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Events</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.includes("/dashboard/job-board")} 
                          className="hover-lift"
                          tooltip="Job Board"
                        >
                          <Link href="/dashboard/job-board" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Briefcase className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Job Board</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="border-t border-sidebar-border p-4">
                <div className="flex flex-col space-y-4">
                  {isMember ? (
                    <Link 
                      href="/dashboard/membership/already"
                      className="relative group overflow-hidden"
                    >
                      <Button 
                        variant="default" 
                        className="w-full justify-start gap-2 bg-yellow-500 hover:bg-yellow-600 border-none text-black shadow-lg hover:shadow-xl transition-all duration-300 group-data-[collapsible=icon]:justify-center group-hover:scale-[1.02]"
                        title="Already a Member"
                      >
                        <Crown className="h-4 w-4 text-black" />
                        <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                          <span className="font-bold text-xs">Already a Member</span>
                          {membershipExpiry && (
                            <span className="text-[10px] opacity-80">Expires: {membershipExpiry}</span>
                          )}
                        </div>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full animate-shimmer"></span>
                      </Button>
                    </Link>
                  ) : (
                    <Link 
                      href="/dashboard/membership"
                      className="relative group overflow-hidden"
                    >
                      <Button 
                        variant="default" 
                        className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 border-none text-white shadow-lg hover:shadow-xl transition-all duration-300 group-data-[collapsible=icon]:justify-center group-hover:scale-[1.02]"
                        title="Become a Member"
                      >
                        <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                        <span className="group-data-[collapsible=icon]:hidden font-bold">Become a Member</span>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full animate-shimmer"></span>
                      </Button>
                    </Link>
                  )}
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
            )}
            <main className={`flex-1 ${!isPersonalityAssessment ? 'min-h-[calc(100vh-4rem)]' : 'min-h-screen'}`}>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

function DashboardHeader({ activeDropdown, setActiveDropdown, sidebarState }: { activeDropdown: string | null, setActiveDropdown: (dropdown: string | null) => void, sidebarState: "expanded" | "collapsed" }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [firstName, setFirstName] = useState<string>("");
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  
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
          
          {/* Center navigation with dropdown menus - adjusted to be truly centered and responsive to sidebar state */}
          <nav className={`flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${sidebarState === "collapsed" ? "ml-[1rem]" : "ml-[3.5rem]"}`}>
            {/* Offering Dropdown */}
            <div className="relative group hidden"
                 onMouseEnter={() => {
                   if (dropdownTimeout) {
                     clearTimeout(dropdownTimeout);
                     setDropdownTimeout(null);
                   }
                   setActiveDropdown('offering');
                 }}
                 onMouseLeave={() => {
                   const timeout = setTimeout(() => {
                     setActiveDropdown(null);
                   }, 300); // 300ms delay before hiding
                   setDropdownTimeout(timeout);
                 }}>
              <button onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'offering' ? null : 'offering');
              }} className="focus:outline-none">
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-md ${activeDropdown === 'offering' ? 'bg-[#245D66] text-white' : 'text-white/80 hover:text-white hover:bg-[#245D66]'}`}>
                  <span>Offering</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
              {activeDropdown === 'offering' && (
                <div className="fixed top-[64px] left-1/2 -translate-x-1/2 mt-1 w-[450px] rounded-md bg-white border border-gray-100 shadow-lg shadow-black/10 overflow-hidden z-[150]"
                     onMouseEnter={() => {
                       if (dropdownTimeout) {
                         clearTimeout(dropdownTimeout);
                         setDropdownTimeout(null);
                       }
                       setActiveDropdown('offering');
                     }}
                     onMouseLeave={() => {
                       const timeout = setTimeout(() => {
                         setActiveDropdown(null);
                       }, 300); // 300ms delay before hiding
                       setDropdownTimeout(timeout);
                     }}>
                  <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="space-y-3">
                          {/* One-on-One Coaching */}
                          <button className="block group w-full text-left">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-black !text-black">One-on-One Coaching</h3>
                                <p className="text-xs text-gray-500">Personalized Case Coaching</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </button>
                          
                          {/* Group Coaching */}
                          <button className="block group w-full text-left">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-black !text-black">Group Coaching</h3>
                                <p className="text-xs text-gray-500">Collaborative group Learning Sessions</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </button>
                          
                          {/* Workshops */}
                          <button className="block group w-full text-left">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-black !text-black">Workshops</h3>
                                <p className="text-xs text-gray-500">Hands-on Case Workshops</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                      
                      {/* Promotional Banner */}
                      <div className="w-[180px] border-l border-gray-200 pl-4">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="relative overflow-hidden rounded-md h-[100px]">
                              <Image 
                                src="https://framerusercontent.com/images/AjRKyR2dPa4q3GuHOle8Vz37jl0.png" 
                                alt="Premium Coaching" 
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-[10px] font-medium text-black">Get premium 1-1 Coaching</span>
                            <Button variant="outline" size="sm" className="h-6 text-xs px-2">BUY</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tools & Guides Dropdown */}
            <div className="relative hidden"
                 onMouseEnter={() => {
                   if (dropdownTimeout) {
                     clearTimeout(dropdownTimeout);
                     setDropdownTimeout(null);
                   }
                   setActiveDropdown('tools');
                 }}
                 onMouseLeave={() => {
                   const timeout = setTimeout(() => {
                     setActiveDropdown(null);
                   }, 300); // 300ms delay before hiding
                   setDropdownTimeout(timeout);
                 }}>
              <button onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'tools' ? null : 'tools');
              }}>
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-md ${activeDropdown === 'tools' ? 'bg-[#245D66] text-white' : 'text-white/80 hover:text-white hover:bg-[#245D66]'}`}>
                  <span>Tools & Guides</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
              {activeDropdown === 'tools' && (
                <div className="fixed top-[64px] left-1/2 -translate-x-1/2 mt-1 w-[450px] rounded-md bg-white border border-gray-100 shadow-lg shadow-black/10 overflow-hidden z-[150]"
                     onMouseEnter={() => {
                       if (dropdownTimeout) {
                         clearTimeout(dropdownTimeout);
                         setDropdownTimeout(null);
                       }
                       setActiveDropdown('tools');
                     }}
                     onMouseLeave={() => {
                       const timeout = setTimeout(() => {
                         setActiveDropdown(null);
                       }, 300); // 300ms delay before hiding
                       setDropdownTimeout(timeout);
                     }}>
                  <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="space-y-3">
                          {/* AI Coach */}
                          <button className="block group w-full text-left">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium !text-black">AI Coach</h3>
                                <p className="text-xs text-gray-500">Practice with AI Tutor</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </button>
                          
                          {/* Job Board */}
                          <button className="block group w-full text-left">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium !text-black">Job Board</h3>
                                <p className="text-xs text-gray-500">Consulting Openings Hub</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </button>
                          
                          {/* Assessments */}
                          <button className="block group w-full text-left">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium !text-black">Assessments</h3>
                                <p className="text-xs text-gray-500">Skill Tests & Quizzes</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </button>
                          
                          {/* Ebooks/Guide */}
                          <button className="block group w-full text-left">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium !text-black">Ebooks/Guide</h3>
                                <p className="text-xs text-gray-500">Downloadable Learning Guides</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                      
                      {/* Promotional Banner */}
                      <div className="w-[180px] border-l border-gray-200 pl-4">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="relative overflow-hidden rounded-md h-[100px]">
                              <Image 
                                src="https://framerusercontent.com/images/AjRKyR2dPa4q3GuHOle8Vz37jl0.png" 
                                alt="Practice Mock Case" 
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-[10px] font-medium text-black">Practice Mock Case Interview with AI Coach</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative hidden"
                 onMouseEnter={() => {
                   if (dropdownTimeout) {
                     clearTimeout(dropdownTimeout);
                     setDropdownTimeout(null);
                   }
                   setActiveDropdown('resources');
                 }}
                 onMouseLeave={() => {
                   const timeout = setTimeout(() => {
                     setActiveDropdown(null);
                   }, 300); // 300ms delay before hiding
                   setDropdownTimeout(timeout);
                 }}>
              <button onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'resources' ? null : 'resources');
              }}>
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-md ${activeDropdown === 'resources' ? 'bg-[#245D66] text-white' : 'text-white/80 hover:text-white hover:bg-[#245D66]'}`}>
                  <span>Resources</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
              {activeDropdown === 'resources' && (
                <div className="fixed top-[64px] left-1/2 -translate-x-1/2 mt-1 w-[450px] rounded-md bg-white border border-gray-100 shadow-lg shadow-black/10 overflow-hidden z-[150]"
                     onMouseEnter={() => {
                       if (dropdownTimeout) {
                         clearTimeout(dropdownTimeout);
                         setDropdownTimeout(null);
                       }
                       setActiveDropdown('resources');
                     }}
                     onMouseLeave={() => {
                       const timeout = setTimeout(() => {
                         setActiveDropdown(null);
                       }, 300); // 300ms delay before hiding
                       setDropdownTimeout(timeout);
                     }}>
                  <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="space-y-3">
                          {/* Upcoming Events */}
                          <Link href="/dashboard/resources/events" className="block group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium !text-black">Upcoming Events</h3>
                                <p className="text-xs text-gray-500">Live Prep Events</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </Link>
                          
                          {/* Blogs */}
                          <Link href="/dashboard/resources/blogs" className="block group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium !text-black">Blogs</h3>
                                <p className="text-xs text-gray-500">Insights & Strategies</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </Link>
                          
                          {/* Social Feeds */}
                          <Link href="/dashboard/resources/social" className="block group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium !text-black">Social Feeds</h3>
                                <p className="text-xs text-gray-500">Community Updates</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </Link>
                          
                          {/* Podcast */}
                          <Link href="/dashboard/resources/podcast" className="block group">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium !text-black">Podcast</h3>
                                <p className="text-xs text-gray-500">Expert Talks & Tips</p>
                              </div>
                              <div className="text-gray-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                      
                      {/* Articles Section */}
                      <div className="w-[180px] border-l border-gray-200 pl-4">
                        <div className="flex flex-col h-full space-y-3">
                          {/* First Article */}
                          <div className="bg-[#e8f0f0] rounded-md p-2 flex flex-col">
                            <div className="flex gap-2 items-start mb-1">
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <Image 
                                  src="https://framerusercontent.com/images/AjRKyR2dPa4q3GuHOle8Vz37jl0.png" 
                                  alt="Consulting Career" 
                                  fill
                                  className="object-cover rounded-sm"
                                />
                              </div>
                              <p className="text-[10px] font-medium text-black">Launching Your Consulting Career: Making the Most of Your First 90 Days</p>
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                              <span className="text-[9px] text-gray-500">Read latest article</span>
                              <ChevronDown className="h-3 w-3 text-gray-500 transform -rotate-90" />
                            </div>
                          </div>
                          
                          {/* Second Article */}
                          <div className="bg-[#e8f0f0] rounded-md p-2 flex flex-col">
                            <div className="flex gap-2 items-start mb-1">
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <Image 
                                  src="https://framerusercontent.com/images/AjRKyR2dPa4q3GuHOle8Vz37jl0.png" 
                                  alt="Negotiating Salary" 
                                  fill
                                  className="object-cover rounded-sm"
                                />
                              </div>
                              <p className="text-[10px] font-medium text-black">Negotiating Salary in Consulting: Are You Really Pushing?</p>
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                              <span className="text-[9px] text-gray-500">Read latest article</span>
                              <ChevronDown className="h-3 w-3 text-gray-500 transform -rotate-90" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Community Dropdown */}
            <div className="relative hidden"
                 onMouseEnter={() => {
                   if (dropdownTimeout) {
                     clearTimeout(dropdownTimeout);
                     setDropdownTimeout(null);
                   }
                   setActiveDropdown('community');
                 }}
                 onMouseLeave={() => {
                   const timeout = setTimeout(() => {
                     setActiveDropdown(null);
                   }, 300); // 300ms delay before hiding
                   setDropdownTimeout(timeout);
                 }}>
              <button onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'community' ? null : 'community');
              }}>
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-md ${activeDropdown === 'community' ? 'bg-[#245D66] text-white' : 'text-white/80 hover:text-white hover:bg-[#245D66]'}`}>
                  <span>Community</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
              {activeDropdown === 'community' && (
                <div className="fixed top-[64px] left-1/2 -translate-x-1/2 mt-1 w-[300px] rounded-md bg-white border border-gray-100 shadow-lg shadow-black/10 overflow-hidden z-[150]"
                     onMouseEnter={() => setActiveDropdown('community')}
                     onMouseLeave={() => setActiveDropdown(null)}>
                  <div className="p-4">
                    <div className="space-y-2">
                      <Link href="/dashboard/community/events" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        Events
                      </Link>
                      <Link href="/dashboard/community/stories" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                        <Sparkles className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        Stories
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
          
          {/* Right section with profile dropdown */}
          <div className="flex items-center gap-4 ml-auto">
            <NotificationDropdown />
            
            <SettingsDialog 
              trigger={
                <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white hover:bg-white hover:border-white transition-colors duration-200 header-icon-button">
                  <Settings className="h-4 w-4 text-white [.header-icon-button:hover_&]:text-black transition-colors duration-200" />
                  <span className="sr-only">Settings</span>
                </Button>
              } 
            />
            
            <div className="profile-dropdown">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-transparent hover:bg-white/10 transition-colors duration-200">
                    <Avatar className="h-9 w-9 border border-white">
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
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="hover:text-[#245D66] transition-colors duration-200">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/order-history')} className="hover:text-[#245D66] transition-colors duration-200">
                    <FileCheck className="mr-2 h-4 w-4" />
                    <span>Order History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="hover:text-[#245D66] transition-colors duration-200">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive hover:text-destructive">
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
