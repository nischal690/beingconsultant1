"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { hasCompletedOnboarding, updateUserProfileWithOnboarding, getUserProfile } from "@/lib/firebase/firestore";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        router.push("/auth/signin");
        return;
      }

      try {
        // First check if the user has a LinkedIn profile
        const userProfile = await getUserProfile(user.uid);
        if (userProfile.success && userProfile.data && userProfile.data.linkedInProfile) {
          // If LinkedIn profile exists, redirect to dashboard
          router.push("/dashboard");
          return;
        }
        
        // Otherwise check if they've completed onboarding
        const completed = await hasCompletedOnboarding(user.uid);
        if (completed) {
          router.push("/dashboard");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [user, router]);

  const handleOnboardingComplete = async (data: any) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await updateUserProfileWithOnboarding(user.uid, data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <OnboardingForm onComplete={handleOnboardingComplete} />
    </div>
  );
}
