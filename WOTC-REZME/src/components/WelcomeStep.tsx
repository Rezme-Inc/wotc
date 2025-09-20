import React, { useState } from 'react';
import { User, Building2, ChevronDown, ChevronUp } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  userType: 'candidate' | 'employer';
  onUserTypeChange: (type: 'candidate' | 'employer') => void;
  onLoginToDashboard?: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ 
  onNext, 
  userType, 
  onUserTypeChange, 
  onLoginToDashboard 
}) => {
  const [showAbout, setShowAbout] = useState(false);
  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Getting Started Section */}
      <div className="mb-6 card p-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-center mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <h2 className="text-lg md:text-xl font-semibold text-black font-poppins">
            This strengthens your job application
          </h2>
        </div>
        <p className="text-sm md:text-base text-gray35 font-poppins text-center">
          Takes about 5 minutes and helps employers see why hiring you benefits everyone.
        </p>
      </div>

      {/* User Type Toggle */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-8 font-poppins">
          Who is filling out this form?
        </h2>
        <div className="card inline-flex p-2 bg-gray-50 border-gray-200">
          <button
            onClick={() => onUserTypeChange('candidate')}
            className={`flex flex-col items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 min-h-[80px] focus-visible ${
              userType === 'candidate'
                ? 'btn-primary shadow-md'
                : 'btn-ghost hover:bg-white'
            }`}
            aria-pressed={userType === 'candidate'}
            aria-label="Select job candidate role"
          >
            <div className="flex items-center mb-1">
              <User className="w-5 h-5 mr-2" aria-hidden="true" />
              <span className="font-semibold">Job Candidate</span>
            </div>
            <span className="text-xs opacity-75">I'm applying for a job or just got hired</span>
          </button>
          <button
            onClick={() => onUserTypeChange('employer')}
            className={`flex flex-col items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 min-h-[80px] focus-visible ${
              userType === 'employer'
                ? 'btn-primary shadow-md'
                : 'btn-ghost hover:bg-white'
            }`}
            aria-pressed={userType === 'employer'}
            aria-label="Select employer role"
          >
            <div className="flex items-center mb-1">
              <Building2 className="w-5 h-5 mr-2" aria-hidden="true" />
              <span className="font-semibold">Employer</span>
            </div>
            <span className="text-xs opacity-75">I'm hiring someone and need their paperwork</span>
          </button>
        </div>
      </div>

      {/* Content based on user type */}
      <div className="mb-8 animate-fade-in">
        {userType === 'candidate' ? (
          <div className="card p-8 bg-gray-50 border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4 font-poppins">
              What You'll Do
            </h3>
            <p className="text-sm md:text-base text-gray35 font-poppins leading-relaxed mb-6">
              This form helps employers access hiring incentives designed to give qualified candidates 
              like you a better chance at employment. Completing it strengthens your application and 
              demonstrates your eligibility for these opportunity programs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Share basic information about yourself</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Upload documents you likely already have</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Answer a few simple questions about your background</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Confirm your start date and basic info</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 bg-gray-50 border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold text-black mb-4 font-poppins">
              What You'll Do
            </h3>
            <p className="text-sm md:text-base text-gray35 font-poppins leading-relaxed mb-6">
              Set up your company information and manage tax credit applications for your employees. 
              Streamline your hiring process while maximizing available tax savings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Add your company information</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Manage employee applications</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Complete required tax forms</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span>Submit to state agencies</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons - This will be moved outside */}
      
    </div>
  );
};