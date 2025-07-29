"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ChevronLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  Shield, 
  Clock, 
  Download, 
  Award,
  Users,
  BarChart,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/firebase/auth-context"
import { trackResourceAccess, updateProductAccessTime } from "@/lib/firebase/firestore"

// Define the product type
interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  rating?: number
  featured?: boolean
  tag?: string
  longDescription?: string
  benefits?: string[]
  includes?: string[]
  reviews?: Review[]
  faqs?: FAQ[]
}

interface Review {
  id: string
  name: string
  avatar?: string
  rating: number
  date: string
  comment: string
}

interface FAQ {
  question: string
  answer: string
}

// Sample product data
const products: Record<string, Product> = {
  "personality-assessment": {
    id: "personality-assessment",
    title: "Personality Assessment",
    description: "Discover your unique strengths and work style with our comprehensive assessment toolkit.",
    longDescription: "Our Personality Assessment is a comprehensive tool designed to help you understand your unique personality traits, strengths, and work style preferences. Based on the latest psychological research and validated methodologies, this assessment provides deep insights into how you interact with others, approach challenges, and contribute to teams. Whether you're preparing for interviews, seeking career advancement, or simply wanting to better understand yourself, this assessment will give you the self-awareness needed to excel.",
    price: 99,
    image: "/products/dummy-personality-assessment.jpg",
    rating: 4.8,
    featured: true,
    tag: "Best Seller",
    benefits: [
      "Gain deep insights into your personality traits and work preferences",
      "Identify your unique strengths and potential growth areas",
      "Understand how to leverage your natural talents in interviews",
      "Learn how to communicate your value to potential employers",
      "Discover ideal work environments and roles that match your personality",
      "Receive personalized strategies for professional development"
    ],
    includes: [
      "Comprehensive personality assessment (45-60 minutes)",
      "Detailed 25+ page personalized report",
      "Strengths and potential growth areas analysis",
      "Career compatibility recommendations",
      "Interview strategy guide based on your profile",
      "6 months of access to online resources and tools",
      "Optional 30-minute consultation with a career coach"
    ],
    reviews: [
      {
        id: "review1",
        name: "Sarah Johnson",
        avatar: "/avatars/avatar-1.jpg",
        rating: 5,
        date: "February 15, 2025",
        comment: "This assessment was incredibly accurate and insightful. It helped me understand why I excel in certain environments and struggle in others. I used these insights during my McKinsey interview and was able to articulate my strengths much more effectively."
      },
      {
        id: "review2",
        name: "Michael Chen",
        avatar: "/avatars/avatar-2.jpg",
        rating: 4,
        date: "January 28, 2025",
        comment: "The personality assessment provided me with valuable insights that I hadn't considered before. It helped me reframe my past experiences in a way that highlighted my strengths. Definitely worth the investment before starting interview prep."
      },
      {
        id: "review3",
        name: "Priya Patel",
        avatar: "/avatars/avatar-3.jpg",
        rating: 5,
        date: "March 2, 2025",
        comment: "I was skeptical at first, but this assessment was spot-on. The detailed report helped me understand my communication style and how to adapt it for different interview scenarios. I received offers from both BCG and Bain!"
      }
    ],
    faqs: [
      {
        question: "How long does it take to complete the assessment?",
        answer: "The assessment typically takes 45-60 minutes to complete. We recommend setting aside uninterrupted time in a quiet environment to ensure the most accurate results."
      },
      {
        question: "How soon will I receive my results?",
        answer: "You'll receive your comprehensive report immediately after completing the assessment. The report is available for download in PDF format and can also be accessed through your account dashboard."
      },
      {
        question: "Is this assessment scientifically validated?",
        answer: "Yes, our assessment is based on the Five Factor Model (Big Five) and has been validated through extensive research and testing. It incorporates elements from multiple established personality frameworks to provide comprehensive insights."
      },
      {
        question: "Can I retake the assessment?",
        answer: "Yes, you can retake the assessment after 6 months. This waiting period ensures that your responses aren't influenced by your previous results and provides a more accurate measurement of any changes in your personality traits over time."
      },
      {
        question: "How can I use these results for interview preparation?",
        answer: "Your report includes specific sections on how to leverage your personality traits in interview settings, including suggested ways to frame your experiences, strengths to highlight, and potential areas to develop. We also provide tailored strategies for different interview formats."
      }
    ]
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  
  // Get the product ID from the URL
  const productId = params.id as string
  
  // Get the product data
  const product = products[productId]
  
  // Set loaded state after initial render for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  // If product doesn't exist, redirect to the resources page
  useEffect(() => {
    if (!product && isLoaded) {
      router.push('/dashboard/resources')
    }
  }, [product, router, isLoaded])
  
  if (!product) {
    return null
  }
  
  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }
  
  // Add to cart
  const addToCart = () => {
    setIsInCart(true)
  }
  
  // Calculate rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 }
  ]
  
  // Sample additional images
  const productImages = [
    product.image,
    "/products/dummy-personality-assessment-2.jpg",
    "/products/dummy-personality-assessment-3.jpg"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => router.push('/dashboard/resources')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Toolkit</span>
          </Button>
        </div>
        
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <Image
                src={productImages[activeImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/products/dummy-${product.id}.jpg`;
                }}
              />
              {product.tag && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {product.tag}
                </Badge>
              )}
            </div>
            <div className="flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === index 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.title} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `/products/dummy-${product.id}.jpg`;
                    }}
                  />
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Product Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.rating && (
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : i < (product.rating || 0)
                              ? "text-yellow-500 fill-yellow-500 opacity-50"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {product.rating?.toFixed(1)} ({product.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
              <p className="text-xl font-bold text-primary mb-4">${product.price}</p>
              <p className="text-muted-foreground mb-6">{product.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Button 
                  size="lg" 
                  className="flex-1 min-w-[180px]"
                  onClick={addToCart}
                  disabled={isInCart}
                >
                  {isInCart ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Added to Cart
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-12 w-12 rounded-full ${
                    isFavorite ? 'text-red-500 border-red-200 hover:text-red-600 hover:border-red-300' : ''
                  }`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background/60">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">Protected checkout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background/60">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Instant Access</p>
                    <p className="text-xs text-muted-foreground">Immediate delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background/60">
                  <Download className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Digital Product</p>
                    <p className="text-xs text-muted-foreground">PDF & online access</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Product Details Tabs */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">About this Assessment</h2>
                <p className="mb-4">{product.longDescription}</p>
                
                <h3 className="text-xl font-bold mb-3">What's Included</h3>
                <ul className="space-y-2">
                  {product.includes?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Scientifically Validated</h3>
                  </div>
                  <p className="text-muted-foreground">Based on the Five Factor Model and validated through extensive research and testing.</p>
                </div>
                
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Expert Developed</h3>
                  </div>
                  <p className="text-muted-foreground">Created by a team of psychologists, career coaches, and industry professionals.</p>
                </div>
                
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <BarChart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Actionable Insights</h3>
                  </div>
                  <p className="text-muted-foreground">Practical recommendations you can immediately apply to your interview preparation.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="benefits" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-background/60">
                    <div className="p-2 rounded-full bg-primary/10 mt-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="text-xl font-bold mb-4">Why This Matters for Your Career</h3>
                <p className="mb-4">
                  Understanding your personality traits and preferences is crucial for career success. By gaining deep insights into your natural tendencies, you can:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Position yourself more effectively during interviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Choose roles and environments where you'll naturally excel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Develop strategies to manage potential challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Build more effective relationships with colleagues and clients</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 p-6 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold">{product.rating?.toFixed(1) || "0.0"}</h3>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : i < (product.rating || 0)
                              ? "text-yellow-500 fill-yellow-500 opacity-50"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {product.reviews?.length || 0} reviews</p>
                  </div>
                  
                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 w-12">
                          <span>{item.stars}</span>
                          <Star className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <Progress value={item.percentage} className="h-2 flex-1" />
                        <span className="text-sm text-muted-foreground w-8">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Customer Reviews section removed */}
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {product.faqs?.map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/60 bg-background/60">
                    <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                  <p className="text-muted-foreground mb-4">Our team is here to help you make the most of your assessment experience.</p>
                  <Button>Contact Support</Button>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Related Products */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative rounded-xl overflow-hidden border border-border/60 bg-background/60 hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] relative bg-muted">
                <Image
                  src="/products/dummy-cv-guide.jpg"
                  alt="CV & Cover Letter Guide"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  Popular
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">CV & Cover Letter Guide</h3>
                <p className="text-sm text-muted-foreground mb-2">Stand out with professionally crafted templates and expert writing strategies.</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold">$29</p>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
            
            <div className="group relative rounded-xl overflow-hidden border border-border/60 bg-background/60 hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] relative bg-muted">
                <Image
                  src="/products/dummy-meditation.jpg"
                  alt="Meditation Guide"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">Meditation Guide</h3>
                <p className="text-sm text-muted-foreground mb-2">Master mindfulness techniques to enhance focus and reduce interview stress.</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold">$29</p>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
            
            <div className="group relative rounded-xl overflow-hidden border border-border/60 bg-background/60 hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] relative bg-muted">
                <Image
                  src="/products/dummy-consulting-toolkit.jpg"
                  alt="Consulting Toolkit"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  Premium
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">Consulting Toolkit</h3>
                <p className="text-sm text-muted-foreground mb-2">Master the essential frameworks and tools used by top consulting firms.</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold">$99</p>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
