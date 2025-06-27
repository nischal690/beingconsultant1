
"use client";

import React, { useState, useEffect } from "react";
import { collection, query as fsQuery, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useProducts } from "@/context/products-context";
import { getProductsByType, getUserProfile } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase/auth-context";
import { useGritSection } from "@/hooks/useGritSection";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
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
  Globe,
  ShoppingCart
} from "lucide-react";

// Sample data for featured ebooks
const featuredEbooks = [
  {
    id: 1,
    title: "The Consultant's Playbook: Strategies for Success",
    productName: "The Consultant's Playbook",
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
    trending: true,
    price: 29.99,
    enrolled: false,
    includedInMembership: true
  },
  {
    id: 2,
    title: "Case Interview Mastery: Frameworks and Techniques",
    productName: "Case Interview Mastery",
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
    trending: false,
    price: 24.99,
    enrolled: false,
    includedInMembership: true
  },
  {
    id: 3,
    title: "Client Communication Excellence",
    productName: "Client Communication Excellence",
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
    trending: false,
    price: 0,
    enrolled: false,
    includedInMembership: false
  }
];

// Sample data for all ebooks
const allEbooks = [
  ...featuredEbooks,
  {
    id: 4,
    title: "Financial Modeling for Consultants",
    productName: "Financial Modeling for Consultants",
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
    trending: false,
    price: 19.99,
    enrolled: true,
    includedInMembership: false
  },
  {
    id: 5,
    title: "The Art of Business Development",
    productName: "The Art of Business Development",
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
    trending: false,
    price: 14.99,
    enrolled: false,
    includedInMembership: false
  },
  {
    id: 6,
    title: "Data-Driven Consulting",
    productName: "Data-Driven Consulting",
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
    trending: true,
    price: 34.99,
    enrolled: false,
    includedInMembership: true
  },
  {
    id: 7,
    title: "Consulting Proposal Templates",
    productName: "Consulting Proposal Templates",
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
    trending: false,
    price: null,
    enrolled: false,
    includedInMembership: false
  },
  {
    id: 8,
    title: "Networking for Consultants",
    productName: "Networking for Consultants",
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
    trending: false,
    price: 0,
    enrolled: false,
    includedInMembership: false
  },
  {
    id: 9,
    title: "Project Management for Consultants",
    productName: "Project Management for Consultants",
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

// Career stage filters (GRIT framework)
const filters = [
  "all",
  "Get Clarity",
  "Ready the Foundation",
  "Interview to Win",
  "Thrive in Consulting",
  "Step into What's Next"
];

export default function EbooksPage() {
  // Handle payment method select
  const handlePaymentMethodSelect = (method: 'razorpay' | 'stripe') => {
    toast.success(`Processing payment via ${method}...`, { duration: 2000 });

    setTimeout(() => {
      setShowBuyDialog(false);
      toast.success('Payment successful! E-book added to your library.', { duration: 5000 });
    }, 2000);
  };

  // Get URL search params
  const searchParams = useSearchParams();
  const highlightedId = searchParams.get('id');
  
  // State for active tab and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isMember, setIsMember] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<any | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  // Get user from auth context
  const { user } = useAuth();

  // Load selected GRIT section
  const { selectedSection } = useGritSection();
  
  // Fetch membership status when user changes
  useEffect(() => {
    async function fetchMembership() {
      if (!user) {
        setIsMember(false);
        return;
      }
      try {
        const res = await getUserProfile(user.uid);
        if (res.success && res.data) {
          setIsMember(!!res.data.isMember);
        } else {
          setIsMember(false);
        }
      } catch (err) {
        console.error("Error fetching membership status", err);
        setIsMember(false);
      }
    }
    fetchMembership();
  }, [user]);

  // Add custom animation class to global styles
  useEffect(() => {
    // Add custom animation if it doesn't exist yet
    if (!document.getElementById('custom-animations')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'custom-animations';
      styleEl.innerHTML = `
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 rgba(36, 93, 102, 0.3); border-color: rgba(36, 93, 102, 1); }
          50% { box-shadow: 0 0 20px rgba(36, 93, 102, 0.6); border-color: rgba(36, 93, 102, 0.8); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Scroll to highlighted ebook on mount if ID is present
  useEffect(() => {
    if (highlightedId) {
      const element = document.getElementById(`ebook-${highlightedId}`);
      if (element) {
        // Add a slight delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [highlightedId]);

  // Apply filter when selectedSection changes
  useEffect(() => {
    if (selectedSection && selectedSection.title && filters.includes(selectedSection.title)) {
      setSelectedFilter(selectedSection.title);
    }
  }, [selectedSection]);
  const [ebooks, setEbooks] = useState(allEbooks);
  const [filteredEbooks, setFilteredEbooks] = useState(allEbooks);
  const [sortBy, setSortBy] = useState("featured");

  // ---------- Load from products cache ----------
  const { products: cachedProducts, loading: productsCacheLoading } = useProducts();

  useEffect(() => {
    if (productsCacheLoading) return;

    console.log("[EbooksPage] Products cache loaded, total products:", cachedProducts.length);

    const docs = cachedProducts.filter((p: any) => {
      const type = (p.type || "").toLowerCase();
      return type === "ebooks/guides";
    });

    console.log("[EbooksPage] Filtered ebooks/guides:", docs.length, docs);

    setEbooks(docs.map((doc: any) => ({
      ...doc,
      careerStage: (doc.careerStage || "").toLowerCase(),
      price: doc.price || 99,
      includedInMembership: doc.includedInMembership || false
    })));
  }, [cachedProducts, productsCacheLoading]);

  // ---------- Refetch when filter changes ----------
  useEffect(() => {
    const fetchFiltered = () => {
      if (productsCacheLoading) return;

      console.log("[EbooksPage] Applying filter:", selectedFilter);

      // First get all ebooks/guides products
      let docs = cachedProducts.filter((p: any) => {
        const type = (p.type || "").toLowerCase();
        return type === "ebooks/guides";
      });
      
      console.log("[EbooksPage] Total ebooks/guides before filtering:", docs.length);

      // Only apply career stage filter if not "all"
      if (selectedFilter !== "all") {
        console.log("[EbooksPage] Filtering by career stage:", selectedFilter);
        docs = docs.filter((doc: any) => {
          const docStage = (doc.careerStage || "");
          console.log("[EbooksPage] Comparing", docStage, "with", selectedFilter);
          return docStage === selectedFilter;
        });
      }

      console.log("[EbooksPage] Docs after filter:", docs.length, docs);

      setEbooks(docs.map((doc: any) => ({ 
        ...doc, 
        careerStage: (doc.careerStage || "").toLowerCase(),
        price: doc.price || 99,
        includedInMembership: doc.includedInMembership || false 
      })));
    }
    fetchFiltered()
  }, [selectedFilter, cachedProducts, productsCacheLoading])

  const handleBuyNow = (ebook: any) => {
    setSelectedEbook(ebook);
    setShowBuyDialog(true);
  };

  // Filter + search + sort client-side
  useEffect(() => {
    let filtered = ebooks;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(ebook => 
        ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // careerStage already filtered by Firestore, nothing additional
    
    // Sort ebooks
    if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "downloads") {
      filtered = filtered.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === "newest") {
      filtered = filtered.sort((a, b) => Number(b.new) - Number(a.new));
    }
    
    setFilteredEbooks(filtered);
  }, [searchQuery, ebooks, sortBy]);

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
          {filters.map((filterItem) => (
            <Button
              key={filterItem}
              variant={selectedFilter === filterItem ? "default" : "outline"}
              className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 ${selectedFilter === filterItem 
                ? 'bg-[#245D66] text-white hover:bg-[#1a474f] shadow-lg shadow-[#245D66]/25' 
                : 'bg-transparent border-2 border-gray-700 text-gray-300 hover:border-[#245D66] hover:text-[#245D66] hover:bg-[#245D66]/5'}`}
              onClick={() => setSelectedFilter(filterItem)}
            >
              {filterItem}
            </Button>
          ))}
        </div>

        {/* Featured E-books Section */}
        {selectedFilter === "All" && searchQuery === "" && (
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
                  className={`group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#245D66]/5 hover:-translate-y-1 ${highlightedId === String(ebook.id) 
                    ? 'border-[3px] border-[#245D66] scale-[1.03] shadow-lg shadow-[#245D66]/30 animate-pulse-slow' 
                    : 'border border-gray-200 hover:border-[#245D66]/30'}`}
                  id={`ebook-${ebook.id}`}
                >
                  {/* Enhanced cover with overlays */}
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
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
                        <span className="text-sm font-semibold text-black">{ebook.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 line-clamp-2 text-[#245D66] transition-colors duration-300">
                      {ebook.productName || ebook.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      By {ebook.author || "BeingConsultant"}
                    </p>
                    <p className="text-sm text-gray-700 mb-6 line-clamp-3 leading-relaxed">
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
                  {selectedFilter === "all" ? "Complete Library" : `${selectedFilter} Resources`}
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
                  setSelectedFilter("all");
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
                  className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#245D66]/5 hover:-translate-y-1 ${highlightedId === String(ebook.id) 
                    ? 'border-[3px] border-[#245D66] scale-[1.03] shadow-lg shadow-[#245D66]/30 animate-pulse-slow' 
                    : 'border border-gray-200 hover:border-[#245D66]/30'}`}
                  id={`ebook-${ebook.id}`}
                >
                  {/* Cover with hover effects */}
                  <div className="aspect-square relative overflow-hidden">
                    {/* Cover image */}
                    {ebook.coverImage ? (
                      <Image
                        src={ebook.coverImage}
                        alt={ebook.productName || ebook.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain bg-gray-900 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 text-center">
                        <BookOpen className="h-16 w-16 text-gray-500 group-hover:scale-110 transition-transform duration-300 mb-3" />
                        <h4 className="text-[#245D66] text-sm font-medium line-clamp-2 bg-white/90 px-3 py-1 rounded transition-colors duration-300">
                          {ebook.productName || ebook.title}
                        </h4>
                      </div>
                    )}

                    {/* Overlay title for image */}
                    {(ebook.thumbnail || ebook.coverImage) && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                        <h4 className="text-white text-xs font-medium line-clamp-2">
                          {ebook.productName || ebook.title}
                        </h4>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {ebook.new && (
                        <Badge className="bg-[#245D66] text-white text-xs px-2 py-1 rounded-full">NEW</Badge>
                      )}
                      {ebook.trending && (
                        <Badge className="bg-white text-black text-xs px-2 py-1 rounded-full flex items-center">
                          <TrendingUp className="w-2 h-2 mr-1" /> HOT
                        </Badge>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-[#245D66] hover:text-white">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-[#245D66] hover:text-white">
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
                        <span className="text-xs font-semibold text-black">{ebook.rating}</span>
                      </div>
                    </div>

                    <h3 className="!text-[#245D66] text-base font-bold mb-2 line-clamp-2 transition-colors duration-300" style={{color: '#245D66'}}>
                      {ebook.productName || ebook.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">By {ebook.author || "BeingConsultant"}</p>
                    
                    {/* Price display */}
                    <div className="flex flex-col space-y-1 mb-2">
                      {/* Price row */}
                      <div className="flex items-center justify-between">
                        {/* Show price only if not free, not null/undefined, AND (not a member OR not included in membership) */}
                        {ebook.price != null && ebook.price > 0 && (!isMember || !ebook.includedInMembership) && (
                          <span className="font-bold text-[#245D66] text-lg">
                            ${ebook.price}
                          </span>
                        )}
                        
                        {/* Show free badge if price is 0 or null */}
                        {(!ebook.price || ebook.price === 0) && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            Free
                          </span>
                        )}
                        
                        {/* Show purchased badge if enrolled */}
                        {ebook.enrolled && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Purchased
                          </span>
                        )}
                      </div>
                      
                      {/* Membership status - show if included in membership */}
                      {ebook.includedInMembership && (
                        <div className="flex items-center">
                          <span className="text-xs text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
                            <span className="mr-1">✓</span> Included in BC+ Membership
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mini stats */}
                    <div className="flex items-center justify-between text-xs text-gray-700 mb-4">
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
                    
                    {/* Download button - Show different text based on membership status */}
                    <Button
                      className="w-full bg-[#245D66] hover:bg-[#1a474f] text-white py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#245D66]/20 text-sm group"
                      onClick={(e) => { e.stopPropagation(); handleBuyNow(ebook); }}
                    >
                      {/* Free products are accessible to everyone */}
                      {(!ebook.price || ebook.price === 0) ? (
                        <span className="flex items-center justify-center">
                          <Download className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Download Free
                        </span>
                      ) : ebook.enrolled ? (
                        <span className="flex items-center justify-center">
                          <Download className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Download
                        </span>
                      ) : isMember && ebook.includedInMembership ? (
                        <span className="flex items-center justify-center">
                          <Download className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Download Now
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <ShoppingCart className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Buy Now
                        </span>
                      )}
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
      
      {/* Buy dialog */}
      {selectedEbook && (
        <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
          <DialogContent className="relative w-full bg-black/95 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)] text-white backdrop-blur-2xl overflow-hidden p-6 sm:max-w-4xl rounded-lg">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#245D66]/30 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#245D66]/30 rounded-full filter blur-3xl"></div>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Buy "{selectedEbook.title}"</DialogTitle>
            </DialogHeader>
            <p className="text-sm mb-4">Select payment method to continue</p>
            <div className="grid grid-cols-1 gap-3">
              <Button
                className="w-full bg-[#072654] hover:bg-[#0A3A7A] text-white"
                onClick={() => handlePaymentMethodSelect('razorpay')}
              >
                Pay with Razorpay
              </Button>
              <Button
                className="w-full bg-[#635BFF] hover:bg-[#8780FF] text-white"
                onClick={() => handlePaymentMethodSelect('stripe')}
              >
                Pay with Stripe
              </Button>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between border-t border-white/10 pt-4 mt-4">
              <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Bottom spacing */}
      <div className="h-16"></div>
    </div>
  );
}