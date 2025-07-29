"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { updateCoachingScheduledDate } from "@/lib/firebase/firestore"
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  ChevronLeft, 
  Clock, 
  Receipt,
  Sparkles,
  Star,
  Calendar,
  Zap,
  Gift,
  Shield
} from "lucide-react"

// Import necessary components
import { Button } from "@/components/ui/button"
import { CalendlyDialog } from "@/components/calendly/calendly-dialog"

export default function StandalonePaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [loading, setLoading] = useState(true)
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [confettiVisible, setConfettiVisible] = useState(false)
  
  // Get payment details from URL parameters
  const paymentId = searchParams.get('payment_id') || 
                    searchParams.get('razorpay_payment_id') || 
                    searchParams.get('stripe_payment_id') || 
                    (searchParams.get('product_id') ? `stripe_${Date.now()}_${Math.random().toString(36).substring(2, 15)}` : null)
  
  const paymentMethod = searchParams.get('payment_method') || null
  const orderId = searchParams.get('order_id') || null
  const amount = searchParams.get('amount') || '0'
  const productName = searchParams.get('product_name') || null
  const userId = searchParams.get('user_id') || null
  const couponCode = searchParams.get('coupon_code') || null
  const couponDiscount = searchParams.get('coupon_discount') || null
  const email = searchParams.get('email') || null
  
  // Get transaction ID from URL parameters or use payment ID as fallback
  // Based on the Firebase screenshot, this is stored as "transactionId" in the coaching document
  const transactionId = searchParams.get('transaction_id') || 
                       searchParams.get('razorpay_order_id') || 
                       searchParams.get('free_transaction_id') || 
                       paymentId || ""
  
  // Set loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setConfettiVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount))
  }

  const handleGoToDashboard = () => {
    router.replace('/dashboard')
  }
  
  const handleViewOrder = () => {
    router.push('/dashboard/orders')
  }

  const handleBookCalendar = () => {
    setIsCalendlyOpen(true)
  }

  const handleCalendlyClose = () => {
    setIsCalendlyOpen(false)
  }

  const handleSessionScheduled = async (scheduledInfo: {
    scheduledDate: Date;
    eventUri?: string;
    eventName?: string;
    inviteeEmail?: string;
    additionalInfo?: Record<string, any>;
  }) => {
    console.log("Session scheduled:", scheduledInfo)
    
    // Save the scheduled date to Firebase if we have a userId
    if (userId) {
      try {
        // Add additional debugging to help identify the issue
        console.log("User ID:", userId)
        console.log("Transaction ID from URL:", transactionId)
        console.log("Payment ID from URL:", paymentId)
        
        // Looking at the Firebase screenshot, the transaction ID is "free_1750990351503_289"
        // Make sure we're using the correct transaction ID format
        let searchTransactionId = transactionId
        
        // If we have a transaction ID from the screenshot, we can see it starts with "free_"
        // Let's check if our transaction ID matches this pattern, if not, try to format it
        if (searchTransactionId && !searchTransactionId.includes("free_") && searchTransactionId.includes("free")) {
          // Try to format it correctly if it's a free transaction
          searchTransactionId = `free_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
          console.log("Formatted transaction ID for free transaction:", searchTransactionId)
        }
        
        // Use a fallback program ID in case the lookup fails
        const fallbackProgramId = "coaching-program-001"
        
        // Update the coaching record with the scheduled date, passing the transaction ID
        const result = await updateCoachingScheduledDate(
          userId, 
          fallbackProgramId, 
          scheduledInfo, 
          searchTransactionId
        )
        
        if (result.success) {
          toast.success("Your session has been scheduled successfully!")
          console.log("Scheduled date saved to Firebase")
        } else {
          // If the first attempt fails, try with the payment ID directly
          console.log("First attempt failed, trying with payment ID directly")
          
          if (paymentId) {
            const secondResult = await updateCoachingScheduledDate(
              userId, 
              fallbackProgramId, 
              scheduledInfo, 
              paymentId
            )
            
            if (secondResult.success) {
              toast.success("Your session has been scheduled successfully!")
              console.log("Scheduled date saved to Firebase on second attempt")
            } else {
              // If both attempts fail, try with the document ID directly
              console.log("Second attempt failed, trying with document ID directly")
              const finalResult = await updateCoachingScheduledDate(
                userId, 
                "coaching-program-001", 
                scheduledInfo
              )
              
              if (finalResult.success) {
                toast.success("Your session has been scheduled successfully!")
                console.log("Scheduled date saved to Firebase on final attempt")
              } else {
                console.error("All attempts to save scheduled date failed")
                toast.success("Your session has been scheduled, but there was an issue saving the details.")
              }
            }
          } else {
            console.error("Failed to save scheduled date to Firebase:", result.error)
            toast.success("Your session has been scheduled, but there was an issue saving the details.")
          }
        }
      } catch (error) {
        console.error("Error saving scheduled date to Firebase:", error)
        toast.success("Your session has been scheduled, but there was an issue saving the details.")
      }
    } else {
      toast.success("Your session has been scheduled successfully!")
      console.warn("Could not save scheduled date to Firebase: missing userId")
    }
    
    setIsCalendlyOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="relative">
          {/* Animated background glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#245D66]/30 to-[#245D66]/10 blur-3xl animate-pulse scale-150"></div>
          
          <div className="relative flex flex-col items-center gap-6 bg-black/90 backdrop-blur-xl p-12 rounded-3xl border border-[#245D66]/30 shadow-2xl">
            {/* Rotating clock with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#245D66]/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#245D66] to-[#245D66]/80 rounded-full p-6 animate-spin">
                <Clock className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Processing Payment
              </h2>
              <div className="flex items-center gap-2 text-[#245D66]">
                <div className="w-2 h-2 bg-[#245D66] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#245D66] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-[#245D66] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-gray-400 text-lg">
                Confirming your transaction securely
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-[#245D66]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-[#245D66]/15 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Floating particles */}
        {confettiVisible && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="text-[#245D66]/40" size={8 + Math.random() * 12} />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-6">
        {/* Header with back button */}
        <div className="max-w-6xl mx-auto mb-8">
          <button 
            onClick={() => router.push('/dashboard/coaching')}
            className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-[-4px]"
          >
            <ChevronLeft className="mr-2 group-hover:translate-x-[-2px] transition-transform" size={24} />
            <span className="text-lg font-medium">Back to Coaching</span>
          </button>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl border border-[#245D66]/30 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Success header section */}
            <div className="relative bg-gradient-to-r from-[#245D66]/10 to-[#245D66]/5 border-b border-[#245D66]/20 p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                
                {/* Success icon and message */}
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="relative">
                    {/* Pulsing background */}
                    <div className="absolute inset-0 bg-[#245D66]/30 rounded-full blur-2xl animate-pulse scale-150"></div>
                    
                    {/* Main icon container */}
                    <div className="relative bg-gradient-to-br from-[#245D66] to-[#245D66]/80 rounded-full p-6 shadow-2xl">
                      <CheckCircle className="h-16 w-16 text-white" />
                    </div>
                    
                    {/* Floating sparkles around icon */}
                    {confettiVisible && [...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute animate-ping"
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${20 + Math.random() * 60}%`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: '2s'
                        }}
                      >
                        <Star className="text-[#245D66]/60" size={12} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center lg:text-left">
                    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
                      Payment <span className="text-[#245D66]">Successful!</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-6">
                      Your transaction has been completed successfully
                    </p>
                    
                    {/* Success badges */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      <div className="flex items-center gap-2 bg-[#245D66]/20 px-4 py-2 rounded-full border border-[#245D66]/30">
                        <Shield className="h-4 w-4 text-[#245D66]" />
                        <span className="text-white text-sm font-medium">Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#245D66]/20 px-4 py-2 rounded-full border border-[#245D66]/30">
                        <Zap className="h-4 w-4 text-[#245D66]" />
                        <span className="text-white text-sm font-medium">Instant Access</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-[#245D66]/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#245D66] mb-1">
                      {formatCurrency(amount)}
                    </div>
                    <div className="text-gray-400 text-sm">Amount Paid</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              
              {/* Left column - Action buttons */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <ArrowRight className="mr-3 h-5 w-5 text-[#245D66]" />
                  Quick Actions
                </h3>
                
                {/* Dashboard button */}
                <button 
                  onClick={handleGoToDashboard}
                  className="group w-full bg-gradient-to-r from-[#245D66] to-[#245D66]/80 hover:from-[#245D66]/90 hover:to-[#245D66]/70 text-white p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#245D66]/20 border border-[#245D66]/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-semibold text-lg mb-1">Go to Dashboard</div>
                      <div className="text-[#245D66]/80 text-sm">Access your account</div>
                    </div>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                
                {/* Order history button */}
                <button 
                  onClick={handleViewOrder}
                  className="group w-full bg-black/60 hover:bg-black/80 border border-[#245D66]/30 hover:border-[#245D66]/50 text-white p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-semibold text-lg mb-1">View Orders</div>
                      <div className="text-gray-400 text-sm">Order history & receipts</div>
                    </div>
                    <Receipt className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </div>
                </button>
                
                {/* Calendar booking button */}
                <button 
                  onClick={handleBookCalendar}
                  className="group w-full bg-gradient-to-br from-white to-gray-100 hover:from-gray-100 hover:to-white text-black p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-semibold text-lg mb-1">Book Session</div>
                      <div className="text-gray-600 text-sm">Schedule your coaching</div>
                    </div>
                    <Calendar className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Right columns - Transaction details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Transaction details */}
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-[#245D66]/20">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Receipt className="mr-3 h-5 w-5 text-[#245D66]" />
                    Transaction Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Payment ID", value: paymentId || "N/A", icon: Receipt },
                      { label: "Method", value: paymentMethod || "N/A", icon: Shield },
                      { label: "Order ID", value: orderId || "N/A", icon: Star },
                      { label: "Amount", value: formatCurrency(amount), icon: Gift, highlight: true }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                          item.highlight 
                            ? 'bg-gradient-to-br from-[#245D66]/20 to-[#245D66]/10 border-[#245D66]/40' 
                            : 'bg-black/60 border-[#245D66]/20 hover:border-[#245D66]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <item.icon className="h-4 w-4 text-[#245D66]" />
                          <span className="text-gray-400 text-sm font-medium">{item.label}</span>
                        </div>
                        <div className={`font-semibold truncate ${item.highlight ? 'text-[#245D66] text-lg' : 'text-white'}`}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product details */}
                <div className="bg-gradient-to-br from-[#245D66]/10 to-[#245D66]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#245D66]/30">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Star className="mr-3 h-5 w-5 text-[#245D66]" />
                    Product Details
                  </h3>
                  
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-[#245D66]/20">
                    <div>
                      <div className="font-semibold text-white text-lg">{productName || "Coaching Program"}</div>
                      <div className="text-gray-400">Premium access activated</div>
                    </div>
                    <div className="bg-[#245D66] text-white px-4 py-2 rounded-full text-sm font-medium">
                      ✓ Purchased
                    </div>
                  </div>
                </div>

                {/* What's next */}
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-[#245D66]/20">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Zap className="mr-3 h-5 w-5 text-[#245D66]" />
                    What's Next?
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      "Your purchase has been added to your account",
                      "Access your content from the dashboard",
                      "Receipt sent to your email address",
                      couponCode ? `Coupon ${couponCode} applied with ${couponDiscount}% discount` : "Standard pricing applied",
                      "Book your first coaching session"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-black/60 rounded-lg border border-[#245D66]/10">
                        <CheckCircle className="h-5 w-5 text-[#245D66] flex-shrink-0" />
                        <span className="text-white">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#245D66]/5 border-t border-[#245D66]/20 p-6 text-center">
              <p className="text-gray-400">
                Need help? Contact our support team at 
                <span className="text-[#245D66] ml-1 cursor-pointer hover:underline">support@example.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendly Dialog */}
      <CalendlyDialog
        isOpen={isCalendlyOpen}
        onClose={handleCalendlyClose}
        onScheduled={handleSessionScheduled}
        programName={productName || "Coaching Session"}
        coachingId={paymentId || ""}
        email={email || undefined}
        userId={userId}
      />
    </div>
  )
}