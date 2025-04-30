// Define the coaching program type
export interface CoachingProgram {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  icon?: React.ReactNode;
  iconName?: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular?: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  features?: string[];
}

// Export all coaching programs
export const coachingPrograms: CoachingProgram[] = [
  // Break into consulting
  {
    id: "coaching-program-001",
    title: "Break into Consulting",
    description: "Master the art of case interviews with our comprehensive program designed for aspiring consultants. Get structured frameworks, real-world cases, and expert guidance to secure your dream consulting role.",
    shortDescription: "Comprehensive case interview preparation",
    iconName: "briefcase",
    category: "1on1",
    price: 997,
    originalPrice: 2997,
    discount: 33,
    popular: true,
    featured: true,
    rating: 4.9,
    reviewCount: 128,
    features: [
      "Personalized 1:1 sessions with ex-MBB consultants",
      "Industry-specific case frameworks and methodologies"
    ]
  },
  // Unlimited coaching
  {
    id: "coaching-program-002",
    title: "Unlimited Coaching",
    description: "Get unlimited support until you receive your offer. Our most comprehensive package includes unlimited mock interviews, 24/7 query resolution, and personalized feedback to ensure your success.",
    shortDescription: "Personalized coaching from ex-MBB consultants",
    iconName: "clock",
    category: "1on1",
    price: 2997,
    originalPrice: 3997,
    discount: 25,
    popular: true,
    featured: true,
    rating: 4.9,
    reviewCount: 94,
    features: [
      "Unlimited mock interviews and feedback sessions",
      "Priority access to study materials and resources"
    ]
  },
  // Group coaching
  {
    id: "coaching-program-003",
    title: "Group Coaching",
    description: "Join a Small Group of like-minded candidates to learn and practice together. Benefit from peer learning, shared experiences, and structured group sessions led by expert coaches.",
    shortDescription: "Small Group sessions with like-minded candidates",
    iconName: "users",
    category: "group",
    price: 497,
    originalPrice: 997,
    discount: 50,
    popular: true,
    featured: true,
    rating: 4.7,
    reviewCount: 56,
    features: [
      "Interactive group sessions with max 5 participants",
      "Weekly case practice with diverse industry focus"
    ]
  },
  // 1:1 Case Cracking
  {
    id: "coaching-program-004",
    title: "1:1 Case Cracking",
    description: "Master case interviews",
    shortDescription: "Personalized case interview preparation",
    iconName: "fileCheck",
    category: "1on1",
    price: 299,
    originalPrice: 499,
    discount: 40,
    popular: true,
    featured: false,
    rating: 4.8,
    reviewCount: 42,
    features: [
      "One-on-one case interview preparation",
      "Personalized feedback and improvement plan"
    ]
  },
  // Resume Review
  {
    id: "coaching-program-005",
    title: "1:1 CV and CL Review",
    description: "Get your resume reviewed by ex-MBB consultants",
    shortDescription: "Expert resume review and optimization",
    iconName: "fileText",
    category: "1on1",
    price: 99,
    originalPrice: 199,
    discount: 50,
    popular: false,
    featured: false,
    rating: 4.9,
    reviewCount: 78,
    features: [
      "Detailed review by ex-MBB consultants",
      "Optimization for ATS and human reviewers"
    ]
  },
  // Career Strategy Session
  {
    id: "coaching-program-006",
    title: "1:1 Fit Interview",
    description: "Strategic career planning session",
    shortDescription: "Plan your consulting career path",
    iconName: "messageSquare",
    category: "1on1",
    price: 199,
    originalPrice: 299,
    discount: 33,
    popular: false,
    featured: false,
    rating: 4.7,
    reviewCount: 35,
    features: [
      "Personalized career strategy planning",
      "Industry insights and networking tips"
    ]
  }
];

// Helper function to find a program by ID
export const getProgramById = (id: string): CoachingProgram | undefined => {
  return coachingPrograms.find(program => program.id === id);
};

// Helper function to filter programs by category
export const getProgramsByCategory = (category: string): CoachingProgram[] => {
  if (category === "all") return coachingPrograms;
  return coachingPrograms.filter(program => program.category === category);
};

// Helper function to get featured programs
export const getFeaturedPrograms = (): CoachingProgram[] => {
  return coachingPrograms.filter(program => program.featured);
};

// Helper function to get popular programs
export const getPopularPrograms = (): CoachingProgram[] => {
  return coachingPrograms.filter(program => program.popular);
};
