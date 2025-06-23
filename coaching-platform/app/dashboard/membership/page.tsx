"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Star, CheckCircle, Crown, ArrowRight, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MembershipPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, #245D66 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#245D66]/5 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-black/5 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <div className="relative z-10 flex flex-col gap-16 py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#245D66] via-[#1e4a4f] to-black text-white p-12 md:p-16">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute -right-40 -top-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-20 animate-shimmer" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <Crown className="h-10 w-10 text-yellow-400 animate-bounce-slow" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  Premium Access
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Become a <span className="text-yellow-400 animate-pulse">BC+</span> Member
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                Unlock premium support, exclusive discounts, and free access to 20+ high-value products designed to accelerate your consulting career.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  className="group relative overflow-hidden bg-white text-[#245D66] font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="relative z-10 flex items-center text-lg">
                    <Sparkles className={`mr-3 h-6 w-6 text-yellow-500 transition-transform ${isHovered ? 'rotate-12 scale-110' : ''}`} />
                    Join BC+ Now
                    <ArrowRight className={`ml-3 h-5 w-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-50 via-white to-yellow-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </button>
                
                <button className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-5 rounded-2xl transition-all duration-300 font-semibold text-lg backdrop-blur-sm">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-400">20+</div>
                  <div className="text-sm text-white/70">Free Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">10%</div>
                  <div className="text-sm text-white/70">Coaching Discount</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">24/7</div>
                  <div className="text-sm text-white/70">Premium Support</div>
                </div>
              </div>
            </div>

            {/* 3D Card Mockup */}
            <div className="flex-1 max-w-lg">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-[#245D66] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 transform rotate-3" />
                <div className="relative bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <Crown className="h-8 w-8 text-[#245D66]" />
                    <span className="text-sm font-bold text-[#245D66] bg-[#245D66]/10 px-3 py-1 rounded-full">BC+</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#245D66] mb-2">Premium Member</h3>
                  <p className="text-white/90 mb-6">Access to exclusive benefits and premium features</p>
                  <div className="space-y-3">
                    {['Premium Support', 'Coaching Discounts', 'Free Products'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Shield className="h-10 w-10" />,
              title: "Premium Support",
              description: "Skip the queue and receive priority assistance from our expert team whenever you need help.",
              color: "from-blue-500 to-[#245D66]",
              bgColor: "bg-blue-50 dark:bg-blue-950/20"
            },
            {
              icon: <Zap className="h-10 w-10" />,
              title: "10% Coaching Discount",
              description: "Save 10% on every coaching program—group or 1-on-1—while your membership is active.",
              color: "from-yellow-500 to-orange-500",
              bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
            },
            {
              icon: <Users className="h-10 w-10" />,
              title: "20+ Free Products",
              description: "Instantly access a curated library of 20+ templates, guides, and resources, all included.",
              color: "from-green-500 to-[#245D66]",
              bgColor: "bg-green-50 dark:bg-green-950/20"
            },
          ].map((benefit, index) => (
            <div
              key={benefit.title}
              className={`group relative rounded-3xl border border-gray-200 dark:border-gray-800 p-8 bg-white dark:bg-gray-900/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${benefit.bgColor} backdrop-blur-sm`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {benefit.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-[#245D66] dark:text-[#7BA7AE] mb-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {benefit.description}
                </p>
              </div>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="h-5 w-5 text-[#245D66]" />
              </div>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-[#245D66] to-black text-white p-12 md:p-16 text-center">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg%20width%3D'60'%20height%3D'60'%20viewBox%3D'0%200%2060%2060'%20xmlns%3D'http://www.w3.org/2000/svg'%3E%3Cg%20fill%3D'none'%20fill-rule%3D'evenodd'%3E%3Cg%20fill%3D'%23ffffff'%20fill-opacity%3D'0.05'%3E%3Ccircle%20cx%3D'30'%20cy%3D'30'%20r%3D'2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Limited Time Offer</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight">
              Ready to elevate your consulting journey?
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Join <span className="text-yellow-400 font-bold">BC+</span> today and unlock a world of exclusive benefits designed for ambitious consultants.
            </p>
            
            <button className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-12 py-6 rounded-2xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105">
              <span className="relative z-10 flex items-center text-xl">
                <Crown className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Become a BC+ Member
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-50%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(-50%) rotate(45deg); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}