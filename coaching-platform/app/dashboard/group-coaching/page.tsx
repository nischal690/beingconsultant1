"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import "@/styles/auto-scroll-carousel.css"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black to-[#245D66]/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-start">
          <Star className="h-5 w-5 text-white" />
          <Star className="h-5 w-5 text-white" />
          <Star className="h-5 w-5 text-white" />
          <Star className="h-5 w-5 text-white" />
          <Star className="h-5 w-5 text-white" />
        </div>
        <p className="italic text-white/60">{quote}</p>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">{author.charAt(0)}</div>
          <div>
            <p className="font-medium text-white">{author}</p>
            <p className="text-xs text-white/60">{role}</p>
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

  // State for filtering (not used since we only show group programs)
  const [activeFilter, setActiveFilter] = useState<string>("group")

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
  
  // Add state for details dialog
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedProgramDetails, setSelectedProgramDetails] = useState<CoachingProgram | null>(null)

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

  // Handle view details click
  const handleViewDetails = (program: CoachingProgram) => {
    setSelectedProgramDetails(program);
    setShowDetailsDialog(true);
  };

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
            color: '#245D66' // Changed from black to teal for Razorpay theme
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

        if (couponToUse) {
          console.log(`[Payment Success] Coupon applied: ${couponToUse.code} with ${couponToUse.discount}% discount`);
        }

        if (user) {
          try {
            console.log(`[Payment Success] Starting to record transaction and coaching program for user: ${user.uid}`);
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
            const transactionResult = await createTransactionRecord(user.uid, transactionData);
            const coachingData = {
              programId: selectedProgram.id,
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
            const coachingResult = await addCoachingToUserProfile(user.uid, coachingData);
            if (coachingResult.success) {
              console.log(`[Payment Success] Coaching program added to user profile: ${coachingResult.id}`);
              toast.success("Coaching program added to your account!");
            } else {
              console.error(`[Payment Error] Failed to add coaching program:`, coachingResult.error);
              toast.error("There was an issue adding the coaching program to your account.");
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

  const filteredPrograms = getProgramsByCategory("group");
  const programsSectionRef = useRef<HTMLElement>(null);
  const scrollToPrograms = () => {
    programsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-10 pb-20 px-4 md:px-6 lg:px-8 bg-transparent text-white"> {/* Changed to transparent background */}
      {/* Hero Section - 1:1 Personalized Coaching */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <Image
            src="/herosection.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* No overlay to allow full background visibility */}
        </div>

        {/* Blur effects removed */}

        {/* Pattern overlay removed */}

        {/* Gradient lines removed */}

        <div className="relative p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 text-sm bg-black/10 backdrop-blur-md rounded-full border border-black/20 text-black font-medium">
                  Group Coaching Programs
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              >
                <span className="block text-black">Master Consulting Skill with</span>
                <span className="text-black">
                Our Elite Group Programs
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed"
              >
                Join an exclusive circle of top-tier professionals. 

Learn, collaborate, and grow with the best.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-black/10 text-black border border-black/30 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-black/20"
                  onClick={scrollToPrograms}
                >
                  <span className="relative z-10 text-black font-medium">Explore Programs</span>
                  <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 text-black" />
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-white/10 to-white/20 group-hover:from-white/20 group-hover:to-white/30 transition-colors duration-300"></span>
                   <style jsx>{`
                    .group:hover span {
                      color: black !important;
                    }
                  `}</style>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-black">2000+</span>
                  <span className="text-sm text-gray-700">TOP CONSULTING OFFERS</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-black">90%</span>
                  <span className="text-sm text-gray-700">SUCCESS RATE</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-black">55+</span>
                  <span className="text-sm text-gray-700">COUNTRIES FOOTPRINT</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col justify-center items-center w-full gap-6"
            >
              {/* First carousel - auto scrolling right to left */}
              <Carousel 
                className="w-full max-w-md"
                opts={{
                  align: "center",
                  loop: true,
                  dragFree: true,
                  containScroll: false,
                  watchDrag: false,
                }}
              >
                <CarouselContent className="auto-scroll-rtl">
                  {[
                    "https://framerusercontent.com/images/VSdkkcPxdO7ltSZCcQgzyaHzcY.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/xrJYv8fvgRqsSZBV3mPpXDYufU.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/TaafOm26QvxdeXrUNpKISNbQrZo.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/64l3Qidyw4y3D5wng0mTJwvxA.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/gDYDO50VR5mntl3uihRNYiE7Ew.jpg?scale-down-to=512",
                    // Duplicate images for infinite scroll effect
                    "https://framerusercontent.com/images/VSdkkcPxdO7ltSZCcQgzyaHzcY.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/xrJYv8fvgRqsSZBV3mPpXDYufU.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/TaafOm26QvxdeXrUNpKISNbQrZo.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/64l3Qidyw4y3D5wng0mTJwvxA.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/gDYDO50VR5mntl3uihRNYiE7Ew.jpg?scale-down-to=512"
                  ].map((src, index) => (
                    <CarouselItem key={`top-${index}`} className="md:basis-1/2 lg:basis-1/2" style={{ minWidth: '200px' }}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-xl border-2 border-black shadow-xl">
                          <div className="relative overflow-hidden" style={{ height: '200px', width: '200px' }}>
                            <Image
                              src={src}
                              alt={`Coaching image top ${index + 1}`}
                              fill
                              className="object-cover transition-all hover:scale-105 duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Second carousel - auto scrolling left to right */}
              <Carousel 
                className="w-full max-w-md"
                opts={{
                  align: "center",
                  loop: true,
                  dragFree: true,
                  containScroll: false,
                  watchDrag: false,
                }}
              >
                <CarouselContent className="auto-scroll-ltr">
                  {[
                    "https://framerusercontent.com/images/VSdkkcPxdO7ltSZCcQgzyaHzcY.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/xrJYv8fvgRqsSZBV3mPpXDYufU.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/TaafOm26QvxdeXrUNpKISNbQrZo.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/64l3Qidyw4y3D5wng0mTJwvxA.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/gDYDO50VR5mntl3uihRNYiE7Ew.jpg?scale-down-to=512",
                    // Duplicate images for infinite scroll effect
                    "https://framerusercontent.com/images/VSdkkcPxdO7ltSZCcQgzyaHzcY.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/xrJYv8fvgRqsSZBV3mPpXDYufU.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/TaafOm26QvxdeXrUNpKISNbQrZo.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/64l3Qidyw4y3D5wng0mTJwvxA.jpg?scale-down-to=512",
                    "https://framerusercontent.com/images/gDYDO50VR5mntl3uihRNYiE7Ew.jpg?scale-down-to=512"
                  ].map((src, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2" style={{ minWidth: '200px' }}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-xl border-2 border-black shadow-xl">
                          <div className="relative overflow-hidden" style={{ height: '200px', width: '200px' }}>
                            <Image
                              src={src}
                              alt={`Coaching image ${index + 1}`}
                              fill
                              className="object-cover transition-all hover:scale-105 duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* Navigation arrows removed */}
              </Carousel>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 animate-gradient-x">
            What sets us apart
          </h2>
          <div className="mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white backdrop-blur-sm border border-black/10 rounded-xl p-6 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mt-1 !text-black">Learn From a Consulting Legend</h3>
            </div>
            <p className="text-black/70 text-sm">
              Gaurav Bhosle personally leads every session, bringing his McKinsey background and global recruiting experience directly to your preparation. His unique 360° perspective combines consultant, coach, and recruiter insights that simply cannot be found elsewhere.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white backdrop-blur-sm border border-black/10 rounded-xl p-6 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mt-1 !text-black">Proven Success Across Backgrounds</h3>
            </div>
            <p className="text-black/70 text-sm">
              From opera singers to military officers to scientists—Gaurav has guided professionals from the most unconventional backgrounds to MBB offers. His methodology adapts to your unique story, transforming diverse experiences into consulting strengths.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white backdrop-blur-sm border border-black/10 rounded-xl p-6 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mt-1 !text-black">Maximum Value, Accessible Investment</h3>
            </div>
            <p className="text-black/70 text-sm">
              We've architected this program to deliver premium coaching at a fraction of typical costs. By combining expert-led group sessions with comprehensive resources and peer practice, you receive the complete consulting preparation system without the prohibitive investment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coaching Programs */}
      <section ref={programsSectionRef} className="mt-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 animate-gradient-x">
              Group Programs
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <p className="text-white/60 mt-4 max-w-xl">
              Learn with peers and save on costs
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-black/80 to-black px-3 py-1.5 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-white/80" />
                <Select
                  value={selectedCurrency}
                  onValueChange={(value) => setSelectedCurrency(value as "USD" | "EUR" | "INR")}
                >
                  <SelectTrigger className="w-[120px] h-7 bg-transparent border-0 text-white hover:text-white focus:ring-0 focus:ring-offset-0 pl-0">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <SelectItem value="USD"  className="hover:bg-black/50 focus:bg-black/50 rounded-sm my-1 cursor-pointer text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">USD</span>
                        <span className="text-white/60">($)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="EUR"  className="hover:bg-black/50 focus:bg-black/50 rounded-sm my-1 cursor-pointer text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">EUR</span>
                        <span className="text-white/60">(€)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INR"  className="hover:bg-black/50 focus:bg-black/50 rounded-sm my-1 cursor-pointer text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">INR</span>
                        <span className="text-white/60">(₹)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <span className="text-sm text-white/60 ml-2">
              {isLoading ? "Loading programs..." : `${filteredPrograms.length} programs available`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coachingPrograms
            .filter(program => program.category === "group")
            .map((program) => (
              <motion.div key={program.id} variants={itemVariants} className="group">
                <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/80 h-full text-white"> {/* bg-card replaced */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden"> {/* Changed aspect ratio for better image display */}
                    {program.title === "Break into Consulting" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FBreak%20into%20%20consulting.jpg?alt=media&token=246e545c-a7e6-424e-b43a-de3b5b727301" 
                        alt="Break into Consulting" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {program.title === "Case Cracking Mastery" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FCase%20interview.jpg?alt=media&token=90143d5c-7659-4bb8-a975-aff96b816d25" 
                        alt="Case Cracking Mastery" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {program.title === "FIT Interview Excellence" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FFIT%20Interview.jpg?alt=media&token=cc8ba7be-819b-4028-b5ba-731e82d3253a" 
                        alt="FIT Interview Excellence" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {/* Fallback to icons for programs without specific images */}
                    {!["Break into Consulting", "Case Cracking Mastery", "FIT Interview Excellence"].includes(program.title) && (
                      <div className="absolute inset-0 bg-black flex items-center justify-center">
                        {program.iconName === "briefcase" && <Briefcase className="h-8 w-8 text-[#245D66]" />}
                        {program.iconName === "clock" && <Clock className="h-8 w-8 text-[#245D66]" />}
                        {program.iconName === "fileText" && <FileText className="h-8 w-8 text-[#245D66]" />}
                        {program.iconName === "fileCheck" && <FileCheck className="h-8 w-8 text-[#245D66]" />}
                        {program.iconName === "messageSquare" && <MessageSquare className="h-8 w-8 text-[#245D66]" />}
                        {program.iconName === "zap" && <Zap className="h-8 w-8 text-[#245D66]" />}
                        {program.iconName === "award" && <Award className="h-8 w-8 text-[#245D66]" />}
                        {program.iconName === "users" && <Users className="h-8 w-8 text-[#245D66]" />}
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white">{program.title}</h3>
                        <p className="text-white/60 text-xs">{program.shortDescription.substring(0, 60)}...</p>
                      </div>
                      {program.sessionLength && (
                        <Badge className="bg-[#245D66] text-white border-none text-[10px] whitespace-nowrap">
                          {program.sessionLength}
                        </Badge>
                      )}
                      {program.cohortSize && program.category === "group" && (
                         <Badge className="bg-[#245D66] text-white border-none text-[10px] whitespace-nowrap">
                          {program.cohortSize}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1.5 mb-3 flex-grow">
                      {program.features?.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-start gap-1.5">
                          <CheckCircle className="h-3 w-3 text-[#245D66] mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-white/70">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {program.bestFor && program.category === "1on1" && (
                       <div className="mb-3 p-1.5 bg-[#245D66]/10 rounded-lg"> {/* Adjusted opacity */}
                        <p className="text-xs text-gray-300"><span className="font-medium text-white">Best For:</span> {program.bestFor.substring(0, 70)}{program.bestFor.length > 70 ? '...' : ''}</p>
                      </div>
                    )}

                    {program.timeline && program.category === "group" && (
                       <div className="mb-3 p-1.5 bg-[#245D66]/10 rounded-lg"> {/* Adjusted opacity */}
                        <p className="text-xs text-gray-300"><span className="font-medium text-white">Timeline:</span> {program.timeline}</p>
                      </div>
                    )}

                    <div className="flex items-end justify-between pt-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs group text-[#245D66] border-[#245D66] hover:bg-[#245D66]/10 rounded-full"
                        onClick={() => handleViewDetails(program)}
                      >
                        View Details
                      </Button>

                      <Button
                        size="sm"
                        className="h-8 text-xs group bg-[#245D66] text-white hover:bg-[#1A444B] rounded-full" // Darker shade for hover
                        onClick={() => window.open('https://www.beingconsultant.com/groupcoaching_waitlist', '_blank')}
                      >
                        Join Waitlist
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Program Comparison Table */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 animate-gradient-x">
            Program Comparison
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Choose the program that best fits your needs and goals
          </p>
          <div className="mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4"></div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] mx-auto">
            <div className="grid grid-cols-4 gap-0.5 bg-white/10 rounded-lg overflow-hidden border border-white/10">
              {/* Header Row */}
              <div className="bg-black p-4 font-bold text-white">
                Topic
              </div>
              <div className="bg-black p-4 font-bold text-white text-center">
                Group Intro Consulting
              </div>
              <div className="bg-black p-4 font-bold text-white text-center">
                Case Cracking Mastery
              </div>
              <div className="bg-black p-4 font-bold text-white text-center">
                FIT Interview Excellence
              </div>

              {/* Focus Row */}
              <div className="bg-black/90 p-4 font-semibold text-white"> {/* Darker shade of black */}
                Focus
              </div>
              <div className="bg-black/70 p-4 text-sm text-white"> {/* Lighter shade of black */}
                <p className="font-semibold text-[#245D66] mb-2">Complete consulting preparation system with emphasis on recruitment</p>
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Case interview techniques</li>
                  <li>FIT interview preparation</li>
                  <li>CV & cover letter optimization</li>
                  <li>Industry knowledge</li>
                  <li>Networking strategies</li>
                  <li>Post-offer guidance</li>
                </ul>
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <p className="font-semibold text-[#245D66] mb-2">Specialized case interview preparation and problem-solving methodology</p>
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Full case cycle mastery</li>
                  <li>Framework development</li>
                  <li>Quantitative analysis</li>
                  <li>Qualitative discussion</li>
                  <li>Synthesis & recommendation</li>
                  <li>Various case types</li>
                </ul>
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <p className="font-semibold text-[#245D66] mb-2">Strategic narrative development for behavioral interviews</p>
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Personal narrative development</li>
                  <li>MBB-specific FIT questions</li>
                  <li>Leadership & teamwork stories</li>
                  <li>Failure & learning narratives</li>
                  <li>Executive presence</li>
                  <li>Delivery techniques</li>
                </ul>
              </div>

              {/* Time Commitment Row */}
              <div className="bg-black/90 p-4 font-semibold text-white">
                Time Commitment
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>5 weekly sessions (10 hours)</li>
                  <li>12 hours pre-program material</li>
                  <li>Ongoing support</li>
                </ul>
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>4 weekly sessions (8 hours)</li>
                  <li>6 hours pre-program material</li>
                </ul>
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>3 weekly sessions (6 hours)</li>
                  <li>4 hours pre-program material</li>
                </ul>
              </div>

              {/* Ideal For Row */}
              <div className="bg-black/90 p-4 font-semibold text-white">
                Ideal For
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Serious candidates targeting top firms</li>
                  <li>Those needing comprehensive preparation</li>
                  <li>Candidates starting from scratch</li>
                </ul>
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Those struggling specifically with cases</li>
                  <li>Candidates with strong resumes but weak case skills</li>
                  <li>Analytical thinkers needing structure</li>
                </ul>
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Strong case performers with weaker personal narratives</li>
                  <li>Candidates with unconventional backgrounds</li>
                  <li>Those with upcoming final rounds</li>
                </ul>
              </div>

              {/* Expected Outcomes Row */}
              <div className="bg-black/90 p-4 font-semibold text-white">
                Expected Outcomes
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Complete interview readiness</li>
                  <li>Structured approach for interview types</li>
                  <li>Optimized application materials</li>
                  <li>Strategic career planning</li>
                </ul>
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Confident case handling</li>
                  <li>Clear structured thinking</li>
                  <li>Improved quantitative skills</li>
                  <li>Compelling recommendation delivery</li>
                </ul>
              </div>
              <div className="bg-black/70 p-4 text-sm text-white">
                <ul className="space-y-1 text-white/70 list-disc pl-5">
                  <li>Authentic, compelling personal stories</li>
                  <li>Confident delivery</li>
                  <li>Clear distinction between experience and consulting fit</li>
                  <li>Partner-level communication</li>
                </ul>
              </div>

              {/* Investment Row removed as requested */}
            </div>
          </div>
        </div>

        {/* Apply button removed */}
      </section>

      
      

      {/* Customer Reviews section removed */}

      {/* FAQ Section */}
      <section className="mt-16 relative">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#245D66]/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#245D66]/10 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-[#245D66]/20 text-[#245D66] hover:bg-[#245D66]/30 border-none">
              Common Questions
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to know about our group coaching program to help you make an informed decision</p>
          </div>

          <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border-b border-white/10 pb-4">
                <AccordionTrigger className="flex items-center gap-3 text-white hover:no-underline hover:text-[#245D66]">
                  <div className="bg-[#245D66]/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-medium">How does group coaching compare to one-on-one coaching?</span>
                </AccordionTrigger>
                <AccordionContent className="pl-14 pr-4 mt-2">
                  <p className="text-gray-300 leading-relaxed">
                    Group coaching offers three distinct advantages:
                    <ul className="mt-2 space-y-2 list-disc pl-5">
                      <li>Peer learning from diverse perspectives and approaches</li>
                      <li>Practice opportunities with candidates at similar levels</li>
                      <li>Greater value through shared resources</li>
                    </ul>
                    <p className="mt-2">Our small cohort size (4-6) ensures you still receive personalized attention.</p>
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-white/10 pb-4">
                <AccordionTrigger className="flex items-center gap-3 text-white hover:no-underline hover:text-[#245D66]">
                  <div className="bg-[#245D66]/10 p-2 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-[#245D66]" />
                  </div>
                  <span className="text-lg font-medium">What if I'm not comfortable speaking in a group setting?</span>
                </AccordionTrigger>
                <AccordionContent className="pl-14 pr-4 mt-2">
                  <p className="text-gray-300 leading-relaxed">
                    Our coaches create a supportive environment where everyone participates. Many initially hesitant participants 
                    find the group format actually builds their confidence more effectively than one-on-one sessions.
                    <p className="mt-2">For those who strongly prefer private coaching, we offer the Break into Consulting program in a one-on-one format.</p>
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-white/10 pb-4">
                <AccordionTrigger className="flex items-center gap-3 text-white hover:no-underline hover:text-[#245D66]">
                  <div className="bg-[#245D66]/10 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-medium">What happens if I miss a session?</span>
                </AccordionTrigger>
                <AccordionContent className="pl-14 pr-4 mt-2">
                  <p className="text-gray-300 leading-relaxed">
                    All sessions are recorded and available for replay, so you'll never miss important content. However, we 
                    encourage live attendance to maximize the interactive benefits.
                    <p className="mt-2">If you know you'll miss a session, you can submit questions in advance to be addressed during the live session.</p>
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-white/10 pb-4">
                <AccordionTrigger className="flex items-center gap-3 text-white hover:no-underline hover:text-[#245D66]">
                  <div className="bg-[#245D66]/10 p-2 rounded-lg">
                    <FileCheck className="h-5 w-5 text-[#245D66]" />
                  </div>
                  <span className="text-lg font-medium">How much time should I expect to spend outside of sessions?</span>
                </AccordionTrigger>
                <AccordionContent className="pl-14 pr-4 mt-2">
                  <p className="text-gray-300 leading-relaxed">
                    Plan for 4-6 hours per week outside of live sessions for optimal results. This includes:
                    <ul className="mt-2 space-y-2 list-disc pl-5">
                      <li>Case practice with peers</li>
                      <li>Video submissions for feedback</li>
                      <li>Peer review and feedback</li>
                      <li>Self-study materials</li>
                    </ul>
                    <p className="mt-2">The more you put in, the more you'll get out of the program. Our most successful participants treat the program like a part-time job.</p>
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>


        </div>
      </section>

      {/* CTA Section (Light Theme Block) */}
      {/* White section with Browse All Programs and Schedule a Call buttons removed as requested */}


      {/* Contact Support Section */}
      <section className="mt-8 mb-12 text-center">
        <p className="text-muted-foreground mb-4">Still have questions? We're here to help!</p>
        <Button variant="outline" className="flex items-center gap-2 mx-auto" onClick={() => window.location.href = 'mailto:bcplus@beingconsultant.com'}>
          Contact Support
          <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      <PaymentModal
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        selectedItem={selectedProgram!}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        currencySymbol={currencySymbols[selectedCurrency]}
        onCouponApplied={(coupon) => {
          setAppliedCoupon(coupon);
          console.log(`[Coupon] ${coupon ? 'Applied coupon: ' + coupon.code + ' with discount: ' + coupon.discount + '%' : 'Coupon removed'}`);
        }}
      />

      {/* Program Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-black border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {selectedProgramDetails?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Program Image */}
            {selectedProgramDetails?.title === "Case Cracking Mastery" && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image 
                  src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FCase%20interview.jpg?alt=media&token=90143d5c-7659-4bb8-a975-aff96b816d25" 
                  alt={selectedProgramDetails.title} 
                  fill 
                  className="object-cover" 
                />
              </div>
            )}
            
            {/* Program Details */}
            <div className="space-y-4">
              {/* Cohort Size */}
              {selectedProgramDetails?.cohortSize && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-sm font-medium text-white">Cohort Size</p>
                    <p className="text-sm text-white/70">{selectedProgramDetails.cohortSize}</p>
                  </div>
                </div>
              )}
              
              {/* Timeline */}
              {selectedProgramDetails?.timeline && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-sm font-medium text-white">Timeline</p>
                    <p className="text-sm text-white/70">{selectedProgramDetails.timeline}</p>
                  </div>
                </div>
              )}
              
              {/* Full Description */}
              <div className="mt-4">
                <h3 className="text-lg font-medium text-white mb-2">Details</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {selectedProgramDetails?.description}
                </p>
              </div>
              
              {/* Features */}
              {selectedProgramDetails?.features && selectedProgramDetails.features.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-white mb-2">What You'll Learn</h3>
                  <ul className="space-y-2">
                    {selectedProgramDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-white mt-0.5" />
                        <span className="text-sm text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              className="bg-primary text-white hover:bg-primary/80 w-full"
              onClick={() => setShowDetailsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}