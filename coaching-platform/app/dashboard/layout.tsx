"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <DashboardSidebar pathname={pathname} />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

function DashboardSidebar({ pathname }: { pathname: string }) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link href="/dashboard" className="flex items-center gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">CC</span>
          </div>
          <span className="text-lg font-bold">ConsultCoach</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link href="/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup>
          <SidebarGroupLabel>Coaching</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/coaching/land-consulting"}>
                  <Link href="/dashboard/coaching/land-consulting">
                    <Briefcase />
                    <span>Land Consulting Offer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/coaching/unlimited"}>
                  <Link href="/dashboard/coaching/unlimited">
                    <Sparkles />
                    <span>Unlimited Coaching</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/coaching/group"}>
                  <Link href="/dashboard/coaching/group">
                    <Users />
                    <span>Group Coaching</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/coaching/one-on-one"}>
                  <Link href="/dashboard/coaching/one-on-one">
                    <MessageSquare />
                    <span>1:1 Coaching</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/coaching/star-consultant"}>
                  <Link href="/dashboard/coaching/star-consultant">
                    <Star />
                    <span>Be a Star Consultant</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Coach</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/ai-coach"}>
                  <Link href="/dashboard/ai-coach">
                    <Brain />
                    <span>Try Free Demo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/resources/personality-assessment"}>
                  <Link href="/dashboard/resources/personality-assessment">
                    <User />
                    <span>Personality Assessment</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/resources/cheatsheet"}>
                  <Link href="/dashboard/resources/cheatsheet">
                    <FileText />
                    <span>Cheatsheet</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/resources/meditation"}>
                  <Link href="/dashboard/resources/meditation">
                    <Heart />
                    <span>Meditation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/resources/cv-cl-guide"}>
                  <Link href="/dashboard/resources/cv-cl-guide">
                    <FileCheck />
                    <span>CV & CL Guide</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/resources/business-essentials"}>
                  <Link href="/dashboard/resources/business-essentials">
                    <BookOpen />
                    <span>Business Essentials Handbook</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <BookOpenCheck />
                      <span>Masterclasses</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/resources/masterclasses/case-cracking">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        <span>Case Cracking</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/resources/masterclasses/consulting-cv">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <span>Consulting CV</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/resources/masterclasses/fit-interview">
                        <Headphones className="mr-2 h-4 w-4" />
                        <span>Fit Interview</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Success Stories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/success-stories"}>
                  <Link href="/dashboard/success-stories">
                    <Award />
                    <span>Success Stories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">john.doe@example.com</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function DashboardHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}

