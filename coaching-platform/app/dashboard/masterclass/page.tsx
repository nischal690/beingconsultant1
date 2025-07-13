"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { 
  Search,
  Clock,
  Star,
  Play,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  Users,
  Award,
  TrendingUp,
  Filter,
  BookOpen,
  Zap,
  Crown,
  ChevronRight,
  ShoppingCart
} from "lucide-react"
import { LearningDialog } from "@/components/masterclass/learning-dialog"
import { collection, query as fsQuery, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useProducts } from "@/context/products-context"
import Image from "next/image"
import { useGritSection } from "@/hooks/useGritSection"
import { getProductsByType } from "@/lib/firebase/firestore"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserProfile } from "@/lib/firebase/firestore"
import JourneyStepsContainer from "@/components/journey/JourneyStepsContainer"

interface Masterclass {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  instructor: string
  rating: number
  enrolled: boolean
  featured?: boolean
  students?: number
  level?: string
  category?: string
  careerStage?: string
  price?: number
  includedInMembership?: boolean
  isFree?: boolean
  productlinks?: string[] // Added productlinks field to the interface
}

export default function MasterclassPage() {
  // Get URL search params and router
  const searchParams = useSearchParams()
  const router = useRouter()
  const highlightedId = searchParams.get('id')
  
  // Create a ref for the masterclass list section
  const masterclassListRef = useRef<HTMLDivElement>(null)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)
  // Search functionality removed
  const [selectedFilter, setSelectedFilter] = useState("all")
  // Hover functionality removed
  const [isMember, setIsMember] = useState<boolean>(false)
  const [showLearningDialog, setShowLearningDialog] = useState(false)
  const [selectedMasterclass, setSelectedMasterclass] = useState<any>(null)
  
  // Get user from auth context
  const { user } = useAuth()
  
  // Handle opening the learning dialog
  const handleStartLearning = (masterclass: any) => {
    setSelectedMasterclass(masterclass)
    setShowLearningDialog(true)
  }

  // Add custom animation if it doesn't exist yet
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

  // Apply blur effect to all non-highlighted masterclasses
  const applyBlurEffect = () => {
    if (!highlightedId) return;
    
    console.log("[MasterclassPage] Applying blur effect for ID:", highlightedId);
    
    // First remove any existing blur effects
    document.querySelectorAll('.blur-effect').forEach(el => {
      el.classList.remove('blur-effect');
    });
    
    // Then apply blur to all masterclasses except the highlighted one
    const masterclassCards = document.querySelectorAll('.masterclass-card');
    
    masterclassCards.forEach(card => {
      if (!card.id.includes(`masterclass-${highlightedId}`)) {
        card.classList.add('blur-effect');
      }
    });
  };
  
  // Scroll to highlighted masterclass on mount if ID is present
  useEffect(() => {
    if (highlightedId) {
      console.log("[MasterclassPage] Highlighting masterclass with ID:", highlightedId);
      
      // Apply blur with a slight delay to ensure DOM is ready
      setTimeout(() => {
        applyBlurEffect();
      }, 300);
      
      // Function to attempt scrolling to the element
      const scrollToElement = () => {
        const element = document.getElementById(`masterclass-${highlightedId}`);
        
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
          console.log("[MasterclassPage] Attempting to find and scroll to element again...");
          if (scrollToElement()) {
            clearInterval(checkInterval);
          }
        }, 500);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => {
          clearInterval(checkInterval);
          console.log("[MasterclassPage] Stopped looking for element after timeout");
        }, 10000);
      }
    } else {
      // Remove blur effect from all masterclasses when no ID is present
      document.querySelectorAll('.blur-effect').forEach(el => {
        el.classList.remove('blur-effect');
      });
    }
  }, [highlightedId]);
  


  // Load selected GRIT section from localStorage
  const { selectedSection } = useGritSection();

  // Apply career stage filter when selectedSection changes, but only if ID parameter exists
  useEffect(() => {
    // Only apply the filter if there's an ID parameter in the URL
    if (highlightedId && selectedSection && selectedSection.title && filters.includes(selectedSection.title)) {
      setSelectedFilter(selectedSection.title);
    } else if (!highlightedId) {
      // Reset to 'all' if no ID parameter is present
      setSelectedFilter("all");
    }
  }, [selectedSection, highlightedId]);

  // Get products from global cache
  const { products: allProducts, loading: productsLoading } = useProducts()

  // Career stage filters (lowercase keys matching Firestore)
  const filters = [
    "all",
    "Get Clarity",
    "Ready the Foundation",
    "Interview to Win",
    "Thrive in Consulting",
    "Step into What's Next"
  ]  // display labels; we store lowercase in state

  // Recompute masterclasses whenever cache or filter changes
  useEffect(() => {
    console.log("[MasterclassPage] productsLoading:", productsLoading, "selectedFilter:", selectedFilter)
    if (productsLoading) return

    // First get all masterclass products
    let docs = allProducts.filter((p:any) => {
      const type = (p.type || "").toLowerCase();
      return type === "master class" || type === "masterclass";
    })
    
    console.log("[MasterclassPage] Total masterclasses before filtering:", docs.length);
    
    // Only apply career stage filter if not "all"
    if (selectedFilter !== "all") {
      console.log("[MasterclassPage] Filtering by career stage:", selectedFilter);
      docs = docs.filter((doc: any) => {
        const docStage = doc.careerStage || "";
        console.log("[MasterclassPage] Comparing", docStage, "with", selectedFilter);
        return docStage === selectedFilter;
      });
    }
    
    console.log("[MasterclassPage] Docs after filter:", docs.length, docs);

    const mc: Masterclass[] = docs.map((doc:any) => {
      console.log(`[MasterclassPage] Product ${doc.id} - isFree:`, doc.isFree);
      return {
        id: doc.id,
        title: doc.title || doc.productName || doc.name || "Untitled",
        description: doc.description || "",
        thumbnail: doc.thumbnail || doc.image || "",
        duration: doc.duration || "",
        instructor: doc.instructor || "",
        rating: doc.rating || 0,
        enrolled: false,
        featured: doc.featured || false,
        students: doc.students || 0,
        level: doc.level || undefined,
        category: doc.category || undefined,
        careerStage: (doc.careerStage || "").toLowerCase(),
        price: doc.price || 99,
        includedInMembership: doc.includedInMembership || false,
        isFree: doc.isFree || false,
      };
    })
    console.log("[MasterclassPage] Updating state with", mc.length, "masterclasses")
    setMasterclasses(mc)
  }, [allProducts, productsLoading, selectedFilter])

  // Local fallback data (will be replaced when Firestore fetch succeeds)
  const mockMasterclasses: Masterclass[] = [
    {
      id: "1",
      title: "Strategic Consulting Mastery",
      description: "Master the art of strategic consulting with frameworks used by top-tier firms. Learn problem-solving methodologies that drive business transformation.",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      duration: "4.5 hours",
      instructor: "Sarah Chen",
      rating: 4.9,
      enrolled: false,
      featured: true,
      students: 2847,
      level: "Advanced",
      category: "Strategy",
      careerStage: "thrive in consulting"
    },
    {
      id: "2",
      title: "Data-Driven Decision Making",
      description: "Transform raw data into actionable insights. Build compelling narratives that influence C-level executives and drive organizational change.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      duration: "3.2 hours",
      instructor: "Michael Rodriguez",
      rating: 4.8,
      enrolled: true,
      students: 1923,
      level: "Intermediate",
      category: "Analytics",
      careerStage: "ready the foundation"
    },
    {
      id: "3",
      title: "Client Relationship Excellence",
      description: "Build lasting partnerships with clients through advanced communication strategies and stakeholder management techniques.",
      thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
      duration: "2.8 hours",
      instructor: "Elena Vasquez",
      rating: 4.7,
      enrolled: false,
      students: 1456,
      level: "Beginner",
      category: "Communication",
      careerStage: "get clarity"
    },
    {
      id: "4",
      title: "Digital Transformation Leadership",
      description: "Lead digital initiatives that reshape organizations. Navigate complex technology implementations and cultural change management.",
      thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop",
      duration: "5.1 hours",
      instructor: "David Park",
      rating: 4.9,
      enrolled: false,
      students: 3241,
      level: "Advanced",
      category: "Technology",
      careerStage: "strategize what's next"
    }
  ]

  // State for masterclasses
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([])
  const [filteredMasterclasses, setFilteredMasterclasses] = useState<Masterclass[]>([])

  // Fetch membership status
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

  // ---------- Initial fetch (all masterclasses) ----------
  useEffect(() => {
    setIsLoaded(true)

    const fetchAll = async () => {
      const res = await getProductsByType("Master Class")
      if (res.success && res.data) {
        // Debug the raw data
        console.log("Raw masterclass data:", res.data);
        
        const fetched: Masterclass[] = res.data.map((doc: any) => {
          // Create the masterclass object
          const masterclass = {
            id: doc.id,
            title: doc.title || doc.productName || doc.name || "Untitled",
            description: doc.description || "",
            thumbnail: doc.thumbnail || doc.image || "",
            duration: doc.duration || "",
            instructor: doc.instructor || "",
            rating: doc.rating || 0,
            enrolled: false,
            featured: doc.featured || false,
            students: doc.students || 0,
            level: doc.level || undefined,
            category: doc.category || undefined,
            careerStage: (doc.careerStage || "").toLowerCase(),
            price: doc.price || 99,
            includedInMembership: doc.includedInMembership || false,
            isFree: Boolean(doc.isFree) // Ensure it's a boolean
          };
          
          // Debug each masterclass
          console.log(`Masterclass ${masterclass.title}: isFree = ${masterclass.isFree}`);
          
          return masterclass;
        })
        setMasterclasses(fetched)
      }
    }
    fetchAll()

    const interval = setInterval(() => {
      setAnimationStage(prev => {
        if (prev < 6) return prev + 1
        clearInterval(interval)
        return prev
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // ---------- Refetch when filter changes ----------
  useEffect(() => {
    const fetchFiltered = async () => {
      let docs: any[] = []
      try {
        if (selectedFilter === "all") {
          const res = await getProductsByType("Master Class")
          if (res.success && res.data) docs = res.data
        } else {
          const q = fsQuery(
            collection(db, "products"),
            where("type", "==", "Master Class"),
            where("careerStage", "==", selectedFilter)
          )
          const snap = await getDocs(q)
          docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        }
        const mc = docs.map((doc: any) => {
          // Debug the raw data
          console.log(`Filtered masterclass ${doc.title || doc.name}: isFree=${!!doc.isFree}`);
          
          return {
            id: doc.id,
            title: doc.title || doc.productName || doc.name || "Untitled",
            description: doc.description || "",
            thumbnail: doc.thumbnail || doc.image || "",
            duration: doc.duration || "",
            instructor: doc.instructor || "",
            rating: doc.rating || 0,
            enrolled: false,
            featured: doc.featured || false,
            students: doc.students || 0,
            level: doc.level || undefined,
            category: doc.category || undefined,
            careerStage: (doc.careerStage || "").toLowerCase(),
            price: doc.price || 99,
            includedInMembership: doc.includedInMembership || false,
            productlinks: doc.productlinks || [], // Default to empty array if undefined
            isFree: Boolean(doc.isFree) // Ensure it's a boolean
          };
        })
        console.log("[MasterclassPage] Updating state with", mc.length, "masterclasses")
    setMasterclasses(mc)
      } catch (err) {
        console.error("Error fetching filtered masterclasses", err)
      }
    }
    fetchFiltered()
  }, [selectedFilter])

  // Use state for filtered results
  const [filtered, setFiltered] = useState<Masterclass[]>(mockMasterclasses)
  
  // Re-apply blur effect when DOM changes (like after filtering)
  useEffect(() => {
    if (highlightedId) {
      // Small delay to ensure DOM is updated
      setTimeout(applyBlurEffect, 100);
      
      // Also try to scroll to the element again after filtering
      setTimeout(() => {
        const element = document.getElementById(`masterclass-${highlightedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [filtered, highlightedId]);
  
  // Update filtered results when masterclasses change
  useEffect(() => {
    // No search filtering, just use all masterclasses
    setFiltered(masterclasses)
    setFilteredMasterclasses(masterclasses) // Update filteredMasterclasses state for scroll effect
    console.log("[MasterclassPage] filtered result", { selectedFilter, count: masterclasses.length, ids: masterclasses.map(m => m.id) })
  }, [masterclasses, selectedFilter])

  const featured = filtered.find(mc => mc.featured) || filtered[0]

  return (
    <div className={`min-h-screen bg-gradient-to-b from-sidebar-background to-sidebar-background/90 backdrop-blur-md transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#245D66]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#245D66]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Hero Section */}
        <section className={`transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#245D66] via-[#2a6b75] to-[#245D66] p-12 text-white">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
            
            {/* Floating orbs */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" />
            <div className="absolute top-1/2 -right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float-delayed" />
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Crown className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Premium Learning</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight">
                Master Your<br />
                <span className="text-yellow-400">Consulting Journey</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                Accelerate your career with expertly crafted masterclasses designed by industry leaders. Transform knowledge into impact.
              </p>
              

            </div>
          </div>
        </section>

        {/* Filters */}
        <section className={`transform transition-all duration-1000 delay-200 ${animationStage >= 1 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="flex justify-center">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                    selectedFilter === filter
                      ? "bg-[#245D66] text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Steps Container - only shown when ID is present in URL */}
        {highlightedId && (
          <section className="mt-8">
            <div className="max-w-4xl mx-auto">
              <JourneyStepsContainer 
                onViewRecommended={() => {
                  // Remove blur effect from all masterclasses
                  document.querySelectorAll('.blur-effect').forEach(el => {
                    el.classList.remove('blur-effect');
                  });
                  
                  // Scroll to the masterclass list section
                  if (masterclassListRef.current) {
                    masterclassListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }} 
              />
            </div>
          </section>
        )}

        {/* Featured Masterclass section removed */}

        {/* All Masterclasses Grid */}
        {filtered.length > 0 && (
          <section 
            ref={masterclassListRef}
            className={`transform transition-all duration-1000 delay-600 ${animationStage >= 3 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">All Masterclasses</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">{filtered.length} Available</span>
              </div>
            </div>

            <div className="grid gap-8 auto-rows-fr md:grid-cols-2 lg:grid-cols-4">
              {filtered.map((mc, index) => (
                <div
                  key={mc.id}
                  id={`masterclass-${mc.id}`}
                  className={`masterclass-card group relative overflow-hidden rounded-[12px] bg-white transition-all duration-500 opacity-100 translate-y-0 ${
                    highlightedId && (String(highlightedId) === String(mc.id)) 
                      ? 'border-[3px] border-gray-900 scale-[1.03] shadow-lg shadow-[#245D66]/30 animate-pulse-slow z-20' 
                      : 'border border-gray-900 hover:border-gray-900'
                  }`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  {/* Image without hover effect */}
                  <div 
                    className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
                  >
                    <Image
                      src={mc.thumbnail}
                      alt={mc.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Hover overlay removed */}

                    {/* Status badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {mc.enrolled && (
                        <div className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                          ENROLLED
                        </div>
                      )}
                      <div className="px-2 py-1 bg-black/50 text-white text-xs font-semibold rounded backdrop-blur-sm">
                        {mc.level}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-20 px-2 pt-2 pb-1 text-black">
                    {/* Product title removed as requested */}
                    
                    {/* Coming Soon indicator removed - only keeping the one in CTA button */}
                    
                    {/* Description - only show if needed */}
                    {mc.description && mc.description.length > 0 && (
                      <div className="hidden">
                        <p className="text-gray-600 text-xs line-clamp-1">
                          {mc.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Membership status - show if included in membership */}
                    {mc.includedInMembership && (
                      <div className="flex items-center mb-2">
                        <span className="text-xs text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
                          <span className="mr-1">✓</span> Included in BC Plus Membership
                        </span>
                      </div>
                    )}
                    
                    {/* Stats row removed as requested */}

                    {/* Action button */}
                    {mc.productlinks && mc.productlinks.length === 0 ? (
                      <button 
                        className="w-full bg-yellow-100 text-yellow-800 py-2 rounded-lg font-semibold transition-all duration-300 cursor-default"
                        disabled
                      >
                        <span className="flex items-center justify-center">
                          <Clock className="mr-2 h-4 w-4" />
                          Coming Soon
                        </span>
                      </button>
                    ) : (
                      <button 
                        className="w-full bg-[#245D66] hover:bg-[#1a4a52] text-white py-2 rounded-lg font-semibold transition-all duration-300"
                        onClick={() => {
                          console.log(`[MasterclassPage] Button clicked for ${mc.id} - isFree: ${mc.isFree}, isMember: ${isMember}`);
                          if (mc.enrolled || mc.isFree || (isMember && mc.includedInMembership)) {
                            console.log(`[MasterclassPage] Starting learning for ${mc.id} - Free access: ${mc.isFree}`);
                            handleStartLearning(mc);
                          } else {
                            console.log(`[MasterclassPage] Redirecting to membership page`);
                            // Navigate to membership page using Next.js router
                            router.push('/dashboard/membership');
                          }
                        }}
                      >
                        <span className="flex items-center justify-center">
                          {/* Masterclass properties: isFree=${!!mc.isFree}, enrolled=${!!mc.enrolled}, includedInMembership=${!!mc.includedInMembership} */}
                          
                          {/* Explicit check for isFree as true */}
                          {mc.isFree === true ? (
                            <>
                              <Zap className="mr-2 h-4 w-4" />
                              Start Learning
                            </>
                          ) : mc.enrolled ? (
                            <>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Continue Learning
                            </>
                          ) : (isMember && mc.includedInMembership) ? (
                            <>
                              <Zap className="mr-2 h-4 w-4" />
                              Start Learning
                            </>
                          ) : (
                            <>
                              <Crown className="mr-2 h-4 w-4" />
                              Upgrade to BC+
                            </>
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      {/* Learning Dialog */}
      <LearningDialog 
        masterclass={selectedMasterclass} 
        open={showLearningDialog} 
        onOpenChange={setShowLearningDialog} 
      />
    </div>
  )
}