import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Star, Quote, TrendingUp, Award, Briefcase } from "lucide-react";

export default function SuccessStories() {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-brand-400 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="relative grid gap-6 px-6 py-12 md:grid-cols-2 md:gap-12 md:px-10 md:py-20">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge className="inline-flex items-center rounded-full border-0 bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                Community Spotlight
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/tight">
                Success Stories That Inspire
              </h1>
              <p className="max-w-[600px] text-white/90 md:text-xl/relaxed">
                Discover how our community members transformed their consulting careers through expert coaching and dedicated practice.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-white text-primary hover:bg-white/90">
                Join Our Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Share Your Story
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative animate-slideInRight">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-secondary/20 backdrop-blur-md" />
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-tertiary/20 backdrop-blur-md" />
              <img
                src="/placeholder.svg?height=320&width=320"
                alt="Success Collage"
                className="relative z-10 rounded-lg shadow-glow object-cover"
                width={320}
                height={320}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Success Stories", value: "120+", icon: <Star className="h-5 w-5 text-brand" /> },
          { label: "Career Transitions", value: "85%", icon: <TrendingUp className="h-5 w-5 text-brand" /> },
          { label: "Salary Increases", value: "45%", icon: <Award className="h-5 w-5 text-brand" /> },
          { label: "Fortune 500 Placements", value: "60+", icon: <Briefcase className="h-5 w-5 text-brand" /> },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 border shadow-soft transition-all hover:shadow-medium">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-2 rounded-full bg-brand-50 p-2">{stat.icon}</div>
              <div className="text-center">
                <p className="text-2xl font-bold animate-countUp">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Featured Success Stories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Success Stories</h2>
          <Link href="/community/all-stories" className="flex items-center text-sm text-brand hover:underline">
            View all stories
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Stories</TabsTrigger>
            <TabsTrigger value="career-transition">Career Transition</TabsTrigger>
            <TabsTrigger value="promotion">Promotion</TabsTrigger>
            <TabsTrigger value="interview-success">Interview Success</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-8">
            {/* Grid of Success Stories */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Sarah Johnson",
                  title: "From Corporate Finance to Strategy Consulting",
                  image: "/placeholder-user.jpg",
                  content: "After 5 years in corporate finance, I wanted to transition to strategy consulting but lacked the structured approach. The coaching platform provided me with the frameworks, practice, and confidence to secure a role at a top-tier consulting firm.",
                  company: "McKinsey & Company",
                  increase: "+120% Salary",
                },
                {
                  name: "Michael Chen",
                  title: "Secured Partner Track in Record Time",
                  image: "/placeholder-user.jpg",
                  content: "The executive presence and client management coaching were game-changers for my career. I was able to demonstrate value quickly and secure partner track in just 4 years, nearly half the typical timeline.",
                  company: "Bain & Company",
                  increase: "Partner Track",
                },
                {
                  name: "Priya Sharma",
                  title: "Launched My Independent Consulting Practice",
                  image: "/placeholder-user.jpg", 
                  content: "The business development modules and mentorship helped me build the confidence to launch my own practice. Within a year, I had 4 retainer clients and a waitlist for my specialized industry expertise.",
                  company: "Independent Consultant",
                  increase: "6-Figure Practice",
                },
                {
                  name: "James Wilson",
                  title: "Mastered Case Interviews After Multiple Rejections",
                  image: "/placeholder-user.jpg",
                  content: "After being rejected by three consulting firms, I was ready to give up. The structured case interview preparation and personalized feedback helped me refine my approach. I'm now thriving at my dream consulting firm.",
                  company: "Boston Consulting Group",
                  increase: "Hired After 4th Try",
                },
                {
                  name: "Elena Rodriguez",
                  title: "Pivoted from Engineering to Technology Consulting",
                  image: "/placeholder-user.jpg",
                  content: "As a software engineer, I had the technical skills but struggled to communicate business value. This platform helped me bridge that gap and position myself as a technology consultant who speaks both languages.",
                  company: "Accenture",
                  increase: "+75% Salary",
                },
                {
                  name: "Thomas Wright",
                  title: "Built a Specialized Boutique Consulting Firm",
                  image: "/placeholder-user.jpg",
                  content: "The business scaling and team building modules were essential in helping me grow from a solo practitioner to leading a team of 15 specialized consultants serving the healthcare technology sector.",
                  company: "Wright Consulting Group",
                  increase: "15 Team Members",
                },
              ].map((story, i) => (
                <Card key={i} className="overflow-hidden transition-all hover:shadow-medium animate-fade-in" style={{animationDelay: `${i * 100}ms`}}>
                  <CardHeader className="space-y-1 p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={story.image} alt={story.name} />
                        <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{story.name}</CardTitle>
                        <CardDescription className="text-xs">{story.company}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="mb-3 flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <h3 className="mb-2 text-base font-bold">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      <Quote className="mr-1 inline h-4 w-4 translate-y-[-2px] text-brand-300" />
                      {story.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-4">
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                      {story.increase}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Read Full Story
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="career-transition">
            <div className="text-center p-12">
              <p className="text-muted-foreground">Filter-specific stories will be loaded here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="promotion">
            <div className="text-center p-12">
              <p className="text-muted-foreground">Filter-specific stories will be loaded here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="interview-success">
            <div className="text-center p-12">
              <p className="text-muted-foreground">Filter-specific stories will be loaded here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Testimonial Showcase */}
      <section className="relative rounded-xl bg-muted/30 p-8 md:p-12">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-100 opacity-50 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary/20 opacity-50 blur-3xl" />
        
        <div className="relative space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">What Our Community Says</h2>
            <p className="mx-auto mt-2 max-w-[700px] text-muted-foreground">
              Real feedback from consultants who've transformed their careers with our coaching platform.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "The structured approach to case preparation completely changed how I tackle business problems. This program was worth every penny.",
                name: "Emma Thompson",
                title: "Senior Consultant",
              },
              {
                quote: "The personalized feedback on my client presentations helped me land my biggest client to date. I'm now confident pitching to C-suite executives.",
                name: "David Nguyen",
                title: "Independent Consultant",
              },
              {
                quote: "The networking strategies and personal branding modules helped me establish myself as a thought leader in my niche. My inbound leads have increased by 300%.",
                name: "Rebecca Williams",
                title: "Founder, RW Consulting",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-background border shadow-soft">
                <CardContent className="p-6">
                  <Quote className="mb-4 h-8 w-8 text-brand-300" />
                  <p className="mb-4 text-sm text-muted-foreground">{testimonial.quote}</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-brand text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 p-8 text-white md:p-12">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ready to Write Your Success Story?</h2>
          <p className="mx-auto mt-4 max-w-[600px] text-white/90">
            Join our community of ambitious consultants and access expert coaching, resources, and support to accelerate your career.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button className="min-w-[150px] bg-white text-brand-500 hover:bg-white/90">
              Get Started Today
            </Button>
            <Button variant="outline" className="min-w-[150px] border-white/30 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
