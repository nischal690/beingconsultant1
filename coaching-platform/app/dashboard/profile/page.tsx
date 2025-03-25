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
  X
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
}

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [editMode, setEditMode] = useState(false)
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
    interests: ""
  })

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

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // If we're exiting edit mode, save changes
      handleSaveProfile();
    }
    setEditMode(!editMode);
  };

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
        education: profileData.educationEntries.map(entry => ({
          level: entry.level,
          university: entry.university === "Other" ? entry.otherUniversity : entry.university
        })),
        location: profileData.location,
        currentRole: profileData.currentRole,
        currentCompany: profileData.currentCompany,
        previousCompanies: profileData.previousCompanies,
        areasOfExpertise: profileData.areasOfExpertise,
        interests: profileData.interests
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
          if (userData.education && userData.education.length > 0) {
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
            interests: userData.interests || ""
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
    <div className="container py-5 bg-black text-white min-h-screen">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="text-white/70">Loading your profile...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Profile</h1>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <Button 
              onClick={toggleEditMode} 
              variant="outline" 
              className={cn(
                "border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300",
                editMode && "bg-white/10 border-white/30"
              )}
            >
              {editMode ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              {/* Profile card */}
              <Card className="border-white/10 bg-black shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative group mb-4">
                      <Avatar className="w-24 h-24 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
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
                    
                    <h2 className="text-xl font-semibold mt-2">{profileData.fullName}</h2>
                    <p className="text-gray-400 mt-1">{profileData.currentRole}</p>
                    
                    {profileData.currentCompany && (
                      <Badge className="mt-2 bg-zinc-800 text-white hover:bg-zinc-700">
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
                    <Progress value={profileCompletion} className="h-2" />
                  </div>
                  
                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <p className="text-xs text-gray-400">Work Experience</p>
                      <p className="text-lg font-semibold">{profileData.workExperience} Years</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <p className="text-xs text-gray-400">Education</p>
                      <p className="text-lg font-semibold">{profileData.educationEntries.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Contact information */}
              <Card className="border-white/10 bg-black shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
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
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
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
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Linkedin className="h-5 w-5 text-white/70" />
                    {editMode ? (
                      <Input
                        name="linkedInProfile"
                        value={profileData.linkedInProfile}
                        onChange={handleInputChange}
                        className="bg-transparent border-white/10 focus:border-white/30"
                        placeholder="LinkedIn Profile URL"
                      />
                    ) : (
                      <p className="font-medium">{profileData.linkedInProfile || "Not provided"}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
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
            
            {/* Middle and right columns */}
            <div className="md:col-span-2 space-y-6">
              {/* Tabs for different sections */}
              <Tabs defaultValue="personal" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 bg-black border border-white/10">
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
                  <Card className="border-white/10 bg-black shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Personal Information</CardTitle>
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
                            <p className="p-2 bg-white/5 rounded-md">{profileData.fullName}</p>
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
                            <div className="p-3 bg-white/5 rounded-md">
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
                  <Card className="border-white/10 bg-black shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Professional Information</CardTitle>
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
                            <p className="p-2 bg-white/5 rounded-md">{profileData.currentRole || "Not provided"}</p>
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
                            <p className="p-2 bg-white/5 rounded-md">{profileData.currentCompany || "Not provided"}</p>
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
                            <p className="p-2 bg-white/5 rounded-md">{profileData.workExperience} years</p>
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
                            <div className="p-3 bg-white/5 rounded-md">
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
                            <div className="p-3 bg-white/5 rounded-md">
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
                  <Card className="border-white/10 bg-black shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium">Education</CardTitle>
                        {editMode && (
                          <Button 
                            onClick={addEducationEntry} 
                            variant="outline" 
                            size="sm"
                            className="border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                          >
                            Add Education
                          </Button>
                        )}
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
                                      <Label className="text-white/80 mb-2 block">Education Level</Label>
                                      <div className="flex space-x-4">
                                        {["Undergraduate", "Postgraduate"].map((level) => (
                                          <Button
                                            key={level}
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleEducationLevelChange(entry.id, level)}
                                            className={cn(
                                              "border-white/10 text-white",
                                              entry.level === level 
                                                ? "bg-white/20 border-white/30" 
                                                : "bg-white/5 hover:bg-white/10 hover:border-white/20"
                                            )}
                                          >
                                            {level}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-white/80 mb-2 block">University</Label>
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
                                            className="w-full justify-between border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20"
                                          >
                                            {entry.university ? entry.university : "Select university..."}
                                            <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                                          <div className="p-2">
                                            <Input
                                              placeholder="Search university..."
                                              className="bg-white/5 border-white/10 focus:border-white/30"
                                            />
                                            <div className="mt-2 max-h-[200px] overflow-auto">
                                              {universities.map((university) => (
                                                <div
                                                  key={university}
                                                  onClick={() => handleUniversitySelect(entry.id, university)}
                                                  className={cn(
                                                    "p-2 cursor-pointer rounded-md",
                                                    university === entry.university 
                                                      ? "bg-white/20 text-white" 
                                                      : "text-white/80 hover:bg-white/10"
                                                  )}
                                                >
                                                  {university}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
