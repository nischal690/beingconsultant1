"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Calendar, Clock, FileText, MessageSquare, Star, TrendingUp, Users, X, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const DashboardPage = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)

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

    return () => {
      clearTimeout(timer)
      clearInterval(staggerInterval)
    }
  }, [])

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false)
  }

  return (
    <>
      <div className={`space-y-6 opacity-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : ''}`}>
        <div className={`relative transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Decorative background elements */}
          <div className="absolute -top-4 -left-6 w-72 h-72 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-10 right-20 w-36 h-36 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-3xl -z-10"></div>
          
          {/* Modern welcome header */}
          <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-900/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden">
            {/* Decorative accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-brand-300 to-secondary"></div>
            
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(36,93,102,0.4)]"></div>
                  <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-brand-300 bg-clip-text text-transparent">Welcome back, John!</h2>
                </div>
                <p className="text-muted-foreground text-base max-w-md">Here's what's happening with your consulting journey today. Your next session is in <span className="font-medium text-primary">2 days</span>.</p>
                
                {/* Quick stats summary */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Upcoming</p>
                      <p className="text-sm font-semibold">3 Sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Weekly Goal</p>
                      <p className="text-sm font-semibold">68% Complete</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button className="relative overflow-hidden group font-medium">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-light/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Calendar className="mr-2 h-4 w-4 relative z-10" />
                  <span className="relative z-10">Book a Session</span>
                </Button>
                <Button variant="outline" className="font-medium group hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                  <Users className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <span>Join Group Session</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border/40">
            <TabsList className="border-none bg-transparent h-10 p-0 relative">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border/40"></div>
              <TabsTrigger 
                value="overview" 
                className="relative h-10 px-4 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary group transition-all duration-300"
              >
                <span>Overview</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="relative h-10 px-4 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary group transition-all duration-300"
              >
                <span>Upcoming Sessions</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="relative h-10 px-4 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary group transition-all duration-300"
              >
                <span>Resources</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300"></span>
              </TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="h-8 gap-1 group border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                <Download className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span>Export</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
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
              <Card className={`overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(36,93,102,0.15)] dark:hover:shadow-[0_8px_30px_rgba(36,93,102,0.2)] transition-all duration-300 group transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none opacity-0 ${animationStage >= 1 ? 'animate-fadeIn opacity-100' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/80"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <div className="absolute top-1 right-1 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10"></div>
                  <CardTitle className="text-sm font-medium flex flex-col">
                    <span className="text-muted-foreground text-xs">Total Sessions</span>
                    <span className="text-xl mt-1">12</span>
                  </CardTitle>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300">
                    <Clock className="h-5 w-5 text-primary group-hover:text-primary-light transition-colors duration-300 group-hover:scale-110 transform" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 relative">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-muted-foreground">Previous month</p>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        +2
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/30 rounded-full" style={{ width: '83%' }}></div>
                    </div>
                    <div className="absolute -right-3 -bottom-3 h-16 w-16 bg-primary/5 rounded-full blur-xl -z-10"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className={`overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(36,93,102,0.15)] dark:hover:shadow-[0_8px_30px_rgba(36,93,102,0.2)] transition-all duration-300 group transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none opacity-0 ${animationStage >= 2 ? 'animate-fadeIn opacity-100' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/80"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <div className="absolute top-1 right-1 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10"></div>
                  <CardTitle className="text-sm font-medium flex flex-col">
                    <span className="text-muted-foreground text-xs">Progress</span>
                    <span className="text-xl mt-1">68%</span>
                  </CardTitle>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300">
                    <TrendingUp className="h-5 w-5 text-primary group-hover:text-primary-light transition-colors duration-300 group-hover:scale-110 transform" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 relative">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-muted-foreground">Goal completion</p>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        +5%
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full w-[68%] animate-progressBar"></div>
                    </div>
                    <div className="absolute -right-3 -bottom-3 h-16 w-16 bg-primary/5 rounded-full blur-xl -z-10"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className={`overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(36,93,102,0.15)] dark:hover:shadow-[0_8px_30px_rgba(36,93,102,0.2)] transition-all duration-300 group transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none opacity-0 ${animationStage >= 3 ? 'animate-fadeIn opacity-100' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/80"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <div className="absolute top-1 right-1 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10"></div>
                  <CardTitle className="text-sm font-medium flex flex-col">
                    <span className="text-muted-foreground text-xs">Resources Accessed</span>
                    <span className="text-xl mt-1">24</span>
                  </CardTitle>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300">
                    <FileText className="h-5 w-5 text-primary group-hover:text-primary-light transition-colors duration-300 group-hover:scale-110 transform" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 relative">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-muted-foreground">Resource utilization</p>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        +8
                      </div>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <FileText className="h-3 w-3 text-white" />
                      </div>
                      <div className="h-6 w-6 rounded-full bg-primary/80 flex items-center justify-center">
                        <Users className="h-3 w-3 text-white" />
                      </div>
                      <div className="h-6 w-6 rounded-full bg-primary/60 flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                      <div className="h-6 w-6 rounded-full flex items-center justify-center border border-dashed border-primary/40 text-primary text-xs font-medium">
                        +21
                      </div>
                    </div>
                    <div className="absolute -right-3 -bottom-3 h-16 w-16 bg-primary/5 rounded-full blur-xl -z-10"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className={`overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(36,93,102,0.15)] dark:hover:shadow-[0_8px_30px_rgba(36,93,102,0.2)] transition-all duration-300 group transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none opacity-0 ${animationStage >= 4 ? 'animate-fadeIn opacity-100' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/80"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <div className="absolute top-1 right-1 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10"></div>
                  <CardTitle className="text-sm font-medium flex flex-col">
                    <span className="text-muted-foreground text-xs">Achievements</span>
                    <span className="text-xl mt-1">3</span>
                  </CardTitle>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300">
                    <Star className="h-5 w-5 text-primary group-hover:text-primary-light transition-colors duration-300 group-hover:scale-110 transform group-hover:rotate-12" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 relative">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-muted-foreground">Achievement progress</p>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        +1
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1 mt-1">
                      <div className="h-2 rounded-full bg-primary"></div>
                      <div className="h-2 rounded-full bg-primary"></div>
                      <div className="h-2 rounded-full bg-primary"></div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">3 of 5 completed</p>
                    <div className="absolute -right-3 -bottom-3 h-16 w-16 bg-primary/5 rounded-full blur-xl -z-10"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className={`col-span-4 overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(36,93,102,0.15)] dark:hover:shadow-[0_8px_30px_rgba(36,93,102,0.2)] opacity-0 ${animationStage >= 5 ? 'animate-slideInUp opacity-100' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/80"></div>
                <CardHeader className="relative z-10">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Progress Overview</CardTitle>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm text-muted-foreground">Sessions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        <span className="text-sm text-muted-foreground">Goals</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="h-[300px] w-full relative">
                    {/* Chart container */}
                    <div className="absolute inset-0 rounded-md p-4">
                      {/* Chart placeholder with animated gradient */}
                      <div className="h-full w-full rounded-lg relative overflow-hidden">
                        {/* Animated pulse background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 animate-pulse"></div>
                        
                        {/* Chart grid lines */}
                        <div className="absolute inset-0 grid grid-cols-6 gap-2">
                          {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-full border-r border-primary/10 last:border-r-0"></div>
                          ))}
                        </div>
                        <div className="absolute inset-0 grid grid-rows-5 gap-2">
                          {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="w-full border-t border-primary/10 last:border-t-0"></div>
                          ))}
                        </div>
                        
                        {/* Chart lines */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                          {/* Sessions line */}
                          <path
                            d="M0,150 C40,120 80,160 120,100 C160,40 200,80 240,60 C280,40 320,50 360,30 L360,200 L0,200 Z"
                            fill="url(#gradient1)"
                            className="opacity-20"
                          ></path>
                          <path
                            d="M0,150 C40,120 80,160 120,100 C160,40 200,80 240,60 C280,40 320,50 360,30"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="2"
                            className="opacity-80"
                          ></path>
                          
                          {/* Goals line */}
                          <path
                            d="M0,170 C40,160 80,130 120,140 C160,150 200,110 240,100 C280,90 320,70 360,60"
                            fill="none"
                            stroke="var(--secondary)"
                            strokeWidth="2"
                            className="opacity-80"
                          ></path>
                          
                          {/* Gradient definitions */}
                          <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.7" />
                              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Interactive data points */}
                        <div className="absolute top-[75px] left-[30%] h-4 w-4 rounded-full bg-white border-2 border-primary shadow-md transform hover:scale-150 transition-transform duration-200 cursor-pointer group">
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-white dark:bg-gray-800 text-sm rounded shadow px-2 py-1 text-primary font-medium">
                              Week 3: +18%
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-[60px] left-[60%] h-4 w-4 rounded-full bg-white border-2 border-primary shadow-md transform hover:scale-150 transition-transform duration-200 cursor-pointer group">
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-white dark:bg-gray-800 text-sm rounded shadow px-2 py-1 text-primary font-medium">
                              Week 6: +32%
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-[30px] left-[90%] h-4 w-4 rounded-full bg-white border-2 border-primary shadow-md transform hover:scale-150 transition-transform duration-200 cursor-pointer group">
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-white dark:bg-gray-800 text-sm rounded shadow px-2 py-1 text-primary font-medium">
                              Week 9: +48%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 text-xs text-muted-foreground">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Apr</div>
                    <div>May</div>
                    <div>Jun</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-muted/20 pt-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-2xl font-bold text-primary">68%</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 gap-1 group border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                    <Download className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                    <span>Export</span>
                  </Button>
                </CardFooter>
              </Card>
              <Card className={`col-span-3 overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(36,93,102,0.15)] dark:hover:shadow-[0_8px_30px_rgba(36,93,102,0.2)] transition-all duration-300 opacity-0 ${animationStage >= 5 ? 'animate-slideInRight opacity-100' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/80"></div>
                <CardHeader className="relative">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Resources</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-primary-dark hover:bg-primary/5">
                      View all
                      <span className="sr-only">View all resources</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="group relative p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300 flex items-start space-x-4 cursor-pointer overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 shadow-sm group-hover:scale-110 transition-transform">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors duration-300 flex items-center">
                          <span className="truncate">Consulting Framework Guide</span>
                          <span className="ml-2 inline-flex items-center rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">New</span>
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">Complete guide to the REACH consulting methodology</p>
                        <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3.5 w-3.5" /> Updated 2 days ago
                          </span>
                          <span className="mx-2">•</span>
                          <span>12 min read</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group relative p-4 rounded-xl bg-white/50 hover:bg-primary/5 transition-colors duration-300 flex items-start space-x-4 cursor-pointer">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 shadow-sm">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors duration-300">Client Communication Templates</h4>
                        <p className="text-sm text-muted-foreground truncate">Templates for effective client interaction and management</p>
                        <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3.5 w-3.5" /> Updated 1 week ago
                          </span>
                          <span className="mx-2">•</span>
                          <span>15 min read</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group relative p-4 rounded-xl bg-white/50 hover:bg-primary/5 transition-colors duration-300 flex items-start space-x-4 cursor-pointer">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 shadow-sm">
                        <BarChart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="relative flex-1 overflow-hidden">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors duration-300">Business Analysis Tools</h4>
                        <p className="text-sm text-muted-foreground truncate">Advanced tools for analyzing business performance</p>
                        <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
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
                  <Button variant="outline" className="w-full group hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                    <FileText className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
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
            <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(36,93,102,0.15)] dark:hover:shadow-[0_8px_30px_rgba(36,93,102,0.2)] transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp">
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled coaching and training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4 hover:bg-primary/5 p-2 rounded-lg transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Case Interview Practice</p>
                      <p className="text-xs text-muted-foreground">Group Session • 8 participants</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</div>
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-300">
                        Join
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4 hover:bg-primary/5 p-2 rounded-lg transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">CV Review Session</p>
                      <p className="text-xs text-muted-foreground">1:1 Coaching • 45 minutes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Friday, 10:00 AM</div>
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-300">
                        Join
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between hover:bg-primary/5 p-2 rounded-lg transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Consulting Industry Insights</p>
                      <p className="text-xs text-muted-foreground">Webinar • 120 participants</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Next Monday, 6:00 PM</div>
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-300">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent 
            value="resources" 
            className="space-y-4 pt-1 data-[state=active]:animate-fadeIn"
          >
            <Card className="overflow-hidden border-none bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(36,93,102,0.15)] dark:hover:shadow-[0_8px_30px_rgba(36,93,102,0.2)] transition-all duration-300 transform hover:-translate-y-1 animate-slideInUp">
              <CardHeader>
                <CardTitle>Recently Accessed Resources</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-primary/5 transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 shadow-sm">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Case Interview Frameworks</p>
                      <p className="text-xs text-muted-foreground">Essential frameworks and tips</p>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-300">
                      Continue
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-primary/5 transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 shadow-sm">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Networking Strategies</p>
                      <p className="text-xs text-muted-foreground">Video • 45 minutes • Last accessed 5 days ago</p>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-300">
                      Continue
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-primary/5 transition-colors duration-200 hover:translate-x-1 transform">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 shadow-sm">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Personality Assessment</p>
                      <p className="text-xs text-muted-foreground">Interactive • 30 minutes • Last accessed 1 week ago</p>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors duration-300">
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
        <DialogContent className="sm:max-w-[425px] border-none backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl overflow-hidden animate-slideInUp">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-brand-300 to-secondary"></div>
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl text-center pb-2 font-bold tracking-tight bg-gradient-to-r from-primary to-brand-300 bg-clip-text text-transparent">Welcome to Your Dashboard</DialogTitle>
            <DialogDescription className="text-center">
              Track your consulting journey progress and access resources to enhance your skills.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-primary/5 hover:bg-primary/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Track your progress</p>
                <p className="text-xs text-muted-foreground">
                  Monitor your consulting skill development over time.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-secondary/5 hover:bg-secondary/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Schedule sessions</p>
                <p className="text-xs text-muted-foreground">
                  Book one-on-one or group coaching sessions.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-lg p-3 transition-colors bg-primary/5 hover:bg-primary/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Access resources</p>
                <p className="text-xs text-muted-foreground">
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
              <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-light/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Get Started</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DashboardPage
