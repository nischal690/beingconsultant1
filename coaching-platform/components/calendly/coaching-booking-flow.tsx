"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { AvailabilitySelector } from "./availability-selector";
import { CalendlyWidget } from "./scheduling-widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSchedulingFlow, getEventTypeForProgram } from "@/lib/calendly/service";
import { processRazorpayPayment } from "@/lib/payment/razorpay";
import { processStripePayment } from "@/lib/payment/stripe";
import { addCoachingToUserProfile, createTransactionRecord, getUserProfile, verifyCoupon } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

// Define TimeSlot interface for availability selection
interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface CalendlyWidgetProps {
  schedulingUrl: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
  embedType?: "inline" | "popup";
  inlineHeight?: number;
  userId?: string;
  programId?: string;
  transactionId?: string;
  onEventScheduled?: (eventData: any) => void;
}

interface CoachingBookingFlowProps {
  programId: string;
  programName: string;
  price: number;
  currency: string;
  onComplete?: () => void;
  onCancel?: () => void;
  className?: string;
  transactionId?: string; // Optional transaction ID from Stripe payment
}

interface CouponData {
  code: string;
  discount: number;
  discountType?: "percentage" | "fixed";
  product?: string;
}

export function CoachingBookingFlow({
  programId,
  programName,
  price,
  currency,
  onComplete,
  onCancel,
  className = "",
  transactionId: externalTransactionId,
}: CoachingBookingFlowProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<"availability" | "payment" | "scheduling">(externalTransactionId ? "scheduling" : "availability");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventTypeUri, setEventTypeUri] = useState<string | null>(null);
  const [schedulingUrl, setSchedulingUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(externalTransactionId || null);
  const [prefillData, setPrefillData] = useState<any>(null);
  
  // Coupon related states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  
  // Currency related states
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currency || "USD");
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({
    USD: 1,
    AED: 3.67, // 1 USD = 3.67 AED
    EUR: 0.92, // 1 USD = 0.92 EUR
    GBP: 0.79, // 1 USD = 0.79 GBP
    JPY: 160,  // 1 USD = 160 JPY
    INR: 83.5, // 1 USD = 83.5 INR
    CAD: 1.37  // 1 USD = 1.37 CAD
  });
  
  // Currency symbols
  const currencySymbols: Record<string, string> = {
    USD: "$",
    AED: "د.إ",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CAD: "C$"
  };

  // Fetch currency conversion rates
  useEffect(() => {
    const symbols = "AED,GBP,EUR,JPY,INR,CAD,USD";
    const fetchRates = async () => {
      console.log(`[Currency] Fetching live rates for: ${symbols}`);
      try {
        const res = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=d990d1ea7ccb40d3ae881bdc7b3d1fe2&symbols=${symbols}`);
        const data = await res.json();
        console.log("[Currency] API response", data);
        if (data && data.rates) {
          const apiRates: Record<string, string> = data.rates;
          setConversionRates(prev => {
            const updated: Record<string, number> = { ...prev };
            Object.keys(prev).forEach(k => {
              if (apiRates[k]) {
                const parsed = parseFloat(apiRates[k]);
                if (!isNaN(parsed)) {
                  updated[k] = parsed;
                }
              }
            });
            console.log("[Currency] Updated conversion rates", updated);
            return updated;
          });
        }
      } catch (err) {
        console.error("[Currency] Failed to fetch live rates", err);
      }
    };

    fetchRates();
  }, []);

  // Fetch the event type URI on component mount
  useEffect(() => {
    const fetchEventType = async () => {
      try {
        const result = await getEventTypeForProgram(programId);
        if (result.success) {
          setEventTypeUri(result.eventTypeUri);
        } else {
          setError("Failed to fetch event type");
        }
      } catch (err) {
        console.error("Error fetching event type:", err);
        setError("An error occurred while fetching event type");
      }
    };

    fetchEventType();
  }, [programId]);
  
  // Generate scheduling URL when coming from Stripe payment
  useEffect(() => {
    const generateSchedulingUrlForStripe = async () => {
      if (externalTransactionId && currentStep === "scheduling" && !schedulingUrl) {
        console.log("[Stripe Payment] Generating scheduling URL for transaction ID:", externalTransactionId);
        try {
          // Get user profile data for prefilling
          const userProfileResult = user ? await getUserProfile(user.uid) : null;
          const userProfile = userProfileResult?.success && userProfileResult.data ? userProfileResult.data : null;
          
          // Create prefill data for Calendly
          const prefillInfo = {
            name: user?.displayName || (userProfile && 'name' in userProfile ? userProfile.name : '') || '',
            email: user?.email || (userProfile && 'email' in userProfile ? userProfile.email : '') || '',
            customAnswers: {
              'Program Name': programName,
              'Transaction ID': externalTransactionId
            }
          };
          
          setPrefillData(prefillInfo);
          
          // First get the event type for this program
          const eventTypeResult = await getEventTypeForProgram(programId);
          if (!eventTypeResult.success) {
            throw new Error("Failed to get event type for program");
          }
          
          setEventTypeUri(eventTypeResult.eventTypeUri);
          
          // Generate scheduling URL
          const schedulingResult = await createSchedulingFlow({
            userId: user?.uid || 'anonymous',
            programId,
            programName,
            transactionId: externalTransactionId,
            userName: prefillInfo.name,
            userEmail: prefillInfo.email
          });
          
          if (schedulingResult.success && schedulingResult.schedulingUrl) {
            setSchedulingUrl(schedulingResult.schedulingUrl);
            // Also update prefill data with the one from the service if available
            if (schedulingResult.prefill) {
              setPrefillData(schedulingResult.prefill);
            }
            console.log("[Stripe Payment] Successfully generated scheduling URL");
          } else {
            setError("Failed to generate scheduling URL");
            console.error("[Stripe Payment] Failed to generate scheduling URL:", 
              schedulingResult.error || 'Unknown error');
          }
        } catch (err) {
          console.error("[Stripe Payment] Error generating scheduling URL:", err);
          setError("An error occurred while generating scheduling URL");
        }
      }
    };
    
    generateSchedulingUrlForStripe();
  }, [externalTransactionId, currentStep, schedulingUrl, user, programId, programName]);

  // Convert price to selected currency
  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * conversionRates[selectedCurrency];
  };
  
  // Format price with currency symbol
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "";
    return `${currencySymbols[selectedCurrency]}${price.toFixed(2)}`;
  };

  // Calculate final price with discounts
  const calculateFinalPrice = (): number => {
    const basePrice = convertPrice(price);
    
    if (!appliedCoupon) {
      return basePrice;
    }
    
    // Calculate discount based on type
    if (appliedCoupon.discountType === "percentage") {
      return basePrice * (1 - appliedCoupon.discount / 100);
    } else if (appliedCoupon.discountType === "fixed") {
      return Math.max(0, basePrice - appliedCoupon.discount);
    }
    
    // Default to percentage discount if type is not specified
    return basePrice * (1 - appliedCoupon.discount / 100);
  };

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError(null);
    
    try {
      const result = await verifyCoupon(couponCode, programId);
      
      if (result.success && result.data) {
        // Ensure the coupon data has the correct type
        const couponData: CouponData = {
          code: result.data.code,
          discount: result.data.discount,
          discountType: result.data.discountType as "percentage" | "fixed" || "percentage",
          product: result.data.product
        };
        setAppliedCoupon(couponData);
        toast.success(`Coupon "${couponData.code}" applied successfully!`);
      } else {
        setCouponError(result.error || "Invalid coupon code");
        toast.error(result.error || "Invalid coupon code");
      }
    } catch (err) {
      console.error("Error verifying coupon:", err);
      setCouponError("Error verifying coupon");
      toast.error("Error verifying coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Handle free booking when amount is zero
  const handleFreeBooking = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate a transaction ID
      const generatedTransactionId = `free_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setTransactionId(generatedTransactionId);

      // Create transaction record
      await createTransactionRecord(user.uid, {
        id: generatedTransactionId,
        amount: 0,
        currency: selectedCurrency,
        status: "success",
        paymentMethod: "coupon",
        paymentId: generatedTransactionId,
        orderId: generatedTransactionId,
        productId: programId,
        productName: programName,
        productCategory: "coaching",
        couponCode: appliedCoupon?.code || "100OFF",
        couponDiscount: appliedCoupon?.discount || 100,
        originalPrice: price,
        timestamp: new Date().toISOString(),
      });

      // Add coaching to user profile
      await addCoachingToUserProfile(user.uid, {
        programId,
        programName,
        amount: 0,
        currency: selectedCurrency,
        paymentDate: new Date().toISOString(),
        paymentMethod: "coupon",
        transactionId: generatedTransactionId,
        enrollmentDate: new Date().toISOString(),
        originalPrice: price,
        couponCode: appliedCoupon?.code || "100OFF",
        couponDiscount: appliedCoupon?.discount || 100,
      });

      // Generate scheduling URL
      const schedulingResult = await createSchedulingFlow({
        userId: user.uid,
        programId,
        programName,
        transactionId: generatedTransactionId,
        userName: user.displayName || "",
        userEmail: user.email || ""
      });

      if (schedulingResult.success && schedulingResult.schedulingUrl) {
        setSchedulingUrl(schedulingResult.schedulingUrl);
        setPrefillData({
          name: user.displayName || "",
          email: user.email || "",
          customAnswers: {
            "User ID": user.uid,
            "Transaction ID": generatedTransactionId,
            "Program ID": programId,
            "Program Name": programName,
          },
        });
        setCurrentStep("scheduling");
        toast.success("Free booking successful! Please schedule your session.");
      } else {
        throw new Error("Failed to generate scheduling URL");
      }
    } catch (err: any) {
      console.error("Free booking error:", err);
      setError(err.message || "An error occurred during booking");
      toast.error(err.message || "Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSelected = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentStep("payment");
  };

  // Handle payment method selection
  const handlePayment = async (paymentMethod: "razorpay" | "stripe") => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate final price
      const finalPrice = calculateFinalPrice();
      
      // Generate a transaction ID
      const generatedTransactionId = `${paymentMethod}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setTransactionId(generatedTransactionId);
      
      // Process payment
      const paymentResult = await (paymentMethod === "razorpay"
        ? processRazorpayPayment({
            amount: finalPrice * 100, // Convert to smallest currency unit
            currency: selectedCurrency,
            name: programName,
            description: `Coaching: ${programName}`,
            orderId: generatedTransactionId,
            prefill: {
              name: user.displayName || "",
              email: user.email || "",
            },
            theme: {
              color: "#245D66",
            },
          })
        : processStripePayment({
            amount: finalPrice * 100, // Convert to smallest currency unit
            currency: selectedCurrency.toLowerCase(),
            productName: programName,
            productDescription: `Coaching: ${programName}`,
            customerEmail: user.email,
            metadata: {
              programId,
              programCategory: "coaching",
              userId: user.uid,
              transactionId: generatedTransactionId,
            },
          }));

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment failed");
      }

      // For Razorpay, we need to create the transaction record and update user profile
      if (paymentMethod === "razorpay") {
        // Create transaction record
        await createTransactionRecord(user.uid, {
          id: generatedTransactionId,
          amount: finalPrice,
          currency: selectedCurrency,
          status: "success",
          paymentMethod,
          paymentId: paymentResult.razorpay_payment_id,
          orderId: paymentResult.razorpay_order_id,
          productId: programId,
          productName: programName,
          productCategory: "coaching",
          couponCode: appliedCoupon?.code || null,
          couponDiscount: appliedCoupon?.discount || null,
          originalPrice: price,
          timestamp: new Date().toISOString(),
        });

        // Add coaching to user profile
        await addCoachingToUserProfile(user.uid, {
          programId,
          programName,
          amount: finalPrice,
          currency: selectedCurrency,
          paymentDate: new Date().toISOString(),
          paymentMethod,
          transactionId: generatedTransactionId,
          enrollmentDate: new Date().toISOString(),
          originalPrice: price,
          couponCode: appliedCoupon?.code || null,
          couponDiscount: appliedCoupon?.discount || null,
        });

        // Generate scheduling URL
        const schedulingResult = await createSchedulingFlow({
          userId: user.uid,
          programId,
          programName,
          transactionId: generatedTransactionId,
          userName: user.displayName || "",
          userEmail: user.email || ""
        });

        if (schedulingResult.success && schedulingResult.schedulingUrl) {
          setSchedulingUrl(schedulingResult.schedulingUrl);
          setPrefillData({
            name: user.displayName || "",
            email: user.email || "",
            customAnswers: {
              "User ID": user.uid,
              "Transaction ID": generatedTransactionId,
              "Program ID": programId,
              "Program Name": programName,
            },
          });
          setCurrentStep("scheduling");
          toast.success("Payment successful! Please schedule your session.");
        } else {
          throw new Error("Failed to generate scheduling URL");
        }
      } else {
        // For Stripe, the user will be redirected to the Stripe checkout page
        // The rest of the process will happen when they return to the success URL
        toast.info("Redirecting to Stripe checkout...");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "An error occurred during payment processing");
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (error) {
    return (
      <Card className={`${className} bg-white border-gray-200 shadow-xl rounded-xl`}>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${currentStep === "scheduling" ? "bg-transparent border-0 shadow-none" : "bg-white border-gray-200 shadow-xl rounded-xl"}`}>
      {currentStep !== "scheduling" && (
        <CardHeader>
          <CardTitle className="text-black">{programName}</CardTitle>
          <CardDescription className="text-gray-600">
            {currentStep === "availability" && "Select a time that works for you"}
            {currentStep === "payment" && "Complete payment to secure your spot"}
          </CardDescription>
        </CardHeader>
      )}

      <CardContent>
        {currentStep === "availability" && eventTypeUri && (
          <AvailabilitySelector
            token={process.env.NEXT_PUBLIC_CALENDLY_API_TOKEN || ""}
            eventTypeUri={eventTypeUri}
            onTimeSelected={handleTimeSelected}
          />
        )}

        {currentStep === "payment" && selectedTimeSlot && (
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-md">
              <p className="font-medium">Selected Time:</p>
              <p>
                {new Date(selectedTimeSlot.start_time).toLocaleString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
            
            {/* Currency Selector */}
            <div className="space-y-2">
              <Label htmlFor="currency-select">Select Currency:</Label>
              <Select
                value={selectedCurrency}
                onValueChange={(value) => setSelectedCurrency(value)}
              >
                <SelectTrigger id="currency-select" className="w-full">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">USD</span>
                      <span className="text-muted-foreground">(${"$"})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="AED" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">AED</span>
                      <span className="text-muted-foreground">(د.إ)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EUR" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">EUR</span>
                      <span className="text-muted-foreground">(€)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="GBP" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">GBP</span>
                      <span className="text-muted-foreground">(£)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="JPY" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">JPY</span>
                      <span className="text-muted-foreground">(¥)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="INR" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">INR</span>
                      <span className="text-muted-foreground">(₹)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CAD" className="hover:bg-white/10 focus:bg-white/10 rounded-sm my-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">CAD</span>
                      <span className="text-muted-foreground">(C$)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Coupon Input */}
            <div className="space-y-2">
              <Label htmlFor="coupon-input">Coupon Code:</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  disabled={isApplyingCoupon || !!appliedCoupon}
                  className="flex-1"
                />
                <Button 
                  onClick={handleApplyCoupon} 
                  disabled={isApplyingCoupon || !couponCode || !!appliedCoupon}
                  variant="outline"
                >
                  {isApplyingCoupon ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {couponError && <p className="text-sm text-red-500">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-sm text-green-500">
                  Coupon applied: {appliedCoupon.discount}% off
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="font-medium">Payment Amount:</p>
              <p className="text-2xl font-bold">
                {formatPrice(calculateFinalPrice())}
              </p>
              {appliedCoupon && (
                <p className="text-sm text-muted-foreground">
                  <s>{formatPrice(convertPrice(price))}</s> (Coupon discount: {appliedCoupon.discount}%)
                </p>
              )}
            </div>

            <div className="space-y-4">
              {calculateFinalPrice() > 0.01 ? (
                <>
                  <p className="font-medium">Select Payment Method:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handlePayment("razorpay")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Pay with Razorpay"
                      )}
                    </Button>
                    <Button
                      onClick={() => handlePayment("stripe")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Pay with Stripe"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-medium">Free Booking:</p>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => handleFreeBooking()}
                      disabled={isLoading}
                      className="w-full md:w-1/2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {currentStep === "scheduling" && schedulingUrl && (
          <div className="space-y-4">
            <p className="text-center text-green-600 font-medium">
              Payment successful! Please confirm your booking below.
            </p>
            <CalendlyWidget
              schedulingUrl={schedulingUrl}
              prefill={prefillData}
              embedType="inline"
              inlineHeight={500}
              userId={user?.uid || ''}
              programId={programId}
              transactionId={transactionId || ""}
              onEventScheduled={(eventData) => {
                console.log("Calendly event scheduled:", eventData);
                toast.success("Your booking has been confirmed!");
              }}
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          {currentStep === "scheduling" ? "Close" : "Cancel"}
        </Button>

        {currentStep === "availability" && !selectedTimeSlot && (
          <div></div> // Empty div for flex spacing
        )}

        {currentStep === "scheduling" && (
          <Button onClick={onComplete} className="ml-auto">
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
