"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Briefcase, 
  Award,
  Target,
  TrendingUp,
  BarChart,
  Users,
  ChevronRight,
  Calendar,
  Clock,
  Shield,
  Zap
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
import { PaymentModal, PaymentItem } from "@/components/payment/payment-modal"
import { getProductsByCategory, addCoachingToUserProfile, createTransactionRecord } from "@/lib/firebase/firestore"

// Helper component for testimonials
function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl transform translate-x-5 -translate-y-5"></div>
      <CardContent className="p-6 space-y-4 relative z-10">
        <div className="flex justify-start">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
          ))}
        </div>
        <p className="italic text-white/80 text-sm">{quote}</p>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">{author.charAt(0)}</div>
          <div>
            <p className="font-medium text-white text-sm">{author}</p>
            <p className="text-xs text-white/60">{role}</p>
          </div>
        </div>
      </CardContent>
    </motion.div>
  )
}

// Define the coaching program type
interface CareerExcellenceProgram {
  id: string
  title: string
  description: string
  shortDescription: string
  icon?: React.ReactNode
  iconName?: string
  category: string
  price: number
  originalPrice?: number
  discount?: number
  popular?: boolean
  featured?: boolean
  rating?: number
  reviewCount?: number
  features?: string[]
}

export default function CareerExcellencePage() {
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

  // State for payment dialog
  const [selectedProgram, setSelectedProgram] = useState<PaymentItem | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  
  // State for session duration toggle
  const [sessionDuration, setSessionDuration] = useState<'30' | '60'>('30')
  const [sessionPrice, setSessionPrice] = useState(299)

  // Handle buy now click
  const handleBuyNow = (program: any) => {
    if (!user) {
      toast.error("Please sign in to purchase this program")
      return
    }

    const paymentItem: PaymentItem = {
      id: program.id,
      title: program.title,
      description: program.shortDescription,
      price: program.price,
      originalPrice: program.originalPrice,
      discount: program.discount
    }

    setSelectedProgram(paymentItem)
    setShowPaymentDialog(true)
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = async (method: 'razorpay' | 'stripe') => {
    if (!selectedProgram || !user) {
      toast.error("Something went wrong. Please try again.")
      return
    }

    try {
      // Create a transaction record
      const transactionId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      await createTransactionRecord(user.uid, {
        transactionId,
        amount: selectedProgram.price,
        currency: "INR",
        paymentMethod: method,
        status: "successful" as "successful" | "failed",
        productId: selectedProgram.id,
        productTitle: selectedProgram.title, 
        couponCode: appliedCoupon?.code,
        couponDiscount: appliedCoupon?.discount,
        couponDiscountType: "percentage" as const,
        metadata: {
          programDetails: selectedProgram
        }
      });

      // Process payment based on selected method
      if (method === 'razorpay') {
        await processRazorpayPayment({
          amount: selectedProgram.price,
          currency: "INR",
          name: selectedProgram.title || "Career Excellence Program",
          description: "Career Excellence Coaching Program",
          handler: async (response) => {
            // Add coaching to user profile
            await addCoachingToUserProfile(user.uid, {
              programId: selectedProgram.id,
              programName: selectedProgram.title,
              amountPaid: selectedProgram.price,
              currency: "INR",
              paymentMethod: "razorpay",
              transactionId
            })
            
            toast.success("Payment successful! You now have access to the coaching program.")
            setShowPaymentDialog(false)
          },
          modal: {
            ondismiss: () => {
              console.error("Payment cancelled or failed")
              toast.error("Payment was cancelled or failed. Please try again.")
            }
          }
        })
      } else if (method === 'stripe') {
        await processStripePayment({
          amount: selectedProgram.price,
          currency: "INR",
          customerEmail: user.email ?? undefined,
          metadata: { userId: user.uid },


          successUrl: `${window.location.origin}/payment/success?method=stripe&transactionId=${transactionId}&programId=${selectedProgram.id}&programName=${encodeURIComponent(selectedProgram.title)}&amount=${selectedProgram.price}`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
          productName: ""
        })
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error("An error occurred while processing your payment. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10 container mx-auto py-12 px-4 md:px-6">
        {/* Hero Section */}
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-white/20 backdrop-blur-md shadow-2xl"
          >
            {/* Background image with overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="/herosection.jpg" 
                alt="Career Excellence" 
                fill
                sizes="100vw"
                className="object-cover opacity-100"
                priority
              />
            </div>
            <div className="absolute inset-0 backdrop-blur-[3px] z-5"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 z-10"></div>
            
            <div className="relative p-8 md:p-12 z-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  <Badge className="bg-white/80 backdrop-blur-md text-black border-none px-3 py-1 text-xs">
                    PREMIUM PROGRAM
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)]">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-700 to-black animate-gradient-x drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)]">
                      Career Excellence Program
                    </span>
                  </h1>
                  <p className="text-black text-lg drop-shadow-[0_1px_3px_rgba(255,255,255,0.7)]">
                    Accelerate your career growth with our comprehensive Career Excellence program. 
                    Designed for professionals who want to stand out and advance rapidly in their field.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Button 
                      size="lg" 
                      className="bg-white text-black hover:bg-white/90 transition-all duration-300 group hover:-translate-y-[2px] shadow-lg hover:shadow-white/10 rounded-xl"
                      onClick={() => handleBuyNow({
                        id: "career-excellence-premium",
                        title: "Career Excellence Program",
                        shortDescription: "Premium coaching program for career advancement",
                        price: 1445,
                        originalPrice: 1995,
                        discount: 25,
                        category: "coaching"
                      })}
                    >
                      Enroll Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/5 transition-all duration-300 rounded-xl"
                      onClick={() => document.getElementById('program-details')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Learn More
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg hover:shadow-white/5 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-black">Program Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 mr-2 text-black" />
                      <span className="text-black/90">Personalized career roadmap development</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 mr-2 text-black" />
                      <span className="text-black/90">1-on-1 coaching with industry experts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 mr-2 text-black" />
                      <span className="text-black/90">Advanced skill development workshops</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 mr-2 text-black" />
                      <span className="text-black/90">Exclusive networking opportunities</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 mr-2 text-black" />
                      <span className="text-black/90">Career advancement guarantee</span>
                    </li>
                  </ul>

                  <div className="pt-4 flex items-center justify-between border-t border-black/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-black">$1,445</span>
                        <span className="text-black/60 line-through text-sm">$1,995</span>
                      </div>
                      <span className="text-black/60 text-xs">27% limited time discount</span>
                    </div>
                    <Badge className="bg-black/10 text-black hover:bg-black/20 border-none">
                      <Clock className="h-3 w-3 mr-1 text-black" /> 6 Months Access
                    </Badge>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Premium Focus Areas Section */}
        <section className="relative z-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4 md:px-0">
            {/* Left: Image */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center md:justify-end"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-white/10 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/60 backdrop-blur-md w-72 h-80 md:w-80 md:h-96 flex items-center justify-center hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <Image src="/herosection.jpg" alt="Coaching Session" width={320} height={384} className="object-cover w-full h-full opacity-80 group-hover:opacity-90 transition-opacity duration-500 scale-105 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
                      <h3 className="text-lg font-bold text-white">STAR Consultant</h3>
                      <p className="text-xs text-white/80">Elite coaching for consultants</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right: Content */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-6 md:pl-4"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-semibold tracking-widest shadow-md mb-1 w-max border border-white/10">
                PREMIUM PROGRAM
              </div>
              
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x">
                  STAR Consultant Program
                </span>
              </h2>
              
              <p className="text-base md:text-lg text-white/80 font-medium mb-2">
                A personalized program to help you ace your first year in consulting & fast-track promotions
              </p>
              
              <div className="rounded-xl bg-gradient-to-br from-black/80 via-black/60 to-black/80 shadow-2xl backdrop-blur-md p-6 border border-white/10 hover:border-white/20 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" fill="white" />
                  </div>
                  Focus Areas
                </h3>
                
                <p className="text-sm text-white/60 mb-6">This program can be customized to your specific needs and career goals.</p>
                
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:bg-white/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">Learn the ropes of Consulting with ex-MBB coach hands on – not just watching recorded videos</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:bg-white/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">Avoid initial hiccups, forced exits and burnout commonly seen in the early years</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:bg-white/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">Leverage Peak Performance strategies to maximise productivity & happiness</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:bg-white/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">Work towards early promotion and fast track career</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:bg-white/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">Chart out your short term and medium term career strategy</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 mt-4 items-center">
                <div className="flex items-center gap-2 text-white/90 font-medium bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 hover:bg-white/10 transition-colors">
                  <Clock className="h-4 w-4 text-white/70" />
                  3000+ Hours coached
                </div>
                <div className="flex items-center gap-2 text-white/90 font-medium bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 hover:bg-white/10 transition-colors">
                  <Star className="h-4 w-4 text-white/70" fill="currentColor" />
                  700+ 5 Star Reviews
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="mt-6">
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-black font-bold shadow-xl hover:shadow-white/20 transition-all duration-300 group text-lg"
                  onClick={() => handleBuyNow({
                    id: "star-consultant-program",
                    title: "STAR Consultant Program",
                    shortDescription: "Elite coaching for consultants",
                    price: 34900,
                    originalPrice: 44900,
                    discount: 22,
                    category: "coaching"
                  })}
                >
                  Enroll Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Program Agenda Timeline Section */}
        <section className="relative z-10 py-12 md:py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 px-4 md:px-12 py-10"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-2 tracking-tight">
              Break into Consulting Program Agenda
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white cursor-pointer transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                  <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Case Cracking
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white cursor-pointer transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                  <path d="M12 8v4l3 3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                FIT Interview
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white cursor-pointer transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                  <path d="M12 17.5l-6-6 1.4-1.4 4.6 4.6 7.6-7.6 1.4 1.4-9 9z" fill="#FFFFFF"/>
                </svg>
                CV Focus
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white cursor-pointer transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                  <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Ongoing Mentorship
              </span>
            </div>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-white/40 via-white/20 to-transparent rounded-full z-0 hidden md:block"></div>
              <ol className="space-y-10 relative z-10">
                {/* Session 1 */}
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start gap-6 md:gap-8"
                >
                  <div className="relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg border-4 border-black text-black text-xl font-bold">
                      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                        <rect width="24" height="24" rx="6" fill="#FFFFFF"/>
                        <path d="M8 10h8M8 14h6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-semibold text-lg text-white">Joining readiness evaluation & Goal Setting</span>
                      <span className="text-sm italic text-white/60 mt-1 md:mt-0">Sessions 1</span>
                    </div>
                    <div className="text-white/80 mt-1 text-sm">
                      • Discovery call to understand your profile, priorities & goal setting
                    </div>
                  </div>
                </motion.li>
                {/* Session 2 */}
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start gap-6 md:gap-8"
                >
                  <div className="relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg border-4 border-black text-black text-xl font-bold">
                      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                        <rect width="24" height="24" rx="6" fill="#FFFFFF"/>
                        <path d="M8 10h8M8 14h6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-semibold text-lg text-white">First project readiness discussion</span>
                      <span className="text-sm italic text-white/60 mt-1 md:mt-0">Sessions 2</span>
                    </div>
                    <div className="text-white/80 mt-1 text-sm">
                      • Understand the readiness for the project in hand and the approach to ace it
                    </div>
                  </div>
                </motion.li>
                {/* Session 3 */}
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-start gap-6 md:gap-8"
                >
                  <div className="relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg border-4 border-black text-black text-xl font-bold">
                      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                        <rect width="24" height="24" rx="6" fill="#FFFFFF"/>
                        <path d="M8 10h8M8 14h6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-semibold text-lg text-white">First mid-project check-in</span>
                      <span className="text-sm italic text-white/60 mt-1 md:mt-0">Sessions 3</span>
                    </div>
                    <div className="text-white/80 mt-1 text-sm">
                      • Mid-Project Checkin to understand the progress, hurdles and learnings
                    </div>
                  </div>
                </motion.li>
                {/* Session 4 */}
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-start gap-6 md:gap-8"
                >
                  <div className="relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg border-4 border-black text-black text-xl font-bold">
                      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                        <rect width="24" height="24" rx="6" fill="#FFFFFF"/>
                        <path d="M8 10h8M8 14h6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-semibold text-lg text-white">First project ending debrief, feedback discussion</span>
                      <span className="text-sm italic text-white/60 mt-1 md:mt-0">Sessions 4</span>
                    </div>
                    <div className="text-white/80 mt-1 text-sm">
                      • Project feedback discussion, avenues to grow, learnings for the next project
                    </div>
                  </div>
                </motion.li>
                {/* Session 5 */}
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-start gap-6 md:gap-8"
                >
                  <div className="relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg border-4 border-black text-black text-xl font-bold">
                      <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                        <rect width="24" height="24" rx="6" fill="#FFFFFF"/>
                        <path d="M8 10h8M8 14h6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="font-semibold text-lg text-white">Pre-evaluation prep and appraisal pitch making</span>
                      <span className="text-sm italic text-white/60 mt-1 md:mt-0">Sessions 5</span>
                    </div>
                    <div className="text-white/80 mt-1 text-sm">
                      • Prepare for your evaluation, make a mark & ace the appraisal
                    </div>
                  </div>
                </motion.li>
              </ol>
            </div>
          </motion.div>
        </section>

        {/* Book a 1:1 Custom Coaching Session Section */}
        <section className="relative z-10 py-12 md:py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Book a 1:1 Custom Coaching Session
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-6 max-w-xl mx-auto">
              Get personalized guidance tailored to your specific needs and career goals with our exclusive 1:1 coaching sessions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm font-medium">
              <span className="inline-flex items-center gap-1 text-white/80 hover:text-white cursor-pointer transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                  <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Live 1:1 Coaching
              </span>
              <span className="inline-flex items-center gap-1 text-white/80 hover:text-white cursor-pointer transition-colors">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                  <path d="M12 8v4l3 3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Reschedule Anytime
              </span>
            </div>
            {/* Toggle */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <span className={`text-lg font-semibold ${sessionDuration === '30' ? 'text-white' : 'text-white/60'}`}>30 minutes</span>
              <button 
                type="button" 
                onClick={() => {
                  setSessionDuration(sessionDuration === '30' ? '60' : '30')
                  setSessionPrice(sessionDuration === '30' ? 499 : 299)
                }}
                className="relative inline-flex items-center h-8 w-16 rounded-full bg-white/10 transition-colors duration-300 focus:outline-none hover:bg-white/20 cursor-pointer"
              >
                <span className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 transform ${sessionDuration === '30' ? 'translate-x-0' : 'translate-x-8'}`} />
              </button>
              <span className={`text-lg font-semibold ${sessionDuration === '60' ? 'text-white' : 'text-white/60'}`}>60 minutes</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between px-6 py-8 gap-8"
          >
            <div className="flex-1 flex flex-col gap-4 items-start">
              <div className="flex items-center gap-2 text-white/90 text-base">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#FFFFFF" opacity="0.15"/>
                  <path d="M5 13l4 4L19 7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Personalised Session to Suit your needs
              </div>
              <div className="flex items-center gap-2 text-white/90 text-base">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#FFFFFF" opacity="0.15"/>
                  <path d="M5 13l4 4L19 7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Career Growth, Appraisal
              </div>
              <div className="flex items-center gap-2 text-white/90 text-base">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#FFFFFF" opacity="0.15"/>
                  <path d="M5 13l4 4L19 7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Career Transition, Exit
              </div>
              <div className="flex items-center gap-2 text-white/90 text-base">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#FFFFFF" opacity="0.15"/>
                  <path d="M5 13l4 4L19 7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Specific Professional Scenarios
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 min-w-[180px]">
              <span className="text-4xl font-extrabold text-white">${sessionPrice}</span>
              <span className="text-sm text-white/60 mb-2">Price per {sessionDuration}-min Session</span>
              <button 
                onClick={() => handleBuyNow({
                  id: `custom-coaching-${sessionDuration}min`,
                  title: `${sessionDuration}-Minute Custom Coaching Session`,
                  shortDescription: `1:1 personalized coaching session (${sessionDuration} minutes)`,
                  price: sessionPrice,
                  category: "coaching"
                })}
                className="px-6 py-2 rounded-lg bg-white text-black font-bold shadow-md hover:bg-white/90 transition-all text-base hover:-translate-y-[2px] duration-300"
              >
                Book a session
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-xs text-center text-white/80 font-semibold mt-4 bg-white/5 backdrop-blur-sm rounded-b-2xl py-2 px-3"
          >
            Included: <span className="font-bold text-white">$5,000+ worth of resources: 5,000+ cases, 20+ hrs of video, 100+ tools/templates.</span>
          </motion.div>
        </section>

        {/* How does this work? Coach Profile Section */}
        <section className="relative z-10 py-12 md:py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto mb-12 px-4 md:px-0 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How does this work?</h2>
            <p className="text-white/80 text-sm md:text-base mb-6 max-w-3xl mx-auto">
              For your upcoming interviews, you can book a 1:1 slot anytime. We will curate the questions relevant for your interview & help you with actionable feedback to do better.
            </p>
          </motion.div>
          
          {/* Coach Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-br from-black/80 via-black/60 to-black/80 shadow-2xl border border-white/10 backdrop-blur-md overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative w-full h-24 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
                    The Only 360° Consulting Coach
                  </span>
                </h3>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex flex-col md:flex-row gap-8 p-6 md:p-10 items-start">
              {/* Left: Coach Image and Stats */}
              <div className="flex flex-col items-center md:items-start md:min-w-[200px] w-full md:w-auto">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-lg border-4 border-white/10 mb-6 relative group">
                  <img src="/coach-gaurav.jpg" alt="Gaurav Bhosle" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">Ex-McKinsey Germany</p>
                  </div>
                </div>
                
                <div className="text-xl font-bold text-white mb-3 text-center md:text-left">Gaurav Bhosle</div>
                
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3 w-full">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center md:items-start border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="12" fill="#FFFFFF" fillOpacity="0.1"/>
                        <path d="M8 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-white font-medium">Experience</span>
                    </div>
                    <span className="text-white/80 text-sm">3000+ Hours coached</span>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center md:items-start border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="12" fill="#FFFFFF" fillOpacity="0.1"/>
                        <path d="M8 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-white font-medium">Global Reach</span>
                    </div>
                    <span className="text-white/80 text-sm">55 Countries</span>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center md:items-start border border-white/5 hover:bg-white/10 transition-colors md:col-span-1 col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="12" fill="#FFFFFF" fillOpacity="0.1"/>
                        <path d="M8 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-white font-medium">Success Rate</span>
                    </div>
                    <span className="text-white/80 text-sm">90% Success rate</span>
                  </div>
                </div>
              </div>
              
              {/* Center: Achievements */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Consultant */}
                  <motion.div 
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="font-semibold text-base text-white mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      Consultant
                    </div>
                    <ul className="text-sm space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-white/60 mt-2"></span>
                        <span className="text-white/80">Ex-McKinsey Germany & global consultant across 25+ countries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-white/60 mt-2"></span>
                        <span className="text-white/80">Super fast career growth from entry level-to senior manager in 6 years</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  {/* Coach */}
                  <motion.div 
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="font-semibold text-base text-white mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      Coach
                    </div>
                    <ul className="text-sm space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-white/60 mt-2"></span>
                        <span className="text-white/80">Industry Leading Astounding success rate of 90%+</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-white/60 mt-2"></span>
                        <span className="text-white/80">Placed 750+ in MBBs & 1250+ in tier2+ Consulting Firm</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  {/* Recruiter */}
                  <motion.div 
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="font-semibold text-base text-white mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      Recruiter
                    </div>
                    <ul className="text-sm space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-white/60 mt-2"></span>
                        <span className="text-white/80">Super fast career growth from entry level to senior manager in 6 years</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-white/60 mt-2"></span>
                        <span className="text-white/80">Led various on and off campus recruitment events across the globe</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
                
                {/* Certifications */}
                <div className="mt-4">
                  <div className="text-white font-semibold mb-3 flex items-center gap-2">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="#FFFFFF" fillOpacity="0.1"/>
                      <path d="M8 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Professional Certifications
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/5 hover:bg-white/10 transition-colors">
                      <img src="/cert-icf.png" alt="ICF" className="h-10 w-10 rounded bg-white/10 border border-white/20 p-1" />
                      <span className="text-xs text-white/80">International Coaching Federation (ICF) accredited Career Coach since 2014</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/5 hover:bg-white/10 transition-colors">
                      <img src="/cert-hogan.png" alt="Hogan" className="h-10 w-10 rounded bg-white/10 border border-white/20 p-1" />
                      <span className="text-xs text-white/80">Certified practitioner of HOGAN, MBTI, STRONG psychometric assessments</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/5 hover:bg-white/10 transition-colors">
                      <img src="/cert-gla.png" alt="GLA 360" className="h-10 w-10 rounded bg-white/10 border border-white/20 p-1" />
                      <span className="text-xs text-white/80">Certified practitioner of GLA 360 (Marshall Goldsmith Global Leadership Assessment)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* How it works: Process Flow Section */}
        <section className="relative z-10 py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black to-zinc-900/80"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto px-2 md:px-0"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">The Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 relative">
              {/* Vertical line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/40 via-white/20 to-white/5 z-0" style={{transform: 'translateX(-50%)'}}></div>
              {/* Left column */}
              <div className="flex flex-col gap-8 z-10">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-md text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg font-semibold text-base border border-white/5 hover:bg-white/15 transition-colors">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                      <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Choose a Coaching program
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-md text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg font-semibold text-base border border-white/5 hover:bg-white/15 transition-colors">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                      <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Prepare with all the available videos and resources for the chosen program
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-md text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg font-semibold text-base border border-white/5 hover:bg-white/15 transition-colors">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                      <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Get critical feedback & actionable steps to confidently nail your interview
                  </div>
                </motion.div>
              </div>
              {/* Right column */}
              <div className="flex flex-col gap-8 z-10 mt-16 md:mt-0">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-md text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg font-semibold text-base border border-white/5 hover:bg-white/15 transition-colors">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                      <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Book 1:1 with me
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-md text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg font-semibold text-base border border-white/5 hover:bg-white/15 transition-colors">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                      <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    During the session, practice on most common questions asked and those relevant to the JD
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-md text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg font-semibold text-base border border-white/5 hover:bg-white/15 transition-colors">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="6" fill="#FFFFFF" fillOpacity="0.1"/>
                      <path d="M8 10h8M8 14h6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Learn the best practices to appear for any interview round
                  </div>
                </motion.div>
              </div>
              {/* Final step at the bottom, centered */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="col-span-1 md:col-span-2 flex justify-center mt-10"
              >
                <div className="bg-white text-black rounded-lg px-6 py-4 flex items-center gap-3 shadow-xl font-semibold text-base border border-white/5 hover:bg-white/90 transition-all">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="6" fill="#FFFFFF"/>
                    <path d="M12 8v4l3 3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="6" stroke="#FFFFFF" strokeWidth="2"/>
                  </svg>
                  Crack the Interview round successfully
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Real stories of growth, success, and transformation through coaching */}
        <section className="relative z-10 py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-0"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-5xl mx-auto px-4 md:px-6"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x">
                  Real Stories of Growth, Success, and Transformation
                </span>
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-3xl mx-auto">
                Hear from professionals who have transformed their careers through our coaching programs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Testimonial 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-0"></div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl h-full z-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="p-6 md:p-8 space-y-6 relative z-10 h-full flex flex-col">
                    <div className="flex justify-start mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      ))}
                    </div>
                    
                    <p className="italic text-white/90 text-sm flex-grow">
                      "The Career Excellence program completely transformed my approach to consulting. Within 3 months of completing the program, I received a promotion and a 40% salary increase. The personalized coaching and actionable feedback were invaluable."
                    </p>
                    
                    <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-white font-medium text-lg shadow-lg border border-white/20 overflow-hidden">
                        <img src="/testimonial-1.jpg" alt="Testimonial" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => {
                          e.currentTarget.src = '';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.textContent = 'AR';
                          }
                        }} />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm group-hover:text-white/90 transition-colors">Arjun Reddy</p>
                        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">Senior Consultant, Deloitte</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Testimonial 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-0"></div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl h-full z-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="p-6 md:p-8 space-y-6 relative z-10 h-full flex flex-col">
                    <div className="flex justify-start mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      ))}
                    </div>
                    
                    <p className="italic text-white/90 text-sm flex-grow">
                      "I was struggling with case interviews for top consulting firms. After just 4 coaching sessions, I secured offers from both BCG and Bain. The structured approach and insider knowledge gave me an edge that made all the difference."
                    </p>
                    
                    <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/30 to-teal-500/30 flex items-center justify-center text-white font-medium text-lg shadow-lg border border-white/20 overflow-hidden">
                        <img src="/testimonial-2.jpg" alt="Testimonial" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => {
                          e.currentTarget.src = '';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.textContent = 'SP';
                          }
                        }} />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm group-hover:text-white/90 transition-colors">Shreya Patel</p>
                        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">Associate Consultant, BCG</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Testimonial 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 z-0"></div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl h-full z-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="p-6 md:p-8 space-y-6 relative z-10 h-full flex flex-col">
                    <div className="flex justify-start mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      ))}
                    </div>
                    
                    <p className="italic text-white/90 text-sm flex-grow">
                      "After 5 years at the same level, I was feeling stuck. The Career Excellence program helped me identify my blind spots and develop a strategic plan. Six months later, I landed a role at McKinsey with a compensation package beyond my expectations."
                    </p>
                    
                    <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500/30 to-red-500/30 flex items-center justify-center text-white font-medium text-lg shadow-lg border border-white/20 overflow-hidden">
                        <img src="/testimonial-3.jpg" alt="Testimonial" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => {
                          e.currentTarget.src = '';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.textContent = 'RK';
                          }
                        }} />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm group-hover:text-white/90 transition-colors">Rahul Kumar</p>
                        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">Engagement Manager, McKinsey</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Featured Testimonial */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl z-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="p-8 md:p-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl"></div>
                      <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10 transform group-hover:scale-[1.02] transition-transform duration-500">
                        <img 
                          src="/testimonial-featured.jpg" 
                          alt="Featured Testimonial" 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.classList.add('bg-gradient-to-br', 'from-purple-500/20', 'to-blue-500/20');
                              e.currentTarget.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-white text-4xl font-bold">NK</div>';
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-8 space-y-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400" fill="#FBBF24" />
                        ))}
                      </div>
                      
                      <blockquote>
                        <p className="text-lg md:text-xl text-white/90 italic leading-relaxed">
                          "The Career Excellence program was a game-changer for me. The personalized coaching helped me navigate a complex career transition from a mid-level position to a leadership role. The insights, strategies, and ongoing support were invaluable. I've recommended this program to everyone in my network looking to accelerate their career growth."
                        </p>
                      </blockquote>
                      
                      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">Neha Kapoor</span>
                          <span className="text-sm text-white/60">VP of Strategy, Accenture</span>
                        </div>
                        
                        <div className="ml-auto flex items-center gap-3">
                          <div className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 border border-white/5">
                            300% Salary Growth
                          </div>
                          <div className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 border border-white/5">
                            2 Promotions in 18 Months
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Success Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors duration-300 group">
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x mb-2">90%</div>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Success Rate</p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors duration-300 group">
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x mb-2">2000+</div>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Careers Transformed</p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors duration-300 group">
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x mb-2">55+</div>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Countries</p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors duration-300 group">
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x mb-2">45%</div>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Avg. Salary Increase</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Payment Dialog */}
        <PaymentModal 
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          selectedItem={selectedProgram!}
          onPaymentMethodSelect={handlePaymentMethodSelect}
          currencySymbol="₹"
          currencyCode="INR"
        />
      </div>
    </div>
  );
}
