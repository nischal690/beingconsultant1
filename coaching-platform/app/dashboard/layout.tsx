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
              <stop stopColor="#245D66"/>
              <stop offset="1" stopColor="#245D66"/>
            </linearGradient>
            <linearGradient id="paint1_linear_12_122" x1="72.3939" y1="0.317322" x2="72.3939" y2="136.802" gradientUnits="userSpaceOnUse">
              <stop stopColor="#245D66"/>
              <stop offset="1" stopColor="#245D66"/>
            </linearGradient>
          </defs>
        </svg>
        {!isCollapsed && (
          <div className="flex flex-col font-medium text-white uppercase tracking-wide text-xs leading-tight ml-2">
            <span>BEING</span>
            <span>CONSULTANT</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
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
                          isActive={pathname === "/dashboard/ai-coach/case-interview"} 
                          className="hover-lift"
                          tooltip="Mock Case Interview"
                        >
                          <a href="https://app.consultify-ai.com/" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Brain className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Mock Case Interview</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname === "/dashboard/ai-coach/cv-evaluator"} 
                          className="hover-lift"
                          tooltip="CV Evaluator"
                        >
                          <a href="https://app.consultify-ai.com/" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <FileCheck className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">CV Evaluator</span>
                          </a>
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
                          isActive={pathname.startsWith("/dashboard/resources/free")} 
                          className="hover-lift"
                          tooltip="Free"
                        >
                          <Link href="/dashboard/resources/free" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Unlock className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Free</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.startsWith("/dashboard/resources/premium")} 
                          className="hover-lift"
                          tooltip="Premium"
                        >
                          <Link href="/dashboard/resources/premium" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Lock className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Premium</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Community
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="community-section space-y-1">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.startsWith("/dashboard/community/events")} 
                          className="hover-lift"
                          tooltip="Events"
                        >
                          <Link href="/dashboard/community/events" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <CalendarDays className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Events</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          isActive={pathname.startsWith("/dashboard/community/stories")} 
                          className="hover-lift"
                          tooltip="Stories"
                        >
                          <Link href="/dashboard/community/stories" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                            <Sparkles className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">Stories</span>
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
                        <Settings className="h-4 w-4 text-white" />
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
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

