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

// No sample data needed - using Luma calendar embed
// No gallery data needed

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
          
          {/* Spacer */}
          <div className="mb-12"></div>
          
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

          {/* Luma Calendar Embed */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 text-white">Events Calendar</h3>
            <div className="w-full overflow-hidden rounded-xl border border-gray-800">
              <iframe
                src="https://lu.ma/embed/calendar/cal-VIVCtDlvueFvnmz/events"
                width="100%"
                height="500"
                frameBorder="0"
                style={{ border: '1px solid #bfcbda88', borderRadius: '4px' }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            </div>
          </div>
        </section>

        {/* No gallery section needed */}
      </div>
      
      {/* Bottom spacing */}
      <div className="h-16"></div>
    </div>
  );
}