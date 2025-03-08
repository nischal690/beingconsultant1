"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Calendar, Clock, FileText, MessageSquare, Star, TrendingUp, Users, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DashboardPage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  // Check if this is the first visit to show the welcome modal
  useEffect(() => {
    // In a real app, you would check if this is the first login
    // For demo purposes, we'll just show it every time
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")

    if (!hasSeenWelcome) {
      setShowWelcomeModal(true)
      // In a real app, you would set this after onboarding
      // localStorage.setItem("hasSeenWelcome", "true");
    }
  }, [])

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false)
    localStorage.setItem("hasSeenWelcome", "true")
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back, John!</h2>
            <p className="text-muted-foreground">Here's what's happening with your consulting journey today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Book a Session
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resources Accessed</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+8 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Progress Overview</CardTitle>
                  <CardDescription>Your consulting skills development over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                    <BarChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Progress Chart</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recommended Resources</CardTitle>
                  <CardDescription>Based on your recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Case Interview Cheatsheet</p>
                        <p className="text-xs text-muted-foreground">Essential frameworks and tips</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Group Coaching Session</p>
                        <p className="text-xs text-muted-foreground">Next session: Tomorrow, 3:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">1:1 Coaching Availability</p>
                        <p className="text-xs text-muted-foreground">Book your next personalized session</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled coaching and training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Case Interview Practice</p>
                      <p className="text-xs text-muted-foreground">Group Session • 8 participants</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">CV Review Session</p>
                      <p className="text-xs text-muted-foreground">1:1 Coaching • 45 minutes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Friday, 10:00 AM</div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Consulting Industry Insights</p>
                      <p className="text-xs text-muted-foreground">Webinar • 120 participants</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Next Monday, 6:00 PM</div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recently Accessed Resources</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Case Interview Frameworks</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <p>PDF • 24 pages • Last accessed 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Continue
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Networking Strategies</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <p>Video • 45 minutes • Last accessed 5 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Continue
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Personality Assessment</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <p>Interactive • 30 minutes • Last accessed 1 week ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Continue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Welcome Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Welcome to ConsultCoach!</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 absolute right-4 top-4"
                onClick={closeWelcomeModal}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <DialogDescription className="text-lg pt-2">
              Your journey to breaking into consulting starts now
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Personalized Coaching</h3>
                <p className="text-sm text-muted-foreground">Get 1:1 guidance from industry experts</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Exclusive Resources</h3>
                <p className="text-sm text-muted-foreground">Access case frameworks, templates, and guides</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Community Support</h3>
                <p className="text-sm text-muted-foreground">Connect with peers on the same journey</p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button variant="outline" onClick={closeWelcomeModal}>
              Explore Later
            </Button>
            <Button onClick={closeWelcomeModal}>Start My Journey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

