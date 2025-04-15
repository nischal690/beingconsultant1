"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, ExternalLink, ChevronRight, Filter, Search } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

// Event type definition
interface Event {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  date: string
  time: string
  location: string
  type: "virtual" | "in-person"
  speaker: {
    name: string
    role: string
    image: string
  }
  registrationLink?: string
  category: string
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Sample events data
  const events: Event[] = [
    {
      id: "1",
      title: "Driving Transformation: Management Consulting in the GCC Region",
      subtitle: "IGNITE",
      description: "In this upcoming Masterclass, \"Driving Transformation: Management Consulting in the GCC Region,\" Hareth will share insights from his work in consulting, delving into the strategies.",
      image: "/images/events/hareth-event.jpg",
      date: "November 10th",
      time: "IST: 5:30pm to 6:30pm / ET: 7am to 8am / CET: 1pm to 2pm",
      location: "Virtual",
      type: "virtual",
      speaker: {
        name: "Al Hareth Ali",
        role: "Senior Consultant",
        image: "/images/speakers/hareth.jpg"
      },
      registrationLink: "https://forms.gle/example1",
      category: "masterclass"
    },
    {
      id: "2",
      title: "Expert Session on Careers in Management Consulting",
      subtitle: "EXPERT SESSION",
      description: "Join Gaurav Bhosle, an ex-McKinsey consultant and seasoned career coach, as he hosts an engaging session tailored for INSEAD students.",
      image: "/images/events/gaurav-event.jpg",
      date: "November 10th",
      time: "15:00 - 16:00 CET",
      location: "Virtual",
      type: "virtual",
      speaker: {
        name: "Gaurav Bhosle",
        role: "Ex-McKinsey Consultant",
        image: "/images/speakers/gaurav.jpg"
      },
      registrationLink: "https://forms.gle/example2",
      category: "career"
    },
    {
      id: "3",
      title: "Breaking into Strategy Consulting: Tips from Insiders",
      subtitle: "WORKSHOP",
      description: "Learn the insider secrets to breaking into top strategy consulting firms from consultants who've been through the process.",
      image: "/images/events/strategy-event.jpg",
      date: "November 15th",
      time: "18:00 - 19:30 EST",
      location: "New York City",
      type: "in-person",
      speaker: {
        name: "Sarah Johnson",
        role: "BCG Consultant",
        image: "/images/speakers/sarah.jpg"
      },
      registrationLink: "https://forms.gle/example3",
      category: "workshop"
    },
    {
      id: "4",
      title: "Case Interview Masterclass: Problem Solving Techniques",
      subtitle: "MASTERCLASS",
      description: "Master the art of case interviews with proven problem-solving frameworks and techniques from experienced consultants.",
      image: "/images/events/case-interview.jpg",
      date: "November 20th",
      time: "14:00 - 16:00 GMT",
      location: "London",
      type: "in-person",
      speaker: {
        name: "James Wilson",
        role: "Bain & Company Partner",
        image: "/images/speakers/james.jpg"
      },
      registrationLink: "https://forms.gle/example4",
      category: "masterclass"
    }
  ]

  // Filter events based on search, category, and type
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.speaker.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesType = selectedType === "all" || event.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-black text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/30 z-10"></div>
          <Image 
            src="/images/events-hero.jpg" 
            alt="Events" 
            width={1200} 
            height={400} 
            className="w-full h-[300px] object-cover opacity-60"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">
              Workshops
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
              See below for upcoming virtual and in-person workshops.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-input"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="masterclass">Masterclass</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="career">Career Session</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Card className="overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-primary hover:bg-primary/90 text-white border-none">
                        {event.type === "virtual" ? "Virtual" : "In-Person"}
                      </Badge>
                    </div>
                    <Image 
                      src={event.image} 
                      alt={event.title} 
                      width={600} 
                      height={300} 
                      className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <p className="text-sm font-medium text-white bg-black/50 px-3 py-1 rounded-full inline-flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {event.date}
                      </p>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-semibold text-primary">
                        {event.subtitle}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-2 line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10">
                        <Image 
                          src={event.speaker.image} 
                          alt={event.speaker.name} 
                          width={40} 
                          height={40} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{event.speaker.name}</p>
                        <p className="text-xs text-muted-foreground">{event.speaker.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 group">
                      <Link href={event.registrationLink || "#"}>
                        Register Now
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          )}
        </motion.div>
      </section>
      
      {/* Call to Action */}
      <section className="mt-16">
        <div className="relative overflow-hidden rounded-2xl bg-primary/5 border border-primary/10">
          <div className="absolute inset-0 bg-grid-[#245D66]/5 [mask-image:linear-gradient(0deg,transparent,rgba(36,93,102,0.05),transparent)]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E5EFF1] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E5EFF1] rounded-full blur-3xl"></div>
          
          <div className="relative p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#245D66] to-[#1A444B] animate-gradient-x">
                  Want to host your own event?
                </span>
              </h2>
              <p className="text-muted-foreground">
                If you're interested in hosting a workshop, masterclass, or any other event on our platform, 
                we'd love to hear from you. Our community is always looking for valuable insights and learning opportunities.
              </p>
              <div className="pt-2">
                <Button size="lg" className="bg-[#245D66] text-white hover:bg-[#1A444B] transition-all duration-300 group hover:-translate-y-[2px] shadow-lg hover:shadow-[#245D66]/10">
                  Submit Event Proposal
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
