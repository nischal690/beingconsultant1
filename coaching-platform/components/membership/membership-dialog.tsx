"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Crown, ArrowRight, Globe } from "lucide-react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
  onPlanSelect: (plan: MembershipPlan, method: 'razorpay' | 'stripe' | 'free', appliedCoupon?: Coupon | null, convertedPrice?: number, currency?: string) => void;
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "bc-plus-3-months",
    title: "BC + 3 Months",
    duration: "3 months",
    price: 249,
    originalPrice: 299,
    discount: 25,
    features: [
      "1 on 1 Strategy Call with Gaurav to design your personalized Roadmap",
      "Weekly \"Member only\" skill building workshop",
      "1000+ handpicked Consulting cases from Top Firms",
      "Full Break into Consulting Curriculum (CV, Case, Fit)",
      "AI-Powered Video Case Coach for on-demand practice",
      "Office hour with Gaurav (every week)",
      "Jumpstart 100 - Learn the consulting mindset before Day 1",
      "250+ PPT templates, 8+ Excel Models and real PE projects",
      "Direct Whatsapp access to Top Consultants",
      "10% Discount on Gaurav's 1 on 1 & Group Coaching",
      "Value of the Content: $7500+",
      "Value addition by Gaurav & other Mentors - Priceless"
    ]
  },
  {
    id: "bc-plus-6-months",
    title: "BC + 6 Months",
    duration: "6 months",
    price: 399,
    originalPrice: 599,
    discount: 38,
    features: [
      "1 on 1 Strategy Call with Gaurav to design your personalized Roadmap",
      "Weekly \"Member only\" skill building workshop",
      "1000+ handpicked Consulting cases from Top Firms",
      "Full Break into Consulting Curriculum (CV, Case, Fit)",
      "AI-Powered Video Case Coach for on-demand practice",
      "Office hour with Gaurav (every week)",
      "Jumpstart 100 - Learn the consulting mindset before Day 1",
      "250+ PPT templates, 8+ Excel Models and real PE projects",
      "Direct Whatsapp access to Top Consultants",
      "10% Discount on Gaurav's 1 on 1 & Group Coaching",
      "Value of the Content: $7500+",
      "Value addition by Gaurav & other Mentors - Priceless"
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
  
  // Currency selection state
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "AED" | "EUR" | "GBP" | "JPY" | "INR" | "CAD">("USD");
  
  // Currency conversion rates
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({
    USD: 1,
    AED: 3.67, // 1 USD = 3.67 AED
    EUR: 0.92, // 1 USD = 0.92 EUR
    GBP: 0.79, // 1 USD = 0.79 GBP
    JPY: 150.59, // 1 USD = 150.59 JPY
    INR: 83.11, // 1 USD = 83.11 INR
    CAD: 1.38, // 1 USD = 1.38 CAD
  });
  
  // Currency symbols
  const currencySymbols: Record<string, string> = {
    USD: "$",
    AED: "د.إ",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CAD: "CA$"
  };
  
  // Fetch current exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (response.ok) {
          const data = await response.json();
          if (data && data.rates) {
            setConversionRates({
              USD: 1,
              AED: data.rates.AED || 3.67,
              EUR: data.rates.EUR || 0.92,
              GBP: data.rates.GBP || 0.79,
              JPY: data.rates.JPY || 150.59,
              INR: data.rates.INR || 83.11,
              CAD: data.rates.CAD || 1.38,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback to default rates
      }
    };
    
    fetchRates();
  }, []);

  const calculateDiscountedPrice = (plan: MembershipPlan | null): number => {
    if (!plan) return 0;
    let price = plan.price;
    if (appliedCoupon) {
      price = price - (price * appliedCoupon.discount) / 100;
    }
    return Math.max(0, price); // Ensure price doesn't go below 0
  };
  
  // Convert price to selected currency
  const convertPrice = (priceInUSD: number): number => {
    const rate = conversionRates[selectedCurrency] || 1;
    return priceInUSD * rate;
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
    const convertedPrice = convertPrice(price);
    const symbol = currencySymbols[selectedCurrency] || '$';
    
    // Format JPY without decimal places, others with 2 decimal places
    if (selectedCurrency === 'JPY') {
      return `${symbol}${Math.round(convertedPrice)}`;
    }
    return `${symbol}${convertedPrice.toFixed(2)}`;
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
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Choose Your BC + Membership Plan
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Select a plan that works best for you and unlock premium features
              </DialogDescription>
            </div>
            
            {/* Currency Selector */}
            <div className="flex items-center">
              <div className="flex flex-col items-end">
                <span className="text-xs text-white/60 mb-1">Currency</span>
                <Select value={selectedCurrency} onValueChange={(value: "USD" | "AED" | "EUR" | "GBP" | "JPY" | "INR" | "CAD") => setSelectedCurrency(value)}>
                  <SelectTrigger className="w-[120px] h-8 bg-black/40 border-white/20 text-white">
                    <div className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      <SelectValue placeholder="USD" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20 text-white min-w-[120px]">
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="AED">AED (د.إ)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="CAD">CAD (CA$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
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
                          {formatPrice(plan.originalPrice)}
                        </span>
                      )}
                      <span className="text-xl font-bold">
                        {formatPrice(plan.price)}
                      </span>
                    </div>
                    {plan.discount && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Save {plan.discount}%
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Comparison points/features removed as requested */}
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

          {/* Determine final price after coupon */}
          {(() => {
            const discounted = calculateDiscountedPrice(selectedPlan);
            if (discounted === 0 && selectedPlan) {
              return (
                <div className="mt-6 flex justify-center">
                  <Button
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white"
                    onClick={() => {
                      // Increment coupon usage if a coupon is applied
                      if (appliedCoupon) {
                        incrementCouponUsage(appliedCoupon.code).catch(err => {
                          console.error('Error incrementing coupon usage:', err);
                        });
                      }
                      onPlanSelect(selectedPlan, 'free', appliedCoupon);
                    }}
                  >
                    Continue
                  </Button>
                </div>
              );
            }
            return null;
          })()}

          {/* Payment method selection */}
          {selectedPlan && calculateDiscountedPrice(selectedPlan) > 0 && (
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
                    // Calculate the converted price to pass to payment handler
                    const convertedPrice = convertPrice(calculateDiscountedPrice(selectedPlan));
                    onPlanSelect(selectedPlan, 'razorpay', appliedCoupon, convertedPrice, selectedCurrency);
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
                    // Calculate the converted price to pass to payment handler
                    const convertedPrice = convertPrice(calculateDiscountedPrice(selectedPlan));
                    onPlanSelect(selectedPlan, 'stripe', appliedCoupon, convertedPrice, selectedCurrency);
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
            <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
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