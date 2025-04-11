"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Sparkles, CheckCheck, Clock, Award, Users, MessageSquare, FileText, Briefcase, CheckSquare, BookOpen, UserCheck, FileCheck, Headphones, Star, GraduationCap, Share2, ArrowRight } from "lucide-react"

export default function BreakIntoConsultingPage() {
  return (
    <div className="container mx-auto space-y-10 pb-20">
      {/* Page header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Break into Consulting
        </h1>
        <p className="text-xl text-muted-foreground">
          Master the art of case interviews with our comprehensive program
        </p>
      </header>

      {/* Program highlights */}
      <section className="mt-10">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-background via-background to-accent/10 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold">Program Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HighlightCard 
                icon={<CheckCheck className="h-8 w-8 text-primary" />}
                title="6 Modules"
                description="Comprehensive case interview preparation"
              />
              <HighlightCard 
                icon={<Briefcase className="h-8 w-8 text-primary" />}
                title="Top Firms"
                description="Tailored for MBB and Tier 2 consulting firms"
              />
              <HighlightCard 
                icon={<Users className="h-8 w-8 text-primary" />}
                title="1:1 Coaching"
                description="Personalized sessions with ex-MBB consultants"
              />
              <HighlightCard 
                icon={<Sparkles className="h-8 w-8 text-primary" />}
                title="Proven Results"
                description="90%+ success rate with committed students"
              />
              <HighlightCard 
                icon={<Clock className="h-8 w-8 text-primary" />}
                title="Flexible Schedule"
                description="Sessions scheduled at your convenience"
              />
              <HighlightCard 
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="Case Library"
                description="Access to 50+ real case frameworks"
              />
              <HighlightCard 
                icon={<MessageSquare className="h-8 w-8 text-primary" />}
                title="Interview Prep"
                description="Both case and fit interview preparation"
              />
              <HighlightCard 
                icon={<Award className="h-8 w-8 text-primary" />}
                title="Certification"
                description="Completion certificate upon finishing"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Program Agenda */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Break into Consulting: Program Agenda</h2>
          <p className="text-muted-foreground mt-2">Structured Framework to Master Case Interviews</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Module 1 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Module 1: Foundations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Introduction to consulting case interviews" />
              <AgendaItem text="Understanding the interviewer's perspective" />
              <AgendaItem text="Core frameworks and methodologies" />
              <AgendaItem text="Structuring your approach" />
              <AgendaItem text="Communication best practices" />
            </CardContent>
          </Card>

          {/* Module 2 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Module 2: Case Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Market sizing and estimation cases" />
              <AgendaItem text="Profitability and business situation cases" />
              <AgendaItem text="Market entry and growth strategy" />
              <AgendaItem text="M&A and valuation cases" />
              <AgendaItem text="Operations and process improvement" />
            </CardContent>
          </Card>

          {/* Module 3 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Module 3: Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Guided case practice with feedback" />
              <AgendaItem text="Industry-specific case simulations" />
              <AgendaItem text="Data interpretation and analysis" />
              <AgendaItem text="Quantitative problem solving" />
              <AgendaItem text="Chart and exhibit analysis" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Module 4 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                Module 4: Fit Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Personal story crafting" />
              <AgendaItem text="Leadership and teamwork examples" />
              <AgendaItem text="Handling behavioral questions" />
              <AgendaItem text="Demonstrating consulting traits" />
              <AgendaItem text="Asking intelligent questions" />
            </CardContent>
          </Card>

          {/* Module 5 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Module 5: Mock Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Full-length mock interviews" />
              <AgendaItem text="Realistic case simulations" />
              <AgendaItem text="Detailed feedback and coaching" />
              <AgendaItem text="Performance improvement tracking" />
              <AgendaItem text="Stress test scenarios" />
            </CardContent>
          </Card>

          {/* Module 6 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Module 6: Final Preparation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Firm-specific preparation" />
              <AgendaItem text="Last-minute tips and strategies" />
              <AgendaItem text="Common pitfalls to avoid" />
              <AgendaItem text="Interview day preparation" />
              <AgendaItem text="Post-interview follow-up" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Your Coach */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">About Your Coach</h2>
          <p className="text-muted-foreground mt-2">Learn from a Triple-Perspective Expert</p>
        </div>
        
        <div className="bg-gradient-to-br from-background to-primary/5 rounded-2xl p-8 shadow-lg">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md bg-gradient-to-r from-background to-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Consultant
                  </h4>
                  <p className="mt-2 text-sm">Ex-McKinsey consultant with experience across multiple industries</p>
                  <p className="mt-1 text-sm">Worked on 30+ strategy and operations projects globally</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-r from-background to-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Coach
                  </h4>
                  <p className="mt-2 text-sm">Helped 500+ candidates secure offers at top consulting firms</p>
                  <p className="mt-1 text-sm">Developed proprietary frameworks for case interview success</p>
                  <p className="mt-1 text-sm">Certified career coach with expertise in consulting recruitment</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-r from-background to-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Recruiter
                  </h4>
                  <p className="mt-2 text-sm">Former recruiting team member at a top consulting firm</p>
                  <p className="mt-1 text-sm">Conducted 200+ first-round and final-round interviews</p>
                  <p className="mt-1 text-sm">Insider knowledge of what firms really look for in candidates</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Star className="h-4 w-4 text-primary" />
                <span className="font-medium">500+ Reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">700+ Students Placed</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Share2 className="h-4 w-4 text-primary" />
                <span className="font-medium">30+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/80 to-blue-600/80 text-white">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Break into Consulting?</h2>
              <p className="text-lg max-w-2xl mx-auto">
                Join our comprehensive program and get personalized coaching to master case interviews and secure your dream consulting role.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Enroll Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Schedule a Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

// Helper component for the highlight cards
function HighlightCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      className="p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-2 rounded-full bg-primary/10">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  )
}

// Helper component for agenda items
function AgendaItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-sm">{text}</p>
    </div>
  )
}
