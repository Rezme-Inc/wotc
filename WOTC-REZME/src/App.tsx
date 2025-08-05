import React, { useState } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { WelcomeStep } from './components/WelcomeStep';
import { PersonalInfoStep } from './components/PersonalInfoStep';
import { EmployerInfoStep } from './components/EmployerInfoStep';
import { TargetGroupsStep } from './components/TargetGroupsStep';
import { ImportantDatesStep } from './components/ImportantDatesStep';
import { ValidationStep } from './components/ValidationStep';
import { CompletionStep } from './components/CompletionStep';
import { EmployerDashboard } from './components/EmployerDashboard';
import { WOTCFormData, PersonalInfo, ImportantDates, TargetGroup } from './types/wotc';
import { TARGET_GROUPS } from './data/targetGroups';
import { CheckCircle, FileText } from 'lucide-react';

const CANDIDATE_STEPS = 6;
const EMPLOYER_STEPS = 5;

// Helper function to get initial dates based on user type
const getInitialDates = (userType: 'candidate' | 'employer'): ImportantDates => {
  if (userType === 'employer') {
    // Prefill with demo data for employer confirmation
    const today = new Date();
    const gaveInfo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days ago
    const offered = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    const hired = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const started = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    
    return {
      dateGaveInfo: gaveInfo.toISOString().split('T')[0],
      dateOffered: offered.toISOString().split('T')[0],
      dateHired: hired.toISOString().split('T')[0],
      dateStarted: started.toISOString().split('T')[0]
    };
  }
  
  return {
    dateGaveInfo: '',
    dateOffered: '',
    dateHired: '',
    dateStarted: ''
  };
};

