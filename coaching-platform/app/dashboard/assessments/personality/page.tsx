"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define the question type
interface Question {
  id: number;
  text: string;
  category: string;
}

// Define the personality test component
export default function PersonalityTest() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Questions based on the image shared
  const questions: Question[] = [
    { id: 1, text: "I'm social character, by you:", category: "extraversion" },
    { id: 2, text: "I often enjoy going out and being around other people.", category: "extraversion" },
    { id: 3, text: "I prefer being in a group rather than being alone.", category: "extraversion" },
    { id: 4, text: "I am strong in a technical/analytical way, for you:", category: "analytical" },
    { id: 5, text: "I tend to look at the big picture and make connections between ideas.", category: "analytical" },
    { id: 6, text: "I am a strong decision, for you:", category: "decisiveness" },
    { id: 7, text: "I enjoy taking risks.", category: "risk-taking" },
    { id: 8, text: "I am confident in my abilities and know my own feelings.", category: "self-awareness" },
    { id: 9, text: "I'm calm.", category: "emotional-stability" },
    { id: 10, text: "I handle stress well and remain in control.", category: "emotional-stability" },
    { id: 11, text: "I am logical and a problem solver.", category: "analytical" },
    { id: 12, text: "I enjoy brainstorming and generating new ideas.", category: "creativity" },
    { id: 13, text: "I am good at motivating others.", category: "leadership" },
    { id: 14, text: "I find it easy to connect with people on a personal level.", category: "empathy" },
    { id: 15, text: "I have a good work ethic, for you:", category: "work-ethic" },
    { id: 16, text: "I tend to stick to it if I have performance and have strong morals.", category: "conscientiousness" },
    { id: 17, text: "I am a common sense or practical, for you:", category: "practicality" },
    { id: 18, text: "I tend to have more grit and down time to your day to day life.", category: "resilience" },
    { id: 19, text: "I have common sense and practicality and function.", category: "practicality" },
    { id: 20, text: "I tend to rely on factual information and concrete evidence.", category: "analytical" },
    { id: 21, text: "I have common sense or practical, for you:", category: "practicality" },
    { id: 22, text: "I focus on listening to the person's feelings and providing emotional support.", category: "empathy" },
    { id: 23, text: "I have a good work ethic, for you:", category: "work-ethic" },
    { id: 24, text: "I make sure your values align and have more freedom in your schedule.", category: "values-alignment" },
    { id: 25, text: "I have a good work ethic, for you:", category: "work-ethic" },
    { id: 26, text: "I tend to put in the background and observe.", category: "introversion" },
    { id: 27, text: "I have a good work ethic, for you:", category: "work-ethic" },
    { id: 28, text: "I consider multiple possibilities and hypothetical scenarios.", category: "abstract-thinking" },
    { id: 29, text: "I tend to focus on what is real and what is immediately relevant.", category: "concrete-thinking" },
    { id: 30, text: "I'm you:", category: "self-perception" },
    { id: 31, text: "I focus on facts and objectivity.", category: "analytical" },
    { id: 32, text: "I'm you:", category: "self-perception" },
    { id: 33, text: "I prefer to be calm/cooling or I want to articulate to ensure you have enough time to remember things and I am able to look at your working on it.", category: "communication-style" },
    { id: 34, text: "I have a good work ethic, for you:", category: "work-ethic" },
    { id: 35, text: "I prefer to look just stick where before deciding.", category: "decision-making" },
    { id: 36, text: "I'm you:", category: "self-perception" },
    { id: 37, text: "I tend to be efficient and advertising meaning in things.", category: "efficiency" },
    { id: 38, text: "I tend to focus on things and feel they are important.", category: "values-focus" },
    { id: 39, text: "I have a good feedback to someone, for you:", category: "feedback" },
    { id: 40, text: "I consider multiple possibilities and hypothetical scenarios.", category: "abstract-thinking" },
    { id: 41, text: "I tend to focus on what is real and what is immediately relevant.", category: "concrete-thinking" },
    { id: 42, text: "I'm you:", category: "self-perception" },
    { id: 43, text: "I tend to have a clear structure and order in your life.", category: "organization" },
    { id: 44, text: "I prefer to be more spontaneous and go with the flow.", category: "spontaneity" },
    { id: 45, text: "I'm you find more comfortable:", category: "comfort-zone" },
    { id: 46, text: "I spending time with close friends and having deeper conversations.", category: "intimate-relationships" },
    { id: 47, text: "I'm you:", category: "self-perception" },
    { id: 48, text: "I prefer to stick to what you know and are familiar with.", category: "familiarity" },
    { id: 49, text: "I'm you:", category: "self-perception" },
    { id: 50, text: "I prefer to seek conflict and maintain harmony.", category: "conflict-avoidance" },
    { id: 51, text: "I'm you:", category: "self-perception" },
    { id: 52, text: "I prefer to be data-seeking decisions and you have more information to explore.", category: "data-driven" },
    { id: 53, text: "I'm you:", category: "self-perception" },
    { id: 54, text: "I prefer to work independently.", category: "independence" },
    { id: 55, text: "I'm you:", category: "self-perception" },
    { id: 56, text: "I tend to seek more abstract and theoretical in your thinking.", category: "abstract-thinking" },
    { id: 57, text: "I'm you:", category: "self-perception" },
    { id: 58, text: "I tend to be more analytical and concrete in your thinking.", category: "analytical" },
    { id: 59, text: "I am for making others with friends, for you:", category: "social-orientation" },
    { id: 60, text: "I prefer to learn it warm and friendly.", category: "warmth" },
    { id: 61, text: "I'm you:", category: "self-perception" },
    { id: 62, text: "I spending time alone doing activities you enjoy.", category: "solitary-activities" },
    { id: 63, text: "I'm you:", category: "self-perception" },
    { id: 64, text: "I prefer to set up facts and data when making decisions.", category: "data-driven" },
    { id: 65, text: "I'm you:", category: "self-perception" },
    { id: 66, text: "I value relationships and personal connections.", category: "relationship-value" },
    { id: 67, text: "I'm you:", category: "self-perception" },
    { id: 68, text: "I tend to be more rational about it feels and decide.", category: "rational-decision-making" },
    { id: 69, text: "I'm you:", category: "self-perception" },
    { id: 70, text: "I tend to make your mind quickly and friendly.", category: "quick-decisions" },
    { id: 71, text: "I prefer to keep your thoughts and feelings to yourself until you are comfortable with someone.", category: "privacy" },
    { id: 72, text: "I'm you:", category: "self-perception" },
    { id: 73, text: "I tend to think about the future and possibilities.", category: "future-orientation" },
    { id: 74, text: "I tend to focus on the present and what is happening now.", category: "present-focus" },
    { id: 75, text: "I'm you:", category: "self-perception" },
    { id: 76, text: "I tend to be more deliberate and considerate of other's feelings.", category: "consideration" },
    { id: 77, text: "I tend to more open-minded and willing to consider different options.", category: "open-mindedness" }
  ];

  // Handle selecting an answer
  const handleSelectAnswer = (questionId: number, value: number) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  // Handle moving to the next question
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  // Handle moving to the previous question
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle submitting the test
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the answers to your backend
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate results (simplified for demo)
      const results = calculateResults();
      
      // Show success message
      toast.success("Personality test completed successfully!");
      
      // Set test as completed
      setTestCompleted(true);
      
      // In a real implementation, you would save the results to the user's profile
      // and then redirect to a results page
    } catch (error) {
      toast.error("There was an error submitting your test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate test results
  const calculateResults = () => {
    const categories: Record<string, { total: number, count: number }> = {};
    
    // Initialize categories
    questions.forEach(question => {
      if (!categories[question.category]) {
        categories[question.category] = { total: 0, count: 0 };
      }
    });
    
    // Sum up scores by category
    Object.entries(answers).forEach(([questionId, score]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question) {
        categories[question.category].total += score;
        categories[question.category].count += 1;
      }
    });
    
    // Calculate average for each category
    const results: Record<string, number> = {};
    Object.entries(categories).forEach(([category, data]) => {
      results[category] = data.count > 0 ? data.total / data.count : 0;
    });
    
    return results;
  };

  // Check if current question has been answered
  const isCurrentQuestionAnswered = () => {
    return answers[questions[currentStep].id] !== undefined;
  };

  // Calculate progress percentage
  const progressPercentage = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      {!testCompleted ? (
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#245D66] transition-all duration-300 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{Object.keys(answers).length} of {questions.length} questions answered</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
          </div>

          {/* Question card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8"
          >
            <div className="mb-8">
              <span className="text-sm text-gray-500">Question {currentStep + 1} of {questions.length}</span>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                {questions[currentStep].text}
              </h2>
            </div>

            {/* Rating scale */}
            <div className="mb-8">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleSelectAnswer(questions[currentStep].id, value)}
                      className={`
                        h-14 rounded-lg flex items-center justify-center transition-all
                        ${
                          answers[questions[currentStep].id] === value
                            ? "bg-[#245D66] text-white ring-2 ring-offset-2 ring-[#245D66]"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }
                      `}
                    >
                      <span className="font-medium text-lg">{value}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-500 px-2">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered() || isSubmitting}
                className="bg-[#245D66] hover:bg-[#1a474e] text-white flex items-center gap-2"
              >
                {currentStep === questions.length - 1 ? (
                  isSubmitting ? "Submitting..." : "Complete Test"
                ) : (
                  <>
                    Next
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm">
            <p className="font-medium mb-1">Tips for accurate results:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Answer based on how you typically behave, not how you wish to behave</li>
              <li>Try not to overthink your responses - your first instinct is often best</li>
              <li>Be honest with yourself for the most accurate insights</li>
            </ul>
          </div>
        </div>
      ) : (
        // Test completed view
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Test Completed!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Thank you for completing the personality assessment. Your results are being processed and will be available shortly.
            </p>
            <Button
              onClick={() => router.push('/dashboard/assessments')}
              className="bg-[#245D66] hover:bg-[#1a474e] text-white"
            >
              Return to Assessments
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
