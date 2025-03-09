import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, MessageSquare, TrendingUp, Users, Bookmark, PenSquare, Search, Filter } from "lucide-react";

export default function CommunityForum() {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-brand-400 text-white dark:from-primary-600 dark:to-brand-500">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="relative grid gap-6 px-6 py-12 md:grid-cols-2 md:gap-12 md:px-10 md:py-20">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge className="inline-flex items-center rounded-full border-0 bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                Community Hub
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/tight">
                Join the Conversation
              </h1>
              <p className="max-w-[600px] text-white/90 md:text-xl/relaxed">
                Connect with fellow consultants, share insights, ask questions, and grow together in our vibrant community forum.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-white text-primary hover:bg-white/90 dark:bg-white/90 dark:text-primary-600">
                Start a Discussion
                <PenSquare className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 dark:border-white/40 dark:hover:bg-white/20">
                Browse Topics
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative animate-slideInRight">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-secondary/20 backdrop-blur-md dark:bg-secondary/30" />
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-tertiary/20 backdrop-blur-md dark:bg-tertiary/30" />
              <img
                src="/placeholder.svg?height=320&width=320"
                alt="Community Forum"
                className="relative z-10 rounded-lg shadow-glow object-cover"
                width={320}
                height={320}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and filter section */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search discussions..." 
            className="pl-10 border-muted bg-background/50 dark:bg-background/20"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button className="bg-primary text-white hover:bg-primary/90">
          New Topic
        </Button>
      </section>

      {/* Forum categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Forum Categories</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Career Development",
              description: "Discussions about career paths, promotions, and professional growth",
              icon: <TrendingUp className="h-5 w-5 text-brand" />,
              topics: 48,
              posts: 178
            },
            {
              title: "Case Interviews",
              description: "Strategies, frameworks, and practice for consulting interviews",
              icon: <MessageSquare className="h-5 w-5 text-brand" />,
              topics: 65,
              posts: 312
            },
            {
              title: "Client Management",
              description: "Best practices for managing client relationships",
              icon: <Users className="h-5 w-5 text-brand" />,
              topics: 37,
              posts: 145
            },
            {
              title: "Tools & Resources",
              description: "Useful tools, templates, and resources for consultants",
              icon: <Bookmark className="h-5 w-5 text-brand" />,
              topics: 52,
              posts: 203
            },
            {
              title: "Industry Insights",
              description: "Trends and developments across different industries",
              icon: <TrendingUp className="h-5 w-5 text-brand" />,
              topics: 29,
              posts: 117
            },
            {
              title: "General Discussion",
              description: "Connect with the community on various consulting topics",
              icon: <MessageSquare className="h-5 w-5 text-brand" />,
              topics: 73,
              posts: 295
            },
          ].map((category, i) => (
            <Link href="#" key={i}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-medium hover:border-brand/50 bg-card dark:bg-card/80">
                <CardHeader className="space-y-1 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-brand-50 p-2 dark:bg-brand-900/20">{category.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <MessageSquare className="mr-1 h-3 w-3" /> {category.topics} Topics
                    </span>
                    <span className="flex items-center">
                      <PenSquare className="mr-1 h-3 w-3" /> {category.posts} Posts
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Discussions</h2>
          <Tabs defaultValue="recent" className="w-auto">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          {[
            {
              title: "How to approach market sizing cases effectively?",
              author: "Alex Morgan",
              authorImage: "/placeholder-user.jpg",
              time: "2 hours ago",
              category: "Case Interviews",
              replies: 12,
              views: 87
            },
            {
              title: "Best practices for creating client deliverables",
              author: "Samantha Lee",
              authorImage: "/placeholder-user.jpg",
              time: "5 hours ago",
              category: "Client Management",
              replies: 8,
              views: 43
            },
            {
              title: "Transitioning from Big 4 to MBB - any advice?",
              author: "David Kumar",
              authorImage: "/placeholder-user.jpg",
              time: "Yesterday",
              category: "Career Development",
              replies: 23,
              views: 156
            },
            {
              title: "Has anyone used the Pyramid Principle effectively?",
              author: "Emma Wilson",
              authorImage: "/placeholder-user.jpg",
              time: "2 days ago",
              category: "Tools & Resources",
              replies: 18,
              views: 112
            },
            {
              title: "How to handle difficult stakeholders in a project?",
              author: "James Chen",
              authorImage: "/placeholder-user.jpg",
              time: "3 days ago",
              category: "Client Management",
              replies: 15,
              views: 98
            },
          ].map((discussion, i) => (
            <Card key={i} className="overflow-hidden transition-all hover:shadow-soft bg-card dark:bg-card/80">
              <div className="flex flex-col md:flex-row">
                <div className="flex-grow p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted/50 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50">
                      {discussion.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{discussion.time}</span>
                  </div>
                  <Link href="#" className="group">
                    <h3 className="text-lg font-semibold group-hover:text-brand transition-colors">
                      {discussion.title}
                    </h3>
                  </Link>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={discussion.authorImage} alt={discussion.author} />
                      <AvatarFallback>{discussion.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{discussion.author}</span>
                  </div>
                </div>
                <div className="flex items-center justify-around border-t md:border-l md:border-t-0 bg-muted/5 p-3 md:w-48 md:flex-col">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold text-brand">{discussion.replies}</span>
                    <span className="text-xs text-muted-foreground">Replies</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold">{discussion.views}</span>
                    <span className="text-xs text-muted-foreground">Views</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" className="gap-1">
            Load More
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Start a discussion */}
      <section className="bg-muted/20 rounded-xl p-6 border space-y-4 dark:bg-muted/10">
        <h2 className="text-xl font-bold">Start a New Discussion</h2>
        <div className="space-y-3">
          <Input placeholder="Discussion title" className="bg-background dark:bg-background/50" />
          <Textarea placeholder="Share your thoughts, questions, or insights..." className="min-h-[120px] bg-background dark:bg-background/50" />
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Post Discussion</Button>
          </div>
        </div>
      </section>

      {/* Community guidelines */}
      <section className="bg-card/50 rounded-xl p-6 border space-y-4 dark:bg-card/30">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-brand" />
          <h2 className="text-xl font-bold">Community Guidelines</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Our forum is a space for constructive discussions and knowledge sharing. Please keep conversations professional and respectful.
          Remember to search before posting to avoid duplicate topics, and use clear titles that summarize your discussion point.
          We encourage you to share your expertise, ask questions, and help fellow consultants grow professionally.
        </p>
        <div>
          <Button variant="link" className="p-0 h-auto text-brand">
            Read Full Guidelines
          </Button>
        </div>
      </section>
    </div>
  );
}