function App() {
  const [formData, setFormData] = useState<WOTCFormData>({
    userType: 'candidate',
    personalInfo: {
      fullName: '',
      socialSecurityNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      cityStateZip: '',
      county: '',
      telephoneNumber: '',
      dateOfBirth: '',
      conditionalCertification: false,
      targetGroupStatements: false,
      veteranUnemployed6Months: false,
      veteranDisabledDischarged: false,
      veteranDisabledUnemployed6Months: false,
      tanfFamily: false,
      unemploymentCompensation: false
    },
    targetGroups: TARGET_GROUPS,
    importantDates: getInitialDates('candidate'),
    currentStep: 1,
    isComplete: false
  });

  const [showDashboard, setShowDashboard] = useState(false);

  const [employerInfo, setEmployerInfo] = useState({
    companyName: '',
    employerEIN: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    contactName: '',
    contactTitle: '',
    contactPhone: '',
    contactEmail: '',
    jobTitle: '',
    startDate: '',
    hourlyWage: '',
    hoursPerWeek: ''
  });

  const totalSteps = formData.userType === 'candidate' ? CANDIDATE_STEPS : EMPLOYER_STEPS;

  const updatePersonalInfo = (info: PersonalInfo) => {
    setFormData(prev => ({ ...prev, personalInfo: info }));
  };

  const updateTargetGroups = (groups: TargetGroup[]) => {
    setFormData(prev => ({ ...prev, targetGroups: groups }));
  };

  const updateImportantDates = (dates: ImportantDates) => {
    setFormData(prev => ({ ...prev, importantDates: dates }));
  };

  const updateEmployerInfo = (info: typeof employerInfo) => {
    setEmployerInfo(info);
  };

  const handleUserTypeChange = (type: 'candidate' | 'employer') => {
    setFormData(prev => ({ 
      ...prev, 
      userType: type,
      currentStep: 1,
      isComplete: false,
      importantDates: getInitialDates(type)
    }));
  };

  const nextStep = () => {
    setFormData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const previousStep = () => {
    setFormData(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const completeForm = () => {
    if (formData.userType === 'employer') {
      setShowDashboard(true);
    } else {
      setFormData(prev => ({ ...prev, isComplete: true }));
    }
  };

  const loginToDashboard = () => {
    setShowDashboard(true);
  };

  const handleNewApplication = () => {
    setShowDashboard(false);
    setFormData(prev => ({
      ...prev,
      currentStep: 1,
      isComplete: false,
      personalInfo: {
        fullName: '',
        socialSecurityNumber: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        county: '',
        telephoneNumber: '',
        dateOfBirth: '',
        conditionalCertification: false,
        targetGroupStatements: false,
        veteranUnemployed6Months: false,
        veteranDisabledDischarged: false,
        veteranDisabledUnemployed6Months: false,
        tanfFamily: false,
        unemploymentCompensation: false
      },
      targetGroups: TARGET_GROUPS,
      importantDates: getInitialDates(formData.userType)
    }));
    setEmployerInfo({
      companyName: '',
      employerEIN: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      contactName: '',
      contactTitle: '',
      contactPhone: '',
      contactEmail: '',
      jobTitle: '',
      startDate: '',
      hourlyWage: '',
      hoursPerWeek: ''
    });
  };

  if (showDashboard) {
    return (
      <EmployerDashboard
        employerInfo={{
          companyName: employerInfo.companyName,
          contactName: employerInfo.contactName,
          contactEmail: employerInfo.contactEmail,
          contactPhone: employerInfo.contactPhone
        }}
        onNewApplication={handleNewApplication}
      />
    );
  }

  if (formData.isComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-poppins">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
            <CheckCircle className="w-14 h-14 text-black" />
          </div>
          {formData.userType === 'candidate' ? (
            <>
              <h1 className="text-4xl font-semibold text-black mb-6 font-poppins">
                WOTC Pre-Screening Complete
              </h1>
              <p className="text-xl text-gray35 mb-10 font-poppins font-light leading-relaxed">
                Thank you for completing the Work Opportunity Tax Credit pre-screening process. 
                Your Form 8850 has been prepared and is ready for submission to the State Workforce Agency.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-semibold text-black mb-6 font-poppins">
                Employer Section Complete
              </h1>
              <p className="text-xl text-gray35 mb-10 font-poppins font-light leading-relaxed">
                Thank you for completing the employer section of Form 8850. 
                The form has been submitted to the State Workforce Agency for processing.
              </p>
            </>
          )}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-black mr-3" />
              <span className="text-xl font-medium text-black font-poppins">Form 8850 Ready</span>
            </div>
            <p className="text-base text-gray35 font-poppins font-light leading-relaxed">
              {formData.userType === 'candidate' 
                ? 'Your employer will receive the completed documentation for processing with the appropriate state agency.'
                : 'The completed Form 8850 has been processed and submitted to the appropriate state agency.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-black mb-3 font-poppins">
              Rézme WOTC Compliance Assistant
            </h1>
            <p className="text-gray35 font-poppins font-light text-lg">
              Work Opportunity Tax Credit {formData.userType === 'candidate' ? 'Pre-Screening' : 'Employer'} Portal
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={formData.currentStep} totalSteps={totalSteps} userType={formData.userType} />

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100">
            {formData.currentStep === 1 && (
              <WelcomeStep 
                onNext={nextStep}
                userType={formData.userType}
                onUserTypeChange={handleUserTypeChange}
                onLoginToDashboard={loginToDashboard}
              />
            )}
            
            {formData.currentStep === 2 && formData.userType === 'candidate' && (
              <PersonalInfoStep
                personalInfo={formData.personalInfo}
                onUpdate={updatePersonalInfo}
                onNext={nextStep}
                onPrevious={previousStep}
              />
            )}
            
            {formData.currentStep === 2 && formData.userType === 'employer' && (
              <EmployerInfoStep
                employerInfo={employerInfo}
                onUpdate={updateEmployerInfo}
                onNext={nextStep}
                onPrevious={previousStep}
              />
            )}
            
            {formData.currentStep === 3 && formData.userType === 'candidate' && (
              <TargetGroupsStep
                targetGroups={formData.targetGroups}
                onUpdate={updateTargetGroups}
                onNext={nextStep}
                onPrevious={previousStep}
              />
            )}
            
            {formData.currentStep === 3 && formData.userType === 'employer' && (
              <ImportantDatesStep
                importantDates={formData.importantDates}
                onUpdate={updateImportantDates}
                onNext={nextStep}
                onPrevious={previousStep}
                userType={formData.userType}
              />
            )}
            
            {formData.currentStep === 4 && formData.userType === 'employer' && (
              <ValidationStep
                formData={formData}
                userType={formData.userType}
                onNext={nextStep}
                onPrevious={previousStep}
              />
            )}
            
            {formData.currentStep === 4 && formData.userType === 'candidate' && (
              <ImportantDatesStep
                importantDates={formData.importantDates}
                onUpdate={updateImportantDates}
                onNext={nextStep}
                onPrevious={previousStep}
                userType={formData.userType}
              />
            )}
            
            {formData.currentStep === 5 && formData.userType === 'employer' && (
              <CompletionStep
                formData={formData}
                employerInfo={employerInfo}
                onComplete={completeForm}
              />
            )}
            
            {formData.currentStep === 5 && formData.userType === 'candidate' && (
              <ValidationStep
                formData={formData}
                userType={formData.userType}
                onNext={nextStep}
                onPrevious={previousStep}
              />
            )}
            
            {formData.currentStep === 6 && formData.userType === 'candidate' && (
              <CompletionStep
                formData={formData}
                employerInfo={employerInfo}
                onComplete={completeForm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;