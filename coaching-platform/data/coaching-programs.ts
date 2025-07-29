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
  sessionLength?: string;
  bestFor?: string;
  cohortSize?: string;
  timeline?: string;
  investment?: string;
  privateOption?: boolean;
  privatePrice?: number;
}

// Export all coaching programs
export const coachingPrograms: CoachingProgram[] = [
  // Career Strategy Guidance
  {
    id: "coaching-program-001",
    title: "Career Strategy Guidance",
    description: "Determine if consulting aligns with your strengths and career goals. This foundational session maps your unique attributes against consulting requirements, identifies potential entry points, and creates a personalized preparation roadmap. Includes assessment of transferable skills, target firm analysis, and timeline planning for optimal positioning.",
    shortDescription: "Determine if consulting aligns with your strengths and career goals",
    iconName: "briefcase",
    category: "1on1",
    price: 239,
    originalPrice: 299,
    discount: 33,
    popular: true,
    featured: true,
    rating: 4.9,
    reviewCount: 128,
    sessionLength: "60 minutes",
    bestFor: "Professionals considering a consulting career transition or students evaluating career options",
    features: [
      "Assessment of transferable skills",
      "Target firm analysis",
      "Timeline planning for optimal positioning"
    ]
  },
  // CV/CL Review
  {
    id: "coaching-program-002",
    title: "CV/CL Review",
    description: "Transform your application materials to meet consulting standards. Receive detailed feedback on structure, content, and positioning with specific edits to highlight consulting-relevant achievements. Includes strategic keyword optimization, achievement quantification, and formatting enhancements tailored to your target firms.",
    shortDescription: "Transform your application materials to meet consulting standards",
    iconName: "fileText",
    category: "1on1",
    price: 239,
    originalPrice: 249,
    discount: 40,
    popular: true,
    featured: true,
    rating: 4.9,
    reviewCount: 94,
    sessionLength: "60 minutes",
    bestFor: "Candidates preparing applications or those who've received limited interview invitations",
    features: [
      "Strategic keyword optimization",
      "Achievement quantification",
      "Formatting enhancements tailored to your target firms"
    ]
  },
  // Mock Interview
  {
    id: "coaching-program-003",
    title: "Mock Interview",
    description: "Comprehensive interview simulation with a former MBB consultant. Includes both case and fit components with detailed feedback on structure, content, and delivery. Session is recorded for your continued learning and concludes with prioritized improvement areas and specific action steps.",
    shortDescription: "Comprehensive interview simulation with a former MBB consultant",
    iconName: "messageSquare",
    category: "1on1",
    price: 239,
    originalPrice: 299,
    discount: 33,
    popular: true,
    featured: true,
    rating: 4.8,
    reviewCount: 56,
    sessionLength: "60 minutes",
    bestFor: "Candidates with upcoming interviews or those wanting to assess their current preparation level",
    features: [
      "Both case and fit components with detailed feedback",
      "Recorded session for continued learning",
      "Prioritized improvement areas and specific action steps"
    ]
  },
  // First 100 Days Guidance
  {
    id: "coaching-program-004",
    title: "First 100 Days Guidance",
    description: "Strategic preparation for your consulting career launch. Develop protocols for client interaction, work prioritization, and team integration. Includes guidance on early deliverables, managing expectations, and establishing your reputation from day one.",
    shortDescription: "Strategic preparation for your consulting career launch",
    iconName: "fileCheck",
    category: "1on1",
    price: 299,
    originalPrice: 299,
    discount: 33,
    popular: true,
    featured: false,
    rating: 4.8,
    reviewCount: 42,
    sessionLength: "60 minutes",
    bestFor: "Candidates who have received offers and want to excel immediately",
    features: [
      "Protocols for client interaction and work prioritization",
      "Guidance on early deliverables",
      "Establishing your reputation from day one"
    ]
  },
  // Career Accelerator Sessions
  {
    id: "coaching-program-005",
    title: "Career Accelerator Sessions",
    description: "Targeted strategy sessions for consultants seeking to maximize performance and visibility. Focus areas include work optimization, stakeholder management, and positioning for high-profile projects. Includes actionable tactics for immediate implementation.",
    shortDescription: "Targeted strategy sessions for consultants seeking to maximize performance",
    iconName: "zap",
    category: "1on1",
    price: 299,
    originalPrice: 299,
    discount: 33,
    popular: false,
    featured: false,
    rating: 4.9,
    reviewCount: 78,
    sessionLength: "60 minutes",
    bestFor: "Current consultants looking to accelerate their trajectory",
    features: [
      "Work optimization strategies",
      "Stakeholder management techniques",
      "Positioning for high-profile projects"
    ]
  },
  // Last 100 Days Guidance
  {
    id: "coaching-program-006",
    title: "Last 100 Days Guidance",
    description: "Strategic planning for your next career move. Analyze options, leverage consulting experience, and position your exit for maximum career benefit. Includes network activation strategies, narrative development, and negotiation approaches.",
    shortDescription: "Strategic planning for your next career move",
    iconName: "award",
    category: "1on1",
    price: 299,
    originalPrice: 299,
    discount: 33,
    popular: false,
    featured: false,
    rating: 4.7,
    reviewCount: 35,
    sessionLength: "60 minutes",
    bestFor: "Consultants planning their post-consulting transition",
    features: [
      "Network activation strategies",
      "Narrative development",
      "Negotiation approaches"
    ]
  },
  // Break into Consulting (Group Program)
  {
    id: "coaching-program-007",
    title: "Break into Consulting",
    description: "Our flagship program covers the complete consulting recruitment journey. Sessions include step-by-step MBB case solving, FIT interview storytelling techniques, and CV optimization with a former McKinsey consultant. Participants receive 12+ hours of pre-program materials, access to 1000+ practice cases, industry cheat sheets covering 20+ sectors, and our proprietary WiredYou consulting personality assessment. Weekly group Q&A sessions continue until you secure your offer.",
    shortDescription: "Our flagship program covers the complete consulting recruitment journey",
    iconName: "users",
    category: "group",
    price: 599,
    originalPrice: 999,
    discount: 40,
    popular: true,
    featured: true,
    rating: 4.9,
    reviewCount: 87,
    cohortSize: "4-6 participants",
    timeline: "5 sessions over 5 weeks + pre/post program support",
    investment: "$599 (group) / $1199 (private format)",
    privateOption: true,
    privatePrice: 1199,
    features: [
      "Step-by-step MBB case solving",
      "FIT interview storytelling techniques",
      "CV optimization with a former McKinsey consultant",
      "12+ hours of pre-program materials",
      "Access to 1000+ practice cases",
      "Industry cheat sheets covering 20+ sectors",
      "Proprietary WiredYou consulting personality assessment",
      "Weekly group Q&A sessions until you secure your offer"
    ]
  },
  // Case Cracking Mastery (Group Program)
  {
    id: "coaching-program-008",
    title: "Case Cracking Mastery",
    description: "Designed for candidates struggling with case interviews, this program breaks down the entire case cycle from clarification to recommendation. Sessions cover framework development, quantitative analysis techniques, qualitative discussion approaches, and effective synthesis methods. Each participant receives personalized feedback on their structuring logic, calculation speed, and presentation style. Includes practice with market sizing, profitability, growth strategy, and M&A case types.",
    shortDescription: "Designed for candidates struggling with case interviews",
    iconName: "users",
    category: "group",
    price: 399,
    originalPrice: 599,
    discount: 33,
    popular: true,
    featured: true,
    rating: 4.8,
    reviewCount: 62,
    cohortSize: "4-6 participants",
    timeline: "4 sessions over 4 weeks",
    investment: "$399 (group)",
    features: [
      "Framework development",
      "Quantitative analysis techniques",
      "Qualitative discussion approaches",
      "Effective synthesis methods",
      "Personalized feedback on structuring logic",
      "Calculation speed improvement",
      "Presentation style enhancement",
      "Practice with market sizing, profitability, growth strategy, and M&A case types"
    ]
  },
  // FIT Interview Excellence (Group Program)
  {
    id: "coaching-program-009",
    title: "FIT Interview Excellence",
    description: "Transform standard behavioral answers into compelling consulting narratives. This program covers the most frequently asked consulting FIT questions across all firms, with specialized guidance for MBB-specific approaches. Learn how to effectively demonstrate leadership, teamwork, problem-solving and failure recovery through structured storytelling methods. Sessions include recorded practice with personalized delivery feedback to ensure authentic, confident communication.",
    shortDescription: "Transform standard behavioral answers into compelling consulting narratives",
    iconName: "users",
    category: "group",
    price: 299,
    originalPrice: 499,
    discount: 40,
    popular: true,
    featured: true,
    rating: 4.7,
    reviewCount: 45,
    cohortSize: "4-6 participants",
    timeline: "3 sessions over 3 weeks",
    investment: "$299 (group)",
    features: [
      "Most frequently asked consulting FIT questions across all firms",
      "Specialized guidance for MBB-specific approaches",
      "Effective demonstration of leadership, teamwork, problem-solving",
      "Failure recovery through structured storytelling methods",
      "Recorded practice with personalized delivery feedback",
      "Authentic, confident communication techniques"
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
