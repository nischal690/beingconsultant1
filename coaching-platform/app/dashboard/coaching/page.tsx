"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  CheckCircle, 
  Heart, 
  ShoppingCart, 
  Star, 
  Briefcase, 
  Clock, 
  Users, 
  FileText, 
  FileCheck, 
  MessageSquare, 
  Sparkles,
  Award,
  ChevronDown,
  Filter,
  Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CoachingPage() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  // State for filtering (e-commerce style)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  return (
    <div className="container mx-auto space-y-10 pb-20">
      {/* Hero Section - 1:1 Personalized Coaching */}
      <section className="relative overflow-hidden rounded-3xl text-gray-800">
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
                  Elite Coaching Programs
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              >
                <span className="block">Transform Your Career</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-gray-800 to-blue-600 animate-gradient-x">
                  With Expert Coaching
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed"
              >
                Elevate your professional journey with our comprehensive coaching programs tailored 
                to your unique career goals. Our expert coaches provide personalized guidance, 
                actionable frameworks, and insider knowledge to help you navigate the consulting 
                landscape with confidence. Join the 1,250+ professionals who've accelerated their 
                careers through our structured, results-driven approach.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="relative overflow-hidden bg-black hover:bg-black/80 text-white rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-black/20"
                >
                  <span className="relative z-10">Explore Programs</span>
                  <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <span className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </Button>
              </motion.div>
              
              {/* Stats with animated counters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800">1250+</span>
                  <span className="text-sm text-gray-600">Successful Placements</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800">98%</span>
                  <span className="text-sm text-gray-600">Success Rate</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800">4.9/5</span>
                  <span className="text-sm text-gray-600">Client Rating</span>
                </div>
              </motion.div>
            </div>
            
            {/* Right content column - coach profiles with enhanced styling */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center items-center"
            >
              <div className="relative">
                {/* Coach profiles in oval frames with enhanced styling */}
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.div 
                    className="relative"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-32 h-40 rounded-full overflow-hidden border-2 border-gray-800/30 bg-white/5 shadow-xl backdrop-blur-sm" style={{ borderRadius: '40% 40% 40% 40% / 60% 60% 40% 40%' }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/20 to-blue-500/20 mix-blend-overlay"></div>
                      <Image 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=250&fit=crop" 
                        alt="Coach" 
                        width={200} 
                        height={250}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="relative -mt-10"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-32 h-40 rounded-full overflow-hidden border-2 border-gray-800/30 bg-white/5 shadow-xl backdrop-blur-sm" style={{ borderRadius: '40% 40% 40% 40% / 60% 60% 40% 40%' }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/20 to-blue-500/20 mix-blend-overlay"></div>
                      <Image 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=250&fit=crop" 
                        alt="Coach" 
                        width={200} 
                        height={250}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="relative"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-32 h-40 rounded-full overflow-hidden border-2 border-gray-800/30 bg-white/5 shadow-xl backdrop-blur-sm" style={{ borderRadius: '40% 40% 40% 40% / 60% 60% 40% 40%' }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/20 to-blue-500/20 mix-blend-overlay"></div>
                      <Image 
                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=250&fit=crop" 
                        alt="Coach" 
                        width={200} 
                        height={250}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* E-commerce style filter bar - Modernized */}
      <section className="sticky top-16 z-20 bg-background/80 backdrop-blur-md py-4 border-b border-border/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 rounded-full">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant={activeFilter === "all" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={`rounded-full px-4 ${activeFilter === "all" ? "bg-primary/90 text-white shadow-md" : ""}`}
              >
                All Programs
              </Button>
              <Button 
                variant={activeFilter === "1on1" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveFilter("1on1")}
                className={`rounded-full px-4 ${activeFilter === "1on1" ? "bg-primary/90 text-white shadow-md" : ""}`}
              >
                1:1 Coaching
              </Button>
              <Button 
                variant={activeFilter === "group" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveFilter("group")}
                className={`rounded-full px-4 ${activeFilter === "group" ? "bg-primary/90 text-white shadow-md" : ""}`}
              >
                Group Programs
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 rounded-full">
              <span>Sort By</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Coaching Programs */}
      <section className="mt-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Programs</h2>
            <p className="text-muted-foreground">Discover our premium coaching solutions</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">5 programs available</span>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Break into consulting */}
          <motion.div variants={itemVariants} className="group">
            <div className="relative overflow-hidden rounded-t-xl aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 to-gray-900">
              {/* Product image */}
              <Image 
                src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/DALL%C2%B7E%202025-03-27%2012.32.44%20-%20A%20sleek%20and%20professional%20promotional%20image%20for%20a%20coaching%20program%20titled%20'Break%20into%20Consulting.'%20The%20design%20features%20a%20confident%20business%20professiona.webp?alt=media&token=f198d448-4b63-49ce-9ed8-6642be0ebbd2"
                alt="Break into Consulting"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Product badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-primary text-white border-none">Bestseller</Badge>
              </div>
              
              {/* Quick action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 border border-t-0 rounded-b-xl bg-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">Break into Consulting</h3>
                  <p className="text-muted-foreground text-sm">Our flagship program</p>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">(128)</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Comprehensive case interview preparation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Personalized coaching from ex-MBB consultants</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">1250+ students successfully placed</span>
                </div>
              </div>
              
              <div className="flex items-end justify-between pt-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">€1,997</span>
                    <span className="text-muted-foreground line-through">€2,997</span>
                  </div>
                  <span className="text-xs text-muted-foreground">33% discount for limited time</span>
                </div>
                
                <Link href="/dashboard/coaching/land-consulting">
                  <Button className="group">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Unlimited coaching till offer */}
          <motion.div variants={itemVariants} className="group">
            <div className="relative overflow-hidden rounded-t-xl aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 to-gray-900">
              {/* Product image */}
              <Image 
                src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/DALL%C2%B7E%202025-03-27%2012.35.30%20-%20A%20professional%20and%20modern%20promotional%20image%20for%20a%20coaching%20program%20titled%20'Unlimited%20Coaching_%20Support%20Until%20You%20Get%20an%20Offer.'%20The%20design%20features%20a%20.webp?alt=media&token=f9489598-02ed-41bf-991c-d185dcaccf4b"
                alt="Unlimited Coaching: Support Until You Get an Offer"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Product badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-emerald-500 text-white border-none">Best Value</Badge>
              </div>
              
              {/* Quick action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 border border-t-0 rounded-b-xl bg-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">Unlimited Coaching</h3>
                  <p className="text-muted-foreground text-sm">Support until you get an offer</p>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">(94)</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited coaching until you receive an offer</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Personalized mentorship throughout your journey</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">24-hour response to all your questions</span>
                </div>
              </div>
              
              <div className="flex items-end justify-between pt-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">€2,997</span>
                    <span className="text-muted-foreground line-through">€3,997</span>
                  </div>
                  <span className="text-xs text-muted-foreground">25% discount for limited time</span>
                </div>
                
                <Link href="/dashboard/coaching/unlimited">
                  <Button className="group">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Group coaching */}
          <motion.div variants={itemVariants} className="group">
            <div className="relative overflow-hidden rounded-t-xl aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 to-gray-900">
              {/* Product image */}
              <Image 
                src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/DALL%C2%B7E%202025-03-27%2012.36.21%20-%20A%20vibrant%20and%20engaging%20promotional%20image%20for%20a%20'Group%20Coaching_%20Learn%20with%20Peers'%20program.%20The%20design%20features%20a%20diverse%20group%20of%20professionals%20collab.webp?alt=media&token=c717558b-1243-4d60-87a9-edffc91ffb47"
                alt="Group Coaching: Learn with Peers"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Product badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-blue-500 text-white border-none">New</Badge>
              </div>
              
              {/* Quick action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 border border-t-0 rounded-b-xl bg-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">Group Coaching</h3>
                  <p className="text-muted-foreground text-sm">Learn with peers</p>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">(42)</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Small group sessions with like-minded candidates</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Cost-effective way to receive expert guidance</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Weekly sessions with structured curriculum</span>
                </div>
              </div>
              
              <div className="flex items-end justify-between pt-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">€997</span>
                    <span className="text-muted-foreground line-through">€1,497</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Launch special price</span>
                </div>
                
                <Button className="group" variant="outline">
                  Coming Soon
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Additional Programs Section */}
      <section className="mt-16">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Specialized Programs</h2>
            <p className="text-muted-foreground">Focused coaching for specific needs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1:1 Case Cracking */}
          <motion.div variants={itemVariants} className="group">
            <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border bg-card">
              <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 to-gray-900 flex items-center justify-center">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              
              <div className="p-6 w-full md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">1:1 Case Cracking</h3>
                    <p className="text-muted-foreground text-sm">Master case interviews</p>
                  </div>
                  <Badge className="bg-orange-500 text-white border-none">
                    Popular
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">One-on-one case practice with expert coaches</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Real MBB-style cases and frameworks</span>
                  </div>
                </div>
                
                <div className="flex items-end justify-between pt-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">€299</span>
                      <span className="text-xs text-muted-foreground">per session</span>
                    </div>
                  </div>
                  
                  <Button className="group" variant="outline">
                    Coming Soon
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 1:1 CV and CL Review */}
          <motion.div variants={itemVariants} className="group">
            <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border bg-card">
              <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 to-gray-900 flex items-center justify-center">
                <FileCheck className="h-12 w-12 text-primary" />
              </div>
              
              <div className="p-6 w-full md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">1:1 CV and CL Review</h3>
                    <p className="text-muted-foreground text-sm">Perfect your application</p>
                  </div>
                  <Badge className="bg-purple-500 text-white border-none">Essential</Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Detailed review of your CV and cover letter</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Insider tips to pass resume screening</span>
                  </div>
                </div>
                
                <div className="flex items-end justify-between pt-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">€199</span>
                      <span className="text-xs text-muted-foreground">per review</span>
                    </div>
                  </div>
                  
                  <Button className="group" variant="outline">
                    Coming Soon
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="mt-16">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Customer Reviews</h2>
            <p className="text-muted-foreground">Hear from our successful clients</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="flex">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <span className="font-medium">4.9</span>
            <span className="text-sm text-muted-foreground">(264 reviews)</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="h-full border bg-card hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                </div>
                <div>
                  <h4 className="font-semibold">Exceptional Program</h4>
                  <p className="italic text-muted-foreground text-sm mt-2">
                    "The coaching program was instrumental in helping me land my dream job at McKinsey. The personalized feedback and structured approach made all the difference."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">S</div>
                  <div>
                    <p className="font-medium text-sm">Sarah K.</p>
                    <p className="text-xs text-muted-foreground">Associate, McKinsey & Company</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full border bg-card hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                </div>
                <div>
                  <h4 className="font-semibold">Worth Every Penny</h4>
                  <p className="italic text-muted-foreground text-sm mt-2">
                    "After struggling with case interviews for months, the unlimited coaching program gave me the confidence and skills I needed. I received offers from both BCG and Bain!"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">M</div>
                  <div>
                    <p className="font-medium text-sm">Michael T.</p>
                    <p className="text-xs text-muted-foreground">Consultant, Boston Consulting Group</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full border bg-card hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                </div>
                <div>
                  <h4 className="font-semibold">Game Changer</h4>
                  <p className="italic text-muted-foreground text-sm mt-2">
                    "The CV review service transformed my application. What I thought was a strong resume was completely revamped with insider knowledge that helped me get past the screening."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">P</div>
                  <div>
                    <p className="font-medium text-sm">Priya M.</p>
                    <p className="text-xs text-muted-foreground">Business Analyst, Bain & Company</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="flex items-center gap-2">
            View All Reviews
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">Everything you need to know about our coaching programs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border bg-card hover:shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <span>How are the coaching sessions conducted?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All coaching sessions are conducted online via Zoom. You'll receive a calendar invite with a link to join the session. Sessions typically last 60-90 minutes depending on the program you choose.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border bg-card hover:shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <span>How long does each program last?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Program durations vary: Break into Consulting is 8 weeks, Unlimited Coaching runs until you receive an offer, Group Coaching is 6 weeks, and 1:1 sessions are scheduled as needed based on your package.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border bg-card hover:shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <span>What's the difference between group and 1:1 coaching?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Group coaching provides a collaborative environment where you learn with peers, while 1:1 coaching offers personalized attention focused exclusively on your specific needs and challenges.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border bg-card hover:shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                <span>Do you offer a satisfaction guarantee?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! We're confident in our programs and offer a 14-day money-back guarantee if you're not satisfied. For our Unlimited Coaching program, we guarantee coaching until you receive an offer.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border bg-card hover:shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <span>Who are the coaches?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our coaches are experienced consultants from top firms like McKinsey, BCG, Bain, and other MBB firms. They have firsthand experience in the recruiting process and can provide insider knowledge.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border bg-card hover:shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                <span>What's your success rate?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our clients have a 70% higher success rate in securing consulting offers compared to the industry average. Over 1,250 of our clients have successfully landed offers at top consulting firms.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-4">Still have questions? We're here to help!</p>
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background gradient and effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90"></div>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
          
          <div className="relative p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                  Limited Time Offer
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Career?</h2>
                <p className="text-white/80">
                  Choose the program that fits your needs and take the first step toward your dream consulting career. Special pricing available for a limited time.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Browse All Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    Schedule a Call
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <h3 className="text-xl font-bold">Why Choose Our Coaching?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5" />
                    <span>Expert coaches from top consulting firms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5" />
                    <span>Proven track record with 1250+ placements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5" />
                    <span>Personalized approach for your unique needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5" />
                    <span>Flexible programs to fit your schedule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5" />
                    <span>Money-back guarantee if not satisfied</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional sections can be added here */}
    </div>
  )
}

// Helper component for testimonials
function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-start">
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
        <p className="italic text-muted-foreground">{quote}</p>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">{author.charAt(0)}</div>
          <div>
            <p className="font-medium">{author}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
