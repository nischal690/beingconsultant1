"use client";

import React, { useState, useEffect } from "react";
import { useHeader } from "@/lib/context/header-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  UserCircle2,
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Download,
  ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

// Personality question data
const questions = [
  {
    id: 1,
    text: "In social situations, do you:",
    options: [
      { text: "Feel energized and stimulated by being around other people", dimension: "E", value: 1 },
      { text: "Feel drained and need to recharge after spending time with other people", dimension: "I", value: 1 }
    ]
  },
  {
    id: 2,
    text: "When trying to understand something new, do you:",
    options: [
      { text: "Prefer to look at the big picture and make connections between ideas", dimension: "N", value: 1 },
      { text: "Prefer to focus on the details and practical aspects", dimension: "S", value: 1 }
    ]
  },
  {
    id: 3,
    text: "When making decisions, do you:",
    options: [
      { text: "Rely on logic and reasoning", dimension: "T", value: 1 },
      { text: "Consider the impact on people and their feelings", dimension: "F", value: 1 }
    ]
  },
  {
    id: 4,
    text: "Do you:",
    options: [
      { text: "Prefer to have a plan and stick to it", dimension: "J", value: 1 },
      { text: "Prefer to be flexible and adaptable to changing circumstances", dimension: "P", value: 1 }
    ]
  },
  {
    id: 5,
    text: "When faced with a problem, do you:",
    options: [
      { text: "Prefer to discuss it with others and get their input", dimension: "E", value: 1 },
      { text: "Prefer to reflect on it and come up with your own solution", dimension: "I", value: 1 }
    ]
  },
  {
    id: 6,
    text: "Do you:",
    options: [
      { text: "Enjoy brainstorming and generating new ideas", dimension: "N", value: 1 },
      { text: "Prefer to work with established methods and procedures", dimension: "S", value: 1 }
    ]
  },
  {
    id: 7,
    text: "Do you:",
    options: [
      { text: "Tend to analyze things objectively", dimension: "T", value: 1 },
      { text: "Tend to consider the emotional impact on yourself and others", dimension: "F", value: 1 }
    ]
  },
  {
    id: 8,
    text: "When given a task, do you:",
    options: [
      { text: "Prefer to complete it as soon as possible", dimension: "J", value: 1 },
      { text: "Prefer to work on it in a more spontaneous and free-flowing manner", dimension: "P", value: 1 }
    ]
  },
  {
    id: 9,
    text: "Do you:",
    options: [
      { text: "Prefer to have a lot of social interaction in your day-to-day life", dimension: "E", value: 1 },
      { text: "Prefer to have more quiet and alone time in your day-to-day life", dimension: "I", value: 1 }
    ]
  },
  {
    id: 10,
    text: "Do you:",
    options: [
      { text: "Tend to rely on your instincts and hunches", dimension: "N", value: 1 },
      { text: "Tend to rely on factual information and concrete evidence", dimension: "S", value: 1 }
    ]
  },
  {
    id: 11,
    text: "When someone comes to you with a problem, do you:",
    options: [
      { text: "Focus on finding a solution that makes logical sense", dimension: "T", value: 1 },
      { text: "Focus on listening to the person's feelings and providing emotional support", dimension: "F", value: 1 }
    ]
  },
  {
    id: 12,
    text: "Do you:",
    options: [
      { text: "Enjoy having a set schedule and routine", dimension: "J", value: 1 },
      { text: "Prefer to keep your options open and have more freedom in your schedule", dimension: "P", value: 1 }
    ]
  },
  {
    id: 13,
    text: "In a group setting, do you:",
    options: [
      { text: "Like to be in the center of attention", dimension: "E", value: 1 },
      { text: "Prefer to stay in the background and observe", dimension: "I", value: 1 }
    ]
  },
  {
    id: 14,
    text: "When approaching a problem, do you:",
    options: [
      { text: "Consider multiple possibilities and hypothetical scenarios", dimension: "N", value: 1 },
      { text: "Focus on the present situation and what is immediately relevant", dimension: "S", value: 1 }
    ]
  },
  {
    id: 15,
    text: "Do you:",
    options: [
      { text: "Value fairness and impartiality", dimension: "T", value: 1 },
      { text: "Value harmony and empathy", dimension: "F", value: 1 }
    ]
  },
  {
    id: 16,
    text: "When faced with a deadline, do you:",
    options: [
      { text: "Prefer to start working on it well in advance to ensure you have enough time to complete it", dimension: "J", value: 1 },
      { text: "Prefer to wait until closer to the deadline to start working on it", dimension: "P", value: 1 }
    ]
  },
  {
    id: 17,
    text: "When making a decision, do you:",
    options: [
      { text: "Prefer to talk it out with others before deciding", dimension: "E", value: 1 },
      { text: "Prefer to make your own decision without outside input", dimension: "I", value: 1 }
    ]
  },
  {
    id: 18,
    text: "Do you:",
    options: [
      { text: "Tend to see patterns and underlying meanings in things", dimension: "N", value: 1 },
      { text: "Tend to take things at face value and as they are presented", dimension: "S", value: 1 }
    ]
  },
  {
    id: 19,
    text: "When giving feedback to someone, do you:",
    options: [
      { text: "Focus on objective facts and areas for improvement", dimension: "T", value: 1 },
      { text: "Consider the person's feelings and try to deliver feedback in a constructive way", dimension: "F", value: 1 }
    ]
  },
  {
    id: 20,
    text: "Do you:",
    options: [
      { text: "Prefer to have a clear structure and order in your life", dimension: "J", value: 1 },
      { text: "Prefer to be more spontaneous and go with the flow", dimension: "P", value: 1 }
    ]
  },
  {
    id: 21,
    text: "Do you feel more comfortable:",
    options: [
      { text: "Meeting new people and making small talk", dimension: "E", value: 1 },
      { text: "Spending time with close friends and having deeper conversations", dimension: "I", value: 1 }
    ]
  },
  {
    id: 22,
    text: "Do you:",
    options: [
      { text: "Enjoy exploring new ideas and concepts", dimension: "N", value: 1 },
      { text: "Prefer to stick to what you know and are familiar with", dimension: "S", value: 1 }
    ]
  },
  {
    id: 23,
    text: "Do you:",
    options: [
      { text: "Enjoy debating and arguing a point", dimension: "T", value: 1 },
      { text: "Prefer to avoid conflict and maintain harmony", dimension: "F", value: 1 }
    ]
  },
  {
    id: 24,
    text: "Do you:",
    options: [
      { text: "Enjoy making decisions and taking action", dimension: "J", value: 1 },
      { text: "Prefer to delay making decisions until you have more information or options", dimension: "P", value: 1 }
    ]
  },
  {
    id: 25,
    text: "Do you:",
    options: [
      { text: "Prefer to work in a group or team setting", dimension: "E", value: 1 },
      { text: "Prefer to work independently", dimension: "I", value: 1 }
    ]
  },
  {
    id: 26,
    text: "Do you:",
    options: [
      { text: "Tend to be more abstract and theoretical in your thinking", dimension: "N", value: 1 },
      { text: "Tend to be more practical and concrete in your thinking", dimension: "S", value: 1 }
    ]
  },
  {
    id: 27,
    text: "Do you:",
    options: [
      { text: "Tend to be more analytical and critical in your thinking", dimension: "T", value: 1 },
      { text: "Tend to be more empathetic and compassionate in your thinking", dimension: "F", value: 1 }
    ]
  },
  {
    id: 28,
    text: "When making plans with friends, do you:",
    options: [
      { text: "Prefer to have a set time and place to meet", dimension: "J", value: 1 },
      { text: "Prefer to keep it more open and flexible", dimension: "P", value: 1 }
    ]
  },
  {
    id: 29,
    text: "Do you feel energized by:",
    options: [
      { text: "Going out and being in social situations", dimension: "E", value: 1 },
      { text: "Spending time alone doing activities you enjoy", dimension: "I", value: 1 }
    ]
  },
  {
    id: 30,
    text: "Do you:",
    options: [
      { text: "Trust your intuition and insights when making decisions", dimension: "N", value: 1 },
      { text: "Prefer to rely on facts and data when making decisions", dimension: "S", value: 1 }
    ]
  },
  {
    id: 31,
    text: "Do you:",
    options: [
      { text: "Value efficiency and productivity", dimension: "T", value: 1 },
      { text: "Value relationships and personal connections", dimension: "F", value: 1 }
    ]
  },
  {
    id: 32,
    text: "Do you:",
    options: [
      { text: "Prefer to have everything in its place and organized", dimension: "J", value: 1 },
      { text: "Tend to be more relaxed about clutter and disorder", dimension: "P", value: 1 }
    ]
  },
  {
    id: 33,
    text: "When it comes to expressing your thoughts and feelings, do you:",
    options: [
      { text: "Tend to speak your mind openly and directly", dimension: "E", value: 1 },
      { text: "Tend to keep your thoughts and feelings to yourself until you are comfortable with someone", dimension: "I", value: 1 }
    ]
  },
  {
    id: 34,
    text: "Do you:",
    options: [
      { text: "Tend to think about the future and possibilities", dimension: "N", value: 1 },
      { text: "Tend to focus on the present and what is happening now", dimension: "S", value: 1 }
    ]
  },
  {
    id: 35,
    text: "Do you:",
    options: [
      { text: "Tend to be more direct and straightforward in your communication", dimension: "T", value: 1 },
      { text: "Tend to be more diplomatic and considerate of others' feelings", dimension: "F", value: 1 }
    ]
  },
  {
    id: 36,
    text: "Do you:",
    options: [
      { text: "Tend to be more decisive and assertive in your actions", dimension: "J", value: 1 },
      { text: "Tend to be more open-minded and willing to consider different options", dimension: "P", value: 1 }
    ]
  }
];

