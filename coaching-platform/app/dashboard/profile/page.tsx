"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import { uploadFile, generateFilePath } from "@/lib/firebase/storage"
import { getUserProfile, updateUserProfileWithOnboarding } from "@/lib/firebase/firestore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Upload, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  Filter, 
  Heart, 
  ChevronRight,
  Info,
  MessageCircle,
  Video,
  MapPin,
  Building,
  Lightbulb,
  Linkedin,
  GraduationCap,
  CheckCircle,
  Edit,
  Save,
  X,
  Copy,
  Share2,
  Gift,
  Sparkles
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Define universities array
const universities: string[] = [
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

interface EducationEntry {
  id: string;
  level: string;
  university: string;
  otherUniversity: string;
}

interface ProfileData {
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
  referralCode: string;
}

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [editMode, setEditMode] = useState(true) // Always in edit mode
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoURL || null)
  const [universitySearchOpen, setUniversitySearchOpen] = useState<{[key: string]: boolean}>({})
  const [activeEducationId, setActiveEducationId] = useState<string | null>(null)
  const [profileCompletion, setProfileCompletion] = useState(0)
  
  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.displayName || "",
    phone: "",
    email: user?.email || "",
    linkedInProfile: "",
    workExperience: 0,
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
    interests: "",
    referralCode: ""
  })

  // Generate referral code based on user ID
  const generateReferralCode = (userId: string) => {
    if (!userId) return "";
    // Take first 6 characters of user ID and make it uppercase
    return userId.substring(0, 6).toUpperCase();
  };

  // Copy referral code to clipboard
  const copyReferralCode = () => {
    navigator.clipboard.writeText(profileData.referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  // Share referral code
  const shareReferralCode = () => {
    const shareText = `Join me on Being Consultant and get expert coaching! Use my referral code: ${profileData.referralCode} and we both earn benefits!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Being Consultant',
        text: shareText,
        url: window.location.origin,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Share text copied to clipboard!");
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = (data: ProfileData) => {
    const fields = [
      data.fullName,
      data.phone,
      data.email,
      data.linkedInProfile,
      data.workExperience > 0,
      data.educationEntries.length > 0 && data.educationEntries[0].university,
      data.location,
      data.currentRole,
      data.currentCompany,
      data.previousCompanies,
      data.areasOfExpertise,
      data.interests
    ];
    
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Handle file change for profile photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Add education entry
  const addEducationEntry = () => {
    setProfileData(prev => ({
      ...prev,
      educationEntries: [
        ...prev.educationEntries,
        {
          id: `edu-${Date.now()}-${prev.educationEntries.length}`,
          level: "Undergraduate",
          university: "",
          otherUniversity: ""
        }
      ]
    }));
  };

  // Remove education entry
  const removeEducationEntry = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.filter(entry => entry.id !== id)
    }));
  };

  // Handle education level change
  const handleEducationLevelChange = (id: string, level: string) => {
    setProfileData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.map(entry => 
        entry.id === id ? { ...entry, level } : entry
      )
    }));
  };

  // Handle university select
  const handleUniversitySelect = (id: string, university: string) => {
    setUniversitySearchOpen(prev => ({ ...prev, [id]: false }));
    
    setProfileData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.map(entry => 
        entry.id === id ? { ...entry, university } : entry
      )
    }));
  };

  // Handle other university change
  const handleOtherUniversityChange = (id: string, otherUniversity: string) => {
    setProfileData(prev => ({
      ...prev,
      educationEntries: prev.educationEntries.map(entry => 
        entry.id === id ? { ...entry, otherUniversity } : entry
      )
    }));
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle work experience change
  const handleWorkExperienceChange = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      workExperience: parseInt(value) || 0
    }));
  };

  // Edit mode is always enabled by default

  // Save profile
  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Upload new photo if selected
      let photoURL: string | undefined = user.photoURL || undefined;
      if (photoFile) {
        const path = generateFilePath(user.uid, photoFile.name, "profile");
        const result = await uploadFile(photoFile, path);
        
        if (result.success) {
          photoURL = result.url;
        } else {
          throw new Error("Failed to upload profile photo");
        }
      }

      // Update display name and photo
      await updateUserProfile(profileData.fullName, photoURL);
      
      // Update profile data in Firestore
      await updateUserProfileWithOnboarding(user.uid, {
        firstName: profileData.fullName.split(' ')[0],
        lastName: profileData.fullName.split(' ').slice(1).join(' '),
        displayName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        linkedInProfile: profileData.linkedInProfile,
        workExperience: profileData.workExperience,
        educationEntries: profileData.educationEntries.map(entry => ({
          id: entry.id,
          level: entry.level,
          university: entry.university,
          otherUniversity: entry.otherUniversity
        })),
        location: profileData.location,
        currentRole: profileData.currentRole,
        currentCompany: profileData.currentCompany,
        previousCompanies: profileData.previousCompanies,
        areasOfExpertise: profileData.areasOfExpertise,
        interests: profileData.interests,
        referralCode: profileData.referralCode
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const userProfileResult = await getUserProfile(user.uid);
        
        if (userProfileResult.success && userProfileResult.data) {
          const userData = userProfileResult.data;
          
          // Prepare education entries
          let educationEntries: EducationEntry[] = [];
          if (userData.educationEntries && userData.educationEntries.length > 0) {
            educationEntries = userData.educationEntries.map((edu: any) => ({
              id: edu.id || `edu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              level: edu.level || "Undergraduate",
              university: edu.university || "",
              otherUniversity: edu.otherUniversity || ""
            }));
          } else if (userData.education && userData.education.length > 0) {
            educationEntries = userData.education.map((edu: any, index: number) => ({
              id: `edu-${Date.now()}-${index}`,
              level: edu.level || "Undergraduate",
              university: edu.university || "",
              otherUniversity: edu.university || ""
            }));
          } else {
            educationEntries = [{
              id: `edu-${Date.now()}-0`,
              level: "Undergraduate",
              university: "",
              otherUniversity: ""
            }];
          }
          
          // Generate or retrieve referral code
          const referralCode = userData.referralCode || generateReferralCode(user.uid);
          
          // Update profile data
          const updatedProfileData = {
            fullName: userData.firstName && userData.lastName 
              ? `${userData.firstName} ${userData.lastName}` 
              : userData.displayName || user.displayName || "",
            
            email: userData.email || user.email || "",
            phone: userData.phone || "",
            linkedInProfile: userData.linkedInProfile || "",
            workExperience: userData.workExperience || 0,
            educationEntries,
            location: userData.location || "",
            currentRole: userData.currentRole || "",
            currentCompany: userData.currentCompany || "",
            previousCompanies: userData.previousCompanies || "",
            areasOfExpertise: userData.areasOfExpertise || "",
            interests: userData.interests || "",
            referralCode: referralCode
          };
          
          setProfileData(updatedProfileData);
          
          // Calculate profile completion
          setProfileCompletion(calculateProfileCompletion(updatedProfileData));
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
    <div className="container py-5 min-h-screen bg-gradient-to-br from-black via-black to-zinc-900">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="text-white/70">Loading your profile...</p>
        </div>
      ) : (
        <>
          {/* Header with subtle animation */}
          <div className="flex justify-between items-center mb-6 backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="flex items-center gap-3 relative z-10">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Profile</h1>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <Button 
              onClick={handleSaveProfile} 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-sm relative z-10"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 gap-6">
            {/* Profile section with grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - Profile and Contact Info */}
              <div>
                {/* Profile card */}
                <Card className="border-white/10 bg-black/60 shadow-xl overflow-hidden backdrop-blur-md rounded-xl hover:shadow-white/5 transition-all duration-300 group mb-6">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative group mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                        <Avatar className="w-28 h-28 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 ring-2 ring-white/5 ring-offset-2 ring-offset-black">
                          <AvatarImage src={photoPreview || ""} alt={profileData.fullName} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-black text-2xl">
                            {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : <User size={32} />}
                          </AvatarFallback>
                        </Avatar>
                        
                        {editMode && (
                          <label 
                            htmlFor="profile-photo" 
                            className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-all duration-300"
                          >
                            <Upload className="h-6 w-6" />
                            <input 
                              id="profile-photo" 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={handleFileChange} 
                            />
                          </label>
                        )}
                      </div>
                      
                      <h2 className="text-xl font-semibold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{profileData.fullName}</h2>
                      <p className="text-gray-400 mt-1">{profileData.currentRole}</p>
                      
                      {profileData.currentCompany && (
                        <Badge className="mt-2 bg-gradient-to-r from-zinc-800 to-zinc-700 text-white hover:from-zinc-700 hover:to-zinc-600">
                          {profileData.currentCompany}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Profile completion */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Profile Completion</span>
                        <span className="text-sm font-semibold">{profileCompletion}%</span>
                      </div>
                      <Progress 
                        value={profileCompletion} 
                        className="h-2 bg-white/10" 
                      />
                      <style jsx global>{`
                        .h-2.bg-white\/10 [data-state="indeterminate"] > div,
                        .h-2.bg-white\/10 > div {
                          background: linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153));
                        }
                      `}</style>
                    </div>
                    
                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-3 bg-white/5 rounded-lg text-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-white/10">
                        <p className="text-xs text-gray-400">Work Experience</p>
                        <p className="text-lg font-semibold">{profileData.workExperience} Years</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg text-center backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-white/10">
                        <p className="text-xs text-gray-400">Education</p>
                        <p className="text-lg font-semibold">{profileData.educationEntries.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact information */}
                <Card className="border-white/10 bg-black/60 shadow-xl backdrop-blur-md rounded-xl hover:shadow-white/5 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300">
                      <Mail className="h-5 w-5 text-white/70" />
                      {editMode ? (
                        <Input
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="bg-transparent border-white/10 focus:border-white/30"
                        />
                      ) : (
                        <p className="font-medium">{profileData.email}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300">
                      <Phone className="h-5 w-5 text-white/70" />
                      {editMode ? (
                        <Input
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="bg-transparent border-white/10 focus:border-white/30"
                          placeholder="Phone Number"
                        />
                      ) : (
                        <p className="font-medium">{profileData.phone || "Not provided"}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300">
                      <Linkedin className="h-5 w-5 text-white/70 flex-shrink-0" />
                      {editMode ? (
                        <Input
                          name="linkedInProfile"
                          value={profileData.linkedInProfile}
                          onChange={handleInputChange}
                          className="bg-transparent border-white/10 focus:border-white/30 text-sm"
                          placeholder="LinkedIn Profile URL"
                        />
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {profileData.linkedInProfile ? (
                              <a 
                                href={profileData.linkedInProfile} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 truncate block"
                              >
                                {profileData.linkedInProfile.replace(/^https?:\/\/(www\.)?linkedin\.com\//i, '')}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300">
                      <MapPin className="h-5 w-5 text-white/70" />
                      {editMode ? (
                        <Input
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="bg-transparent border-white/10 focus:border-white/30"
                          placeholder="Location (City, Country)"
                        />
                      ) : (
                        <p className="font-medium">{profileData.location || "Not provided"}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right section with tabs and referral */}
              <div className="md:col-span-2 space-y-6">
                {/* Tabs for different sections */}
                <Tabs defaultValue="personal" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 bg-black/60 border border-white/10 rounded-xl overflow-hidden">
                    <TabsTrigger 
                      value="personal" 
                      className={cn(
                        "data-[state=active]:bg-white/10 data-[state=active]:text-white",
                        "text-white/70"
                      )}
                    >
                      Personal
                    </TabsTrigger>
                    <TabsTrigger 
                      value="professional" 
                      className={cn(
                        "data-[state=active]:bg-white/10 data-[state=active]:text-white",
                        "text-white/70"
                      )}
                    >
                      Professional
                    </TabsTrigger>
                    <TabsTrigger 
                      value="education" 
                      className={cn(
                        "data-[state=active]:bg-white/10 data-[state=active]:text-white",
                        "text-white/70"
                      )}
                    >
                      Education
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Personal Tab */}
                  <TabsContent value="personal" className="mt-4">
                    <Card className="border-white/10 bg-black/60 shadow-xl backdrop-blur-md rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor="fullName" className="text-white/80 mb-2 block">Full Name</Label>
                            {editMode ? (
                              <Input
                                id="fullName"
                                name="fullName"
                                value={profileData.fullName}
                                onChange={handleInputChange}
                                className="bg-white/5 border-white/10 focus:border-white/30"
                              />
                            ) : (
                              <p className="p-3 bg-white/5 rounded-md border border-white/5">{profileData.fullName}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="interests" className="text-white/80 mb-2 block">Personal Interests</Label>
                            {editMode ? (
                              <Textarea
                                id="interests"
                                name="interests"
                                value={profileData.interests}
                                onChange={handleInputChange}
                                className="bg-white/5 border-white/10 focus:border-white/30 min-h-[100px]"
                                placeholder="Share your personal interests and hobbies..."
                              />
                            ) : (
                              <div className="p-3 bg-white/5 rounded-md border border-white/5">
                                {profileData.interests || "No interests provided yet."}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Professional Tab */}
                  <TabsContent value="professional" className="mt-4">
                    <Card className="border-white/10 bg-black/60 shadow-xl backdrop-blur-md rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Professional Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor="currentRole" className="text-white/80 mb-2 block">Current Role</Label>
                            {editMode ? (
                              <Input
                                id="currentRole"
                                name="currentRole"
                                value={profileData.currentRole}
                                onChange={handleInputChange}
                                className="bg-white/5 border-white/10 focus:border-white/30"
                                placeholder="Your current job title"
                              />
                            ) : (
                              <p className="p-3 bg-white/5 rounded-md border border-white/5">{profileData.currentRole || "Not provided"}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="currentCompany" className="text-white/80 mb-2 block">Current Company</Label>
                            {editMode ? (
                              <Input
                                id="currentCompany"
                                name="currentCompany"
                                value={profileData.currentCompany}
                                onChange={handleInputChange}
                                className="bg-white/5 border-white/10 focus:border-white/30"
                                placeholder="Your current company"
                              />
                            ) : (
                              <p className="p-3 bg-white/5 rounded-md border border-white/5">{profileData.currentCompany || "Not provided"}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="workExperience" className="text-white/80 mb-2 block">
                              Work Experience (Years): {profileData.workExperience}
                            </Label>
                            {editMode ? (
                              <Input
                                id="workExperience"
                                type="range"
                                min="0"
                                max="40"
                                value={profileData.workExperience}
                                onChange={(e) => handleWorkExperienceChange(e.target.value)}
                                className="accent-white w-full"
                              />
                            ) : (
                              <p className="p-3 bg-white/5 rounded-md border border-white/5">{profileData.workExperience} years</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="previousCompanies" className="text-white/80 mb-2 block">Previous Companies</Label>
                            {editMode ? (
                              <Textarea
                                id="previousCompanies"
                                name="previousCompanies"
                                value={profileData.previousCompanies}
                                onChange={handleInputChange}
                                className="bg-white/5 border-white/10 focus:border-white/30 min-h-[100px]"
                                placeholder="List your previous companies..."
                              />
                            ) : (
                              <div className="p-3 bg-white/5 rounded-md border border-white/5">
                                {profileData.previousCompanies || "No previous companies listed."}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="areasOfExpertise" className="text-white/80 mb-2 block">Areas of Expertise</Label>
                            {editMode ? (
                              <Textarea
                                id="areasOfExpertise"
                                name="areasOfExpertise"
                                value={profileData.areasOfExpertise}
                                onChange={handleInputChange}
                                className="bg-white/5 border-white/10 focus:border-white/30 min-h-[100px]"
                                placeholder="Describe your areas of expertise..."
                              />
                            ) : (
                              <div className="p-3 bg-white/5 rounded-md border border-white/5">
                                {profileData.areasOfExpertise || "No areas of expertise provided yet."}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Education Tab */}
                  <TabsContent value="education" className="mt-4">
                    <Card className="border-white/10 bg-black/60 shadow-xl backdrop-blur-md rounded-xl">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Education</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {profileData.educationEntries.length === 0 ? (
                            <p className="text-center text-white/60 py-4">No education entries yet.</p>
                          ) : (
                            profileData.educationEntries.map((entry, index) => (
                              <div key={entry.id} className="p-4 border border-white/10 rounded-lg bg-white/5 relative">
                                {editMode && profileData.educationEntries.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeEducationEntry(entry.id)}
                                    className="absolute top-2 right-2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <div className="space-y-4">
                                  {editMode ? (
                                    <>
                                       <div>
                                         <Label className="text-white/80 mb-2 block">Education</Label>
                                         <p className="text-xs text-white/60 mb-2">Example: MBA in Marketing, B.E in Computer Engineering</p>
                                         <Input
                                           value={entry.level}
                                           onChange={(e) => handleEducationLevelChange(entry.id, e.target.value)}
                                           className="bg-white/5 border-white/10 focus:border-white/30"
                                           placeholder="Your education details"
                                         />
                                       </div>
                                       <div>
                                         <Label className="text-white/80 mb-2 block">University</Label>
                                         <Input
                                           value={entry.university === "Other" ? entry.otherUniversity : entry.university}
                                           onChange={(e) => handleUniversitySelect(entry.id, e.target.value)}
                                           className="bg-white/5 border-white/10 focus:border-white/30"
                                           placeholder="Your university"
                                         />
                                       </div>
                                      
                                      {entry.university === "Other" && (
                                        <div>
                                          <Label className="text-white/80 mb-2 block">Specify University</Label>
                                          <Input
                                            value={entry.otherUniversity}
                                            onChange={(e) => handleOtherUniversityChange(entry.id, e.target.value)}
                                            className="bg-white/5 border-white/10 focus:border-white/30"
                                            placeholder="Enter university name"
                                          />
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-center space-x-2">
                                        <GraduationCap className="h-5 w-5 text-white/70" />
                                        <span className="font-medium">{entry.level}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Building className="h-5 w-5 text-white/70" />
                                        <span>
                                          {entry.university === "Other" 
                                            ? entry.otherUniversity 
                                            : entry.university || "Not specified"}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Referral program section removed */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
