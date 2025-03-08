"use client"

import { useEffect, useState } from "react"

export function useIsMobile() {
  // Use undefined as initial state to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // This will only run on the client after hydration is complete
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add event listener
    window.addEventListener("resize", checkIsMobile)

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  // Return undefined during SSR, and the actual value on client
  return isMobile
}
