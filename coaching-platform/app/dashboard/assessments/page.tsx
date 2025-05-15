"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserCircle2,
  Brain,
  Lightbulb,
  BarChart3,
  Activity,
  Dna,
  ArrowRight,
  Star,
  ChevronDown,
  Shield,
  Compass,
  PieChart
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AssessmentsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Handle scroll detection for nav effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to assessments list
  const handleScrollToList = () => {
    const el = document.getElementById("assessments-list");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Assessment categories
  const categories = [
    { id: "all", name: "All Tests" },
    { id: "personality", name: "Personality" },
    { id: "career", name: "Career" },
    { id: "cognitive", name: "Cognitive" },
    { id: "relationship", name: "Relationship" }
  ];

  // Assessment data
  const assessments = [
    {
      id: "personality",
      title: "Personality Explorer",
      subtitle: "Discover your unique traits and drivers",
      icon: <UserCircle2 />,
      category: "personality",
      description: "Uncover your personality profile based on the Big Five traits. Get personalized insights on your strengths, communication style, and relationship patterns.",
      duration: "15 min",
      questions: 45,
      popularity: "Most popular",
      color: "from-[#245D66] to-[#245D66]",
      available: true
    },
    {
      id: "career-aptitude",
      title: "Career Compass",
      subtitle: "Find your professional direction",
      icon: <Compass />,
      category: "career",
      description: "Identify career paths that align with your skills, interests and values. Receive tailored recommendations for industries and roles that match your profile.",
      duration: "12 min",
      questions: 40,
      popularity: "",
      color: "from-[#245D66] to-[#245D66]",
      available: false
    },
    {
      id: "emotional-intelligence",
      title: "Emotional Intelligence",
      subtitle: "Assess your emotional awareness",
      icon: <Brain />,
      category: "cognitive",
      description: "Measure your ability to recognize, understand and manage emotions. Learn strategies to enhance your social interactions and leadership capabilities.",
      duration: "10 min",
      questions: 35,
      popularity: "",
      color: "from-[#245D66] to-[#245D66]",
      available: false
    },
    {
      id: "strengths-finder",
      title: "Strengths Finder",
      subtitle: "Leverage what makes you exceptional",
      icon: <Star />,
      category: "personality",
      description: "Identify your top strengths and learn how to apply them more effectively. Discover opportunities for personal growth based on your natural talents.",
      duration: "18 min",
      questions: 50,
      popularity: "",
      color: "from-[#245D66] to-[#245D66]",
      available: false
    },
    {
      id: "conflict-style",
      title: "Conflict Resolution Style",
      subtitle: "How you handle disagreements",
      icon: <Shield />,
      category: "relationship",
      description: "Understand your typical approach to resolving conflicts. Gain insights on how to navigate challenging conversations and build stronger relationships.",
      duration: "8 min",
      questions: 30,
      popularity: "",
      color: "from-[#245D66] to-[#245D66]",
      available: false
    },
    {
      id: "cognitive-abilities",
      title: "Cognitive Profile",
      subtitle: "Map your mental aptitudes",
      icon: <PieChart />,
      category: "cognitive",
      description: "Measure different aspects of your cognitive functioning including memory, attention, reasoning and problem-solving. Discover your mental strengths.",
      duration: "25 min",
      questions: 60,
      popularity: "",
      color: "from-[#245D66] to-[#245D66]",
      available: false
    }
  ];

  // Filter assessments based on active category
  const filteredAssessments = activeCategory === "all" 
    ? assessments 
    : assessments.filter(a => a.category === activeCategory);

  // Animation variants for framer motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Simplified background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-black">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Single subtle accent */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(36,93,102,0.08),transparent_70%)]">
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 px-6",
        scrolled ? "py-3 bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-lg" : "py-5"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div></div>
          <div></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-40 pb-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          {/* Small badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-8 border border-white/20">
            <span className="text-[#245D66] font-medium">
              Science-Based Assessments
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#245D66] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#245D66]"></span>
            </span>
          </div>

          {/* Hero headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white text-center mb-6 tracking-tight">
            <span className="block">Discover Your </span>
            <span className="text-[#245D66]">
              Hidden Potential
            </span>
          </h1>

          {/* Hero description */}
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10">
            Unlock powerful insights about your personality, strengths, and growth opportunities through our scientifically validated assessments.
          </p>

          {/* CTA button with animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={handleScrollToList}
              className="group relative px-8 py-4 bg-[#245D66] text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(36,93,102,0.35)] hover:shadow-[0_0_35px_rgba(36,93,102,0.45)] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Journey
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mt-14">
            <div className="flex items-center gap-2 text-white/60 bg-[#245D66]/10 backdrop-blur-md rounded-full px-4 py-2 border border-[#245D66]/20">
              <Activity size={16} className="text-[#245D66]" />
              <span>Personalized Reports</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 bg-[#245D66]/10 backdrop-blur-md rounded-full px-4 py-2 border border-[#245D66]/20">
              <Brain size={16} className="text-[#245D66]" />
              <span>Science-Backed</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 bg-[#245D66]/10 backdrop-blur-md rounded-full px-4 py-2 border border-[#245D66]/20">
              <Dna size={16} className="text-[#245D66]" />
              <span>AI Enhanced</span>
            </div>
          </div>
        </motion.div>

        {/* Remove decorative elements for smoother transition */}
      </section>

      {/* Assessments List Section */}
      <section id="assessments-list" className="relative z-10 w-full py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                <span className="text-[#245D66]">
                  Explore Assessments
                </span>
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Find the assessment that resonates with your current goals and discover actionable insights about yourself.
              </p>
            </motion.div>
          </div>

          {/* Category tabs */}
          <div className="mb-12 overflow-x-auto pb-2">
            <div className="flex gap-2 justify-center min-w-max">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                    activeCategory === category.id
                      ? "bg-[#245D66] text-white shadow-lg shadow-[#245D66]/20"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Assessments grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredAssessments.map((assessment) => (
              <motion.div
                key={assessment.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredCard(assessment.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative"
              >
                <Card className={cn(
                  "h-full bg-white border-0 rounded-3xl overflow-hidden transition-all duration-300",
                  hoveredCard === assessment.id ? "shadow-2xl shadow-[#245D66]/20 translate-y-[-5px]" : "shadow-xl"
                )} style={{ color: 'black' }}>
                  {/* Card highlight border */}
                  <div className="absolute inset-0 rounded-3xl border border-black/10 pointer-events-none" />
                  
                  {/* Remove gradient background effect */}
                  
                  {/* Popular badge or Coming Soon */}
                  {assessment.available ? (
                    assessment.popularity && (
                      <div className="absolute top-4 right-4 bg-[#245D66]/10 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-[#245D66] border border-[#245D66]/20">
                        {assessment.popularity}
                      </div>
                    )
                  ) : (
                    <div className="absolute top-4 right-4 bg-black/10 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-black/90 border border-black/20">
                      Coming Soon
                    </div>
                  )}
                  
                  <CardHeader className="pt-8 pb-0 bg-white" style={{ color: 'black' }}>
                    {/* Icon */}
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 bg-[#245D66]"
                    )}>
                      {React.cloneElement(assessment.icon, { size: 24 })}
                    </div>
                    
                    {/* Title and subtitle */}
                    <div>
                      <h3 className="text-2xl font-bold mb-1" style={{ color: 'black' }}>{assessment.title}</h3>
                      <p style={{ color: 'rgba(0, 0, 0, 0.6)' }}>{assessment.subtitle}</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6 pb-8 bg-white" style={{ color: 'black' }}>
                    {/* Description */}
                    <p style={{ color: 'rgba(0, 0, 0, 0.7)' }} className="mb-6">
                      {assessment.description}
                    </p>
                    
                    {/* Stats and CTA */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-4">
                        <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                          <span className="font-medium block" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                            {assessment.duration}
                          </span>
                          Duration
                        </div>
                        <div className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                          <span className="font-medium block" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                            {assessment.questions}
                          </span>
                          Questions
                        </div>
                      </div>
                    </div>
                    
                    {/* Button */}
                    {assessment.available ? (
                      <Link href={`/dashboard/assessments/${assessment.id}`}>
                        <Button className={cn(
                          "w-full rounded-xl py-6 font-semibold text-white transition-all bg-[#245D66] hover:shadow-lg",
                          hoveredCard === assessment.id ? "shadow-lg shadow-[#245D66]/20" : ""
                        )}>
                          <span className="flex items-center gap-2">
                            Start Assessment
                            <ArrowRight size={18} className={hoveredCard === assessment.id ? "translate-x-1" : ""} />
                          </span>
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full rounded-xl py-6 font-semibold text-white transition-all bg-black/50 cursor-not-allowed">
                        <span className="flex items-center gap-2">
                          Coming Soon
                        </span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Content ends here */}
    </div>
  );
}