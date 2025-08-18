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
      {/* User Type Toggle */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-black mb-6 font-poppins">
          Choose Your Role
        </h2>
        <div className="card inline-flex p-2 bg-gray-50 border-gray-200">
          <button
            onClick={() => onUserTypeChange('candidate')}
            className={`flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 min-h-[56px] focus-visible ${
              userType === 'candidate'
                ? 'btn-primary shadow-md'
                : 'btn-ghost hover:bg-white'
            }`}
            aria-pressed={userType === 'candidate'}
            aria-label="Select job candidate role"
          >
            <User className="w-5 h-5 mr-3" aria-hidden="true" />
            Job Candidate
          </button>
          <button
            onClick={() => onUserTypeChange('employer')}
            className={`flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-200 min-h-[56px] focus-visible ${
              userType === 'employer'
                ? 'btn-primary shadow-md'
                : 'btn-ghost hover:bg-white'
            }`}
            aria-pressed={userType === 'employer'}
            aria-label="Select employer role"
          >
            <Building2 className="w-5 h-5 mr-3" aria-hidden="true" />
            Employer
          </button>
        </div>
      </div>

      {/* Content based on user type */}
      <div className="mb-12 animate-fade-in">
        {userType === 'candidate' ? (
          <div className="card p-8 bg-gray-50 border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-black mb-4 font-poppins">
              For Job Candidates
            </h3>
            <p className="text-gray35 font-poppins leading-relaxed mb-6">
              Complete your WOTC pre-screening to help your employer determine if you qualify 
              for the Work Opportunity Tax Credit. This process typically takes 5-10 minutes 
              and helps ensure faster processing of your employment documentation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-cinnabar rounded-full mr-3 flex-shrink-0"></div>
                <span>Complete personal information</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-cinnabar rounded-full mr-3 flex-shrink-0"></div>
                <span>Upload supporting documents</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-cinnabar rounded-full mr-3 flex-shrink-0"></div>
                <span>Review target group categories</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-cinnabar rounded-full mr-3 flex-shrink-0"></div>
                <span>Validate employment dates</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 bg-gray-50 border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-black mb-4 font-poppins">
              For Employers
            </h3>
            <p className="text-gray35 font-poppins leading-relaxed mb-6">
              Complete the employer section of Form 8850 and manage your WOTC applications. 
              Streamline your hiring process while maximizing available tax credits for 
              qualifying employees.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-cinnabar rounded-full mr-3 flex-shrink-0"></div>
                <span>Company information setup</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-cinnabar rounded-full mr-3 flex-shrink-0"></div>
                <span>Application management dashboard</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-cinnabar rounded-full mr-3 flex-shrink-0"></div>
                <span>Form 8850 completion</span>
              </div>
              <div className="flex items-center text-gray35">
                <div className="w-2 h-2 bg-cinnabar rounded-full mr-3 flex-shrink-0"></div>
                <span>State agency submission</span>
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
          {userType === 'candidate' ? 'Start Pre-Screening' : 'Begin Employer Setup'}
        </button>
        
        {userType === 'employer' && onLoginToDashboard && (
          <button
            onClick={onLoginToDashboard}
            className="btn-secondary px-8 py-4 text-lg font-poppins min-w-[200px]"
            aria-label="Access existing employer dashboard"
          >
            Access Dashboard
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