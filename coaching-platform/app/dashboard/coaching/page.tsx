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
  Zap,
  X,
  Check
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { processRazorpayPayment } from "@/lib/payment/razorpay"
import { processStripePayment } from "@/lib/payment/stripe"
import { useAuth } from "@/lib/firebase/auth-context"

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

export default function CoachingPage() {
  // Get user from auth context
  const { user } = useAuth();
  
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

  // Add state for payment dialog
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Sample coupon data
  const availableCoupons = [
    { code: "TEST", discount: 10, discountType: "percentage", product: "all" },
    { code: "NEWUSER", discount: 15, discountType: "percentage", product: "all" },
  ]

  // Handle buy now click
  const handleBuyNow = (program: any) => {
    setSelectedProgram(program);
    setShowPaymentDialog(true);
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number) => {
    if (!appliedCoupon) return price;
    
    if (appliedCoupon.discountType === "percentage") {
      return price - (price * (appliedCoupon.discount / 100));
    } else {
      return Math.max(0, price - appliedCoupon.discount);
    }
  }

  // Handle apply coupon
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError(null);
    
    // Simulate API call delay
    setTimeout(() => {
      const coupon = availableCoupons.find(c => c.code === couponCode);
      
      if (coupon) {
        setAppliedCoupon(coupon);
        toast.success(`Coupon "${coupon.code}" applied successfully!`);
      } else {
        setCouponError("Invalid coupon code");
        toast.error("Invalid coupon code");
      }
      
      setIsApplyingCoupon(false);
    }, 800);
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = async (method: 'razorpay' | 'stripe') => {
    if (!selectedProgram) return;
    
    try {
      // Calculate the final price after discount
      const finalPrice = calculateDiscountedPrice(selectedProgram.price);
      const amountInSmallestUnit = Math.round(finalPrice * 100);
      
      // Prepare metadata for the payment
      const metadata: Record<string, string> = {
        programId: selectedProgram.id,
        programTitle: selectedProgram.title,
      };
      
      if (appliedCoupon) {
        metadata.couponCode = appliedCoupon.code;
        metadata.discountApplied = `${appliedCoupon.discount}%`;
      }
      
      let paymentResult;
      
      if (method === 'razorpay') {
        paymentResult = await processRazorpayPayment({
          amount: amountInSmallestUnit,
          currency: 'INR',
          name: "Being Consultant",
          description: `Payment for ${selectedProgram.title}`,
          prefill: {
            name: user?.displayName || '',
            email: user?.email || '',
          },
          notes: metadata,
          theme: {
            color: '#000000'
          }
        });
      } else {
        paymentResult = await processStripePayment({
          amount: amountInSmallestUnit,
          currency: 'usd',
          productName: selectedProgram.title,
          productDescription: selectedProgram.description,
          customerEmail: user?.email || '',
          metadata
        });
      }
      
      if (paymentResult.success) {
        // If payment is successful and there was a coupon applied
        if (appliedCoupon) {
          // In a real implementation, you would increment coupon usage here
          // await incrementCouponUsage(appliedCoupon.code);
        }
        
        toast.success(`Payment successful! Transaction ID: ${paymentResult.transactionId}`);
        setShowPaymentDialog(false);
        setCouponCode("");
        setAppliedCoupon(null);
        setCouponError(null);
        
        // You might want to update the user's purchases in Firestore here
      } else {
        toast.error(`Payment failed: ${paymentResult.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error processing ${method} payment:`, error);
      toast.error(`Error processing payment. Please try again.`);
    }
  }

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
                <span className="block text-black">Transform Your Career</span>
                <span className="text-black">
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
                  className="relative overflow-hidden bg-black text-white border border-black/20 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-black/30"
                >
                  <span className="relative z-10 text-white">Explore Programs</span>
                  <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 text-white" />
                  <span className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-black opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-black/10 to-black/30 group-hover:from-gray-700/10 group-hover:to-gray-900/30 transition-colors duration-300"></span>
                  <style jsx>{`
                    .group:hover span {
                      color: white !important;
                    }
                  `}</style>
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
            <span className="text-sm text-muted-foreground">6 programs available</span>
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
            <div className="rounded-xl border border-black/10 bg-card overflow-hidden hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary/20"></div>
              
              <div className="p-7">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">Break into Consulting</h3>
                      <Badge className="bg-primary text-white border-none">Bestseller</Badge>
                    </div>
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
                
                <div className="space-y-3 mb-6">
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
                
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">€1,997</span>
                    <span className="text-muted-foreground line-through">€2,997</span>
                    <span className="text-xs text-primary font-medium ml-1">33% off</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="w-1/2 bg-black text-white hover:bg-white hover:text-black border border-black/20 hover:border-white shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                      onClick={() => handleBuyNow({
                        id: "break-into-consulting",
                        title: "Break into Consulting",
                        description: "Our flagship program",
                        price: 1997,
                        originalPrice: 2997,
                        discount: 33
                      })}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                      <span className="relative z-10 flex items-center gap-1">
                        Buy Now
                      </span>
                    </Button>
                    <Link href="/dashboard/coaching/land-consulting" className="w-1/2">
                      <Button variant="outline" className="w-full group border-black/30 hover:border-black hover:bg-transparent">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Unlimited coaching till offer */}
          <motion.div variants={itemVariants} className="group">
            <div className="rounded-xl border border-black/10 bg-card overflow-hidden hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500/20"></div>
              
              <div className="p-7">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">Unlimited Coaching</h3>
                      <Badge className="bg-emerald-500 text-white border-none">Best Value</Badge>
                    </div>
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
                
                <div className="space-y-3 mb-6">
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
                
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">€2,997</span>
                    <span className="text-muted-foreground line-through">€3,997</span>
                    <span className="text-xs text-primary font-medium ml-1">25% off</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="w-1/2 bg-black text-white hover:bg-white hover:text-black border border-black/20 hover:border-white shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                      onClick={() => handleBuyNow({
                        id: "unlimited-coaching",
                        title: "Unlimited Coaching",
                        description: "Support until you get an offer",
                        price: 2997,
                        originalPrice: 3997,
                        discount: 25
                      })}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                      <span className="relative z-10 flex items-center gap-1">
                        Buy Now
                      </span>
                    </Button>
                    <Link href="/dashboard/coaching/unlimited" className="w-1/2">
                      <Button variant="outline" className="w-full group border-black/30 hover:border-black hover:bg-transparent">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Group coaching */}
          <motion.div variants={itemVariants} className="group">
            <div className="rounded-xl border border-black/10 bg-card overflow-hidden hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/80 to-blue-500/20"></div>
              
              <div className="p-7">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">Group Coaching</h3>
                      <Badge className="bg-blue-500 text-white border-none">New</Badge>
                    </div>
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
                
                <div className="space-y-3 mb-6">
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
                
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">€997</span>
                    <span className="text-muted-foreground line-through">€1,497</span>
                    <span className="text-xs text-primary font-medium ml-1">33% off</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="w-1/2 bg-black/50 text-white hover:bg-black/60 transition-all duration-300" disabled>
                      Coming Soon
                    </Button>
                    <Button variant="outline" className="w-1/2 group border-black/30 hover:border-black hover:bg-transparent" disabled>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
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

          {/* 1:1 Fit Interview */}
          <motion.div variants={itemVariants} className="group">
            <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border bg-card">
              <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 to-gray-900 flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              
              <div className="p-6 w-full md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">1:1 Fit Interview</h3>
                    <p className="text-muted-foreground text-sm">Ace your behavioral interviews</p>
                  </div>
                  <Badge className="bg-green-500 text-white border-none">New</Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Personalized fit interview preparation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Feedback on your storytelling and delivery</span>
                  </div>
                </div>
                
                <div className="flex items-end justify-between pt-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">€249</span>
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
            <TestimonialCard 
              quote="The coaching program was instrumental in helping me land my dream job at McKinsey. The personalized feedback and structured approach made all the difference."
              author="Sarah K."
              role="Associate, McKinsey & Company"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TestimonialCard 
              quote="After struggling with case interviews for months, the unlimited coaching program gave me the confidence and skills I needed. I received offers from both BCG and Bain!"
              author="Michael T."
              role="Consultant, Boston Consulting Group"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TestimonialCard 
              quote="The CV review service transformed my application. What I thought was a strong resume was completely revamped with insider knowledge that helped me get past the screening."
              author="Priya M."
              role="Business Analyst, Bain & Company"
            />
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
          <p className="text-muted-foreground">Everything you need to know about our coaching programs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
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
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
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
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
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
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
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
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
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
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
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
      
      {/* Payment Dialog */}
      {showPaymentDialog && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowPaymentDialog(false)}
          />
          
          {/* Modal Content */}
          <div className="sm:max-w-md w-full bg-black/95 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)] text-white backdrop-blur-2xl relative overflow-hidden rounded-lg p-6 z-10">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
            
            {/* Top highlight border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            {/* Close button */}
            <button 
              className="absolute right-4 top-4 text-white/70 hover:text-white"
              onClick={() => setShowPaymentDialog(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            
            {/* Header */}
            <div className="flex flex-col space-y-1.5 text-center sm:text-left relative z-10">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white tracking-tight">
                Complete Your Purchase
              </h2>
              
              <div className="mt-3 relative">
                <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/40 via-white/10 to-transparent"></div>
                <p className="font-medium text-white text-lg pl-2">{selectedProgram.title}</p>
                <p className="text-sm text-white/60 pl-2">{selectedProgram.description}</p>
                <div className="mt-3 flex items-baseline">
                  {appliedCoupon ? (
                    <>
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 pl-2">
                        €{calculateDiscountedPrice(selectedProgram.price).toFixed(2)}
                      </p>
                      <span className="text-xs line-through text-white/40 ml-2">
                        €{selectedProgram.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-green-400 ml-2">
                        {appliedCoupon.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 pl-2">
                        €{selectedProgram.price.toFixed(2)}
                      </p>
                      <span className="text-xs text-white/40 ml-2">EUR</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div className="space-y-4 py-5 relative z-10">
              {/* Coupon code section */}
              <div className="mb-4">
                <div className="text-sm font-medium text-white/80 mb-3 flex items-center">
                  <span className="w-4 h-[1px] bg-white/30 mr-2"></span>
                  Have a coupon?
                  <span className="w-4 h-[1px] bg-white/30 ml-2"></span>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="bg-black/40 border-white/10 rounded-md w-full focus:border-white/30 focus:ring-white/10 text-white placeholder:text-white/50 h-10"
                      disabled={isApplyingCoupon || !!appliedCoupon}
                    />
                    {appliedCoupon && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  {appliedCoupon ? (
                    <Button
                      variant="outline"
                      className="h-10 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                        setCouponError(null);
                      }}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="h-10 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                    >
                      {isApplyingCoupon ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Applying
                      </span>
                    ) : (
                      "Apply"
                    )}
                  </Button>
                )}
              </div>
              
              {couponError && (
                <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {couponError}
                </div>
              )}
              
              {appliedCoupon && (
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Coupon "{appliedCoupon.code}" applied successfully!
                </div>
              )}
              
              <div className="mt-2 text-xs text-white/50">
                Try coupon code "TEST" for 10% off or "NEWUSER" for 15% off
              </div>
            </div>
            
            {/* Payment methods */}
            <div className="space-y-4 mt-6">
              <div className="text-sm font-medium text-white/80 mb-3 flex items-center">
                <span className="w-4 h-[1px] bg-white/30 mr-2"></span>
                Select Payment Method
                <span className="w-4 h-[1px] bg-white/30 ml-2"></span>
              </div>
              
              <Button
                className="w-full bg-[#072654] hover:bg-[#0A3A7A] text-white group relative overflow-hidden"
                onClick={() => handlePaymentMethodSelect('razorpay')}
              >
                <div className="flex items-center justify-center gap-2">
                  <img 
                    src="https://razorpay.com/favicon.png" 
                    alt="Razorpay" 
                    className="h-5 w-5"
                  />
                  Pay with Razorpay
                </div>
              </Button>
              
              <Button
                className="w-full bg-[#635BFF] hover:bg-[#8780FF] text-white group relative overflow-hidden"
                onClick={() => handlePaymentMethodSelect('stripe')}
              >
                <div className="flex items-center justify-center gap-2">
                  <img 
                    src="https://stripe.com/img/v3/home/social.png" 
                    alt="Stripe" 
                    className="h-5 w-5"
                  />
                  Pay with Stripe
                </div>
              </Button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between border-t border-white/10 pt-4 relative z-10">
            <button 
              className="mt-3 sm:mt-0 px-4 py-2 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all rounded-md text-sm"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </button>
            
            <div className="flex items-center text-white/60 text-xs">
              <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Secure payment processing
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
