"use client";

import React, { useState, useEffect } from "react";
import { useHeader } from "@/lib/context/header-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  Search, 
  Building, 
  MapPin, 
  Clock, 
  Tag, 
  ArrowRight, 
  Filter,
  SortAsc,
  Bookmark,
  Star,
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  GraduationCap,
  Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample data for featured jobs
const featuredJobs = [
  {
    id: 1,
    title: "Senior Management Consultant",
    company: "McKinsey & Company",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹30-40 LPA",
    postedDate: "2 days ago",
    description: "Join our team of management consultants to solve complex business challenges for leading organizations.",
    requirements: ["5+ years consulting experience", "MBA from top-tier institution", "Strong analytical skills"],
    logo: "/images/companies/mckinsey.png",
    featured: true,
    saved: false
  },
  {
    id: 2,
    title: "Strategy Consultant",
    company: "Boston Consulting Group",
    location: "Bangalore, India",
    type: "Full-time",
    salary: "₹25-35 LPA",
    postedDate: "3 days ago",
    description: "Work on strategic initiatives for Fortune 500 companies and develop innovative solutions.",
    requirements: ["3+ years strategy experience", "MBA or equivalent", "Excellent communication skills"],
    logo: "/images/companies/bcg.png",
    featured: true,
    saved: true
  },
  {
    id: 3,
    title: "Technology Consultant",
    company: "Deloitte",
    location: "Hyderabad, India",
    type: "Full-time",
    salary: "₹18-28 LPA",
    postedDate: "1 week ago",
    description: "Help clients leverage technology to transform their businesses and drive digital innovation.",
    requirements: ["Technical background", "3+ years consulting experience", "Project management skills"],
    logo: "/images/companies/deloitte.png",
    featured: true,
    saved: false
  }
];

// Sample data for all jobs
const allJobs = [
  ...featuredJobs,
  {
    id: 4,
    title: "Financial Advisory Consultant",
    company: "KPMG",
    location: "Delhi, India",
    type: "Full-time",
    salary: "₹20-30 LPA",
    postedDate: "5 days ago",
    description: "Provide financial advisory services to clients across various industries.",
    requirements: ["CFA/CA qualification", "Financial modeling expertise", "Advisory experience"],
    logo: "/images/companies/kpmg.png",
    featured: false,
    saved: false
  },
  {
    id: 5,
    title: "Healthcare Consultant",
    company: "Accenture",
    location: "Chennai, India",
    type: "Full-time",
    salary: "₹15-25 LPA",
    postedDate: "1 week ago",
    description: "Specialize in healthcare consulting to improve operational efficiency and patient outcomes.",
    requirements: ["Healthcare industry knowledge", "Consulting experience", "Process improvement skills"],
    logo: "/images/companies/accenture.png",
    featured: false,
    saved: false
  },
  {
    id: 6,
    title: "Digital Transformation Consultant",
    company: "PwC",
    location: "Pune, India",
    type: "Full-time",
    salary: "₹18-28 LPA",
    postedDate: "2 weeks ago",
    description: "Lead digital transformation initiatives for clients across various sectors.",
    requirements: ["Digital strategy experience", "Change management skills", "Technology background"],
    logo: "/images/companies/pwc.png",
    featured: false,
    saved: true
  },
  {
    id: 7,
    title: "Associate Consultant",
    company: "Bain & Company",
    location: "Gurgaon, India",
    type: "Full-time",
    salary: "₹15-20 LPA",
    postedDate: "3 days ago",
    description: "Entry-level consulting role working on diverse client projects and business challenges.",
    requirements: ["Top-tier education", "Strong analytical skills", "Problem-solving ability"],
    logo: "/images/companies/bain.png",
    featured: false,
    saved: false
  },
  {
    id: 8,
    title: "Sustainability Consultant",
    company: "EY",
    location: "Bangalore, India",
    type: "Full-time",
    salary: "₹16-26 LPA",
    postedDate: "1 week ago",
    description: "Help organizations develop and implement sustainability strategies and ESG initiatives.",
    requirements: ["Sustainability knowledge", "ESG reporting experience", "Stakeholder management"],
    logo: "/images/companies/ey.png",
    featured: false,
    saved: false
  },
  {
    id: 9,
    title: "Operations Consultant",
    company: "Oliver Wyman",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹22-32 LPA",
    postedDate: "4 days ago",
    description: "Optimize client operations and supply chains to improve efficiency and reduce costs.",
    requirements: ["Operations experience", "Process optimization skills", "Data analysis expertise"],
    logo: "/images/companies/oliver-wyman.png",
    featured: false,
    saved: false
  }
];

// Job types for filtering
const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Freelance", "Internship"];

// Experience levels for filtering
const experienceLevels = ["All Levels", "Entry Level", "Mid Level", "Senior Level", "Director", "Executive"];

// Locations for filtering
const locations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Gurgaon"];

