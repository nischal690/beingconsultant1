"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { collection, query as fsQuery, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useProducts } from "@/context/products-context"
import Image from "next/image"
import { useGritSection } from "@/hooks/useGritSection"
import { getProductsByType } from "@/lib/firebase/firestore"
import { useAuth } from "@/lib/firebase/auth-context"
import { getUserProfile } from "@/lib/firebase/firestore"

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
}

export default function MasterclassPage() {
  // Get URL search params
  const searchParams = useSearchParams()
  const highlightedId = searchParams.get('id')
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isMember, setIsMember] = useState<boolean>(false)
  
  // Get user from auth context
  const { user } = useAuth()

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

  // Scroll to highlighted masterclass on mount if ID is present
  useEffect(() => {
    if (highlightedId) {
      const element = document.getElementById(`masterclass-${highlightedId}`);
      if (element) {
        // Add a slight delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [highlightedId]);

  // Load selected GRIT section from localStorage
  const { selectedSection } = useGritSection();

  // Apply career stage filter when selectedSection changes
  useEffect(() => {
    if (selectedSection && selectedSection.title && filters.includes(selectedSection.title)) {
      setSelectedFilter(selectedSection.title);
    }
  }, [selectedSection]);

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

    const mc: Masterclass[] = docs.map((doc:any) => ({
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
    }))
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

  const [masterclasses, setMasterclasses] = useState<Masterclass[]>(mockMasterclasses)

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
        const fetched: Masterclass[] = res.data.map((doc: any) => ({
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
          includedInMembership: doc.includedInMembership || false
        }))
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
        const mc = docs.map((doc: any) => ({
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
        }))
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
  
  // Update filtered results when masterclasses or search query changes
  useEffect(() => {
    const filteredResults = masterclasses.filter(mc => {
      const matchesSearch = !searchQuery || 
        mc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mc.description && mc.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesSearch
    })
    
    setFiltered(filteredResults)
    console.log("[MasterclassPage] filtered result", { selectedFilter, searchQuery, count: filteredResults.length, ids: filteredResults.map(m => m.id) })
  }, [masterclasses, searchQuery, selectedFilter])

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
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative overflow-hidden bg-white text-[#245D66] px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <span className="relative z-10 flex items-center">
                    Explore Masterclasses
                    <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button className="group border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <span className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    My Library
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className={`transform transition-all duration-1000 delay-200 ${animationStage >= 1 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search masterclasses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#245D66] focus:border-transparent backdrop-blur-md transition-all"
              />
            </div>

            {/* Filters */}
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

        {/* Featured Masterclass section removed */}

        {/* All Masterclasses Grid */}
        {filtered.length > 0 && (
          <section className={`transform transition-all duration-1000 delay-600 ${animationStage >= 3 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
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
                  className={`group relative overflow-hidden rounded-3xl bg-white transition-all duration-500 hover:shadow-xl hover:shadow-[#245D66]/5 hover:-translate-y-1 opacity-100 translate-y-0 ${
                    highlightedId === mc.id 
                      ? 'border-[3px] border-[#245D66] scale-[1.03] shadow-lg shadow-[#245D66]/30 animate-pulse-slow' 
                      : 'border border-gray-200 hover:border-[#245D66]/30'
                  }`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  {/* Image with hover effect */}
                  <div 
                    className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
                    onMouseEnter={() => setHoveredCard(mc.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Image
                      src={mc.thumbnail}
                      alt={mc.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Hover overlay - only on image */}
                    <div className={`absolute inset-0 z-5 bg-[#245D66]/90 flex items-center justify-center transition-all duration-300 ${
                      hoveredCard === mc.id ? "opacity-100" : "opacity-0"
                    }`}>
                      <div className="text-center">
                        <div className="p-3 bg-white rounded-full mx-auto mb-3">
                          <Play className="h-6 w-6 text-[#245D66] fill-current" />
                        </div>
                        <p className="text-white font-semibold">Start Learning</p>
                      </div>
                    </div>

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
                  <div className="relative z-20 p-6 text-black">
                    <h3 className="text-lg font-bold !text-[#245D66] line-clamp-2 mb-1 transition-colors" style={{color: '#245D66'}}>
                      {mc.title}
                    </h3>
                    
                    {/* Description - only show if needed */}
                    {mc.description && mc.description.length > 0 && (
                      <div className="hidden">
                        <p className="text-gray-600 text-xs line-clamp-1">
                          {mc.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Price display */}
                    <div className="flex flex-col space-y-1 mt-2">
                      {/* Price row */}
                      <div className="flex items-center justify-between">
                        {/* Show price only if not a member or not included in membership */}
                        {mc.price > 0 && (!isMember || !mc.includedInMembership) && (
                          <span className="font-bold text-[#245D66] text-lg">
                            ${mc.price}
                          </span>
                        )}
                        
                        {/* Show purchased badge if enrolled */}
                        {mc.enrolled && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Purchased
                          </span>
                        )}
                      </div>
                      
                      {/* Membership status - show if included in membership */}
                      {mc.includedInMembership && (
                        <div className="flex items-center">
                          <span className="text-xs text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
                            <span className="mr-1">✓</span> Included in BC+ Membership
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Stats row */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 mt-1 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {mc.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          {mc.rating}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {mc.students?.toLocaleString()}
                      </span>
                    </div>

                    {/* Action button */}
                    <button className="w-full bg-[#245D66] hover:bg-[#1a4a52] text-white py-3 rounded-xl font-semibold transition-all duration-300">
                      <span className="flex items-center justify-center">
                        {mc.enrolled ? (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Continue Learning
                          </>
                        ) : isMember && mc.includedInMembership ? (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Start Learning
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Buy Now
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className={`transform transition-all duration-1000 delay-1000 ${animationStage >= 5 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#245D66] via-[#2a6b75] to-[#245D66] p-12 text-white">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] animate-pulse" />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float-delayed" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="h-8 w-8 text-yellow-400" />
                  <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Premium Access</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Unlock Your Full Potential
                </h2>
                <p className="text-white/90 text-lg max-w-2xl leading-relaxed">
                  Get unlimited access to all masterclasses, exclusive content, and personalized learning paths designed to accelerate your consulting career.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative overflow-hidden bg-white text-[#245D66] px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <span className="relative z-10 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                    Become a Member
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-yellow-50 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
                
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
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
    </div>
  )
}