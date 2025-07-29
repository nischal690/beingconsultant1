"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
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
  Globe,
  Calendar
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { processRazorpayPayment } from "@/lib/payment/razorpay"
import { processStripePayment } from "@/lib/payment/stripe"
import { useAuth } from "@/lib/firebase/auth-context";
import { PaymentModal, PaymentItem } from "@/components/payment/payment-modal"
import { getProductsByCategory, addCoachingToUserProfile, createTransactionRecord, getUserProfile } from "@/lib/firebase/firestore"
import { CoachingProgram, coachingPrograms, getProgramsByCategory } from "@/data/coaching-programs"
import { CoachingBookingFlow } from "@/components/calendly/coaching-booking-flow"

// TestimonialCard component removed

export default function CoachingPage() {
  // Get user from auth context
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  // State for membership status
  const [isMember, setIsMember] = useState(false);
  
  // State for Calendly booking after Stripe payment
  const [stripePaymentSuccess, setStripePaymentSuccess] = useState(false);
  const [stripeTransactionId, setStripeTransactionId] = useState<string | null>(null);
  const [stripeProgramId, setStripeProgramId] = useState<string | null>(null);
  const [stripeProgramName, setStripeProgramName] = useState<string | null>(null);
  const [stripeAmount, setStripeAmount] = useState<string | null>(null);
  
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

  // Check for Stripe payment success parameters in URL
  useEffect(() => {
    if (searchParams && user) {
      const showCalendly = searchParams.get('show_calendly');
      const paymentSuccess = searchParams.get('payment_success');
      const paymentMethod = searchParams.get('payment_method');
      
      if (showCalendly === 'true' && paymentSuccess === 'true' && paymentMethod === 'stripe') {
        // Get payment details from URL
        const transactionId = searchParams.get('transaction_id');
        const productId = searchParams.get('product_id');
        const programName = searchParams.get('program_name');
        const amount = searchParams.get('amount');
        
        console.log('[Stripe Payment] Detected successful payment with transaction ID:', transactionId);
        
        // Store payment details in state
        setStripePaymentSuccess(true);
        setStripeTransactionId(transactionId);
        setStripeProgramId(productId);
        setStripeProgramName(programName);
        setStripeAmount(amount);
        
        // Find the matching program
        const matchingProgram = coachingPrograms.find(p => 
          p.id === productId || p.title === programName
        );
        
        if (matchingProgram) {
          console.log('[Stripe Payment] Found matching program:', matchingProgram.title);
          // Set selected program and show booking flow
          setSelectedProgram({
            id: matchingProgram.id,
            title: matchingProgram.title,
            description: matchingProgram.description || '',
            price: parseFloat(amount || '0'),
            image: matchingProgram.image || '',
            category: 'coaching'
          });
          
          // Show a success toast
          toast.success('Payment successful! Please schedule your coaching session.');
          
          // Show booking flow after a short delay
          setTimeout(() => {
            setShowBookingFlow(true);
          }, 1000);
        } else {
          console.error('[Stripe Payment] Could not find matching program for:', productId, programName);
          toast.error('Could not find the coaching program you purchased. Please contact support.');
        }
      }
    }
  }, [searchParams, user]);

  // Add state for payment dialog
  const [selectedProgram, setSelectedProgram] = useState<PaymentItem | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  
  // Calendly booking flow state
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [useCalendlyFlow, setUseCalendlyFlow] = useState(true) // Set to true to use Calendly flow, false to use old payment flow
  
  // Details dialog state
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedProgramDetails, setSelectedProgramDetails] = useState<CoachingProgram | null>(null);

  // Handler for opening the details dialog
  const handleViewDetails = (program: CoachingProgram) => {
    setSelectedProgramDetails(program);
    setShowDetailsDialog(true);
  };
  
  // Currency switcher state
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "AED" | "EUR" | "GBP" | "JPY" | "INR" | "CAD">("USD")
  
  // Currency conversion rates (approximate values)
  // Currency conversion rates (default/fallback values)
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({
    USD: 1,
    AED: 3.67, // 1 USD = 3.67 AED
    EUR: 0.92, // 1 USD = 0.92 EUR
    GBP: 0.79, // 1 USD = 0.79 GBP
    JPY: 160,  // 1 USD = 160 JPY
    INR: 83.5, // 1 USD = 83.5 INR
    CAD: 1.37  // 1 USD = 1.37 CAD
  });

  // Fetch live conversion rates once on component mount
  useEffect(() => {
    const symbols = "AED,GBP,EUR,JPY,INR,CAD,USD";
    const fetchRates = async () => {
      console.log(`[Currency] Fetching live rates for: ${symbols}`);
      try {
        const res = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=d990d1ea7ccb40d3ae881bdc7b3d1fe2&symbols=${symbols}`);
        const data = await res.json();
        console.log("[Currency] API response", data);
        if (data && data.rates) {
          const apiRates: Record<string, string> = data.rates;
          setConversionRates(prev => {
            const updated: Record<string, number> = { ...prev };
            Object.keys(prev).forEach(k => {
              if (apiRates[k]) {
                const parsed = parseFloat(apiRates[k]);
                if (!isNaN(parsed)) {
                  updated[k] = parsed;
                }
              }
            });
            console.log("[Currency] Updated conversion rates", updated);
            return updated;
          });
        }
      } catch (err) {
        console.error("[Currency] Failed to fetch live rates", err);
      }
    };

    fetchRates();
  }, []);
  
  // Currency symbols
  const currencySymbols = {
    USD: "$",
    AED: "د.إ",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CAD: "C$"
  }

  // Sample coupon data
  const availableCoupons = [
    { code: "TEST", discount: 10 },
    { code: "NEWUSER", discount: 15 },
    { code: "SPRING25", discount: 25 }
  ]

  // Handle buy now click
  const handleBuyNow = (program: CoachingProgram) => {
    if (!user) {
      toast.error("Please sign in to purchase coaching programs");
      return;
    }
    
    // Convert prices to numbers
    const priceConverted = convertPrice(program.price);
    const originalPriceConverted = program.originalPrice 
      ? convertPrice(program.originalPrice) 
      : undefined;
    
    // Apply 10% member discount if user is a member
    let finalPrice = priceConverted;
    let displayOriginalPrice = originalPriceConverted;
    
    if (isMember) {
      // If user is a member, store the original price as originalPrice and apply 10% discount to the price
      displayOriginalPrice = priceConverted;
      finalPrice = finalPrice - (finalPrice * 10 / 100); // 10% discount
      console.log(`[Member Discount] Applied 10% discount: ${priceConverted} -> ${finalPrice}`);
    }
      
    setSelectedProgram({
      id: program.id,
      title: program.title,
      description: program.description,
      shortDescription: program.shortDescription || "",
      price: finalPrice, // Use the discounted price if member
      originalPrice: displayOriginalPrice, // Show original price for comparison
      uniqueId: program.id // Use the program ID as the uniqueId
    });
    
    setAppliedCoupon(null); // Reset applied coupon when selecting a new program
    
    if (useCalendlyFlow) {
      // Show Calendly booking flow
      setShowBookingFlow(true);
    } else {
      // Show traditional payment dialog
      setShowPaymentDialog(true);
    }
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number, coupon: { code: string; discount: number } | null = null) => {
    let finalPrice = price;
    
    // Apply coupon discount if available
    const discountToApply = coupon || appliedCoupon;
    if (discountToApply) {
      finalPrice = finalPrice - (finalPrice * discountToApply.discount / 100);
    }
    
    // Apply 10% member discount if user is a member
    if (isMember) {
      finalPrice = finalPrice - (finalPrice * 10 / 100);
    }
    
    return finalPrice;
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

  // Handle free order completion (when price is zero after coupon)
  const handleFreeOrderComplete = async (coupon: { code: string; discount: number }) => {
    if (!selectedProgram) return;
    
    try {
      console.log(`[Free Order] Processing free order for program: ${selectedProgram.title} with coupon: ${coupon.code}`);
      
      // Generate a unique ID for the transaction
      const transactionId = `free_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Prepare metadata for the transaction
      const metadata: Record<string, string> = {
        userId: user?.uid || '',
        userEmail: user?.email || '',
        programId: selectedProgram.id,
        programName: selectedProgram.title,
        couponCode: coupon.code || '',
        couponDiscount: coupon.discount?.toString() || '0',
        originalPrice: (selectedProgram.originalPrice || selectedProgram.price).toString(),
        finalPrice: '0',
        currency: selectedCurrency,
        timestamp: new Date().toISOString(),
        orderType: 'free'
      }
      
      if (user) {
        try {
          console.log(`[Free Order] Starting to record transaction and coaching program for user: ${user.uid}`);
          
          // Create transaction record
          const transactionData = {
            transactionId: transactionId,
            amount: 0,
            currency: selectedCurrency,
            status: "successful" as "successful" | "failed",
            paymentMethod: "razorpay" as "razorpay" | "stripe", // Use razorpay as the payment method for free orders
            productId: selectedProgram.id,
            productTitle: selectedProgram.title,
            couponCode: coupon.code,
            couponDiscount: coupon.discount,
            couponDiscountType: "percentage" as const,
            metadata: metadata
          };
          
          console.log(`[Free Order] Creating transaction record with data:`, JSON.stringify(transactionData, null, 2));
          const transactionResult = await createTransactionRecord(user.uid, transactionData);
          
          console.log(`[Free Order] Transaction record created:`, JSON.stringify(transactionResult, null, 2));
          
          // Add coaching program to user's profile (coaching subcollection only)
          console.log(`[Free Order] Creating coaching record for program: ${selectedProgram.id} - ${selectedProgram.title}`);
          
          const coachingData = {
            programId: selectedProgram.id,
            programName: selectedProgram.title,
            amountPaid: 0,
            currency: selectedCurrency,
            transactionId: transactionId,
            paymentMethod: "razorpay" as "razorpay" | "stripe", // Use razorpay as the payment method for free orders
            metadata: {
              originalPrice: selectedProgram.originalPrice,
              discount: coupon.discount || 0,
              couponCode: coupon.code || "",
              purchaseDate: new Date().toISOString(),
              enrollmentDate: new Date().toISOString(),
              freeOrder: true // Add a flag to indicate this was a free order
            }
          };
          
          console.log(`[Free Order] Coaching data prepared:`, JSON.stringify(coachingData, null, 2));
          
          try {
            const coachingResult = await addCoachingToUserProfile(user.uid, coachingData);
            
            console.log(`[Free Order] Coaching result:`, JSON.stringify(coachingResult, null, 2));
            
            if (coachingResult.success) {
              console.log(`[Free Order] Coaching program added to user profile: ${coachingResult.id}`);
              toast.success("Coaching program added to your account!");
              
              // Close the payment dialog
              setShowPaymentDialog(false);
              setCouponCode("");
              setAppliedCoupon(null);
              setCouponError(null);
              
              // Redirect to payment success page
              const successUrl = `/payment-success?` + 
                `payment_id=${encodeURIComponent(transactionId)}&` +
                `payment_method=Free&` +
                `amount=${encodeURIComponent('0')}&` + 
                `product_name=${encodeURIComponent(selectedProgram.title)}&` +
                `user_id=${encodeURIComponent(user.uid)}&` +
                `coupon_code=${encodeURIComponent(coupon.code)}&` +
                `coupon_discount=${encodeURIComponent(coupon.discount.toString())}`;
              
              console.log(`[Free Order] Redirecting to success page: ${successUrl}`);
              window.location.href = successUrl;
            } else {
              console.error(`[Free Order] Failed to add coaching program:`, coachingResult.error);
              toast.error("There was an issue adding the coaching program to your account.");
            }
          } catch (error) {
            console.error("[Free Order] Error adding coaching program:", error);
            toast.error("There was an error adding the coaching program to your account.");
          }
        } catch (error) {
          console.error("[Free Order] Error recording transaction or coaching program:", error);
        }
      } else {
        console.warn("[Free Order] User not authenticated, skipping transaction and coaching record creation");
        toast.error("You must be logged in to complete this purchase.");
      }
    } catch (error) {
      console.error(`[Free Order] Error processing free order:`, error);
      toast.error(`Error processing your order. Please try again.`);
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = async (
    method: 'razorpay' | 'stripe', 
    coupon: { code: string; discount: number } | null = null,
    convertedPrice?: number,
    currency?: string
  ) => {
    if (!selectedProgram) return;
    
    try {
      console.log(`[Payment Start] Processing ${method} payment for program: ${selectedProgram.title}`);
      
      // Use the coupon passed from the payment modal or the one in state
      const couponToUse = coupon || appliedCoupon;
      
      // Use the converted price if provided, otherwise calculate it
      const finalPrice = convertedPrice || calculateDiscountedPrice(selectedProgram.price, couponToUse);
      const amountInSmallestUnit = Math.round(finalPrice * 100);
      
      // Use the passed currency or fall back to the selected currency
      const paymentCurrency = currency || selectedCurrency;
      
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
        console.log(`[Payment Processing] Initiating Razorpay payment for amount: ${finalPrice} ${paymentCurrency}`);
        paymentResult = await processRazorpayPayment({
          amount: amountInSmallestUnit,
          currency: paymentCurrency,
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
        console.log(`[Payment Processing] Initiating Stripe payment for amount: ${finalPrice} ${paymentCurrency}`);
        paymentResult = await processStripePayment({
          amount: amountInSmallestUnit,
          currency: paymentCurrency.toLowerCase(),
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
              currency: paymentCurrency,
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
              currency: paymentCurrency,
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

  // Function to fetch membership status
  const fetchMembership = async () => {
    if (!user) {
      setIsMember(false);
      return;
    }
    try {
      const res = await getUserProfile(user.uid);
      if (res.success && res.data) {
        setIsMember(!!res.data.isMember);
      } else {
        setIsMember(false);
      }
    } catch (err) {
      console.error("Error fetching membership status", err);
      setIsMember(false);
    }
  };

  // State for coaching programs
  const [displayedPrograms, setDisplayedPrograms] = useState<CoachingProgram[]>([]);

  // Function to fetch coaching programs
  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      // Using static data instead of Firebase - always show 1on1 programs
      const programs = getProgramsByCategory("1on1");
      setDisplayedPrograms(programs);
      setError(null);
    } catch (err) {
      console.error("Error fetching coaching programs:", err);
      setError("Failed to load coaching programs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize programs and membership status
  useEffect(() => {
    fetchPrograms();
    fetchMembership(); // Fetch membership status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only depend on user to avoid dependency array size changes

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
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-12"
            style={{ color: '#245D66' }}
          >
            Our Coaching <span style={{ color: '#245D66' }}>Advantage</span>
          </motion.h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Venn Diagram */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="flex flex-col items-center justify-center">
                {/* Coach Photo */}
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2Fcoachphoto.png?alt=media&token=1a7a3bf2-cd84-4010-b2ef-82b52646af56"
                  alt="Coach photo"
                  width={400}
                  height={400}
                  className="object-contain h-[300px] md:h-[350px] w-auto mb-6 lg:mb-8"
                />
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%2F3circle.png?alt=media&token=95525ca4-f213-4707-99e4-b3853a08e9f9"
                  alt="Coaching Advantage Diagram"
                  width={400}
                  height={400}
                  className="object-contain h-[320px] w-auto"
                  priority
                />
                {/* Venn Diagram Container */}
                <div className="relative w-full h-full flex items-center justify-center hidden">
                  {/* SVG-based Venn Diagram for precise control */}
                  <svg width="320" height="320" viewBox="0 0 320 320" className="absolute inset-0">
                    <defs>
                      {/* Gradient definitions for each circle */}
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8BA89B" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#8BA89B" stopOpacity="0.7" />
                      </linearGradient>
                      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C49799" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#C49799" stopOpacity="0.7" />
                      </linearGradient>
                      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D0C99B" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#D0C99B" stopOpacity="0.7" />
                      </linearGradient>
                    </defs>
                    
                    {/* First Circle - 360° COACHING PERSPECTIVE */}
                    <circle cx="110" cy="130" r="85" fill="url(#grad1)" fillOpacity="0.8" style={{ mixBlendMode: 'multiply' }} />
                    
                    {/* Second Circle - BOTH SIDES OF THE TABLE */}
                    <circle cx="210" cy="130" r="85" fill="url(#grad2)" fillOpacity="0.8" style={{ mixBlendMode: 'multiply' }} />
                    
                    {/* Third Circle - GLOBAL EXCELLENCE STANDARD */}
                    <circle cx="160" cy="210" r="85" fill="url(#grad3)" fillOpacity="0.8" style={{ mixBlendMode: 'multiply' }} />
                  </svg>
                  
                  {/* Main Circle Labels - Positioned inside each circle */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute text-center w-[120px] left-[60px] top-[120px] z-20"
                  >
                    <div className="text-black font-semibold text-sm drop-shadow-md">
                      <div className="uppercase tracking-wider"></div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute text-center w-[120px] right-[60px] top-[120px] z-20"
                  >
                    <div className="text-black font-semibold text-sm drop-shadow-md">
                      <div className="uppercase tracking-wider"></div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="absolute text-center w-[120px] bottom-[70px] left-[50%] transform -translate-x-1/2 z-20"
                  >
                    <div className="text-black font-semibold text-sm drop-shadow-md">
                      <div className="uppercase tracking-wider"></div>
                    </div>
                  </motion.div>
                  
                  {/* Overlapping Areas Text - Positioned in each intersection */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="absolute text-center w-[80px] left-[50%] top-[90px] transform -translate-x-1/2 z-25"
                  >
                    <div className="text-white text-xs font-medium drop-shadow-md">
                      <div className="uppercase">EXPERTISE</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="absolute text-center w-[80px] left-[110px] top-[180px] transform z-25"
                  >
                    <div className="text-white text-xs font-medium drop-shadow-md">
                      <div className="uppercase">METHODOLOGY</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="absolute text-center w-[80px] right-[110px] top-[180px] transform z-25"
                  >
                    <div className="text-white text-xs font-medium drop-shadow-md">
                      <div className="uppercase">STANDARDS</div>
                    </div>
                  </motion.div>
                  
                  {/* Center Overlap - All Three Circles */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="absolute w-[90px] h-[90px] rounded-full bg-white/20 backdrop-blur-sm z-30
                              left-[50%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 
                              flex items-center justify-center border border-white/30"
                  >
                    <div className="text-white text-xs font-bold text-center drop-shadow-md">
                      BEING
                      <br />
                      CONSULTANT
                    </div>
                  </motion.div>
                </div>
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
              1-on-1 coaching programs
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <p className="text-gray-400 mt-4 max-w-xl">
              Personalized coaching tailored to your specific needs
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 px-3 py-1.5 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 backdrop-blur-sm">
                <Globe className="h-4 w-4 text-white/80" />
                <Select
                  value={selectedCurrency}
                  onValueChange={(value) => setSelectedCurrency(value as "USD" | "AED" | "EUR" | "GBP" | "JPY" | "INR" | "CAD")}
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
                    <SelectItem value="AED" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">AED</span>
                        <span className="text-white/70">(د.إ)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="EUR" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">EUR</span>
                        <span className="text-white/70">(€)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="GBP" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">GBP</span>
                        <span className="text-white/70">(£)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="JPY" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">JPY</span>
                        <span className="text-white/70">(¥)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INR" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">INR</span>
                        <span className="text-white/70">(₹)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="CAD" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">CAD</span>
                        <span className="text-white/70">(C$)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coachingPrograms
            .filter(program => program.category === "1on1")
            .map((program) => (
              <motion.div key={program.id} variants={itemVariants} className="group">
                <div className="flex flex-col overflow-hidden rounded-xl border bg-card h-full">
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    {program.title === "Career Strategy Guidance" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2Fcareer%20strategy.jpg?alt=media&token=11ed6c79-4909-4971-8090-77d6bc76b626" 
                        alt="Career Strategy Guidance" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {program.title === "CV/CL Review" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FCV%20review.jpg?alt=media&token=9cf5307f-1fd7-4395-8d91-4be2118d8af3" 
                        alt="CV/CL Review" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {program.title === "Mock Interview" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FMock%20interview.jpg?alt=media&token=25d4cbac-1b36-4335-a3da-8480249acae8" 
                        alt="Mock Interview" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {program.title === "First 100 Days Guidance" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FFirst%20100%20days.jpg?alt=media&token=c1160e37-146f-4cd3-94a7-70cca7acc159" 
                        alt="First 100 Days Guidance" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {program.title === "Career Accelerator Sessions" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FCareer%20Accellerator.jpg?alt=media&token=65384459-9162-4c82-a8ea-88a28f57ab6f" 
                        alt="Career Accelerator Sessions" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {program.title === "Last 100 Days Guidance" && (
                      <Image 
                        src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Product%20Thumbnails%2F1-1%20coaching%2FLast%20100%20days.jpg?alt=media&token=67bb15c5-1edb-4f7c-a17d-0ac8ff687485" 
                        alt="Last 100 Days Guidance" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    {/* Fallback to icons for programs without specific images */}
                    {!["Career Strategy Guidance", "CV/CL Review", "Mock Interview", "First 100 Days Guidance", "Career Accelerator Sessions", "Last 100 Days Guidance"].includes(program.title) && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 to-gray-900 flex items-center justify-center">
                        {program.iconName === "briefcase" && <Briefcase className="h-8 w-8 text-primary" />}
                        {program.iconName === "clock" && <Clock className="h-8 w-8 text-primary" />}
                        {program.iconName === "fileText" && <FileText className="h-8 w-8 text-primary" />}
                        {program.iconName === "fileCheck" && <FileCheck className="h-8 w-8 text-primary" />}
                        {program.iconName === "messageSquare" && <MessageSquare className="h-8 w-8 text-primary" />}
                        {program.iconName === "zap" && <Zap className="h-8 w-8 text-primary" />}
                        {program.iconName === "award" && <Award className="h-8 w-8 text-primary" />}
                        {program.iconName === "users" && <Users className="h-8 w-8 text-primary" />}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold">{program.title}</h3>
                      </div>
                      {program.sessionLength && (
                        <Badge className="bg-blue-500 text-white border-none text-xs whitespace-nowrap">
                          {program.sessionLength}
                        </Badge>
                      )}
                      {program.cohortSize && program.category === "group" && (
                        <Badge className="bg-blue-500 text-white border-none text-xs whitespace-nowrap">
                          {program.cohortSize}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs mb-2">{program.shortDescription}</p>
                    
                    <div className="space-y-1.5 mb-3 flex-grow">
                      {program.features?.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-start gap-1.5">
                          <CheckCircle className="h-3 w-3 text-primary mt-0.5" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {program.bestFor && program.category === "1on1" && (
                      <div className="mb-3 p-1.5 bg-primary/5 rounded-lg">
                        <p className="text-xs"><span className="font-medium">Best For:</span> {program.bestFor}</p>
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
                          {program.originalPrice ? (
                            isMember ? (
                              <div className="flex items-center gap-2">
                                {/* Original converted price struck through */}
                                <span className="text-muted-foreground line-through">{formatPrice(convertPrice(program.price))}</span>
                                {/* Member-discounted converted price */}
                                <span className="text-green-600 font-medium">{formatPrice(calculateDiscountedPrice(convertPrice(program.price)))}</span>
                              </div>
                            ) : (
                              <span className="text-base font-bold">{formatPrice(convertPrice(program.price || 0))}</span>
                            )
                          ) : (
                            <span className="text-base font-bold">{formatPrice(convertPrice(program.price || 0))}</span>
                          )}
                          {program.privateOption && program.category === "group" && (
                            <span className="text-xs text-muted-foreground ml-1">
                              / {formatPrice(convertPrice(program.privatePrice || 0))} (private)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={() => handleViewDetails(program)}
                        >
                          View Details
                        </Button>
                        
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
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Group Programs Section has been removed */}

      {/* Testimonials section removed */}

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about our coaching programs</p>
        </div>
        
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6">
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
          <Button variant="outline" className="flex items-center gap-2 mx-auto" onClick={() => window.location.href = 'mailto:bcplus@beingconsultant.com'}>
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* CTA Section removed as requested */}

      {/* Additional sections can be added here */}
      
      {/* Calendly Booking Flow */}
      {showBookingFlow && selectedProgram && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <CoachingBookingFlow
              programId={selectedProgram.id}
              programName={selectedProgram.title}
              price={selectedProgram.price}
              currency={selectedCurrency}
              onComplete={() => {
                setShowBookingFlow(false);
                toast.success("Booking completed successfully!");
                
                // Clear URL parameters after successful booking
                if (stripePaymentSuccess && window.history && window.history.replaceState) {
                  window.history.replaceState({}, document.title, window.location.pathname);
                }
              }}
              onCancel={() => {
                setShowBookingFlow(false);
                
                // Clear URL parameters when canceling
                if (stripePaymentSuccess && window.history && window.history.replaceState) {
                  window.history.replaceState({}, document.title, window.location.pathname);
                }
              }}
              className=""
              // Pass transaction ID from Stripe if available
              transactionId={stripePaymentSuccess ? stripeTransactionId : undefined}
            />
          </div>
        </div>
      )}
      
      {/* Payment Dialog */}
      <PaymentModal 
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        selectedItem={selectedProgram!}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        onFreeOrderComplete={handleFreeOrderComplete}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={(c)=>setSelectedCurrency(c)}
        conversionRates={conversionRates}
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
            {/* Program Image (optional conditional) */}
            {selectedProgramDetails?.image && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image src={selectedProgramDetails.image} alt={selectedProgramDetails.title} fill className="object-cover" />
              </div>
            )}

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
            {selectedProgramDetails?.description && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-white mb-2">Details</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {selectedProgramDetails.description}
                </p>
              </div>
            )}

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

          <DialogFooter className="mt-6">
            <Button className="bg-primary text-white hover:bg-primary/90 w-full" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
     </div>
  );
}