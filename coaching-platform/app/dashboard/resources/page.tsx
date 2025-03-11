"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Star, Heart, Sparkles, ArrowRight } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

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
}

// Sample product data
const products: Product[] = [
  {
    id: "personality-assessment",
    title: "Personality Assessment",
    description: "Discover your unique strengths and work style with our comprehensive assessment toolkit.",
    price: 99,
    image: "/products/dummy-personality-assessment.jpg",
    rating: 4.8,
    featured: true,
    tag: "Best Seller"
  },
  {
    id: "meditation",
    title: "Meditation Guide",
    description: "Master mindfulness techniques to enhance focus and reduce interview stress.",
    price: 29,
    image: "/products/dummy-meditation.jpg",
    rating: 4.6
  },
  {
    id: "cv-guide",
    title: "CV & Cover Letter Guide",
    description: "Stand out with professionally crafted templates and expert writing strategies.",
    price: 29,
    image: "/products/dummy-cv-guide.jpg",
    rating: 4.7,
    tag: "Popular"
  },
  {
    id: "business-essentials",
    title: "Business Essential Handbook",
    description: "Your comprehensive guide to key business frameworks and industry knowledge.",
    price: 99,
    image: "/products/dummy-business-essentials.jpg",
    rating: 4.9,
    featured: true
  },
  {
    id: "consulting-toolkit",
    title: "Consulting Toolkit",
    description: "Master the essential frameworks and tools used by top consulting firms.",
    price: 99,
    image: "/products/dummy-consulting-toolkit.jpg",
    rating: 4.8,
    tag: "Premium"
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

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Set loaded state after initial render for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Add product to cart
  const addToCart = (productId: string) => {
    setCart([...cart, productId])
  }

  // Toggle favorite status
  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId))
    } else {
      setFavorites([...favorites, productId])
    }
  }

  // Featured products section
  const featuredProducts = products.filter(product => product.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto py-8 px-4">
        {/* Hero section */}
        <motion.div 
          className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-primary/20 to-primary/5 p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[url('/abstract-pattern.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Professional Toolkit
            </h1>
            <p className="text-xl mb-6 text-foreground/80">
              Elevate your career with our premium resources designed for ambitious professionals.
            </p>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search resources..."
                className="pl-10 w-full bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 md:w-80 md:h-80 opacity-20 md:opacity-30 pointer-events-none">
            <Sparkles className="w-full h-full text-primary" />
          </div>
        </motion.div>

        {/* Featured products */}
        {featuredProducts.length > 0 && !searchQuery && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Featured Resources</span>
              </h2>
              <Button variant="ghost" className="text-primary flex items-center gap-1 group">
                View all
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg h-full bg-gradient-to-br from-background to-background/90">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="relative w-full md:w-2/5 aspect-square md:aspect-auto">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `/products/dummy-${product.id}.jpg`;
                          }}
                        />
                        {product.tag && (
                          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                            {product.tag}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col justify-between p-6 md:w-3/5">
                        <div>
                          <CardTitle className="text-xl mb-2">{product.title}</CardTitle>
                          <p className="text-muted-foreground mb-4">{product.description}</p>
                          {product.rating && (
                            <div className="flex items-center mb-4">
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
                              <span className="ml-2 text-sm text-muted-foreground">
                                {product.rating?.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-2xl font-bold">${product.price}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <Heart
                                className={`h-5 w-5 ${
                                  favorites.includes(product.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                            <Button
                              className="rounded-full px-6"
                              onClick={() => addToCart(product.id)}
                              disabled={cart.includes(product.id)}
                            >
                              {cart.includes(product.id) ? "Added" : "Add to Cart"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? "Search Results" : "All Resources"}
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-primary/5 bg-gradient-to-b from-background to-background/95">
                  <div className="relative aspect-[4/3] bg-muted group">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/products/dummy-${product.id}.jpg`;
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          favorites.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-foreground"
                        }`}
                      />
                    </Button>
                    {product.tag && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {product.tag}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      {product.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm">{product.rating?.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="text-xl font-bold">${product.price}</p>
                    <Button 
                      className="rounded-full"
                      onClick={() => addToCart(product.id)}
                      disabled={cart.includes(product.id)}
                    >
                      {cart.includes(product.id) ? (
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-4 w-4" />
                          Added
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-4 w-4" />
                          Add
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div 
              className="text-center py-16 bg-primary/5 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No resources found matching your search.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </motion.div>
          )}
        </div>

        {/* Floating cart button */}
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button 
            size="lg" 
            className="rounded-full h-16 w-16 shadow-lg flex items-center justify-center relative"
          >
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cart.length}
              </span>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