// Personality type descriptions
// Define personality type keys for TypeScript
type PersonalityTypeKey = 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ' | 'ISTP' | 'ISFP' | 'INFP' | 'INTP' | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP' | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

// Personality descriptions object
const personalityDescriptions: Record<PersonalityTypeKey, { title: string; description: string }> = {
  ISTJ: {
    title: "The Inspector",
    description: "Practical, detail-oriented, and reliable. You value tradition, stability, and living life according to your standards. You are organized and thorough, with strong attention to detail."
  },
  ISFJ: {
    title: "The Protector",
    description: "Warm, considerate, and dedicated. You are committed to meeting obligations and helping others. You tend to be practical, loyal, and traditions-minded, valuing security and stability."
  },
  INFJ: {
    title: "The Counselor",
    description: "Insightful, creative, and idealistic. You are guided by your values and vision. You seek meaning in connections and strive to contribute to the well-being of others and society."
  },
  INTJ: {
    title: "The Mastermind",
    description: "Strategic, independent, and analytical. You are driven by your own original ideas to achieve improvements. You have high standards and a natural gift for creating solutions to complex problems."
  },
  ISTP: {
    title: "The Craftsman",
    description: "Observant, logical, and adaptable. You enjoy hands-on problem-solving and value efficiency. You're calm under pressure and pride yourself on your ability to use what's available to find workable solutions."
  },
  ISFP: {
    title: "The Composer",
    description: "Gentle, sensitive, and spontaneous. You value authenticity and deeply appreciate aesthetic beauty. You enjoy living in the present moment and are often in tune with sensory experiences."
  },
  INFP: {
    title: "The Healer",
    description: "Idealistic, compassionate, and creative. You're guided by your core personal values and seek to make the world a better place. You see potential for growth in almost everything."
  },
  INTP: {
    title: "The Architect",
    description: "Analytical, objective, and innovative. You enjoy theoretical and abstract concepts and are driven to understand how things work. You excel at logical analysis and finding unique solutions."
  },
  ESTP: {
    title: "The Dynamo",
    description: "Energetic, pragmatic, and spontaneous. You enjoy taking risks and making things happen. You're observant about the details of the world around you and adapt quickly to new situations."
  },
  ESFP: {
    title: "The Performer",
    description: "Enthusiastic, friendly, and spontaneous. You enjoy people, experiences, and material comforts. You learn best by trying new skills with other people and bring a playful energy to your work."
  },
  ENFP: {
    title: "The Champion",
    description: "Enthusiastic, creative, and sociable. You see life as full of possibilities and connect easily with others. You value inspiration and strive to bring innovative ideas to life."
  },
  ENTP: {
    title: "The Visionary",
    description: "Quick, ingenious, and outspoken. You enjoy challenges and see connections between seemingly unrelated things. You're curious about the world and enjoy exploring possibilities and theoretical concepts."
  },
  ESTJ: {
    title: "The Supervisor",
    description: "Organized, logical, and decisive. You value tradition and security, thriving on making order from chaos. You take a practical approach to achieving goals and are detail-oriented and systematic."
  },
  ESFJ: {
    title: "The Provider",
    description: "Warm-hearted, cooperative, and responsible. You value harmony and are generous with your time and energy. You're attentive to the practical needs of others and take your responsibilities seriously."
  },
  ENFJ: {
    title: "The Teacher",
    description: "Charismatic, empathetic, and responsible. You're driven to help others fulfill their potential. You're aware of others' motivations and can inspire people to take action and achieve their goals."
  },
  ENTJ: {
    title: "The Commander",
    description: "Strategic, logical, and efficient. You're a natural leader who sees the big picture and enjoys developing effective systems. You're decisive and value competence and intellectual discussions."
  }
};

