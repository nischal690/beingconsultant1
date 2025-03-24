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
      {/* Hero Section - Ultra-Modern Luxury Design */}
      <section className="relative overflow-hidden rounded-3xl bg-black text-white">
        {/* Sophisticated background patterns and effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        {/* Advanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black to-black/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_60%)] opacity-30"></div>
        
        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/5 backdrop-blur-md"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `floatUp ${Math.random() * 10 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Sophisticated light effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        
        {/* Premium border effects */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        
        {/* Content wrapper with glass effect */}
        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 p-10 md:p-16 items-center backdrop-blur-sm">
          {/* Left content column - takes 3/5 of the space */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="relative w-14 h-14 bg-black rounded-lg p-1 shadow-xl border border-white/10 backdrop-blur-md overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image 
                  src="/being-consultant-logo.svg" 
                  alt="Being Consultant Logo" 
                  width={56} 
                  height={56} 
                  className="object-contain relative z-10"
                />
              </div>
              <Badge className="px-4 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md">
                Premium Coaching
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            >
              <span className="block">Elevate Your</span>
              <span className="relative inline-block mt-2">
                <span className="animate-gradient-x bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white">
                  Consulting Career
                </span>
                <span className="absolute bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-light"
            >
              Choose from our premium coaching programs designed to transform your career path and secure your dream consulting role.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-5 pt-4"
            >
              <Button 
                size="lg" 
                className="relative overflow-hidden bg-white text-black hover:bg-white/90 font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group hover:-translate-y-[2px] px-8 py-6 h-auto text-lg"
              >
                <span className="relative z-10">Browse Programs</span>
                <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border border-white/20 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm hover:-translate-y-[2px] transition-all duration-300 px-8 py-6 h-auto text-lg"
              >
                Book a Consultation
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90 pt-4"
            >
              <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 transition-all duration-300 group">
                <CheckCircle className="h-5 w-5 text-white opacity-70 group-hover:opacity-100" />
                <span>Expert Coaches</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 transition-all duration-300 group">
                <CheckCircle className="h-5 w-5 text-white opacity-70 group-hover:opacity-100" />
                <span>1250+ Placements</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 transition-all duration-300 group">
                <CheckCircle className="h-5 w-5 text-white opacity-70 group-hover:opacity-100" />
                <span>Money-back Guarantee</span>
              </div>
            </motion.div>
          </div>
          
          {/* Right content column - takes 2/5 of the space */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex lg:col-span-2 justify-center items-center"
          >
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group perspective">
              {/* Premium card background */}
              <div className="absolute inset-0 bg-gradient-to-br from-black to-black/80 z-0"></div>
              
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-gradient-flow opacity-50"></div>
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
              
              {/* Glass effect border that appears on hover */}
              <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-all duration-700 rounded-2xl z-10"></div>
              
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-white/10 via-transparent to-transparent z-10"></div>
              
              {/* Content overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
              
              {/* Premium card content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 z-20">
                <div className="flex justify-between items-start">
                  <Badge className="bg-black text-white border border-white/20 shadow-lg backdrop-blur-md px-3 py-1.5">Most Popular</Badge>
                  
                  <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 text-white text-sm font-medium flex items-center gap-1 shadow-lg border border-white/10">
                    <Star className="h-4 w-4 text-white fill-white" />
                    <span>4.9/5</span>
                  </div>
                </div>
                
                <div className="transform transition-transform duration-500 group-hover:translate-y-[-5px] space-y-3">
                  <h3 className="text-3xl font-bold text-white">Unlimited Coaching</h3>
                  <p className="text-white/80 text-lg">Support until you land your offer</p>
                  
                  <div className="pt-4">
                    <Button 
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg backdrop-blur-sm w-full group"
                    >
                      <span>View Details</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* 3D tilt effect on hover */}
              <div className="absolute inset-0 transform transition-transform duration-500 ease-out group-hover:rotate-y-6 group-hover:rotate-x-6 group-hover:scale-105"></div>
            </div>
          </motion.div>
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
              {/* Product image would go here */}
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
              
              {/* Product icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-gray-800/90 dark:bg-gray-800/90 flex items-center justify-center">
                  <Briefcase className="h-10 w-10 text-primary" />
                </div>
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
              {/* Product image would go here */}
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
              
              {/* Product icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-gray-800/90 dark:bg-gray-800/90 flex items-center justify-center">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
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
              {/* Product image would go here */}
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
              
              {/* Product icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-gray-800/90 dark:bg-gray-800/90 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
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
                  <Badge className="bg-orange-500 text-white border-none">Popular</Badge>
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold">€299</span>
                    <span className="text-xs text-muted-foreground">per session</span>
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold">€199</span>
                    <span className="text-xs text-muted-foreground">per review</span>
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
