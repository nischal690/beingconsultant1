"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  ChevronLeft, 
  Clock, 
  Receipt,
  Sparkles,
  Star
} from "lucide-react"
import { toast } from "sonner"
import { doc, getDoc } from "firebase/firestore"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"

export default function StandalonePaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [loading, setLoading] = useState(true)
  const [transactionDetails, setTransactionDetails] = useState<any>(null)
  
  // Get payment details from URL parameters
  const paymentId = searchParams.get('payment_id') || 
                    searchParams.get('razorpay_payment_id') || 
                    searchParams.get('stripe_payment_id') || 
                    (searchParams.get('product_id') ? `stripe_${Date.now()}_${Math.random().toString(36).substring(2, 15)}` : null)
  
  const paymentMethod = searchParams.get('payment_method') || null
  const orderId = searchParams.get('order_id') || null
  const amount = searchParams.get('amount') || null
  const productName = searchParams.get('product_name') || null
  const userId = searchParams.get('user_id') || null
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Fetch transaction details from Firestore if available
  const fetchTransactionDetails = async () => {
    if (!userId || !paymentId) {
      setLoading(false)
      return
    }
    
    try {
      const transactionRef = doc(db, `users/${userId}/transactions/${paymentId}`)
      const transactionSnap = await getDoc(transactionRef)
      
      if (transactionSnap.exists()) {
        setTransactionDetails(transactionSnap.data())
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching transaction details:", error)
      toast.error("Failed to load transaction details")
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchTransactionDetails()
  }, [paymentId, userId])
  
  const handleGoToDashboard = () => {
    // Use replace instead of push to avoid history stacking
    router.replace('/dashboard')
  }
  
  const handleViewOrder = () => {
    router.push('/dashboard/orders')
  }
  
  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
          <motion.div 
            className="relative flex flex-col items-center gap-4 bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/50 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-16 w-16 text-blue-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Processing your payment...
            </h2>
            <p className="text-gray-400 text-lg">
              Please wait while we confirm your transaction.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }
  
  // If no transaction details are available, show an error state
  if (!paymentId && !transactionDetails) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <motion.button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center text-gray-300 hover:text-white transition-colors mb-4 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="mr-1 group-hover:translate-x-[-2px] transition-transform" size={20} />
            <span className="text-lg font-medium">Back to Dashboard</span>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800/50 shadow-2xl overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
              <CardHeader className="text-center border-b border-zinc-800/50 relative py-4">
                <div className="mx-auto rounded-full bg-red-500/10 p-4 mb-2 shadow-lg shadow-red-500/10">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <AlertCircle className="h-16 w-16 text-red-500" />
                  </motion.div>
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  Missing Payment Information
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg mt-1">
                  We couldn't find payment details for this transaction
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 pb-2 relative">
                <p className="text-gray-300">
                  The payment information appears to be missing or incomplete. This could happen if:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    You accessed this page directly without completing a payment
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    The payment gateway didn't return the necessary information
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    There was an issue with processing your payment
                  </motion.li>
                </ul>
              </CardContent>
              
              <CardFooter className="flex justify-center pt-2 pb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleGoToDashboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg shadow-blue-700/20 transition-all duration-300"
                  >
                    Return to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Star className="text-blue-400/20" size={10 + Math.random() * 10} />
          </motion.div>
        ))}
      </div>
      
      <div className="max-w-4xl w-full relative">
        {/* Back button */}
        <motion.button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-300 hover:text-white transition-colors mb-4 group absolute top-0 left-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="mr-1 group-hover:translate-x-[-2px] transition-transform" size={20} />
          <span className="text-lg font-medium">Back</span>
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <Card className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800/50 shadow-2xl overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Left side - Success message */}
              <div className="md:col-span-1 border-r border-zinc-800/50 p-6 flex flex-col items-center justify-center text-center">
                <motion.div 
                  className="rounded-full bg-blue-500/10 p-4 mb-4 relative shadow-lg shadow-blue-500/10"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.2,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <CheckCircle className="h-16 w-16 text-blue-500" />
                  </motion.div>
                  
                  {/* Animated sparkles */}
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: `${50 + (Math.random() * 50 - 25)}%`,
                        left: `${50 + (Math.random() * 50 - 25)}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    >
                      <Sparkles className="text-blue-400" size={16} />
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Payment</span> Successful!
                  </h2>
                  <p className="text-gray-400">
                    Your transaction has been completed successfully
                  </p>
                  
                  <div className="mt-6 space-y-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Button 
                        onClick={handleGoToDashboard}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-700/20 transition-all duration-300"
                      >
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Button 
                        onClick={handleViewOrder} 
                        variant="outline"
                        className="w-full border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50 text-white rounded-full transition-all duration-300"
                      >
                        View Order History
                        <Receipt className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Right side - Transaction details */}
              <div className="md:col-span-2 p-6">
                <div className="space-y-4">
                  {/* Transaction Details */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h3 className="text-lg font-medium text-white flex items-center">
                      <Receipt className="mr-2 h-4 w-4 text-blue-400" />
                      Transaction Details
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div 
                        className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/30 hover:border-blue-500/30 transition-colors duration-300"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <p className="text-xs text-gray-400 mb-1">Payment ID</p>
                        <p className="font-medium truncate text-white text-sm">
                          {paymentId || transactionDetails?.paymentId || "pending"}
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/30 hover:border-blue-500/30 transition-colors duration-300"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                        <div className="font-medium">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                            {paymentMethod || transactionDetails?.paymentMethod || "N/A"}
                          </Badge>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/30 hover:border-blue-500/30 transition-colors duration-300"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <p className="text-xs text-gray-400 mb-1">Order ID</p>
                        <p className="font-medium truncate text-white text-sm">
                          {orderId || transactionDetails?.orderId || "N/A"}
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/30 hover:border-blue-500/30 transition-colors duration-300"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <p className="text-xs text-gray-400 mb-1">Amount</p>
                        <p className="font-medium text-white text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                          {amount ? formatCurrency(parseFloat(amount)) : 
                           transactionDetails?.amount ? formatCurrency(transactionDetails.amount) : "N/A"}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Product Details */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="text-lg font-medium text-white flex items-center">
                      <Star className="mr-2 h-4 w-4 text-blue-400" />
                      Product Details
                    </h3>
                    
                    <motion.div 
                      className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/30 hover:border-blue-500/30 transition-colors duration-300"
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Product</p>
                          <p className="font-medium text-white">
                            {productName || transactionDetails?.productName || "N/A"}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                          Purchased
                        </Badge>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  {/* What's Next */}
                  <motion.div 
                    className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-lg p-3 border border-zinc-700/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                      <ArrowRight className="mr-2 h-4 w-4 text-blue-400" />
                      What's Next?
                    </h3>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <motion.li 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Your purchase has been added to your account</span>
                      </motion.li>
                      <motion.li 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>You can access your purchase from your dashboard</span>
                      </motion.li>
                      <motion.li 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>A receipt has been sent to your email address</span>
                      </motion.li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
