"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2, Mail, Apple } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth-context"
import { createUserProfile } from "@/lib/firebase/firestore"
import { toast } from "sonner"
import { auth } from "@/lib/firebase/config"
import { getUserProfile } from "@/lib/firebase/firestore"
import { scheduleFollowupEmail } from "@/lib/mailchimp/schedule-followup"
import { isBCPlusMember } from "@/lib/utils/bc-plus-members"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()
  const { signUp, signInWithGoogle, signInWithApple, user, loading } = useAuth()
  
  // Check for existing authentication from shared cookies
  useEffect(() => {
    // Wait for auth to initialize and check for existing user
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          console.log("User already authenticated via shared cookies, redirecting")
          checkProfileAndRoute(user.uid)
        }
        setCheckingAuth(false)
      }, 1000) // Short delay to ensure Firebase has checked auth state
      
      return () => clearTimeout(timer)
    }
  }, [user, loading])
  
  // Check if user has completed LinkedIn profile and route accordingly
  const checkProfileAndRoute = async (userId: string) => {
    try {
      const userProfileResult = await getUserProfile(userId)
      
      if (userProfileResult.success && 
          userProfileResult.data && 
          userProfileResult.data.linkedInProfile && 
          userProfileResult.data.linkedInProfile.trim() !== '') {
        // LinkedIn profile exists, route to dashboard
        router.push("/dashboard")
      } else {
        // LinkedIn profile doesn't exist or is empty, route to onboarding
        router.push("/onboarding")
      }
    } catch (error) {
      console.error("Error checking user profile:", error)
      // Default to onboarding in case of error
      router.push("/onboarding")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user types
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setVerificationSent(false)

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      // Create user with Firebase (this now sends verification email automatically)
      await signUp(formData.email, formData.password)
      
      // Get the current user directly from Firebase auth
      const currentUser = auth.currentUser
      
      if (currentUser) {
        // Check if email is in BC Plus members list
        const isMember = isBCPlusMember(formData.email);
        
        // Create user profile in Firestore
        await createUserProfile(currentUser.uid, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          displayName: `${formData.firstName} ${formData.lastName}`,
          emailVerified: false,
          isMember: isMember // Set isMember flag based on email check
        })
        
        // Show success message if they're a BC Plus member
        if (isMember) {
          toast.success("Welcome BC Plus Member! Your premium access has been activated.");
        }
        
        // Schedule follow-up email via Mailchimp (24 hours later)
        await scheduleFollowupEmail({
          userId: currentUser.uid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        })
        
        // Set verification sent state to true
        setVerificationSent(true)
        toast.success("Account created! Please verify your email before proceeding.")
        
        // Redirect to verification page after a short delay
        setTimeout(() => {
          router.push("/auth/verify")
        }, 2000)
      }
      
      setIsLoading(false)
    } catch (error: any) {
      console.error("Signup error:", error)
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use")
      } else {
        setError(error.message || "Failed to create account")
      }
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      
      // Check if user has LinkedIn profile already
      const currentUser = auth.currentUser
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.uid)
        
        // Check if email is in BC Plus members list
        const isMember = currentUser.email ? isBCPlusMember(currentUser.email) : false;
        
        // Update user profile with isMember flag if they're in the list
        if (isMember && currentUser.email) {
          await createUserProfile(currentUser.uid, {
            email: currentUser.email,
            isMember: true
          });
          
          toast.success("Welcome BC Plus Member! Your premium access has been activated.");
        }
        
        // Schedule follow-up email via Mailchimp (24 hours later)
        await scheduleFollowupEmail({
          userId: currentUser.uid,
          email: currentUser.email || '',
          firstName: currentUser.displayName ? currentUser.displayName.split(' ')[0] : '',
          lastName: currentUser.displayName ? currentUser.displayName.split(' ').slice(1).join(' ') : ''
        })
        
        if (userProfile.success && userProfile.data && userProfile.data.linkedInProfile) {
          toast.success("Signed in with Google!")
          router.push("/dashboard")
        } else {
          toast.success("Signed in with Google!")
          router.push("/onboarding")
        }
      } else {
        toast.success("Signed in with Google!")
        router.push("/onboarding")
      }
    } catch (error) {
      console.error("Google sign in error:", error)
      setError("Failed to sign in with Google")
      setIsLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithApple()
      
      // Check if user has LinkedIn profile already
      const currentUser = auth.currentUser
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.uid)
        
        // Check if email is in BC Plus members list
        const isMember = currentUser.email ? isBCPlusMember(currentUser.email) : false;
        
        // Update user profile with isMember flag if they're in the list
        if (isMember && currentUser.email) {
          await createUserProfile(currentUser.uid, {
            email: currentUser.email,
            isMember: true
          });
          
          toast.success("Welcome BC Plus Member! Your premium access has been activated.");
        }
        
        // Schedule follow-up email via Mailchimp (24 hours later)
        await scheduleFollowupEmail({
          userId: currentUser.uid,
          email: currentUser.email || '',
          firstName: currentUser.displayName ? currentUser.displayName.split(' ')[0] : '',
          lastName: currentUser.displayName ? currentUser.displayName.split(' ').slice(1).join(' ') : ''
        })
        
        if (userProfile.success && userProfile.data && userProfile.data.linkedInProfile) {
          toast.success("Signed in with Apple!")
          router.push("/dashboard")
        } else {
          toast.success("Signed in with Apple!")
          router.push("/onboarding")
        }
      } else {
        toast.success("Signed in with Apple!")
        router.push("/onboarding")
      }
    } catch (error) {
      console.error("Apple sign in error:", error)
      setError("Failed to sign in with Apple")
      setIsLoading(false)
    }
  }

  // Show loading spinner while checking authentication
  if (loading || checkingAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black bg-gradient-to-br from-black to-gray-900">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-cover bg-center" style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/signin_bg.webp?alt=media&token=5233b35e-bea5-4b8b-98f6-abccf45a7125')" }}>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-black/30 backdrop-blur-sm">
        <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
          <Button variant="ghost" className="gap-1 text-white hover:bg-black/40">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="mx-auto w-full max-w-md space-y-6 bg-black bg-opacity-80 p-8 rounded-2xl shadow-2xl border border-gray-800 backdrop-filter backdrop-blur-lg">
          <div className="space-y-2 text-center text-white">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-300">Create an account to get started</p>
          </div>
          <div className="space-y-4 text-white">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {verificationSent && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="font-medium">Verification email sent!</p>
                <p className="text-sm mt-1">Please check your inbox and verify your email address before continuing.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    required 
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    required 
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  placeholder="name@example.com" 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  required 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  required 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-300">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-white hover:bg-gray-800" 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-white hover:bg-gray-800" 
                onClick={handleAppleSignIn}
                disabled={isLoading}
              >
                <Apple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
