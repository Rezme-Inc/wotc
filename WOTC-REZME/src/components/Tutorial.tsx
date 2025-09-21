import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, HelpCircle, Target, FileText, Calendar, CheckCircle, Upload, User, Building } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  element?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  category: 'navigation' | 'form' | 'features' | 'actions';
}

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserType: 'candidate' | 'employer';
  currentStep?: number;
}

export default function Tutorial({ isOpen, onClose, currentUserType, currentStep = 0 }: TutorialProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  // Tutorial steps for candidates
  const candidateSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to WOTC Application',
      content: 'The Work Opportunity Tax Credit (WOTC) program helps employers receive tax credits for hiring individuals from certain target groups. This platform guides you through the application process step by step.',
      position: 'bottom',
      category: 'navigation'
    },
    {
      id: 'header-logo',
      title: 'rézme Logo & Navigation',
      content: 'The rézme logo represents our Tax Credit Management platform. The header contains navigation links and your account information.',
      element: 'header',
      position: 'bottom',
      category: 'navigation'
    },
    {
      id: 'step-indicator',
      title: 'Progress Indicator',
      content: 'This shows your current progress through the 7-step application process. Each step must be completed to move forward.',
      element: '.step-indicator',
      position: 'bottom',
      category: 'navigation'
    },
    {
      id: 'personal-info',
      title: 'Step 1: Personal Information',
      content: 'Provide your basic personal details including name, Social Security Number, address, and contact information. All fields marked with * are required.',
      element: '.personal-info-form',
      position: 'right',
      category: 'form'
    },
    {
      id: 'form-validation',
      title: 'Form Validation',
      content: 'Real-time validation ensures your information is entered correctly. Red indicators show required fields or errors that need attention.',
      position: 'top',
      category: 'features'
    },
    {
      id: 'target-groups',
      title: 'Step 3: Target Groups',
      content: 'Select all target groups that apply to you. These categories determine your eligibility for WOTC benefits. You can select multiple groups if applicable.',
      element: '.target-groups-section',
      position: 'right',
      category: 'form'
    },
    {
      id: 'target-group-cards',
      title: 'Understanding Target Groups',
      content: 'Each card represents a different WOTC category (Veterans, SNAP recipients, etc.). Click to select those that apply to your situation.',
      position: 'bottom',
      category: 'features'
    },
    {
      id: 'document-upload',
      title: 'Step 4: Document Upload',
      content: 'Upload supporting documents for your selected target groups. Each category has specific document requirements shown below.',
      element: '.document-upload-section',
      position: 'right',
      category: 'form'
    },
    {
      id: 'drag-drop',
      title: 'File Upload Methods',
      content: 'You can drag and drop files directly onto the upload areas or click "Browse Files" to select from your device. Supported formats: PDF, JPG, PNG, DOC.',
      position: 'top',
      category: 'features'
    },
    {
      id: 'document-preview',
      title: 'Document Preview',
      content: 'After uploading, you can preview your documents by clicking "View Uploaded". This opens a modal to verify your files are correct.',
      position: 'bottom',
      category: 'features'
    },
    {
      id: 'important-dates',
      title: 'Step 5: Important Dates',
      content: 'Enter key employment dates including hire date, start date, and any relevant program participation dates. These affect your WOTC eligibility.',
      element: '.important-dates-form',
      position: 'right',
      category: 'form'
    },
    {
      id: 'date-validation',
      title: 'Date Requirements',
      content: 'Dates must be in MM/DD/YYYY format and follow logical order (hire date before start date). The system validates these automatically.',
      position: 'top',
      category: 'features'
    },
    {
      id: 'validation-step',
      title: 'Step 6: Review & Validation',
      content: 'Review all your information for accuracy. This step shows a summary of everything you\'ve entered and highlights any missing or incorrect information.',
      element: '.validation-summary',
      position: 'right',
      category: 'form'
    },
    {
      id: 'completion',
      title: 'Step 7: Completion',
      content: 'Your application is complete! You\'ll receive confirmation and next steps. Keep your reference number for future inquiries.',
      element: '.completion-section',
      position: 'bottom',
      category: 'actions'
    },
    {
      id: 'navigation-buttons',
      title: 'Navigation Controls',
      content: 'Use "Previous" and "Next" buttons to move between steps. "Next" is only enabled when current step requirements are met.',
      element: '.navigation-buttons',
      position: 'top',
      category: 'actions'
    },
    {
      id: 'footer-info',
      title: 'Footer Resources',
      content: 'The footer contains important links including privacy policy, terms of service, and contact information for support.',
      element: 'footer',
      position: 'top',
      category: 'navigation'
    }
  ];

  // Tutorial steps for employers
  const employerSteps: TutorialStep[] = [
    {
      id: 'welcome-employer',
      title: 'Employer Dashboard Welcome',
      content: 'Welcome to your WOTC Employer Dashboard. Here you can manage applications, track certified employees, and monitor your tax credit benefits.',
      position: 'bottom',
      category: 'navigation'
    },
    {
      id: 'dashboard-stats',
      title: 'Application Statistics',
      content: 'View real-time statistics of your WOTC applications including total applications, pending reviews, certified employees, and estimated tax credits.',
      element: '.dashboard-stats',
      position: 'bottom',
      category: 'features'
    },
    {
      id: 'application-tabs',
      title: 'Application Management Tabs',
      content: 'Switch between "All Applications" and "Certified Employees" to view different aspects of your WOTC program participation.',
      element: '.dashboard-tabs',
      position: 'bottom',
      category: 'navigation'
    },
    {
      id: 'application-table',
      title: 'Application Table',
      content: 'View detailed information about each application including employee name, target group, application date, status, and potential credit amount.',
      element: '.applications-table',
      position: 'top',
      category: 'features'
    },
    {
      id: 'status-indicators',
      title: 'Status Indicators',
      content: 'Color-coded status badges show the current state of each application: Pending (yellow), Approved (green), Under Review (blue), Denied (red).',
      position: 'bottom',
      category: 'features'
    },
    {
      id: 'action-buttons',
      title: 'Application Actions',
      content: 'Use action buttons to view application details, download certificates, or take required actions on pending applications.',
      position: 'top',
      category: 'actions'
    },
    {
      id: 'employer-info',
      title: 'Employer Information',
      content: 'Manage your company information including EIN, business name, address, and contact details. This information is used for all WOTC applications.',
      element: '.employer-info-section',
      position: 'right',
      category: 'form'
    }
  ];

  const currentSteps = currentUserType === 'candidate' ? candidateSteps : employerSteps;

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setShowTooltip(true);
    }
  }, [isOpen]);

  const nextStep = () => {
    if (activeStep < currentSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  if (!isOpen) return null;

  const currentTutorialStep = currentSteps[activeStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      
      {/* Tutorial Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-cinnabar text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">WOTC Platform Tutorial</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {activeStep + 1} of {currentSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((activeStep + 1) / currentSteps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-cinnabar h-2 rounded-full transition-all duration-300"
                style={{ width: `${((activeStep + 1) / currentSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              {currentTutorialStep.category === 'navigation' && <Target className="w-5 h-5 text-blue-500" />}
              {currentTutorialStep.category === 'form' && <FileText className="w-5 h-5 text-green-500" />}
              {currentTutorialStep.category === 'features' && <CheckCircle className="w-5 h-5 text-purple-500" />}
              {currentTutorialStep.category === 'actions' && <Upload className="w-5 h-5 text-orange-500" />}
              <h3 className="text-lg font-semibold text-gray-800">
                {currentTutorialStep.title}
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-base">
              {currentTutorialStep.content}
            </p>
          </div>

          {/* Step Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {currentSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`p-3 rounded-lg text-left transition-all duration-200 ${
                  index === activeStep
                    ? 'bg-cinnabar text-white shadow-md'
                    : index < activeStep
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium truncate">
                    {step.title}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  {step.category === 'navigation' && <Target className="w-3 h-3 mr-1" />}
                  {step.category === 'form' && <FileText className="w-3 h-3 mr-1" />}
                  {step.category === 'features' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {step.category === 'actions' && <Upload className="w-3 h-3 mr-1" />}
                  <span className="text-xs capitalize opacity-75">
                    {step.category}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Key Features Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Key Platform Features:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start space-x-2">
                <User className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <span className="text-sm font-medium">Personal Information</span>
                  <p className="text-xs text-gray-600">Secure collection of candidate details</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <span className="text-sm font-medium">Target Group Selection</span>
                  <p className="text-xs text-gray-600">Choose applicable WOTC categories</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Upload className="w-4 h-4 text-purple-500 mt-0.5" />
                <div>
                  <span className="text-sm font-medium">Document Upload</span>
                  <p className="text-xs text-gray-600">Submit required supporting documents</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Calendar className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <span className="text-sm font-medium">Date Management</span>
                  <p className="text-xs text-gray-600">Track important employment dates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Save your progress frequently - the system auto-saves as you go</li>
              <li>• Have all required documents ready before starting the upload step</li>
              <li>• Double-check all dates for accuracy to avoid processing delays</li>
              <li>• Contact support if you're unsure about target group eligibility</li>
            </ul>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {currentSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeStep
                    ? 'bg-cinnabar'
                    : index < activeStep
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={activeStep === currentSteps.length - 1 ? onClose : nextStep}
            className="flex items-center space-x-2 px-4 py-2 bg-cinnabar text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <span>{activeStep === currentSteps.length - 1 ? 'Finish' : 'Next'}</span>
            {activeStep < currentSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
} 