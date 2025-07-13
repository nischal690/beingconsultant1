"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Briefcase, GraduationCap, MapPin, Building, Code, Heart, Linkedin, Mail, Phone, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/firebase/auth-context";

export type OnboardingData = {
  name: string;
  email: string;
  phone: string;
  linkedInProfile: string;
  workExperience: string;
  education: string;
  location: string;
  currentRole: string;
  currentCompany: string;
  previousCompanies: string;
  areasOfExpertise: string;
  interests: string;
  timeCommitment: string;
};

type OnboardingFormProps = {
  onComplete: (data: OnboardingData) => void;
  onStepChange?: (step: number) => void;
  allowSkipToEnd?: boolean;
  initialData?: Partial<OnboardingData> | null;
};

export default function OnboardingForm({ onComplete, onStepChange, allowSkipToEnd = false, initialData = null }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string>("");

  // Define animation for the pulse effect
  const pulseAnimation = `@keyframes pulse-slow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`;

  const [formData, setFormData] = useState<OnboardingData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    linkedInProfile: initialData?.linkedInProfile || "",
    workExperience: initialData?.workExperience || "",
    education: initialData?.education || "",
    location: initialData?.location || "",
    currentRole: initialData?.currentRole || "",
    currentCompany: initialData?.currentCompany || "",
    previousCompanies: initialData?.previousCompanies || "",
    areasOfExpertise: initialData?.areasOfExpertise || "",
    interests: initialData?.interests || "",
    timeCommitment: initialData?.timeCommitment || ""
  });

  const totalSteps = 6;
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus on the first input of the current step
    const currentInput = inputRefs.current[step - 1];
    if (currentInput) {
      currentInput.focus();
    }
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  useEffect(() => {
    // Get the user's first name from Firebase Auth or Firestore
    if (user) {
      if (user.displayName) {
        // If user has a display name, use the first part as first name
        const nameParts = user.displayName.split(' ');
        setFirstName(nameParts[0] || "");
      } else if (initialData?.name) {
        // If initialData has a name, use the first part as first name
        const nameParts = initialData.name.split(' ');
        setFirstName(nameParts[0] || "");
      }
    }
  }, [user, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // This function ONLY handles moving to the next step, never completing the form
  const skipStep = () => {
    if (step < totalSteps) {
      console.log(`Skipping from step ${step} to step ${step + 1}`);
      setStep(step + 1);
    }
  };

  // This function handles completing the form
  const completeForm = () => {
    console.log("Completing form");
    onComplete(formData);
  };

  // This function handles the next button click
  const handleNextClick = () => {
    if (step < totalSteps) {
      console.log(`Moving from step ${step} to step ${step + 1}`);
      setStep(step + 1);
    } else {
      completeForm();
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-8 text-white relative">
      {/* Progress bar at top */}
      <div className="w-full max-w-md mb-6">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* User info at top */}
      <div className="w-full max-w-md mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
          <User className="h-5 w-5 text-white/70" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-medium">{firstName || "User"}</span>
          <span className="text-white/50 text-sm flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
            Online
          </span>
        </div>
      </div>

      <style jsx global>{`
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
      `}</style>
      
      <div className="w-full max-w-md">
        <motion.div 
          className="w-full p-6 md:p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: "0 0 30px rgba(255, 255, 255, 0.1)", y: -2 }}
        >
          {/* Subtle gradient border effect */}
          <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-white/5 via-white/10 to-white/5 -z-10"></div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">Basic Information</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Input
                        ref={(el) => {
                          inputRefs.current[0] = el;
                        }}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg h-12 transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg h-12 transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">Professional Profile</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Input
                        ref={(el) => {
                          inputRefs.current[1] = el;
                        }}
                        type="text"
                        name="linkedInProfile"
                        value={formData.linkedInProfile}
                        onChange={handleChange}
                        placeholder="LinkedIn profile URL"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg h-12 transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Textarea
                        name="workExperience"
                        value={formData.workExperience}
                        onChange={handleChange}
                        placeholder="Tell us about your work experience"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg min-h-[100px] transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">Education & Location</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Textarea
                        ref={(el) => {
                          inputRefs.current[2] = el;
                        }}
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="Your educational background"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg min-h-[100px] transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Your location (City, Country)"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg h-12 transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">Career Details</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Input
                        ref={(el) => {
                          inputRefs.current[3] = el;
                        }}
                        type="text"
                        name="currentRole"
                        value={formData.currentRole}
                        onChange={handleChange}
                        placeholder="Current role or job title"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg h-12 transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        placeholder="Current company"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg h-12 transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Input
                        type="text"
                        name="previousCompanies"
                        value={formData.previousCompanies}
                        onChange={handleChange}
                        placeholder="Previous companies (comma separated)"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg h-12 transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">Professional Expertise</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <Code className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Textarea
                        ref={(el) => {
                          inputRefs.current[4] = el;
                        }}
                        name="areasOfExpertise"
                        value={formData.areasOfExpertise}
                        onChange={handleChange}
                        placeholder="Your areas of expertise"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg min-h-[100px] transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 6 && (
                <>
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">Personal Interests</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <Heart className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                      <Textarea
                        ref={(el) => {
                          inputRefs.current[5] = el;
                        }}
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="Your personal interests and hobbies"
                        className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white w-full rounded-lg min-h-[100px] transition-all duration-200 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {/* Left side - Back button or empty */}
            <div>
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                >
                  Back
                </Button>
              )}
            </div>
            
            {/* Middle - Skip button for steps 2-5 */}
            <div>
              {step > 1 && step < totalSteps && (
                <Button 
                  variant="outline" 
                  onClick={skipStep}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                >
                  Skip Step
                </Button>
              )}
            </div>
            
            {/* Right side - Next/Complete button */}
            <div>
              <Button 
                onClick={handleNextClick}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:-translate-y-[2px]"
              >
                <span className="relative z-10">{step === totalSteps ? 'Complete' : 'Next'}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
