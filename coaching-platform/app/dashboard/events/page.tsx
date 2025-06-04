"use client";

import React, { useState, useEffect } from "react";
import { useHeader } from "@/lib/context/header-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Users, 
  Download, 
  ExternalLink,
  Image as ImageIcon,
  Play,
  Star,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Consulting Career Masterclass",
    date: "June 15, 2025",
    time: "10:00 AM - 12:00 PM IST",
    location: "Virtual Event",
    description: "Join our expert consultants as they share insights on building a successful consulting career path.",
    registrationLink: "#",
    attendees: 45,
    image: "/images/events/masterclass.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Case Interview Workshop",
    date: "June 22, 2025",
    time: "2:00 PM - 5:00 PM IST",
    location: "Virtual Event",
    description: "Learn proven strategies to crack case interviews at top consulting firms.",
    registrationLink: "#",
    attendees: 78,
    image: "/images/events/workshop.jpg"
  },
  {
    id: 3,
    title: "Networking for Consultants",
    date: "July 5, 2025",
    time: "11:00 AM - 1:00 PM IST",
    location: "Virtual Event",
    description: "Master the art of professional networking to advance your consulting career.",
    registrationLink: "#",
    attendees: 32,
    image: "/images/events/networking.jpg"
  }
];

// Sample data for past events
const pastEvents = [
  {
    id: 4,
    title: "Consulting Industry Trends 2025",
    date: "May 20, 2025",
    time: "3:00 PM - 4:30 PM IST",
    location: "Virtual Event",
    description: "A deep dive into emerging trends shaping the consulting industry in 2025.",
    recordingLink: "#",
    attendees: 120,
    image: "/images/events/trends.jpg"
  },
  {
    id: 5,
    title: "Financial Modeling for Consultants",
    date: "May 10, 2025",
    time: "10:00 AM - 12:30 PM IST",
    location: "Virtual Event",
    description: "Learn essential financial modeling techniques used in consulting projects.",
    recordingLink: "#",
    attendees: 95,
    image: "/images/events/financial.jpg"
  },
  {
    id: 6,
    title: "Client Management Masterclass",
    date: "April 28, 2025",
    time: "2:00 PM - 4:00 PM IST",
    location: "Virtual Event",
    description: "Discover strategies for effective client management and relationship building.",
    recordingLink: "#",
    attendees: 88,
    image: "/images/events/client.jpg"
  }
];

// Sample data for event photos gallery
const eventPhotos = [
  {
    id: 1,
    title: "Annual Consulting Conference 2024",
    image: "/images/gallery/conference1.jpg",
    date: "December 2024"
  },
  {
    id: 2,
    title: "Workshop with Industry Leaders",
    image: "/images/gallery/workshop1.jpg",
    date: "November 2024"
  },
  {
    id: 3,
    title: "Networking Mixer",
    image: "/images/gallery/networking1.jpg",
    date: "October 2024"
  },
  {
    id: 4,
    title: "Case Competition Finals",
    image: "/images/gallery/competition1.jpg",
    date: "September 2024"
  },
  {
    id: 5,
    title: "Leadership Panel Discussion",
    image: "/images/gallery/panel1.jpg",
    date: "August 2024"
  },
  {
    id: 6,
    title: "Summer Bootcamp",
    image: "/images/gallery/bootcamp1.jpg",
    date: "July 2024"
  }
];

