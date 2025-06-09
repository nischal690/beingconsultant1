"use client";

import React, { useState, useEffect } from "react";
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
  Heart,
  Zap,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react";

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
    featured: true,
    saved: false,
    urgent: true,
    verified: true
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
    featured: true,
    saved: true,
    urgent: false,
    verified: true
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
    featured: true,
    saved: false,
    urgent: false,
    verified: true
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
    featured: false,
    saved: false,
    urgent: false,
    verified: true
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
    featured: false,
    saved: false,
    urgent: false,
    verified: false
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
    featured: false,
    saved: true,
    urgent: false,
    verified: true
  }
];

// Job types for filtering
const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const experienceLevels = ["All Levels", "Entry Level", "Mid Level", "Senior Level", "Director", "Executive"];
const locations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Gurgaon"];

export default function JobBoardPage() {
  const [activeTab, setActiveTab] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedExperience, setSelectedExperience] = useState("All Levels");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set([2, 6]));

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const JobCard = ({ job }: { job: any }) => (
    <div className="group relative border border-white/10 hover:border-[#245D66]/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#245D66]/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm hover:scale-[1.02] transform">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Status badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {job.urgent && (
          <div className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full flex items-center animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            URGENT
          </div>
        )}
        {job.featured && (
          <div className="bg-[#245D66] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </div>
        )}
      </div>
      
      <div className="relative p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#245D66]/30 transition-colors duration-300">
                <Building className="h-8 w-8 text-white/80" />
              </div>
              {job.verified && (
                <div className="absolute -bottom-1 -right-1 bg-[#245D66] rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white group-hover:text-[#245D66] transition-colors duration-300 mb-1">
                {job.title}
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-white/70 font-medium">{job.company}</p>
                {job.verified && (
                  <Badge variant="outline" className="bg-[#245D66]/20 text-[#245D66] border-[#245D66]/30 text-xs">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110"
            onClick={() => toggleSaveJob(job.id)}
          >
            <Heart className={`h-6 w-6 transition-all duration-300 ${
              savedJobs.has(job.id) 
                ? 'text-white fill-white' 
                : 'text-white/60 hover:text-white'
            }`} />
          </Button>
        </div>
        
        {/* Job details grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-white/70 bg-white/5 rounded-xl p-3 border border-white/10">
            <MapPin className="h-5 w-5 mr-3 text-[#245D66]" />
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex items-center text-white/70 bg-white/5 rounded-xl p-3 border border-white/10">
            <Clock className="h-5 w-5 mr-3 text-[#245D66]" />
            <span className="font-medium">{job.postedDate}</span>
          </div>
          <div className="flex items-center text-white/70 bg-white/5 rounded-xl p-3 border border-white/10">
            <Tag className="h-5 w-5 mr-3 text-[#245D66]" />
            <span className="font-medium">{job.type}</span>
          </div>
          <div className="flex items-center text-white/70 bg-white/5 rounded-xl p-3 border border-white/10">
            <DollarSign className="h-5 w-5 mr-3 text-[#245D66]" />
            <span className="font-medium">{job.salary}</span>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <p className="text-white/80 leading-relaxed">
            {job.description}
          </p>
        </div>
        
        {/* Requirements */}
        <div className="mb-8">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2 text-[#245D66]" />
            Key Requirements
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-white/10 text-white/90 border-white/20 hover:bg-[#245D66]/20 hover:border-[#245D66]/50 transition-all duration-300 px-3 py-1"
              >
                {req}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-[#245D66] hover:bg-[#1a474f] text-white py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/30 hover:scale-105 font-semibold">
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button 
            variant="outline" 
            className="px-6 border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-xl"
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced hero section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/20 via-black to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(36,93,102,0.1),transparent_70%)]"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#245D66]/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="bg-[#245D66]/20 border border-[#245D66]/30 rounded-full px-6 py-2 backdrop-blur-sm">
                <span className="text-[#245D66] font-semibold text-sm">🚀 Premium Consulting Opportunities</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent leading-tight">
              Your Dream
              <span className="block bg-gradient-to-r from-[#245D66] to-white bg-clip-text text-transparent">
                Consulting Career
              </span>
              Starts Here
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto">
              Discover exclusive opportunities at top-tier consulting firms. 
              Join the elite network of strategic problem solvers.
            </p>
            
            {/* Enhanced search bar */}
            <div className="relative max-w-3xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-white/50" />
                </div>
                <Input 
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  className="pl-16 pr-32 py-8 bg-white/10 border-2 border-white/20 focus:border-[#245D66] rounded-2xl text-white backdrop-blur-xl text-lg placeholder:text-white/50 transition-all duration-300 hover:bg-white/15"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="absolute right-2 top-2 bg-[#245D66] hover:bg-[#1a474f] text-white px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                  Search
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-white/60">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-white/60">Top Firms</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/60">Placements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Enhanced filter section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <TrendingUp className="mr-3 h-8 w-8 text-[#245D66]" />
                Browse Opportunities
              </h2>
              <p className="text-white/60">Curated positions from industry leaders</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-xl"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-xl"
              >
                <SortAsc className="mr-2 h-5 w-5" />
                Sort by Relevance
              </Button>
            </div>
          </div>
          
          {/* Enhanced filter options */}
          <div className={`transition-all duration-500 overflow-hidden ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-96 lg:opacity-100'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">Job Type</label>
                <select 
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3 px-4 text-white backdrop-blur-sm focus:border-[#245D66] transition-colors duration-300"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type} className="bg-black">{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">Experience Level</label>
                <select 
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3 px-4 text-white backdrop-blur-sm focus:border-[#245D66] transition-colors duration-300"
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                >
                  {experienceLevels.map(level => (
                    <option key={level} value={level} className="bg-black">{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">Location</label>
                <select 
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3 px-4 text-white backdrop-blur-sm focus:border-[#245D66] transition-colors duration-300"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map(location => (
                    <option key={location} value={location} className="bg-black">{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced tabs section */}
        <Tabs defaultValue="featured" className="mb-12" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 max-w-md mb-12 bg-white/5 border border-white/10 rounded-2xl p-2">
            <TabsTrigger 
              value="featured" 
              className="text-base font-semibold rounded-xl data-[state=active]:bg-[#245D66] data-[state=active]:text-white transition-all duration-300"
            >
              Featured Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="text-base font-semibold rounded-xl data-[state=active]:bg-[#245D66] data-[state=active]:text-white transition-all duration-300"
            >
              All Jobs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-8">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-8">
            {allJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>
        </Tabs>
        
        {/* Enhanced newsletter section */}
        <section className="mt-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/10 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-[#245D66]/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative border-2 border-white/10 rounded-3xl p-12 md:p-16 backdrop-blur-xl bg-white/5">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="bg-[#245D66]/20 border border-[#245D66]/30 rounded-full p-4">
                  <Sparkles className="h-8 w-8 text-[#245D66]" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Never Miss Your Dream Job
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                Get personalized job recommendations and exclusive opportunities delivered straight to your inbox. 
                Join 10,000+ consultants who trust our platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/10 border-2 border-white/20 focus:border-[#245D66] rounded-2xl text-white backdrop-blur-sm flex-grow py-6 px-6 text-lg placeholder:text-white/50 transition-all duration-300"
                />
                <Button className="bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-2xl py-6 px-8 font-bold text-lg hover:scale-105">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-white/50 text-sm">
                ✨ Free forever. Unsubscribe anytime. No spam, just premium opportunities.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}