"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Brain, Target, Users, TrendingUp, Check, ChevronDown } from "lucide-react";

interface WiredYouDialogProps {
  trigger?: React.ReactNode;
}

export default function WiredYouDialog({ trigger }: WiredYouDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  return (
    <div>
      {trigger && (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl bg-gradient-to-br from-black via-gray-900 to-black border border-[#245D66]/30 shadow-2xl">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#245D66]/20 to-[#245D66]/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#245D66]/15 to-[#245D66]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-20 left-1/2 w-60 h-60 bg-[#245D66]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Header */}
            <div className="relative border-b border-[#245D66]/20 bg-black/60 backdrop-blur-md">
              <div className="flex items-center justify-between p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#245D66] to-[#245D66]/80 shadow-lg animate-pulse">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#245D66] to-white bg-clip-text text-transparent">
                      WIRED YOU
                    </h1>
                    <p className="text-[#245D66] text-sm font-medium">Consulting Personality Assessment</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-full hover:bg-[#245D66]/20 transition-all duration-300 group"
                >
                  <div className="w-6 h-6 relative">
                    <div className="absolute inset-0 rotate-45 bg-white/80 group-hover:bg-[#245D66] w-0.5 h-full left-1/2 transform -translate-x-1/2 transition-colors"></div>
                    <div className="absolute inset-0 -rotate-45 bg-white/80 group-hover:bg-[#245D66] w-0.5 h-full left-1/2 transform -translate-x-1/2 transition-colors"></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative overflow-y-auto max-h-[calc(95vh-120px)] p-8">
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#245D66]/30 to-[#245D66]/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative aspect-video bg-gradient-to-br from-black/80 to-[#245D66]/20 rounded-3xl border border-[#245D66]/30 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                      {/* Animated grid pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(36,93,102,0.3)_25px,rgba(36,93,102,0.3)_26px,transparent_27px),linear-gradient(rgba(36,93,102,0.3)_25px,transparent_26px)] bg-[size:50px_50px] animate-pulse"></div>
                      </div>
                      <div className="text-center space-y-4 z-10">
                        <div className="flex justify-center">
                          <div className="relative">
                            <Sparkles className="w-16 h-16 text-[#245D66] animate-pulse" />
                            <div className="absolute inset-0 w-16 h-16 text-white/20 animate-ping">
                              <Sparkles className="w-16 h-16" />
                            </div>
                          </div>
                        </div>
                        <p className="text-[#245D66] font-bold text-lg">Interactive Assessment Preview</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-5xl font-black leading-tight">
                      <span className="text-white">The Only Personality Test</span><br/>
                      <span className="text-white">Designed to Help You</span><br/>
                      <span className="text-[#245D66] animate-pulse">Succeed in Consulting</span>
                    </h2>
                    <p className="text-xl text-white/80 leading-relaxed font-medium">
                      Unlike generic assessments, WIRED YOU is specifically calibrated to consulting career requirements—measuring the traits that determine success in high-pressure client environments and team dynamics.
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 pt-8">
                      <div className="text-center p-6 rounded-2xl bg-[#245D66]/10 border-2 border-[#245D66]/30 hover:border-[#245D66]/50 transition-all duration-300 hover:scale-105 group">
                        <div className="text-3xl font-black text-[#245D66] group-hover:scale-110 transition-transform">24hr</div>
                        <div className="text-sm text-white/80 font-semibold">Turnaround</div>
                      </div>
                      <div className="text-center p-6 rounded-2xl bg-[#245D66]/10 border-2 border-[#245D66]/30 hover:border-[#245D66]/50 transition-all duration-300 hover:scale-105 group">
                        <div className="text-3xl font-black text-[#245D66] group-hover:scale-110 transition-transform">25min</div>
                        <div className="text-sm text-white/80 font-semibold">Duration</div>
                      </div>
                      <div className="text-center p-6 rounded-2xl bg-[#245D66]/10 border-2 border-[#245D66]/30 hover:border-[#245D66]/50 transition-all duration-300 hover:scale-105 group">
                        <div className="text-3xl font-black text-[#245D66] group-hover:scale-110 transition-transform">98%</div>
                        <div className="text-sm text-white/80 font-semibold">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Pricing Card */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/30 to-[#245D66]/10 rounded-3xl blur-xl"></div>
                  <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-[#245D66]/40 shadow-2xl hover:border-[#245D66]/60 transition-all duration-300">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#245D66] animate-pulse">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white">WIRED YOU Assessment</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          { icon: Brain, text: "Comprehensive Personality Analysis" },
                          { icon: Target, text: "Consulting Career Alignment Report" },
                          { icon: TrendingUp, text: "Development Recommendations" },
                          { icon: Users, text: "24-Hour Expert Review" }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-[#245D66]/10 border border-[#245D66]/30 hover:bg-[#245D66]/20 hover:border-[#245D66]/50 transition-all duration-300 hover:scale-105 group">
                            <div className="p-2 rounded-lg bg-[#245D66] group-hover:bg-white group-hover:text-[#245D66] transition-all duration-300">
                              <item.icon className="w-4 h-4 text-white group-hover:text-[#245D66]" />
                            </div>
                            <span className="text-white font-semibold group-hover:text-white">{item.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-6 border-t-2 border-[#245D66]/30">
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-5xl font-black text-white">$99</span>
                          <span className="text-white/60 text-xl mb-2 font-bold">.00</span>
                        </div>
                        <p className="text-[#245D66] font-bold mb-6 text-lg">Free for BC Plus Members</p>
                        
                        <button className="w-full group relative overflow-hidden rounded-2xl bg-[#245D66] p-6 text-white font-black text-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-[#245D66] hover:border-white hover:bg-white hover:text-[#245D66]">
                          <div className="relative flex items-center justify-center gap-3">
                            <span>TAKE ASSESSMENT NOW</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {[
                  {
                    title: "Consulting-Specific Insights",
                    description: "Discover how your personality traits specifically translate to consulting environments, not just general workplace scenarios.",
                    icon: Target
                  },
                  {
                    title: "Natural Consulting Strengths",
                    description: "Uncover which aspects of consulting will come naturally to you—from client interactions to analytical work to team leadership.",
                    icon: TrendingUp
                  },
                  {
                    title: "Strategic Career Planning",
                    description: "Gain clarity on which consulting roles and firms best match your personality profile to maximize long-term satisfaction.",
                    icon: Brain
                  },
                  {
                    title: "Interview Confidence",
                    description: "Enter interviews with deeper self-awareness, allowing you to authentically address strengths and development areas.",
                    icon: Users
                  }
                ].map((feature, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-[#245D66]/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-500"></div>
                    <div className="relative p-8 rounded-3xl bg-black/40 border-2 border-[#245D66]/30 backdrop-blur-sm hover:bg-black/60 hover:border-[#245D66]/50 transition-all duration-300 hover:scale-105">
                      <div className="w-16 h-16 rounded-2xl bg-[#245D66] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                        <feature.icon className="w-8 h-8 text-white group-hover:text-[#245D66]" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-4">{feature.title}</h3>
                      <p className="text-white/80 leading-relaxed font-medium text-lg">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What You'll Receive */}
              <div className="relative mb-16">
                <div className="absolute inset-0 bg-[#245D66]/20 rounded-3xl blur-xl"></div>
                <div className="relative p-10 rounded-3xl bg-black/60 border-2 border-[#245D66]/40 backdrop-blur-sm">
                  <h3 className="text-4xl font-black text-white mb-6 text-center">What You'll Receive</h3>
                  <p className="text-white/80 text-center mb-10 text-xl font-medium">Within 24 hours after completing your assessment, you'll receive a comprehensive report including:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: "Personality Profile", desc: "Detailed analysis of your characteristics, strengths, and potential blind spots" },
                      { title: "Consulting Alignment", desc: "How your natural traits map to specific consulting functions and roles" },
                      { title: "Environment Fit", desc: "Ideal working conditions for your personality type and how consulting environments match" },
                      { title: "Performance Indicators", desc: "Analysis of your potential across five traits essential to consulting success" },
                      { title: "Development Roadmap", desc: "Targeted recommendations to leverage strengths and address development areas" }
                    ].map((item, index) => (
                      <div key={index} className="flex gap-4 p-6 rounded-2xl bg-[#245D66]/10 border-2 border-[#245D66]/30 hover:bg-[#245D66]/20 hover:border-[#245D66]/50 transition-all duration-300 hover:scale-105 group">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#245D66] flex items-center justify-center mt-1 group-hover:bg-white transition-colors">
                          <Check className="w-5 h-5 text-white group-hover:text-[#245D66]" />
                        </div>
                        <div>
                          <h4 className="font-black text-white mb-2 text-lg">{item.title}</h4>
                          <p className="text-white/80 font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#245D66]/20 rounded-3xl blur-xl"></div>
                <div className="relative p-10 rounded-3xl bg-black/60 border-2 border-[#245D66]/40 backdrop-blur-sm">
                  <h3 className="text-4xl font-black text-white mb-10 text-center">Frequently Asked Questions</h3>
                  
                  <div className="space-y-4">
                    {[
                      {
                        q: "What makes WIRED YOU different from other assessments?",
                        a: "Unlike general personality tests, WIRED YOU is specifically designed to analyze traits relevant to consulting success, calibrated with data from successful consultants across firms."
                      },
                      {
                        q: "How long does the assessment take?",
                        a: "The assessment takes approximately 20-25 minutes to complete. We recommend taking it in a quiet environment without interruptions."
                      },
                      {
                        q: "When will I receive my results?",
                        a: "You'll receive your comprehensive report within 24 hours of completing the assessment."
                      },
                      {
                        q: "Can this determine if consulting is right for me?",
                        a: "While no assessment can make career decisions for you, WIRED YOU provides data-driven insights about how your natural traits align with consulting demands, helping you make a more informed choice."
                      }
                    ].map((faq, index) => (
                      <div key={index} className="border-2 border-[#245D66]/30 rounded-2xl overflow-hidden bg-[#245D66]/10 hover:bg-[#245D66]/20 hover:border-[#245D66]/50 transition-all duration-300">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === `faq-${index}` ? null : `faq-${index}`)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-[#245D66]/10 transition-colors group"
                        >
                          <span className="text-white font-bold text-xl pr-4">{faq.q}</span>
                          <ChevronDown className={`w-6 h-6 text-[#245D66] group-hover:text-white transition-all duration-300 flex-shrink-0 ${expandedFAQ === `faq-${index}` ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedFAQ === `faq-${index}` && (
                          <div className="px-6 pb-6 border-t border-[#245D66]/30">
                            <p className="text-white/80 leading-relaxed font-medium text-lg pt-4">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}