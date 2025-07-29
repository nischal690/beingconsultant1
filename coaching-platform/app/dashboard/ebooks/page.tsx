
"use client";

import React, { useState, useEffect, useRef } from "react";
import { collection, query as fsQuery, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useProducts } from "@/context/products-context";
import { getProductsByType, getUserProfile } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase/auth-context";
import { useGritSection } from "@/hooks/useGritSection";
import JourneyStepsContainer from "@/components/journey/JourneyStepsContainer";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import ResourceDialog from "@/components/ebooks/resource-dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { 
  BookOpen, 
  Search, 
  Download, 
  ShoppingCart, 
  Clock, 
  Filter, 
  Star, 
  Sparkles,
  Crown,
  FileText,
  Eye,
  SortAsc,
  Share2,
  Award,
  TrendingUp,
  Users,
  PlayCircle,
  ChevronRight,
  Globe,
  ArrowRight,
  Bookmark,
  Heart,
  Zap,
  CheckCircle
} from "lucide-react";

// Define the Ebook interface
interface Ebook {
  id: string | number;
  title: string;
  productName?: string;
  author?: string;
  coverImage?: string;
  thumbnail?: string; // Add thumbnail property
  description?: string;
  pages?: number;
  category?: string;
  rating?: number;
  downloads?: number;
  readTime?: string;
  downloadLink?: string;
  featured?: boolean;
  new?: boolean;
  trending?: boolean;
  price?: number | null;
  enrolled?: boolean;
  includedInMembership?: boolean;
  isFree?: boolean;
  careerStage?: string;
  productlinks?: any[];
}

