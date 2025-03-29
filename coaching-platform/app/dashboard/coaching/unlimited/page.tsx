"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Sparkles, CheckCheck, Clock, Award, Users, MessageSquare, FileText, Briefcase, CheckSquare, BookOpen, UserCheck, FileCheck, Headphones, Star, GraduationCap, Share2, ArrowRight } from "lucide-react"

export default function UnlimitedCoachingPage() {
  return (
    <div className="container mx-auto space-y-10 pb-20">
      {/* Page header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Unlimited Consulting Coaching
        </h1>
        <p className="text-xl text-muted-foreground">
          Personalised Coaching until Offer. We are betting on your success.
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
                title="8 Modules"
                description="Delivered across the Program"
              />
              <HighlightCard 
                icon={<Briefcase className="h-8 w-8 text-primary" />}
                title="Top Firms"
                description="For Offers from McK, BCG, Bain + 8 others"
              />
              <HighlightCard 
                icon={<Users className="h-8 w-8 text-primary" />}
                title="Select Profiles"
                description="Only for Select Profiles - Check Eligibility"
              />
              <HighlightCard 
                icon={<Sparkles className="h-8 w-8 text-primary" />}
                title="Unlimited Coaching"
                description="Unlimited Follow on Coaching"
              />
              <HighlightCard 
                icon={<Clock className="h-8 w-8 text-primary" />}
                title="24H Responses"
                description="Responses to any questions within 24 hours"
              />
              <HighlightCard 
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="Access to Questions"
                description="Access to previous questions asked in your Target Firm"
              />
              <HighlightCard 
                icon={<MessageSquare className="h-8 w-8 text-primary" />}
                title="In-Depth Mentorship"
                description="Personalised Mentorship from one interview to another"
              />
              <HighlightCard 
                icon={<Award className="h-8 w-8 text-primary" />}
                title="Limited Slots"
                description="Limited Slots - Check availability"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Program Agenda */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Unlimited Consulting Coaching: Program Agenda</h2>
          <p className="text-muted-foreground mt-2">Personalised Assessment & Continuous Mentoring</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pre-Program */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Pre-Program
              </CardTitle>
              <CardDescription>Consulting Readiness</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem 
                text="7hr+ pre-read/watch material to establish essential understanding of Case interview" 
              />
              <AgendaItem 
                text="5hr+ pre-read/watch material to initiate understanding and preparation of Fit Interview" 
              />
              <AgendaItem 
                text="CV & Cover Letter writing guides and templates" 
              />
            </CardContent>
          </Card>

          {/* Case Cracking Mastery */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Case Cracking Mastery
              </CardTitle>
              <CardDescription>Sessions 1-4</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem 
                text="Step by step solving a real MBB case and learning full case cycle" 
              />
              <AgendaItem 
                text="Paraphrasing, Clarification, Structuring, Quant Analysis, Qualitative Analysis, Recommendations" 
              />
              <AgendaItem 
                text="Discussing mindset, process, frameworks, checklists, best practices, pitfalls for every phase of solving the case" 
              />
            </CardContent>
          </Card>

          {/* FIT Interview */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                FIT Interview
              </CardTitle>
              <CardDescription>Sessions 5-6</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem 
                text="Fine-tuning and perfecting the FIT answers" 
              />
              <AgendaItem 
                text="Practicing the answer delivery" 
              />
              <AgendaItem 
                text="Personal Experience Impact" 
              />
            </CardContent>
          </Card>

          {/* Consulting CV */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Consulting CV
              </CardTitle>
              <CardDescription>Sessions 7-8</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem 
                text="Reviewing and perfecting the Consulting CV" 
              />
              <AgendaItem 
                text="Insider Tips to craft MBB CV & Tier 2 Firms" 
              />
              <AgendaItem 
                text="Organisation specific changes" 
              />
            </CardContent>
          </Card>

          {/* Continuous Learning */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                Continuous Learning
              </CardTitle>
              <CardDescription>Ongoing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgendaItem 
                text="Continuous mentoring till offer" 
              />
              <AgendaItem 
                text="Ongoing Interview Tips & Suggestions" 
              />
              <AgendaItem 
                text="Organisation specific changes" 
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Coach Profile */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Get Coached by most sought after Consulting Coach globally</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Coach Image */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-primary shadow-xl">
              {/* Replace this with Gaurav's image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 opacity-90 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">GB</span>
              </div>
            </div>
          </div>
          
          {/* Coach Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Gaurav Bhosle</h3>
              <p className="text-muted-foreground">Ex-McKinsey Germany</p>
              <p className="text-muted-foreground">CEO</p>
              <p className="text-muted-foreground">10+ Years Consulting Coach</p>
              <p className="text-muted-foreground">HEC Paris</p>
              <p className="font-medium text-primary">The Only 360 consulting coach</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-r from-background to-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Consultant
                  </h4>
                  <p className="mt-2 text-sm">Ex-McKinsey Germany & global consultant across 25+ countries</p>
                  <p className="mt-1 text-sm">Super fast career growth from entry level to senior manager in 6 years</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-r from-background to-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Coach
                  </h4>
                  <p className="mt-2 text-sm">Industry Leading Astounding success rate of 90+%</p>
                  <p className="mt-1 text-sm">Placed 750+ in MBBs & 1000+ in tier2+ Consulting Firm</p>
                  <p className="mt-1 text-sm">International Coaching Federation (ICF) accredited Career Coach since 2014 with 3000+ hours of coaching experience</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-r from-background to-primary/5">
                <CardContent className="pt-6">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Recruiter
                  </h4>
                  <p className="mt-2 text-sm">Led various on and off campus recruitment events across the globe</p>
                  <p className="mt-1 text-sm">Certified practitioner of HOGAN, MBTI, STRONG psychometric assessments</p>
                  <p className="mt-1 text-sm">Certified practitioner of GLA 360 (Marshall Goldsmith Global Leadership Assessment)</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Star className="h-4 w-4 text-primary" />
                <span className="font-medium">680+ Reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">900+ Students Placed</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Share2 className="h-4 w-4 text-primary" />
                <span className="font-medium">50+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More content will be added here */}
      
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
