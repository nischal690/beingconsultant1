import React, { useState, useEffect } from 'react';
import { ChevronDown, Target, Building, Trophy, Rocket, ArrowRight, ExternalLink, BookOpen, Video, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGritSection } from '@/hooks/useGritSection';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, Product } from '@/context/products-context';

// Extend the Product interface from context with our local properties
interface LocalProduct extends Product {
  productName: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  careerStage?: string;
  type: string;
  imageUrl?: string;
  slug?: string;
  sequence?: number;
}

const GritFramework = () => {
  const { products: allProducts, loading: productsCacheLoading } = useProducts();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<{[key: string]: boolean}>({});
  const [products, setProducts] = useState<{[key: string]: LocalProduct[]}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const { selectedSection, updateSelectedSection } = useGritSection();

  // Restore previously selected career module on component mount
  useEffect(() => {
    if (selectedSection && !expandedCard) {
      setExpandedCard(selectedSection.id);
      // Pre-fetch products so that the list is ready without extra click
      fetchProductsByCareerModule(selectedSection.id);
    }
  }, [selectedSection]);

  // Career module mapping to Firestore careerStage field
  const careerStageMapping: {[key: string]: string} = {
    'G': 'Get Clarity',
    'R': 'Ready the Foundation',
    'I': 'Interview to Win',
    'T': 'Thrive in Consulting',
    'S': 'Step into What\'s Next'
  };

  // Fetch products when a card is expanded
  /**
   * Fetches products for the given career module and stores them in the state.
   * Only fetches products if they are not already in the state and are not already being fetched.
   * @param {string} moduleId The ID of the career module to fetch products for.
   */
  // Fetch products for a given career module (Firebase integration removed)
  const fetchProductsByCareerModule = (moduleId: string) => {
    console.log(`[GRIT Framework] Fetching products for module: ${moduleId}`);
    
    if (products[moduleId]) {
      console.log(`[GRIT Framework] Products already cached for ${moduleId}:`, products[moduleId]);
      return;
    }
    
    if (productsCacheLoading) {
      console.log(`[GRIT Framework] Product cache still loading, will try again later`);
      return;
    }

    // Map module key to human-readable field stored in Firestore, fall back to module key itself
    const moduleLabel = careerStageMapping[moduleId] || moduleId;
    console.log(`[GRIT Framework] Mapped module ID ${moduleId} to label: ${moduleLabel}`);
    console.log(`[GRIT Framework] All products available:`, allProducts.length);
    
    // Log each product's careerStage and stage fields for debugging
    console.log(`[GRIT Framework] Product fields sample:`, 
      allProducts.slice(0, 3).map(p => ({ 
        id: p.id, 
        title: p.title,
        careerStage: p.careerStage, 
        stage: p.stage 
      }))
    );

    const filtered = allProducts.filter((p: any) => {
      // Some products use `careerStage`, others may use `module`
      const matches = p.careerStage === moduleLabel || 
                     p.module === moduleLabel || 
                     p.careerStage === moduleId || 
                     p.module === moduleId;
      return matches;
    });

    console.log(`[GRIT Framework] Filtered ${filtered.length} products for module ${moduleId}:`, 
      filtered.map(p => ({ id: p.id, title: p.title })));

    setProducts(prev => ({ ...prev, [moduleId]: filtered }));
  };

  // Handle card expansion and fetch products
  const handleCardExpand = (cardId: string, cardTitle: string) => {
    console.log(`[GRIT Framework] Card ${cardId} clicked. Current expanded card: ${expandedCard}`);
    const isExpanding = expandedCard !== cardId;
    const newExpandedCard = isExpanding ? cardId : null;
    
    setExpandedCard(newExpandedCard);
    
    // Save to localStorage when expanding a GRIT section (toast notification removed)
    if (isExpanding) {
      updateSelectedSection(cardId, cardTitle);
    }
    
    if (newExpandedCard) {
      console.log(`[GRIT Framework] Expanding card ${newExpandedCard}, will fetch products`);
      fetchProductsByCareerModule(newExpandedCard);
    } else {
      console.log(`[GRIT Framework] Collapsing card ${cardId}, no products will be fetched`);
    }
  };

  // Handle stage expansion - toggle expand/collapse for individual stages
  const handleStageExpand = (e: React.MouseEvent, stageKey: string) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    
    // Extract card ID and stage index from the stage key (format: 'G-stage-0')
    const [cardId, _, stageIndex] = stageKey.split('-');
    const stageIdx = parseInt(stageIndex);
    
    // Find the card item and stage title
    const cardItem = gritItems.find(item => item.id === cardId);
    const stageTitle = cardItem?.stages?.[stageIdx]?.title;
    console.log(`Stage clicked: ${stageKey}, Title: ${stageTitle}`);
    const careerStage = careerStageMapping[cardId];
    console.log(`Card ID: ${cardId}, Career Stage: ${careerStage}`);
    
    // Toggle the expanded state
    const newExpandedState = !expandedStages[stageKey];
    setExpandedStages(prev => ({ ...prev, [stageKey]: newExpandedState }));
    
    // Only fetch products if we're expanding and we have a valid stage title
    if (newExpandedState && !productsCacheLoading && stageTitle) {
      // Log all matching products for debugging
      const matchingProducts = allProducts.filter(p => p.stage === stageTitle || (p.stage && p.stage.toLowerCase() === stageTitle.toLowerCase()));
      console.log(`All products in cache matching stage "${stageTitle}":`, matchingProducts.map(p => ({ id: p.id, title: p.productName || p.title, careerStage: p.careerStage, stage: p.stage })));
      
      // Fetch products for this stage
      fetchProductsByStageTitle(stageKey, stageTitle);
    }
  };

  // Handle module expansion - only one module open at a time
  const handleModuleExpand = (arg1: React.MouseEvent | string, arg2?: string) => {
    // Support both signatures: (stageKey) and (event, stageKey)
    const event = typeof arg1 !== 'string' ? arg1 : undefined;
    const stageKey = typeof arg1 === 'string' ? arg1 : (arg2 as string);
    event?.stopPropagation();

    console.log(`[GRIT Framework] Stage ${stageKey} clicked`);
    
    // Extract card ID from the stage key (format: 'G-stage-0')
    const [cardId, _, stageIndex] = stageKey.split('-');
    
    // Toggle expanded state - close all other stages in this card
    const newExpandedState = !expandedStages[stageKey];
    
    // Create new state object
    const newExpandedStages = { ...expandedStages };
    
    // First, close all stages that belong to the same card
    Object.keys(newExpandedStages).forEach(key => {
      if (key.startsWith(cardId)) {
        newExpandedStages[key] = false;
      }
    });
    
    // Then, set the clicked stage's state
    if (newExpandedState) {
      newExpandedStages[stageKey] = true;
    }
    
    // Update state
    setExpandedStages(newExpandedStages);
    
    // Find the card item and stage title
    const cardItem = gritItems.find(item => item.id === cardId);
    
    // If expanding and we have the stage title, fetch products for this specific stage
    if (newExpandedState && cardItem && cardItem.stages && cardItem.stages[parseInt(stageIndex)]) {
      const stageTitle = cardItem.stages[parseInt(stageIndex)].title;
      console.log(`[GRIT Framework] Expanding stage with title: "${stageTitle}"`);
      fetchProductsByStageTitle(stageKey, stageTitle);
    }
  };

  // Fetch products for a specific stage title
  const fetchProductsByStageTitle = (stageKey: string, stageTitle: string) => {
    console.log(`[GRIT Framework] Fetching products for stage title: "${stageTitle}"`);
    
    if (products[stageKey]) {
      console.log(`[GRIT Framework] Products already cached for stage ${stageKey}:`, products[stageKey]);
      return;
    }
    
    if (productsCacheLoading) {
      console.log(`[GRIT Framework] Product cache still loading, will try again later`);
      return;
    }

    console.log(`[GRIT Framework] All products available:`, allProducts.length);
    
    // Extract card ID from the stage key (format: 'G-stage-0')
    const [cardId] = stageKey.split('-');
    
    // Get the corresponding careerStage for this card
    const careerStage = careerStageMapping[cardId];
    console.log(`[GRIT Framework] Card ID: ${cardId}, Career Stage: ${careerStage}`);
    
    // Filter products where both careerStage and stage fields match
    const filtered = allProducts.filter((p: any) => {
      // Check for stage match (exact match or case-insensitive)
      const stageMatches = 
        p.stage === stageTitle || 
        (p.stage && p.stage.toLowerCase() === stageTitle.toLowerCase());
      
      // Check for careerStage match (exact match or case-insensitive)
      const careerStageMatches = 
        p.careerStage === careerStage || 
        (p.careerStage && p.careerStage.toLowerCase() === careerStage.toLowerCase()) ||
        p.careerStage === cardId;
      
      // Both conditions must be true
      return stageMatches && careerStageMatches;
    });

    console.log(`[GRIT Framework] Found ${filtered.length} products matching career stage "${careerStage}" and stage title "${stageTitle}":`, 
      filtered.map(p => ({ id: p.id, title: p.productName || p.title })));

    // Cast filtered to Product[] to satisfy TypeScript
    setProducts(prev => ({ ...prev, [stageKey]: filtered as Product[] }));
  };

  // Fetch products for a specific module title
  const fetchProductsByModuleTitle = (moduleKey: string, moduleTitle: string) => {
    console.log(`[GRIT Framework] Fetching products for module title: "${moduleTitle}"`);
    
    if (products[moduleKey]) {
      console.log(`[GRIT Framework] Products already cached for module ${moduleKey}:`, products[moduleKey]);
      return;
    }
    
    if (productsCacheLoading) {
      console.log(`[GRIT Framework] Product cache still loading, will try again later`);
      return;
    }

    console.log(`[GRIT Framework] All products available:`, allProducts.length);
    
    // Extract card ID from the module key (format: 'G-module-0')
    const [cardId] = moduleKey.split('-');
    
    // Get the corresponding careerStage for this card
    const careerStage = careerStageMapping[cardId];
    console.log(`[GRIT Framework] Card ID: ${cardId}, Career Stage: ${careerStage}`);
    
    // Filter products where both careerStage and module fields match
    const filtered = allProducts.filter((p: any) => {
      // Check for module match (exact match or case-insensitive)
      const moduleMatches = 
        p.module === moduleTitle || 
        (p.module && p.module.toLowerCase() === moduleTitle.toLowerCase());
      
      // Check for careerStage match (exact match or case-insensitive)
      const careerStageMatches = 
        p.careerStage === careerStage || 
        (p.careerStage && p.careerStage.toLowerCase() === careerStage.toLowerCase()) ||
        p.careerStage === cardId;
      
      // Both conditions must be true
      return moduleMatches && careerStageMatches;
    });

    console.log(`[GRIT Framework] Found ${filtered.length} products matching career stage "${careerStage}" and module title "${moduleTitle}":`, 
      filtered.map(p => ({ id: p.id, title: p.productName || p.title })));

    // Cast filtered to Product[] to satisfy TypeScript
    setProducts(prev => ({ ...prev, [moduleKey]: filtered as Product[] }));
  };

  // Format price for display
  const formatPrice = (price: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get icon based on product type
  const getProductIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ebook':
        return <BookOpen className="h-4 w-4 text-[#245D66]" />;
      case 'video':
      case 'course':
        return <Video className="h-4 w-4 text-[#245D66]" />;
      default:
        return <ExternalLink className="h-4 w-4 text-[#245D66]" />;
    }
  };

  interface ModuleResource {
    id: string;
    title: string;
    description: string;
    type: string;
    price: number;
    currency: string;
    slug?: string;
  }

  interface StageResource {
    id: string;
    title: string;
    description: string;
    type: string;
    price: number;
    currency: string;
    slug?: string;
  }

  interface Stage {
    title: string;
    resources: StageResource[];
  }

  interface Module {
    title: string;
    resources?: StageResource[];
  }

  interface GritItem {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    details: string;
    modules?: Module[];
    stages?: Stage[];
  }

  const gritItems: GritItem[] = [
    {
      id: 'G',
      title: 'Get Clarity',
      description: 'Discover who you are, what fits you, and where you want to go.',
      icon: Target,
      details: 'Deep self-assessment, career alignment, and strategic goal setting for consulting success.',
      stages: [
        {
          title: 'Go through Consulting Career 101',
          resources: []
        },
        {
          title: 'Take Consulting Personality Test',
          resources: []
        },
        {
          title: 'Take Consulting Skill Test',
          resources: []
        },
        {
          title: 'Watch Consulting Career opportunities masterclasses',
          resources: []
        },
        {
          title: 'Watch Unfiltered consulting career related podcast',
          resources: [
            {
              id: 'podcast-link',
              title: 'Being Consultant Podcast',
              description: 'Listen to our podcast for unfiltered consulting career insights',
              type: 'podcast',
              price: 0,
              currency: 'INR',
              slug: 'https://www.beingconsultant.com/podcast'
            }
          ]
        },
        {
          title: 'Consult expert Career Coach',
          resources: []
        }
      ]
    },
    {
      id: 'R',
      title: 'Ready the Foundation',
      description: 'Build a rock-solid profile and essential skills.',
      icon: Building,
      details: 'Master fundamental consulting skills, frameworks, and develop executive presence.',
      stages: [
        {
          title: 'Study primers to build industry knowledge',
          resources: []
        },
        {
          title: 'Build business knowledge through business decoders',
          resources: []
        },
        {
          title: 'Develop core skills mental math data interpretation etc',
          resources: []
        },
        {
          title: 'Write a Winning Consulting CV and CL',
          resources: []
        },
        {
          title: 'Review CV and CL with an expert',
          resources: []
        },
        {
          title: 'Master networking skills',
          resources: []
        },
        {
          title: 'Learn how to CRACK case interview',
          resources: []
        },
        {
          title: 'Create straight through fit interview answers',
          resources: []
        }
      ]
    },
    {
      id: 'I',
      title: 'Interview to Win',
      description: 'Nail the process, achieve skill mastery and land the offer',
      icon: Trophy,
      details: 'Perfect your case interview technique, behavioral responses, and negotiation strategy.',
      stages: [
        {
          title: 'Master Case nuances',
          resources: []
        },
        {
          title: 'Practice case and fit with peers',
          resources: []
        },
        {
          title: 'Practice case and fit with AI Coach',
          resources: []
        },
        {
          title: 'Master psychological hacks to excel under pressure',
          resources: []
        },
        {
          title: 'Polish off the prep with mocks with expert Coach',
          resources: []
        },
        {
          title: 'Consult experts to achieve Best negotiated offer',
          resources: [
            {
              id: 'negotiation-coaching',
              title: '1-on-1 Negotiation Coaching',
              description: 'Get personalized coaching to maximize your offer value',
              type: 'coaching',
              price: 0,
              currency: 'INR',
              slug: '/dashboard/coaching?type=negotiation'
            }
          ]
        }
      ]
    },
    {
      id: 'T',
      title: 'Thrive in Consulting',
      description: 'Start strong, grow fast and stay on top',
      icon: Rocket,
      details: 'Excel in your first 100 days, build key relationships, and establish your reputation.',
      stages: [
        {
          title: 'Watch expert masterclasses to build consulting mindset',
          resources: []
        },
        {
          title: 'Master most important Consulting PPTs and Excel Models',
          resources: []
        },
        {
          title: 'Know the First 100 days in consulting best practices',
          resources: []
        },
        {
          title: 'Work with expert coaches to fast track your career',
          resources: [
            {
              id: 'career-acceleration-coaching',
              title: '1-on-1 Career Acceleration Coaching',
              description: 'Get personalized coaching to fast track your consulting career',
              type: 'coaching',
              price: 0,
              currency: 'INR',
              slug: '/dashboard/coaching?type=career-acceleration'
            }
          ]
        },
        {
          title: 'Continuously upgrade to career skill masterclasses',
          resources: []
        },
        {
          title: 'Assess work-life balance career happiness through assessments',
          resources: []
        },
        {
          title: 'Work on mental strength, resilience and play long',
          resources: []
        }
      ]
    },
    {
      id: 'S',
      title: 'Strategize what\'s next',
      description: 'Design life beyond consulting with clarity and purpose',
      icon: ArrowRight,
      details: 'Plan your post-consulting career with strategic exits and leadership transitions.',
      stages: [
        {
          title: 'Identify right time and opportunity to exit consulting',
          resources: []
        },
        {
          title: 'Work with Coach to design a smooth transition to reinvent yourself',
          resources: []
        }
      ]
    }
  ];

  return (
    <div className="mt-12 px-4">
      {/* Main Container */}
      <div className="relative w-full overflow-hidden bg-transparent rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#245D66] via-[#7BA7AE] to-[#245D66]"></div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#245D66]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-[#245D66]/5 rounded-full blur-3xl -z-10"></div>
        
        {/* Content */}
        <div className="relative z-10 p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center space-x-2 bg-[#245D66]/20 backdrop-blur-sm border border-[#245D66]/30 rounded-full px-6 py-2">
                <div className="w-2 h-2 bg-[#245D66] rounded-full animate-pulse"></div>
                <span className="text-[#245D66] font-medium text-sm tracking-wide">Your Consulting Journey</span>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              THE <span className="text-[#245D66]">GRITS<sup>™</sup></span> Framework
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              For aspirants who want more than just consulting offers — they want mastery.
            </p>
          </div>

          {/* Framework Cards */}
          <div className="space-y-4">
            {gritItems.map((item, index) => {
              const Icon = item.icon;
              const isExpanded = expandedCard === item.id;
              
              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-[#245D66]/50 transition-all duration-500 cursor-pointer"
                  onClick={() => handleCardExpand(item.id, item.title)}
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Main Content */}
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Letter Badge */}
                        <div className="relative">
                          <div className="w-14 h-14 bg-transparent border border-[#245D66]/30 rounded-xl flex items-center justify-center">
                            <span className="text-[#245D66] font-bold text-xl">{item.id}</span>
                          </div>
                          <div className="absolute -inset-1 bg-gradient-to-br from-[#245D66]/10 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <Icon className="w-5 h-5 text-[#245D66]" />
                            <h3 className="text-white font-semibold text-xl">{item.title}</h3>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="ml-6">
                        <div className="w-10 h-10 rounded-full bg-[#245D66]/20 border border-[#245D66]/30 flex items-center justify-center group-hover:bg-[#245D66]/30 transition-all duration-300">
                          <ChevronDown 
                            className={`w-5 h-5 text-[#245D66] transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <div className={`overflow-hidden transition-all duration-500 ${
                      isExpanded ? 'max-h-[800px] mt-6' : 'max-h-0'
                    }`}>
                      <div className="pt-4 border-t border-gray-800/50">
                        <p className="text-gray-400 text-sm leading-relaxed italic mb-6">
                          {item.details}
                        </p>

                        {/* Stage List for items that have stages */}
                        {item.stages && item.stages.length > 0 && (
                          <div className="space-y-4 mb-8">
                            {item.stages.map((stage, idx) => {
                              const stageKey = `${item.id}-stage-${idx}`;
                              const isStageExpanded = expandedStages[stageKey];
                              
                              return (
                                <div key={idx} className="bg-gray-800/30 rounded-lg overflow-hidden">
                                  {/* Stage Header - Clickable */}
                                  <div 
                                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
                                    onClick={(e) => handleStageExpand(e, stageKey)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className="text-[#245D66] font-semibold shrink-0 bg-[#245D66]/10 px-2 py-1 rounded">Module {idx + 1}</span>
                                      <p className="text-gray-300 text-sm leading-relaxed flex-1">
                                        {stage.title}
                                      </p>
                                    </div>
                                    <ChevronDown 
                                      className={`w-4 h-4 text-[#245D66] transition-transform duration-300 ${isStageExpanded ? 'rotate-180' : ''}`} 
                                    />
                                  </div>
                                  
                                  {/* Stage Expanded Content */}
                                  <div className={`overflow-hidden transition-all duration-300 ${isStageExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                                    <div className="p-3 pt-0 border-t border-gray-700/30">
                                      {/* Resources for this stage */}
                                      <div className="py-3">
                                        <h5 className="text-sm font-medium text-gray-300 mb-2">Recommended Resources</h5>
                                        
                                        {/* Hard-coded coaching resource for specific stage titles */}
                                        {(() => {
                                          const specialCoachingTitles = [
                                            'consult expert career coach',
                                            'review cv and cl with an expert',
                                            'polish off the prep with mocks with expert coach',
                                            'consult experts to achieve ‘best negotiated offer’',
                                            'consult experts to achieve “best negotiated offer”',
                                            'consult experts to achieve best negotiated offer',
                                            'identify right time and opportunity to exit consulting',
                                            'work with coach to design a smooth transition to reinvent yourself',
                                            'work with expert coaches to fast track your career'
                                          ];
                                          if (specialCoachingTitles.includes(stage.title.toLowerCase())) {
                                            return (
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                                <Link href={`/dashboard/coaching?stage=${encodeURIComponent(stage.title)}`} className="block">
                                                  <div className="flex flex-col h-full bg-white rounded-md overflow-hidden transition-colors shadow-md hover:shadow-lg">
                                                    <div className="p-3">
                                                      <div className="flex items-center mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-[#245D66]/10 flex items-center justify-center mr-3">
                                                          {getProductIcon('coaching')}
                                                        </div>
                                                        <span className="text-[#245D66] text-sm font-semibold">
                                                          One-on-One Coaching
                                                        </span>
                                                      </div>
                                                      <h6 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-2">{stage.title}</h6>
                                                    </div>
                                                  </div>
                                                </Link>
                                              </div>
                                            );
                                          }
                                          // AI Coach special resource
                                          const aiCoachTitles = [
                                            'practice case and fit with ai coach'
                                          ];
                                          if (aiCoachTitles.includes(stage.title.toLowerCase())) {
                                            return (
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                                <a href="https://aicoach.beingconsultant.com" target="_blank" rel="noopener noreferrer" className="block">
                                                  <div className="flex flex-col h-full bg-white rounded-md overflow-hidden transition-colors shadow-md hover:shadow-lg">
                                                    <div className="p-3">
                                                      <div className="flex items-center mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-[#245D66]/10 flex items-center justify-center mr-3">
                                                          {getProductIcon('video')}
                                                        </div>
                                                        <span className="text-[#245D66] text-sm font-semibold">
                                                          AI Case Coach
                                                        </span>
                                                      </div>
                                                      <h6 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-2">Practice Case & Fit with AI Coach</h6>
                                                    </div>
                                                  </div>
                                                </a>
                                              </div>
                                            );
                                          }
                                          // Podcast coming soon placeholder
                                          if (stage.title.toLowerCase().includes('unfiltered consulting career related podcast')) {
                                            return (
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                                <a href="https://www.beingconsultant.com/podcast" target="_blank" rel="noopener noreferrer" className="block">
                                                  <div className="flex flex-col h-full bg-white rounded-md overflow-hidden transition-colors shadow-md hover:shadow-lg">
                                                    <div className="p-3">
                                                      <div className="flex items-center mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-[#245D66]/10 flex items-center justify-center mr-3">
                                                          {getProductIcon('video')}
                                                        </div>
                                                        <span className="text-[#245D66] text-sm font-semibold">
                                                          Podcast
                                                        </span>
                                                      </div>
                                                      <h6 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-2">Unfiltered – Consulting Career Podcast</h6>
                                                    </div>
                                                  </div>
                                                </a>
                                              </div>
                                            );
                                          }
                                          return null;
                                        })()}

                                        {/* Products for this stage - Small White Rectangles */}
                                        {products[stageKey] && products[stageKey].length > 0 && (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                            {products[stageKey].map((product) => {
                                              // Determine the correct route based on product type
                                              const productType = (product.type || '').toLowerCase();
                                              const categoryType = (product.category || '').toLowerCase();

                                              const isMasterClass = productType === 'master class' || categoryType === 'master class';
                                              const isAssessment = productType === 'assessment' || categoryType === 'assessment';
                                              const isVideoCourse = productType === 'video course' || categoryType === 'video course';
                                              const isCoaching = productType.includes('coaching') || categoryType.includes('coaching');

                                              const href = isMasterClass
                                                ? `/dashboard/masterclass?id=${product.id}`
                                                : isAssessment
                                                ? `/dashboard/assessments?id=${product.id}`
                                                : isVideoCourse
                                                ? `/dashboard/video-courses?id=${product.id}`
                                                : isCoaching
                                                ? `/dashboard/coaching?id=${product.id}`
                                                : `/dashboard/ebooks?id=${product.id}`;
                                                
                                              return (
                                                <Link key={product.id} href={href} className="block">
                                                  <div className="flex flex-col h-full bg-white rounded-md overflow-hidden transition-colors shadow-md hover:shadow-lg">
                                                    {/* Content - Simplified Rectangle */}
                                                    <div className="p-3">
                                                      <div className="flex items-center mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-[#245D66]/10 flex items-center justify-center mr-3">
                                                          {getProductIcon(product.type)}
                                                        </div>
                                                        <span className="text-[#245D66] text-sm font-semibold">
                                                          {product.type}
                                                        </span>
                                                      </div>
                                                      <h6 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-2">{product.productName}</h6>
                                                    </div>
                                                  </div>
                                                </Link>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        

                      </div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
                    <div 
                      className="h-full bg-gradient-to-r from-[#245D66] to-[#245D66]/70 transition-all duration-700"
                      style={{ width: `${((index + 1) / gritItems.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action button removed */}
        </div>
      </div>
    </div>
  );
};

export default GritFramework;