function DashboardHeader({ activeDropdown, setActiveDropdown, sidebarState }: { activeDropdown: string | null, setActiveDropdown: (dropdown: string | null) => void, sidebarState: "expanded" | "collapsed" }) {
  const { user, logout } = useAuth()
  const router = useRouter()
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
          
          {/* Center navigation with dropdown menus - adjusted to be truly centered and responsive to sidebar state */}
          <nav className={`flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${sidebarState === "collapsed" ? "ml-[1rem]" : "ml-[3.5rem]"}`}>
            {/* Coaching Dropdown */}
            <div className="relative group"
                 onMouseEnter={() => setActiveDropdown('coaching')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <button onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'coaching' ? null : 'coaching');
              }} className="focus:outline-none">
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'coaching' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  <span>Coaching</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
              {activeDropdown === 'coaching' && (
                <div className="fixed top-[64px] left-1/2 -translate-x-1/2 mt-1 w-[900px] rounded-md bg-white border border-gray-100 shadow-lg shadow-black/10 overflow-hidden z-[150]"
                     onMouseEnter={() => setActiveDropdown('coaching')}
                     onMouseLeave={() => setActiveDropdown(null)}>
                  <div className="p-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4">
                          {/* First column */}
                          <div>
                            <h3 className="text-sm font-bold !text-[#245D66] mb-3 flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-primary" />
                              Crack Consulting Interview
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">Everything you need to break into top consulting firms.</p>
                            <div className="space-y-2">
                              <Link href="/dashboard/coaching/break-into-consulting" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <ArrowUpRight className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Break into Consulting
                              </Link>
                              <Link href="/dashboard/coaching/unlimited-program" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <Infinity className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Unlimited Coaching Program
                              </Link>
                              <Link href="/dashboard/coaching/one-on-one-programs" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <CircleUser className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                1:1 Specific Programs
                              </Link>
                              <Link href="/dashboard/coaching/group-programs" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <Users className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Group Coaching Program
                              </Link>
                            </div>
                          </div>
                          
                          {/* Second column */}
                          <div>
                            <h3 className="text-sm font-bold !text-[#245D66] mb-3 flex items-center">
                              <Award className="h-4 w-4 mr-2 text-primary" />
                              Excel Consulting Career
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">Take your consulting career to the next level.</p>
                            <div className="space-y-2">
                              <Link href="/dashboard/coaching/star-consultant-mastery" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <Star className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                STAR Consultant Mastery
                              </Link>
                              <Link href="/dashboard/coaching/one-on-one-career" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <CircleUser className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                1:1 Specific Programs
                              </Link>
                              <Link href="/dashboard/coaching/consulting-toolkit" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <Briefcase className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Consulting Toolkit
                              </Link>
                            </div>
                          </div>
                          
                          {/* Third column */}
                          <div>
                            <h3 className="text-sm font-bold !text-[#245D66] mb-3 flex items-center">
                              <ArrowRightLeft className="h-4 w-4 mr-2 text-primary" />
                              Consulting Migration
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">Plan your next career move after consulting.</p>
                            <div className="space-y-2">
                              <Link href="/dashboard/coaching/exit-planning" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <LogOut className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Exit Planning & Readiness
                              </Link>
                              <Link href="/dashboard/coaching/career-transition" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <MoveRight className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Career Transition
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Promotional Banner - Now Vertical */}
                      <div className="w-[200px] border-l border-gray-200 pl-4">
                        <Link href="/dashboard/coaching" className="block group h-full">
                          <div className="relative overflow-hidden rounded-md h-full">
                            <div className="aspect-[2/3] relative h-full">
                              <Image 
                                src="https://framerusercontent.com/images/AjRKyR2dPa4q3GuHOle8Vz37jl0.png" 
                                alt="Premium Coaching" 
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                                <div>
                                  <h3 className="text-base font-semibold text-white mb-1">Get premium 1-1 Coaching</h3>
                                  <div className="flex items-center">
                                    <span className="text-sm text-white/90 font-medium">Buy</span>
                                    <ArrowRight className="h-4 w-4 ml-2 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Practice Dropdown - Updated to "Practice with AI Coach" with FREE TRIAL badge */}
            <div className="relative">
              <Link href="https://app.consultify-ai.com/">
                <div className="flex items-center gap-2 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 text-white/80 hover:text-white group">
                  <Bot className="h-4 w-4 text-[#7BA7AE]" />
                  <span>Practice with AI Coach</span>
                </div>
              </Link>
            </div>

            {/* Resources Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('resources')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/dashboard/resources" onClick={(e) => {
                if (activeDropdown === 'resources') {
                  e.preventDefault();
                }
              }}>
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'resources' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  <span>Resources</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Link>
              {activeDropdown === 'resources' && (
                <div className="fixed top-[64px] left-1/2 -translate-x-1/2 mt-1 w-[900px] rounded-md bg-white border border-gray-100 shadow-lg shadow-black/10 overflow-hidden z-[150]"
                     onMouseEnter={() => setActiveDropdown('resources')}
                     onMouseLeave={() => setActiveDropdown(null)}>
                  <div className="p-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                          {/* First column */}
                          <div>
                            <h3 className="text-sm font-bold !text-[#245D66] mb-3 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              Toolkits & Products
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">Essential tools to help you prepare for consulting interviews.</p>
                            <div className="space-y-2">
                              <Link href="/dashboard/resources/personality" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <User className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Personality Assessment
                              </Link>
                              <Link href="/dashboard/resources/cheatsheet" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <FileCheck className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Cheatsheet
                              </Link>
                              <Link href="/dashboard/resources/meditation" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <Smile className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Meditation
                              </Link>
                              <Link href="/dashboard/resources/workshop" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <Users className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Workshop
                              </Link>
                              <Link href="/dashboard/resources/ebooks" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <BookOpen className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                E-books
                              </Link>
                              <Link href="/dashboard/resources/cv-guide" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <FileText className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                CV Guide
                              </Link>
                            </div>
                          </div>
                          
                          {/* Second column */}
                          <div>
                            <h3 className="text-sm font-bold !text-[#245D66] mb-3 flex items-center">
                              <Unlock className="h-4 w-4 mr-2 text-primary" />
                              FREE
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">Free content to help you on your consulting journey.</p>
                            <div className="space-y-2">
                              <Link href="/dashboard/resources/blogs" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <BookOpen className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Blogs & articles
                              </Link>
                              <Link href="/dashboard/resources/social" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <MessageSquare className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Social feeds
                              </Link>
                              <Link href="/dashboard/resources/community" className="block px-3 py-2 text-xs font-bold text-black hover:text-white hover:bg-black/90 rounded-sm transition-colors duration-200 flex items-center">
                                <Users className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                Community feeds
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Promotional Banner - Now Vertical */}
                      <div className="w-[200px] border-l border-gray-200 pl-4">
                        <Link href="/dashboard/resources" className="block group h-full">
                          <div className="relative overflow-hidden rounded-md h-full">
                            <div className="aspect-[2/3] relative h-full">
                              <Image 
                                src="https://framerusercontent.com/images/UDGnefgJnsYAmnMMkYUWp0rFFm4.png?scale-down-to=512" 
                                alt="Premium Resources" 
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                                <div>
                                  <h3 className="text-base font-semibold text-white mb-1">Get premium resources</h3>
                                  <div className="flex items-center">
                                    <span className="text-sm text-white/90 font-medium">Buy</span>
                                    <ArrowRight className="h-4 w-4 ml-2 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Community Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('community')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <Link href="/dashboard/community">
                <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'community' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  <span>Community</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Link>
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
            <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white hover:bg-white/10 hover:border-white transition-colors duration-200">
              <Bell className="h-4 w-4 text-white" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <SettingsDialog 
              trigger={
                <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white hover:bg-white/10 hover:border-white transition-colors duration-200">
                  <Settings className="h-4 w-4 text-white" />
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
