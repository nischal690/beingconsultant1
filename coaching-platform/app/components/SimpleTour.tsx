'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const TOUR_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  SKIPPED: 'skipped',
  FINISHED: 'finished',
};

export interface TourStep {
  target: string;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  disableBeacon?: boolean;
}

interface SimpleTourProps {
  steps: TourStep[];
  run: boolean;
  continuous?: boolean;
  showSkipButton?: boolean;
  showProgress?: boolean;
  styles?: any;
  callback?: (data: { status: string; step: number }) => void;
}

const SimpleTour: React.FC<SimpleTourProps> = ({
  steps,
  run,
  continuous = false,
  showSkipButton = false,
  showProgress = false,
  styles = {},
  callback,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourStatus, setTourStatus] = useState(TOUR_STATUS.IDLE);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (run && steps.length > 0) {
      setTourStatus(TOUR_STATUS.RUNNING);
      positionTooltip(currentStep);
    } else {
      setTourStatus(TOUR_STATUS.IDLE);
    }
  }, [run, steps]);

  useEffect(() => {
    if (tourStatus === TOUR_STATUS.RUNNING) {
      positionTooltip(currentStep);
    }
  }, [currentStep, tourStatus]);

  const positionTooltip = (stepIndex: number) => {
    if (!isMounted || stepIndex >= steps.length) return;

    const step = steps[stepIndex];
    
    if (step.placement === 'center') {
      // Center in the viewport
      setTooltipPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 150,
      });
      return;
    }

    // Find the target element
    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      console.warn(`Target element not found: ${step.target}`);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    let top = 0;
    let left = 0;

    // Position based on placement
    switch (step.placement) {
      case 'top':
        top = rect.top - 150;
        left = rect.left + rect.width / 2 - 150;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - 75;
        left = rect.right + 20;
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + rect.width / 2 - 150;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - 75;
        left = rect.left - 320;
        break;
      default:
        top = rect.bottom + 20;
        left = rect.left;
    }

    // Ensure tooltip is within viewport
    if (left < 20) left = 20;
    if (left > window.innerWidth - 320) left = window.innerWidth - 320;
    if (top < 20) top = 20;
    if (top > window.innerHeight - 200) top = window.innerHeight - 200;

    setTooltipPosition({ top, left });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setTourStatus(TOUR_STATUS.SKIPPED);
    if (callback) {
      callback({ status: TOUR_STATUS.SKIPPED, step: currentStep });
    }
  };

  const handleFinish = () => {
    setTourStatus(TOUR_STATUS.FINISHED);
    if (callback) {
      callback({ status: TOUR_STATUS.FINISHED, step: currentStep });
    }
  };

  if (!isMounted || !run || tourStatus !== TOUR_STATUS.RUNNING || steps.length === 0) {
    return null;
  }

  const currentTourStep = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return createPortal(
    <div 
      className="fixed z-50 shadow-soft rounded-xl bg-white dark:bg-sidebar-background border border-border/50 p-5 w-[350px] animate-fade-in glass-effect"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        ...styles,
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm text-primary">
          {showProgress && `Step ${currentStep + 1} of ${steps.length}`}
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full hover:bg-muted/80" 
          onClick={handleSkip}
        >
          <X size={16} />
        </Button>
      </div>
      
      <div className="mb-5 text-sm leading-relaxed">
        {currentTourStep.content}
      </div>
      
      <div className="flex justify-between items-center">
        {showSkipButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSkip}
            className="text-xs hover:bg-background/80 hover-lift"
          >
            Skip tour
          </Button>
        )}
        
        <div className="flex ml-auto gap-2">
          {!isFirstStep && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrev}
              className="text-xs hover:bg-background/80 hover-lift"
            >
              <ChevronLeft size={14} className="mr-1" />
              Back
            </Button>
          )}
          
          <Button 
            size="sm" 
            onClick={isLastStep ? handleFinish : handleNext}
            className="bg-primary hover:bg-primary-dark text-white text-xs shadow-soft hover-lift"
          >
            {isLastStep ? 'Finish' : 'Next'}
            {!isLastStep && <ChevronRight size={14} className="ml-1" />}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SimpleTour;
