"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowRight,
  ArrowLeft,
  Star,
  Linkedin,
  Share2,
  Bookmark,
  Heart,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Plus,
  ExternalLink,
  TrendingUp,
  Clock,
  Award,
  Users
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Mock data for stories
const featuredStories = [
  {
    id: 1,
    title: "From Analyst to Partner: My 5-Year Journey",
    excerpt: "How I navigated the consulting landscape and accelerated my career path with strategic mentoring.",
    author: {
      name: "Alexandra Chen",
      role: "Partner, Strategy Consulting",
      avatar: "/placeholder-user.jpg",
      company: "McKinsey & Company",
      linkedin: "https://linkedin.com/in/company/mckinsey"
    },
    coverImage: "/placeholder.svg",
    category: "Career Growth",
    readTime: "8 min read",
    likes: 342,
    comments: 56,
    date: "Mar 15, 2025",
    slides: [
      {
        title: "The Beginning",
        content: "Starting as an analyst with high ambitions but limited direction.",
        image: "/placeholder.svg"
      },
      {
        title: "Finding Mentorship",
        content: "The turning point came when I connected with senior leaders who saw my potential.",
        image: "/placeholder.svg"
      },
      {
        title: "Developing Expertise",
        content: "Focusing on a specialized industry vertical to build credibility and thought leadership.",
        image: "/placeholder.svg"
      },
      {
        title: "Client Relationship Mastery",
        content: "Learning to build trust and deliver consistent value to key clients.",
        image: "/placeholder.svg"
      },
      {
        title: "Partnership Achievement",
        content: "Reaching partner level through strategic positioning and demonstrated leadership.",
        image: "/placeholder.svg"
      }
    ]
  },
  {
    id: 2,
    title: "Building a Boutique Consulting Practice",
    excerpt: "The journey from corporate consulting to establishing a specialized boutique firm serving Fortune 500 clients.",
    author: {
      name: "Marcus Williams",
      role: "Founder & Principal",
      avatar: "/placeholder-user.jpg",
      company: "Apex Strategy Group",
      linkedin: "https://linkedin.com/in/company/apex-strategy"
    },
    coverImage: "/placeholder.svg",
    category: "Entrepreneurship",
    readTime: "12 min read",
    likes: 289,
    comments: 42,
    date: "Mar 10, 2025",
    slides: [
      {
        title: "The Decision to Leave",
        content: "Why I left a prestigious firm to build something of my own.",
        image: "/placeholder.svg"
      },
      {
        title: "Finding My Niche",
        content: "Identifying an underserved market segment with high growth potential.",
        image: "/placeholder.svg"
      },
      {
        title: "First Clients",
        content: "Leveraging relationships to secure initial projects and build credibility.",
        image: "/placeholder.svg"
      },
      {
        title: "Scaling Challenges",
        content: "Navigating the transition from solo practitioner to building a team.",
        image: "/placeholder.svg"
      },
      {
        title: "Future Vision",
        content: "Where we're headed and lessons for aspiring boutique founders.",
        image: "/placeholder.svg"
      }
    ]
  },
  {
    id: 3,
    title: "Transitioning from Tech to Strategy Consulting",
    excerpt: "How my engineering background became my competitive advantage in the consulting world.",
    author: {
      name: "Priya Sharma",
      role: "Senior Consultant",
      avatar: "/placeholder-user.jpg",
      company: "Boston Consulting Group",
      linkedin: "https://linkedin.com/in/company/boston-consulting-group"
    },
    coverImage: "/placeholder.svg",
    category: "Career Transition",
    readTime: "10 min read",
    likes: 412,
    comments: 78,
    date: "Mar 5, 2025",
    slides: [
      {
        title: "My Tech Background",
        content: "Five years as a software engineer building enterprise solutions.",
        image: "/placeholder.svg"
      },
      {
        title: "The Consulting Appeal",
        content: "Why I was drawn to strategic problem-solving across industries.",
        image: "/placeholder.svg"
      },
      {
        title: "The Interview Process",
        content: "Preparing for case interviews with a technical mindset.",
        image: "/placeholder.svg"
      },
      {
        title: "Early Challenges",
        content: "Adapting to a different work style and communication approach.",
        image: "/placeholder.svg"
      },
      {
        title: "Leveraging Technical Expertise",
        content: "How my engineering background created unique value for clients.",
        image: "/placeholder.svg"
      }
    ]
  }
];

