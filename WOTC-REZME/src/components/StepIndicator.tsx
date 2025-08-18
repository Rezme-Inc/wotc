import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  userType?: 'candidate' | 'employer';
}

const candidateSteps = [
  'Welcome',
  'Personal Information',
  'Target Groups',
  'Documents',
  'Important Dates',
  'Validation',
  'Complete'
];

const employerSteps = [
  'Welcome',
  'Company Information',
  'Important Dates',
  'Validation',
  'Complete'
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, userType = 'candidate' }) => {
  const steps = userType === 'candidate' ? candidateSteps : employerSteps;
  
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.slice(0, totalSteps).map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-cinnabar text-white shadow-md'
                      : isCurrent
                      ? 'bg-black text-white shadow-md'
                      : 'bg-gray-100 text-gray35 border border-gray-200'
                  }`}
                >
                  {isCompleted ? <Check size={18} /> : stepNumber}
                </div>
                <span className="mt-3 text-xs font-medium text-gray35 text-center max-w-20 leading-tight">
                  {step}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-6 transition-colors duration-200 ${
                    isCompleted ? 'bg-cinnabar' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};