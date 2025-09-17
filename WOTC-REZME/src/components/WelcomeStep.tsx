import React from 'react';
import { User, Building2 } from 'lucide-react';

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
  return (
    <div className="max-w-4xl mx-auto text-center section-spacing">
      {/* Getting Started Section */}
      <div className="mb-12 card p-8 bg-blue-50 border-blue-200">
        <h2 className="text-2xl font-semibold text-black mb-4 font-poppins">
           Getting Started - 3 Simple Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-semibold">
              1
            </div>
            <h3 className="font-semibold text-black mb-2">Tell us about yourself</h3>
            <p className="text-sm text-gray35">2-3 minutes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-semibold">
              2
            </div>
            <h3 className="font-semibold text-black mb-2">Upload a few documents</h3>
            <p className="text-sm text-gray35">2-3 minutes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-semibold">
              3
            </div>
            <h3 className="font-semibold text-black mb-2">Review and submit</h3>
            <p className="text-sm text-gray35">1-2 minutes</p>
          </div>
        </div>
        <p className="text-gray35 font-poppins">
          This helps employers see the value you bring and access programs designed to support your employment.
        </p>
      </div>

      {/* User Type Toggle */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4 font-poppins">
          Who is filling out this form?
        </h2>
        <p className="text-gray35 mb-6 font-poppins">
          Choose the option that best describes you:
        </p>
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
      <div className="mb-12 animate-fade-in">
        {userType === 'candidate' ? (
          <div className="card p-8 bg-gray-50 border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-black mb-4 font-poppins">
              What You'll Do
            </h3>
            <p className="text-gray35 font-poppins leading-relaxed mb-6">
              This form helps employers access hiring incentives designed to give qualified candidates 
              like you a better chance at employment. Completing it strengthens your application and 
              demonstrates your eligibility for these opportunity programs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
            <h3 className="text-xl font-semibold text-black mb-4 font-poppins">
              What You'll Do
            </h3>
            <p className="text-gray35 font-poppins leading-relaxed mb-6">
              Set up your company information and manage tax credit applications for your employees. 
              Streamline your hiring process while maximizing available tax savings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onNext}
          className="btn-primary px-8 py-4 text-lg font-poppins min-w-[200px]"
          aria-label={`Start ${userType === 'candidate' ? 'candidate' : 'employer'} application process`}
        >
          {userType === 'candidate' ? 'Start My Application' : 'Set Up My Company'}
        </button>
        
        {userType === 'employer' && onLoginToDashboard && (
          <button
            onClick={onLoginToDashboard}
            className="btn-secondary px-8 py-4 text-lg font-poppins min-w-[200px]"
            aria-label="Access existing employer dashboard"
          >
            View My Dashboard
          </button>
        )}
      </div>

      {/* Additional information */}
      <div className="mt-12 card p-6 bg-blue-50 border-blue-200 max-w-2xl mx-auto">
        <h4 className="text-base font-semibold text-black mb-3 font-poppins">
          About the Work Opportunity Tax Credit
        </h4>
        <p className="text-sm text-gray35 font-poppins leading-relaxed">
          The WOTC program provides federal tax credits to employers who hire individuals 
          from certain target groups that have consistently faced significant barriers to 
          employment. Credits can range from $1,200 to $9,600 per qualified employee.
        </p>
      </div>
    </div>
  );
};