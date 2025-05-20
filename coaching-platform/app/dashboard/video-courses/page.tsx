"use client"

import { useState, useEffect } from "react"
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
    duration: "10h 30m",
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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter courses based on search query only
  useEffect(() => {
    let result = mockCourses;
    
    if (searchQuery) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredCourses(result);
  }, [searchQuery]);

  return (
    <div className={`space-y-8 opacity-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : ''}`}>
      {/* Hero Section with Animated Background */}
      <section className={`relative transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="relative overflow-hidden rounded-2xl bg-black p-8 text-white">
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
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-black hover:bg-white/90 group transition-all duration-300">
                Explore All Courses
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 transition-all duration-300">
                View My Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className={`transform transition-all duration-500 delay-100 ${animationStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-lg blur-md"></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 dark:bg-black/50 border-white/10 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 backdrop-blur-md"
              />
            </div>
          </div>
          
          {/* Category filters and sort-by dropdown removed */}
        </div>
      </section>

      {/* Featured Course Section */}
      {filteredCourses.some(course => course.featured) && (
        <section className={`transform transition-all duration-500 delay-200 ${animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
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
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-white/80">{course.rating}</span>
                    </div>
                    <Badge className="bg-white/10 text-white hover:bg-white/20">
                      {course.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/80 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-white/60" />
                      <span>10 Modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-white/60" />
                      <span>25+ Case Studies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-white/60" />
                      <span>Certificate</span>
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

      {/* Note: All Courses section has been removed as requested */}

      {/* Call to Action Section */}
      <section className={`transform transition-all duration-500 delay-400 ${animationStage >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-black/80 to-black/60 p-8 text-white backdrop-blur-md">
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Subtle gradient border */}
          <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none"></div>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to advance your consulting career?</h2>
              <p className="text-white/80 max-w-xl">
                Unlock all premium courses and resources with our membership plan. Get unlimited access to expert-led content.
              </p>
            </div>
            <Button className="whitespace-nowrap bg-white text-black hover:bg-white/90 group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                Become a Member
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full animate-shimmer"></span>
            </Button>
          </div>
        </div>
      </section>

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
    </div>
  )
}