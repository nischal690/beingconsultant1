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
  progress: 0,
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
          duration: "4.15m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FIntro.mp4?alt=media&token=8a978237-5d2e-4089-a136-0907fa7235c8",
          completed: false,
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
          id: "c3",
          title: "Significance of the First 100 Days",
          description: "Understanding how your initial period shapes your entire consulting career trajectory.",
          duration: "4.03m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FSignificance%20of%20the%20first%20100%20days.mp4?alt=media&token=2fb1eb1d-b295-432a-9aae-957774b3cade",
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
          duration: "4.28m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJumpstart%20-%20Chapter%201%20Fast%20Track%20Promotion.mp4?alt=media&token=055383da-ff27-42d3-99e2-5d88cf863cf6",
          completed: false,
          locked: false
        },
        {
          id: "c5",
          title: "In the Early Stages of Your Career Go for Breadth",
          description: "Why developing a broad skill set is crucial in your early consulting career.",
          duration: "5.45m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJumpstart%20-%20Chapter%205%20Blow%20your%20own%20trumpet.mp4?alt=media&token=a9ef62fd-08ec-4cb9-87e3-88bf26316389",
          completed: false,
          locked: false
        },
        {
          id: "c6",
          title: "Understanding Billable Work: BD > PD > KD",
          description: "The hierarchy of work types in consulting and how to prioritize them.",
          duration: "5.39m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%203%20BDKDPD.mp4?alt=media&token=f28d4ab1-161c-4a5b-b69d-2d5d4c15ea5d",
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
          duration: "4.21m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJumpstart%20-%20Chapter%204%20Take%20maximum%20advantage%20of%20Feedback%20culture.mp4?alt=media&token=61950632-1d06-4913-8826-7a64494cdd89",
          completed: false,
          locked: false
        },
        {
          id: "c8",
          title: "Blowing Your Trumpet and Gaining Recognition for Your Work",
          description: "Strategies for ensuring your contributions are visible and valued.",
          duration: "5.45m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJumpstart%20-%20Chapter%205%20Blow%20your%20own%20trumpet.mp4?alt=media&token=a9ef62fd-08ec-4cb9-87e3-88bf26316389",
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
          duration: "2.51m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%206-%20Time%20management.mp4?alt=media&token=25d2f6e9-b63e-436c-a354-b0603d7c74b3",
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
          duration: "7.17m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%207%20Don-t%20fall%20sick.mp4?alt=media&token=0ef354c9-5e0f-4109-bfcf-b813e3cfd77d",
          completed: false,
          locked: false
        },
        {
          id: "c11",
          title: "Pre-project Homework and Building a Knowledge Bank",
          description: "Preparing effectively for new projects and building your personal knowledge repository.",
          duration: "2.18m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%208%20Do%20pre-project%20homework.mp4?alt=media&token=6c2e6c8a-9900-491f-b66b-23361d5fc30d",
          completed: false,
          locked: false
        },
        {
          id: "c12",
          title: "Hunt Projects Proactively",
          description: "Strategies for finding and securing the most valuable project opportunities.",
          duration: "5.13m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%209%20Hunt%20projects%20proactively.mp4?alt=media&token=9da21b3c-0ccd-409e-bb9b-08daedd885a5",
          completed: false,
          locked: false
        },
        {
          id: "c13",
          title: "Master Excel Functions",
          description: "Essential Excel skills every consultant needs to know.",
          duration: "1.34m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%2010%20Master%20Excel%20functions.mp4?alt=media&token=05a9335a-a2d8-4040-8abd-909dcf664dba",
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
          duration: "1.39m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%2011%20PPT%20functionalities.mp4?alt=media&token=7fa93cb5-74c5-40c4-bf77-109ea457e2c5",
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
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%2012%20Trust%20ABCD.mp4?alt=media&token=1e327f3c-bc57-4e6d-88e0-411f90788d76",
          completed: false,
          locked: false
        },
        {
          id: "c16",
          title: "Becoming Effective Feedback Receiver and Giver",
          description: "The art of giving and receiving feedback to foster growth and improvement.",
          duration: "40m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%2013%20Feedback.mp4?alt=media&token=4d363cb0-9ac5-48e0-ad7f-9aa7fc8eda2c",
          completed: false,
          locked: false
        },
        {
          id: "c17",
          title: "Setting and Agreeing on Right Expectations",
          description: "How to establish clear expectations with clients and team members.",
          duration: "30m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%2014%20Agree%20on%20expectation%20with%20Manager.mp4?alt=media&token=2ceb167c-aa33-4dc6-a4ff-2ccc10aa3a82",
          completed: false,
          locked: false
        },
        {
          id: "c18",
          title: "Engage Early with Teammates and Leveraging the Ecosystem",
          description: "Building relationships and utilizing the full resources of your organization.",
          duration: "35m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%2015%20Engage%20with%20team%20Mem.mp4?alt=media&token=173e7d0b-12ca-46c1-9800-ac6104bcf3be",
          completed: false,
          locked: false
        },
        {
          id: "c19",
          title: "Demonstrate a 'Can-Do Attitude'",
          description: "How a positive, solution-oriented mindset can accelerate your consulting career.",
          duration: "25m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%2016%20Can%20do%20Attitude.mp4?alt=media&token=f706f0a4-a25c-4a1c-b013-505dccd48247",
          completed: false,
          locked: false
        },
        {
          id: "c20",
          title: "Don't Try to be a Superhero: Leverage the Support System",
          description: "How to effectively use the resources and support available to you.",
          duration: "30m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%2017%20Don-t%20be%20a%20superhero.mp4?alt=media&token=6d2c9f16-6dd6-4e7e-8121-c81c958daf82",
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
          duration: "4.56m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%2018%20Client%20first.mp4?alt=media&token=ee2567c0-8155-4dd7-aad2-58c004b29c5a",
          completed: false,
          locked: false
        },
        {
          id: "c22",
          title: "5 Commandments of Problem Solving",
          description: "Essential principles for solving complex client problems effectively.",
          duration: "4.24m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%2020%205%20commandments%20of%20problem%20solving.mp4?alt=media&token=319b18e3-d7b2-474d-adb3-e3a7b1e98440",
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
          duration: "2.36m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%2021%20Golden%20communication%20rule.mp4?alt=media&token=5567668c-d4ec-47ab-99c2-5a06c47d377e",
          completed: false,
          locked: false
        },
        {
          id: "c24",
          title: "Mastering the Art of Client Interview",
          description: "How to conduct effective client interviews to gather crucial information.",
          duration: "2.38m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FJump%20Start%20-%20Chapter%2022%20Master%20the%20client%20interview.mp4?alt=media&token=ac78df0e-61c4-48de-85fb-f0761874af8d",
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
          duration: "3.01m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%2023%20Effective%20Client%20Representation.mp4?alt=media&token=94f3e908-89da-4fd2-b9b6-da7fa4f4cb07",
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
          duration: "4.08m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%2024%20Continuous%20Improvement.mp4?alt=media&token=a56e019b-b47e-48f7-a55b-c52a60ca1254",
          completed: false,
          locked: false
        },
        {
          id: "c27",
          title: "Humility and Vulnerability",
          description: "How embracing humility and vulnerability can make you a stronger consultant.",
          duration: "4.34m",
          videoUrl: "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/jumpstart%20100%2FChapter%2025%20Humility%20and%20vulnerability.mp4?alt=media&token=5aa7e39e-1ed6-40b1-925a-847cbaf570b7",
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