export default function EbooksPage() {
  // Use header context
  const { setHeaderVisible } = useHeader();
  
  useEffect(() => {
    // Ensure header is visible when this page loads
    setHeaderVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State for active tab
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="w-full bg-black min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden mb-16">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-[#245D66] opacity-90"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 border border-[#245D66]/30 rotate-45 animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-16 h-16 bg-[#245D66]/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white/10 rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
          <div className="flex items-center mb-4">
            <Sparkles className="w-6 h-6 text-[#245D66] mr-2 animate-pulse" />
            <span className="text-[#245D66] font-semibold tracking-wider text-sm uppercase">Premium Events</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-[#245D66] bg-clip-text text-transparent">
              Exclusive
            </span>
            <br />
            <span className="text-white">Masterclasses</span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-8 leading-relaxed">
            Join elite sessions with <span className="text-[#245D66] font-semibold">former MBB consultants</span> and industry leaders. 
            Unlock insights that transform careers.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-[#245D66] hover:bg-[#245D66]/90 text-white px-8 py-4 text-lg font-semibold rounded-xl border-2 border-[#245D66] hover:border-[#245D66]/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#245D66]/20">
              <Calendar className="mr-2 h-5 w-5" />
              Browse Events
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Play className="mr-2 h-5 w-5" />
              Watch Preview
            </Button>
          </div>
          
          {/* Spacer */}
          <div className="h-8"></div>
        </div>
        
        {/* Partner logos */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-12 opacity-60">
          <div className="text-white/40 text-sm font-medium">Taught by alumni from:</div>
          <div className="flex gap-8">
            <div className="text-white/60 text-lg font-bold tracking-wider hover:text-[#245D66] transition-colors cursor-pointer">McKinsey</div>
            <div className="text-white/60 text-lg font-bold tracking-wider hover:text-[#245D66] transition-colors cursor-pointer">BCG</div>
            <div className="text-white/60 text-lg font-bold tracking-wider hover:text-[#245D66] transition-colors cursor-pointer">Bain</div>
          </div>
        </div>
      </section>
      
      {/* Main content area */}
      <div className="w-full space-y-16 px-8 py-4">
        {/* Section 1: Events List */}
        <section>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Events Calendar
              </h2>
              <p className="text-gray-400 text-lg">Exclusive masterclasses designed for ambitious professionals</p>
            </div>
            <Button className="bg-gradient-to-r from-[#245D66] to-[#245D66]/80 hover:from-[#245D66]/90 hover:to-[#245D66]/70 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#245D66]/20">
              <Calendar className="mr-2 h-5 w-5" />
              Sync Calendar
            </Button>
          </div>

          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-8 bg-gray-900/50 border border-gray-800 rounded-xl p-1">
              <TabsTrigger 
                value="upcoming" 
                className="text-sm px-8 py-3 rounded-lg data-[state=active]:bg-[#245D66] data-[state=active]:text-white transition-all duration-300 font-medium"
              >
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="text-sm px-8 py-3 rounded-lg data-[state=active]:bg-[#245D66] data-[state=active]:text-white transition-all duration-300 font-medium"
              >
                Past Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-8">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
                    event.featured 
                      ? 'bg-gradient-to-r from-[#245D66]/20 via-gray-900/50 to-black border-2 border-[#245D66]/50' 
                      : 'bg-gradient-to-r from-gray-900/50 to-black border border-gray-800'
                  } hover:border-[#245D66]/70 hover:shadow-2xl hover:shadow-[#245D66]/10`}
                >
                  {event.featured && (
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-[#245D66] text-white px-4 py-2 text-sm font-semibold rounded-full border-2 border-white/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-8">
                    <div className="relative w-full lg:w-80 h-56 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-green-500 text-black px-3 py-1 text-xs font-bold rounded-full">
                          LIVE
                        </Badge>
                      </div>
                      <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-[#245D66] transition-colors duration-300">
                        {event.title}
                      </h3>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="h-4 w-4 mr-2 text-[#245D66]" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-2 text-[#245D66]" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 text-[#245D66]" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Users className="h-4 w-4 mr-2 text-[#245D66]" />
                          <span>{event.attendees} joined</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-lg leading-relaxed">{event.description}</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button asChild className="bg-[#245D66] hover:bg-[#245D66]/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#245D66]/20 group/btn">
                          <Link href={event.registrationLink}>
                            Register Now
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </Button>
                        <Button variant="outline" className="border-2 border-gray-600 text-gray-300 hover:bg-white hover:text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                          Add Reminder
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-8">
              {pastEvents.map((event) => (
                <div 
                  key={event.id}
                  className="group relative overflow-hidden bg-gradient-to-r from-gray-900/30 to-black border border-gray-800 rounded-2xl transition-all duration-500 hover:scale-[1.01] hover:border-gray-600 hover:shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-8">
                    <div className="relative w-full lg:w-80 h-56 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                      <div className="absolute top-4 left-4 z-20">
                        <Badge variant="outline" className="border-gray-500 text-gray-400 px-3 py-1 text-xs rounded-full">
                          RECORDED
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-gray-300 transition-colors duration-300">
                        {event.title}
                      </h3>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-gray-400">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.attendees} attended</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-lg leading-relaxed">{event.description}</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button variant="outline" asChild className="border-2 border-[#245D66] text-[#245D66] hover:bg-[#245D66] hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                          <Link href={event.recordingLink}>
                            <Play className="mr-2 h-4 w-4" />
                            Watch Recording
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="border-2 border-gray-600 text-gray-400 hover:bg-white hover:text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                          <Link href="#">
                            <Download className="mr-2 h-4 w-4" />
                            Resources
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </section>

        {/* Section 2: Photo Gallery */}
        <section className="pt-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Event Gallery
              </h2>
              <p className="text-gray-400 text-lg">Moments from our exclusive gatherings</p>
            </div>
            <Button variant="outline" className="border-2 border-gray-600 text-gray-300 hover:bg-white hover:text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
              <ImageIcon className="mr-2 h-5 w-5" />
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventPhotos.map((photo, index) => (
              <div 
                key={photo.id} 
                className={`group relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#245D66]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#245D66]/10 ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <ImageIcon className={`text-gray-600 ${index === 0 ? 'h-24 w-24' : 'h-16 w-16'}`} />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-[#245D66]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#245D66]/50 group-hover:scale-110 transition-transform duration-300">
                    <ExternalLink className="w-8 h-8 text-[#245D66]" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className={`font-bold text-white mb-2 ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                    {photo.title}
                  </h3>
                  <p className="text-sm text-gray-300">{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* Bottom spacing */}
      <div className="h-16"></div>
    </div>
  );
}