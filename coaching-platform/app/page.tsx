"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 md:px-6 bg-white">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {/* Text removed */}
        </Link>
        <nav className="ml-auto flex gap-6">
          {/* Coaching Dropdown */}
          <div className="relative"
               onMouseEnter={() => setActiveDropdown('coaching')}
               onMouseLeave={() => setActiveDropdown(null)}>
            <div className={`flex items-center gap-1 cursor-pointer py-2 transition-colors duration-200 ${activeDropdown === 'coaching' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
              <span className="font-medium">Coaching</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            {activeDropdown === 'coaching' && (
              <div className="absolute left-0 top-full z-[100] w-[600px] bg-white shadow-lg rounded-md border animate-in fade-in slide-in-from-top-5 duration-300">
                <div className="flex">
                  <div className="flex-1 p-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">TOOLKITS & PRODUCTS</h3>
                        <ul className="space-y-2">
                          <li><Link href="/coaching/personality-assessment" className="text-sm hover:text-blue-600">Personality Assessment</Link></li>
                          <li><Link href="/coaching/cheatsheet" className="text-sm hover:text-blue-600">Cheatsheet</Link></li>
                          <li><Link href="/coaching/meditation" className="text-sm hover:text-blue-600">Meditation</Link></li>
                          <li><Link href="/coaching/more" className="text-sm text-gray-500 hover:text-blue-600">more →</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">MASTERCLASSES</h3>
                        <ul className="space-y-2">
                          <li><Link href="/coaching/case-cracking-bundle" className="text-sm hover:text-blue-600">Case Cracking Bundle</Link></li>
                          <li><Link href="/coaching/consulting-cv-masterclass" className="text-sm hover:text-blue-600">Consulting CV Masterclass</Link></li>
                          <li><Link href="/coaching/fit-interview-masterclass" className="text-sm hover:text-blue-600">FIT Interview Masterclass</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">ARTICLES & BLOGS</h3>
                        <ul className="space-y-2">
                          <li><Link href="/coaching/free-resources" className="text-sm hover:text-blue-600">Free resources</Link></li>
                          <li><Link href="/coaching/premium-resources" className="text-sm hover:text-blue-600">Premium resources</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="w-[180px] bg-gray-100 p-4 flex items-center justify-center">
                    <img 
                      src="/placeholder.svg?height=120&width=120" 
                      alt="Coaching Resources" 
                      className="rounded-lg object-cover" 
                      width={120} 
                      height={120}
                    />
                  </div>
                </div>
                <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Read about article</span>
                  <span className="text-sm text-blue-600">→</span>
                </div>
              </div>
            )}
          </div>

          {/* Practice with AI Coach Dropdown */}
          <div className="relative"
               onMouseEnter={() => setActiveDropdown('practice')}
               onMouseLeave={() => setActiveDropdown(null)}>
            <div className={`flex items-center gap-1 cursor-pointer py-2 transition-colors duration-200 ${activeDropdown === 'practice' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
              <span className="font-medium">Practice with AI Coach</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            {activeDropdown === 'practice' && (
              <div className="absolute left-0 top-full z-[100] w-[600px] bg-white shadow-lg rounded-md border animate-in fade-in slide-in-from-top-5 duration-300">
                <div className="flex">
                  <div className="flex-1 p-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">TOOLKITS & PRODUCTS</h3>
                        <ul className="space-y-2">
                          <li><Link href="/practice/interview-simulator" className="text-sm hover:text-blue-600">Interview Simulator</Link></li>
                          <li><Link href="/practice/case-practice" className="text-sm hover:text-blue-600">Case Practice</Link></li>
                          <li><Link href="/practice/feedback-analysis" className="text-sm hover:text-blue-600">Feedback Analysis</Link></li>
                          <li><Link href="/practice/more" className="text-sm text-gray-500 hover:text-blue-600">more →</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">MASTERCLASSES</h3>
                        <ul className="space-y-2">
                          <li><Link href="/practice/ai-coach-bundle" className="text-sm hover:text-blue-600">AI Coach Bundle</Link></li>
                          <li><Link href="/practice/consulting-toolkit" className="text-sm hover:text-blue-600">Consulting Toolkit</Link></li>
                          <li><Link href="/practice/27gk-consultant-mastery" className="text-sm hover:text-blue-600">27GK Consultant Mastery</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">ARTICLES & BLOGS</h3>
                        <ul className="space-y-2">
                          <li><Link href="/practice/free-resources" className="text-sm hover:text-blue-600">Free resources</Link></li>
                          <li><Link href="/practice/premium-resources" className="text-sm hover:text-blue-600">Premium resources</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="w-[180px] bg-gray-100 p-4 flex items-center justify-center">
                    <img 
                      src="/placeholder.svg?height=120&width=120" 
                      alt="AI Coach Resources" 
                      className="rounded-lg object-cover" 
                      width={120} 
                      height={120}
                    />
                  </div>
                </div>
                <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Read about article</span>
                  <span className="text-sm text-blue-600">→</span>
                </div>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="relative"
               onMouseEnter={() => setActiveDropdown('resources')}
               onMouseLeave={() => setActiveDropdown(null)}>
            <div className={`flex items-center gap-1 cursor-pointer py-2 transition-colors duration-200 ${activeDropdown === 'resources' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
              <span className="font-medium">Resources</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            {activeDropdown === 'resources' && (
              <div className="absolute left-0 top-full z-[100] w-[600px] bg-white shadow-lg rounded-md border animate-in fade-in slide-in-from-top-5 duration-300">
                <div className="flex">
                  <div className="flex-1 p-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">TOOLKITS & PRODUCTS</h3>
                        <ul className="space-y-2">
                          <li><Link href="/resources/personality-assessment" className="text-sm hover:text-blue-600">Personality Assessment</Link></li>
                          <li><Link href="/resources/cheatsheet" className="text-sm hover:text-blue-600">Cheatsheet</Link></li>
                          <li><Link href="/resources/meditation" className="text-sm hover:text-blue-600">Meditation</Link></li>
                          <li><Link href="/resources/more" className="text-sm text-gray-500 hover:text-blue-600">more →</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">MASTERCLASSES</h3>
                        <ul className="space-y-2">
                          <li><Link href="/resources/case-cracking-bundle" className="text-sm hover:text-blue-600">Case Cracking Bundle</Link></li>
                          <li><Link href="/resources/consulting-cv-masterclass" className="text-sm hover:text-blue-600">Consulting CV Masterclass</Link></li>
                          <li><Link href="/resources/fit-interview-masterclass" className="text-sm hover:text-blue-600">FIT Interview Masterclass</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">ARTICLES & BLOGS</h3>
                        <ul className="space-y-2">
                          <li><Link href="/resources/free-resources" className="text-sm hover:text-blue-600">Free resources</Link></li>
                          <li><Link href="/resources/premium-resources" className="text-sm hover:text-blue-600">Premium resources</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="w-[180px] bg-gray-100 p-4 flex items-center justify-center">
                    <img 
                      src="/placeholder.svg?height=120&width=120" 
                      alt="Resources" 
                      className="rounded-lg object-cover" 
                      width={120} 
                      height={120}
                    />
                  </div>
                </div>
                <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Read about article</span>
                  <span className="text-sm text-blue-600">→</span>
                </div>
              </div>
            )}
          </div>

          {/* Stories Dropdown */}
          <div className="relative"
               onMouseEnter={() => setActiveDropdown('stories')}
               onMouseLeave={() => setActiveDropdown(null)}>
            <div className={`flex items-center gap-1 cursor-pointer py-2 transition-colors duration-200 ${activeDropdown === 'stories' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
              <span className="font-medium">Stories</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            {activeDropdown === 'stories' && (
              <div className="absolute left-0 top-full z-[100] w-[600px] bg-white shadow-lg rounded-md border animate-in fade-in slide-in-from-top-5 duration-300">
                <div className="flex">
                  <div className="flex-1 p-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">SUCCESS STORIES</h3>
                        <ul className="space-y-2">
                          <li><Link href="/stories/mbb-success" className="text-sm hover:text-blue-600">MBB Success</Link></li>
                          <li><Link href="/stories/big4-success" className="text-sm hover:text-blue-600">Big 4 Success</Link></li>
                          <li><Link href="/stories/boutique-success" className="text-sm hover:text-blue-600">Boutique Success</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">CASE STUDIES</h3>
                        <ul className="space-y-2">
                          <li><Link href="/stories/career-transition" className="text-sm hover:text-blue-600">Career Transition</Link></li>
                          <li><Link href="/stories/interview-prep" className="text-sm hover:text-blue-600">Interview Prep</Link></li>
                          <li><Link href="/stories/networking" className="text-sm hover:text-blue-600">Networking</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-3">TESTIMONIALS</h3>
                        <ul className="space-y-2">
                          <li><Link href="/stories/student-testimonials" className="text-sm hover:text-blue-600">Student Testimonials</Link></li>
                          <li><Link href="/stories/professional-testimonials" className="text-sm hover:text-blue-600">Professional Testimonials</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="w-[180px] bg-gray-100 p-4 flex items-center justify-center">
                    <img 
                      src="/placeholder.svg?height=120&width=120" 
                      alt="Success Stories" 
                      className="rounded-lg object-cover" 
                      width={120} 
                      height={120}
                    />
                  </div>
                </div>
                <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Read about article</span>
                  <span className="text-sm text-blue-600">→</span>
                </div>
              </div>
            )}
          </div>

          {/* Login/Signup buttons */}
          <div className="flex items-center gap-2 ml-4">
            <Link href="/auth/login" passHref>
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup" passHref>
              <Button>Member login</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Elevate Your Consulting Career</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Expert coaching, resources, and tools to help you succeed in the consulting world.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup" passHref>
                    <Button className="gap-1">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/ai-coach-demo" passHref>
                    <Button variant="outline">Try AI Coach Demo</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  alt="Consulting Coaching Platform"
                  className="rounded-lg object-cover"
                  width={550}
                  height={550}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
