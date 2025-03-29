"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { addCoachingToUserProfile } from "@/lib/firebase/firestore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronLeft, ArrowRight, Receipt, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import confetti from 'canvas-confetti'

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = "INR") => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount)
}

export default function PaymentSuccessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [transactionDetails, setTransactionDetails] = useState<any>(null)
  
  // Get payment details from URL parameters
  const paymentId = searchParams.get('payment_id') || 
                    searchParams.get('razorpay_payment_id') || 
                    searchParams.get('stripe_payment_id') || 
                    (searchParams.get('product_id') ? `stripe_${Date.now()}_${Math.random().toString(36).substring(2, 15)}` : null);
  
  const paymentMethod = searchParams.get('payment_method') || 
    (searchParams.get('razorpay_payment_id') ? 'Razorpay' : 'Stripe')
  const orderId = searchParams.get('order_id') || searchParams.get('razorpay_order_id')
  const amount = searchParams.get('amount')
  const productId = searchParams.get('product_id')
  const productName = searchParams.get('product_name')
  const productCategory = searchParams.get('category') || searchParams.get('product_category')
  
  // Debug URL parameters
  useEffect(() => {
    console.log("URL Parameters:", {
      paymentId,
      paymentMethod,
      orderId,
      amount,
      productId,
      productName,
      productCategory
    })
    
    // Log all search params for debugging
    const allParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      allParams[key] = value
    })
    console.log("All Search Params:", allParams)
    
    // Set default values for testing if parameters are missing
    if (!paymentId && !orderId && !amount && !productName) {
      setTransactionDetails({
        paymentId: "test_payment_123456",
        paymentMethod: "Test Payment",
        orderId: "test_order_123456",
        amount: 999.99,
        productId: "test_product_123",
        productName: "Test Product"
      })
    }
    
    setLoading(false)
  }, [paymentId, paymentMethod, orderId, amount, productId, productName, productCategory, searchParams])
  
  // Trigger confetti effect on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
      
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }
      
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()
        
        if (timeLeft <= 0) {
          return clearInterval(interval)
        }
        
        const particleCount = 50 * (timeLeft / duration)
        
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
      
      return () => clearInterval(interval)
    }
  }, [])
  
  // Fetch transaction details from Firestore
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        console.log(`[Payment Success] Processing payment with ID: ${paymentId}`);
        console.log(`[Payment Success] User ID: ${user.uid}`);
        console.log(`[Payment Success] Product details:`, {
          productId,
          productName,
          productCategory,
          amount
        });
        
        // If we have product details from URL but no transaction record yet
        if (productId && productName && amount && paymentId) {
          console.log(`[Payment Success] Creating transaction record and coaching entry`);
          
          // Create a new transaction record
          const newTransaction = {
            paymentId,
            paymentMethod,
            orderId,
            amount: parseFloat(amount),
            productId,
            productName,
            status: "completed",
            createdAt: serverTimestamp(),
            userId: user.uid
          };
          
          // Add to user's transactions collection
          const userTransactionsRef = collection(db, "users", user.uid, "transactions");
          await addDoc(userTransactionsRef, newTransaction);
          console.log(`[Payment Success] Transaction record created`);
          
          // Check if this is a coaching program
          const isCoachingProgram = productCategory === 'coaching' || 
                                   productName?.toLowerCase().includes('coaching') || 
                                   productName?.toLowerCase().includes('consult');
          
          if (isCoachingProgram) {
            // If it's a coaching program, add it to the coaching subcollection only
            console.log(`[Payment Success] Detected coaching program: ${productId} - ${productName}`);
            
            try {
              const coachingResult = await addCoachingToUserProfile(user.uid, {
                programId: productId,
                programName: productName,
                amountPaid: parseFloat(amount),
                currency: 'usd',
                transactionId: paymentId,
                paymentMethod: paymentMethod.toLowerCase() === 'razorpay' ? 'razorpay' : 'stripe',
                metadata: {
                  orderId: orderId,
                  productCategory: productCategory || 'coaching'
                }
              });
              
              console.log(`[Payment Success] Coaching record created successfully: ${JSON.stringify(coachingResult)}`);
            } catch (error) {
              console.error("[Payment Error] Error creating coaching record:", error);
            }
          } else {
            // If it's not a coaching program, add it to the products subcollection
            console.log(`[Payment Success] Adding regular product to user library: ${productId} - ${productName}`);
            
            const userProductsRef = collection(db, "users", user.uid, "products");
            await addDoc(userProductsRef, {
              productId,
              productName,
              purchaseDate: serverTimestamp(),
              lastAccessed: serverTimestamp(),
              transactionId: paymentId
            });
            console.log(`[Payment Success] Product added to user library`);
          }
          setTransactionDetails(newTransaction);
        } else if (paymentId && paymentId !== 'pending') {
          // Check if transaction already exists in user's transactions
          const userTransactionsRef = collection(db, "users", user.uid, "transactions");
          const transactionQuery = await getDoc(doc(userTransactionsRef, paymentId));
          
          if (transactionQuery.exists()) {
            setTransactionDetails(transactionQuery.data());
          }
        }
      } catch (error) {
        console.error("[Payment Error] Error processing payment details:", error);
        toast.error("Failed to process payment details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactionDetails()
  }, [user, paymentId, paymentMethod, orderId, amount, productId, productName, productCategory, transactionDetails])
  
  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }
  
  const handleViewOrder = () => {
    router.push('/dashboard/order-history')
  }
  
  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <Clock className="h-12 w-12 animate-pulse text-primary" />
          <h2 className="text-2xl font-bold">Processing your payment...</h2>
          <p className="text-gray-400">Please wait while we confirm your transaction.</p>
        </div>
      </div>
    )
  }
  
  // If no transaction details are available, show an error state
  if (!paymentId && !transactionDetails) {
    return (
      <div className="container py-8 bg-black text-white min-h-screen flex justify-center">
        <div className="w-full max-w-6xl">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="mr-1" size={20} />
            <span className="text-lg font-medium">Back to Dashboard</span>
          </button>
          
          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden w-full">
            <CardHeader className="text-center border-b border-zinc-800 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="mx-auto rounded-full bg-red-500/10 p-4 mb-4">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-3xl font-bold">
                Missing Payment Information
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                We couldn't find payment details for this transaction
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-2">
              <p className="text-gray-300">
                The payment information appears to be missing or incomplete. This could happen if:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                <li>You accessed this page directly without completing a payment</li>
                <li>The payment gateway didn't return the necessary information</li>
                <li>There was an issue with processing your payment</li>
              </ul>
            </CardContent>
            
            <CardFooter className="flex justify-center pt-2 pb-6">
              <Button 
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0"
              >
                Return to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8 bg-black text-white min-h-screen flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Back button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="mr-1" size={20} />
          <span className="text-lg font-medium">Back</span>
        </button>
        
        <Card className="bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 pointer-events-none" />
          
          <CardHeader className="text-center border-b border-zinc-800 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="mx-auto rounded-full bg-emerald-500/10 p-4 mb-4">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Your transaction has been completed successfully
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-2">
            <div className="space-y-6">
              {/* Transaction Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-300">Transaction Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Payment ID</p>
                    <p className="font-medium truncate">
                      {paymentId || transactionDetails?.paymentId || "N/A"}
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                    <p className="font-medium">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {paymentMethod || transactionDetails?.paymentMethod || "N/A"}
                      </Badge>
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Order ID</p>
                    <p className="font-medium truncate">
                      {orderId || transactionDetails?.orderId || "N/A"}
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Amount</p>
                    <p className="font-medium text-emerald-400">
                      {amount ? formatCurrency(parseFloat(amount)) : 
                       transactionDetails?.amount ? formatCurrency(transactionDetails.amount) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-300">Product Details</h3>
                
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Product</p>
                      <p className="font-medium text-lg">
                        {productName || transactionDetails?.productName || "N/A"}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Purchased
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* What's Next */}
              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                <h3 className="text-lg font-medium text-gray-300 mb-2">What's Next?</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Your purchase has been added to your account</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>You can access your purchase from your dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>A receipt has been sent to your email address</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2 pb-6">
            <Button 
              onClick={handleGoToDashboard}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleViewOrder} 
              variant="outline"
              className="w-full sm:w-auto border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50 text-white"
            >
              View Order History
              <Receipt className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
