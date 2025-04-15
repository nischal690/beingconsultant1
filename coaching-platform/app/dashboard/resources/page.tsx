"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Brain,
  FileText, 
  Lightbulb, 
  Hexagon, 
  BarChart3, 
  Sparkles, 
  Search, 
  Star, 
  ArrowRight, 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Check, 
  CreditCard, 
  Info
} from "lucide-react"
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

// Define the resource type
interface Resource {
  id: string
  title: string
  description: string
  shortDescription: string
  icon: React.ReactNode
  category: "all" | "paid" | "free"
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

// Resource data
const resources: Resource[] = [
  {
    id: "personality-test",
    title: "Personality Test",
    description: "Take the world's first and only personality test tailored to consulting careers.",
    shortDescription: "Discover your consulting strengths",
    icon: <Brain className="h-12 w-12 text-black group-hover:text-primary transition-colors duration-500" />,
    category: "paid",
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
    icon: <Lightbulb className="h-12 w-12 text-black group-hover:text-primary transition-colors duration-500" />,
    category: "paid",
    price: 79,
    rating: 4.7
  },
  {
    id: "case-bank",
    title: "Case Bank",
    description: "Access to case bank with 300+ practice cases.",
    shortDescription: "Ace your case interviews",
    icon: <Hexagon className="h-12 w-12 text-black group-hover:text-primary transition-colors duration-500" />,
    category: "paid",
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
    icon: <FileText className="h-12 w-12 text-black group-hover:text-primary transition-colors duration-500" />,
    category: "paid",
    price: 49,
    rating: 4.6
  },
  {
    id: "business-essentials",
    title: "Business Essentials",
    description: "Essential business knowledge and frameworks for consulting interviews.",
    shortDescription: "Core business knowledge",
    icon: <BarChart3 className="h-12 w-12 text-black group-hover:text-primary transition-colors duration-500" />,
    category: "paid",
    price: 89,
    rating: 4.5
  },
  {
    id: "jumpstart-100",
    title: "Jumpstart 100",
    description: "Guide to thriving in the first 100 days of your consulting career.",
    shortDescription: "Excel in your new role",
    icon: <Brain className="h-12 w-12 text-black group-hover:text-primary transition-colors duration-500" />,
    category: "paid",
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

// Custom Resource Card component
function ResourceCard({ 
  resource, 
  addToCart, 
  removeFromCart, 
  isInCart, 
  handleBuyNow,
  setSelectedResource,
  setShowResourceDetailsDialog
}: { 
  resource: Resource; 
  addToCart: (resource: Resource) => void; 
  removeFromCart: (resourceId: string) => void; 
  isInCart: (resourceId: string) => boolean; 
  handleBuyNow: (resource: Resource) => void;
  setSelectedResource: (resource: Resource) => void;
  setShowResourceDetailsDialog: (show: boolean) => void;
}) {
  return (
    <div className="h-full overflow-hidden border border-white/10 bg-white text-black backdrop-blur-md hover:bg-white transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] group-hover:border-white/30 animate-pulse-glow cursor-pointer rounded-lg">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="p-6 relative bg-white">
        {resource.popular && (
          <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-black px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-lg">
            POPULAR
          </div>
        )}
        <div className="mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"></div>
          <div className="h-12 w-12 text-black group-hover:text-primary transition-colors duration-500">
            {resource.icon}
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
            {resource.shortDescription}
          </div>
          <h3 className="text-lg font-semibold resource-card-title" style={{ color: 'black' }}>{resource.title}</h3>
          <p className="resource-card-description" style={{ color: 'rgba(0,0,0,0.7)' }}>{resource.description}</p>
          
          {/* Rating */}
          {resource.rating && (
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(resource.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-black/20'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-xs" style={{ color: 'rgba(0,0,0,0.6)' }}>{resource.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-2xl font-bold resource-card-price" style={{ color: 'black' }}>
            ${resource.price}
          </div>
          <div 
            className="flex items-center gap-1 text-black hover:text-gray-700 cursor-pointer group/details"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedResource(resource);
              setShowResourceDetailsDialog(true);
            }}
          >
            <span className="font-medium">View Details</span>
            <ArrowRight className="h-3 w-3 group-hover/details:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 pt-0 bg-white">
        {isInCart(resource.id) ? (
          <Button 
            className="w-full bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              removeFromCart(resource.id);
            }}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100/0 via-gray-100/50 to-gray-100/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10 flex items-center gap-2 text-black">
              <Check className="h-4 w-4" />
              In Cart
            </span>
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              className="bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(resource);
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100/0 via-gray-100/50 to-gray-100/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="flex items-center gap-1 relative z-10 text-black">
                <ShoppingCart className="h-3 w-3" />
                Add to Cart
              </span>
            </Button>
            <Button 
              className="bg-[#245D66] text-white hover:bg-black hover:text-white border border-[#245D66] shadow-lg hover:shadow-[0_0_15px_rgba(36,93,102,0.4)] transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow(resource);
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#245D66]/0 via-[#245D66]/10 to-[#245D66]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="flex items-center gap-1 relative z-10">
                <Sparkles className="h-3 w-3" />
                Buy Now
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [filter, setFilter] = useState<"all" | "paid" | "free">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showResourceDetailsDialog, setShowResourceDetailsDialog] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [showToolkitDialog, setShowToolkitDialog] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'stripe' | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Add a style tag to force black text
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .resource-card-title {
        color: black !important;
      }
      .resource-card-description {
        color: rgba(0, 0, 0, 0.7) !important;
      }
      .resource-card-price {
        color: black !important;
      }
      .dialog-title {
        color: black !important;
      }
      .dialog-heading {
        color: black !important;
      }
      .dialog-text {
        color: black !important;
      }
      .dialog-text-muted {
        color: rgba(0, 0, 0, 0.7) !important;
      }
      .dialog-content h3 {
        color: black !important;
      }
      .dialog-content span {
        color: black !important;
      }
      .dialog-content p {
        color: rgba(0, 0, 0, 0.7) !important;
      }
    `;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);
  
  // Set loaded state after initial render for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  // Handle mouse move for interactive effects
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // Filter resources based on search query and filter
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Apply category filter
      if (filter !== "all" && resource.category !== filter) {
        return false
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.shortDescription.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }, [filter, searchQuery])
  
  // Featured resources
  const featuredResources = useMemo(() => {
    return resources.filter(resource => resource.featured)
  }, [])
  
  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.resource.price * item.quantity), 0)
  }, [cart])
  
  // Add item to cart
  const addToCart = (resource: Resource) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.resource.id === resource.id)
      
      if (existingItemIndex >= 0) {
        // Item already in cart, increase quantity
        const newCart = [...prevCart]
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1
        }
        return newCart
      } else {
        // Add new item to cart
        return [...prevCart, { resource, quantity: 1 }]
      }
    })
    
    toast.success(`Added ${resource.title} to cart`)
  }
  
  // Remove item from cart
  const removeFromCart = (resourceId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.resource.id === resourceId)
      
      if (existingItemIndex >= 0) {
        const newCart = [...prevCart]
        const currentItem = newCart[existingItemIndex]
        
        if (currentItem.quantity > 1) {
          // Decrease quantity
          newCart[existingItemIndex] = {
            ...currentItem,
            quantity: currentItem.quantity - 1
          }
          return newCart
        } else {
          // Remove item if quantity would be 0
          return newCart.filter(item => item.resource.id !== resourceId)
        }
      }
      
      return prevCart
    })
  }
  
  // Delete item completely from cart
  const deleteFromCart = (resourceId: string) => {
    setCart(prevCart => prevCart.filter(item => item.resource.id !== resourceId))
  }
  
  // Clear cart
  const clearCart = () => {
    setCart([])
  }
  
  // Check if resource is in cart
  const isInCart = (resourceId: string) => {
    return cart.some(item => item.resource.id === resourceId)
  }
  
  // Handle buy now click
  const handleBuyNow = (resource: Resource) => {
    setSelectedResource(resource)
    setShowCustomModal(true)
  }
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method: 'razorpay' | 'stripe') => {
    setSelectedPaymentMethod(method)
    
    // Here you would typically handle the payment process
    // For demo purposes, we'll just show a success message
    toast.success(`Processing payment via ${method}...`, {
      duration: 2000,
    })
    
    setTimeout(() => {
      setShowCustomModal(false)
      toast.success("Payment successful! Resource added to your library.", {
        duration: 5000,
      })
    }, 2000)
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
                          >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#245D66]/0 via-[#245D66]/10 to-[#245D66]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
                        {resource.title}
                      </div>
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
                  onClick={() => setShowToolkitDialog(true)}
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
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-md -z-10"></div>
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

              <AnimatePresence>
                {filteredResources.length === 0 ? (
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
                        <ResourceCard 
                          resource={resource} 
                          addToCart={addToCart} 
                          removeFromCart={removeFromCart} 
                          isInCart={isInCart} 
                          handleBuyNow={handleBuyNow}
                          setSelectedResource={setSelectedResource}
                          setShowResourceDetailsDialog={setShowResourceDetailsDialog}
                        />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowCustomModal(false)}
          />
          
          {/* Modal Content */}
          <div className="sm:max-w-md w-full bg-black/95 border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] text-white max-w-2xl">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-24 -left-32 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
            
            {/* Top highlight border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            {/* Close button */}
            <button 
              className="absolute right-4 top-4 text-white/70 hover:text-white"
              onClick={() => setShowCustomModal(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            
            {/* Header */}
            <div className="flex flex-col space-y-1.5 text-center sm:text-left relative z-10">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x tracking-tight">
                Complete Your Purchase
              </h2>
              
              <div className="mt-3 relative">
                <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/40 via-white/10 to-transparent"></div>
                <p className="font-medium text-white text-lg pl-2">{selectedResource.title}</p>
                <p className="text-sm text-white/60 pl-2">{selectedResource.shortDescription}</p>
                <div className="mt-3 flex items-baseline">
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 pl-2">
                    ${selectedResource.price}
                  </p>
                  <span className="text-xs text-white/40 ml-2">USD</span>
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div className="space-y-4 py-5 relative z-10">
              <div className="text-sm font-medium text-white/80 mb-3 flex items-center">
                <span className="w-4 h-[1px] bg-white/30 mr-2"></span>
                Select a payment method
                <span className="w-4 h-[1px] bg-white/30 ml-2"></span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => handlePaymentMethodSelect('razorpay')}
                  className="group flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  
                  <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-md shadow-lg relative z-10">
                    <img 
                      src="https://razorpay.com/favicon.png" 
                      alt="Razorpay" 
                      className="h-7 w-7 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='14' x='2' y='5' rx='2'/%3E%3Cline x1='2' x2='22' y1='10' y2='10'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className="font-medium text-white group-hover:text-white transition-colors">Razorpay</div>
                    <div className="text-xs text-white/60">Pay using UPI, cards, or net banking</div>
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 bg-white/5 relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </button>
                
                <button 
                  onClick={() => handlePaymentMethodSelect('stripe')}
                  className="group flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  
                  <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 rounded-md shadow-lg relative z-10">
                    <img 
                      src="https://stripe.com/favicon.ico" 
                      alt="Stripe" 
                      className="h-7 w-7 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='14' x='2' y='5' rx='2'/%3E%3Cline x1='2' x2='22' y1='10' y2='10'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className="font-medium text-white group-hover:text-white transition-colors">Stripe</div>
                    <div className="text-xs text-white/60">Pay using credit/debit cards</div>
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 bg-white/5 relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between border-t border-white/10 pt-4 relative z-10">
              <button 
                className="mt-3 sm:mt-0 px-4 py-2 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 rounded-md"
                onClick={() => setShowCustomModal(false)}
              >
                Cancel
              </button>
              <div className="flex items-center text-xs text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Secure payment processing
              </div>
            </div>
            
            {/* Bottom highlight border */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      )}
      
      {/* How to Buy Toolkit Dialog */}
      <Dialog open={showToolkitDialog} onOpenChange={setShowToolkitDialog}>
        <DialogContent className="bg-gradient-to-b from-black/95 to-[#245D66]/20 border border-white/10 shadow-[0_0_50px_rgba(36,93,102,0.3)] text-white max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden backdrop-blur-xl">
          {/* Decorative elements */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-b from-[#245D66]/30 to-transparent rounded-full blur-2xl opacity-60"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-t from-[#245D66]/30 to-transparent rounded-full blur-2xl opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
          
          {/* Top highlight border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          {/* Close button */}
          <button 
            className="absolute right-4 top-4 text-white/70 hover:text-white"
            onClick={() => setShowToolkitDialog(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          
          {/* Header */}
          <div className="flex flex-col space-y-1.5 text-center sm:text-left relative z-10">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#245D66] to-white animate-gradient-x tracking-tight">
              How to Buy the Toolkit
            </h2>
            
            <div className="mt-3 relative">
              <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/40 via-white/10 to-transparent"></div>
              <p className="font-medium text-white text-lg pl-2">Your gateway to consulting excellence</p>
            </div>
          </div>
          
          {/* Body */}
          <div className="space-y-4 py-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/20 to-transparent rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative p-4 rounded-xl border border-white/10 hover:border-[#245D66]/50 transition-all duration-300 bg-white/5">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#245D66] to-[#245D66]/50 flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                      <span className="text-white font-medium">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base mb-1 group-hover:text-[#245D66] transition-colors">Browse Resources</h3>
                      <p className="text-xs text-white/70">Explore our curated collection of premium consulting resources.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/20 to-transparent rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative p-4 rounded-xl border border-white/10 hover:border-[#245D66]/50 transition-all duration-300 bg-white/5">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#245D66] to-[#245D66]/50 flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                      <span className="text-white font-medium">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base mb-1 group-hover:text-[#245D66] transition-colors">Select Items</h3>
                      <p className="text-xs text-white/70">Choose from our premium toolkit items for maximum value.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/20 to-transparent rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative p-4 rounded-xl border border-white/10 hover:border-[#245D66]/50 transition-all duration-300 bg-white/5">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#245D66] to-[#245D66]/50 flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                      <span className="text-white font-medium">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base mb-1 group-hover:text-[#245D66] transition-colors">Secure Payment</h3>
                      <p className="text-xs text-white/70">Experience hassle-free transactions with trusted partners.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/20 to-transparent rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative p-4 rounded-xl border border-white/10 hover:border-[#245D66]/50 transition-all duration-300 bg-white/5">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#245D66] to-[#245D66]/50 flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                      <span className="text-white font-medium">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base mb-1 group-hover:text-[#245D66] transition-colors">Instant Access</h3>
                      <p className="text-xs text-white/70">Access your resources immediately in your dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-2">
              <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/20 via-[#245D66]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-r from-[#245D66]/10 to-transparent border border-[#245D66]/30 rounded-xl p-4 relative">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#245D66]/20 flex items-center justify-center flex-shrink-0">
                    <Info className="h-4 w-4 text-[#245D66]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1.5">Premium Benefits</h3>
                    <ul className="space-y-1">
                      <li className="text-xs text-white/70 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#245D66]"></div>
                        Lifetime access to purchased resources
                      </li>
                      <li className="text-xs text-white/70 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#245D66]"></div>
                        Regular content updates at no extra cost
                      </li>
                      <li className="text-xs text-white/70 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#245D66]"></div>
                        Priority support for all toolkit users
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="relative z-10 space-x-2 pt-2">
            <Button 
              onClick={() => setShowToolkitDialog(false)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowToolkitDialog(false)
                const resourcesSection = document.getElementById('resources-section')
                if (resourcesSection) {
                  resourcesSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="bg-gradient-to-r from-[#245D66] to-[#245D66]/80 hover:to-[#245D66] text-white shadow-lg hover:shadow-[#245D66]/25 transition-all duration-300 group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="relative flex items-center gap-2">
                View Toolkit Items
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Custom Payment Modal */}
      {showCustomModal && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowCustomModal(false)}
          />
          
          {/* Modal Content */}
          <div className="sm:max-w-md w-full bg-black/95 border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] text-white max-w-2xl">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-24 -left-32 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
            
            {/* Top highlight border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            {/* Close button */}
            <button 
              className="absolute right-4 top-4 text-white/70 hover:text-white"
              onClick={() => setShowCustomModal(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            
            {/* Header */}
            <div className="flex flex-col space-y-1.5 text-center sm:text-left relative z-10">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x tracking-tight">
                Complete Your Purchase
              </h2>
              
              <div className="mt-3 relative">
                <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/40 via-white/10 to-transparent"></div>
                <p className="font-medium text-white text-lg pl-2">{selectedResource.title}</p>
                <p className="text-sm text-white/60 pl-2">{selectedResource.shortDescription}</p>
                <div className="mt-3 flex items-baseline">
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 pl-2">
                    ${selectedResource.price}
                  </p>
                  <span className="text-xs text-white/40 ml-2">USD</span>
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div className="space-y-4 py-5 relative z-10">
              <div className="text-sm font-medium text-white/80 mb-3 flex items-center">
                <span className="w-4 h-[1px] bg-white/30 mr-2"></span>
                Select a payment method
                <span className="w-4 h-[1px] bg-white/30 ml-2"></span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => handlePaymentMethodSelect('razorpay')}
                  className="group flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  
                  <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-md shadow-lg relative z-10">
                    <img 
                      src="https://razorpay.com/favicon.png" 
                      alt="Razorpay" 
                      className="h-7 w-7 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='14' x='2' y='5' rx='2'/%3E%3Cline x1='2' x2='22' y1='10' y2='10'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className="font-medium text-white group-hover:text-white transition-colors">Razorpay</div>
                    <div className="text-xs text-white/60">Pay using UPI, cards, or net banking</div>
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 bg-white/5 relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </button>
                
                <button 
                  onClick={() => handlePaymentMethodSelect('stripe')}
                  className="group flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  
                  <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 rounded-md shadow-lg relative z-10">
                    <img 
                      src="https://stripe.com/favicon.ico" 
                      alt="Stripe" 
                      className="h-7 w-7 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='14' x='2' y='5' rx='2'/%3E%3Cline x1='2' x2='22' y1='10' y2='10'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className="font-medium text-white group-hover:text-white transition-colors">Stripe</div>
                    <div className="text-xs text-white/60">Pay using credit/debit cards</div>
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 bg-white/5 relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between border-t border-white/10 pt-4 relative z-10">
              <button 
                className="mt-3 sm:mt-0 px-4 py-2 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 rounded-md"
                onClick={() => setShowCustomModal(false)}
              >
                Cancel
              </button>
              <div className="flex items-center text-xs text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Secure payment processing
              </div>
            </div>
            
            {/* Bottom highlight border */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      )}
      
      {/* Resource Details Dialog */}
      <Dialog
        open={showResourceDetailsDialog}
        onOpenChange={setShowResourceDetailsDialog}
      >
        <DialogContent className="bg-white text-black border border-gray-200 shadow-xl max-w-3xl p-0 overflow-hidden dialog-content">
          {selectedResource && (
            <>
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div>
                  <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-70"></div>
                    <div className="h-16 w-16 text-black">
                      {selectedResource.icon}
                    </div>
                  </div>
                  <DialogTitle className="text-2xl font-bold mb-2 dialog-title">{selectedResource.title}</DialogTitle>
                  <DialogDescription className="dialog-text-muted mb-4">
                    {selectedResource.description}
                  </DialogDescription>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h3 className="text-lg font-semibold dialog-heading mb-2">What you'll get</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="dialog-text-muted">Comprehensive resource materials</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="dialog-text-muted">Lifetime access to updates</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="dialog-text-muted">Downloadable PDF guides</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="aspect-video w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    {selectedResource.id === "personality-test" ? (
                      <img src="/images/personality-test.jpg" alt="Personality Test" className="w-full h-full object-cover rounded-lg" />
                    ) : selectedResource.id === "cheatsheet" ? (
                      <img src="/images/cheatsheet.jpg" alt="Cheatsheet" className="w-full h-full object-cover rounded-lg" />
                    ) : selectedResource.id === "case-bank" ? (
                      <img src="/images/case-bank.jpg" alt="Case Bank" className="w-full h-full object-cover rounded-lg" />
                    ) : selectedResource.id === "cv-superguide" ? (
                      <img src="/images/cv-superguide.jpg" alt="CV Superguide" className="w-full h-full object-cover rounded-lg" />
                    ) : selectedResource.id === "business-essentials" ? (
                      <img src="/images/business-essentials.jpg" alt="Business Essentials" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Info className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  
                  {selectedResource.rating && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold dialog-heading">Rating & Reviews</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(selectedResource.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-black/20'}`}
                            />
                          ))}
                        </div>
                        <span className="dialog-text font-medium">{selectedResource.rating.toFixed(1)}</span>
                        <span className="dialog-text-muted text-sm">({Math.floor(Math.random() * 100) + 50} reviews)</span>
                      </div>
                      
