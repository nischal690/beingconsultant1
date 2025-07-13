"use client";

import React, { useState, useEffect, MouseEvent } from "react";
import { Sparkles, Star, CheckCircle, ArrowRight, Zap, Shield, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processRazorpayPayment } from "@/lib/payment/razorpay";
import { createStripeCheckoutSession } from "@/lib/payment/stripe";
import { MembershipDialog, MembershipPlan, Coupon } from "@/components/membership/membership-dialog";
import { toast } from "sonner";
import { useAuth } from "@/lib/firebase/auth-context";
import { getUserProfile, timestampToDate, updateUserProfile } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";

export default function MembershipPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [membershipExpiry, setMembershipExpiry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  // Fetch membership status
  useEffect(() => {
    async function fetchMembership() {
      if (!user) {
        setIsMember(false);
        setLoading(false);
        return;
      }
      try {
        const res = await getUserProfile(user.uid);
        if (res.success && res.data) {
          setIsMember(!!res.data.isMember);
          if (res.data.membershipExpiry) {
            const expiryVal: any = res.data.membershipExpiry;
            let expiryText: string | null = null;
            // Detect Firestore Timestamp (has seconds & nanoseconds)
            if (typeof expiryVal === 'object' && 'seconds' in expiryVal && 'nanoseconds' in expiryVal) {
              const d = timestampToDate(expiryVal);
              expiryText = d ? d.toLocaleDateString() : null;
            } else {
              // For strings, keep as-is; for millis/ISO try Date
              const parsed = new Date(expiryVal);
              expiryText = isNaN(parsed.getTime()) ? String(expiryVal) : parsed.toLocaleDateString();
            }
            if (expiryText) {
              setMembershipExpiry(expiryText);
            }
          }
        } else {
          setIsMember(false);
        }
      } catch (err) {
        console.error("Error fetching membership status", err);
        setIsMember(false);
      } finally {
        setLoading(false);
      }
    }

    fetchMembership();
  }, [user]);
  
  // Debug the dialog state changes
  useEffect(() => {
    console.log('Dialog state changed:', dialogOpen);
  }, [dialogOpen]);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Redirect to a dedicated page if user is already a member (must run on every render cycle before early returns)
  useEffect(() => {
    if (isMember) {
      router.replace('/dashboard/membership/already');
    }
  }, [isMember, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sidebar text-sidebar-foreground">
        Loading...
      </div>
    );
  }

  
  if (isMember) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #245D66 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#245D66]/5 rounded-full blur-2xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-black/5 rounded-full blur-2xl animate-float-delayed pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col gap-16 py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#245D66] via-[#1e4a4f] to-black text-white p-12 md:p-16">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
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
                  onClick={() => {
                    console.log('Hero Join BC+ clicked');
                    setDialogOpen(true);
                  }}
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
                <div className="relative bg-black/20 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <Crown className="h-8 w-8 text-yellow-400" />
                    <span className="text-sm font-bold text-white bg-[#245D66]/30 px-3 py-1 rounded-full">BC+</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Premium Member</h3>
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
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-[#245D66] to-black text-white p-12 md:p-16 text-center pointer-events-auto z-50" onClick={() => {
          console.log('CTA section clicked');
          setDialogOpen(true);
        }}>
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
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
            
            <div className="mt-8 flex flex-col items-center">
              <p className="text-lg text-gray-300 mb-6 text-center max-w-2xl">
                Join <span className="text-yellow-400 font-bold">BC+</span> today and unlock a world of exclusive benefits designed for ambitious consultants.
              </p>
              
              <div className="relative z-50" onClick={() => {
                    console.log('CTA wrapper clicked');
                    setDialogOpen(true);
                  }}>
                <Button 
                  variant="default"
                  onClick={() => {
                    console.log('Join BC+ Now clicked!');
                    setDialogOpen(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-6 px-12 rounded-xl"
                >
                  Join BC+ Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Membership Dialog */}
      <MembershipDialog 
        open={dialogOpen} 
        onOpenChange={(open) => {
          console.log('Dialog onOpenChange called with:', open);
          setDialogOpen(open);
        }} 
        onPlanSelect={async (plan, method, appliedCoupon, convertedPrice, currency) => {
          // Guard against null plan (should not happen)
          if (!plan) {
            toast.error('Please select a membership plan');
            return;
          }
          // Calculate final amount after coupon (if any)
          let finalPrice = plan.price;
          if (appliedCoupon) {
            finalPrice = finalPrice - (finalPrice * appliedCoupon.discount) / 100;
          }
          // Convert to smallest currency unit (cents)
          const amountCents = Math.round(finalPrice * 100);

          try {
            if (method === 'free') {
            if (!user) {
              toast.error('You must be logged in');
              return;
            }
            // Calculate expiry based on duration
            const now = new Date();
            let monthsToAdd = 3;
            if (plan.duration.includes('6')) monthsToAdd = 6;
            const expiry = new Date(now);
            expiry.setMonth(expiry.getMonth() + monthsToAdd);
            await updateUserProfile(user.uid, {
              isMember: true,
              membershipPlan: plan.id,
              membershipExpiry: expiry.toISOString(),
            });
            toast.success('Membership activated!');
            setIsMember(true);
            router.replace('/dashboard/membership/already');
            return;
          }

          if (method === 'razorpay') {
              toast.info('Redirecting to Razorpay payment page…');
              // Build URL with query parameters
              const params = new URLSearchParams({
                amount: convertedPrice ? Math.round(convertedPrice * 100).toString() : amountCents.toString(), // cents
                currency: currency || 'USD',
                name: plan.title,
                description: `BC Plus Membership – ${plan.duration}`,
                planId: plan.id,
                duration: plan.duration,
              });
              
              // Add coupon if applied
              if (appliedCoupon) {
                params.append('coupon', appliedCoupon.code);
              }
              
              // Redirect to the Razorpay payment page
              router.push(`/dashboard/membership/razorpay-payment?${params.toString()}`);
              return; // Early return to prevent dialog from closing
            } else {
              toast.info('Redirecting to Stripe…');
              await createStripeCheckoutSession({
                productName: plan.title,
                productDescription: `BC Plus Membership – ${plan.duration}`,
                amount: convertedPrice ? Math.round(convertedPrice * 100) : amountCents, // cents
                currency: currency?.toLowerCase() || 'usd',
                metadata: {
                  planId: plan.id,
                  ...(appliedCoupon ? { coupon: appliedCoupon.code } : {}),
                },
              });
              // control returns only if redirect fails
            }
          } catch (err: any) {
            console.error('Payment error:', err);
            toast.error(err?.message || 'Payment error');
          } finally {
            // Close dialog regardless
            setDialogOpen(false);
          }
        }}
      />
      
      {/* Debug Information */}
      <div className="fixed bottom-4 left-4 text-xs text-white/50">
        Dialog state: {dialogOpen ? 'Open' : 'Closed'}
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