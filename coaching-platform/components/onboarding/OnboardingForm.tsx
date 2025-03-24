"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, MapPin, Building, 
  Lightbulb, Heart, Phone, Mail, Linkedin, ArrowRight, 
  ArrowLeft, CheckCircle, X, GraduationCap, Search,
  Plus, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/firebase/auth-context";
import { getUserProfile } from "@/lib/firebase/firestore";

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
}

interface EducationEntry {
  id: string;
  level: string;
  university: string;
  otherUniversity: string;
}

interface OnboardingData {
  fullName: string;
  phone: string;
  email: string;
  linkedInProfile: string;
  workExperience: number;
  educationEntries: EducationEntry[];
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
    workExperience: 5,
    educationEntries: [
      {
        id: `edu-${Date.now()}-0`,
        level: "Undergraduate",
        university: "",
        otherUniversity: ""
      }
    ],
    location: "",
    currentRole: "",
    currentCompany: "",
    previousCompanies: "",
    areasOfExpertise: "",
    interests: ""
  });
  
  const [universitySearchOpen, setUniversitySearchOpen] = useState<{[key: string]: boolean}>({});
  const [activeEducationId, setActiveEducationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const totalSteps = 7;
  
  useEffect(() => {
    const inputElement = document.querySelector(`input[name="${Object.keys(formData)[step-1]}"]`) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, [step, formData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEducationLevelChange = (id: string, level: string) => {
    setFormData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.map(entry => 
        entry.id === id ? { ...entry, level } : entry
      )
    }));
  };
  
  const handleUniversitySelect = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.map(entry => 
        entry.id === id ? { 
          ...entry, 
          university: value,
          otherUniversity: value === "Other" ? entry.otherUniversity : ""
        } : entry
      )
    }));
    setUniversitySearchOpen(prev => ({ ...prev, [id]: false }));
  };
  
  const handleOtherUniversityChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.map(entry => 
        entry.id === id ? { ...entry, otherUniversity: value } : entry
      )
    }));
  };
  
  const addEducationEntry = () => {
    console.log("Adding new education entry");
    
    // Generate a unique ID for the new entry
    const newId = `edu-${Date.now()}-${formData.educationEntries.length}`;
    
    // Create the new entry
    const newEntry = {
      id: newId,
      level: "Undergraduate",
      university: "",
      otherUniversity: ""
    };
    
    // Update the form data with the new entry
    setFormData(prevData => ({
      ...prevData,
      educationEntries: [...prevData.educationEntries, newEntry]
    }));
    
    // Set the new entry as active
    setActiveEducationId(newId);
    
    console.log("Added new education entry with ID:", newId);
  };
  
  const removeEducationEntry = (id: string) => {
    // Don't remove if it's the only entry
    if (formData.educationEntries.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.filter(entry => entry.id !== id)
    }));
  };
  
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value[0]
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
                icon: <User className="h-5 w-5 text-white/70" />,
                autoFocus: true
              },
              {
                label: "Phone Number",
                name: "phone",
                value: formData.phone,
                icon: <Phone className="h-5 w-5 text-white/70" />
              },
              {
                label: "Email Address",
                name: "email",
                value: formData.email,
                icon: <Mail className="h-5 w-5 text-white/70" />
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
                icon: <Linkedin className="h-5 w-5 text-white/70" />,
                autoFocus: true
              }
            ]}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <Step
            title="Work Experience"
            description="How many years of experience do you have?"
            fields={[
              {
                label: "Work Experience (years)",
                name: "workExperience",
                value: formData.workExperience.toString(),
                icon: <Briefcase className="h-5 w-5 text-white/70" />,
                autoFocus: true,
                slider: true,
                sliderValue: formData.workExperience,
                onSliderChange: (value: number[]) => handleSliderChange("workExperience", value)
              }
            ]}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <Step
            title="Education"
            description="Tell us about your educational background"
            customContent={
              <div className="space-y-6 mt-4">
                {formData.educationEntries.map((entry, index) => (
                  <motion.div 
                    key={entry.id}
                    className="p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {formData.educationEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(entry.id)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Remove education entry"
                      >
                        <Trash2 className="h-4 w-4 text-white/70" />
                      </button>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Education Level
                        </label>
                        <div className="flex space-x-4">
                          {["Undergraduate", "Postgraduate"].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleEducationLevelChange(entry.id, level)}
                              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                entry.level === level 
                                  ? "bg-white/20 text-white border border-white/30" 
                                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          University
                        </label>
                        <div className="relative rounded-md">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                            <GraduationCap className="h-5 w-5 text-white/70" />
                          </div>
                          
                          <div className="pl-10">
                            <Popover 
                              open={universitySearchOpen[entry.id] || false} 
                              onOpenChange={(open) => {
                                setUniversitySearchOpen(prev => ({ ...prev, [entry.id]: open }));
                                if (open) setActiveEducationId(entry.id);
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={universitySearchOpen[entry.id] || false}
                                  className="w-full justify-between border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                >
                                  {entry.university ? entry.university : "Select university..."}
                                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0 bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                                <Command className="bg-transparent">
                                  <CommandInput 
                                    placeholder="Search university..." 
                                    className="text-white placeholder:text-white/30 h-9 border-b border-white/10"
                                  />
                                  <CommandList className="max-h-[300px] overflow-auto">
                                    <CommandEmpty className="text-white/60 py-6 text-center text-sm">
                                      No university found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {[
                                        "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur", 
                                        "IIT Roorkee", "IIT Guwahati", "IIT Hyderabad",
                                        "IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "IIM Lucknow", 
                                        "IIM Indore", "IIM Kozhikode",
                                        "Delhi University", "Jadavpur University", "Anna University",
                                        "Banaras Hindu University", "Jawaharlal Nehru University",
                                        "BITS Pilani", "BITS Goa", "BITS Hyderabad",
                                        "NIT Trichy", "NIT Warangal", "NIT Surathkal",
                                        "Harvard University", "Yale University", "Princeton University",
                                        "Columbia University", "Brown University", "Dartmouth College",
                                        "University of Pennsylvania", "Cornell University",
                                        "Stanford University", "MIT", "Caltech", "Oxford University",
                                        "Cambridge University", "ETH Zurich", "Imperial College London",
                                        "Other"
                                      ].map(university => (
                                        <CommandItem
                                          key={university}
                                          value={university}
                                          onSelect={() => {
                                            console.log("Selected university:", university, "for entry:", entry.id);
                                            handleUniversitySelect(entry.id, university);
                                          }}
                                          className="text-white hover:bg-white/10 cursor-pointer"
                                        >
                                          {university}
                                          {university === entry.university && (
                                            <CheckCircle className="ml-auto h-4 w-4 text-white/70" />
                                          )}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      
                      {entry.university === "Other" && (
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Specify University
                          </label>
                          <div className="relative rounded-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                              <GraduationCap className="h-5 w-5 text-white/70" />
                            </div>
                            <Input
                              value={entry.otherUniversity}
                              onChange={(e) => handleOtherUniversityChange(entry.id, e.target.value)}
                              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                              placeholder="Enter university name"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEducationEntry}
                    className="w-full mt-2 border-dashed border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Education
                  </Button>
                </motion.div>
              </div>
            }
            fields={[]}
            onChange={handleChange}
          />
        );
      case 5:
        return (
          <Step
            title="Location & Career"
            description="Where are you based and what do you do?"
            fields={[
              {
                label: "Location (City, Country)",
                name: "location",
                value: formData.location,
                icon: <MapPin className="h-5 w-5 text-white/70" />,
                autoFocus: true
              },
              {
                label: "Current Role",
                name: "currentRole",
                value: formData.currentRole,
                icon: <Briefcase className="h-5 w-5 text-white/70" />
              },
              {
                label: "Current Company",
                name: "currentCompany",
                value: formData.currentCompany,
                icon: <Building className="h-5 w-5 text-white/70" />
              }
            ]}
            onChange={handleChange}
          />
        );
      case 6:
        return (
          <Step
            title="Previous Experience"
            description="Tell us about your previous companies"
            fields={[
              {
                label: "Previous Companies",
                name: "previousCompanies",
                value: formData.previousCompanies,
                icon: <Building className="h-5 w-5 text-white/70" />,
                textarea: true,
                autoFocus: true
              }
            ]}
            onChange={handleChange}
          />
        );
      case 7:
        return (
          <Step
            title="Expertise & Interests"
            description="What are you passionate about?"
            fields={[
              {
                label: "Areas of Expertise",
                name: "areasOfExpertise",
                value: formData.areasOfExpertise,
                icon: <Lightbulb className="h-5 w-5 text-white/70" />,
                textarea: true,
                autoFocus: true
              },
              {
                label: "Personal Interests",
                name: "interests",
                value: formData.interests,
                icon: <Heart className="h-5 w-5 text-white/70" />,
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
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const userProfileResult = await getUserProfile(user.uid);
        
        if (userProfileResult.success && userProfileResult.data) {
          const userData = userProfileResult.data;
          
          setFormData(prevData => ({
            ...prevData,
            fullName: userData.firstName && userData.lastName 
              ? `${userData.firstName} ${userData.lastName}` 
              : userData.displayName || prevData.fullName,
            
            email: userData.email || user.email || prevData.email,
            
            phone: userData.phone || prevData.phone,
            linkedInProfile: userData.linkedInProfile || prevData.linkedInProfile,
            workExperience: userData.workExperience || prevData.workExperience,
            location: userData.location || prevData.location,
            currentRole: userData.currentRole || prevData.currentRole,
            currentCompany: userData.currentCompany || prevData.currentCompany,
            previousCompanies: userData.previousCompanies || prevData.previousCompanies,
            areasOfExpertise: userData.areasOfExpertise || prevData.areasOfExpertise,
            interests: userData.interests || prevData.interests,
            
            educationEntries: prevData.educationEntries,
          }));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '25s' }}></div>
          <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '20s' }}></div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="text-white/70">Loading your profile...</p>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center">
            <h2 className="mt-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 animate-gradient-x">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Step {step} of {totalSteps}
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-white/80 to-white/40"
              initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={step}
              initial={{ 
                opacity: 0, 
                x: step > 1 ? -100 : 100
              }}
              animate={{ 
                opacity: 1, 
                x: 0 
              }}
              exit={{ 
                opacity: 0, 
                x: step > 1 ? 100 : -100,
                position: 'absolute' as const
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative w-full"
            >
              <Card className="w-full bg-black border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group">
                {/* Subtle gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                <CardHeader className="pb-4 relative">
                  <div className="absolute top-2 right-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={skipToEnd}
                      className="text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
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
                    className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300 disabled:opacity-30"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="relative overflow-hidden bg-black border border-white/20 text-white hover:border-white/40 transition-all duration-300 group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center">
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
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
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
    slider?: boolean;
    sliderValue?: number;
    onSliderChange?: (value: number[]) => void;
    universitySelector?: boolean;
    universitySearchOpen?: boolean;
    setUniversitySearchOpen?: (open: boolean) => void;
    universitySearchValue?: string;
    onUniversitySelect?: (value: string) => void;
  }[];
  customContent?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function Step({ title, description, fields, customContent, onChange }: StepProps) {
  const universities = [
    "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur", 
    "IIT Roorkee", "IIT Guwahati", "IIT Hyderabad",
    "IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "IIM Lucknow", 
    "IIM Indore", "IIM Kozhikode",
    "Delhi University", "Jadavpur University", "Anna University",
    "Banaras Hindu University", "Jawaharlal Nehru University",
    "BITS Pilani", "BITS Goa", "BITS Hyderabad",
    "NIT Trichy", "NIT Warangal", "NIT Surathkal",
    "Harvard University", "Yale University", "Princeton University",
    "Columbia University", "Brown University", "Dartmouth College",
    "University of Pennsylvania", "Cornell University",
    "Stanford University", "MIT", "Caltech", "Oxford University",
    "Cambridge University", "ETH Zurich", "Imperial College London",
    "Other"
  ];
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.h3 
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
          {title}
        </motion.h3>
        <p className="text-sm text-white/60 mt-1">{description}</p>
      </div>
      
      {customContent ? (
        customContent
      ) : (
        <div className="space-y-5">
          {fields.map((field) => (
            <motion.div 
              key={field.name} 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: fields.indexOf(field) * 0.1 }}
            >
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-white/80"
              >
                {field.label}
              </label>
              <div className="relative rounded-md group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/50 group-hover:text-white/80 transition-colors duration-300">
                  {field.icon}
                </div>
                
                {field.universitySelector ? (
                  <div className="pl-10">
                    <Popover 
                      open={field.universitySearchOpen} 
                      onOpenChange={field.setUniversitySearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={field.universitySearchOpen}
                          className="w-full justify-between border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                          {field.value ? field.value : "Select university..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                        <Command className="bg-transparent">
                          <CommandInput 
                            placeholder="Search university..." 
                            className="text-white placeholder:text-white/30 h-9 border-b border-white/10"
                          />
                          <CommandList className="max-h-[300px] overflow-auto">
                            <CommandEmpty className="text-white/60 py-6 text-center text-sm">
                              No university found.
                            </CommandEmpty>
                            <CommandGroup>
                              {universities
                                .filter(university => {
                                  const searchTerm = field.universitySearchValue?.toLowerCase() || '';
                                  if (!searchTerm) return true;
                                  return university.toLowerCase().includes(searchTerm);
                                })
                                .map(university => (
                                  <CommandItem
                                    key={university}
                                    value={university}
                                    onSelect={() => {
                                      console.log("Selected university:", university);
                                      field.onUniversitySelect?.(university);
                                    }}
                                    className="text-white hover:bg-white/10 cursor-pointer"
                                  >
                                    {university}
                                    {university === field.value && (
                                      <CheckCircle className="ml-auto h-4 w-4 text-white/70" />
                                    )}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : field.slider ? (
                  <div className="pl-10 pt-6 pb-8">
                    <div className="flex flex-col space-y-6 relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 z-0"></div>
                      
                      <div className="relative z-10">
                        <Slider
                          id={field.name}
                          name={field.name}
                          value={[field.sliderValue || 0]}
                          min={0}
                          max={40}
                          step={1}
                          onValueChange={field.onSliderChange}
                          className="w-full"
                        />
                        
                        {/* Custom track markers */}
                        <div className="w-full flex justify-between mt-2 px-0.5">
                          {[0, 10, 20, 30, 40].map((marker) => (
                            <div 
                              key={marker} 
                              className={`h-1 w-0.5 bg-white/30 ${marker <= (field.sliderValue || 0) ? 'bg-white/70' : 'bg-white/20'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-white/40 font-light tracking-wider">BEGINNER</div>
                        <motion.div 
                          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/80"
                          initial={{ scale: 0.95, opacity: 0.9 }}
                          animate={{ 
                            scale: [0.95, 1.05, 1],
                            opacity: [0.9, 1, 1]
                          }}
                          transition={{ 
                            duration: 0.5,
                            times: [0, 0.5, 1],
                            ease: "easeOut",
                          }}
                          key={field.sliderValue || 0}
                        >
                          {field.sliderValue || 0} {(field.sliderValue || 0) === 1 ? 'year' : 'years'}
                        </motion.div>
                        <div className="text-xs text-white/40 font-light tracking-wider">EXPERT</div>
                      </div>
                      
                      {/* Experience level indicator */}
                      <div className="w-full pt-2">
                        <div className="text-xs text-white/60 font-medium mb-1 text-center">
                          {(field.sliderValue || 0) <= 2 ? 'Entry Level' : 
                           (field.sliderValue || 0) <= 5 ? 'Junior' :
                           (field.sliderValue || 0) <= 10 ? 'Mid-Level' :
                           (field.sliderValue || 0) <= 15 ? 'Senior' :
                           (field.sliderValue || 0) <= 25 ? 'Expert' : 'Master'}
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-white/60 via-white/80 to-white/60"
                            initial={{ width: `${((field.sliderValue || 0) / 40) * 100}%` }}
                            animate={{ width: `${((field.sliderValue || 0) / 40) * 100}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <style jsx global>{`
                      /* Slider Track Styling */
                      [data-radix-slider-thumb-wrapper] {
                        height: 20px;
                        width: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      }
                      
                      /* Slider Thumb Styling */
                      [data-radix-slider-thumb] {
                        height: 20px !important;
                        width: 20px !important;
                        background: black !important;
                        border: 2px solid rgba(255, 255, 255, 0.8) !important;
                        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
                        transition: all 0.2s ease !important;
                        position: relative;
                      }
                      
                      /* Thumb Hover Effect */
                      [data-radix-slider-thumb]:hover {
                        transform: scale(1.2) !important;
                        border-color: white !important;
                        box-shadow: 0 0 15px rgba(255, 255, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
                      }
                      
                      /* Thumb Active Effect */
                      [data-radix-slider-thumb]:active {
                        transform: scale(1.1) !important;
                        background: rgba(0, 0, 0, 0.9) !important;
                        border-color: white !important;
                      }
                      
                      /* Slider Track */
                      [data-radix-slider-track] {
                        height: 4px !important;
                        background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
                        border-radius: 2px !important;
                      }
                      
                      /* Slider Range */
                      [data-radix-slider-range] {
                        background: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)) !important;
                        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
                      }
                      
                      /* Add a glow effect on hover */
                      [data-radix-slider-root]:hover [data-radix-slider-range] {
                        background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8)) !important;
                        box-shadow: 0 0 15px rgba(255, 255, 255, 0.3) !important;
                      }
                    `}</style>
                  </div>
                ) : field.textarea ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onChange={onChange}
                    className="block w-full rounded-md border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20 hover:border-white/20 transition-all duration-300 [&:not(:placeholder-shown)]:bg-white/5 [&:not(:placeholder-shown)]:text-white"
                    rows={3}
                    autoFocus={field.autoFocus}
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onChange={onChange}
                    className="block w-full rounded-md border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20 hover:border-white/20 transition-all duration-300 [&:not(:placeholder-shown)]:bg-white/5 [&:not(:placeholder-shown)]:text-white"
                    autoFocus={field.autoFocus}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