export default function JobBoardPage() {
  // Use header context
  const { setHeaderVisible } = useHeader();
  
  useEffect(() => {
    // Ensure header is visible when this page loads
    setHeaderVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State for active tab
  const [activeTab, setActiveTab] = useState("featured");
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for filters
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedExperience, setSelectedExperience] = useState("All Levels");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  
  // State for showing filters on mobile
  const [showFilters, setShowFilters] = useState(false);
  
  // Function to toggle job saved state
  const toggleSaveJob = (jobId: number) => {
    if (activeTab === "featured") {
      const updatedJobs = featuredJobs.map(job => 
        job.id === jobId ? { ...job, saved: !job.saved } : job
      );
      // In a real app, you would update the state here
    } else {
      const updatedJobs = allJobs.map(job => 
        job.id === jobId ? { ...job, saved: !job.saved } : job
      );
      // In a real app, you would update the state here
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page header with gradient background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-50"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Consulting Job Board
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover exclusive consulting opportunities curated for our community
            </p>
            
            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text"
                placeholder="Search for jobs, companies, or keywords..."
                className="pl-10 py-6 bg-black/50 border-2 border-gray-800 focus:border-white rounded-xl text-white backdrop-blur-lg w-full [&:not(:placeholder-shown)]:bg-black [&:not(:placeholder-shown)]:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-1.5 top-1.5 bg-[#245D66] hover:bg-[#1a474f] text-white px-4 py-2 rounded-lg">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">
              <span className="flex items-center">
                <Briefcase className="mr-2 h-6 w-6 text-[#245D66]" />
                Browse Opportunities
              </span>
            </h2>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-white hover:text-black"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white hover:text-black">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
          
          {/* Filter options - toggleable on mobile */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Job Type</label>
              <select 
                className="w-full bg-black border-2 border-gray-800 rounded-lg py-2 px-3 text-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Experience Level</label>
              <select 
                className="w-full bg-black border-2 border-gray-800 rounded-lg py-2 px-3 text-white"
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <select 
                className="w-full bg-black border-2 border-gray-800 rounded-lg py-2 px-3 text-white"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Tabs section */}
        <Tabs defaultValue="featured" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 max-w-[400px] mb-8">
            <TabsTrigger value="featured" className="text-sm">
              Featured Jobs
            </TabsTrigger>
            <TabsTrigger value="all" className="text-sm">
              All Jobs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <div key={job.id} className="group relative border border-gray-800 hover:border-[#245D66]/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/10 bg-gradient-to-br from-gray-900 to-black">
                  {/* Featured tag */}
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-[#245D66] text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      Featured
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Company logo and save button */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                        <div className="h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-100 rounded-md flex items-center justify-center">
                          <Building className="h-6 w-6 text-gray-800" />
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white/10"
                        onClick={() => toggleSaveJob(job.id)}
                      >
                        {job.saved ? (
                          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        ) : (
                          <Heart className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Job title and company */}
                    <h3 className="text-xl font-bold mb-1 group-hover:text-[#245D66] transition-colors duration-300">
                      {job.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{job.company}</p>
                    
                    {/* Job details */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.postedDate}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    
                    {/* Job description */}
                    <p className="text-sm text-gray-300 mb-6 line-clamp-2">
                      {job.description}
                    </p>
                    
                    {/* Requirements */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-2 text-gray-200">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="bg-black/30 text-gray-300 border-gray-700">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Apply button */}
                    <Button className="w-full bg-[#245D66] hover:bg-[#1a474f] text-white py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/20">
                      View Job
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allJobs.map((job) => (
                <div key={job.id} className="group relative border border-gray-800 hover:border-[#245D66]/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/10 bg-gradient-to-br from-gray-900 to-black">
                  {/* Featured tag - only show if featured */}
                  {job.featured && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-[#245D66] text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                        Featured
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Company logo and save button */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                        <div className="h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-100 rounded-md flex items-center justify-center">
                          <Building className="h-6 w-6 text-gray-800" />
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white/10"
                        onClick={() => toggleSaveJob(job.id)}
                      >
                        {job.saved ? (
                          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        ) : (
                          <Heart className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Job title and company */}
                    <h3 className="text-xl font-bold mb-1 group-hover:text-[#245D66] transition-colors duration-300">
                      {job.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{job.company}</p>
                    
                    {/* Job details */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.postedDate}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    
                    {/* Job description */}
                    <p className="text-sm text-gray-300 mb-6 line-clamp-2">
                      {job.description}
                    </p>
                    
                    {/* Requirements */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-2 text-gray-200">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="bg-black/30 text-gray-300 border-gray-700">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Apply button */}
                    <Button className="w-full bg-[#245D66] hover:bg-[#1a474f] text-white py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/20">
                      View Job
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Newsletter section */}
        <section className="mt-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-50"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
          
          <div className="relative border border-gray-800 rounded-2xl p-8 md:p-12 backdrop-blur-sm overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <Sparkles className="h-10 w-10 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Get Job Alerts in Your Inbox
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Subscribe to receive personalized job recommendations and be the first to know about exclusive consulting opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-black/50 border-2 border-gray-800 focus:border-white rounded-xl text-white backdrop-blur-lg flex-grow py-6 [&:not(:placeholder-shown)]:bg-black [&:not(:placeholder-shown)]:text-white"
                />
                <Button className="bg-white text-black hover:bg-gray-200 transition-all duration-300 rounded-xl py-6 px-8 font-semibold">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Bottom spacing */}
      <div className="h-16"></div>
    </div>
  );
}