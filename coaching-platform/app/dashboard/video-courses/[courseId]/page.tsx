"use client";

// This is the page component that Next.js will use for the route
// It should be a server component in Next.js App Router
export default function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  return <CoursePlayerClient courseId={courseId} />;
}

// This is the client component that contains all the interactive functionality

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft,
  Play,
  CheckCircle,
  Clock,
  BarChart,
  Star,
  BookOpen,
  Video,
  Award,
  Lock,
  ChevronRight,
  Download,
  FileText,
  PenLine,
  Users,
  MessageSquare,
  Bookmark,
  Share2,
  GraduationCap,
  ChevronDown,
  Folder
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"

// Import course data and types
import { 
  Course, 
  Chapter, 
  Section, 
  Resource, 
  coursesData,
  getAllChapters,
  getCompletedChaptersCount,
  getTotalChaptersCount,
  findChapterById,
  findSectionByChapterId,
  getNextChapter,
  getPrevChapter,
  getNextUnlockedChapter
} from "../data/jumpstart-100"

// Client component that contains all the interactive functionality
function CoursePlayerClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  
  // Add custom animations
  useEffect(() => {
    // Add custom animation styles
    const style = document.createElement('style');
    style.innerHTML = `
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
      
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slide-up {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
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
      
      .animate-in {
        animation-duration: 0.3s;
        animation-timing-function: ease-out;
        animation-fill-mode: both;
      }
      
      .fade-in-50 {
        animation-name: fade-in;
      }
      
      .slide-up {
        animation-name: slide-up;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notes");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Fetch course data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchCourse = () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          const foundCourse = coursesData[courseId];
          if (foundCourse) {
            setCourse(foundCourse);
            // Get the first chapter from the first section
            if (foundCourse.sections.length > 0 && foundCourse.sections[0].chapters.length > 0) {
              setSelectedChapter(foundCourse.sections[0].chapters[0]);
              setActiveSection(foundCourse.sections[0].id);
              setOpenSections([foundCourse.sections[0].id]);
            }
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching course:", error);
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Toggle chapter completion status
  const toggleChapterCompletion = (chapterId: string) => {
    if (!course || !selectedChapter) return;
    
    // Update the selected chapter state immediately for instant visual feedback
    if (selectedChapter.id === chapterId) {
      setSelectedChapter({
        ...selectedChapter,
        completed: !selectedChapter.completed
      });
    }
    
    // Create a deep copy of the course sections
    const updatedSections = course.sections.map(section => {
      // Update chapters in the current section
      const updatedChapters = section.chapters.map(chapter => {
        if (chapter.id === chapterId) {
          // Toggle the completed status
          return { ...chapter, completed: !chapter.completed };
        }
        return chapter;
      });
      
      return {
        ...section,
        chapters: updatedChapters
      };
    });
    
    // Calculate new progress
    const allChapters = getAllChapters({ ...course, sections: updatedSections });
    const completedCount = allChapters.filter(chapter => chapter.completed).length;
    const newProgress = Math.round((completedCount / allChapters.length) * 100);
    
    setCourse({
      ...course,
      sections: updatedSections,
      progress: newProgress
    });
  };

  // Navigate to next chapter
  const goToNextChapter = () => {
    if (!course || !selectedChapter) return;
    
    const nextChapter = getNextChapter(course, selectedChapter.id);
    if (nextChapter && !nextChapter.locked) {
      setSelectedChapter(nextChapter);
      
      // Update active section if the chapter belongs to a different section
      const nextSection = findSectionByChapterId(course, nextChapter.id);
      if (nextSection && nextSection.id !== activeSection) {
        setActiveSection(nextSection.id);
      }
    }
  };

  // Navigate to previous chapter
  const goToPrevChapter = () => {
    if (!course || !selectedChapter) return;
    
    const prevChapter = getPrevChapter(course, selectedChapter.id);
    if (prevChapter) {
      setSelectedChapter(prevChapter);
      
      // Update active section if the chapter belongs to a different section
      const prevSection = findSectionByChapterId(course, prevChapter.id);
      if (prevSection && prevSection.id !== activeSection) {
        setActiveSection(prevSection.id);
      }
    }
  };

  // Handle chapter selection
  const handleChapterSelect = (chapter: Chapter, sectionId: string) => {
    if (!chapter.locked) {
      setSelectedChapter(chapter);
      setActiveSection(sectionId);
    }
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Handle note changes
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(e.target.value);
  };

  // Get the next unlocked chapter for the "Continue Learning" button
  const findNextUnlockedChapter = () => {
    if (!course) return null;
    return getNextUnlockedChapter(course);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl font-medium">Loading your course...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center">
          <Video className="h-12 w-12 text-muted-foreground/70" />
        </div>
        <h1 className="text-3xl font-bold text-center">Course not found</h1>
        <p className="text-muted-foreground text-center max-w-md">We couldn't find the course you're looking for. It may have been removed or you might not have access.</p>
        <Button 
          size="lg"
          onClick={() => router.push('/dashboard/video-courses')}
          className="mt-4"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/video-courses')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          
          {/* Navigation buttons would go here */}
        </div>
      </div>

      {/* Course hero section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background py-12 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                  {course.level}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-6">

                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{getTotalChaptersCount(course)} Chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{course.duration}</span>
                </div>

              </div>
              
              <div className="flex items-center gap-4 mb-8">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                  <AvatarFallback>{course.instructor.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Gaurav Bhosle</div>
                  <div className="text-sm text-muted-foreground">Career Coach, Former McKinsey Consultant</div>
                </div>
              </div>
              
              <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10 animate-in fade-in-50">
                <div className="flex justify-between items-center">
                  <div className="font-medium flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    <span>Your Progress</span>
                  </div>
                  <div className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {course.progress}% Complete
                  </div>
                </div>
                <Progress value={course.progress} className="h-3 w-full" indicatorClassName="bg-gradient-to-r from-primary/80 to-primary" />
                
                {/* Continue Learning button removed */}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg border-4 border-background">
                <Image 
                  src={course.thumbnail} 
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="rounded-full bg-white/90 p-4 shadow-lg">
                    <Play className="h-8 w-8 text-black fill-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with chapters */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-primary/10 overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Course Content</CardTitle>
                        <CardDescription>
                          {getCompletedChaptersCount(course)} of {getTotalChaptersCount(course)} chapters completed
                        </CardDescription>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Progress 
                        value={course.progress} 
                        className="h-6 w-6 rounded-full" 
                        indicatorClassName="bg-primary/30"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="max-h-[60vh] overflow-y-auto">
                    <Accordion 
                      type="multiple" 
                      defaultValue={openSections} 
                      value={openSections}
                      onValueChange={(value) => {
                        setOpenSections(value);
                      }}
                      className="w-full"
                    >
                      {course.sections.map((section) => (
                        <AccordionItem 
                          key={section.id} 
                          value={section.id}
                          className={cn(
                            "border-b relative overflow-hidden transition-all duration-300",
                            activeSection === section.id ? "bg-primary/5" : ""
                          )}
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline group transition-all duration-300">
                            <div className="flex items-center gap-3 text-left w-full">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                                <Folder className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-base">{section.title}</span>
                              </div>
                              <Badge variant="outline" className="ml-2 text-xs bg-background/80 group-hover:bg-background transition-all duration-300">
                                {section.chapters.filter((ch: Chapter) => ch.completed).length}/{section.chapters.length}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-0 pt-2 pb-3">
                            <div className="space-y-0.5 animate-in fade-in-50 duration-300">
                              {section.chapters.map((chapter, index) => (
                                <div 
                                  key={chapter.id}
                                  className={cn(
                                    "flex items-start gap-3 px-6 py-3 cursor-pointer transition-all duration-200 border-l-2",
                                    selectedChapter?.id === chapter.id 
                                      ? "bg-primary/10 border-l-primary" 
                                      : "hover:bg-muted/80 border-l-transparent hover:border-l-primary/40",
                                    chapter.locked ? "opacity-60" : ""
                                  )}
                                  onClick={() => handleChapterSelect(chapter, section.id)}
                                >
                                  <div className={cn(
                                    "flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300",
                                    chapter.completed 
                                      ? "bg-green-100 dark:bg-green-900/20" 
                                      : chapter.locked 
                                        ? "bg-muted-foreground/20" 
                                        : selectedChapter?.id === chapter.id
                                          ? "bg-primary/20"
                                          : "bg-muted-foreground/10"
                                  )}>
                                    {chapter.completed ? (
                                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    ) : chapter.locked ? (
                                      <Lock className="h-3 w-3 text-muted-foreground" />
                                    ) : (
                                      <span className={cn(
                                        "text-xs font-medium",
                                        selectedChapter?.id === chapter.id ? "text-primary" : "text-muted-foreground"
                                      )}>{index + 1}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <h3 className={cn(
                                        "font-medium truncate text-sm",
                                        selectedChapter?.id === chapter.id ? "text-primary" : "",
                                        chapter.locked ? "text-muted-foreground" : ""
                                      )}>
                                        {chapter.title}
                                      </h3>
                                      <span className={cn(
                                        "text-xs ml-2 flex-shrink-0 px-2 py-0.5 rounded-full",
                                        selectedChapter?.id === chapter.id 
                                          ? "bg-primary/10 text-primary" 
                                          : "text-muted-foreground"
                                      )}>
                                        {chapter.duration}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                      {chapter.description}
                                    </p>
                                    {chapter.resources && chapter.resources.length > 0 && (
                                      <div className="flex items-center gap-1 mt-2">
                                        <FileText className="h-3 w-3 text-primary/60" />
                                        <span className="text-xs text-primary/60">{chapter.resources.length} resource{chapter.resources.length > 1 ? 's' : ''}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main content area */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            {selectedChapter && (
              <div className="space-y-8">
                <Card className="overflow-hidden shadow-lg border-primary/10 group transition-all duration-300 hover:shadow-xl">
                  <div className="aspect-video w-full bg-black relative">
                    <iframe
                      src={selectedChapter.videoUrl}
                      className="w-full h-full z-10 relative"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-1 bg-gradient-to-l from-primary/30 via-primary/50 to-primary/30"></div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={selectedChapter.completed ? "default" : "secondary"} 
                            className={cn(
                              "mb-2 transition-all duration-300",
                              selectedChapter.completed 
                                ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40" 
                                : ""
                            )}
                          >
                            {selectedChapter.completed ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </>
                            ) : "In Progress"}
                          </Badge>
                          <Badge variant="outline" className="mb-2 bg-primary/5">
                            <Clock className="h-3 w-3 mr-1" />
                            {selectedChapter.duration}
                          </Badge>
                          
                          {/* Section badge */}
                          {findSectionByChapterId(course, selectedChapter.id) && (
                            <Badge variant="outline" className="mb-2 bg-primary/5">
                              <Folder className="h-3 w-3 mr-1" />
                              {findSectionByChapterId(course, selectedChapter.id)?.title}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl font-bold">{selectedChapter.title}</CardTitle>
                        <CardDescription className="text-base mt-2 text-muted-foreground/90">{selectedChapter.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardFooter className="flex justify-between bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border-t py-5">
                    <Button
                      variant="outline"
                      onClick={goToPrevChapter}
                      disabled={!getPrevChapter(course, selectedChapter.id)}
                      className="transition-all duration-300 hover:translate-x-[-2px]"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    
                    <button 
                      onClick={() => toggleChapterCompletion(selectedChapter.id)}
                      className={`flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-md ${selectedChapter.completed ? 
                        "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 dark:hover:bg-green-900/30" : 
                        "bg-black text-white hover:bg-gray-800 border border-white/20"}`}
                    >
                      <CheckCircle className={`mr-2 h-4 w-4 ${selectedChapter.completed ? "fill-green-200 dark:fill-green-900/30" : ""}`} />
                      {selectedChapter.completed ? "Completed" : "Mark as Completed"}
                    </button>
                    
                    <Button
                      variant="outline"
                      onClick={goToNextChapter}
                      disabled={
                        !getNextChapter(course, selectedChapter.id) ||
                        (getNextChapter(course, selectedChapter.id)?.locked ?? true)
                      }  
                      className="transition-all duration-300 hover:translate-x-[2px]"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Chapter tabs: resources, notes, discussion */}
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-6">
                    <PenLine className="h-4 w-4" />
                    <h3 className="text-lg font-medium">My Notes</h3>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PenLine className="h-5 w-5 text-primary" />
                        My Notes
                      </CardTitle>
                      <CardDescription>
                        Capture important points while watching the video
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        value={noteText}
                        onChange={handleNoteChange}
                        className="w-full min-h-[200px] p-4 rounded-lg border resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Type your notes here... Capture key insights, questions, and ideas from this chapter."
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="text-sm text-muted-foreground">
                        {noteText.length} characters
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Clear</Button>
                        <Button>Save Notes</Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}