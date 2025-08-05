import React from 'react';
import { FileText, Clock, ArrowRight, Building2, User } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  userType: 'candidate' | 'employer';
  onUserTypeChange: (type: 'candidate' | 'employer') => void;
  onLoginToDashboard?: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, userType, onUserTypeChange, onLoginToDashboard }) => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* User Type Toggle */}
      <div className="mb-8">
        <div className="bg-gray-50 rounded-xl p-2 inline-flex border border-gray-200">
          <button
            onClick={() => onUserTypeChange('candidate')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              userType === 'candidate'
                ? 'bg-black text-white shadow-md'
                : 'text-gray35 hover:text-black hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            Job Candidate
          </button>
          <button
            onClick={() => onUserTypeChange('employer')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              userType === 'employer'
                ? 'bg-black text-white shadow-md'
                : 'text-gray35 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Employer
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
          {userType === 'candidate' ? (
            <User className="w-12 h-12 text-black" />
          ) : (
            <Building2 className="w-12 h-12 text-black" />
          )}
        </div>
        
        {userType === 'candidate' ? (
          <>
            <h1 className="text-4xl font-semibold text-black mb-6 font-poppins">
              Welcome to Rézme's Work Opportunity Tax Credit Pre-Screening Portal
            </h1>
            <p className="text-xl text-gray35 mb-10 font-poppins font-light leading-relaxed">
              I'll guide you through Form 8850. It should take about 5 minutes. Shall we begin?
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-semibold text-black mb-6 font-poppins">
              Employer Portal - Complete Form 8850
            </h1>
            <p className="text-xl text-gray35 mb-10 font-poppins font-light leading-relaxed">
              Complete the employer section of Form 8850 for your job candidate. This will take about 3 minutes.
            </p>
          </>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 mb-10 border border-gray-100">
        <div className="flex items-center justify-center mb-6">
          <Clock className="w-6 h-6 text-black mr-3" />
          <span className="text-black font-medium font-poppins text-lg">
            Estimated Time: {userType === 'candidate' ? '5' : '3'} minutes
          </span>
        </div>
        <div className="text-gray35 font-poppins">
          <p className="mb-4 font-medium">
            {userType === 'candidate' ? 'This pre-screening will collect:' : 'This process will collect:'}
          </p>
          {userType === 'candidate' ? (
            <ul className="list-disc list-inside space-y-2 text-left max-w-lg mx-auto font-light">
              <li>Your personal information</li>
              <li>Applicable target group categories</li>
              <li>Important employment dates</li>
              <li>Electronic signature for compliance</li>
            </ul>
          ) : (
            <ul className="list-disc list-inside space-y-2 text-left max-w-lg mx-auto font-light">
              <li>Company information</li>
              <li>Job position details</li>
              <li>Employment verification</li>
              <li>Employer signature and submission</li>
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white border-l-4 border-cinnabar rounded-lg p-6 mb-10 shadow-sm">
        <p className="text-sm text-gray35 font-poppins font-light leading-relaxed">
          <strong className="font-medium text-black">Important:</strong> This information is used to determine eligibility for the Work Opportunity Tax Credit. 
          All information provided will be kept confidential and used only for compliance purposes.
        </p>
      </div>

      <button
        onClick={onNext}
        className="bg-black hover:bg-gray-800 text-white font-medium py-4 px-10 rounded-xl transition-all duration-200 flex items-center mx-auto font-poppins text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        {userType === 'candidate' ? 'Begin Pre-Screening' : 'Begin Employer Section'}
        <ArrowRight className="ml-3 w-6 h-6" />
      </button>
      
      {userType === 'employer' && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoginToDashboard}
            className="text-black hover:text-gray-800 font-medium underline transition-colors duration-200 font-poppins"
          >
            Already have an account? Login to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};