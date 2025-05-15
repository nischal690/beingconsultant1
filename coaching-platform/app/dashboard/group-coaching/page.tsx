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
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black to-[#245D66]/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-start">
          <Star className="h-5 w-5 text-white" />
          <Star className="h-5 w-5 text-white" />
          <Star className="h-5 w-5 text-white" />
          <Star className="h-5 w-5 text-white" />
          <Star className="h-5 w-5 text-white" />
        </div>
        <p className="italic text-gray-400">{quote}</p>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-[#245D66]/20 flex items-center justify-center text-[#245D66] font-medium">{author.charAt(0)}</div>
          <div>
            <p className="font-medium text-white">{author}</p>
            <p className="text-xs text-gray-400">{role}</p>
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
            className="object-cover opacity-50" // Added opacity for better text contrast
            priority
          />
           <div className="absolute inset-0 bg-transparent"></div> {/* Removed dark overlay for transparency */}
        </div>

        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#245D66]/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-white/5 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0vjZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNmgtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="relative p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 text-sm bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white">
                  Group Coaching Programs
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
              >
                <span className="block text-white">Transform Your Career</span>
                <span className="text-white">
                  With Expert Coaching
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed"
              >
                Learn and grow alongside peers in our dynamic group coaching programs.
                Benefit from collaborative learning, shared experiences, and cost-effective
                training designed specifically for consulting careers. Our expert-led group
                sessions provide the perfect balance of personalized attention and peer
                interaction to help you achieve your professional goals.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-white/10 text-white border border-white/20 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-white/20"
                  onClick={scrollToPrograms}
                >
                  <span className="relative z-10 text-white">Explore Programs</span>
                  <ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 text-white" />
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-white/10 to-white/20 group-hover:from-white/20 group-hover:to-white/30 transition-colors duration-300"></span>
                   <style jsx>{`
                    .group:hover span {
                      color: white !important;
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
                  <span className="text-2xl font-bold text-white">1250+</span>
                  <span className="text-sm text-gray-300">Successful Placements</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">98%</span>
                  <span className="text-sm text-gray-300">Success Rate</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">4.9/5</span>
                  <span className="text-sm text-gray-300">Client Rating</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center items-center"
            >
              <div className="relative">
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.div
                    className="relative"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-32 h-40 rounded-full overflow-hidden border-2 border-white/10 bg-transparent shadow-xl backdrop-blur-sm" style={{ borderRadius: '40% 40% 40% 40% / 60% 60% 40% 40%' }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-[#245D66]/20 to-white/5 mix-blend-overlay"></div>
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
                    <div className="w-32 h-40 rounded-full overflow-hidden border-2 border-white/10 bg-black/20 shadow-xl backdrop-blur-sm" style={{ borderRadius: '40% 40% 40% 40% / 60% 60% 40% 40%' }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-[#245D66]/20 to-white/5 mix-blend-overlay"></div>
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
                    <div className="w-32 h-40 rounded-full overflow-hidden border-2 border-white/10 bg-black/20 shadow-xl backdrop-blur-sm" style={{ borderRadius: '40% 40% 40% 40% / 60% 60% 40% 40%' }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-[#245D66]/20 to-white/5 mix-blend-overlay"></div>
                      <Image
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200&h=250&fit=crop"
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

      {/* What Sets Us Apart Section */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">
            What sets us apart
          </h2>
          <div className="mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-black p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mt-1 text-white">Learn From a Consulting Legend</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Gaurav Bhosle personally leads every session, bringing his McKinsey background and global recruiting experience directly to your preparation. His unique 360° perspective combines consultant, coach, and recruiter insights that simply cannot be found elsewhere.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-900 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-black p-3 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mt-1 text-white">Proven Success Across Backgrounds</h3>
            </div>
            <p className="text-gray-400 text-sm">
              From opera singers to military officers to scientists—Gaurav has guided professionals from the most unconventional backgrounds to MBB offers. His methodology adapts to your unique story, transforming diverse experiences into consulting strengths.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-black p-3 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mt-1 text-white">Maximum Value, Accessible Investment</h3>
            </div>
            <p className="text-gray-400 text-sm">
              We've architected this program to deliver premium coaching at a fraction of typical costs. By combining expert-led group sessions with comprehensive resources and peer practice, you receive the complete consulting preparation system without the prohibitive investment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coaching Programs */}
      <section ref={programsSectionRef} className="mt-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">
              Group Programs
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <p className="text-gray-400 mt-4 max-w-xl">
              Learn with peers and save on costs
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 px-3 py-1.5 rounded-full border border-gray-700 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-white/80" />
                <Select
                  value={selectedCurrency}
                  onValueChange={(value) => setSelectedCurrency(value as "USD" | "EUR" | "INR")}
                >
                  <SelectTrigger className="w-[120px] h-7 bg-transparent border-0 text-white hover:text-white focus:ring-0 focus:ring-offset-0 pl-0">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border border-gray-700 text-white backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <SelectItem value="USD" className="hover:bg-gray-800 focus:bg-gray-800 rounded-sm my-1 cursor-pointer text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">USD</span>
                        <span className="text-gray-400">($)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="EUR" className="hover:bg-gray-800 focus:bg-gray-800 rounded-sm my-1 cursor-pointer text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">EUR</span>
                        <span className="text-gray-400">(€)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INR" className="hover:bg-gray-800 focus:bg-gray-800 rounded-sm my-1 cursor-pointer text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">INR</span>
                        <span className="text-gray-400">(₹)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <span className="text-sm text-gray-400 ml-2">
              {isLoading ? "Loading programs..." : `${filteredPrograms.length} programs available`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coachingPrograms
            .filter(program => program.category === "group")
            .map((program) => (
              <motion.div key={program.id} variants={itemVariants} className="group">
                <div className="flex flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900 h-full text-white"> {/* bg-card replaced */}
                  <div className="relative w-full aspect-[3/1] bg-black flex items-center justify-center"> {/* Simplified background */}
                    {program.iconName === "briefcase" && <Briefcase className="h-8 w-8 text-[#245D66]" />}
                    {program.iconName === "clock" && <Clock className="h-8 w-8 text-[#245D66]" />}
                    {program.iconName === "fileText" && <FileText className="h-8 w-8 text-[#245D66]" />}
                    {program.iconName === "fileCheck" && <FileCheck className="h-8 w-8 text-[#245D66]" />}
                    {program.iconName === "messageSquare" && <MessageSquare className="h-8 w-8 text-[#245D66]" />}
                    {program.iconName === "zap" && <Zap className="h-8 w-8 text-[#245D66]" />}
                    {program.iconName === "award" && <Award className="h-8 w-8 text-[#245D66]" />}
                    {program.iconName === "users" && <Users className="h-8 w-8 text-[#245D66]" />}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white">{program.title}</h3>
                        <p className="text-gray-400 text-xs">{program.shortDescription.substring(0, 60)}...</p>
                      </div>
                      {program.sessionLength && (
                        <Badge className="bg-[#245D66] text-white border-none text-xs">
                          {program.sessionLength}
                        </Badge>
                      )}
                      {program.cohortSize && program.category === "group" && (
                         <Badge className="bg-[#245D66] text-white border-none text-xs">
                          {program.cohortSize}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1.5 mb-3 flex-grow">
                      {program.features?.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-start gap-1.5">
                          <CheckCircle className="h-3 w-3 text-[#245D66] mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-300">{feature}</span>
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
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-white">{formatPrice(program.price || 0)}</span>
                          {program.originalPrice && (
                            <span className="text-xs text-gray-500 line-through"> {/* Darker gray for line-through */}
                              {formatPrice(program.originalPrice)}
                            </span>
                          )}
                          {program.privateOption && program.category === "group" && (
                            <span className="text-xs text-gray-400 ml-1">
                              / {formatPrice(program.privatePrice || 0)} (private)
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="h-8 text-xs group bg-[#245D66] text-white hover:bg-[#1A444B] rounded-full" // Darker shade for hover
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
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">
            Program Comparison
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Choose the program that best fits your needs and goals
          </p>
          <div className="mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4"></div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] mx-auto">
            <div className="grid grid-cols-4 gap-0.5 bg-gray-700 rounded-lg overflow-hidden border border-gray-700">
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
              <div className="bg-gray-900 p-4 font-semibold text-white"> {/* Darker shade of black */}
                Focus
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white"> {/* Lighter shade of black */}
                <p className="font-semibold text-[#245D66] mb-2">Complete consulting preparation system with emphasis on recruitment</p>
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Case interview techniques</li>
                  <li>FIT interview preparation</li>
                  <li>CV & cover letter optimization</li>
                  <li>Industry knowledge</li>
                  <li>Networking strategies</li>
                  <li>Post-offer guidance</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <p className="font-semibold text-[#245D66] mb-2">Specialized case interview preparation and problem-solving methodology</p>
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Full case cycle mastery</li>
                  <li>Framework development</li>
                  <li>Quantitative analysis</li>
                  <li>Qualitative discussion</li>
                  <li>Synthesis & recommendation</li>
                  <li>Various case types</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <p className="font-semibold text-[#245D66] mb-2">Strategic narrative development for behavioral interviews</p>
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Personal narrative development</li>
                  <li>MBB-specific FIT questions</li>
                  <li>Leadership & teamwork stories</li>
                  <li>Failure & learning narratives</li>
                  <li>Executive presence</li>
                  <li>Delivery techniques</li>
                </ul>
              </div>

              {/* Time Commitment Row */}
              <div className="bg-gray-900 p-4 font-semibold text-white">
                Time Commitment
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>5 weekly sessions (10 hours)</li>
                  <li>12 hours pre-program material</li>
                  <li>Ongoing support</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>4 weekly sessions (8 hours)</li>
                  <li>6 hours pre-program material</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>3 weekly sessions (6 hours)</li>
                  <li>4 hours pre-program material</li>
                </ul>
              </div>

              {/* Ideal For Row */}
              <div className="bg-gray-900 p-4 font-semibold text-white">
                Ideal For
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Serious candidates targeting top firms</li>
                  <li>Those needing comprehensive preparation</li>
                  <li>Candidates starting from scratch</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Those struggling specifically with cases</li>
                  <li>Candidates with strong resumes but weak case skills</li>
                  <li>Analytical thinkers needing structure</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Strong case performers with weaker personal narratives</li>
                  <li>Candidates with unconventional backgrounds</li>
                  <li>Those with upcoming final rounds</li>
                </ul>
              </div>

              {/* Expected Outcomes Row */}
              <div className="bg-gray-900 p-4 font-semibold text-white">
                Expected Outcomes
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Complete interview readiness</li>
                  <li>Structured approach for interview types</li>
                  <li>Optimized application materials</li>
                  <li>Strategic career planning</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Confident case handling</li>
                  <li>Clear structured thinking</li>
                  <li>Improved quantitative skills</li>
                  <li>Compelling recommendation delivery</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 text-sm text-white">
                <ul className="space-y-1 text-gray-300 list-disc pl-5">
                  <li>Authentic, compelling personal stories</li>
                  <li>Confident delivery</li>
                  <li>Clear distinction between experience and consulting fit</li>
                  <li>Partner-level communication</li>
                </ul>
              </div>

              {/* Investment Row */}
              <div className="bg-gray-900 p-4 font-semibold text-white">
                Investment
              </div>
              <div className="bg-gray-800 p-4 text-sm font-bold text-white">
                <p>{formatPrice(599)}</p>
                <p className="text-xs text-gray-400 mt-1">{formatPrice(1199)} (private)</p>
              </div>
              <div className="bg-gray-800 p-4 text-sm font-bold text-white">
                <p>{formatPrice(399)}</p>
                <p className="text-xs text-gray-400 mt-1">{formatPrice(799)} (private)</p>
              </div>
              <div className="bg-gray-800 p-4 text-sm font-bold text-white">
                <p>{formatPrice(299)}</p>
                <p className="text-xs text-gray-400 mt-1">{formatPrice(599)} (private)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button 
            size="lg" 
            className="bg-[#245D66] text-white hover:bg-[#1A444B] rounded-full group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-[#245D66]/20"
          >
            <span>Apply For Group Coaching</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

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
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto"> {/* Changed from gray-400 for slightly more pop */}
              Select your Practice Mode
            </p>
            <p className="text-sm text-gray-500"> {/* This gray is fine for very subtle text */}
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
              className="relative group bg-black border border-gray-700 rounded-3xl" // Explicit bg and border
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-[#245D66]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              <div className="absolute inset-0 bg-grid-[#245D66]/5 [mask-image:linear-gradient(0deg,transparent,rgba(36,93,102,0.05),transparent)] rounded-3xl"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0vjZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNmgtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 rounded-3xl"></div>
              
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
                        className="rounded-xl object-cover w-full h-auto shadow-lg border border-gray-700"
                      />
                    </div>
                    <div className="col-span-1">
                      <Image
                        src="/ai-coach-charts.jpg"
                        alt="AI Coach Charts"
                        width={200}
                        height={250}
                        className="rounded-xl object-cover w-full h-auto shadow-lg border border-gray-700"
                      />
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">
                    Engage in realistic, low-latency voice interaction with slide sharing and on-demand case test introduction - perfect for real interview simulation.
                  </p>

                  <ul className="space-y-2 text-sm text-gray-300"> {/* text-gray-400 to text-gray-300 */}
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
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-white/5 relative overflow-hidden"
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
              className="relative group bg-black border border-gray-700 rounded-3xl" // Explicit bg and border
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-[#245D66]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              <div className="absolute inset-0 bg-grid-[#245D66]/5 [mask-image:linear-gradient(0deg,transparent,rgba(36,93,102,0.05),transparent)] rounded-3xl"></div>
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0vjZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNmgtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 rounded-3xl"></div>

              <div className="relative p-8 backdrop-blur-sm rounded-3xl h-full flex flex-col">
                <div className="text-2xl font-bold mb-6 text-white">Guided Case Interview Coaching with AI</div>

                <div className="flex-1 mb-6">
                  <div className="mb-6">
                    <Image
                      src="/ai-coach-laptop.jpg"
                      alt="AI Coach Laptop"
                      width={400}
                      height={250}
                      className="rounded-xl object-cover w-full h-auto shadow-lg border border-gray-700"
                    />
                  </div>

                  <p className="text-gray-300 mb-4">
                    Receive feedback after each interaction - perfect for candidates familiarizing themselves with the case interview format.
                  </p>

                  <ul className="space-y-2 text-sm text-gray-300"> {/* text-gray-400 to text-gray-300 */}
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
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-white/5 relative overflow-hidden"
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
              className="rounded-full border-gray-600 text-white hover:bg-gray-700 hover:text-white" // Adjusted outline button
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start with a Free 15 minute session
            </Button>
            <p className="mt-4 text-sm text-gray-500 italic">
              "The Most Realistic AI Voice Case Interview Simulator, Offering Expert-Level Rehearsals"
            </p>
            <div className="mt-2 flex items-center justify-center">
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-700 bg-black"> {/* Explicit dark badge */}
                Created by Experienced Management Consultants and AI Experts for Optimal Results
              </Badge>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700"> {/* Darker border */}
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
            <h2 className="text-3xl font-bold text-white">Customer Reviews</h2>
            <p className="text-gray-400">Hear from our successful clients</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="flex">
              <Star className="h-5 w-5 text-white" />
              <Star className="h-5 w-5 text-white" />
              <Star className="h-5 w-5 text-white" />
              <Star className="h-5 w-5 text-white" />
              <Star className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-white">4.9</span>
            <span className="text-sm text-gray-400">(264 reviews)</span>
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
          <Button variant="outline" className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            View All Reviews
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-gray-400">Everything you need to know about our coaching programs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black to-[#245D66]/10"> {/* Darker gradient */}
            <CardHeader>
              <CardTitle className="flex items-start gap-2 text-white">
                <MessageSquare className="h-5 w-5 text-[#245D66] mt-0.5" />
                <span>How are the coaching sessions conducted?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                All coaching sessions are conducted online via Zoom. You'll receive a calendar invite with a link to join the session. Sessions typically last 60-90 minutes depending on the program you choose.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black to-[#245D66]/10">
            <CardHeader>
              <CardTitle className="flex items-start gap-2 text-white">
                <Clock className="h-5 w-5 text-[#245D66] mt-0.5" />
                <span>How long does each program last?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Program durations vary: Break into Consulting is 8 weeks, Unlimited Coaching runs until you receive an offer, Group Coaching is 6 weeks, and 1:1 sessions are scheduled as needed based on your package.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black to-[#245D66]/10">
            <CardHeader>
              <CardTitle className="flex items-start gap-2 text-white">
                <Users className="h-5 w-5 text-[#245D66] mt-0.5" />
                <span>What's the difference between group and 1:1 coaching?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Group coaching provides a collaborative environment where you learn with peers, while 1:1 coaching offers personalized attention focused exclusively on your specific needs and challenges.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black to-[#245D66]/10">
            <CardHeader>
              <CardTitle className="flex items-start gap-2 text-white">
                <FileCheck className="h-5 w-5 text-[#245D66] mt-0.5" />
                <span>Do you offer a satisfaction guarantee?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Yes! We're confident in our programs and offer a 14-day money-back guarantee if you're not satisfied. For our Unlimited Coaching program, we guarantee coaching until you receive an offer.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black to-[#245D66]/10">
            <CardHeader>
              <CardTitle className="flex items-start gap-2 text-white">
                <Sparkles className="h-5 w-5 text-[#245D66] mt-0.5" />
                <span>Who are the coaches?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Our coaches are experienced consultants from top firms like McKinsey, BCG, Bain, and other MBB firms. They have firsthand experience in the recruiting process and can provide insider knowledge.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-black to-[#245D66]/10">
            <CardHeader>
              <CardTitle className="flex items-start gap-2 text-white">
                <Briefcase className="h-5 w-5 text-[#245D66] mt-0.5" />
                <span>What's your success rate?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Our clients have a 70% higher success rate in securing consulting offers compared to the industry average. Over 1,250 of our clients have successfully landed offers at top consulting firms.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400 mb-4">Still have questions? We're here to help!</p>
          <Button variant="outline" className="flex items-center gap-2 mx-auto border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* CTA Section (Light Theme Block) */}
      <section className="mt-16">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100"></div> {/* Lighter shades of black (gray) for light theme */}
          <div className="absolute inset-0 bg-grid-[#245D66]/5 [mask-image:linear-gradient(0deg,transparent,rgba(36,93,102,0.05),transparent)]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gray-100 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gray-100 rounded-full blur-3xl"></div>

          <div className="relative p-8 md:p-12 text-black"> {/* Default text black for this light section */}
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
                <p className="text-gray-700"> {/* Darker gray for readability on light bg */}
                  Choose the program that fits your needs and take the first step toward your dream consulting career. Special pricing available for a limited time.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button size="lg" className="bg-[#245D66] text-white hover:bg-[#1A444B] transition-all duration-300 group hover:-translate-y-[2px] shadow-lg hover:shadow-[#245D66]/20">
                    Browse All Programs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-[#245D66]/70 text-[#245D66] hover:bg-[#245D66]/10 hover:text-[#1A444B] transition-all duration-300 bg-white"> {/* Ensure good contrast for outline on light */}
                    Schedule a Call
                  </Button>
                </div>
              </div>

              <div className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#245D66]/20 shadow-lg hover:shadow-[#245D66]/10 transition-all duration-300"> {/* Lighter bg for contrast */}
                <div className="text-xl font-bold" style={{ color: '#245D66' }}><span style={{ opacity: 0.9 }}>Why Choose Our Coaching?</span></div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-gray-800">Expert coaches from top consulting firms</span> {/* Darker text */}
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-gray-800">Proven track record with 1250+ placements</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-gray-800">Personalized approach for your unique needs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-gray-800">Flexible programs to fit your schedule</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#245D66]" />
                    <span className="text-gray-800">Money-back guarantee if not satisfied</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

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