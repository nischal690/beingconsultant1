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
  SidebarHeader,
  SidebarFooter,
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
  Bell,
  BookOpen,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Star,
  User,
  Users,
  Brain,
  Award,
  Briefcase,
  FileCheck,
  Heart,
  BookOpenCheck,
  Sparkles,
  Lightbulb,
  Headphones,
  FileSpreadsheet,
  HelpCircle,
} from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/firebase/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [runTour, setRunTour] = useState(true)
  const { user, logout } = useAuth()

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
      <SidebarProvider>
        <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
          <DashboardSidebar pathname={pathname} />
          <div className="flex flex-1 flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6 main-content animate-fade-in">{children}</main>
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

function DashboardSidebar({ pathname }: { pathname: string }) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <Sidebar className="sidebar-nav shadow-xl border-r border-sidebar-border bg-gradient-to-b from-sidebar-background to-sidebar-background/90 backdrop-blur-md">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image 
            src="/being-consultant-logo.svg" 
            alt="Being Consultant Logo" 
            width={180} 
            height={40} 
            className="h-8 w-auto" 
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"} className="hover-lift">
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/profile"} className="hover-lift">
              <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                <User className="h-5 w-5" />
                <span>Profile</span>
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
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/coaching"} className="hover-lift">
                  <Link href="/dashboard/coaching" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                    <Briefcase className="h-5 w-5" />
                    <span>Land a job</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/coaching/career-excellence"} className="hover-lift">
                  <Link href="/dashboard/coaching/career-excellence" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                    <Award className="h-5 w-5" />
                    <span>Career excellence</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/coaching/career-transition"} className="hover-lift">
                  <Link href="/dashboard/coaching/career-transition" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                    <FileCheck className="h-5 w-5" />
                    <span>Career transition</span>
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
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/ai-coach/case-interview"} className="hover-lift">
                  <Link href="/dashboard/ai-coach/case-interview" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                    <Brain className="h-5 w-5" />
                    <span>Case Interview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/ai-coach/fit-interview"} className="hover-lift">
                  <Link href="/dashboard/ai-coach/fit-interview" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                    <Users className="h-5 w-5" />
                    <span>FIT Interview</span>
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
                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/resources")} className="hover-lift">
                  <Link href="/dashboard/resources" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                    <FileText className="h-5 w-5" />
                    <span>Toolkit</span>
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
                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/learning")} className="hover-lift">
                  <Link href="/dashboard/learning" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                    <BookOpen className="h-5 w-5" />
                    <span>Courses</span>
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
                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/community")} className="hover-lift">
                  <Link href="/dashboard/community" className="flex items-center gap-3 rounded-lg p-3 text-base font-medium">
                    <MessageSquare className="h-5 w-5" />
                    <span>Join</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 hover-lift"
            onClick={() => router.push('/dashboard/profile')}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover-lift"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/70 px-6 backdrop-blur-md">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-4">
        
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-200">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="profile-dropdown rounded-full hover:bg-primary/10 transition-all duration-200">
              <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-all duration-200">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-xl border border-border/40 bg-background/90 backdrop-blur-md">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <span className="text-lg font-medium">{user?.displayName || "User"}</span>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
