"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ShoppingCart } from "lucide-react"
import Image from "next/image"

// Define the product type
interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
}

// Sample product data
const products: Product[] = [
  {
    id: "personality-assessment",
    title: "Personality Assessment",
    description: "Comprehensive assessment to understand your strengths, weaknesses, and work style preferences.",
    price: 99,
    image: "/products/personality-assessment.jpg"
  },
  {
    id: "meditation",
    title: "Meditation Guide",
    description: "Techniques to improve focus, reduce stress, and enhance your mental clarity during interviews.",
    price: 29,
    image: "/products/meditation.jpg"
  },
  {
    id: "cv-guide",
    title: "CV and Cover Letter Guide",
    description: "Expert templates and strategies to create standout application materials.",
    price: 29,
    image: "/products/cv-guide.jpg"
  },
  {
    id: "business-essentials",
    title: "Business Essential Handbook",
    description: "Comprehensive guide covering key business concepts, frameworks, and industry knowledge.",
    price: 99,
    image: "/products/business-handbook.jpg"
  },
  {
    id: "consulting-toolkit",
    title: "Consulting Toolkit",
    description: "Essential frameworks, templates, and tools for successful consulting projects.",
    price: 99,
    image: "/products/consulting-toolkit.jpg"
  }
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<string[]>([])

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Add product to cart
  const addToCart = (productId: string) => {
    setCart([...cart, productId])
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Toolkit</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search resources..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video relative bg-muted">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Product+Image";
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{product.description}</p>
                <p className="text-xl font-bold mt-4">${product.price}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(product.id)}
                  disabled={cart.includes(product.id)}
                >
                  {cart.includes(product.id) ? "Added to Cart" : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No resources found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
