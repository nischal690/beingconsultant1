"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  Filter, 
  Clock, 
  BarChart, 
  Star, 
  Play, 
  ChevronRight, 
  Bookmark, 
  CheckCircle, 
  Lock,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { getProductsByType } from "@/lib/firebase/firestore"

// Define course interface
interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  instructor: string
  rating: number
  enrolled: boolean
  progress?: number
  locked?: boolean
  featured?: boolean
  new?: boolean
  popular?: boolean
}

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Jumpstart 100",
    description: "A comprehensive introduction to consulting that covers all the essential skills and frameworks you need to succeed in your consulting career.",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    duration: "92 minutes",
    level: "Beginner",
    category: "Fundamentals",
    instructor: "Gaurav Bhosle",
    rating: 4.9,
    enrolled: false,
    featured: true
  },
  {
    id: "2",
    title: "Advanced Problem Solving",
    description: "Take your problem-solving skills to the next level with advanced techniques used by top consultants.",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    duration: "6h 15m",
    level: "Advanced",
    category: "Problem Solving",
    instructor: "Gaurav Bhosle",
    rating: 4.8,
    enrolled: true,
    progress: 30
  },
  {
    id: "3",
    title: "Consulting Math & Data Analysis",
    description: "Master the quantitative skills needed for consulting interviews and on-the-job success.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    duration: "5h 45m",
    level: "Intermediate",
    category: "Quantitative Skills",
    instructor: "Gaurav Bhosle",
    rating: 4.7,
    enrolled: false,
    locked: true
  },
  {
    id: "4",
    title: "Behavioral Interview Excellence",
    description: "Prepare for behavioral interviews with frameworks and storytelling techniques that impress recruiters.",
    thumbnail: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?q=80&w=2070&auto=format&fit=crop",
    duration: "3h 20m",
    level: "Beginner",
    category: "Behavioral Interviews",
    instructor: "Gaurav Bhosle",
    rating: 4.9,
    enrolled: false,
    new: true
  },
  {
    id: "5",
    title: "Consulting Frameworks Deep Dive",
    description: "Explore and master the most effective consulting frameworks used by top-tier firms.",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    duration: "7h 10m",
    level: "Intermediate",
    category: "Frameworks",
    instructor: "Gaurav Bhosle",
    rating: 4.8,
    enrolled: false,
    popular: true
  },
  {
    id: "6",
    title: "Business Strategy Fundamentals",
    description: "Learn core business strategy concepts and how to apply them in consulting scenarios.",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    duration: "5h 30m",
    level: "Beginner",
    category: "Strategy",
    instructor: "Gaurav Bhosle",
    rating: 4.6,
    enrolled: false
  }
];


export default function VideoCoursesPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  // Search query state removed
  const featuredSectionRef = useRef<HTMLDivElement>(null);

  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);

  
  useEffect(() => {
    // Set loading state for animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);



    // Trigger staggered animations
    const staggerInterval = setInterval(() => {
      setAnimationStage(prev => {
        if (prev < 5) return prev + 1;
        clearInterval(staggerInterval);
        return prev;
      });
    }, 150);

    return () => {
      clearInterval(staggerInterval);
    };
  }, []);

  // Set filtered courses directly from mock courses
  useEffect(() => {
    setFilteredCourses(mockCourses);
  }, []);

  return (
    <div className={`min-h-screen transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#245D66]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#245D66]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section with Animated Background */}
      <section className={`relative transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#245D66] via-[#2a6b75] to-[#245D66] p-12 text-white">
          {/* Animated background elements */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-56 h-56 bg-white/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-white/4 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          
          {/* Subtle gradient border */}
          <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-gradient-x bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
              Video Courses
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Elevate your consulting skills with our premium video courses. Learn at your own pace with expert-led content designed to help you excel in your consulting career.
            </p>
            {/* 'Explore All Courses' and 'View My Courses' buttons removed */}
          </div>
        </div>
      </section>

      {/* Search section removed */}

      {/* Featured Course Section */}
      {filteredCourses.some(course => course.featured) && (
        <section 
          ref={featuredSectionRef}
          className={`transform transition-all duration-500 delay-200 ${animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-xl font-semibold mb-4">
            Featured Course
          </h2>
          
          {filteredCourses.filter(course => course.featured).map(course => (
            <div key={course.id} className="relative group overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 group-hover:from-black/70 group-hover:to-black/30 transition-all duration-500"></div>
              
              <div className="relative flex flex-col md:flex-row h-full">
                <div className="relative md:w-1/2 h-60 md:h-auto overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-black md:from-black/0 md:via-black/60 md:to-black pointer-events-none"></div>
                </div>
                
                <div className="relative p-6 md:w-1/2 flex flex-col justify-center">
                  <div className="absolute top-0 right-0 p-4">
                    <Badge className="bg-yellow-500/90 text-black hover:bg-yellow-500 px-3 py-1">
                      Featured
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-white">{course.title}</h3>
                  <p className="text-white/80 mb-4">{course.description}</p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-white/60" />
                      <span className="text-sm text-white/80">{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/80 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-white/60" />
                      <span>25 Chapters</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-2 bg-white text-black hover:bg-white/90 group transition-all duration-300"
                    onClick={() => course.title === "Jumpstart 100" ? router.push(`/dashboard/video-courses/${course.id}`) : {}}
                  >
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    {course.title === "Jumpstart 100" ? "Start Course" : "Start Learning"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}




      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      
      `}</style>
      </div> {/* end inner container */}
    </div>
  )
}