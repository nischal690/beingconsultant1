"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2, Mail, Apple } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth-context"
import { toast } from "sonner"
import { getUserProfile } from "@/lib/firebase/firestore"
import { FirebaseError } from "firebase/app"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn, signInWithGoogle, signInWithApple, user } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user types
    if (error) setError("")
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: checked
    }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signIn(formData.email, formData.password)
      toast.success("Signed in successfully!")
      
      // Wait a moment for the user state to update
      setTimeout(() => {
        if (user && user.uid) {
          checkProfileAndRoute(user.uid)
        } else {
          router.push("/onboarding")
        }
      }, 500)
    } catch (error: unknown) {
      console.error("Login error:", error)
      const firebaseError = error as FirebaseError
      if (firebaseError.code === "auth/invalid-credential") {
        setError("Invalid email or password")
      } else if (firebaseError.code === "auth/user-not-found") {
        setError("User not found")
      } else if (firebaseError.code === "auth/wrong-password") {
        setError("Incorrect password")
      } else {
        setError(
          error instanceof Error ? error.message : "Failed to sign in"
        )
      }
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      toast.success("Signed in with Google!")
      
      // Wait a moment for the user state to update
      setTimeout(() => {
        if (user && user.uid) {
          checkProfileAndRoute(user.uid)
        } else {
          router.push("/onboarding")
        }
      }, 500)
    } catch (error: unknown) {
      console.error("Google sign in error:", error)
      setError("Failed to sign in with Google")
      setIsLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithApple()
      toast.success("Signed in with Apple!")
      
      // Wait a moment for the user state to update
      setTimeout(() => {
        if (user && user.uid) {
          checkProfileAndRoute(user.uid)
        } else {
          router.push("/onboarding")
        }
      }, 500)
    } catch (error: unknown) {
      console.error("Apple sign in error:", error)
      setError("Failed to sign in with Apple")
      setIsLoading(false)
    }
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
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-300">Enter your credentials to access your account</p>
          </div>
          <div className="space-y-4 text-white">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/reset-password" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  required 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign In"
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
                className="border-gray-700 text-white hover:bg-gray-800 w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-700 text-white hover:bg-gray-800 w-full"
                onClick={handleAppleSignIn}
                disabled={isLoading}
              >
                <Apple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
