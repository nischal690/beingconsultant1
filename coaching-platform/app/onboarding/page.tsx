"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { hasCompletedOnboarding, updateUserProfileWithOnboarding, getUserProfile } from "@/lib/firebase/firestore";
import OnboardingForm, { OnboardingData } from "@/components/onboarding/OnboardingFormComponent";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [existingUserData, setExistingUserData] = useState<Partial<OnboardingData> | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        router.push("/auth/signin");
        return;
      }

      try {
        // First check if the user has a LinkedIn profile
        const userProfile = await getUserProfile(user.uid);
        
        // Store any existing user data to pre-fill the form
        if (userProfile.success && userProfile.data) {
          const profileData = userProfile.data;
          
          // Create an object with only the fields that exist in the OnboardingData type
          const existingData: Partial<OnboardingData> = {};
          
          // Map Firebase data to form fields
          if (profileData.firstName || profileData.lastName) {
            existingData.name = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ');
          } else if (profileData.name) {
            existingData.name = profileData.name;
          }
          if (profileData.email) existingData.email = profileData.email;
          if (profileData.phone) existingData.phone = profileData.phone;
          if (profileData.linkedInProfile) existingData.linkedInProfile = profileData.linkedInProfile;
          if (profileData.workExperience) existingData.workExperience = profileData.workExperience;
          if (profileData.education) existingData.education = profileData.education;
          if (profileData.location) existingData.location = profileData.location;
          if (profileData.currentRole) existingData.currentRole = profileData.currentRole;
          if (profileData.currentCompany) existingData.currentCompany = profileData.currentCompany;
          if (profileData.previousCompanies) existingData.previousCompanies = profileData.previousCompanies;
          if (profileData.areasOfExpertise) existingData.areasOfExpertise = profileData.areasOfExpertise;
          if (profileData.interests) existingData.interests = profileData.interests;
          if (profileData.timeCommitment) existingData.timeCommitment = profileData.timeCommitment;
          
          setExistingUserData(existingData);
          
          // If LinkedIn profile exists, redirect to dashboard
          if (profileData.linkedInProfile && profileData.onboardingCompleted) {
            router.push("/dashboard");
            return;
          }
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

  const handleOnboardingComplete = async (data: OnboardingData) => {
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

  // Content for the left side based on current step
  const getStepContent = (step: number) => {
    switch(step) {
      case 1:
        return {
          title: "Let's get to know you",
          description: "We need some basic information to personalize your experience and help you get the most out of our platform."
        };
      case 2:
        return {
          title: "Professional Profile",
          description: "Your professional background helps us connect you with the right resources and opportunities tailored to your experience."
        };
      case 3:
        return {
          title: "Education & Location",
          description: "Understanding your educational background and location allows us to provide relevant content and networking opportunities."
        };
      case 4:
        return {
          title: "Career Details",
          description: "These details help us understand your career trajectory and provide guidance specific to your industry and role."
        };
      case 5:
        return {
          title: "Professional Expertise",
          description: "Your areas of expertise help us match you with the right mentors and learning materials to enhance your skills."
        };
      case 6:
        return {
          title: "Personal Interests",
          description: "Knowing your interests helps us create a more holistic development plan that aligns with your personal goals."
        };
      default:
        return {
          title: "Complete Your Profile",
          description: "Please provide the requested information to help us personalize your experience."
        };
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
    <div className="flex min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background image that spans the entire page */}
      <div className="absolute inset-0 bg-[url('https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/signin_bg.webp?alt=media&token=5233b35e-bea5-4b8b-98f6-abccf45a7125')] bg-cover bg-center opacity-25"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70"></div>
      
      {/* Animated overlay effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-white/3 blur-3xl animate-pulse-slow delay-1000"></div>
      </div>
      
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.07; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 10s ease infinite;
          background-size: 200% 200%;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
      
      <div className="flex flex-col md:flex-row w-full relative z-10">
        {/* Left side - Content changes based on current step */}
        <div className="w-full md:w-1/2 flex items-center">
          {/* Content for left side */}
          <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 w-full">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <span className="text-white font-semibold">{currentStep}</span>
                </div>
                <div className="h-0.5 w-12 bg-gradient-to-r from-white/40 to-white/5"></div>
                <div className="text-white/70 text-sm font-medium">Step {currentStep} of 6</div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">
                {getStepContent(currentStep).title}
              </h1>
              <p className="text-white/80 text-lg max-w-md">
                {getStepContent(currentStep).description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full md:w-1/2">
          <OnboardingForm 
            onComplete={handleOnboardingComplete} 
            onStepChange={setCurrentStep}
            allowSkipToEnd={false}
            initialData={existingUserData}
          />
        </div>
      </div>
    </div>
  );
}
