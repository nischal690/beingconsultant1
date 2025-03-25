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
  useSidebar
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
  ChevronDown
} from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/lib/firebase/auth-context"
import { useRouter } from "next/navigation"
import { SettingsDialog } from "@/components/settings/settings-dialog"

// Custom component for the sidebar logo that hides text when collapsed
function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
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
    
    // Set up a MutationObserver to detect changes to the cookie
    const cookieObserver = setInterval(checkSidebarState, 500);
    
    return () => {
      clearInterval(cookieObserver);
    };
  }, []);

  if (!isMounted) {
    return null
  }

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen bg-black text-white">
          <DashboardHeader activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />
          
          {/* Dropdown content that pushes content down */}
          <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${activeDropdown ? 'max-h-[600px]' : 'max-h-0'}`}>
            {activeDropdown === 'coaching' && (
              <div className="w-full bg-white shadow-xl border-b border-black/5 animate-in fade-in-5 duration-300 ease-out">
                {/* Subtle top gradient border with 3D effect */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
                
                <div className={`mx-auto flex ${sidebarState === "collapsed" ? "ml-[4.5rem]" : "ml-[16rem]"}`}>
                  <div className="flex-1 flex flex-col lg:flex-row">
                    <div className="flex-1 p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="group/section transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg rounded-lg p-3 hover:bg-gray-50/50">
                          <h3 className="text-xs font-semibold text-black/70 mb-4 group-hover/section:text-black transition-colors duration-300 relative inline-block">
                            CRACK CONSULTING INTERVIEW
                            <span className="absolute bottom-[-4px] left-0 w-0 h-[1.5px] bg-gradient-to-r from-black/40 to-black/80 group-hover/section:w-full transition-all duration-500 ease-in-out"></span>
                          </h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/coaching/break-into-consulting" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">Break into Consulting
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/coaching/unlimited" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">Unlimited Coaching Program
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/coaching/one-on-one" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">1:1 Specific Programs
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/coaching/group" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">Group Coaching Program
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg rounded-lg p-3 hover:bg-gray-50/50">
                          <h3 className="text-xs font-semibold text-black/70 mb-4 group-hover/section:text-black transition-colors duration-300 relative inline-block">
                            EXCEL CONSULTING CAREER
                            <span className="absolute bottom-[-4px] left-0 w-0 h-[1.5px] bg-gradient-to-r from-black/40 to-black/80 group-hover/section:w-full transition-all duration-500 ease-in-out"></span>
                          </h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/coaching/star" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">STAR Consultant Mastery
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/coaching/one-on-one-specific" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">1:1 Specific Programs
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg rounded-lg p-3 hover:bg-gray-50/50">
                          <h3 className="text-xs font-semibold text-black/70 mb-4 group-hover/section:text-black transition-colors duration-300 relative inline-block">
                            CONSULTING TOOLKIT
                            <span className="absolute bottom-[-4px] left-0 w-0 h-[1.5px] bg-gradient-to-r from-black/40 to-black/80 group-hover/section:w-full transition-all duration-500 ease-in-out"></span>
                          </h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/coaching/toolkit" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">Consulting Toolkit
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg rounded-lg p-3 hover:bg-gray-50/50">
                          <h3 className="text-xs font-semibold text-black/70 mb-4 group-hover/section:text-black transition-colors duration-300 relative inline-block">
                            CONSULTING MIGRATION
                            <span className="absolute bottom-[-4px] left-0 w-0 h-[1.5px] bg-gradient-to-r from-black/40 to-black/80 group-hover/section:w-full transition-all duration-500 ease-in-out"></span>
                          </h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/coaching/exit" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">Exit Planning & Readiness
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/coaching/transition" className="text-sm text-black/70 hover:text-black transition-all duration-300 flex items-center group/item hover:translate-x-1">
                              <span className="relative overflow-hidden">Career Transition
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black/40 to-black/80 group-hover/item:w-full transition-all duration-300 ease-out"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[280px] bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden group/image">
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 transform transition-all duration-500 group-hover/image:scale-105 group-hover/image:rotate-1 group-hover/image:translate-y-[-5px]">
                        <img 
                          src="/placeholder.svg?height=180&width=180" 
                          alt="Coaching Resources" 
                          className="rounded-lg object-cover shadow-lg filter saturate-0 transition-all duration-500" 
                          width={180} 
                          height={180}
                        />
                        <div className="absolute inset-0 rounded-lg shadow-inner"></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
                
                {/* Subtle bottom gradient border with 3D effect */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
              </div>
            )}
            {activeDropdown === 'practice' && (
              <div className="w-full bg-white shadow-xl border-b border-gray-200">
                <div className={`mx-auto flex ${sidebarState === "collapsed" ? "ml-[4.5rem]" : "ml-[16rem]"}`}>
                  <div className="flex-1 flex flex-col lg:flex-row">
                    <div className="flex-1 p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="group/section transition-all duration-300">
                          <h3 className="text-xs font-semibold text-gray-500 mb-4 group-hover/section:text-blue-600 transition-colors duration-300">TOOLKITS & PRODUCTS</h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/practice/interview-simulator" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Interview Simulator
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/practice/case-practice" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Case Practice
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/practice/feedback-analysis" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Feedback Analysis
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/practice/more" className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">more →
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300">
                          <h3 className="text-xs font-semibold text-gray-500 mb-4 group-hover/section:text-blue-600 transition-colors duration-300">MASTERCLASSES</h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/practice/ai-coach-bundle" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">AI Coach Bundle
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/practice/consulting-toolkit" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Consulting Toolkit
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/practice/27gk-consultant-mastery" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">27GK Consultant Mastery
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300">
                          <h3 className="text-xs font-semibold text-gray-500 mb-4 group-hover/section:text-blue-600 transition-colors duration-300">ARTICLES & BLOGS</h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/practice/free-resources" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Free resources
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/practice/premium-resources" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Premium resources
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300">
                          <h3 className="text-xs font-semibold text-gray-500 mb-4 group-hover/section:text-blue-600 transition-colors duration-300">STORIES</h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/practice/success-stories" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Success Stories
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/practice/testimonials" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Testimonials
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/practice/transformation-journeys" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Transformation Journeys
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[280px] bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden group/image">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                      <img 
                        src="/placeholder.svg?height=180&width=180" 
                        alt="Practice Resources" 
                        className="rounded-lg object-cover shadow-md z-10 transform group-hover/image:scale-105 transition-transform duration-500" 
                        width={180} 
                        height={180}
                      />
                    </div>
                  </div>
                  <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Practice with our AI coaches</span>
                    <span className="text-sm text-blue-600 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            )}

            {activeDropdown === 'resources' && (
              <div className="w-full bg-white shadow-xl border-b border-gray-200">
                <div className={`mx-auto flex ${sidebarState === "collapsed" ? "ml-[4.5rem]" : "ml-[16rem]"}`}>
                  <div className="flex-1 flex flex-col lg:flex-row">
                    <div className="flex-1 p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="group/section transition-all duration-300">
                          <h3 className="text-xs font-semibold text-gray-500 mb-4 group-hover/section:text-blue-600 transition-colors duration-300">TOOLKITS & PRODUCTS</h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/resources/personality-assessment" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Personality Assessment
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/resources/cheatsheet" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Cheatsheet
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/resources/meditation" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Meditation
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/resources/more" className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">more →
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300">
                          <h3 className="text-xs font-semibold text-gray-500 mb-4 group-hover/section:text-blue-600 transition-colors duration-300">MASTERCLASSES</h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/resources/case-cracking-bundle" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Case Cracking Bundle
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/resources/consulting-cv-masterclass" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Consulting CV Masterclass
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/resources/fit-interview-masterclass" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">FIT Interview Masterclass
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300">
                          <h3 className="text-xs font-semibold text-gray-500 mb-4 group-hover/section:text-blue-600 transition-colors duration-300">ARTICLES & BLOGS</h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/resources/free-resources" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Free resources
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/resources/premium-resources" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Premium resources
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                        <div className="group/section transition-all duration-300">
                          <h3 className="text-xs font-semibold text-gray-500 mb-4 group-hover/section:text-blue-600 transition-colors duration-300">STORIES</h3>
                          <ul className="space-y-3">
                            <li><Link href="/dashboard/resources/success-stories" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Success Stories
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/resources/client-journeys" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Client Journeys
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                            <li><Link href="/dashboard/resources/inspirational-paths" className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center group/item">
                              <span className="relative">Inspirational Paths
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/item:w-full transition-all duration-300"></span>
                              </span>
                            </Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[280px] bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden group/image">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                      <img 
                        src="/placeholder.svg?height=180&width=180" 
                        alt="Resources" 
                        className="rounded-lg object-cover shadow-md z-10 transform group-hover/image:scale-105 transition-transform duration-500" 
                        width={180} 
                        height={180}
                      />
                    </div>
                  </div>
                  <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Explore our resources</span>
                    <span className="text-sm text-blue-600 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                  <SidebarLogo />
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
    <></>
  );
}

function DashboardHeader({ activeDropdown, setActiveDropdown }: { activeDropdown: string | null, setActiveDropdown: (dropdown: string | null) => void }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeDropdownLocal, setActiveDropdownLocal] = useState<string | null>(null);

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
        
        <div className="flex h-16 items-center justify-between px-8 relative">
          {/* Left section with logo only */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              {/* Logo and text removed */}
            </Link>
          </div>
          
          {/* Center navigation with dropdown menus */}
          <nav className="flex items-center space-x-1">
            {/* Coaching Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('coaching')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'coaching' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                <span>Coaching</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Practice Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('practice')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'practice' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                <span>Practice</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('resources')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <div className={`flex items-center gap-1 cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 ${activeDropdown === 'resources' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                <span>Resources</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </nav>
          
          {/* Right section with profile dropdown */}
          <div className="flex items-center gap-4">
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
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
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
