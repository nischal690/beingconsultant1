"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock, Users } from "lucide-react"

const UpcomingWebinars = () => {
  // Mock data for webinars - in a real app, this would come from an API
  const webinars = [
    {
      id: 1,
      title: "Office Hours with Gaurav Bhosle",
      date: "22 MAR",
      time: "8:00 PM - 9:00 PM GMT+5:30",
      description: "Join our weekly office hours where Gaurav Bhosle answers your questions about consulting interviews, case preparation, and career transitions. Get personalized advice and insights from an experienced coach.",
      participants: "Limited to 20 attendees",
      platform: "Zoom",
      isFree: true,
      spotsLeft: "Limited spots available",
      image: "/placeholder.jpg"
    },
    {
      id: 2,
      title: "Case Interview Mastery Workshop",
      date: "25 MAR",
      time: "7:00 PM - 8:30 PM GMT+5:30",
      description: "Deep dive into advanced case interview techniques with practical examples and live practice sessions. Learn frameworks, structuring approaches, and common pitfalls to avoid.",
      participants: "Limited to 15 attendees",
      platform: "Zoom",
      isFree: false,
      price: "$49",
      spotsLeft: "5 spots left",
      image: "/placeholder.jpg"
    },
    {
      id: 3,
      title: "Resume Building for Consulting Roles",
      date: "28 MAR",
      time: "6:30 PM - 7:30 PM GMT+5:30",
      description: "Learn how to craft a compelling consulting resume that highlights your achievements and stands out to recruiters. Includes templates and real examples.",
      participants: "Limited to 25 attendees",
      platform: "Zoom",
      isFree: true,
      spotsLeft: "15 spots left",
      image: "/placeholder.jpg"
    }
  ]

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Webinars</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Join our expert-led webinars to enhance your consulting skills
          </p>
        </div>
        <Button className="relative overflow-hidden group font-medium self-start">
          <Calendar className="mr-2 h-4 w-4 relative z-10" />
          <span className="relative z-10">Add to Calendar</span>
        </Button>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webinars.map((webinar) => (
          <Card key={webinar.id} className="bg-white dark:bg-black overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-black/5 dark:border-white/5">
            {/* Image Section */}
            <div className="relative h-48 bg-gradient-to-br from-black/80 to-black/60 dark:from-white/10 dark:to-white/5">
              <div className="absolute inset-0 bg-[url('/placeholder.jpg')] opacity-20 mix-blend-overlay"></div>
              
              {/* Date badge */}
              <div className="absolute top-4 left-4 z-20 flex flex-col items-center bg-white p-2 rounded-lg shadow-xl border border-black/10 backdrop-blur-sm">
                <span className="text-xl font-bold text-black">{webinar.date.split(" ")[0]}</span>
                <span className="text-xs font-medium text-black/70">{webinar.date.split(" ")[1]}</span>
              </div>
              
              {/* Time badge */}
              <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 bg-white rounded-full shadow-lg border border-black/10 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-black" />
                  <p className="text-xs font-medium text-black">{webinar.time}</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-black/10 text-black text-xs font-medium rounded-full">Webinar</span>
                {webinar.isFree ? (
                  <span className="px-2.5 py-0.5 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">Free</span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 text-xs font-medium rounded-full">{webinar.price}</span>
                )}
              </div>

              <h3 className="text-lg font-bold text-black dark:text-white mb-2">{webinar.title}</h3>
              
              <p className="text-sm text-black/70 dark:text-white/70 mb-4 line-clamp-2">
                {webinar.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
                    <Users className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{webinar.participants}</p>
                    <p className="text-sm text-green-500">{webinar.spotsLeft}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/10">
                <Button className="w-full relative overflow-hidden group bg-black text-white dark:bg-white dark:text-black">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Register Now
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default UpcomingWebinars
