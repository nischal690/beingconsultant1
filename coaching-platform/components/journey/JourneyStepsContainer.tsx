import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface JourneyStepsContainerProps {
  className?: string;
  onViewRecommended?: () => void;
}

const JourneyStepsContainer: React.FC<JourneyStepsContainerProps> = ({ className, onViewRecommended }) => {
  const router = useRouter();
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm ${className}`}>
      <div className="text-lg font-bold text-black mb-3 sm:mb-0">
        Choose Your Next Steps in Your Journey
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          className="!bg-[#245D66] !text-white !border-[#245D66] hover:!bg-[#245D66]/90 hover:!text-white"
          onClick={onViewRecommended}
        >
          View recommended modules
        </Button>
        <Button 
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800"
          onClick={() => router.push('/dashboard')}
        >
          Go back to GRITS view
        </Button>
      </div>
    </div>
  );
};

export default JourneyStepsContainer;
