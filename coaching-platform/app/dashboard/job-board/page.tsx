"use client";

import React, { useState, useEffect } from "react";
import { getJobs, timestampToDate, getJobFilterOptions } from "@/lib/firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  SortAsc, 
  TrendingUp, 
  Building, 
  CheckCircle, 
  MapPin, 
  Clock, 
  Award, 
  ArrowRight, 
  Heart, 
  Bookmark, 
  Star, 
  Zap, 
  Sparkles,
  Users,
  GraduationCap,
  Briefcase
} from "lucide-react";

// Default filter options (will be replaced with data from Firebase)

export default function JobBoardPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [savedJobs, setSavedJobs] = useState<Set<string | number>>(new Set());
  
  // Job data state
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter options state
  const [countries, setCountries] = useState<string[]>(["All Countries"]);
  const [locations, setLocations] = useState<string[]>(["All Locations"]);
  const [companies, setCompanies] = useState<string[]>(["All Companies"]);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  
  // Fetch filter options from Firebase
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        console.log("Starting to fetch filter options");
        setFilterOptionsLoading(true);
        
        const filterOptionsResult = await getJobFilterOptions();
        
        console.log("Fetched filter options:", filterOptionsResult);
        
        if (!filterOptionsResult.error) {
          setCountries(filterOptionsResult.countries);
          setLocations(filterOptionsResult.locations);
          setCompanies(filterOptionsResult.companies);
          console.log("Filter options set in state");
        } else {
          console.error("Error fetching filter options:", filterOptionsResult.error);
        }
      } catch (error) {
        console.error("Exception in fetchFilterOptions:", error);
      } finally {
        setFilterOptionsLoading(false);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  // Fetch jobs from Firebase on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("Starting to fetch jobs in job-board page");
        setLoading(true);
        setError(null);
        
        // Fetch all jobs (no longer fetching featured separately)
        console.log("Calling getJobs function...");
        const allJobsResult = await getJobs();
        
        console.log("Fetched jobs data:", allJobsResult);
        
        if (allJobsResult.error === null) {
          // No longer setting featured jobs separately
          const jobsArray = allJobsResult.jobs || [];
          console.log(`Setting ${jobsArray.length} jobs in state`);
          setAllJobs(jobsArray);
          
          if (jobsArray.length === 0) {
            console.log("WARNING: No jobs were returned from Firebase");
            setError("No job listings found. Please check back later.");
          } else {
            console.log("Jobs successfully set in state:", jobsArray);
          }
        } else {
          console.error("Error returned from getJobs:", allJobsResult.error);
          setError(allJobsResult.error || "Failed to fetch jobs. Please try again later.");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Exception in fetchJobs:", errorMessage);
        setError(`An unexpected error occurred: ${errorMessage}`);
      } finally {
        setLoading(false);
        console.log("Finished fetchJobs function");
      }
    };
    
    fetchJobs();
  }, []);

  const toggleSaveJob = (jobId: string | number) => {
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

  const JobCard = ({ job }: { job: any }) => {
    // Format the job posting date
    const formatDate = (timestamp: any) => {
      if (!timestamp) return "";
      
      try {
        // Use the timestampToDate helper to handle different timestamp formats
        const date = timestampToDate(timestamp);
        if (!date) return "";
        
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString();
      } catch (error) {
        console.error("Error formatting date:", error);
        return typeof timestamp === 'string' ? timestamp : "";
      }
    };
    
    return (
      <div className="group relative border border-white/10 hover:border-[#245D66]/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#245D66]/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm hover:scale-[1.02] transform h-full flex flex-col">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Status badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          {job.urgent && (
            <div className="bg-white text-black text-xs font-bold px-2 py-1 rounded-full flex items-center animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              URGENT
            </div>
          )}
          {job.featured && (
            <div className="bg-[#245D66] text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </div>
          )}
        </div>
        
        <div className="relative p-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#245D66]/30 transition-colors duration-300">
                  <Building className="h-6 w-6 text-white/80" />
                </div>
                {job.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-[#245D66] rounded-full p-1">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-[#245D66] transition-colors duration-300 mb-1 line-clamp-2">
                  {job.job_title}
                </h3>
                <div className="flex items-center space-x-2">
                  <p className="text-white/70 font-medium text-sm truncate">{job.company_name}</p>
                  {job.verified && (
                    <Badge variant="outline" className="bg-[#245D66]/20 text-[#245D66] border-[#245D66]/30 text-xs flex-shrink-0">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 flex-shrink-0 ml-2"
              onClick={() => toggleSaveJob(job.ID || job.id)}
            >
              <Heart className={`h-5 w-5 transition-all duration-300 ${
                savedJobs.has(job.ID || job.id) 
                  ? 'text-white fill-white' 
                  : 'text-white/60 hover:text-white'
              }`} />
            </Button>
          </div>
          
          {/* Job details - Compact grid */}
          <div className="grid grid-cols-1 gap-3 mb-4 flex-1">
            <div className="flex items-center text-white/70 bg-white/5 rounded-lg p-2 border border-white/10">
              <MapPin className="h-4 w-4 mr-2 text-[#245D66] flex-shrink-0" />
              <span className="font-medium text-sm truncate">{job.location}</span>
            </div>
            <div className="flex items-center text-white/70 bg-white/5 rounded-lg p-2 border border-white/10">
              <Clock className="h-4 w-4 mr-2 text-[#245D66] flex-shrink-0" />
              <span className="font-medium text-sm truncate">{formatDate(job.job_posted_on)}</span>
            </div>
            <div className="flex items-center text-white/70 bg-white/5 rounded-lg p-2 border border-white/10">
              <Users className="h-4 w-4 mr-2 text-[#245D66] flex-shrink-0" />
              <span className="font-medium text-sm">{job.experience_required_in_yrs || "NA"} yrs</span>
            </div>
            <div className="flex items-center text-white/70 bg-white/5 rounded-lg p-2 border border-white/10">
              <GraduationCap className="h-4 w-4 mr-2 text-[#245D66] flex-shrink-0" />
              <span className="font-medium text-sm truncate">{job.country}</span>
            </div>
          </div>
          
          {/* Description - Compact */}
          <div className="mb-4">
            <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
              {job.description || "No description available."}
            </p>
          </div>
          
          {/* Requirements - Compact display */}
          {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2 flex items-center text-sm">
                <Award className="h-3 w-3 mr-1 text-[#245D66]" />
                Requirements
              </h4>
              <div className="flex flex-wrap gap-1">
                {job.requirements.slice(0, 3).map((req: any, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-white/10 text-white/90 border-white/20 hover:bg-[#245D66]/20 hover:border-[#245D66]/50 transition-all duration-300 px-2 py-1 text-xs"
                  >
                    {req}
                  </Badge>
                ))}
                {job.requirements.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="bg-white/10 text-white/90 border-white/20 px-2 py-1 text-xs"
                  >
                    +{job.requirements.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Action buttons - Compact */}
          <div className="flex gap-2 mt-auto">
            <Button 
              className="flex-1 bg-[#245D66] hover:bg-[#1a474f] text-white py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/30 font-semibold text-sm"
              onClick={() => job.job_application_link && window.open(job.job_application_link, "_blank")}
            >
              Apply Now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-lg h-9 w-9"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
                <span className="text-[#245D66] font-semibold text-sm">Premium Consulting Opportunities</span>
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
            showFilters ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[300px] lg:opacity-100'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">Company</label>
                <select 
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3 px-4 text-white backdrop-blur-sm focus:border-white transition-colors duration-300"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  disabled={filterOptionsLoading}
                >
                  {filterOptionsLoading ? (
                    <option value="All Companies" className="bg-black">Loading...</option>
                  ) : (
                    companies.map(company => (
                      <option key={company} value={company} className="bg-black">{company}</option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">Country</label>
                <select 
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3 px-4 text-white backdrop-blur-sm focus:border-white transition-colors duration-300"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={filterOptionsLoading}
                >
                  {filterOptionsLoading ? (
                    <option value="All Countries" className="bg-black">Loading...</option>
                  ) : (
                    countries.map(country => (
                      <option key={country} value={country} className="bg-black">{country}</option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-3">Location</label>
                <select 
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3 px-4 text-white backdrop-blur-sm focus:border-white transition-colors duration-300"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  disabled={filterOptionsLoading}
                >
                  {filterOptionsLoading ? (
                    <option value="All Locations" className="bg-black">Loading...</option>
                  ) : (
                    locations.map(location => (
                      <option key={location} value={location} className="bg-black">{location}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Job listings section with heading */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-8 flex items-center">
            <Briefcase className="mr-3 h-6 w-6 text-white" />
            Available Opportunities
          </h3>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-t-white border-white/20 rounded-full animate-spin mb-4"></div>
              <p className="text-white/70 text-lg">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-red-500/20 p-4 rounded-xl mb-4">
                <p className="text-red-400 text-lg">{error}</p>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-xl"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div>
              {allJobs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-white/70 text-lg">No jobs available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allJobs
                    .filter(job => {
                      // Apply filters
                      const matchesCountry = selectedCountry === "All Countries" || job.country === selectedCountry;
                      const matchesLocation = selectedLocation === "All Locations" || job.location === selectedLocation;
                      const matchesCompany = selectedCompany === "All Companies" || job.company === selectedCompany;
                      
                      return matchesCountry && matchesLocation && matchesCompany;
                    })
                    .map((job) => (
                      <JobCard key={job.id || job.ID} job={job} />
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Enhanced newsletter section removed */}
      </div>
    </div>
  );
}