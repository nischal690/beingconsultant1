"use client";

import React, { useEffect, useState } from "react";
import { Crown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function PaymentSuccessPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processPaymentSuccess() {
      if (!user) {
        router.replace("/dashboard/membership");
        return;
      }

      try {
        // Get parameters from URL
        const userId = searchParams.get('userId');
        const planId = searchParams.get('planId');
        const duration = searchParams.get('duration');
        const months = searchParams.get('months') ? parseInt(searchParams.get('months')!) : 3;

        // Validate parameters
        if (!userId || !planId || !duration) {
          setError("Invalid payment parameters");
          setLoading(false);
          return;
        }

        // Verify user ID matches
        if (userId !== user.uid) {
          setError("User mismatch. Please try again.");
          setLoading(false);
          return;
        }

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
        expiry.setMonth(expiry.getMonth() + months);
        
        // Update user profile with new expiry date
        await updateUserProfile(user.uid, {
          isMember: true,
          membershipPlan: planId,
          membershipExpiry: expiry.toISOString(),
        });
        
        // Send BC + welcome email
        try {
          // Check if this is a new member or an extension
          const isNewMember = !userProfile.success || !userProfile.data || !userProfile.data.isMember;
          
          if (isNewMember) {
            console.log('Sending BC + welcome email to new member:', user.email);
            // Get user's first name if available
            let firstName = '';
            if (user.displayName) {
              const nameParts = user.displayName.split(' ');
              firstName = nameParts[0] || '';
            }
            
            // Send welcome email
            if (user.email) {
              await sendBCPlusWelcomeEmail(user.email, firstName);
              console.log('BC + welcome email sent successfully');
            }
          } else {
            console.log('Membership extension - no welcome email needed');
          }
        } catch (emailError) {
          console.error('Error sending BC + welcome email:', emailError);
          // Don't fail the entire process if email sending fails
        }
        
        setExpiry(formatDateToDDMonYYYY(expiry));
        toast.success('Membership extended successfully!');
      } catch (error) {
        console.error('Error processing payment success:', error);
        setError('Failed to process payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    }

    processPaymentSuccess();
  }, [user, router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sidebar text-sidebar-foreground">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sidebar text-sidebar-foreground p-8 text-center">
        <div className="bg-red-500/10 p-4 rounded-lg mb-6">
          <p className="text-red-500">{error}</p>
        </div>
        <Button onClick={() => router.push("/dashboard/membership/already")}>
          Return to Membership
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sidebar text-sidebar-foreground p-8 text-center">
      <div className="flex flex-col items-center justify-center max-w-md">
        <div className="bg-green-500/20 p-6 rounded-full mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="mb-6 text-lg">Your BC + membership has been extended.</p>
        
        {expiry && (
          <div className="bg-yellow-500/10 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 justify-center">
              <Crown className="h-5 w-5 text-yellow-400" />
              <p className="font-medium">Your membership is now valid until {expiry}</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-6">
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
          <Button onClick={() => router.push("/dashboard/membership/already")}>
            View Membership
          </Button>
        </div>
      </div>
    </div>
  );
}
