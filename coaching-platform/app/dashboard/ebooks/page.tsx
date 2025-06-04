"use client";

import React, { useState, useEffect } from "react";
import { useHeader } from "@/lib/context/header-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Tag, 
  Sparkles,
  Heart,
  Filter,
  SortAsc
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    downloadLink: "#",
    featured: true,
    new: false
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
    downloadLink: "#",
    featured: true,
    new: true
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
    downloadLink: "#",
    featured: true,
    new: false
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
    downloadLink: "#",
    featured: false,
    new: false
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
    downloadLink: "#",
    featured: false,
    new: true
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
    downloadLink: "#",
    featured: false,
    new: false
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
    downloadLink: "#",
    featured: false,
    new: false
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
    downloadLink: "#",
    featured: false,
    new: true
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
    downloadLink: "#",
    featured: false,
    new: false
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
  // Use header context
  const { setHeaderVisible } = useHeader();
  
  // State for active tab and filters
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredEbooks, setFilteredEbooks] = useState(allEbooks);
  
  useEffect(() => {
    // Ensure header is visible when this page loads
    setHeaderVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    
    setFilteredEbooks(filtered);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section with animated gradient background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80"></div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        
        {/* Animated subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#111] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#222] rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse" style={{ animationDuration: '25s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-gradient-x">
              Premium E-Books Collection
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Exclusive resources to elevate your consulting career and expertise
            </p>
            
            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search by title, author, or keyword..."
                className="pl-10 py-6 bg-black/50 border-2 border-gray-800 hover:border-gray-700 focus:border-white rounded-xl text-white backdrop-blur-lg w-full transition-all duration-300 [&:not(:placeholder-shown)]:bg-black [&:not(:placeholder-shown)]:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-10 relative z-20">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${selectedCategory === category 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-transparent border border-gray-700 text-gray-300 hover:border-white hover:text-white'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured E-books Section */}
        {selectedCategory === "All" && searchQuery === "" && (
          <section className="mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Featured E-Books
                </h2>
                <p className="text-gray-400">Handpicked resources for consultants</p>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0 border border-gray-700 text-gray-300 hover:bg-white hover:text-black transition-all duration-300 group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEbooks.map((ebook) => (
                <div 
                  key={ebook.id} 
                  className="group relative bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-gray-700 hover:shadow-xl hover:shadow-white/5 hover:-translate-y-1"
                >
                  {/* Cover image with fallback */}
                  <div className="aspect-[2/3] relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-700" />
                    </div>
                    {ebook.new && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-white text-black hover:bg-gray-200 px-3 py-1 font-semibold">
                          NEW
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {ebook.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-white mr-1 fill-white" />
                        <span className="text-sm font-medium">{ebook.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
                      {ebook.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">By {ebook.author}</p>
                    <p className="text-sm text-gray-300 mb-6 line-clamp-3">
                      {ebook.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{ebook.pages} pages</span>
                      </div>
                      <Button variant="outline" asChild className="border border-gray-700 text-white hover:bg-white hover:text-black transition-all duration-300">
                        <Link href={ebook.downloadLink}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All E-books Grid */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {selectedCategory === "All" ? "All E-Books" : `${selectedCategory} E-Books`}
              </h2>
              <p className="text-gray-400">
                {filteredEbooks.length} {filteredEbooks.length === 1 ? "resource" : "resources"} available
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="border border-gray-700 text-gray-300 hover:bg-transparent hover:border-white hover:text-white transition-all duration-300">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" className="border border-gray-700 text-gray-300 hover:bg-transparent hover:border-white hover:text-white transition-all duration-300">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          {filteredEbooks.length === 0 ? (
            <div className="text-center py-20 border border-gray-800 rounded-2xl bg-black/50">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No e-books found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }} variant="outline" className="border border-gray-700 text-gray-300 hover:bg-white hover:text-black transition-all duration-300">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEbooks.map((ebook) => (
                <div 
                  key={ebook.id} 
                  className="group relative bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden transition-all duration-500 hover:border-gray-600 hover:shadow-xl hover:shadow-white/5"
                >
                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10">
                    <div className="flex flex-col items-center gap-4">
                      <Button variant="outline" asChild className="border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full w-40">
                        <Link href={ebook.downloadLink}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Link>
                      </Button>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="rounded-full border border-gray-400 text-gray-400 hover:text-white hover:border-white">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border border-gray-400 text-gray-400 hover:text-white hover:border-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border border-gray-400 text-gray-400 hover:text-white hover:border-white">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Cover image with fallback */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-700" />
                    </div>
                    {ebook.new && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-white text-black hover:bg-gray-200 px-2 py-0.5 text-xs font-semibold">
                          NEW
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {ebook.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-white mr-1 fill-white" />
                        <span className="text-xs font-medium">{ebook.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold mb-1 line-clamp-2 group-hover:text-white transition-colors duration-300">
                      {ebook.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">By {ebook.author}</p>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        <span>{ebook.pages} pages</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>~{Math.round(ebook.pages / 30)} hrs</span>
                      </div>
                    </div>
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