// Main component
export default function StoriesPage() {
  const [activeStory, setActiveStory] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)

  const handleNextStory = () => {
    setActiveStory((prev) => (prev + 1) % featuredStories.length)
    setActiveSlide(0)
  }

  const handlePrevStory = () => {
    setActiveStory((prev) => (prev === 0 ? featuredStories.length - 1 : prev - 1))
    setActiveSlide(0)
  }

  const handleNextSlide = () => {
    const currentStory = featuredStories[activeStory]
    setActiveSlide((prev) => (prev + 1) % currentStory.slides.length)
  }

  const handlePrevSlide = () => {
    const currentStory = featuredStories[activeStory]
    setActiveSlide((prev) => (prev === 0 ? currentStory.slides.length - 1 : prev - 1))
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[10%] h-[70%] w-[50%] rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-[30%] -right-[10%] h-[50%] w-[40%] rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        <div className="absolute -bottom-[20%] left-[20%] h-[40%] w-[60%] rounded-full bg-gradient-to-br from-pink-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      
      {/* Hero section */}
      <section className="relative px-4 pt-16 pb-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="glass-effect rounded-2xl px-6 py-10 hover-reveal-border">
            <h1 className="animate-gradient-x bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              Inspiring Stories
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-gray-300">
              Discover insights, experiences, and wisdom from consultants who have walked the path before you.
            </p>
          </div>
        </div>
      </section>

      {/* Featured stories */}
      <section className="relative px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold">Featured Stories</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredStories.map((story, index) => (
              <Card 
                key={story.id} 
                className="hover-lift-subtle hover-reveal-border glass-effect border-gray-800 bg-black/40"
                onClick={() => setActiveStory(index)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-black/50 text-white">
                      {story.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{story.likes}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2 cursor-pointer text-xl font-semibold hover:text-gray-300">
                    {story.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{story.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={story.author.avatar} alt={story.author.name} />
                      <AvatarFallback>{story.author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{story.author.name}</p>
                      <p className="text-xs text-gray-400">{story.author.role}</p>
                    </div>
                    <div className="ml-auto">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="rounded-full hover:bg-white/10"
                        asChild
                      >
                        <a href={story.author.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-800 pt-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400">{story.readTime} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="rounded-full hover:bg-white/10"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="rounded-full hover:bg-white/10"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story carousel */}
      <section className="relative px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="glass-effect rounded-2xl p-8 hover-reveal-border">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Story Carousel</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevStory}
                  className="rounded-full border-gray-700 bg-black/50 hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNextStory}
                  className="rounded-full border-gray-700 bg-black/50 hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              {/* Active story */}
              <div className="animate-fade-in-up">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={featuredStories[activeStory].author.avatar} alt={featuredStories[activeStory].author.name} />
                      <AvatarFallback>{featuredStories[activeStory].author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{featuredStories[activeStory].author.name}</p>
                      <p className="text-xs text-gray-400">{featuredStories[activeStory].author.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="rounded-full hover:bg-white/10"
                      asChild
                    >
                      <a href={featuredStories[activeStory].author.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="rounded-full hover:bg-white/10"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black p-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20"></div>
                  <div className="relative rounded-lg bg-black p-6">
                    <h3 className="mb-4 text-2xl font-bold">{featuredStories[activeStory].slides[activeSlide].title}</h3>
                    <p className="text-gray-300">{featuredStories[activeStory].slides[activeSlide].content}</p>
                    
                    {featuredStories[activeStory].slides[activeSlide].image && (
                      <div className="mt-6 overflow-hidden rounded-lg">
                        <img 
                          src={featuredStories[activeStory].slides[activeSlide].image} 
                          alt={featuredStories[activeStory].slides[activeSlide].title}
                          className="w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Slide {activeSlide + 1} of {featuredStories[activeStory].slides.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrevSlide}
                      className="rounded-full border-gray-700 bg-black/50 hover:bg-white/10 hover:text-white"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNextSlide}
                      className="rounded-full border-gray-700 bg-black/50 hover:bg-white/10 hover:text-white"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              { name: "Career Growth", icon: <TrendingUp className="h-5 w-5" />, count: 24 },
              { name: "Entrepreneurship", icon: <Award className="h-5 w-5" />, count: 18 },
              { name: "Career Transition", icon: <ArrowRight className="h-5 w-5" />, count: 32 },
              { name: "Leadership", icon: <Users className="h-5 w-5" />, count: 15 },
            ].map((category) => (
              <Card 
                key={category.name} 
                className="hover-lift-subtle hover-reveal-border glass-effect border-gray-800 bg-black/40"
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-gradient-to-br from-gray-800 to-black p-3">
                    {category.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.count} stories</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="relative px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="glass-effect rounded-2xl p-8 hover-reveal-border">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div>
                <h2 className="animate-gradient-x bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                  Share Your Story
                </h2>
                <p className="mt-2 max-w-2xl text-gray-300">
                  Inspire others with your consulting journey. Share your experiences, challenges, and successes.
                </p>
              </div>
              <Button 
                size="lg" 
                className="premium-button animate-gradient-slow bg-gradient-to-r from-gray-900 via-black to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-gray-800"
              >
                Submit Your Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  )
}
