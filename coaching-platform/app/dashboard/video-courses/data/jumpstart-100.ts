// Define interfaces
export interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
  locked: boolean;
  resources?: Resource[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "worksheet" | "link";
  url: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  instructor: string;
  instructorTitle?: string;
  instructorAvatar?: string;
  rating: number;
  enrolled: boolean;
  progress: number;
  sections: Section[];
  students?: number;
}

// JumpStart 100 course data
export const jumpstart100: Course = {
  id: "1",
  title: "Jumpstart 100",
  description: "A comprehensive introduction to consulting that covers all the essential skills and frameworks you need to succeed in your consulting career.",
  thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
  duration: "25h 30m",
  level: "Beginner",
  category: "Fundamentals",
  instructor: "Gaurav Bhosle",
  instructorTitle: "Lead Consultant, Former McKinsey",
  instructorAvatar: "/api/placeholder/150/150",
  rating: 4.9,
  enrolled: true,
  progress: 15,
  students: 1243,
  sections: [
    {
      id: "s1",
      title: "JumpStart 100 Introduction",
      description: "Get started with the essential foundation of the JumpStart 100 program.",
      chapters: [
        {
          id: "c1",
          title: "About the Course",
          description: "Overview of what you'll learn in the JumpStart 100 program.",
          duration: "15m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: true,
          locked: false,
          resources: [
            {
              id: "r1-1",
              title: "Course Outline PDF",
              type: "pdf",
              url: "/resources/jumpstart-outline.pdf"
            }
          ]
        },
        {
          id: "c2",
          title: "Welcome and Why JumpStart 100",
          description: "Learn why the first 100 days are critical for your consulting career success.",
          duration: "20m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: true,
          locked: false
        },
        {
          id: "c3",
          title: "Significance of the First 100 Days",
          description: "Understanding how your initial period shapes your entire consulting career trajectory.",
          duration: "25m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false,
          resources: [
            {
              id: "r3-1",
              title: "First 100 Days Checklist",
              type: "pdf",
              url: "/resources/first-100-days-checklist.pdf"
            }
          ]
        }
      ]
    },
    {
      id: "s2",
      title: "Understanding Org and Career Dynamics",
      description: "Master the organizational dynamics that will accelerate your career growth.",
      chapters: [
        {
          id: "c4",
          title: "Fast Track Promotion by Maximum Utilization",
          description: "Learn how to maximize your potential and position yourself for rapid advancement.",
          duration: "30m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c5",
          title: "In the Early Stages of Your Career Go for Breadth",
          description: "Why developing a broad skill set is crucial in your early consulting career.",
          duration: "25m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c6",
          title: "Understanding Billable Work: BD > PD > KD",
          description: "The hierarchy of work types in consulting and how to prioritize them.",
          duration: "35m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false,
          resources: [
            {
              id: "r6-1",
              title: "Billable Work Guide",
              type: "pdf",
              url: "/resources/billable-work-guide.pdf"
            }
          ]
        },
        {
          id: "c7",
          title: "Leveraging Feedback Culture",
          description: "How to use feedback effectively to accelerate your professional growth.",
          duration: "30m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c8",
          title: "Blowing Your Trumpet and Gaining Recognition for Your Work",
          description: "Strategies for ensuring your contributions are visible and valued.",
          duration: "25m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        }
      ]
    },
    {
      id: "s3",
      title: "Mastering Personal Effectiveness and Essential Skills",
      description: "Develop the core skills that will make you an exceptional consultant.",
      chapters: [
        {
          id: "c9",
          title: "Time Management: Optimize Every Process and Personal Habits",
          description: "Essential time management techniques for consultants.",
          duration: "40m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false,
          resources: [
            {
              id: "r9-1",
              title: "Time Management Templates",
              type: "pdf",
              url: "/resources/time-management.pdf"
            }
          ]
        },
        {
          id: "c10",
          title: "Optimising Health: Travel, Sleep",
          description: "How to maintain your health and energy during demanding consulting work.",
          duration: "35m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c11",
          title: "Pre-project Homework and Building a Knowledge Bank",
          description: "Preparing effectively for new projects and building your personal knowledge repository.",
          duration: "45m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c12",
          title: "Hunt Projects Proactively",
          description: "Strategies for finding and securing the most valuable project opportunities.",
          duration: "30m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c13",
          title: "Master Excel Functions",
          description: "Essential Excel skills every consultant needs to know.",
          duration: "50m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false,
          resources: [
            {
              id: "r13-1",
              title: "Excel Functions Cheat Sheet",
              type: "pdf",
              url: "/resources/excel-functions.pdf"
            }
          ]
        },
        {
          id: "c14",
          title: "Familiarizing PowerPoint and Functionalities",
          description: "Creating impactful presentations that impress clients and stakeholders.",
          duration: "45m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false,
          resources: [
            {
              id: "r14-1",
              title: "PowerPoint Templates",
              type: "pdf",
              url: "/resources/ppt-templates.pdf"
            }
          ]
        }
      ]
    },
    {
      id: "s4",
      title: "Become a Master Collaborator",
      description: "Learn how to work effectively with teams and build strong professional relationships.",
      chapters: [
        {
          id: "c15",
          title: "To Build Trust: Follow the ABCD Trust Framework",
          description: "Understanding and applying the ABCD framework for building trust with colleagues and clients.",
          duration: "35m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c16",
          title: "Becoming Effective Feedback Receiver and Giver",
          description: "The art of giving and receiving feedback to foster growth and improvement.",
          duration: "40m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c17",
          title: "Setting and Agreeing on Right Expectations",
          description: "How to establish clear expectations with clients and team members.",
          duration: "30m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c18",
          title: "Engage Early with Teammates and Leveraging the Ecosystem",
          description: "Building relationships and utilizing the full resources of your organization.",
          duration: "35m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c19",
          title: "Demonstrate a 'Can-Do Attitude'",
          description: "How a positive, solution-oriented mindset can accelerate your consulting career.",
          duration: "25m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c20",
          title: "Don't Try to be a Superhero: Leverage the Support System",
          description: "How to effectively use the resources and support available to you.",
          duration: "30m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        }
      ]
    },
    {
      id: "s5",
      title: "Learn to Dazzle the Client",
      description: "Master the art of client interaction and delivering exceptional value.",
      chapters: [
        {
          id: "c21",
          title: "Embodying Client-First Culture",
          description: "How to put clients at the center of everything you do.",
          duration: "35m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c22",
          title: "5 Commandments of Problem Solving",
          description: "Essential principles for solving complex client problems effectively.",
          duration: "45m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false,
          resources: [
            {
              id: "r22-1",
              title: "Problem Solving Framework",
              type: "pdf",
              url: "/resources/problem-solving.pdf"
            }
          ]
        },
        {
          id: "c23",
          title: "5 Golden Rules of Communication",
          description: "Mastering the art of clear, impactful communication with clients.",
          duration: "40m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c24",
          title: "Mastering the Art of Client Interview",
          description: "How to conduct effective client interviews to gather crucial information.",
          duration: "50m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false,
          resources: [
            {
              id: "r24-1",
              title: "Client Interview Question Bank",
              type: "pdf",
              url: "/resources/interview-questions.pdf"
            }
          ]
        },
        {
          id: "c25",
          title: "Effective Client Presentation",
          description: "Delivering compelling presentations that drive client decisions.",
          duration: "55m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        }
      ]
    },
    {
      id: "s6",
      title: "Build a Resilient Mindset",
      description: "Develop the mental fortitude needed for long-term success in consulting.",
      chapters: [
        {
          id: "c26",
          title: "Embracing Continuous Improvement",
          description: "Cultivating a growth mindset and commitment to ongoing development.",
          duration: "30m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false
        },
        {
          id: "c27",
          title: "Humility and Vulnerability",
          description: "How embracing humility and vulnerability can make you a stronger consultant.",
          duration: "35m",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          completed: false,
          locked: false,
          resources: [
            {
              id: "r27-1",
              title: "Resilience Building Exercises",
              type: "pdf",
              url: "/resources/resilience.pdf"
            }
          ]
        }
      ]
    }
  ]
};

// Export all courses data
export const coursesData: { [key: string]: Course } = {
  "1": jumpstart100
};

// Helper function to get all chapters from all sections
export const getAllChapters = (course: Course): Chapter[] => {
  return course.sections.flatMap(section => section.chapters);
};

// Helper function to calculate total completed chapters
export const getCompletedChaptersCount = (course: Course): number => {
  const allChapters = getAllChapters(course);
  return allChapters.filter(chapter => chapter.completed).length;
};

// Helper function to calculate total chapters
export const getTotalChaptersCount = (course: Course): number => {
  return getAllChapters(course).length;
};

// Helper function to find a chapter by ID
export const findChapterById = (course: Course, chapterId: string): Chapter | undefined => {
  return getAllChapters(course).find(chapter => chapter.id === chapterId);
};

// Helper function to find the section containing a specific chapter
export const findSectionByChapterId = (course: Course, chapterId: string): Section | undefined => {
  return course.sections.find(section => 
    section.chapters.some(chapter => chapter.id === chapterId)
  );
};

// Helper function to get the next chapter
export const getNextChapter = (course: Course, currentChapterId: string): Chapter | undefined => {
  const allChapters = getAllChapters(course);
  const currentIndex = allChapters.findIndex(chapter => chapter.id === currentChapterId);
  
  if (currentIndex < allChapters.length - 1) {
    return allChapters[currentIndex + 1];
  }
  
  return undefined;
};

// Helper function to get the previous chapter
export const getPrevChapter = (course: Course, currentChapterId: string): Chapter | undefined => {
  const allChapters = getAllChapters(course);
  const currentIndex = allChapters.findIndex(chapter => chapter.id === currentChapterId);
  
  if (currentIndex > 0) {
    return allChapters[currentIndex - 1];
  }
  
  return undefined;
};

// Helper function to get the next unlocked chapter
export const getNextUnlockedChapter = (course: Course): Chapter | undefined => {
  const allChapters = getAllChapters(course);
  return allChapters.find(chapter => !chapter.completed && !chapter.locked);
};