                      {/* Sample reviews */}
                      <div className="space-y-2 mt-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-black/20'}`}
                                />
                              ))}
                            </div>
                            <span className="dialog-text text-xs font-medium">Alex K.</span>
                          </div>
                          <p className="dialog-text-muted text-sm">
                            "This resource was exactly what I needed to prepare for my interviews. Highly recommended!"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 border-t border-gray-200 md:col-span-2 mt-4 p-6">
                <div className="text-2xl font-bold text-black mr-auto">
                  ${selectedResource.price}
                </div>
                <Button 
                  className="bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
                  onClick={() => {
                    addToCart(selectedResource);
                    setShowResourceDetailsDialog(false);
                  }}
                >
                  <span className="flex items-center gap-1 relative z-10 text-black">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </span>
                </Button>
                <Button 
                  className="bg-[#245D66] text-white hover:bg-black hover:text-white border border-[#245D66] shadow-lg hover:shadow-[0_0_15px_rgba(36,93,102,0.4)] transition-all duration-300 relative overflow-hidden"
                  onClick={() => {
                    handleBuyNow(selectedResource);
                    setShowResourceDetailsDialog(false);
                  }}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#245D66]/0 via-[#245D66]/10 to-[#245D66]/0 -translate-x-full hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="flex items-center gap-1 relative z-10">
                    <Sparkles className="h-4 w-4" />
                    Buy Now
                  </span>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}