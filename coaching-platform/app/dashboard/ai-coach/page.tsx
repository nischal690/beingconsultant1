"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Check, 
  Sparkles,
  FileText, 
  Users, 
  Clock, 
  MessageSquare
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AICoachPage() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <div className="container mx-auto space-y-10 pb-20">
      {/* AI Coach Section - Modern Black and White Aesthetic */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 animate-gradient-x">
                Your Personal AI Coach to Ace Case Interviews
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Select your Practice Mode
            </p>
            <p className="text-sm text-gray-500">
              Choose a mode that fits your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Practice Realistic Mock Case Interview with AI */}
            <motion.div
              whileHover={{ 
                y: -5, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 } 
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-3xl"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0vjZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNmgtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 rounded-3xl"></div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              
              <div className="relative p-8 backdrop-blur-sm rounded-3xl h-full flex flex-col">
                <div className="text-2xl font-bold mb-6 text-white">Practice Realistic Mock Case Interview with AI</div>
                
                <div className="flex-1 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-1">
                      <Image 
                        src="/ai-coach-portrait.jpg" 
                        alt="AI Coach Portrait" 
                        width={200} 
                        height={200}
                        className="rounded-xl object-cover w-full h-auto shadow-lg"
                      />
                    </div>
                    <div className="col-span-1">
                      <Image 
                        src="/ai-coach-charts.jpg" 
                        alt="AI Coach Charts" 
                        width={200} 
                        height={200}
                        className="rounded-xl object-cover w-full h-auto shadow-lg"
                      />
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Engage in realistic, low-latency voice interaction with slide sharing and on-demand case test introduction - perfect for real interview simulation.
                  </p>
                  
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-white" />
                      Engage in realistic, low-latency voice interaction with slide sharing and on-demand case test introduction
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-white" />
                      Get personalized Gap Analysis scorecards for every practice
                    </li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-black hover:bg-gray-900 text-white border border-white/10 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-white/5 relative overflow-hidden"
                >
                  <span className="relative z-10">Start Practice</span>
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-white/5 to-white/20 transition-all duration-300 group-hover:w-full"></span>
                </Button>
              </div>
            </motion.div>

            {/* Guided Case Interview Coaching with AI */}
            <motion.div
              whileHover={{ 
                y: -5, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 } 
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-3xl"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0vjZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6bS02IDBoLTZ2Nmg2di02em0xMi02aC02djZoNnYtNmgtNnptLTE4IDZoNnYtNmgtNnY2em0xOCAwdjZoNnYtNmgtNnptLTEyIDBoLTZ2Nmg2di02em0wIDZoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 rounded-3xl"></div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              
              <div className="relative p-8 backdrop-blur-sm rounded-3xl h-full flex flex-col">
                <div className="text-2xl font-bold mb-6 text-white">Guided Case Interview Coaching with AI</div>
                
                <div className="flex-1 mb-6">
                  <div className="mb-6">
                    <Image 
                      src="/ai-coach-laptop.jpg" 
                      alt="AI Coach Laptop" 
                      width={400} 
                      height={250}
                      className="rounded-xl object-cover w-full h-auto shadow-lg"
                    />
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Receive feedback after each interaction - perfect for candidates familiarizing themselves with the case interview format.
                  </p>
                  
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-white" />
                      Sharpen your response with guided answers, focusing on structuring thought process, and error analysis
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-white" />
                      For each stage of case interview, see the ideal response and identify any missing elements
                    </li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-black hover:bg-gray-900 text-white border border-white/10 rounded-xl group hover:-translate-y-[2px] transition-all duration-300 shadow-lg hover:shadow-white/5 relative overflow-hidden"
                >
                  <span className="relative z-10">Start Practice</span>
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-white/5 to-white/20 transition-all duration-300 group-hover:w-full"></span>
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              className="rounded-full border-white/10 text-white hover:bg-white/5 hover:text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start with a Free 15 minute session
            </Button>
            <p className="mt-4 text-sm text-gray-500 italic">
              "The Most Realistic AI Voice Case Interview Simulator, Offering Expert-Level Rehearsals"
            </p>
            <div className="mt-2 flex items-center justify-center">
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-800">
                Created by Experienced Management Consultants and AI Experts for Optimal Results
              </Badge>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Mock Case Interview Simulator: Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Structured Key Points</h4>
                  <p className="text-sm text-gray-400">Sequential key factor recall of key case facts, solutions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Tailored for Case Interviews</h4>
                  <p className="text-sm text-gray-400">Time-segmented speech recognition</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Long Conversations with Slide Sharing</h4>
                  <p className="text-sm text-gray-400">Don't end up speaking to yourself</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Customizable Interviewer Persona</h4>
                  <p className="text-sm text-gray-400">Control Guidance levels</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CSS for the gradient animation */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  )
}
