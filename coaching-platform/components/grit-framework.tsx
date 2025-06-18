import React, { useState, useEffect } from 'react';
import { ChevronDown, Target, Building, Trophy, Rocket, ArrowRight, ExternalLink, BookOpen, Video } from 'lucide-react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  productName: any;
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  careerStage?: string;
  type: string;
  imageUrl?: string;
  slug?: string;
}

const GritFramework = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<{[key: string]: boolean}>({});
  const [products, setProducts] = useState<{[key: string]: Product[]}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

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
  const fetchProductsByCareerStage = async (stageId: string) => {
    // Currently, no recommended resources are fetched. This placeholder ensures
    // the UI remains functional without accessing Firebase.
    if (!products[stageId]) {
      setProducts(prev => ({ ...prev, [stageId]: [] }));
    }
  };

  // Handle card expansion and fetch products
  const handleCardExpand = (cardId: string) => {
    console.log(`[GRIT Framework] Card ${cardId} clicked. Current expanded card: ${expandedCard}`);
    const newExpandedCard = expandedCard === cardId ? null : cardId;
    setExpandedCard(newExpandedCard);
    
    if (newExpandedCard) {
      console.log(`[GRIT Framework] Expanding card ${newExpandedCard}, will fetch products`);
      fetchProductsByCareerStage(newExpandedCard);
    } else {
      console.log(`[GRIT Framework] Collapsing card ${cardId}, no products will be fetched`);
    }
  };

  // Handle stage expansion
  const handleStageExpand = (stageKey: string) => {
    console.log(`[GRIT Framework] Stage ${stageKey} clicked`);
    setExpandedStages(prev => ({
      ...prev,
      [stageKey]: !prev[stageKey]
    }));
    
    // Here you would fetch resources for this specific stage
    // fetchResourcesForStage(stageKey);
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
      description: 'Build a rock solid base of data, knowledge, and presence.',
      icon: Building,
      details: 'Master fundamental consulting skills, frameworks, and develop executive presence.'
    },
    {
      id: 'I',
      title: 'Interview to Win',
      description: 'Nail the process. Land the offer. Negotiate powerfully.',
      icon: Trophy,
      details: 'Perfect your case interview technique, behavioral responses, and negotiation strategy.'
    },
    {
      id: 'T',
      title: 'Thrive in Consulting',
      description: 'Start strong, accelerate faster, and stay grounded.',
      icon: Rocket,
      details: 'Excel in your first 100 days, build key relationships, and establish your reputation.'
    },
    {
      id: 'S',
      title: 'Step into What\'s Next',
      description: 'Exit with intention. Become beyond the title.',
      icon: ArrowRight,
      details: 'Plan your post-consulting career with strategic exits and leadership transitions.'
    }
  ];

  return (
    <div className="mt-12 px-4">
      {/* Main Container */}
      <div className="relative w-full">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-transparent via-[#245D66]/20 to-transparent blur-3xl"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#245D66]/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#245D66]/10 rounded-full blur-2xl"></div>
        
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
              THE <span className="text-[#245D66]">GRIT</span> Framework
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
                  onClick={() => handleCardExpand(item.id)}
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Main Content */}
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Letter Badge */}
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">{item.id}</span>
                          </div>
                          <div className="absolute -inset-1 bg-gradient-to-br from-[#245D66]/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                                    onClick={() => handleStageExpand(stageKey)}
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
                                        
                                        {/* No Resources Message */}
                                        {(!stage.resources || stage.resources.length === 0) && (
                                          <p className="text-gray-400 text-xs italic">No resources available for this stage yet.</p>
                                        )}
                                        
                                        {/* Resources List */}
                                        {stage.resources && stage.resources.length > 0 && (
                                          <div className="space-y-2">
                                            {stage.resources.map((resource) => (
                                              <div key={resource.id} className="flex items-start space-x-2 bg-gray-800/30 hover:bg-gray-800/50 rounded p-2 transition-colors">
                                                <div className="h-8 w-8 rounded bg-[#245D66]/20 flex items-center justify-center shrink-0">
                                                  {getProductIcon(resource.type)}
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                  <h6 className="text-white font-medium text-xs">{resource.title}</h6>
                                                  <p className="text-gray-400 text-xs line-clamp-1">{resource.description}</p>
                                                  <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[#245D66] text-xs font-medium">
                                                      {formatPrice(resource.price, resource.currency)}
                                                    </span>
                                                    <Link href={`/dashboard/resources/${resource.id}`} passHref>
                                                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-[#245D66]/20 hover:text-[#245D66]">
                                                        View
                                                      </Button>
                                                    </Link>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
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
                        
                        {/* Products Section */}
                        <div className="space-y-4">
                          <h4 className="text-white font-medium text-lg">Recommended Resources</h4>
                          
                          {/* Loading State */}
                          {loading[item.id] && (
                            <div className="space-y-3">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-3 bg-gray-800/30 rounded-lg p-3">
                                  <Skeleton className="h-12 w-12 rounded-md bg-gray-700/50" />
                                  <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4 bg-gray-700/50" />
                                    <Skeleton className="h-3 w-1/2 bg-gray-700/50" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* No Products Message */}
                          {!loading[item.id] && products[item.id] && products[item.id].length === 0 && (
                            <p className="text-gray-400 text-sm italic">No resources available for this stage yet.</p>
                          )}
                          
                          {/* Products List */}
                          {!loading[item.id] && products[item.id] && products[item.id].length > 0 && (
                            <div className="space-y-3">
                              {products[item.id].map((product) => (
                                <div key={product.id} className="flex items-start space-x-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg p-3 transition-colors">
                                  <div className="h-12 w-12 rounded-md bg-[#245D66]/20 flex items-center justify-center shrink-0">
                                    {getProductIcon(product.type)}
                                  </div>
                                  <div className="space-y-1 flex-1">
                                    <h5 className="text-white font-medium text-sm">{product.title}</h5>
                                    <p className="text-gray-400 text-xs line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-[#245D66] text-xs font-medium">
                                        {formatPrice(product.price, product.currency)}
                                      </span>
                                      <Link href={`/dashboard/resources/${product.id}`} passHref>
                                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-[#245D66]/20 hover:text-[#245D66]">
                                          View Details
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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