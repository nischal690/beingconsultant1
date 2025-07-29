"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { verifyCoupon, incrementCouponUsage } from "@/lib/firebase/firestore";

export type PaymentItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  shortDescription?: string;
  uniqueId?: string;
};

export type Coupon = {
  code: string;
  discount: number;
};

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: PaymentItem;
  onPaymentMethodSelect: (method: 'razorpay' | 'stripe', appliedCoupon?: Coupon | null, convertedPrice?: number, currency?: string) => void;
  onFreeOrderComplete?: (appliedCoupon: Coupon) => void;
  currencySymbol?: string;
  onCouponApplied?: (coupon: Coupon | null) => void;
  selectedCurrency: "USD" | "AED" | "EUR" | "GBP" | "JPY" | "INR" | "CAD";
  onCurrencyChange: (currency: "USD" | "AED" | "EUR" | "GBP" | "JPY" | "INR" | "CAD") => void;
  conversionRates: Record<string, number>;
}

export function PaymentModal({
  isOpen,
  onClose,
  selectedItem,
  onPaymentMethodSelect,
  onFreeOrderComplete,
  selectedCurrency,
  onCurrencyChange,
  conversionRates,
  onCouponApplied
}: PaymentModalProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isOpen || !selectedItem) return null;

  const calculateDiscountedPrice = (price: number): number => {
    if (!appliedCoupon) return price;
    return price - (price * appliedCoupon.discount) / 100;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError(null);
    
    try {
      // Use Firebase coupon verification
      const result = await verifyCoupon(couponCode, selectedItem.id);
      
      if (result.success && result.data) {
        const coupon = { 
          code: result.data.code, 
          discount: result.data.discount 
        };
        setAppliedCoupon(coupon);
        // Call the callback when coupon is applied
        if (onCouponApplied) {
          onCouponApplied(coupon);
        }
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

  // Format price with the provided currency symbol
  const currencySymbols: Record<string,string> = {
    USD: "$",
    AED: "د.إ",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CAD: "CA$"
  };
  // Convert USD price to selected currency and format
  const convertAndFormat = (priceUSD:number): string => {
    const rate = (conversionRates && conversionRates[selectedCurrency]) || 1;
    const converted = priceUSD * rate;
    return `${currencySymbols[selectedCurrency]}${converted.toFixed(2)}`;
  };
  // Alias for old code sections
  const formatPrice = convertAndFormat;

  // Check if the price is zero after applying coupon
  const convertedBase = selectedItem.price * ((conversionRates && conversionRates[selectedCurrency]) || 1);
  const finalPrice = calculateDiscountedPrice(convertedBase);
  const isPriceZero = finalPrice <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      

      {/* Modal Content */}
      <div className="sm:max-w-md w-full bg-black/95 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)] text-white backdrop-blur-2xl relative overflow-hidden rounded-lg p-6 z-10">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
        
        {/* Top highlight border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        {/* Currency */}
        <div className="flex justify-end mb-3">
          <Select value={selectedCurrency} onValueChange={(val)=>onCurrencyChange(val as any)}>
            <SelectTrigger className="w-28 h-8 bg-white/10 border border-white/20 text-sm">
              <SelectValue placeholder={selectedCurrency} />
            </SelectTrigger>
            <SelectContent className="bg-black/95 text-white border-white/10">
              {Object.keys(currencySymbols).map(code=> (
                <SelectItem key={code} value={code} className="cursor-pointer text-sm">
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Close button */}
        <button 
          className="absolute right-4 top-4 text-white/70 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        {/* Header */}
        <div className="flex flex-col space-y-1.5 text-center sm:text-left relative z-10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white tracking-tight">
            Complete Your Purchase
          </h2>
          
          <div className="mt-3 relative">
            <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/40 via-white/10 to-transparent"></div>
            <p className="font-medium text-white text-lg pl-2">{selectedItem.title}</p>
            <p className="text-sm text-white/60 pl-2">{selectedItem.shortDescription || selectedItem.description}</p>
            <div className="mt-3 flex items-baseline">
              {appliedCoupon ? (
                <>
                  <span className="text-2xl font-bold text-white">{formatPrice(calculateDiscountedPrice(selectedItem.price))}</span>
                  <span className="ml-2 text-sm line-through text-white/40">{formatPrice(selectedItem.price)}</span>
                  <span className="ml-2 text-xs text-green-400">-{appliedCoupon.discount}%</span>
                </>
              ) : selectedItem.originalPrice ? (
                <>
                  <span className="text-2xl font-bold text-white">{formatPrice(selectedItem.price)}</span>
                  <span className="ml-2 text-sm line-through text-white/40">{formatPrice(selectedItem.originalPrice)}</span>
                  <span className="ml-2 text-xs text-green-400">
                    -{Math.round((1 - selectedItem.price / selectedItem.originalPrice) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-white">{formatPrice(selectedItem.price)}</span>
              )}
              <span className="ml-2 text-xs text-white/50">({selectedCurrency})</span>
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="space-y-4 py-5 relative z-10">
          {/* Coupon code section */}
          <div className="mb-4">
            <div className="text-sm font-medium text-white/80 mb-3 flex items-center">
              <span className="w-4 h-[1px] bg-white/30 mr-2"></span>
              Have a coupon?
              <span className="w-4 h-[1px] bg-white/30 ml-2"></span>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-black/40 border-white/10 rounded-md w-full focus:border-white/30 focus:ring-white/10 text-white placeholder:text-white/50 h-10"
                  disabled={isApplyingCoupon || !!appliedCoupon}
                />
                {appliedCoupon && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              {appliedCoupon ? (
                <Button
                  variant="outline"
                  className="h-10 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  onClick={() => {
                    setAppliedCoupon(null);
                    setCouponCode("");
                    setCouponError(null);
                    if (onCouponApplied) {
                      onCouponApplied(null);
                    }
                  }}
                >
                  Remove
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="h-10 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                >
                  {isApplyingCoupon ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Applying
                    </span>
                  ) : (
                    "Apply"
                  )}
                </Button>
              )}
            </div>
            
            {couponError && (
              <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <X className="h-3 w-3" />
                {couponError}
              </div>
            )}
            
            {appliedCoupon && (
              <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Coupon "{appliedCoupon.code}" applied successfully!
              </div>
            )}
            
            <div className="mt-2 text-xs text-white/50">
              Try coupon code "TEST4" for 100% off (valid until April 30, 2025)
            </div>
          </div>
          
          {/* Payment methods or Continue button */}
          <div className="space-y-4 mt-6">
            {isPriceZero ? (
              <>
                <div className="text-sm font-medium text-white/80 mb-3 flex items-center">
                  <span className="w-4 h-[1px] bg-white/30 mr-2"></span>
                  Complete Your Order
                  <span className="w-4 h-[1px] bg-white/30 ml-2"></span>
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white group relative overflow-hidden"
                  onClick={() => {
                    // Increment coupon usage if a coupon is applied
                    if (appliedCoupon) {
                      incrementCouponUsage(appliedCoupon.code).catch(err => {
                        console.error("Error incrementing coupon usage:", err);
                      });
                      
                      // For zero-price orders, directly complete the order without payment gateway
                      if (onFreeOrderComplete) {
                        onFreeOrderComplete(appliedCoupon);
                      } else {
                        // Fallback to regular payment flow if onFreeOrderComplete is not provided
                        onPaymentMethodSelect('razorpay', appliedCoupon);
                      }
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-500/30 to-green-600/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <Check className="h-5 w-5" />
                    Continue
                  </div>
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-white/80 mb-3 flex items-center">
                  <span className="w-4 h-[1px] bg-white/30 mr-2"></span>
                  Select Payment Method
                  <span className="w-4 h-[1px] bg-white/30 ml-2"></span>
                </div>
                
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
                    const convertedPrice = selectedItem.price * ((conversionRates && conversionRates[selectedCurrency]) || 1);
                    onPaymentMethodSelect('razorpay', appliedCoupon, convertedPrice, selectedCurrency);
                  }}
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
                    const convertedPrice = selectedItem.price * ((conversionRates && conversionRates[selectedCurrency]) || 1);
                    onPaymentMethodSelect('stripe', appliedCoupon, convertedPrice, selectedCurrency);
                  }}
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
              </>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between border-t border-white/10 pt-4 relative z-10">
          <button 
            className="mt-3 sm:mt-0 px-4 py-2 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all rounded-md text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          
          <div className="flex items-center text-white/60 text-xs">
            <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Secure payment processing
          </div>
        </div>
        
        {/* Bottom highlight border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </div>
  );
}