// Interface for personality scores
interface PersonalityScores {
  E: number;
  I: number;
  N: number;
  S: number;
  T: number;
  F: number;
  J: number;
  P: number;
  [key: string]: number; // Allow string indexing
}

// Function to determine personality type from scores
const determinePersonalityType = (scores: PersonalityScores): PersonalityTypeKey => {
  const { E, I, N, S, T, F, J, P } = scores;
  
  let type = "";
  type += E > I ? "E" : "I";
  type += N > S ? "N" : "S";
  type += T > F ? "T" : "F";
  type += J > P ? "J" : "P";
  
  return type as PersonalityTypeKey;
};

// Component for personality traits breakdown
const PersonalityTraits = ({ scores }: { scores: PersonalityScores }) => {
  const totalQuestions = {
    EI: scores.E + scores.I,
    NS: scores.N + scores.S,
    TF: scores.T + scores.F,
    JP: scores.J + scores.P
  };

  return (
    <div className="space-y-6 my-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Extraversion ({scores.E})</span>
          <span className="font-medium">Introversion ({scores.I})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 bg-[#245D66] rounded-full" style={{ width: `${(scores.E / totalQuestions.EI) * 100}%` }}></div>
          <div className="h-2 bg-gray-300 rounded-full" style={{ width: `${(scores.I / totalQuestions.EI) * 100}%` }}></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Intuition ({scores.N})</span>
          <span className="font-medium">Sensing ({scores.S})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 bg-[#245D66] rounded-full" style={{ width: `${(scores.N / totalQuestions.NS) * 100}%` }}></div>
          <div className="h-2 bg-gray-300 rounded-full" style={{ width: `${(scores.S / totalQuestions.NS) * 100}%` }}></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Thinking ({scores.T})</span>
          <span className="font-medium">Feeling ({scores.F})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 bg-[#245D66] rounded-full" style={{ width: `${(scores.T / totalQuestions.TF) * 100}%` }}></div>
          <div className="h-2 bg-gray-300 rounded-full" style={{ width: `${(scores.F / totalQuestions.TF) * 100}%` }}></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Judging ({scores.J})</span>
          <span className="font-medium">Perceiving ({scores.P})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 bg-[#245D66] rounded-full" style={{ width: `${(scores.J / totalQuestions.JP) * 100}%` }}></div>
          <div className="h-2 bg-gray-300 rounded-full" style={{ width: `${(scores.P / totalQuestions.JP) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

// Main assessment component
export default function PersonalityAssessment() {
  const { setHeaderVisible } = useHeader();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<"intro" | "questions" | "results">("questions");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<PersonalityScores>({
    E: 0,
    I: 0,
    N: 0,
    S: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });
  const [personalityType, setPersonalityType] = useState<PersonalityTypeKey | "">("")
  const [progress, setProgress] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [canDownload, setCanDownload] = useState(false);
  
  // Proceed to next question or results
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setProgress(((currentQuestion + 1) / questions.length) * 100);
    } else {
      // Calculate final scores and determine personality type
      const finalPersonalityType: PersonalityTypeKey = determinePersonalityType(scores);
      setPersonalityType(finalPersonalityType);
      setCurrentStep("results");
      
      // Record completion time
      const now = Date.now();
      setCompletionTime(now);
      
      // Save completion time to localStorage for persistence across sessions
      localStorage.setItem('personalityTestCompletionTime', now.toString());
    }
  };
  
  // Go back to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setProgress((currentQuestion - 1) / questions.length * 100);
      
      // Remove score for the question we're going back to
      const prevQuestion = questions[currentQuestion];
      const prevAnswer = selectedAnswers[currentQuestion];
      
      if (prevAnswer !== undefined) {
        const dimension = prevQuestion.options[prevAnswer].dimension as keyof PersonalityScores;
        setScores(prev => ({
          ...prev,
          [dimension]: prev[dimension] - 1
        }));
        
        // Remove the answer
        const newSelectedAnswers = { ...selectedAnswers };
        delete newSelectedAnswers[currentQuestion];
        setSelectedAnswers(newSelectedAnswers);
      }
    }
  };
  
  // Handle answer selection
  const handleSelectAnswer = (optionIndex: number) => {
    const question = questions[currentQuestion];
    const selectedOption = question.options[optionIndex];
    const dimension = selectedOption.dimension as keyof PersonalityScores;
    
    // Update scores
    setScores(prev => ({
      ...prev,
      [dimension]: prev[dimension] + 1
    }));
    
    // Save selected answer
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
    
    // Automatically go to next question
    setTimeout(handleNextQuestion, 300);
  };
  
  // Reset the assessment
  const handleRestart = () => {
    setHeaderVisible(true); // Show header when restarting
    setCurrentStep("intro");
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScores({
      E: 0,
      I: 0,
      N: 0,
      S: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    });
    setPersonalityType("");
    setProgress(0);
    setCompletionTime(null);
    setTimeRemaining("");
    setCanDownload(false);
    
    // Clear the saved completion time
    localStorage.removeItem('personalityTestCompletionTime');
  };
  
  // Check if 6 hours have passed since completion
  useEffect(() => {
    // Automatically hide header when assessment page loads since we skip intro
    setHeaderVisible(false);
    if (!completionTime) return;
    
    const checkTimeRemaining = () => {
      // 6 hours in milliseconds
      const waitTime = 6 * 60 * 60 * 1000;
      const now = Date.now();
      const timePassed = now - completionTime;
      
      // If 6 hours have passed, allow download
      if (timePassed >= waitTime) {
        setTimeRemaining("");
        setCanDownload(true);
        return;
      }
      
      // Calculate remaining milliseconds
      const remainingMs = waitTime - timePassed;
      
      // If somehow negative, reset
      if (remainingMs < 0) {
        setTimeRemaining("");
        setCanDownload(true);
        return;
      }
      
      // Calculate remaining hours, minutes, seconds
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      setCanDownload(false);
    };
    
    // Initial check
    checkTimeRemaining();
    
    // Update every second
    const interval = setInterval(checkTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [completionTime]);
  
  // Handle downloading the personality report PDF
  const handleDownloadReport = () => {
    if (!personalityType || !canDownload) return;
    
    let reportUrl = "";
    
    // Set the appropriate report URL based on personality type
    switch (personalityType) {
      case "ENFJ":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FENFJ%2C%20Charismatic%20Altruist.pdf?alt=media&token=cfec62a8-9b60-4f7c-943b-c6b6e1ca794b";
        break;
      case "ENFP":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FENFP%2C%20Agile%20Storyteller.pdf?alt=media&token=9ad37ed5-4e35-4c16-ac0d-79d326dccc1f";
        break;
      case "ENTJ":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FENTJ%2C%20Strategic%20Leader.pdf?alt=media&token=d8b7c5ae-1a0e-400e-a0e7-fae8d5fed254";
        break;
      case "ENTP":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FENTP%2C%20Persuasive%20Strategist.pdf?alt=media&token=629e0946-6207-4d79-becc-70bd1fe9ae72";
        break;
      case "ESFJ":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FESFJ%2C%20Gregarious%20Guardian.pdf?alt=media&token=45be02f2-4eb9-4300-ad8b-61788454cfac";
        break;
      case "ESFP":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FESFP%2C%20Playful%20Performer.pdf?alt=media&token=fc185ba5-3145-44ae-998d-58f2a0ff5845";
        break;
      case "ESTJ":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FESTJ%2C%20Proactive%20Implementor.pdf?alt=media&token=f164ba70-956d-4dd5-9826-48a139e8e475";
        break;
      case "ESTP":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FESTP%2C%20Dynamic%20Doer.pdf?alt=media&token=9d24b59b-b9e7-4dad-8152-e306390dd32f";
        break;
      case "INFJ":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FINFJ%2C%20Organized%20Creator.pdf?alt=media&token=fbcd2ee0-3fcc-4730-ac81-33e3f15b3285";
        break;
      case "INFP":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FINFP%2C%20Creative%20Empathiser.pdf?alt=media&token=ad16bc63-5570-4ac9-bddf-8caab3ab06ae";
        break;
      case "INTJ":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FINTJ%2C%20Efficient%20Strategist.pdf?alt=media&token=2ae42849-4d0c-4202-8607-d3e1a477bc52";
        break;
      case "INTP":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FINTP%2C%20Innovative%20Analyst.pdf?alt=media&token=103a82a3-439b-4128-8460-d9b76b6aaf11";
        break;
      case "ISFJ":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FISFJ%2C%20Industrious%20Nurturer.pdf?alt=media&token=1c69dd6a-e34f-462f-8c8f-c861caaec4a9";
        break;
      case "ISFP":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FISFP%2C%20Artistic%20Explorer.pdf?alt=media&token=2e399bbe-160a-4989-ac6e-dc0c77ad1f00";
        break;
      case "ISTJ":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FISTJ%2C%20Dependable%20Realist.pdf?alt=media&token=eaf3e95f-b551-4170-b56b-a4e80ed44e21";
        break;
      case "ISTP":
        reportUrl = "https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/personality%20report%2FISTP%2C%20Artistic%20Troubleshooter.pdf?alt=media&token=396aeba4-9c69-4ab7-b1eb-569b4502da0f";
        break;
      default:
        // For other personality types, you can add more cases as needed
        alert("Report not available for this personality type yet.");
        return;
    }
    
    // Open the report URL in a new tab
    window.open(reportUrl, "_blank");
  };
  
  // Start the assessment
  const handleStart = () => {
    setHeaderVisible(false); // Hide header when assessment starts
    setCurrentStep("questions");
  };

  return (
    <div className="w-full min-h-screen fixed inset-0 overflow-hidden">
      {/* Background elements - fixed position to cover the entire viewport */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(36,93,102,0.15),transparent_70%)] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_rgba(36,93,102,0.15),transparent_70%)] animate-pulse-slower"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#245D66]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[#245D66]/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full bg-gradient-to-b from-black via-gray-900 to-black text-white flex justify-center pt-8 pb-8 sm:pt-12 sm:pb-12 md:pt-16 md:pb-16">
        {/* Fixed width centered content container */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 h-full">
        {/* Introduction Screen */}
        {currentStep === "intro" && (
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden group animate-fade-in w-full transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#245D66]/20 via-black/0 to-[#245D66]/10 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute -inset-[100px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow"></div>
            
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            
            {/* Content container */}
            <div className="relative z-10 p-10">
              {/* Icon with animated background */}
              <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#245D66] to-[#245D66]/80 text-white mb-8 shadow-lg overflow-hidden group-hover:-translate-y-1 transition-all duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Brain size={36} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              {/* Title with animated gradient */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80 animate-gradient-x">
                Unlock Your Mind
              </h1>
              
              <p className="text-white/80 text-lg mb-8 w-full">
                Discover the unique patterns of your personality with our premium assessment. Gain insights that will transform how you understand yourself and others.
              </p>
              
              {/* Feature cards with hover effects */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_rgba(36,93,102,0.3)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#245D66]/20 p-2 rounded-full">
                      <CheckCircle size={18} className="text-[#245D66]" />
                    </div>
                    <h3 className="font-semibold text-white">Myers-Briggs Based</h3>
                  </div>
                  <p className="text-white/60 text-sm">Inspired by the MBTI framework, one of the most widely used personality assessments worldwide.</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_rgba(36,93,102,0.3)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#245D66]/20 p-2 rounded-full">
                      <CheckCircle size={18} className="text-[#245D66]" />
                    </div>
                    <h3 className="font-semibold text-white">Scientifically Validated</h3>
                  </div>
                  <p className="text-white/60 text-sm">Questions designed based on decades of psychological research and rigorous testing methodologies.</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_rgba(36,93,102,0.3)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#245D66]/20 p-2 rounded-full">
                      <CheckCircle size={18} className="text-[#245D66]" />
                    </div>
                    <h3 className="font-semibold text-white">Personalized Insights</h3>
                  </div>
                  <p className="text-white/60 text-sm">Receive detailed analysis about how your personality influences your behaviors, preferences, and interactions.</p>
                </div>
              </div>
              
              {/* Start button with animated gradient effect */}
              <Button 
                onClick={handleStart} 
                className="relative w-full py-7 bg-black border border-white/20 rounded-xl text-white font-medium text-lg overflow-hidden group-hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(36,93,102,0.5)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#245D66] via-[#245D66]/80 to-[#245D66] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[length:200%_100%] animate-gradient-x"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Begin Your Journey</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              
              {/* Bottom text with subtle animation */}
              <p className="text-center text-white/40 text-sm mt-8 group-hover:text-white/60 transition-colors duration-500">
                Your responses are completely private and only used to generate your personalized insights.
              </p>
            </div>
            
            {/* Bottom gradient border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        )}

        {/* Questions Screen - Fixed width container */}
        {currentStep === "questions" && (
          <div className="w-full bg-white/10 backdrop-blur-lg p-4 sm:p-6 md:p-8 pt-12 pb-12 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20 rounded-xl border border-white/10 animate-fade-in relative">
            {/* Back button - positioned at the top left */}
            <button 
              onClick={() => router.push('/dashboard/assessments')} 
              className="absolute top-6 left-6 sm:top-8 sm:left-8 md:top-10 md:left-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Assessments</span>
            </button>
            {/* Progress bar */}
            <div className="w-full mb-8">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#245D66] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Question container */}
            <div className="w-full mb-8">
              <h2 className="text-2xl font-bold mb-8 text-center">{questions[currentQuestion].text}</h2>
              
              <div className="space-y-4 w-full">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-left p-6 rounded-xl border transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-[#245D66] bg-[#245D66]/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Navigation button */}
            <div className="flex">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
                className={`flex items-center gap-2 ${
                  currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            </div>
          </div>
        )}

        {/* Results Screen - Fixed width */}
        {currentStep === "results" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 md:p-8 border border-white/20 animate-fade-in text-center w-full">
            {personalityType ? (
              canDownload ? (
                <>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#245D66] text-white mx-auto mb-6">
                    <BarChart3 size={40} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    Your Personality Type: {personalityDescriptions[personalityType as PersonalityTypeKey].title}
                  </h2>
                  <p className="text-xl text-[#245D66] font-semibold mb-6">{personalityType}</p>
                  <p className="text-white/80 mb-6 w-full mx-auto">
                    {personalityDescriptions[personalityType as PersonalityTypeKey].description}
                  </p>

                  <PersonalityTraits scores={scores} />

                  <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <Button
                      onClick={handleRestart}
                      variant="outline"
                      className="flex-1 py-4"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Retake Test
                    </Button>
                    <Button
                      onClick={handleDownloadReport}
                      className="flex-1 py-4 bg-[#245D66] hover:bg-[#245D66]/90"
                    >
                      <Download size={16} className="mr-2" />
                      Download Results
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Button
                      onClick={() => router.push('/dashboard')}
                      variant="outline"
                      className="flex-1 py-4"
                    >
                      <ChevronLeft size={16} className="mr-2" />
                      Back to Dashboard
                    </Button>
                    <Button
                      onClick={() => router.push('/dashboard/assessments')}
                      variant="outline"
                      className="flex-1 py-4"
                    >
                      <Brain size={16} className="mr-2" />
                      All Assessments
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#245D66] text-white mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Thank you for completing the test!</h2>

                  <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/70 text-sm mb-1">
                      Your detailed report will be available in:
                    </p>
                    <p className="text-xl font-semibold text-[#245D66]">{timeRemaining}</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={handleRestart}
                      variant="outline"
                      className="mx-auto"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Retake Test
                    </Button>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <Button
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                        className="flex-1 py-4"
                      >
                        <ChevronLeft size={16} className="mr-2" />
                        Back to Dashboard
                      </Button>
                      <Button
                        onClick={() => router.push('/dashboard/assessments')}
                        variant="outline"
                        className="flex-1 py-4"
                      >
                        <Brain size={16} className="mr-2" />
                        All Assessments
                      </Button>
                    </div>
                  </div>
                </>
              )
            ) : (
              <p>Loading results...</p>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}