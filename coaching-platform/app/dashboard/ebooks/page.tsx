
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Download, 
  Star, 
  Bookmark, 
  ArrowRight, 
  FileText, 
  Clock, 
  Sparkles,
  Heart,
  Filter,
  SortAsc,
  Eye,
  Share2,
  Award,
  TrendingUp,
  Users,
  PlayCircle,
  ChevronRight,
  Globe
} from "lucide-react";

// Sample data for featured ebooks
const featuredEbooks = [
  {
    id: 1,
    title: "The Consultant's Playbook: Strategies for Success",
    author: "Dr. Sarah Mitchell",
    coverImage: "/images/ebooks/consultant-playbook.jpg",
    description: "A comprehensive guide to mastering the art of consulting with proven strategies from industry experts.",
    pages: 248,
    category: "Strategy",
    rating: 4.8,
    downloads: 12500,
    readTime: "8 hrs",
    downloadLink: "#",
    featured: true,
    new: false,
    trending: true
  },
  {
    id: 2,
    title: "Case Interview Mastery: Frameworks and Techniques",
    author: "Michael Reynolds",
    coverImage: "/images/ebooks/case-interview.jpg",
    description: "Master the case interview process with structured frameworks and practical techniques for problem-solving.",
    pages: 186,
    category: "Interviews",
    rating: 4.9,
    downloads: 18200,
    readTime: "6 hrs",
    downloadLink: "#",
    featured: true,
    new: true,
    trending: false
  },
  {
    id: 3,
    title: "Client Communication Excellence",
    author: "Jennifer Adams",
    coverImage: "/images/ebooks/client-communication.jpg",
    description: "Learn effective communication strategies to build strong client relationships and deliver exceptional results.",
    pages: 164,
    category: "Communication",
    rating: 4.7,
    downloads: 9800,
    readTime: "5 hrs",
    downloadLink: "#",
    featured: true,
    new: false,
    trending: false
  }
];

// Sample data for all ebooks
const allEbooks = [
  ...featuredEbooks,
  {
    id: 4,
    title: "Financial Modeling for Consultants",
    author: "Robert Chen, CFA",
    coverImage: "/images/ebooks/financial-modeling.jpg",
    description: "A practical guide to building robust financial models for consulting projects and business analysis.",
    pages: 210,
    category: "Finance",
    rating: 4.6,
    downloads: 7300,
    readTime: "7 hrs",
    downloadLink: "#",
    featured: false,
    new: false,
    trending: false
  },
  {
    id: 5,
    title: "The Art of Business Development",
    author: "Thomas Wright",
    coverImage: "/images/ebooks/business-development.jpg",
    description: "Strategies for growing your consulting practice through effective business development techniques.",
    pages: 178,
    category: "Business Development",
    rating: 4.5,
    downloads: 5600,
    readTime: "6 hrs",
    downloadLink: "#",
    featured: false,
    new: true,
    trending: false
  },
  {
    id: 6,
    title: "Data-Driven Consulting",
    author: "Dr. Emily Chen",
    coverImage: "/images/ebooks/data-driven.jpg",
    description: "Leverage data analytics to deliver more impactful consulting solutions and drive client success.",
    pages: 232,
    category: "Analytics",
    rating: 4.8,
    downloads: 11400,
    readTime: "8 hrs",
    downloadLink: "#",
    featured: false,
    new: false,
    trending: true
  },
  {
    id: 7,
    title: "Consulting Proposal Templates",
    author: "Mark Johnson",
    coverImage: "/images/ebooks/proposal-templates.jpg",
    description: "Ready-to-use proposal templates and frameworks to win more consulting projects.",
    pages: 142,
    category: "Business Development",
    rating: 4.7,
    downloads: 8900,
    readTime: "4 hrs",
    downloadLink: "#",
    featured: false,
    new: false,
    trending: false
  },
  {
    id: 8,
    title: "Networking for Consultants",
    author: "Alexandra Torres",
    coverImage: "/images/ebooks/networking.jpg",
    description: "Build a powerful professional network to advance your consulting career and generate new opportunities.",
    pages: 156,
    category: "Career Development",
    rating: 4.6,
    downloads: 6200,
    readTime: "5 hrs",
    downloadLink: "#",
    featured: false,
    new: true,
    trending: false
  },
  {
    id: 9,
    title: "Project Management for Consultants",
    author: "David Wilson, PMP",
    coverImage: "/images/ebooks/project-management.jpg",
    description: "Essential project management methodologies and tools tailored for consulting engagements.",
    pages: 224,
    category: "Project Management",
    rating: 4.8,
    downloads: 10100,
    readTime: "7 hrs",
    downloadLink: "#",
    featured: false,
    new: false,
    trending: true
  }
];

