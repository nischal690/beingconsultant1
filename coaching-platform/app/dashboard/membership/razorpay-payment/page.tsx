"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { processRazorpayPayment } from "@/lib/payment/razorpay";
import { updateUserProfile } from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/firebase/auth-context";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RazorpayPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Automatically process payment on page load
    const processPayment = async () => {
      try {
        // Parse and validate URL parameters
        const amount = searchParams.get("amount");
        const currency = searchParams.get("currency") || "USD";
        const name = searchParams.get("name");
        const description = searchParams.get("description");
        const planId = searchParams.get("planId");
        const coupon = searchParams.get("coupon");
        const duration = searchParams.get("duration");

        if (!amount || !name || !description || !planId || !duration || !user) {
          toast.error("Missing payment information");
          router.push("/dashboard/membership");
          return;
        }

        const amountValue = parseInt(amount, 10);
        
        const res = await processRazorpayPayment({
          amount: amountValue,
          currency,
          name,
          description,
          notes: {
            planId,
            ...(coupon ? { coupon } : {}),
          },
        });
        
        if (!res.success) {
          toast.error(res.error || "Payment failed");
          router.push("/dashboard/membership");
          return;
        }
        
        // Update user profile with membership details
        const now = new Date();
        let monthsToAdd = 3;
        if (duration.includes("6")) monthsToAdd = 6;
        
        const expiry = new Date(now);
        expiry.setMonth(expiry.getMonth() + monthsToAdd);
        
        await updateUserProfile(user.uid, {
          isMember: true,
          membershipPlan: planId,
          membershipExpiry: expiry.toISOString(),
        });
        
        toast.success("Membership activated!");
        router.replace("/dashboard/membership/already");
      } catch (err: any) {
        console.error("Payment error:", err);
        toast.error(err?.message || "Payment error");
        router.push("/dashboard/membership");
      } finally {
        setIsProcessing(false);
      }
    };
    
    processPayment();
  }, [searchParams, router, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar text-sidebar-foreground">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto" />
        <p className="mt-4 text-lg">Initializing Razorpay payment...</p>
        <p className="mt-2 text-sm text-muted-foreground">Please wait, you'll be redirected to the payment gateway.</p>
      </div>
    </div>
  );
}
