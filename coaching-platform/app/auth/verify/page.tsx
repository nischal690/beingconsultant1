"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth-context"
import { updateUserProfile } from "@/lib/firebase/firestore"
import { toast } from "sonner"

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { user, sendVerificationEmail } = useAuth()

  // Check if email is verified
  const checkEmailVerification = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    // Force refresh the user to get the latest verification status
    try {
      await user.reload()
      setIsVerified(user.emailVerified)
      
      // If verified, update the user profile in Firestore
      if (user.emailVerified) {
        await updateUserProfile(user.uid, {
          emailVerified: true
        })
      }
    } catch (error) {
      console.error("Error checking verification status:", error)
      toast.error("Failed to check verification status")
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    checkEmailVerification()
  }, [user])

  const handleResendVerification = async () => {
    if (!user) return
    
    setIsRefreshing(true)
    try {
      await sendVerificationEmail()
      toast.success("Verification email sent! Please check your inbox.")
    } catch (error) {
      console.error("Error sending verification email:", error)
      toast.error("Failed to send verification email")
    }
    setIsRefreshing(false)
  }

  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    await checkEmailVerification()
    setIsRefreshing(false)
  }

  const handleContinue = () => {
    router.push("/onboarding")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Checking verification status</CardTitle>
            <CardDescription>Please wait while we check your email verification status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Not signed in</CardTitle>
            <CardDescription>You need to be signed in to verify your email</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => router.push("/auth/signin")}>
              Sign In
            </Button>
            <Button variant="outline" onClick={() => router.push("/auth/signup")}>
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {isVerified 
              ? "Your email has been successfully verified" 
              : "Your email address needs to be verified before you can continue"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 py-6">
          {isVerified ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center text-lg font-medium">
                Thank you for verifying your email address
              </p>
              <p className="text-center text-sm text-gray-500">
                You can now continue to set up your profile
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-center text-lg font-medium">
                Your email address is not verified yet
              </p>
              <p className="text-center text-sm text-gray-500">
                Please check your inbox for a verification link. If you can't find it, you can resend the verification email.
              </p>
              <div className="flex gap-4 mt-4">
                <Button onClick={handleResendVerification} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
                <Button variant="outline" onClick={handleRefreshStatus} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {isVerified ? (
            <Button onClick={handleContinue}>
              Continue to Onboarding
            </Button>
          ) : (
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