// Categories for filtering
const categories = [
  "All",
  "Strategy",
  "Finance",
  "Analytics",
  "Communication",
  "Interviews",
  "Business Development",
  "Career Development",
  "Project Management"
];

export default function EbooksPage() {
  // State for active tab and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredEbooks, setFilteredEbooks] = useState(allEbooks);
  const [sortBy, setSortBy] = useState("featured");

  // Filter ebooks based on search query and category
  useEffect(() => {
    let filtered = allEbooks;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(ebook => 
        ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(ebook => ebook.category === selectedCategory);
    }
    
    // Sort ebooks
    if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "downloads") {
      filtered = filtered.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === "newest") {
      filtered = filtered.sort((a, b) => Number(b.new) - Number(a.new));
    }
    
    setFilteredEbooks(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Hero section */}
      <div className="relative overflow-hidden">
        {/* Multi-layered background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:30px_30px]"></div>
        
        {/* Animated floating elements */}
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-[#245D66]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDuration: '18s' }}></div>
        <div className="absolute top-1/2 right-1/6 w-48 h-48 bg-[#245D66]/5 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" style={{ animationDuration: '20s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#245D66]/20 border border-[#245D66]/30 text-[#245D66] text-sm font-medium mb-8">
              <Award className="w-4 h-4 mr-2" />
              Premium Resource Library
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
              Consulting E-Books
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Curated collection of premium resources to accelerate your consulting journey and master essential skills
            </p>
            
            {/* Enhanced search bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search by title, author, or keyword..."
                className="pl-12 pr-32 py-7 bg-black/60 border-2 border-gray-800 hover:border-gray-700 focus:border-[#245D66] rounded-2xl text-white backdrop-blur-lg w-full transition-all duration-300 text-lg [&:not(:placeholder-shown)]:bg-black [&:not(:placeholder-shown)]:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-2 top-2 bg-[#245D66] hover:bg-[#1a474f] text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/20">
                Search
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">{allEbooks.length}+</div>
                <div className="text-gray-400 text-sm">Resources</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-gray-400 text-sm">Downloads</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">4.8</div>
                <div className="text-gray-400 text-sm flex items-center">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-16 relative z-20">
        {/* Enhanced category filters */}
        <div className="flex flex-wrap items-center gap-3 mb-16 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 ${selectedCategory === category 
                ? 'bg-[#245D66] text-white hover:bg-[#1a474f] shadow-lg shadow-[#245D66]/25' 
                : 'bg-transparent border-2 border-gray-700 text-gray-300 hover:border-[#245D66] hover:text-[#245D66] hover:bg-[#245D66]/5'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured E-books Section */}
        {selectedCategory === "All" && searchQuery === "" && (
          <section className="mb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-8 bg-[#245D66] rounded-full mr-4"></div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Featured Collection
                  </h2>
                </div>
                <p className="text-gray-400 text-lg">Handpicked premium resources for consulting excellence</p>
              </div>
              <div className="flex items-center gap-4 mt-6 lg:mt-0">
                <Button variant="outline" className="border-2 border-gray-700 text-gray-300 hover:bg-transparent hover:border-[#245D66] hover:text-[#245D66] transition-all duration-300 group">
                  <TrendingUp className="w-4 h-4 mr-2 group-hover:text-[#245D66]" />
                  Trending
                </Button>
                <Button variant="outline" className="border-2 border-gray-700 text-gray-300 hover:bg-white hover:text-black transition-all duration-300 group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEbooks.map((ebook) => (
                <div 
                  key={ebook.id} 
                  className="group relative bg-gradient-to-b from-gray-900/80 to-black border-2 border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-[#245D66]/50 hover:shadow-2xl hover:shadow-[#245D66]/10 hover:-translate-y-2"
                >
                  {/* Enhanced cover with overlays */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-20 w-20 text-gray-700" />
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {ebook.new && (
                        <Badge className="bg-[#245D66] text-white hover:bg-[#1a474f] px-3 py-1 font-semibold rounded-full">
                          NEW
                        </Badge>
                      )}
                      {ebook.trending && (
                        <Badge className="bg-white text-black hover:bg-gray-200 px-3 py-1 font-semibold rounded-full flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          TRENDING
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <div className="flex flex-col gap-3">
                        <Button className="bg-[#245D66] hover:bg-[#1a474f] text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" className="rounded-full border-2 border-white text-white hover:bg-white hover:text-black">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="rounded-full border-2 border-white text-white hover:bg-white hover:text-black">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="rounded-full border-2 border-white text-white hover:bg-white hover:text-black">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-xs border-[#245D66]/30 text-[#245D66] bg-[#245D66]/5 rounded-full px-3 py-1">
                        {ebook.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-[#245D66] mr-1 fill-[#245D66]" />
                        <span className="text-sm font-semibold text-white">{ebook.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-[#245D66] transition-colors duration-300">
                      {ebook.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      By {ebook.author}
                    </p>
                    <p className="text-sm text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {ebook.description}
                    </p>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-black/30 rounded-xl">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-xs font-medium text-white">{ebook.pages}</div>
                        <div className="text-xs text-gray-400">Pages</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-xs font-medium text-white">{ebook.readTime}</div>
                        <div className="text-xs text-gray-400">Read Time</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-xs font-medium text-white">{(ebook.downloads / 1000).toFixed(1)}K</div>
                        <div className="text-xs text-gray-400">Downloads</div>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <Button className="w-full bg-[#245D66] hover:bg-[#1a474f] text-white py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/20 group">
                      <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Download Now
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All E-books Grid */}
        <section>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-8 bg-[#245D66] rounded-full mr-4"></div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {selectedCategory === "All" ? "Complete Library" : `${selectedCategory} Resources`}
                </h2>
              </div>
              <p className="text-gray-400 text-lg">
                {filteredEbooks.length} {filteredEbooks.length === 1 ? "resource" : "resources"} available
              </p>
            </div>
            <div className="flex items-center gap-4 mt-6 lg:mt-0">
              <select 
                className="bg-black border-2 border-gray-700 rounded-xl py-3 px-4 text-white focus:border-[#245D66] transition-all duration-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="downloads">Most Downloaded</option>
                <option value="newest">Newest First</option>
              </select>
              <Button variant="outline" size="sm" className="border-2 border-gray-700 text-gray-300 hover:bg-transparent hover:border-[#245D66] hover:text-[#245D66] transition-all duration-300">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {filteredEbooks.length === 0 ? (
            <div className="text-center py-24 border-2 border-gray-800 rounded-3xl bg-gradient-to-b from-gray-900/50 to-black">
              <BookOpen className="h-20 w-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">No resources found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                We couldn't find any e-books matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }} 
                className="bg-[#245D66] hover:bg-[#1a474f] text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEbooks.map((ebook) => (
                <div 
                  key={ebook.id} 
                  className="group relative bg-gradient-to-b from-gray-900/80 to-black border-2 border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#245D66]/30 hover:shadow-xl hover:shadow-[#245D66]/5 hover:-translate-y-1"
                >
                  {/* Cover with hover effects */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {ebook.new && (
                        <Badge className="bg-[#245D66] text-white text-xs px-2 py-1 rounded-full">
                          NEW
                        </Badge>
                      )}
                      {ebook.trending && (
                        <Badge className="bg-white text-black text-xs px-2 py-1 rounded-full flex items-center">
                          <TrendingUp className="w-2 h-2 mr-1" />
                          HOT
                        </Badge>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border border-white/30 text-white hover:bg-white hover:text-black">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border border-white/30 text-white hover:bg-white hover:text-black">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs border-[#245D66]/30 text-[#245D66] bg-[#245D66]/5 rounded-full">
                        {ebook.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-[#245D66] mr-1 fill-[#245D66]" />
                        <span className="text-xs font-semibold text-white">{ebook.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-[#245D66] transition-colors duration-300">
                      {ebook.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">By {ebook.author}</p>

                    {/* Mini stats */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        <span>{ebook.pages} pages</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{ebook.readTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{(ebook.downloads / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                    
                    {/* Download button */}
                    <Button className="w-full bg-[#245D66] hover:bg-[#1a474f] text-white py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/20 text-sm group">
                      <Download className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
                Get Notified About New Resources
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive updates when new e-books and resources are added to our collection.
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