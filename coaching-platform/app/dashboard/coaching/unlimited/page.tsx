"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, Home, Briefcase, Star, CheckCircle, Award, Users, Gift, Globe, Sparkles, Calendar, FileText, ArrowDown, ArrowRight, ArrowUp, Info, Plus, ArrowUpRight, Zap, Layers, Check, Clock, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

const UnlimitedCoachingPage = () => {
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  
  // Dialog states
  const [coachDialogOpen, setCoachDialogOpen] = useState(false)
  const [agendaDialogOpen, setAgendaDialogOpen] = useState(false)
  const [curriculumDialogOpen, setCurriculumDialogOpen] = useState(false)
  const [bonusesDialogOpen, setBonusesDialogOpen] = useState(false)
  
  // Handle scroll to reveal sticky CTA and back to top button
  const handleScroll = () => {
    if (window.scrollY > 500) {
      setShowStickyCta(true)
      setShowBackToTop(true)
    } else {
      setShowStickyCta(false)
      setShowBackToTop(false)
    }
  }
  
  // Effect to add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Function to scroll to a section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Sticky CTA Button - appears when scrolling */}
      {showStickyCta && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-fadeIn">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90"
            onClick={() => scrollToSection('pricing')}
          >
            <ArrowRight className="h-4 w-4" /> View Pricing
          </Button>
        </div>
      )}
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="fixed bottom-6 left-6 z-50 animate-fadeIn">
          <Button 
            onClick={scrollToTop}
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:bg-primary/10"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/dashboard" className="flex items-center hover:text-primary transition-colors">
          <Home className="h-4 w-4 mr-1" />
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/dashboard/coaching" className="hover:text-primary transition-colors">
          Coaching
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-foreground flex items-center">
          <Briefcase className="h-4 w-4 mr-1" />
          Unlimited Coaching
        </span>
      </nav>

      {/* Hero Section - Break into Consulting */}
      <section className="relative overflow-hidden rounded-3xl text-gray-800 mb-10">
        {/* Background image with enhanced styling */}
        <div className="absolute inset-0">
          <Image 
            src="/herosection.jpg" 
            alt="Hero Background" 
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Animated glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-blue-500/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0vjZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNmgtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        {/* Premium border effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        {/* Content wrapper with increased padding and backdrop blur */}
        <div className="relative p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left content column - takes 2/3 of the space */}
            <div className="md:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 text-sm bg-gray-800/10 backdrop-blur-md rounded-full border border-gray-800/20">
                  Flagship Coaching Program
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              >
                <span className="block text-black">Unlimited Consulting Coaching</span>
                <span className="text-black">
                  Personalised Coaching until Offer
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed"
              >
                Our comprehensive program designed specifically to help you master case interviews and secure offers from top consulting firms. With personalized coaching from ex-MBB consultants, you'll gain the skills, confidence, and insider knowledge needed to stand out in the competitive consulting recruitment process.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-4"
              >
                <Button 
                  size="lg" 
                  className="relative overflow-hidden bg-black text-white border border-black/20 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-black/30"
                  onClick={() => scrollToSection('pricing')}
                >
                  <span className="relative z-10 text-white">Enroll Now</span>
                  <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 text-white" />
                  <span className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-black opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-black/10 to-black/30 group-hover:from-gray-700/10 group-hover:to-gray-900/30 transition-colors duration-300"></span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-black/30 hover:border-black hover:bg-transparent"
                  onClick={() => scrollToSection('curriculum')}
                >
                  View Curriculum
                  <ArrowDown className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              
              {/* Stats with animated counters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-8 pt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Users className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1,250+</p>
                    <p className="text-sm text-gray-600">Successful Placements</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Award className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Star className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.9/5</p>
                    <p className="text-sm text-gray-600">Student Rating</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right column - Program highlights card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-2xl transform rotate-1 scale-[1.03] blur-[2px]"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-black/5">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                  Focus Areas
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  My offers are high-quality coaching services tailored to your unique needs. My compassionate approach is grounded in both scientific knowledge and heartfelt dedication to your interview success.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-sm">Learn the ropes with ex-MBB coach hands on – not just watching recorded videos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-sm">Ace the art & science behind cracking any case</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-sm">Master most frequently asked FIT questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-sm">Create killer CV that lands interviews</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-sm">Get continuous mentorship till you break into consulting!</span>
                  </li>
                </ul>
                <div className="mt-6 pt-4 border-t border-black/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">$1,997</span>
                    <span className="text-muted-foreground line-through">$2,997</span>
                    <span className="text-xs text-primary font-medium ml-1">33% off</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Tabs - Enhanced for visual clarity and better hierarchy */}
      <div className="mb-10">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
              onClick={() => scrollToSection('program-overview')}
            >
              <Briefcase className="h-4 w-4" /> Program Overview
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
              onClick={() => scrollToSection('coach')}
            >
              <Users className="h-4 w-4" /> Meet Your Coach
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
              onClick={() => scrollToSection('agenda')}
            >
              <Calendar className="h-4 w-4" /> Program Agenda
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
              onClick={() => scrollToSection('bonuses')}
            >
              <Gift className="h-4 w-4" /> Bonus Materials
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-sm"
              onClick={() => scrollToSection('pricing')}
            >
              <ArrowRight className="h-4 w-4" /> View Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Price Summary Component - Cleaner and more visually balanced */}
      <div className="mb-12">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 md:p-8 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">1:1 Personalised Coaching</h2>
              <p className="text-base text-muted-foreground mb-3">Break into consulting with our proven program</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">1250+ Students Placed</span>
                </div>
                <div className="hidden sm:block text-muted-foreground">•</div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm">680+ Reviews</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-primary">€1,997</span>
                <span className="text-muted-foreground ml-2 line-through">€2,997</span>
                <span className="ml-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded">
                  33% Off
                </span>
              </div>
              <Button 
                size="lg"
                onClick={() => scrollToSection('pricing')} 
                className="relative overflow-hidden group font-medium bg-primary text-white hover:bg-primary/90 shadow-sm"
              >
                <span className="relative z-10">Enroll Now</span>
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Secure payment • 14-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="space-y-12">
        {/* Hero Section - Simplified with less initial content and a Learn More button */}
        <section id="program-overview" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 md:p-8">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto">
            {/* Program badge */}
            <div className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-sm font-medium mb-6">
              <Star className="mr-1.5 h-3.5 w-3.5" />
              <span>Flagship Program</span>
            </div>
            
            {/* Main headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="text-xl md:text-2xl text-primary block mb-2">1:1 Personalised Coaching</span>
              Land Top-Tier Consulting Offers
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
              The definitive coaching program designed to help ambitious professionals break into consulting with guidance from ex-MBB experts who've been there.
            </p>
            
            {/* Program description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-black/80 space-y-4 max-w-2xl"
            >
              <p>
                Unlimited Consulting Coaching Program
              </p>
              <p>
                Unlimited Coaching till Offer. We are betting on your success.
              </p>
            </motion.div>
            
            {/* Program highlights with icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/90 p-2 rounded-full shadow-sm">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-black">8 Modules delivered across the Program</h3>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/90 p-2 rounded-full shadow-sm">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-black">For Offers from McK, BCG, Bain + 8 others</h3>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/90 p-2 rounded-full shadow-sm">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-black">Only for Select Profiles - Check Eligibility</h3>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/90 p-2 rounded-full shadow-sm">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-black">Unlimited Follow on Coaching</h3>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/90 p-2 rounded-full shadow-sm">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-black">24H Responses to any questions</h3>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/90 p-2 rounded-full shadow-sm">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-black">Access to previous questions asked in your Target Firm</h3>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/90 p-2 rounded-full shadow-sm">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-black">In-Depth Personalised Mentorship from one interview to another</h3>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/90 p-2 rounded-full shadow-sm">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-black">Limited Slots - Check availability</h3>
                </div>
              </div>
            </motion.div>
            
            {/* Learn More Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 mt-2">
                  <Info className="h-4 w-4" />
                  <span>Learn More About The Program</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Program Overview: Land Top-Tier Consulting Offers</DialogTitle>
                  <DialogDescription>
                    A comprehensive program designed specifically for breaking into top consulting firms
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-6">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-base">Case + FIT + CV Readiness</h4>
                      <p className="text-muted-foreground mt-1 text-sm">Learn with ex-MBB coach hands on – not just watching recorded videos</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-base">Ace Case Interviews</h4>
                      <p className="text-muted-foreground mt-1 text-sm">Master proven frameworks used by successful consultants</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-base">Master FIT Interviews</h4>
                      <p className="text-muted-foreground mt-1 text-sm">Create a compelling personal narrative that resonates with interviewers</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-base">Continuous Mentorship</h4>
                      <p className="text-muted-foreground mt-1 text-sm">Get support until you break into consulting</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-base">Personalized Learning Path</h4>
                      <p className="text-muted-foreground mt-1 text-sm">Custom approach based on your background and target firms</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-base">Insider Knowledge</h4>
                      <p className="text-muted-foreground mt-1 text-sm">Learn what firms really look for from someone who's been on the inside</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>
        
        {/* Stats Showcase Section - Retained but simplified */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl -z-10"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {/* Stat 1: Reviews */}
            <div className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary">680+</h3>
              <p className="text-black text-sm">Reviews</p>
            </div>
            
            {/* Stat 2: Bonus Value */}
            <div className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary">$799</h3>
              <p className="text-black text-sm">Worth bonus</p>
            </div>
            
            {/* Stat 3: Students Placed */}
            <div className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary">1250+</h3>
              <p className="text-black text-sm">Students Placed</p>
            </div>
            
            {/* Stat 4: Countries */}
            <div className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary">50+</h3>
              <p className="text-black text-sm">Countries</p>
            </div>
          </div>
        </section>
        
        {/* Coach Profile Section */}
        <section className="py-12 md:py-16" id="coach">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Coached by most sought after Consulting Coach globally.</h2>
          </div>
          
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-sm border border-primary/10 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Coach Image */}
              <div className="relative h-[400px] md:h-auto overflow-hidden">
                <Image 
                  src="/coach-profile.jpg" 
                  alt="Gaurav Bhosle" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">Gaurav Bhosle</h3>
                  <p className="text-white/90 text-lg">Ex-McKinsey Germany</p>
                  <p className="text-white/90">CEO, Being Consultant</p>
                  <p className="text-white/90">10+ Years Consulting Coach</p>
                  <p className="text-white/90">HEC Paris</p>
                  <p className="text-white/90">The Only 360 consulting coach</p>
                </div>
              </div>
              
              {/* Coach Credentials */}
              <div className="p-8">
                <h3 className="text-xl font-bold mb-6">Ex-Mck Consultant + Decade of Coaching + Recruiter</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Consultant</h4>
                      <p className="text-muted-foreground">
                        Placed 750+ in MBBs & 1000+ in tier2+ Consulting Firm
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Placed 750+ in MBBs & 1000+ in tier2+ Consulting Firm
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Coach</h4>
                      <p className="text-muted-foreground">
                        Industry Leading Astounding success rate of 90+%
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Ex-McKinsey Germany & global consultant across 25+ countries
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Recruiter</h4>
                      <p className="text-muted-foreground">
                        Super fast career growth from entry level to senior manager in 6 years
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Led various on and off campus recruitment events across the globe
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-2">
                  <p className="text-muted-foreground">
                    International Coaching Federation (ICF) accredited Career Coach since 2014 with 3000+ hours of coaching experience
                  </p>
                  <p className="text-muted-foreground">
                    Certified practitioner of HOGAN, MBTI, STRONG psychometric assessments
                  </p>
                  <p className="text-muted-foreground">
                    Certified practitioner of GLA 360 (Marshall Goldsmith Global Leadership Assessment)
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <span className="font-semibold">680+ Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Program Agenda Section */}
        <section className="py-12 md:py-16" id="agenda">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unlimited Consulting Coaching: Program Agenda</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Personalised Assessment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Case Cracking</h3>
                <p className="text-muted-foreground">
                  Master the art of solving complex consulting cases with our structured approach.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">CV Review</h3>
                <p className="text-muted-foreground">
                  Transform your resume into a consulting-ready CV that stands out to recruiters.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cover Letter</h3>
                <p className="text-muted-foreground">
                  Craft compelling cover letters tailored to each consulting firm.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">FIT Interview</h3>
                <p className="text-muted-foreground">
                  Prepare for behavioral interviews with personalized coaching on your responses.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <ArrowUpRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Continous Mentoring</h3>
                <p className="text-muted-foreground">
                  Ongoing support throughout your consulting interview journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Detailed Program Curriculum */}
        <section className="py-12 bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 rounded-3xl border border-primary/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Program Curriculum</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our comprehensive curriculum covers everything you need to succeed in consulting interviews
              </p>
            </div>
            
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Pre-Program */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 backdrop-blur-sm border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Pre-Program</h3>
                    <h4 className="text-lg font-medium text-primary mb-2">Consulting Readiness</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>7hr+ pre-read/watch material to establish essential understanding of Case interview</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>5hr+ pre-read/watch material to initiate understanding and preparation of Fit Interview</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>CV & Cover Letter writing guides and templates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Case Cracking Mastery */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 backdrop-blur-sm border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Case Cracking Mastery</h3>
                    <h4 className="text-lg font-medium text-primary mb-2">Sessions 1-4</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Step by step solving a real MBB case and learning fullcase cycle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Paraphrasing, Clarification, Structuring, Quant Analysis, Qualitative Analysis, Recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Discussing mindset, process, frameworks, checklists, best practices, pitfalls for every phase of solving the case</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* FIT Interview */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 backdrop-blur-sm border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">FIT Interview</h3>
                    <h4 className="text-lg font-medium text-primary mb-2">Sessions 5-6</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Fine-tuning and perfecting the FIT answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Practicing the answer delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Personal Experience Impact</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Consulting CV */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 backdrop-blur-sm border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Consulting CV</h3>
                    <h4 className="text-lg font-medium text-primary mb-2">Sessions 7-8</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Reviewing and perfecting the Consulting CV</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Insider Tips to craft MBB CV &Tier 2 Firms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Organisation specific changes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Continuous Learning */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 backdrop-blur-sm border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <ArrowUpRight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Continous Learning</h3>
                    <h4 className="text-lg font-medium text-primary mb-2">Ongoing</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Continuous mentoring till offer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Ongoing Interview Tips & Suggestions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Organisation specific changes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Bonus Materials Section */}
        <section id="bonuses" className="mt-16 relative">
          {/* Background decorative elements */}
          <div className="absolute top-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              Added Value
            </span>
            <h2 className="text-3xl font-bold">$799 worth bonus</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              In addition to the core program, you'll receive these valuable resources to accelerate your consulting journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bonus Item 1 */}
            <div className="group relative overflow-hidden rounded-xl border border-primary/10 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <div className="absolute top-0 right-0">
                <div className="w-20 h-20 bg-primary/10 rounded-bl-full flex items-center justify-center">
                  <Gift className="h-8 w-8 text-primary -translate-x-2 -translate-y-2" />
                </div>
              </div>
              
              <div className="p-6 pt-8">
                <h3 className="text-xl font-semibold mb-3">Consulting Case Library</h3>
                <p className="text-muted-foreground mb-4">
                  Access to 50+ real consulting cases with detailed solutions, frameworks, and expert commentary.
                </p>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Market Entry Cases</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Profitability Analysis</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">M&A and Valuation Cases</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Growth Strategy Scenarios</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-primary">$499</span>
                      <span className="text-muted-foreground text-sm ml-2">Value</span>
                    </div>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/20 px-2 py-1 rounded">Included</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bonus Item 2 */}
            <div className="group relative overflow-hidden rounded-xl border border-primary/10 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <div className="absolute top-0 right-0">
                <div className="w-20 h-20 bg-primary/10 rounded-bl-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary -translate-x-2 -translate-y-2" />
                </div>
              </div>
              
              <div className="p-6 pt-8">
                <h3 className="text-xl font-semibold mb-3">CV & Cover Letter Templates</h3>
                <p className="text-muted-foreground mb-4">
                  Premium templates designed specifically for consulting applications, with detailed guidelines and examples.
                </p>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">MBB-Optimized CV Templates</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Achievement Statement Formulas</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Cover Letter Frameworks</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Real Success Examples</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-primary">$299</span>
                      <span className="text-muted-foreground text-sm ml-2">Value</span>
                    </div>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/20 px-2 py-1 rounded">Included</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bonus Item 3 */}
            <div className="group relative overflow-hidden rounded-xl border border-primary/10 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <div className="absolute top-0 right-0">
                <div className="w-20 h-20 bg-primary/10 rounded-bl-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary -translate-x-2 -translate-y-2" />
                </div>
              </div>
              
              <div className="p-6 pt-8">
                <h3 className="text-xl font-semibold mb-3">Consulting Network Access</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with a community of successful candidates and consulting professionals for networking and insights.
                </p>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Private Community Access</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Monthly Networking Events</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Firm-Specific Insights</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Success Stories & Strategies</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-primary">$399</span>
                      <span className="text-muted-foreground text-sm ml-2">Value</span>
                    </div>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/20 px-2 py-1 rounded">Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Bonuses */}
          <div className="mt-10 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">Additional Program Benefits</h3>
                <p className="text-muted-foreground mb-4">
                  Beyond the core program and major bonuses, you'll also receive these valuable extras:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Interview Anxiety Management Toolkit</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Industry-Specific Case Primers</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Mental Math Speed Drills</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Consulting Career Roadmap Guide</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Post-Offer Negotiation Playbook</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">First 90 Days in Consulting Guide</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 text-center border border-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Total Bonus Value</p>
                  <div className="text-2xl font-bold text-primary">$1,497</div>
                  <p className="text-xs text-muted-foreground mt-1">Included with your enrollment</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">
              All bonus materials are carefully designed to complement your coaching journey and provide additional support for your consulting career.
            </p>
          </div>
        </section>
        
        {/* Pricing & Call to Action Section */}
        <section id="pricing" className="mt-20 relative">
          {/* Background decorative elements */}
          <div className="absolute top-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              Limited Time Offer
            </span>
            <h2 className="text-3xl font-bold">Invest in Your Consulting Career</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Choose the plan that best fits your needs and start your journey to consulting success
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
              
              <div className="relative h-full bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-md rounded-2xl shadow-medium overflow-hidden border border-primary/10 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-brand-300 to-secondary"></div>
                
                <div className="p-8">
                  <div className="flex flex-col h-full">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Break into Consulting</h3>
                      <p className="text-muted-foreground mb-6">
                        Complete coaching program with all core components and bonuses
                      </p>
                      
                      <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-bold text-primary">$6999</span>
                        <span className="text-muted-foreground ml-2 line-through">$6999</span>
                        <span className="ml-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded">
                          0% off
                        </span>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground mb-2">One-time payment includes:</p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>8 Comprehensive Coaching Sessions</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Unlimited Follow-up Support</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Personalized Coaching Plan</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Complete Consulting Interview Prep</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>$799 Bonus Materials Included</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-primary/10">
                      <Button className="w-full text-lg py-6 relative overflow-hidden group">
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-light/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative z-10">Enroll Now</span>
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-3">
                        Secure payment via Stripe • 14-day money-back guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Unlimited Coaching Plan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
              
              <div className="relative h-full bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-md rounded-2xl shadow-medium overflow-hidden border border-primary/10 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-brand-300 to-secondary"></div>
                
                <div className="p-8">
                  <div className="flex flex-col h-full">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Unlimited Coaching</h3>
                      <p className="text-muted-foreground mb-6">
                        Support until you get an offer
                      </p>
                      
                      <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-bold text-primary">$6999</span>
                        <span className="text-muted-foreground ml-2 line-through">$6999</span>
                        <span className="ml-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded">
                          0% off
                        </span>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground mb-2">One-time payment includes:</p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>8 Comprehensive Coaching Sessions</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Unlimited Follow-up Support</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Personalized Coaching Plan</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>Complete Consulting Interview Prep</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>$799 Bonus Materials Included</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-primary/10">
                      <Button variant="default" className="w-full text-lg py-6 bg-primary hover:bg-primary/90 relative overflow-hidden group">
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-light/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative z-10">Enroll Now</span>
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-3">
                        Secure payment via Stripe • 30-day money-back guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Plans */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              <span className="font-medium">Flexible payment plans available</span> - Split your payment into 3 or 6 monthly installments
            </p>
            <Button variant="outline" className="border-primary/20 hover:border-primary/40">
              View Payment Plan Options
            </Button>
          </div>
          
          {/* Guarantee Section */}
          <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden border border-primary/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Success Guarantee</h3>
                <p className="text-muted-foreground mb-4">
                  We're confident in our coaching methodology and your ability to succeed. If you're not satisfied with the program within the first 14 days (Standard) or 30 days (Premium), we'll refund your investment in full.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">No questions asked</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Full refund</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Keep all downloaded materials</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Consulting Career?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Gaurav's coaching program today and gain the skills, confidence, and insider knowledge you need to break into top consulting firms.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="relative overflow-hidden group font-medium">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-light/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Schedule a Free Consultation</span>
              </Button>
              
              <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary/40">
                View Program FAQ
              </Button>
            </div>
          </div>
        </section>
        
        {/* FAQ Section - Added new section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Everything you need to know about our coaching program
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden border border-primary/10">
            <div className="p-6 space-y-6">
              {/* FAQ Item 1 */}
              <div className="border-b border-primary/10 pb-4">
                <h3 className="text-lg font-semibold mb-2">What makes this program different from other consulting coaching?</h3>
                <p className="text-muted-foreground">
                  Our program offers a unique triple perspective approach: consultant, coach, and recruiter. You'll learn from someone who has mastered all three aspects of the consulting world, providing you with insider knowledge and a comprehensive understanding of what it takes to succeed.
                </p>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="border-b border-primary/10 pb-4">
                <h3 className="text-lg font-semibold mb-2">How long will it take to complete the program?</h3>
                <p className="text-muted-foreground">
                  The core program consists of 5 coaching sessions typically spread over 4-8 weeks, depending on your timeline and availability. However, our support extends beyond this period with continuous mentorship until you successfully land a consulting offer.
                </p>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="border-b border-primary/10 pb-4">
                <h3 className="text-lg font-semibold mb-2">Is there a guarantee that I'll get a consulting job?</h3>
                <p className="text-muted-foreground">
                  While we can't guarantee job offers (no coaching program ethically can), we're proud of our 90%+ success rate with committed students. Our methodology has helped place over 1,250 students in top consulting firms, and we provide continuous support until you succeed.
                </p>
              </div>
              
              {/* FAQ Item 4 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">What if I'm not satisfied with the program?</h3>
                <p className="text-muted-foreground">
                  We offer a 14-day money-back guarantee. If you're not satisfied with the program after your first coaching session, we'll provide a full refund. We're confident in the value we provide and want you to feel secure in your investment.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? Contact us directly
            </p>
            <Button className="relative overflow-hidden group font-medium">
              <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-light/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Contact Support</span>
            </Button>
          </div>
        </section>
        
        {/* Bonus Section */}
        <section className="py-12 md:py-16" id="bonuses">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">$799 worth bonus</h2>
            <div className="flex justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>900+ Students Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>50+ Countries</span>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Mega Consulting Kit worth $799 FREE with our coaching program
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Luka</h3>
                  <p className="text-sm text-muted-foreground mb-2">Associate Consultant,<br/>Bain & Co</p>
                  <p className="text-sm font-medium">Netherlands</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Irena</h3>
                  <p className="text-sm text-muted-foreground mb-2">Consultant,<br/>BCG</p>
                  <p className="text-sm font-medium">London</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Mrinmayee</h3>
                  <p className="text-sm text-muted-foreground mb-2">Consultant,<br/>Bain & Co</p>
                  <p className="text-sm font-medium">Bangalore</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Fernando</h3>
                  <p className="text-sm text-muted-foreground mb-2">Associate,<br/>McKinsey & Co</p>
                  <p className="text-sm font-medium">Panama</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Akash</h3>
                  <p className="text-sm text-muted-foreground mb-2">Associate,<br/>McKinsey & Co</p>
                  <p className="text-sm font-medium">Boston</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-lg font-medium mb-6">55 Countries, 900+ Consultants & Counting.</p>
            <p className="text-muted-foreground">Consistently recommended by Consultants</p>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-12 bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50 rounded-3xl border border-primary/10 backdrop-blur-sm" id="pricing">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get Started with the Program today</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Private 1:1 Format
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                All Coaching Sessions directly with our CEO Gaurav Bhosle
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="bg-primary/10 p-4 text-center">
                  <h3 className="text-xl font-semibold text-primary">Unlimited Coaching Program</h3>
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold mb-2">$6999</div>
                    <p className="text-muted-foreground">One-time payment</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>8 Comprehensive Coaching Sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Unlimited Follow-up Support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Personalized Coaching Plan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Complete Consulting Interview Prep</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>$799 Bonus Materials Included</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full py-6 text-lg font-semibold">
                    Signup Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">A Privilege to work with consulting talent across the globe</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">L</span>
                  </div>
                  <h3 className="font-semibold mb-1">Luka</h3>
                  <p className="text-sm text-muted-foreground mb-2">Associate Consultant,<br/>Bain & Co</p>
                  <p className="text-sm font-medium">Netherlands</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">I</span>
                  </div>
                  <h3 className="font-semibold mb-1">Irena</h3>
                  <p className="text-sm text-muted-foreground mb-2">Consultant,<br/>BCG</p>
                  <p className="text-sm font-medium">London</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">M</span>
                  </div>
                  <h3 className="font-semibold mb-1">Mrinmayee</h3>
                  <p className="text-sm text-muted-foreground mb-2">Consultant,<br/>Bain & Co</p>
                  <p className="text-sm font-medium">Bangalore</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">F</span>
                  </div>
                  <h3 className="font-semibold mb-1">Fernando</h3>
                  <p className="text-sm text-muted-foreground mb-2">Associate,<br/>McKinsey & Co</p>
                  <p className="text-sm font-medium">Panama</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">A</span>
                  </div>
                  <h3 className="font-semibold mb-1">Akash</h3>
                  <p className="text-sm text-muted-foreground mb-2">Associate,<br/>McKinsey & Co</p>
                  <p className="text-sm font-medium">Boston</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-lg font-medium mb-6">55 Countries, 900+ Consultants & Counting.</p>
            <p className="text-muted-foreground">Consistently recommended by Consultants</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default UnlimitedCoachingPage
