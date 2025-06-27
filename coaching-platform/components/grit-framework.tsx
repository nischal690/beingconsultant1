import React, { useState, useEffect } from 'react';
import { ChevronDown, Target, Building, Trophy, Rocket, ArrowRight, ExternalLink, BookOpen, Video, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGritSection } from '@/hooks/useGritSection';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/context/products-context';

interface Product {
  productName: string;
  id: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  careerStage?: string;
  stage?: string;
  type: string;
  imageUrl?: string;
  slug?: string;
  sequence?: number;
}

const GritFramework = () => {
  const { products: allProducts, loading: productsCacheLoading } = useProducts();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<{[key: string]: boolean}>({});
  const [products, setProducts] = useState<{[key: string]: Product[]}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const { selectedSection, updateSelectedSection } = useGritSection();

  // Restore previously selected career stage on component mount
  useEffect(() => {
    if (selectedSection && !expandedCard) {
      setExpandedCard(selectedSection.id);
      // Pre-fetch products so that the list is ready without extra click
      fetchProductsByCareerStage(selectedSection.id);
    }
  }, [selectedSection]);

  // Career stage mapping to Firestore careerStage field
  const careerStageMapping: {[key: string]: string} = {
    'G': 'Get Clarity',
    'R': 'Ready the Foundation',
    'I': 'Interview to Win',
    'T': 'Thrive in Consulting',
    'S': 'Step into What\'s Next'
  };

  // Fetch products when a card is expanded
  /**
   * Fetches products for the given career stage and stores them in the state.
   * Only fetches products if they are not already in the state and are not already being fetched.
   * @param {string} stageId The ID of the career stage to fetch products for.
   */
  // Fetch products for a given career stage (Firebase integration removed)
  const fetchProductsByCareerStage = (stageId: string) => {
    console.log(`[GRIT Framework] Fetching products for stage: ${stageId}`);
    
    if (products[stageId]) {
      console.log(`[GRIT Framework] Products already cached for ${stageId}:`, products[stageId]);
      return;
    }
    
    if (productsCacheLoading) {
      console.log(`[GRIT Framework] Product cache still loading, will try again later`);
      return;
    }

    // Map stage key to human-readable field stored in Firestore, fall back to stage key itself
    const stageLabel = careerStageMapping[stageId] || stageId;
    console.log(`[GRIT Framework] Mapped stage ID ${stageId} to label: ${stageLabel}`);
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
      // Some products use `careerStage`, others may use `stage`
      const matches = p.careerStage === stageLabel || 
                     p.stage === stageLabel || 
                     p.careerStage === stageId || 
                     p.stage === stageId;
      return matches;
    });

    console.log(`[GRIT Framework] Filtered ${filtered.length} products for stage ${stageId}:`, 
      filtered.map(p => ({ id: p.id, title: p.title })));

    setProducts(prev => ({ ...prev, [stageId]: filtered }));
  };

  // Handle card expansion and fetch products
  const handleCardExpand = (cardId: string, cardTitle: string) => {
    console.log(`[GRIT Framework] Card ${cardId} clicked. Current expanded card: ${expandedCard}`);
    const isExpanding = expandedCard !== cardId;
    const newExpandedCard = isExpanding ? cardId : null;
    
    setExpandedCard(newExpandedCard);
    
    // Show toast notification and save to localStorage when expanding a GRIT section
    if (isExpanding) {
      updateSelectedSection(cardId, cardTitle);
      toast.success(`${cardTitle} Selected`, {
        description: `You've selected the ${cardTitle} section`,
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        position: 'top-center',
        duration: 3000,
        className: 'group-[.toaster]:!bg-gray-900 group-[.toast]:!border-gray-800',
      });
    }
    
    if (newExpandedCard) {
      console.log(`[GRIT Framework] Expanding card ${newExpandedCard}, will fetch products`);
      fetchProductsByCareerStage(newExpandedCard);
    } else {
      console.log(`[GRIT Framework] Collapsing card ${cardId}, no products will be fetched`);
    }
  };

  // Handle stage expansion - only one stage open at a time
  const handleStageExpand = (arg1: React.MouseEvent | string, arg2?: string) => {
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
    
    // Filter products where stage field matches the exact stage title
    const filtered = allProducts.filter((p: any) => {
      // Check both exact match and case-insensitive match
      const matches = 
        p.stage === stageTitle || 
        (p.stage && p.stage.toLowerCase() === stageTitle.toLowerCase());
      return matches;
    });

    console.log(`[GRIT Framework] Found ${filtered.length} products matching stage title "${stageTitle}":`, 
      filtered.map(p => ({ id: p.id, title: p.title })));

    // Cast filtered to Product[] to satisfy TypeScript
    setProducts(prev => ({ ...prev, [stageKey]: filtered as Product[] }));
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
        return <BookOpen className="h-4 w-4" />;
      case 'video':
      case 'course':
        return <Video className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

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
    resources?: StageResource[];
  }

  interface GritItem {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    details: string;
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
          title: "Watch 'Unfiltered' consulting career related podcast",
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
          title: 'Develop core skills - mental math, data interpretation etc.',
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
          title: 'Learn how to "CRACK" case interview',
          resources: []
        },
        {
          title: 'Create \'straight through\' fit interview answers',
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
          title: 'Consult experts to achieve "Best negotiated offer"',
          resources: []
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
          title: 'Know the "First 100 days in consulting" best practices',
          resources: []
        },
        {
          title: 'Work with expert coaches to "fast track" your career',
          resources: []
        },
        {
          title: 'Continuously upgrade to career skill masterclasses',
          resources: []
        },
        {
          title: 'Assess work-life balance, career happiness through assessments',
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
                <span className="text-[#245D66] font-medium text-sm tracking-wide">FRAMEWORK</span>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              THE <span className="text-[#245D66]">GRITS</span> Framework
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
                                      <span className="text-[#245D66] font-semibold shrink-0 bg-[#245D66]/10 px-2 py-1 rounded">Stage {idx + 1}</span>
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
                                        
                                        {/* Products for this stage - Small White Rectangles */}
                                        {products[stageKey] && products[stageKey].length > 0 ? (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                            {products[stageKey].map((product) => {
                                              // Determine the correct route based on product type
                                              const productType = product.type?.toLowerCase();
                                              const href = productType === 'masterclass' 
                                                ? `/dashboard/masterclass?id=${product.id}`
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
                                        ) : (
                                          <p className="text-gray-400 text-xs italic">No products available for this stage yet.</p>
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

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#245D66] to-[#245D66]/80 hover:from-[#245D66]/90 hover:to-[#245D66]/70 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GritFramework;