"use client";

import React, { useEffect, useState } from "react";
import { Crown, Sparkles, Shield, Users, Zap } from "lucide-react";
import { MembershipDialog, MembershipPlan, Coupon } from "@/components/membership/membership-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { getUserProfile, timestampToDate } from "@/lib/firebase/firestore";

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
              expiryText = timestampToDate(expiryVal).toLocaleDateString();
            } else {
              const parsed = new Date(expiryVal);
              expiryText = isNaN(parsed.getTime()) ? String(expiryVal) : parsed.toLocaleDateString();
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
      <h1 className="text-3xl md:text-4xl font-bold mb-4">You’re already a BC+ member!</h1>
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
          <p>Priority 1-on-1 coaching session booking.</p>
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
        onPlanSelect={(plan: MembershipPlan, method, coupon?: Coupon | null) => {
          console.log('Extend selected plan', plan, method, coupon);
        }}
      />
    </div>
  );
}
