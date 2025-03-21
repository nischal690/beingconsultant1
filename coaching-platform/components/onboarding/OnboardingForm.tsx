"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, GraduationCap, MapPin, Building, 
  Lightbulb, Heart, Phone, Mail, Linkedin, ArrowRight, 
  ArrowLeft, CheckCircle, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  fullName: string;
  phone: string;
  email: string;
  linkedInProfile: string;
  workExperience: string;
  education: string;
  location: string;
  currentRole: string;
  currentCompany: string;
  previousCompanies: string;
  areasOfExpertise: string;
  interests: string;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "",
    phone: "",
    email: "",
    linkedInProfile: "",
    workExperience: "",
    education: "",
    location: "",
    currentRole: "",
    currentCompany: "",
    previousCompanies: "",
    areasOfExpertise: "",
    interests: ""
  });
  
  const totalSteps = 6;
  
  useEffect(() => {
    const inputElement = document.querySelector(`input[name="fullName"]`);
    if (inputElement) {
      inputElement.focus();
    }
  }, [step]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const skipToEnd = () => {
    onComplete(formData);
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step
            title="Let's start with the basics"
            description="What's your name and contact information?"
            fields={[
              {
                label: "Full Name",
                name: "fullName",
                value: formData.fullName,
                icon: <User className="h-5 w-5" />,
                autoFocus: true
              },
              {
                label: "Phone Number",
                name: "phone",
                value: formData.phone,
                icon: <Phone className="h-5 w-5" />
              },
              {
                label: "Email Address",
                name: "email",
                value: formData.email,
                icon: <Mail className="h-5 w-5" />
              }
            ]}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <Step
            title="Professional Profile"
            description="Tell us about your LinkedIn profile"
            fields={[
              {
                label: "LinkedIn Profile URL",
                name: "linkedInProfile",
                value: formData.linkedInProfile,
                icon: <Linkedin className="h-5 w-5" />,
                autoFocus: true
              }
            ]}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <Step
            title="Work & Education"
            description="Share your professional background"
            fields={[
              {
                label: "Work Experience (years)",
                name: "workExperience",
                value: formData.workExperience,
                icon: <Briefcase className="h-5 w-5" />,
                autoFocus: true
              },
              {
                label: "Education Background",
                name: "education",
                value: formData.education,
                icon: <GraduationCap className="h-5 w-5" />,
                textarea: true
              }
            ]}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <Step
            title="Location & Career"
            description="Where are you based and what do you do?"
            fields={[
              {
                label: "Location (City, Country)",
                name: "location",
                value: formData.location,
                icon: <MapPin className="h-5 w-5" />,
                autoFocus: true
              },
              {
                label: "Current Role",
                name: "currentRole",
                value: formData.currentRole,
                icon: <Briefcase className="h-5 w-5" />
              },
              {
                label: "Current Company",
                name: "currentCompany",
                value: formData.currentCompany,
                icon: <Building className="h-5 w-5" />
              }
            ]}
            onChange={handleChange}
          />
        );
      case 5:
        return (
          <Step
            title="Previous Experience"
            description="Tell us about your previous companies"
            fields={[
              {
                label: "Previous Companies",
                name: "previousCompanies",
                value: formData.previousCompanies,
                icon: <Building className="h-5 w-5" />,
                textarea: true,
                autoFocus: true
              }
            ]}
            onChange={handleChange}
          />
        );
      case 6:
        return (
          <Step
            title="Expertise & Interests"
            description="What are you passionate about?"
            fields={[
              {
                label: "Areas of Expertise",
                name: "areasOfExpertise",
                value: formData.areasOfExpertise,
                icon: <Lightbulb className="h-5 w-5" />,
                textarea: true,
                autoFocus: true
              },
              {
                label: "Personal Interests",
                name: "interests",
                value: formData.interests,
                icon: <Heart className="h-5 w-5" />,
                textarea: true
              }
            ]}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Step {step} of {totalSteps}
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full bg-black/50 border border-gray-800 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <div className="absolute top-2 right-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={skipToEnd}
                    className="text-gray-400 hover:text-white"
                  >
                    Skip
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderStep()}
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {step === totalSteps ? (
                    <>
                      Complete
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

interface StepProps {
  title: string;
  description: string;
  fields: {
    label: string;
    name: string;
    value: string;
    icon: React.ReactNode;
    textarea?: boolean;
    autoFocus?: boolean;
  }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function Step({ title, description, fields, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-300"
            >
              {field.label}
            </label>
            <div className="relative rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {field.icon}
              </div>
              {field.textarea ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onChange={onChange}
                  className="block w-full rounded-md border-gray-700 bg-gray-900/50 pl-10 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  autoFocus={field.autoFocus}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onChange={onChange}
                  className="block w-full rounded-md border-gray-700 bg-gray-900/50 pl-10 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 [&:not(:placeholder-shown)]:bg-gray-900/50 [&:not(:placeholder-shown)]:text-white"
                  autoFocus={field.autoFocus}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
