"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelled() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  
  // Auto-redirect after countdown
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, countdown * 1000)
    
    const interval = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [router])
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Pulsing radial gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-white/5 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white/3 animate-pulse-slower"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Gradient borders */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="p-8 rounded-xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)] relative overflow-hidden"
        >
          {/* Card inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
          
          {/* Top highlight border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          {/* Bottom highlight border */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Content */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.2 
                  }}
                >
                  <X className="h-10 w-10 text-white/80" strokeWidth={1.5} />
                </motion.div>
              </div>
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center border border-white/20"
              >
                <AlertCircle className="h-4 w-4 text-white" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <motion.h1 
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-gradient-x"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Payment Cancelled
              </motion.h1>
              
              <motion.p 
                className="text-white/70 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Your payment process was cancelled. No charges have been made to your account.
              </motion.p>
            </div>
            
            <motion.div 
              className="w-full space-y-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link href="/dashboard" passHref>
                <Button 
                  className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 group hover:-translate-y-[2px] shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/10 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Dashboard
                  </div>
                </Button>
              </Link>
              
              <div className="text-center text-white/40 text-sm">
                Auto-redirecting in <span className="text-white font-medium">{countdown}</span> seconds
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
