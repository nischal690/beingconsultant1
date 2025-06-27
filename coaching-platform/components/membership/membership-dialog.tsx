"use client";

import React, { useState } from "react";
import { X, Check, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { verifyCoupon, incrementCouponUsage } from "@/lib/firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export type MembershipPlan = {
  id: string;
  title: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
};

export type Coupon = {
  code: string;
  discount: number;
};

interface MembershipDialogProps {
  fullHeight?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanSelect: (plan: MembershipPlan, method: 'razorpay' | 'stripe', appliedCoupon?: Coupon | null) => void;
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "bc-plus-3-months",
    title: "BC+ 3 Months",
    duration: "3 months",
    price: 149,
    originalPrice: 199,
    discount: 25,
    features: [
      "Access to all premium resources",
      "Exclusive webinars and workshops",
      "Community forum access",
      "Discounts on coaching sessions",
      "Priority support"
    ]
  },
  {
    id: "bc-plus-6-months",
    title: "BC+ 6 Months",
    duration: "6 months",
    price: 249,
    originalPrice: 399,
    discount: 38,
    features: [
      "All features from 3-month plan",
      "Extended access period",
      "Two free 1:1 coaching sessions",
      "Resume review",
      "Case interview preparation materials"
    ]
  }
];

export function MembershipDialog({
  open,
  onOpenChange,
  onPlanSelect,
  fullHeight = false,
}: MembershipDialogProps) {
  console.log('MembershipDialog rendered with open state:', open);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const calculateDiscountedPrice = (plan: MembershipPlan): number => {
    let price = plan.price;
    if (appliedCoupon) {
      price = price - (price * appliedCoupon.discount) / 100;
    }
    return Math.max(0, price); // Ensure price doesn't go below 0
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !selectedPlan) return;
    
    setIsApplyingCoupon(true);
    setCouponError(null);
    
    try {
      // Use Firebase coupon verification
      const result = await verifyCoupon(couponCode, selectedPlan.id);
      
      if (result.success && result.data) {
        const coupon = { 
          code: result.data.code, 
          discount: result.data.discount 
        };
        setAppliedCoupon(coupon);
        toast.success(`Coupon "${result.data.code}" applied successfully!`);
      } else {
        setCouponError(result.error || "Invalid coupon code");
        toast.error(result.error || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Error verifying coupon");
      toast.error("Error verifying coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  console.log('MembershipDialog rendering with open:', open);
  
  // Force dialog to be visible in DOM for debugging
  React.useEffect(() => {
    if (open) {
      console.log('Dialog should be open now');
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className={`w-full bg-black/95 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)] text-white backdrop-blur-2xl overflow-hidden p-6 ${fullHeight ? 'h-screen sm:max-w-none rounded-none' : 'sm:max-w-4xl rounded-lg'}`}>
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
        
        {/* Top highlight border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        <DialogHeader className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Crown className="h-6 w-6 text-yellow-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
              Premium Access
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold">
            Choose Your BC+ Membership Plan
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Select a plan that works best for you and unlock premium features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-2 relative z-10">
          {/* Plan selection - Now horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`border ${selectedPlan?.id === plan.id 
                  ? 'border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 to-transparent' 
                  : 'border-white/10 hover:border-white/30 bg-white/5'
                } rounded-lg p-4 cursor-pointer transition-all duration-300 flex flex-col h-full`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg flex items-center">
                      {plan.title}
                      {selectedPlan?.id === plan.id && (
                        <Check className="ml-2 h-4 w-4 text-yellow-400" />
                      )}
                    </h3>
                    <p className="text-white/70 text-sm">{plan.duration} membership</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      {plan.originalPrice && (
                        <span className="text-white/50 line-through text-sm mr-2">
                          ${plan.originalPrice}
                        </span>
                      )}
                      <span className="text-xl font-bold">
                        ${plan.price}
                      </span>
                    </div>
                    {plan.discount && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Save {plan.discount}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 flex-grow">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-sm text-white/80">
                      <Check className="h-3 w-3 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Coupon code section - only show if a plan is selected */}
          {selectedPlan && (
            <div className="border border-white/10 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-medium text-white/80">Have a coupon code?</h3>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button 
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Apply
                </Button>
              </div>
              
              {couponError && (
                <p className="text-red-400 text-xs">{couponError}</p>
              )}
              
              {appliedCoupon && (
                <div className="flex items-center justify-between bg-green-500/10 text-green-400 text-sm p-2 rounded">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    <span>
                      Coupon applied: {appliedCoupon.discount}% off
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {formatPrice(calculateDiscountedPrice(selectedPlan))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment methods - only show if a plan is selected */}
          {selectedPlan && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-white/80 mb-3 flex items-center">
                <span className="w-4 h-[1px] bg-white/30 mr-2"></span>
                Select Payment Method
                <span className="w-4 h-[1px] bg-white/30 ml-2"></span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  className="w-full bg-[#072654] hover:bg-[#0A3A7A] text-white group relative overflow-hidden"
                  onClick={() => {
                    // Increment coupon usage if a coupon is applied
                    if (appliedCoupon) {
                      incrementCouponUsage(appliedCoupon.code).catch(err => {
                        console.error("Error incrementing coupon usage:", err);
                      });
                    }
                    onPlanSelect(selectedPlan, 'razorpay', appliedCoupon);
                  }}
                  disabled={!selectedPlan}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#072654]/0 via-[#0A3A7A]/30 to-[#072654]/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <img 
                      src="https://razorpay.com/favicon.png" 
                      alt="Razorpay" 
                      className="h-5 w-5"
                    />
                    Pay with Razorpay
                  </div>
                </Button>
                
                <Button
                  className="w-full bg-[#635BFF] hover:bg-[#8780FF] text-white group relative overflow-hidden"
                  onClick={() => {
                    // Increment coupon usage if a coupon is applied
                    if (appliedCoupon) {
                      incrementCouponUsage(appliedCoupon.code).catch(err => {
                        console.error("Error incrementing coupon usage:", err);
                      });
                    }
                    onPlanSelect(selectedPlan, 'stripe', appliedCoupon);
                  }}
                  disabled={!selectedPlan}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#635BFF]/0 via-[#8780FF]/30 to-[#635BFF]/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <img 
                      src="https://stripe.com/img/v3/home/social.png" 
                      alt="Stripe" 
                      className="h-5 w-5"
                    />
                    Pay with Stripe
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between border-t border-white/10 pt-4 relative z-10">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mt-3 sm:mt-0 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            Cancel
          </Button>
          
          <div className="flex items-center text-white/60 text-xs">
            <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Secure payment processing
          </div>
        </DialogFooter>
        
        {/* Bottom highlight border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </DialogContent>
    </Dialog>
  );
}