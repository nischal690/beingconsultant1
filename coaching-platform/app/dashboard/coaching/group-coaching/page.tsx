"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Sparkles, CheckCheck, Clock, Award, Users, MessageSquare, FileText, Briefcase, CheckSquare, BookOpen, UserCheck, FileCheck, Headphones, Star, GraduationCap, Share2, ArrowRight, UserPlus, Calendar } from "lucide-react"

export default function GroupCoachingPage() {
  return (
    <div className="container mx-auto space-y-10 pb-20">
      {/* Page header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
          Group Coaching Program
        </h1>
        <p className="text-xl text-muted-foreground">
          Join a small group of like-minded candidates to learn and practice together
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
                icon={<Users className="h-8 w-8 text-primary" />}
                title="Small Groups"
                description="Maximum 5 participants per group"
              />
              <HighlightCard 
                icon={<Calendar className="h-8 w-8 text-primary" />}
                title="8 Sessions"
                description="Weekly interactive group sessions"
              />
              <HighlightCard 
                icon={<Briefcase className="h-8 w-8 text-primary" />}
                title="Diverse Cases"
                description="Practice with varied industry focus"
              />
              <HighlightCard 
                icon={<UserPlus className="h-8 w-8 text-primary" />}
                title="Peer Learning"
                description="Benefit from shared experiences"
              />
              <HighlightCard 
                icon={<Clock className="h-8 w-8 text-primary" />}
                title="Flexible Schedule"
                description="Evening and weekend options available"
              />
              <HighlightCard 
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="Study Materials"
                description="Comprehensive resources and frameworks"
              />
              <HighlightCard 
                icon={<MessageSquare className="h-8 w-8 text-primary" />}
                title="Group Feedback"
                description="Learn from others' strengths and mistakes"
              />
              <HighlightCard 
                icon={<Award className="h-8 w-8 text-primary" />}
                title="Cost-Effective"
                description="Premium coaching at affordable price"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Program Agenda */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Group Coaching: Program Agenda</h2>
          <p className="text-muted-foreground mt-2">Collaborative Learning Journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Session 1-2 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Sessions 1-2: Foundations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Introduction to case interview methodology" />
              <AgendaItem text="Core frameworks and problem-solving approaches" />
              <AgendaItem text="Group exercises on structuring problems" />
              <AgendaItem text="Communication best practices in group settings" />
              <AgendaItem text="Peer feedback on initial approaches" />
            </CardContent>
          </Card>

          {/* Session 3-4 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Sessions 3-4: Case Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Market sizing and estimation cases as a group" />
              <AgendaItem text="Profitability and growth strategy cases" />
              <AgendaItem text="Taking turns as interviewer and interviewee" />
              <AgendaItem text="Real-time feedback from peers and coach" />
              <AgendaItem text="Group brainstorming on complex business problems" />
            </CardContent>
          </Card>

          {/* Session 5-6 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Sessions 5-6: Advanced Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Industry-specific case simulations" />
              <AgendaItem text="Group analysis of complex data sets" />
              <AgendaItem text="Collaborative chart and exhibit interpretation" />
              <AgendaItem text="Handling curveball questions as a group" />
              <AgendaItem text="Time-pressured case exercises" />
            </CardContent>
          </Card>

          {/* Session 7-8 */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                Sessions 7-8: Mock Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem text="Full group mock interviews with realistic cases" />
              <AgendaItem text="Fit interview practice with peer feedback" />
              <AgendaItem text="Final preparation strategies and tips" />
              <AgendaItem text="Group reflection on learning journey" />
              <AgendaItem text="Post-program support planning" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits of Group Learning */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Benefits of Group Learning</h2>
          <p className="text-muted-foreground mt-2">Why collaborative coaching works</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Diverse Perspectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Learn from the different approaches, backgrounds, and thinking styles of your peers. 
                Exposure to multiple problem-solving methods enhances your own toolkit and adaptability.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Enhanced Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receive feedback not just from your coach but from multiple perspectives. 
                Observe others' interviews to identify common mistakes without making them yourself.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Motivation & Accountability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stay motivated through shared goals and group accountability. 
                The supportive environment creates positive pressure to prepare thoroughly for each session.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Your Coach */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">About Your Coach</h2>
          <p className="text-muted-foreground mt-2">Expert Group Facilitator</p>
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
                  <p className="mt-2 text-sm">Former BCG consultant with 6+ years of experience</p>
                  <p className="mt-1 text-sm">Specialized in group facilitation and collaborative problem-solving</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-r from-background to-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Coach
                  </h4>
                  <p className="mt-2 text-sm">Pioneered group coaching methodology for case interviews</p>
                  <p className="mt-1 text-sm">Led 50+ successful group coaching cohorts</p>
                  <p className="mt-1 text-sm">Certified in team dynamics and collaborative learning</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-r from-background to-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Community Builder
                  </h4>
                  <p className="mt-2 text-sm">Created a network of 1000+ consulting aspirants</p>
                  <p className="mt-1 text-sm">Facilitates ongoing peer support groups</p>
                  <p className="mt-1 text-sm">Maintains alumni community for continued networking</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Star className="h-4 w-4 text-primary" />
                <span className="font-medium">300+ Reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">400+ Group Participants</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Share2 className="h-4 w-4 text-primary" />
                <span className="font-medium">20+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/80 to-green-600/80 text-white">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Join Our Next Group Cohort</h2>
              <p className="text-lg max-w-2xl mx-auto">
                Limited to 5 participants per group. Our next cohort starts soon - secure your spot today!
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Reserve Your Spot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  View Upcoming Dates
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
