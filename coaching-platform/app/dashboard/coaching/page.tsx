"use client"

import React, { useState, useEffect, useRef } from "react"
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
  Check,
  Globe
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { processRazorpayPayment } from "@/lib/payment/razorpay"
import { processStripePayment } from "@/lib/payment/stripe"
import { useAuth } from "@/lib/firebase/auth-context";
import { PaymentModal, PaymentItem } from "@/components/payment/payment-modal"
import { getProductsByCategory, addCoachingToUserProfile, createTransactionRecord } from "@/lib/firebase/firestore"
import { CoachingProgram, coachingPrograms, getProgramsByCategory } from "@/data/coaching-programs"

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

  // Add state for coaching programs - removing Firebase data and using only static data
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add state for payment dialog
  const [selectedProgram, setSelectedProgram] = useState<PaymentItem | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  
  // Currency switcher state
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "EUR" | "INR">("USD")
  
  // Currency conversion rates (approximate values)
  const conversionRates = {
    USD: 1,
    EUR: 0.92, // 1 USD = 0.92 EUR
    INR: 83.5  // 1 USD = 83.5 INR
  }
  
  // Currency symbols
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    INR: "₹"
  }

  // Sample coupon data
  const availableCoupons = [
    { code: "TEST", discount: 10 },
    { code: "NEWUSER", discount: 15 },
    { code: "SPRING25", discount: 25 }
  ]

  // Handle buy now click
  const handleBuyNow = (program: CoachingProgram) => {
    // Convert prices to numbers
    const priceConverted = convertPrice(program.price);
    const originalPriceConverted = program.originalPrice 
      ? convertPrice(program.originalPrice) 
      : undefined;
      
    setSelectedProgram({
      id: program.id,
      title: program.title,
      description: program.description,
      shortDescription: program.shortDescription || "",
      price: priceConverted,
      originalPrice: originalPriceConverted,
      uniqueId: program.id // Use the program ID as the uniqueId
    });
    setAppliedCoupon(null); // Reset applied coupon when selecting a new program
    setShowPaymentDialog(true);
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number, coupon: { code: string; discount: number } | null = null) => {
    const discountToApply = coupon || appliedCoupon;
    if (!discountToApply) return price;
    return price - (price * discountToApply.discount / 100);
  }
  
  // Convert price to selected currency
  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * conversionRates[selectedCurrency];
  }
  
  // Format price with currency symbol
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "";
    return `${currencySymbols[selectedCurrency]}${price.toFixed(2)}`;
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
  const handlePaymentMethodSelect = async (method: 'razorpay' | 'stripe', coupon: { code: string; discount: number } | null = null) => {
    if (!selectedProgram) return;
    
    try {
      console.log(`[Payment Start] Processing ${method} payment for program: ${selectedProgram.title}`);
      
      // Use the coupon passed from the payment modal or the one in state
      const couponToUse = coupon || appliedCoupon;
      
      // Calculate the final price with the coupon discount
      const finalPrice = calculateDiscountedPrice(selectedProgram.price, couponToUse);
      const amountInSmallestUnit = Math.round(finalPrice * 100);
      
      console.log(`[Payment] Original price: ${selectedProgram.price}, Final price after discount: ${finalPrice}`);
      
      // Generate a unique ID for the transaction
      const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Prepare metadata for the transaction
      const metadata: Record<string, string> = {
        userId: user?.uid || '',
        userEmail: user?.email || '',
        programId: selectedProgram.id,
        programName: selectedProgram.title,
        couponCode: couponToUse?.code || '',
        couponDiscount: couponToUse?.discount?.toString() || '0',
        originalPrice: (selectedProgram.originalPrice || selectedProgram.price).toString(),
        finalPrice: finalPrice.toString(),
        currency: selectedCurrency,
        timestamp: new Date().toISOString()
      }
      
      let paymentResult;
      
      if (method === 'razorpay') {
        console.log(`[Payment Processing] Initiating Razorpay payment for amount: ${finalPrice} ${selectedCurrency}`);
        paymentResult = await processRazorpayPayment({
          amount: amountInSmallestUnit,
          currency: selectedCurrency,
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
        console.log(`[Payment Processing] Initiating Stripe payment for amount: ${finalPrice} ${selectedCurrency}`);
        paymentResult = await processStripePayment({
          amount: amountInSmallestUnit,
          currency: selectedCurrency.toLowerCase(),
          productName: selectedProgram.title,
          productDescription: selectedProgram.description,
          customerEmail: user?.email || '',
          metadata
        });
      }
      
      console.log(`[Payment Result] Payment result received: ${JSON.stringify(paymentResult)}`);
      
      if (paymentResult.success) {
        console.log(`[Payment Success] Payment successful with transaction ID: ${paymentResult.id || transactionId}`);
        
        // If payment is successful and there was a coupon applied
        if (couponToUse) {
          console.log(`[Payment Success] Coupon applied: ${couponToUse.code} with ${couponToUse.discount}% discount`);
          // Coupon usage is now incremented in the payment modal
        }
        
        if (user) {
          try {
            console.log(`[Payment Success] Starting to record transaction and coaching program for user: ${user.uid}`);
            
            // First, check if this coaching program already exists in the user's profile
            // const programExists = await checkCoachingProgramExists(user.uid, selectedProgram.id);
            
            // if (programExists) {
            //   console.log(`[Payment] Coaching program already exists for user: ${user.uid}, program: ${selectedProgram.id}. Skipping creation.`);
            //   toast.info("This coaching program is already in your account.");
            //   return;
            // }
            
            // Create transaction record
            const transactionData = {
              transactionId: paymentResult.id || transactionId,
              amount: finalPrice,
              currency: selectedCurrency,
              status: "successful" as "successful" | "failed",
              paymentMethod: method,
              productId: selectedProgram.id,
              productTitle: selectedProgram.title,
              couponCode: couponToUse?.code || undefined,
              couponDiscount: couponToUse?.discount || undefined,
              couponDiscountType: "percentage" as const,
              metadata: metadata
            };
            
            console.log(`[Payment Debug] Creating transaction record with data:`, JSON.stringify(transactionData, null, 2));
            const transactionResult = await createTransactionRecord(user.uid, transactionData);
            
            console.log(`[Payment Debug] Transaction record created:`, JSON.stringify(transactionResult, null, 2));
            
            // Add coaching program to user's profile (coaching subcollection only)
            console.log(`[Payment Debug] Creating coaching record for program: ${selectedProgram.id} - ${selectedProgram.title}`);
            console.log(`[Payment Debug] User ID:`, user.uid);
            
            const coachingData = {
              programId: selectedProgram.id, // Use the actual program ID from coaching-programs.ts
              programName: selectedProgram.title,
              amountPaid: finalPrice,
              currency: selectedCurrency,
              transactionId: paymentResult.id || transactionId,
              paymentMethod: method,
              metadata: {
                originalPrice: selectedProgram.originalPrice,
                discount: couponToUse?.discount || 0,
                couponCode: couponToUse?.code || "",
                purchaseDate: new Date().toISOString(),
                enrollmentDate: new Date().toISOString()
              }
            };
            
            console.log(`[Payment Debug] Coaching data prepared:`, JSON.stringify(coachingData, null, 2));
            
            try {
              const coachingResult = await addCoachingToUserProfile(user.uid, coachingData);
              
              console.log(`[Payment Debug] Coaching result:`, JSON.stringify(coachingResult, null, 2));
              
              if (coachingResult.success) {
                console.log(`[Payment Success] Coaching program added to user profile: ${coachingResult.id}`);
                toast.success("Coaching program added to your account!");
              } else {
                console.error(`[Payment Error] Failed to add coaching program:`, coachingResult.error);
                toast.error("There was an issue adding the coaching program to your account.");
              }
            } catch (error) {
              console.error("[Payment Error] Error adding coaching program:", error);
              toast.error("There was an error adding the coaching program to your account.");
            }
          } catch (error) {
            console.error("[Payment Error] Error recording transaction or coaching program:", error);
          }
        } else {
          console.warn("[Payment Warning] User not authenticated, skipping transaction and coaching record creation");
        }
        
        toast.success(`Payment successful! Transaction ID: ${paymentResult.id || transactionId}`);
        setShowPaymentDialog(false);
        setCouponCode("");
        setAppliedCoupon(null);
        setCouponError(null);
      } else {
        console.error(`[Payment Error] Payment failed: ${paymentResult.error?.message || 'Unknown error'}`);
        toast.error(`Payment failed: ${paymentResult.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`[Payment Error] Error processing ${method} payment:`, error);
      toast.error(`Error processing payment. Please try again.`);
    }
  }

  // Get filtered programs based on the active filter
  const filteredPrograms = getProgramsByCategory(activeFilter);

  // Add state for section reference
  const programsSectionRef = useRef<HTMLElement>(null);

  // Function to scroll to programs section
  const scrollToPrograms = () => {
    programsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-10 pb-20 px-4 md:px-6 lg:px-8">
      {/* Hero Section - Our Coaching Advantage */}
      <section className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100 mb-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#245D66]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#245D66]/5 rounded-full blur-3xl"></div>
        
        {/* Content container */}
        <div className="relative p-10 md:p-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-12 text-gray-900"
          >
            Our Coaching <span className="text-[#245D66]">Advantage</span>
          </motion.h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Venn Diagram */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative w-full max-w-md mx-auto h-[320px]">
                {/* 360° Coaching Perspective Circle */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute top-0 left-0 w-[200px] h-[200px] rounded-full bg-[#8BA89B]/80 flex items-center justify-center text-center p-4 shadow-lg backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-white font-semibold text-sm">
                    <div className="uppercase tracking-wider">360° COACHING</div>
                    <div className="uppercase tracking-wider">PERSPECTIVE</div>
                  </div>
                </motion.div>
                
                {/* Both Sides of the Table Circle */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[#C49799]/80 flex items-center justify-center text-center p-4 shadow-lg backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-white font-semibold text-sm">
                    <div className="uppercase tracking-wider">BOTH SIDES</div>
                    <div className="uppercase tracking-wider">OF THE TABLE</div>
                  </div>
                </motion.div>
                
                {/* Global Excellence Standard Circle */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute bottom-0 left-[50%] transform -translate-x-1/2 w-[200px] h-[200px] rounded-full bg-[#D0C99B]/80 flex items-center justify-center text-center p-4 shadow-lg backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-white font-semibold text-sm">
                    <div className="uppercase tracking-wider">GLOBAL EXCELLENCE</div>
                    <div className="uppercase tracking-wider">STANDARD</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Right side - Descriptions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8 order-1 lg:order-2"
            >
              {/* 360° Coaching Perspective */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-white to-[#8BA89B]/10 border border-[#8BA89B]/20 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-[#8BA89B] text-white px-4 py-1.5 rounded-full inline-block font-medium text-sm shadow-sm">
                  360° Coaching Perspective
                </div>
                <p className="text-gray-700">
                  Unlike coaches who replicate their singular path, I identify and amplify your unique strengths. As
                  a certified career coach with McKinsey experience, I architect personalized strategies that
                  showcase your authentic value to firms.
                </p>
              </motion.div>
              
              {/* Both Sides of the Table */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-white to-[#C49799]/10 border border-[#C49799]/20 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-[#C49799] text-white px-4 py-1.5 rounded-full inline-block font-medium text-sm shadow-sm">
                  Both Sides of the Table
                </div>
                <p className="text-gray-700">
                  My active role in consulting recruitment provides rare insight into what firms truly seek beyond
                  standard frameworks. This dual perspective ensures your preparation aligns precisely with
                  current evaluation practices and market demands.
                </p>
              </motion.div>
              
              {/* Global Excellence Standard */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-white to-[#D0C99B]/10 border border-[#D0C99B]/20 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-[#D0C99B] text-white px-4 py-1.5 rounded-full inline-block font-medium text-sm shadow-sm">
                  Global Excellence Standard
                </div>
                <p className="text-gray-700">
                  Having worked across 25+ countries and coached professionals from 55+ nations, I bring a truly
                  global perspective to your preparation. This international insight translates into versatile
                  approaches that succeed across diverse consulting environments.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="pt-4"
              >
                <Button 
                  size="lg" 
                  className="bg-[#245D66] text-white hover:bg-[#1A444B] transition-all duration-300 group hover:-translate-y-[2px] shadow-lg hover:shadow-[#245D66]/20 rounded-full px-8"
                  onClick={scrollToPrograms}
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coaching Programs */}
      <section ref={programsSectionRef} className="mt-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">
              {activeFilter === "group" ? "Group Programs" : "One on One Programs"}
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <p className="text-gray-400 mt-4 max-w-xl">
              {activeFilter === "group" 
                ? "Learn with peers and save on costs" 
                : "Focused coaching for specific needs"}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 px-3 py-1.5 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-white/80" />
                <Select
                  value={selectedCurrency}
                  onValueChange={(value) => setSelectedCurrency(value as "USD" | "EUR" | "INR")}
                >
                  <SelectTrigger className="w-[120px] h-7 bg-transparent border-0 text-white hover:text-white focus:ring-0 focus:ring-offset-0 pl-0">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border border-white/20 text-white backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <SelectItem value="USD" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">USD</span>
                        <span className="text-white/70">($)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="EUR" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">EUR</span>
                        <span className="text-white/70">(€)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INR" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">INR</span>
                        <span className="text-white/70">(₹)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={activeFilter === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveFilter("all")}
                className="rounded-full"
              >
                All Programs
              </Button>
              <Button 
                variant={activeFilter === "1on1" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveFilter("1on1")}
                className="rounded-full"
              >
                One-on-One
              </Button>
              <Button 
                variant={activeFilter === "group" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveFilter("group")}
                className="rounded-full"
              >
                Group Programs
              </Button>
            </div>
            <span className="text-sm text-gray-400 ml-2">
              {isLoading ? "Loading programs..." : `${filteredPrograms.length} programs available`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coachingPrograms
            .filter(program => activeFilter === "group" ? program.category === "group" : program.category === "1on1")
            .filter(program => activeFilter === "all" || program.category === activeFilter)
            .map((program) => (
              <motion.div key={program.id} variants={itemVariants} className="group">
                <div className="flex flex-col overflow-hidden rounded-xl border bg-card h-full">
                  <div className="relative w-full aspect-[3/1] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 to-gray-900 flex items-center justify-center">
                    {program.iconName === "briefcase" && <Briefcase className="h-8 w-8 text-primary" />}
                    {program.iconName === "clock" && <Clock className="h-8 w-8 text-primary" />}
                    {program.iconName === "fileText" && <FileText className="h-8 w-8 text-primary" />}
                    {program.iconName === "fileCheck" && <FileCheck className="h-8 w-8 text-primary" />}
                    {program.iconName === "messageSquare" && <MessageSquare className="h-8 w-8 text-primary" />}
                    {program.iconName === "zap" && <Zap className="h-8 w-8 text-primary" />}
                    {program.iconName === "award" && <Award className="h-8 w-8 text-primary" />}
                    {program.iconName === "users" && <Users className="h-8 w-8 text-primary" />}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold">{program.title}</h3>
                        <p className="text-muted-foreground text-xs">{program.shortDescription.substring(0, 60)}...</p>
                      </div>
                      {program.sessionLength && (
                        <Badge className="bg-blue-500 text-white border-none text-xs">
                          {program.sessionLength}
                        </Badge>
                      )}
                      {program.cohortSize && program.category === "group" && (
                        <Badge className="bg-blue-500 text-white border-none text-xs">
                          {program.cohortSize}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 mb-3 flex-grow">
                      {program.features?.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-start gap-1.5">
                          <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {program.bestFor && program.category === "1on1" && (
                      <div className="mb-3 p-1.5 bg-primary/5 rounded-lg">
                        <p className="text-xs"><span className="font-medium">Best For:</span> {program.bestFor.substring(0, 70)}{program.bestFor.length > 70 ? '...' : ''}</p>
                      </div>
                    )}
                    
                    {program.timeline && program.category === "group" && (
                      <div className="mb-3 p-1.5 bg-primary/5 rounded-lg">
                        <p className="text-xs"><span className="font-medium">Timeline:</span> {program.timeline}</p>
                      </div>
                    )}
                    
                    <div className="flex items-end justify-between pt-2 mt-auto">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold">{formatPrice(program.price || 0)}</span>
                          {program.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(program.originalPrice)}
                            </span>
                          )}
                          {program.privateOption && program.category === "group" && (
                            <span className="text-xs text-muted-foreground ml-1">
                              / {formatPrice(program.privatePrice || 0)} (private)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {program.category === "1on1" ? (
                        <Button 
                          size="sm"
                          className="h-8 text-xs group bg-black text-white hover:bg-white hover:text-black border border-black/20 hover:border-white shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden z-20"
                          onClick={() => handleBuyNow(program)}
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                          <span className="relative z-10 flex items-center gap-1">
                            Buy Now
                          </span>
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          className="h-8 text-xs group bg-primary text-white hover:bg-primary/90 rounded-full"
                        >
                          Join Waitlist
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Group Programs Section */}
      {activeFilter !== "1on1" && (
        <section className="mt-16">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Group Programs</h2>
              <p className="text-muted-foreground">Learn with peers and save on costs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coachingPrograms
              .filter(program => program.category === "group")
              .map((program) => (
                <motion.div key={program.id} variants={itemVariants} className="group">
                  <div className="overflow-hidden rounded-xl border bg-card h-full flex flex-col">
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex flex-col justify-between items-start gap-2 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-full">
                              <Users className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold">{program.title}</h3>
                          </div>
                          <p className="text-muted-foreground text-xs">{program.shortDescription.substring(0, 60)}...</p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2 w-full">
                          {program.cohortSize && (
                            <Badge variant="outline" className="bg-primary/5 text-xs">
                              {program.cohortSize}
                            </Badge>
                          )}
                          {program.timeline && (
                            <Badge variant="outline" className="bg-primary/5 text-xs">
                              {program.timeline}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t border-b py-3 my-2 flex-grow">
                        <div className="grid grid-cols-1 gap-1.5">
                          {program.features?.slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-start gap-1.5">
                              <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-xs">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 mt-auto pt-3">
                        <div>
                          <p className="text-xs font-medium mb-1">Investment:</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold">{formatPrice(program.price)}</span>
                            {program.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(program.originalPrice)}
                              </span>
                            )}
                            {program.privateOption && (
                              <span className="text-xs text-muted-foreground ml-1">
                                / {formatPrice(program.privatePrice)} (private)
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" className="rounded-full text-xs py-1 h-8 flex-1">
                            View Details
                          </Button>
                          <Button 
                            className="rounded-full bg-primary hover:bg-primary/90 text-xs py-1 h-8 flex-1"
                          >
                            Join Waitlist
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>
      )}

      {/* AI Coach Section - Modern Black and White Aesthetic */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">
                Your Personal AI Coach to Ace Case Interviews
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl">
              Select your Practice Mode
            </p>
            <p className="text-sm text-gray-500">
              Choose a mode that fits your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Practice Realistic Mock Case Interview with AI */}
            <motion.div
              whileHover={{ 
                y: -5, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 } 
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-[#245D66]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-grid-[#245D66]/5 [mask-image:linear-gradient(0deg,transparent,rgba(36,93,102,0.05),transparent)]"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0vjZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNmgtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 rounded-3xl"></div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              
              <div className="relative p-8 backdrop-blur-sm rounded-3xl h-full flex flex-col">
                <div className="text-2xl font-bold mb-6 text-white">Practice Realistic Mock Case Interview with AI</div>
                
                <div className="flex-1 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-1">
                      <Image 
                        src="/ai-coach-portrait.jpg" 
                        alt="AI Coach Portrait" 
                        width={200} 
                        height={250}
                        className="rounded-xl object-cover w-full h-auto shadow-lg"
                      />
                    </div>
                    <div className="col-span-1">
                      <Image 
                        src="/ai-coach-charts.jpg" 
                        alt="AI Coach Charts" 
                        width={200} 
                        height={250}
                        className="rounded-xl object-cover w-full h-auto shadow-lg"
                      />
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Engage in realistic, low-latency voice interaction with slide sharing and on-demand case test introduction - perfect for real interview simulation.
                  </p>
                  
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-white" />
                      Engage in realistic, low-latency voice interaction with slide sharing and on-demand case test introduction
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-white" />
                      Get personalized Gap Analysis scorecards for every practice
                    </li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-black hover:bg-gray-900 text-white border border-white/10 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-white/5 relative overflow-hidden"
                  onClick={() => window.open('https://app.consultify-ai.com/', '_self')}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                  <span className="relative z-10 flex items-center gap-1">
                    Start Practice
                  </span>
                </Button>
              </div>
            </motion.div>

            {/* Guided Case Interview Coaching with AI */}
            <motion.div
              whileHover={{ 
                y: -5, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 } 
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-[#245D66]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-grid-[#245D66]/5 [mask-image:linear-gradient(0deg,transparent,rgba(36,93,102,0.05),transparent)]"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0vjZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNmgtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 rounded-3xl"></div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              
              <div className="relative p-8 backdrop-blur-sm rounded-3xl h-full flex flex-col">
                <div className="text-2xl font-bold mb-6 text-white">Guided Case Interview Coaching with AI</div>
                
                <div className="flex-1 mb-6">
                  <div className="mb-6">
                    <Image 
                      src="/ai-coach-laptop.jpg" 
                      alt="AI Coach Laptop" 
                      width={400} 
                      height={250}
                      className="rounded-xl object-cover w-full h-auto shadow-lg"
                    />
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Receive feedback after each interaction - perfect for candidates familiarizing themselves with the case interview format.
                  </p>
                  
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-white" />
                      Sharpen your response with guided answers, focusing on structuring thought process, and error analysis
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-white" />
                      For each stage of case interview, see the ideal response and identify any missing elements
                    </li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-black hover:bg-gray-900 text-white border border-white/10 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-white/5 relative overflow-hidden"
                >
                  <span className="relative z-10">Start Practice</span>
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-white/5 to-white/20 transition-all duration-300 group-hover:w-full"></span>
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              className="rounded-full border-white/10 text-white hover:bg-white/5 hover:text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start with a Free 15 minute session
            </Button>
            <p className="mt-4 text-sm text-gray-500 italic">
              "The Most Realistic AI Voice Case Interview Simulator, Offering Expert-Level Rehearsals"
            </p>
            <div className="mt-2 flex items-center justify-center">
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-800">
                Created by Experienced Management Consultants and AI Experts for Optimal Results
              </Badge>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Mock Case Interview Simulator: Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Structured Key Points</h4>
                  <p className="text-sm text-gray-400">Sequential key factor recall of key case facts, solutions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Tailored for Case Interviews</h4>
                  <p className="text-sm text-gray-400">Time-segmented speech recognition</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Long Conversations with Slide Sharing</h4>
                  <p className="text-sm text-gray-400">Don't end up speaking to yourself</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Customizable Interviewer Persona</h4>
                  <p className="text-sm text-gray-400">Control Guidance levels</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
              <Star className="h-5 w-5 text-yellow-500" />
              <Star className="h-5 w-5 text-yellow-500" />
              <Star className="h-5 w-5 text-yellow-500" />
              <Star className="h-5 w-5 text-yellow-500" />
              <Star className="h-5 w-5 text-yellow-500" />
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
          <div className="absolute inset-0 bg-gradient-to-r from-white to-[#E5EFF1]"></div>
          <div className="absolute inset-0 bg-grid-[#245D66]/5 [mask-image:linear-gradient(0deg,transparent,rgba(36,93,102,0.05),transparent)]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E5EFF1] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E5EFF1] rounded-full blur-3xl"></div>
          
          <div className="relative p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Badge className="bg-[#245D66] hover:bg-[#1A444B] text-white border-none">
                  Limited Time Offer
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#245D66] to-[#1A444B] animate-gradient-x">
                    Ready to Transform Your Career?
                  </span>
                </h2>
                <p className="text-gray-700">
                  Choose the program that fits your needs and take the first step toward your dream consulting career. Special pricing available for a limited time.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button size="lg" className="bg-[#245D66] text-white hover:bg-[#1A444B] transition-all duration-300 group hover:-translate-y-[2px] shadow-lg hover:shadow-[#245D66]/10">
                    Browse All Programs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-[#245D66]/70 text-[#245D66] hover:bg-[#245D66]/5 transition-all duration-300">
                    Schedule a Call
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 bg-[#245D66]/5 backdrop-blur-sm p-6 rounded-xl border border-[#245D66]/10 shadow-lg hover:shadow-[#245D66]/10 transition-all duration-300">
                <div className="text-xl font-bold" style={{color: 'rgb(36, 93, 102)'}}><span style={{opacity: 0.9}}>Why Choose Our Coaching?</span></div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-[#245D66]/90">Expert coaches from top consulting firms</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-[#245D66]/90">Proven track record with 1250+ placements</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-[#245D66]/90">Personalized approach for your unique needs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-[#245D66]/90">Flexible programs to fit your schedule</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-[#245D66]/90">Money-back guarantee if not satisfied</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional sections can be added here */}
      
      {/* Payment Dialog */}
      <PaymentModal 
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        selectedItem={selectedProgram!}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        currencySymbol={currencySymbols[selectedCurrency]}
        currencyCode={selectedCurrency}
        onCouponApplied={(coupon) => {
          setAppliedCoupon(coupon);
          console.log(`[Coupon] ${coupon ? 'Applied coupon: ' + coupon.code + ' with discount: ' + coupon.discount + '%' : 'Coupon removed'}`);
        }}
      />
    </div>
  );
}