// Sample data for featured ebooks
const featuredEbooks = [
  {
    id: 1,
    title: "The Consultant's Playbook: Strategies for Success",
    productName: "The Consultant's Playbook",
    author: "Dr. Sarah Mitchell",
    coverImage: "/images/ebooks/consultant-playbook.jpg",
    thumbnail: "/images/ebooks/consultant-playbook.jpg", // Add thumbnail property
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
    includedInMembership: true,
    isFree: false,
    productlinks: ["link1", "link2"] // Add productlinks property
  },
  {
    id: 2,
    title: "Case Interview Mastery: Frameworks and Techniques",
    productName: "Case Interview Mastery",
    author: "Michael Reynolds",
    coverImage: "/images/ebooks/case-interview.jpg",
    thumbnail: "/images/ebooks/case-interview.jpg", // Add thumbnail property
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
    includedInMembership: true,
    isFree: false,
    productlinks: [] // Empty productlinks array to show Coming Soon
  },
  {
    id: 3,
    title: "Client Communication Excellence",
    productName: "Client Communication Excellence",
    author: "Jennifer Adams",
    coverImage: "/images/ebooks/client-communication.jpg",
    thumbnail: "/images/ebooks/client-communication.jpg", // Add thumbnail property
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
    includedInMembership: false,
    isFree: true,
    productlinks: ["link1"] // Add productlinks property
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
    thumbnail: "/images/ebooks/financial-modeling.jpg",
    description: "Learn essential financial modeling techniques specifically tailored for consulting engagements.",
    pages: 210,
    category: "Finance",
    rating: 4.5,
    downloads: 5600,
    readTime: "6 hrs",
    downloadLink: "#",
    featured: false,
    new: true,
    trending: false,
    price: 14.99,
    enrolled: false,
    includedInMembership: false,
    isFree: false,
    productlinks: [] // Empty productlinks array to show Coming Soon
  },
  {
    id: 5,
    title: "The Art of Business Development",
    productName: "The Art of Business Development",
    author: "Thomas Wright",
    coverImage: "/images/ebooks/business-development.jpg",
    thumbnail: "/images/ebooks/business-development.jpg",
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
    includedInMembership: false,
    isFree: false,
    productlinks: [] // Empty productlinks array to show Coming Soon
  },
  {
    id: 6,
    title: "Data-Driven Consulting",
    productName: "Data-Driven Consulting",
    author: "Dr. Emily Chen",
    coverImage: "/images/ebooks/data-driven.jpg",
    thumbnail: "/images/ebooks/data-driven.jpg",
    description: "Harness the power of data analytics to drive impactful consulting recommendations and solutions.",
    pages: 178,
    category: "Analytics",
    rating: 4.7,
    downloads: 8900,
    readTime: "4 hrs",
    downloadLink: "#",
    featured: false,
    new: false,
    trending: false,
    price: null,
    enrolled: false,
    includedInMembership: false,
    isFree: true,
    productlinks: ["link1", "link2"] // Add productlinks property
  },
  {
    id: 7,
    title: "Consulting Proposal Templates",
    productName: "Consulting Proposal Templates",
    author: "Mark Johnson",
    coverImage: "/images/ebooks/proposal-templates.jpg",
    thumbnail: "/images/ebooks/proposal-templates.jpg",
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
    includedInMembership: false,
    isFree: true,
    productlinks: [] // Empty productlinks array to show Coming Soon
  },
  {
    id: 8,
    title: "Networking for Consultants",
    productName: "Networking for Consultants",
    author: "Alexandra Torres",
    coverImage: "/images/ebooks/networking.jpg",
    thumbnail: "/images/ebooks/networking.jpg",
    description: "Build and leverage professional relationships to advance your consulting career and business opportunities.",
    pages: 156,
    category: "Career Development",
    rating: 4.7,
    downloads: 8900,
    readTime: "4 hrs",
    downloadLink: "#",
    featured: false,
    new: false,
    trending: false,
    price: null,
    enrolled: false,
    includedInMembership: false,
    isFree: true,
    productlinks: [] // Empty productlinks array to show Coming Soon
  },
  {
    id: 9,
    title: "Project Management for Consultants",
    productName: "Project Management for Consultants",
    author: "James Wilson",
    coverImage: "/images/ebooks/project-management.jpg",
    thumbnail: "/images/ebooks/project-management.jpg",
    description: "Essential project management methodologies and tools tailored specifically for consulting engagements.",
    pages: 230,
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
    includedInMembership: false,
    isFree: true
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
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  
  // Create a ref for the ebooks list section
  const ebooksListRef = useRef<HTMLDivElement>(null);
  
  // For debugging
  useEffect(() => {
    console.log("Resource dialog state:", showResourceDialog);
    console.log("Selected ebook:", selectedEbook);
  }, [showResourceDialog, selectedEbook]);

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
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes focus-highlight {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(36, 93, 102, 0.3); }
          25% { transform: scale(1.05); box-shadow: 0 0 30px rgba(36, 93, 102, 0.8); }
          50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(36, 93, 102, 0.6); }
          75% { transform: scale(1.04); box-shadow: 0 0 25px rgba(36, 93, 102, 0.7); }
          100% { transform: scale(1.03); box-shadow: 0 0 20px rgba(36, 93, 102, 0.6); }
        }
        .focus-highlight {
          animation: focus-highlight 2s ease-out forwards;
          position: relative;
          z-index: 50 !important;
        }
        .blur-effect {
          filter: blur(4px) grayscale(80%);
          opacity: 0.5;
          transform: scale(0.95);
          transition: all 0.5s ease-out;
        }
        .blur-effect:hover {
          filter: blur(1px) grayscale(30%);
          opacity: 0.8;
          transform: scale(0.98);
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Scroll to highlighted ebook on mount if ID is present
  useEffect(() => {
    if (highlightedId) {
      console.log("[EbooksPage] Highlighting ebook with ID:", highlightedId);
      
      // Apply blur with a slight delay to ensure DOM is ready
      setTimeout(() => {
        applyBlurEffect();
      }, 300);
      
      // Function to attempt scrolling to the element
      const scrollToElement = () => {
        const element = document.getElementById(`ebook-${highlightedId}`);
        
        if (element) {
          // Scroll the element into view
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add focus effect with a stronger visual indication
          element.classList.add('focus-highlight');
          
          // Add a temporary border pulse animation
          element.style.boxShadow = '0 0 0 4px rgba(36, 93, 102, 0.8)';
          element.style.transition = 'box-shadow 1s ease-in-out';
          
          // Remove focus effect after animation completes
          setTimeout(() => {
            element.classList.remove('focus-highlight');
            // Fade out the box shadow gradually
            element.style.boxShadow = '0 0 0 0px rgba(36, 93, 102, 0)';
          }, 3000);
          
          return true;
        }
        return false;
      };
      
      // Try to scroll immediately
      if (!scrollToElement()) {
        // If element not found, try again after a delay to allow for data loading
        const checkInterval = setInterval(() => {
          console.log("[EbooksPage] Attempting to find and scroll to element again...");
          if (scrollToElement()) {
            clearInterval(checkInterval);
          }
        }, 500);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => {
          clearInterval(checkInterval);
          console.log("[EbooksPage] Stopped looking for element after timeout");
        }, 10000);
      }
    } else {
      // Remove blur effect from all ebooks when no ID is present
      document.querySelectorAll('.blur-effect').forEach(el => {
        el.classList.remove('blur-effect');
      });
    }
  }, [highlightedId]);
  
  // State for ebooks and filtering
  const [ebooks, setEbooks] = useState(allEbooks);
  const [filteredEbooks, setFilteredEbooks] = useState(allEbooks);
  const [sortBy, setSortBy] = useState("featured");
  
  // Additional effect to scroll to highlighted element when filtered ebooks change
  useEffect(() => {
    if (highlightedId && filteredEbooks.length > 0) {
      // Small delay to ensure DOM is updated with filtered results
      setTimeout(() => {
        const element = document.getElementById(`ebook-${highlightedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [filteredEbooks, highlightedId]);
  
  // Apply blur effect to all non-highlighted ebooks
  const applyBlurEffect = () => {
    if (!highlightedId) return;
    
    console.log("[EbooksPage] Applying blur effect for ID:", highlightedId);
    
    // First remove any existing blur effects
    document.querySelectorAll('.blur-effect').forEach(el => {
      el.classList.remove('blur-effect');
    });
    
    // Then apply blur to all ebooks except the highlighted one
    // Target both featured and regular ebook cards
    const featuredCards = document.querySelectorAll('.featured-ebook-card');
    const regularCards = document.querySelectorAll('.regular-ebook-card');
    
    [...featuredCards, ...regularCards].forEach(card => {
      if (!card.id.includes(`ebook-${highlightedId}`)) {
        card.classList.add('blur-effect');
      }
    });
  };
  
  // Apply filter when selectedSection changes, but only if ID parameter exists
  useEffect(() => {
    // Only apply the filter if there's an ID parameter in the URL
    if (highlightedId && selectedSection && selectedSection.title && filters.includes(selectedSection.title)) {
      setSelectedFilter(selectedSection.title);
    } else if (!highlightedId) {
      // Reset to 'all' if no ID parameter is present
      setSelectedFilter("all");
    }
  }, [selectedSection, highlightedId]);
  
  // Re-apply blur effect when DOM changes (like after filtering)
  useEffect(() => {
    if (highlightedId) {
      // Small delay to ensure DOM is updated
      setTimeout(applyBlurEffect, 100);
    }
  }, [filteredEbooks, highlightedId]);

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

      // Debug the raw data
      console.log("Raw ebooks data:", docs);
      
      setEbooks(docs.map((doc: any) => {
        // Create the ebook object
        const ebook = {
          ...doc,
          careerStage: (doc.careerStage || "").toLowerCase(),
          price: doc.price || 99,
          includedInMembership: doc.includedInMembership || false,
          isFree: Boolean(doc.isFree) || (!doc.price || doc.price === 0) // Ensure it's a boolean and consider price=0 as free
        };
        
        // Debug each ebook
        console.log(`Ebook ${ebook.title}: isFree = ${ebook.isFree}, price = ${ebook.price}`);
        
        return ebook;
      }));
    }
    fetchFiltered()
  }, [selectedFilter, cachedProducts, productsCacheLoading])

  const router = useRouter();

  const handleBuyNow = (ebook: any) => {
    // Don't allow free members to buy BC + membership products
    if (!isMember && ebook.includedInMembership) {
      toast.info('This resource is only available with BC + Membership. Please upgrade to access.', { 
        duration: 5000,
        action: {
          label: 'Upgrade',
          onClick: () => router.push('/dashboard/membership')
        }
      });
      return;
    }
    
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
            
            {/* Search bar removed as requested */}
            
            {/* Journey Steps Container - only shown when ID is present in URL */}
            {highlightedId && (
              <div className="mt-12 max-w-4xl mx-auto">
                <JourneyStepsContainer 
                  onViewRecommended={() => {
                    // Remove blur effect from all ebooks
                    document.querySelectorAll('.blur-effect').forEach(el => {
                      el.classList.remove('blur-effect');
                    });
                    
                    // Scroll to the ebooks list section
                    if (ebooksListRef.current) {
                      ebooksListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-16 relative z-20">
        {/* Enhanced category filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
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
                  className={`featured-ebook-card group relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#245D66]/5 hover:-translate-y-1 ${highlightedId && (String(highlightedId) === String(ebook.id)) 
                    ? 'border-[3px] border-gray-900 scale-[1.03] shadow-lg shadow-[#245D66]/30 animate-pulse-slow z-20' 
                    : 'border border-gray-900 hover:border-gray-900'}`}
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

                    {/* Product title and author removed as requested */}
                    
                    {/* Coming Soon indicator when productlinks is empty */}
                    {ebook.productlinks && ebook.productlinks.length === 0 && (
                      <div className="mt-1 mb-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                          Coming Soon
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-gray-700 mb-6 line-clamp-3 leading-relaxed">
                      {ebook.description}
                    </p>

                    {/* Stats grid removed as requested */}
                    
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
        <section ref={ebooksListRef}>
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
            {/* Filters removed */}
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
                  className={`regular-ebook-card group relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#245D66]/5 hover:-translate-y-1 ${highlightedId && (String(highlightedId) === String(ebook.id)) 
                    ? 'border-[3px] border-gray-900 scale-[1.03] shadow-lg shadow-[#245D66]/30 animate-pulse-slow z-20' 
                    : 'border border-gray-900 hover:border-gray-900'}`}
                  id={`ebook-${ebook.id}`}
                >
                  {/* Cover with hover effects */}
                  <div className="aspect-square relative overflow-hidden">
                    {/* Cover image */}
                    {ebook.thumbnail ? (
                      <Image
                        src={ebook.thumbnail}
                        alt={ebook.productName || ebook.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover bg-gray-900 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-500" />
                      </div>
                    )}

                    {/* Overlay title for image */}
                    {ebook.coverImage && (
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-[#245D66] hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEbook(ebook);
                            setShowResourceDialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-[#245D66] hover:text-white">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-[#245D66] hover:text-white">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category badge and product title removed as requested */}
                    
                    {/* Membership status section */}
                    <div className="flex flex-col space-y-1 mb-2">
                      <div className="flex items-center justify-between">
                        
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
                          <span className="w-full text-center text-xs text-green-600 flex items-center justify-center bg-green-50 px-2 py-1 rounded-full">
                            <span className="mr-1">✓</span> Included in BC + Membership
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mini stats removed as requested */}
                    
                    {/* Download button - Show different text based on membership status */}
                    {ebook.productlinks && ebook.productlinks.length === 0 ? (
                      <Button
                        className="w-full py-2 rounded-lg transition-all duration-300 text-sm group bg-yellow-100 text-yellow-800 cursor-default"
                        disabled
                      >
                        <span className="flex items-center justify-center">
                          <Clock className="h-3 w-3 mr-2" />
                          Coming Soon
                        </span>
                      </Button>
                    ) : (
                      <Button
                        className={`w-full py-2 rounded-lg transition-all duration-300 hover:shadow-lg text-sm group ${(!isMember && ebook.includedInMembership) ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20' : 'bg-[#245D66] hover:bg-[#1a474f] hover:shadow-[#245D66]/20'}`}
                        onClick={(e) => {
                          e.stopPropagation();

                          // 1. If the user already has access to this resource (purchased, included in membership, OR it's free) – open the resource dialog.
                          if (ebook.enrolled || (isMember && ebook.includedInMembership) || ebook.isFree || (!ebook.price || ebook.price === 0)) {
                            setSelectedEbook(ebook);
                            // Open dialog immediately after setting selected ebook
                            setShowResourceDialog(true);
                            return;
                          }

                          // 2. The ebook requires BC + membership but the user is not a member – prompt upgrade.
                          if (!isMember && ebook.includedInMembership) {
                            toast.info('This resource is only available with BC + Membership. Please upgrade to access.', {
                              duration: 5000,
                              action: {
                                label: 'Upgrade',
                                onClick: () => router.push('/dashboard/membership'),
                              },
                            });
                            return;
                          }

                          // 3. For any other paid product, navigate directly to membership page
                          router.push('/dashboard/membership');
                        }}
                      >
                        {/* Debug the ebook properties (moved outside JSX) */}
                        
                        {/* Free products are accessible to everyone - Check isFree first */}
                        {ebook.isFree || (!ebook.price || ebook.price === 0) ? (
                          <span className="flex items-center justify-center">
                            <BookOpen className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            View Resource
                          </span>
                        ) : ebook.enrolled ? (
                          <span className="flex items-center justify-center">
                            <BookOpen className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            View Resource
                          </span>
                        ) : (isMember && ebook.includedInMembership) ? (
                        <span className="flex items-center justify-center">
                          <BookOpen className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          View Resource
                        </span>
                      ) : !isMember && ebook.includedInMembership ? (
                        <span className="flex items-center justify-center">
                          <BookOpen className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          View Resource
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Zap className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Upgrade to BC+
                        </span>
                      )}
                    </Button>
                    )}
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
              <Crown className="h-10 w-10 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Become a BC+ Member
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Get unlimited access to all premium e-books and resources with BC+ membership. Elevate your consulting career today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black transition-all duration-300 rounded-xl py-6 px-8 font-semibold flex items-center gap-2"
                  onClick={() => router.push('/dashboard/membership')}
                >
                  Upgrade to BC+ <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-700 hover:border-gray-500 hover:bg-black/50 text-white transition-all duration-300 rounded-xl py-6 px-8 font-semibold"
                  onClick={() => router.push('/dashboard/membership')}
                >
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-6">
                <CheckCircle className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Premium resources</span>
                <CheckCircle className="h-4 w-4 text-yellow-400 ml-4" />
                <span className="text-sm text-gray-400">Exclusive content</span>
                <CheckCircle className="h-4 w-4 text-yellow-400 ml-4" />
                <span className="text-sm text-gray-400">Priority support</span>
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
              <DialogTitle>Buy "{selectedEbook.title}"</DialogTitle>
              <DialogDescription className="text-sm text-gray-300 mt-1">
                Select payment method to continue
              </DialogDescription>
            </DialogHeader>
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

      {/* Resource Description Dialog */}
      {selectedEbook && (
        <ResourceDialog 
          open={showResourceDialog}
          onOpenChange={setShowResourceDialog}
          ebook={selectedEbook}
        />
      )}

      {/* Bottom spacing */}
      <div className="h-16"></div>
    </div>
  );
}