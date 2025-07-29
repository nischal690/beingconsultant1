"use client";

import React, { useEffect, useState } from "react";
import { Crown, Sparkles, Shield, Users, Zap } from "lucide-react";
import { MembershipDialog, MembershipPlan, Coupon } from "@/components/membership/membership-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { getUserProfile, timestampToDate, updateUserProfile } from "@/lib/firebase/firestore";
import { sendBCPlusWelcomeEmail } from "@/lib/firebase/email";
import { toast } from "sonner";

// Function to format date in DD/MON/YYYY format
function formatDateToDDMonYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function AlreadyMemberPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) {
        router.replace("/dashboard/membership");
        return;
      }
      try {
        const res = await getUserProfile(user.uid);
        if (res.success && res.data && res.data.isMember) {
          const expiryVal: any = res.data.membershipExpiry;
          let expiryText: string | null = null;
          if (expiryVal) {
            if (typeof expiryVal === "object" && "seconds" in expiryVal && "nanoseconds" in expiryVal) {
              expiryText = formatDateToDDMonYYYY(timestampToDate(expiryVal));
            } else {
              const parsed = new Date(expiryVal);
              expiryText = isNaN(parsed.getTime()) ? String(expiryVal) : formatDateToDDMonYYYY(parsed);
            }
          }
          setExpiry(expiryText);
        } else {
          router.replace("/dashboard/membership");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sidebar text-sidebar-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sidebar text-sidebar-foreground p-8 text-center">
      <Crown className="h-16 w-16 text-yellow-400 mb-4" />
      <h1 className="text-3xl md:text-4xl font-bold mb-4">You’re already a BC + member!</h1>
      {expiry && <p className="mb-6 text-lg">Your membership expires on {expiry}</p>}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-xl w-full">
        <div className="flex gap-3 items-start">
          <Sparkles className="h-6 w-6 text-yellow-400 mt-1" />
          <p>Unlimited access to all premium resources & masterclasses.</p>
        </div>
        <div className="flex gap-3 items-start">
          <Users className="h-6 w-6 text-yellow-400 mt-1" />
          <p>Exclusive community & networking events.</p>
        </div>
        <div className="flex gap-3 items-start">
          <Shield className="h-6 w-6 text-yellow-400 mt-1" />
          <p>1-on-1 coaching sessions at special member pricing.</p>
        </div>
        <div className="flex gap-3 items-start">
          <Zap className="h-6 w-6 text-yellow-400 mt-1" />
          <p>Early access to new features and content drops.</p>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <Button variant="secondary" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
        <Button onClick={() => setDialogOpen(true)}>Extend Membership</Button>
      </div>

      <MembershipDialog
        open={dialogOpen}
        fullHeight
        onOpenChange={setDialogOpen}
        onPlanSelect={async (plan: MembershipPlan, method, coupon?: Coupon | null) => {
          console.log('Extend selected plan', plan, method, coupon);
          
          try {
            if (!user) return;
            
            // Handle free membership extension (100% coupon)
            if (method === 'free' && coupon && coupon.discount === 100) {
              // Calculate months to add based on plan duration
              let monthsToAdd = 3;
              if (plan.duration.includes('6')) monthsToAdd = 6;
              
              // Get current user profile to check existing expiry date
              const userProfile = await getUserProfile(user.uid);
              
              // Calculate new expiry date based on current expiry or current date
              let currentExpiry: Date;
              
              if (userProfile.success && userProfile.data && userProfile.data.membershipExpiry) {
                const expiryVal = userProfile.data.membershipExpiry;
                
                // Handle Firestore timestamp or ISO string
                if (typeof expiryVal === 'object' && 'seconds' in expiryVal && 'nanoseconds' in expiryVal) {
                  currentExpiry = timestampToDate(expiryVal) || new Date();
                } else {
                  // For ISO strings or other formats
                  const parsed = new Date(expiryVal);
                  currentExpiry = isNaN(parsed.getTime()) ? new Date() : parsed;
                }
              } else {
                // If no existing expiry, use current date
                currentExpiry = new Date();
              }
              
              // Add months to current expiry
              const expiry = new Date(currentExpiry);
              expiry.setMonth(expiry.getMonth() + monthsToAdd);
              
              // Update user profile with new expiry date
              await updateUserProfile(user.uid, {
                isMember: true,
                membershipPlan: plan.id,
                membershipExpiry: expiry.toISOString(),
              });
              
              // Send BC + welcome email for free membership extension
              try {
                console.log('Sending BC + welcome email for free membership extension to:', user.email);
                // Get user's first name if available
                let firstName = '';
                if (user.displayName) {
                  const nameParts = user.displayName.split(' ');
                  firstName = nameParts[0] || '';
                } else if (user.email) {
                  firstName = user.email.split('@')[0].split('.')[0];
                  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                }
                
                // Send welcome email
                if (user.email) {
                  await sendBCPlusWelcomeEmail(user.email, firstName);
                  console.log('BC + welcome email sent successfully');
                }
              } catch (emailError) {
                console.error('Error sending BC + welcome email:', emailError);
                // Don't fail the entire process if email sending fails
              }
              
              toast.success('Membership extended successfully!');
              setExpiry(formatDateToDDMonYYYY(expiry));
              setDialogOpen(false);
            } else if (method === 'razorpay') {
              // Import Razorpay dynamically to avoid SSR issues
              const { processRazorpayPayment } = await import('@/lib/payment/razorpay');
              
              // Calculate final price after coupon discount
              let finalPrice = plan.price;
              if (coupon) {
                finalPrice = finalPrice - (finalPrice * coupon.discount) / 100;
              }
              
              // Convert to paise (Razorpay uses smallest currency unit)
              const amountInPaise = Math.round(finalPrice * 100);
              
              // Create metadata for the transaction
              const metadata = {
                userId: user.uid,
                planId: plan.id,
                planDuration: plan.duration,
                couponCode: coupon?.code || '',
                couponDiscount: coupon?.discount?.toString() || '0',
                type: 'membership_extension'
              };
              
              try {
                // Process payment with Razorpay
                const paymentResult = await processRazorpayPayment({
                  amount: amountInPaise,
                  currency: 'USD', // Using USD to match the displayed prices
                  name: 'Being Consultant',
                  description: `${plan.title} Membership Extension`,
                  prefill: {
                    name: user.displayName || '',
                    email: user.email || '',
                  },
                  notes: metadata
                });
                
                if (paymentResult.success) {
                  // Calculate months to add based on plan duration
                  let monthsToAdd = 3;
                  if (plan.duration.includes('6')) monthsToAdd = 6;
                  
                  // Get current user profile to check existing expiry date
                  const userProfile = await getUserProfile(user.uid);
                  
                  // Calculate new expiry date based on current expiry or current date
                  let currentExpiry: Date;
                  
                  if (userProfile.success && userProfile.data && userProfile.data.membershipExpiry) {
                    const expiryVal = userProfile.data.membershipExpiry;
                    
                    if (typeof expiryVal === 'object' && 'seconds' in expiryVal && 'nanoseconds' in expiryVal) {
                      currentExpiry = timestampToDate(expiryVal) || new Date();
                    } else {
                      const parsed = new Date(expiryVal);
                      currentExpiry = isNaN(parsed.getTime()) ? new Date() : parsed;
                    }
                  } else {
                    currentExpiry = new Date();
                  }
                  
                  // Add months to current expiry
                  const expiry = new Date(currentExpiry);
                  expiry.setMonth(expiry.getMonth() + monthsToAdd);
                  
                  // Update user profile with new expiry date
                  await updateUserProfile(user.uid, {
                    isMember: true,
                    membershipPlan: plan.id,
                    membershipExpiry: expiry.toISOString(),
                  });
                  
                  toast.success('Payment successful! Membership extended.');
                  setExpiry(formatDateToDDMonYYYY(expiry));
                  setDialogOpen(false);
                } else {
                  toast.error('Payment failed or was cancelled.');
                }
              } catch (paymentError) {
                console.error('Razorpay payment error:', paymentError);
                toast.error('Payment processing failed. Please try again.');
              }
            } else if (method === 'stripe') {
              // Import Stripe dynamically to avoid SSR issues
              const { processStripePayment } = await import('@/lib/payment/stripe');
              
              // Calculate final price after coupon discount
              let finalPrice = plan.price;
              if (coupon) {
                finalPrice = finalPrice - (finalPrice * coupon.discount) / 100;
              }
              
              // Convert to cents (Stripe uses smallest currency unit)
              const amountInCents = Math.round(finalPrice * 100);
              
              // Create metadata for the transaction
              const metadata = {
                userId: user.uid,
                planId: plan.id,
                planDuration: plan.duration,
                couponCode: coupon?.code || '',
                couponDiscount: coupon?.discount?.toString() || '0',
                type: 'membership_extension'
              };
              
              try {
                // Process payment with Stripe
                await processStripePayment({
                  productName: `${plan.title} Membership Extension`,
                  productDescription: `Being Consultant ${plan.title} Membership Extension`,
                  amount: amountInCents,
                  currency: 'usd',
                  customerEmail: user.email || undefined,
                  metadata: metadata,
                  successUrl: `${window.location.origin}/dashboard/membership/payment-success?userId=${user.uid}&planId=${plan.id}&duration=${plan.duration}&months=${plan.duration.includes('6') ? '6' : '3'}`,
                  cancelUrl: `${window.location.origin}/dashboard/membership/already`
                });
                
                // Note: For Stripe, the success handling will happen when the user is redirected back to the success URL
                toast.info('Redirecting to Stripe payment page...');
              } catch (paymentError) {
                console.error('Stripe payment error:', paymentError);
                toast.error('Payment processing failed. Please try again.');
              }
            }
          } catch (error) {
            console.error('Error extending membership:', error);
            toast.error('Failed to extend membership. Please try again.');
          }
        }}
      />
    </div>
  );
}
