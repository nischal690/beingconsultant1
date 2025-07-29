"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Add a short delay to allow Firebase to check for existing authentication cookies
    // from other subdomains before deciding to redirect
    if (!loading) {
      const timer = setTimeout(() => {
        setAuthChecked(true)
        if (!user) {
          console.log("No authenticated user found after delay, redirecting to login")
          router.push("/auth/login")
        }
      }, 1000) // 1 second delay to check for cross-domain cookies
      
      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  // Show nothing while loading or checking authentication
  if (loading || (!user && (!authChecked || loading))) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-black dark:border-white"></div>
      </div>
    )
  }

  // If authenticated, show the children
  return <>{children}</>
}
