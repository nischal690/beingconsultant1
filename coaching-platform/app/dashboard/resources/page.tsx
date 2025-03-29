"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, FileText, Lightbulb, Hexagon, BarChart3, Sparkles, Search, Star, ArrowRight, ShoppingCart, X, Plus, Minus, Check, CreditCard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/firebase/auth-context"
import { verifyCoupon, incrementCouponUsage, createTransactionRecord, addProductToUserLibrary, getProductsByCategory } from "@/lib/firebase/firestore"
import { processRazorpayPayment } from "@/lib/payment/razorpay"
import { processStripePayment } from "@/lib/payment/stripe"
import { PaymentModal, PaymentItem } from "@/components/payment/payment-modal";

// Define the resource type
interface Resource {
  id: string
  title: string
  description: string
  shortDescription: string
  icon?: React.ReactNode
  iconName?: string
  category: string
  price: number
  popular?: boolean
  featured?: boolean
  rating?: number
}

// Define cart item type
interface CartItem {
  resource: Resource
  quantity: number
}

// Define coupon type
interface Coupon {
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  product: string;
}

// Map icon names to icon components
const iconMap: Record<string, React.ReactNode> = {
  "brain": <Brain className="h-12 w-12 text-white group-hover:text-primary transition-colors duration-500" />,
  "lightbulb": <Lightbulb className="h-12 w-12 text-white group-hover:text-primary transition-colors duration-500" />,
  "hexagon": <Hexagon className="h-12 w-12 text-white group-hover:text-primary transition-colors duration-500" />,
  "fileText": <FileText className="h-12 w-12 text-white group-hover:text-primary transition-colors duration-500" />,
  "barChart": <BarChart3 className="h-12 w-12 text-white group-hover:text-primary transition-colors duration-500" />,
  "sparkles": <Sparkles className="h-12 w-12 text-white group-hover:text-primary transition-colors duration-500" />,
}

// Fallback resources data in case Firestore fetch fails
const fallbackResources: Resource[] = [
  {
    id: "personality-test",
    title: "Personality Test",
    description: "Take the world's first and only personality test tailored to consulting careers.",
    shortDescription: "Discover your consulting strengths",
    iconName: "brain",
    category: "resources",
    price: 99,
    popular: true,
    featured: true,
    rating: 4.9
  },
  {
    id: "cheatsheet",
    title: "Cheatsheet",
    description: "Our proprietary industry cheatsheet with 20+ industry frameworks.",
    shortDescription: "Master key consulting frameworks",
    iconName: "lightbulb",
    category: "resources",
    price: 79,
    rating: 4.7
  },
  {
    id: "case-bank",
    title: "Case Bank",
    description: "Access to case bank with 300+ practice cases.",
    shortDescription: "Ace your case interviews",
    iconName: "hexagon",
    category: "resources",
    price: 129,
    popular: true,
    featured: true,
    rating: 4.8
  },
  {
    id: "cv-superguide",
    title: "CV Superguide",
    description: "Consulting CV Superguide to craft the perfect CV.",
    shortDescription: "Stand out from the competition",
    iconName: "fileText",
    category: "resources",
    price: 49,
    rating: 4.6
  },
  {
    id: "business-essentials",
    title: "Business Essentials",
    description: "Essential business knowledge and frameworks for consulting interviews.",
    shortDescription: "Core business knowledge",
    iconName: "barChart",
    category: "resources",
    price: 89,
    rating: 4.5
  },
  {
    id: "jumpstart-100",
    title: "Jumpstart 100",
    description: "Guide to thriving in the first 100 days of your consulting career.",
    shortDescription: "Excel in your new role",
    iconName: "brain",
    category: "resources",
    price: 69,
    rating: 4.7
  }
]

// Animation variants
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

const searchBarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.2
    }
  }
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "paid" | "free">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<PaymentItem | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching products with category: Toolkit");
        const result = await getProductsByCategory("Toolkit");
        console.log("Fetch result:", result);
        
        if (result.success && result.data && result.data.length > 0) {
          console.log("Products fetched successfully:", result.data);
          console.log("Number of products:", result.data.length);
          
          // Process the data to ensure it has the right format
          const processedProducts = result.data.map((product: any) => {
            // Create a default title from program field if title is missing
            const title = product.title || product.program || "Untitled Product";
            
            // Create a default description if missing
            const description = product.description || `${title} - A premium consulting resource`;
            
            // Create a default short description if missing
            const shortDescription = product.shortDescription || "Premium consulting resource";
            
            // Default price if missing
            const price = typeof product.price === 'number' ? product.price : 99;
            
            // Default icon name if missing
            const iconName = product.iconName || "brain";
            
            return {
              id: product.id,
              title,
              description,
              shortDescription,
              iconName,
              icon: iconName ? iconMap[iconName] : iconMap.brain,
              category: product.category || "resources",
              price,
              popular: product.popular || false,
              featured: product.featured || false,
              rating: product.rating || 4.5
            };
          });
          
          console.log("Processed products:", processedProducts);
          setResources(processedProducts);
          console.log("Resources state set with processed products");
        } else {
          // No products found or empty result
          console.log("No products found or empty result. Using fallback data.");
          
          // Use fallback resources if fetch returns empty
          const fallbackWithIcons = fallbackResources.map(resource => ({
            ...resource,
            icon: resource.iconName ? iconMap[resource.iconName] : null,
          }));
          
          console.log("Fallback resources:", fallbackWithIcons);
          setResources(fallbackWithIcons);
          setError("No resources found. Using default resources.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("An error occurred while loading resources. Using fallback data.");
        console.log("Using fallback resources due to error:", error);
        // Use fallback resources if fetch fails
        setResources(fallbackResources.map(resource => ({
          ...resource,
          icon: resource.iconName ? iconMap[resource.iconName] : null,
        })));
      } finally {
        setIsLoading(false);
        console.log("Loading state set to false");
      }
    };
    
    fetchProducts();
  }, []);

  // Set loaded state after initial render for animations
  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Filter resources based on category and search query
  const filteredResources = resources.filter(resource => 
    (filter === "all" || resource.category === filter) &&
    (searchQuery === "" || 
     resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Featured resources
  const featuredResources = resources.filter(resource => resource.featured)

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.resource.price * item.quantity), 0)
  
  // Add item to cart
  const addToCart = (resource: Resource) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.resource.id === resource.id)
      
      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const newCart = [...prevCart]
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1
        }
        toast.success(`Added another ${resource.title} to cart`)
        return newCart
      } else {
        // Item doesn't exist, add new item
        toast.success(`${resource.title} added to cart`)
        return [...prevCart, { resource, quantity: 1 }]
      }
    })
    
    // Open cart when adding first item
    if (cart.length === 0) {
      setIsCartOpen(true)
    }
  }
  
  // Remove item from cart
  const removeFromCart = (resourceId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.resource.id === resourceId)
      
      if (existingItemIndex >= 0) {
        const item = prevCart[existingItemIndex]
        
        if (item.quantity > 1) {
          // Decrease quantity if more than 1
          const newCart = [...prevCart]
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity - 1
          }
          return newCart
        } else {
          // Remove item if quantity is 1
          return prevCart.filter(item => item.resource.id !== resourceId)
        }
      }
      
      return prevCart
    })
  }
  
  // Delete item completely from cart
  const deleteFromCart = (resourceId: string) => {
    setCart(prevCart => prevCart.filter(item => item.resource.id !== resourceId))
    toast.info("Item removed from cart")
  }
  
  // Clear cart
  const clearCart = () => {
    setCart([])
    toast.info("Cart cleared")
  }
  
  // Check if resource is in cart
  const isInCart = (resourceId: string) => {
    return cart.some(item => item.resource.id === resourceId)
  }
  
  // Handle buy now click
  const handleBuyNow = (resource: Resource) => {
    console.log("Buy Now clicked for:", resource.title);
    setSelectedResource({ 
      id: resource.id, 
      title: resource.title, 
      description: resource.shortDescription || resource.description,
      price: resource.price,
      shortDescription: resource.shortDescription
    });
    // Use the custom modal instead
    setShowCustomModal(true);
  }
  
  // Handle checkout from cart
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // Create a combined item for the payment modal
    const combinedItem: PaymentItem = {
      id: 'cart-checkout',
      title: 'Cart Checkout',
      description: `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`,
      price: cartTotal,
      shortDescription: cart.map(item => item.resource.title).join(', ')
    };
    
    setSelectedResource(combinedItem);
    setShowCustomModal(true);
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = async (method: 'razorpay' | 'stripe') => {
    if (!selectedResource) return
    if (!user) {
      toast.error("Please sign in to make a purchase");
      return;
    }
    
    try {
      // Calculate the final price after discount
      const finalPrice = calculateDiscountedPrice(selectedResource.price);
      const amountInSmallestUnit = method === 'razorpay' 
        ? Math.round(finalPrice * 100) // Razorpay uses paise for INR
        : Math.round(finalPrice * 100); // Stripe uses cents for USD
      
      // Prepare metadata for the payment
      const metadata: Record<string, string> = {
        resourceId: selectedResource.id,
        resourceTitle: selectedResource.title,
        documentId: selectedResource.id, // Store the document ID
      };
      
      // Add coupon information to metadata if applied
      if (appliedCoupon) {
        metadata.couponCode = appliedCoupon.code;
        metadata.discountApplied = `${appliedCoupon.discount}${appliedCoupon.discountType === 'percentage' ? '%' : ' fixed'}`;
      }
      
      let paymentResult;
      
      if (method === 'razorpay') {
        // Process Razorpay payment
        paymentResult = await processRazorpayPayment({
          amount: amountInSmallestUnit,
          currency: 'USD',
          name: "Being Consultant",
          description: `Payment for ${selectedResource.title}`,
          prefill: {
            name: user?.displayName || '',
            email: user?.email || '',
          },
          notes: metadata,
          theme: {
            color: '#245D66'
          }
        });
      } else {
        // Process Stripe payment
        paymentResult = await processStripePayment({
          amount: amountInSmallestUnit,
          currency: 'usd',
          productName: selectedResource.title,
          productDescription: selectedResource.description,
          customerEmail: user?.email || undefined,
          metadata
        });
      }
      
      // Determine if this is a cart checkout or single item purchase
      const isCartCheckout = selectedResource.id === 'cart-checkout';
      
      // Create transaction record regardless of success or failure
      await createTransactionRecord(user.uid, {
        transactionId: paymentResult.transactionId || `failed-${Date.now()}`,
        amount: finalPrice,
        currency: method === 'razorpay' ? 'USD' : 'USD',
        status: paymentResult.success ? 'successful' : 'failed',
        paymentMethod: method,
        productId: selectedResource.id,
        productTitle: selectedResource.title,
        documentId: selectedResource.id, // Store the document ID
        ...(appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}),
        ...(appliedCoupon?.discount ? { couponDiscount: appliedCoupon.discount } : {}),
        ...(appliedCoupon?.discountType ? { couponDiscountType: appliedCoupon.discountType } : {}),
        ...(paymentResult.error?.message ? { errorMessage: paymentResult.error.message } : {}),
        metadata: {
          ...metadata,
          isCartCheckout: isCartCheckout ? 'true' : 'false',
          itemCount: isCartCheckout ? cart.length.toString() : '1'
        }
      });
      
      if (paymentResult.success) {
        // If payment is successful, increment coupon usage
        if (appliedCoupon) {
          await incrementCouponUsage(appliedCoupon.code);
        }
        
        // Add product(s) to user's library
        if (isCartCheckout) {
          // Add each cart item to user's library
          for (const item of cart) {
            await addProductToUserLibrary(user.uid, {
              productId: item.resource.id,
              productTitle: item.resource.title,
              productCategory: item.resource.category,
              transactionId: paymentResult.transactionId,
              paymentId: paymentResult.transactionId,
              documentId: item.resource.id, // Store the document ID
              price: item.resource.price * item.quantity,
              currency: method === 'razorpay' ? 'USD' : 'USD',
              metadata: {
                quantity: item.quantity,
                originalPrice: item.resource.price,
                description: item.resource.description,
                shortDescription: item.resource.shortDescription,
                fromCart: true,
                documentId: item.resource.id // Also store in metadata
              }
            });
          }
          
          // Clear cart after successful purchase
          setCart([]);
          setIsCartOpen(false);
        } else {
          // Add single product to user's library
          await addProductToUserLibrary(user.uid, {
            productId: selectedResource.id,
            productTitle: selectedResource.title,
            productCategory: selectedResource.id.includes('-') ? selectedResource.id.split('-')[0] : 'resource',
            transactionId: paymentResult.transactionId,
            paymentId: paymentResult.transactionId,
            documentId: selectedResource.id, // Store the document ID
            price: finalPrice,
            currency: method === 'razorpay' ? 'USD' : 'USD',
            metadata: {
              originalPrice: selectedResource.price,
              description: selectedResource.description,
              shortDescription: selectedResource.shortDescription,
              fromCart: false,
              documentId: selectedResource.id // Also store in metadata
            }
          });
        }
        
        // Show success message
        toast.success(`Payment successful! Transaction ID: ${paymentResult.transactionId}`);
        
        // Close the dialog
        setShowCustomModal(false);
        
        // Reset coupon state after payment
        setCouponCode("");
        setAppliedCoupon(null);
        setCouponError(null);
      } else {
        // Handle payment failure
        toast.error(`Payment failed: ${paymentResult.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error processing ${method} payment:`, error);
      toast.error(`Error processing payment. Please try again.`);
      
      // Record failed transaction due to exception
      if (user) {
        try {
          await createTransactionRecord(user.uid, {
            transactionId: `error-${Date.now()}`,
            amount: calculateDiscountedPrice(selectedResource.price),
            currency: method === 'razorpay' ? 'USD' : 'USD',
            status: 'failed',
            paymentMethod: method,
            productId: selectedResource.id,
            productTitle: selectedResource.title,
            documentId: selectedResource.id, // Store the document ID
            ...(appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}),
            ...(appliedCoupon?.discount ? { couponDiscount: appliedCoupon.discount } : {}),
            ...(appliedCoupon?.discountType ? { couponDiscountType: appliedCoupon.discountType } : {}),
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            metadata: {
              isCartCheckout: selectedResource.id === 'cart-checkout' ? 'true' : 'false',
              errorType: 'exception',
              documentId: selectedResource.id // Also store in metadata
            }
          });
        } catch (recordError) {
          console.error("Failed to record transaction error:", recordError);
        }
      }
    }
  }
  
  // Handle applying coupon code
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code")
      return
    }
    
    if (!selectedResource) {
      toast.error("No product selected")
      return
    }
    
    setIsApplyingCoupon(true)
    setCouponError(null)
    
    try {
      // Verify coupon from Firestore
      const result = await verifyCoupon(couponCode, selectedResource.id);
      
      if (result.success && result.data) {
        setAppliedCoupon(result.data);
        toast.success(`Coupon applied! ${result.data.discount}% discount`);
      } else {
        setAppliedCoupon(null);
        setCouponError(result.error || "Invalid coupon code");
        toast.error(result.error || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Error applying coupon");
      setCouponError("Error applying coupon");
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  }
  
  // Calculate discounted price
  const calculateDiscountedPrice = (price: number): number => {
    if (!appliedCoupon) return price;
    
    if (appliedCoupon.discountType === "percentage") {
      const discountAmount = (price * appliedCoupon.discount) / 100;
      return price - discountAmount;
    } else {
      // Fixed discount
      return Math.max(0, price - appliedCoupon.discount);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -inset-[10%] opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '20s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '25s' }}></div>
        </div>
        
        {/* Interactive cursor light effect */}
        <div 
          className="pointer-events-none fixed opacity-20 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-white/10 to-white/5 blur-3xl"
          style={{
            left: `${mousePosition.x - 200}px`,
            top: `${mousePosition.y - 200}px`,
            transition: 'transform 0.2s ease-out',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Left sidebar and main content layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full md:w-[250px] bg-black/40 backdrop-blur-lg p-4 rounded-lg border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 animate-gradient-x">Browse resources</h3>
              
              {/* Cart button with counter */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 bg-black/40 border border-white/10 rounded-full hover:bg-white/10"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </div>
            
            {/* Cart panel */}
            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-black/60 border border-white/10 rounded-lg p-3 backdrop-blur-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" /> Your Cart
                      </h4>
                      {cart.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                          onClick={clearCart}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    
                    {cart.length === 0 ? (
                      <div className="text-center py-4 text-white/50 text-sm">
                        Your cart is empty
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 mb-3">
                          {cart.map(item => (
                            <div 
                              key={`cart-${item.resource.id}`}
                              className="flex items-center justify-between bg-black/40 p-2 rounded-md border border-white/5"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{item.resource.title}</div>
                                <div className="text-[10px] text-white/50">${item.resource.price} × {item.quantity}</div>
                              </div>
                              
                              <div className="flex items-center gap-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                                  onClick={() => removeFromCart(item.resource.id)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-xs w-4 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                                  onClick={() => addToCart(item.resource)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-full ml-1"
                                  onClick={() => deleteFromCart(item.resource.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t border-white/10 pt-3">
                          <div className="flex justify-between items-center text-sm mb-3">
                            <span>Total:</span>
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                              ${cartTotal.toFixed(2)}
                            </span>
                          </div>
                          
                          <Button 
                            className="w-full bg-[#245D66] text-white hover:bg-black hover:text-white border border-[#245D66] shadow-lg hover:shadow-[0_0_15px_rgba(36,93,102,0.4)] transition-all duration-300 relative overflow-hidden"
                            onClick={handleCheckout}
                          >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#245D66]/0 via-[#245D66]/10 to-[#245D66]/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                            <span className="relative z-10">Checkout</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-white/60 mb-2 flex items-center gap-1">
                  Resource Type <span className="inline-block w-1 h-1 rounded-full bg-white/60"></span>
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input 
                      type="radio" 
                      name="resourceType" 
                      checked={filter === "all"}
                      onChange={() => setFilter("all")}
                      className="accent-white"
                    />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input 
                      type="radio" 
                      name="resourceType" 
                      checked={filter === "paid"}
                      onChange={() => setFilter("paid")}
                      className="accent-white"
                    />
                    <span>Paid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input 
                      type="radio" 
                      name="resourceType" 
                      checked={filter === "free"}
                      onChange={() => setFilter("free")}
                      className="accent-white"
                    />
                    <span>Free</span>
                  </label>
                </div>
              </div>
              
              {/* Featured section in sidebar */}
              <div className="mt-8">
                <h4 className="text-sm text-white/60 mb-3 flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span>Featured Resources</span>
                </h4>
                <div className="space-y-3">
                  {featuredResources.map(resource => (
                    <div 
                      key={`featured-${resource.id}`} 
                      className="group p-2 rounded-md hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <div className="text-xs font-medium group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                        {resource.shortDescription}
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">{resource.title}</h3>
                      <div className="text-[10px] text-white/50">${resource.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x">Toolkit to Ace your Interviews</h1>
                  <p className="text-white/70">End-to-end support and curated resources to help you crack your dream role</p>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-transparent border border-white/20 text-white hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    See how to buy Toolkits
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
              
              {/* Search bar */}
              <motion.div 
                className="mb-8 relative"
                variants={searchBarVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-white/50 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-6 bg-black/40 border-white/10 rounded-full w-full focus:border-white/30 focus:ring-white/10 text-white placeholder:text-white/50"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 text-white/70 hover:text-white"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="text-white/70 text-lg">Loading resources...</p>
                </div>
              )}

              {/* Error message */}
              {error && !isLoading && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <AnimatePresence>
                {!isLoading && filteredResources.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <Search className="mx-auto h-12 w-12 text-white/20 mb-4" />
                    <p className="text-white/60 text-lg">No resources found matching your search.</p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-transparent border border-white/20 hover:bg-white/10"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                  >
                    {filteredResources.map((resource) => (
                      <motion.div
                        key={resource.id}
                        variants={itemVariants}
                        className="group"
                        whileHover={{ 
                          y: -5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Card className="overflow-hidden h-full border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] group-hover:border-white/30 animate-pulse-glow">
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <CardContent className="p-6 relative">
                            {resource.popular && (
                              <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-black px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-lg">
                                POPULAR
                              </div>
                            )}
                            <div className="mb-4 relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"></div>
                              {resource.icon}
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
                                {resource.shortDescription}
                              </div>
                              <h3 className="text-lg font-semibold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">{resource.title}</h3>
                              <p className="text-white/60 text-sm">{resource.description}</p>
                              
                              {/* Rating */}
                              {resource.rating && (
                                <div className="flex items-center mt-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-3 w-3 ${i < Math.floor(resource.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-2 text-xs text-white/60">{resource.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                ${resource.price}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="px-6 pb-6 pt-0">
                            {isInCart(resource.id) ? (
                              <Button 
                                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                                onClick={() => removeFromCart(resource.id)}
                              >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                                <span className="relative z-10 flex items-center gap-2">
                                  <Check className="h-4 w-4" />
                                  In Cart
                                </span>
                              </Button>
                            ) : (
                              <div className="grid grid-cols-2 gap-2 w-full">
                                <Button 
                                  className="bg-black hover:bg-white text-white hover:text-black border border-white/20 hover:border-white shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                                  onClick={() => addToCart(resource)}
                                >
                                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                                  <span className="flex items-center gap-1 relative z-10">
                                    <ShoppingCart className="h-3 w-3" />
                                    Add to Cart
                                  </span>
                                </Button>
                                <Button 
                                  className="bg-[#245D66] text-white hover:bg-black hover:text-white border border-[#245D66] shadow-lg hover:shadow-[0_0_15px_rgba(36,93,102,0.4)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                                  onClick={() => handleBuyNow(resource)}
                                >
                                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#245D66]/0 via-[#245D66]/10 to-[#245D66]/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></span>
                                  <span className="flex items-center gap-1 relative z-10">
                                    <Sparkles className="h-3 w-3" />
                                    Buy Now
                                  </span>
                                </Button>
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Payment Modal */}
      {showCustomModal && selectedResource && (
        <PaymentModal 
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          selectedItem={selectedResource}
          onPaymentMethodSelect={handlePaymentMethodSelect}
          currencySymbol="$"
          currencyCode="USD"
        />
      )}
      
      {/* Keep the original Dialog component but don't use it */}
      <Dialog 
        open={false} 
        onOpenChange={() => {}}
      >
        <DialogContent className="hidden">
          <div></div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
