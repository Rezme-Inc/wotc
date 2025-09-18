import React from 'react';
import { useFormState } from './hooks/useFormState';
import { useEmployerState } from './hooks/useEmployerState';
import { StepIndicator } from './components/StepIndicator';
import { WelcomeStep } from './components/WelcomeStep';
import { PersonalInfoStep } from './components/PersonalInfoStep';
import { EmployerInfoStep } from './components/EmployerInfoStep';
import { TargetGroupsStep } from './components/TargetGroupsStep';
import { ImportantDatesStep } from './components/ImportantDatesStep';
import { ValidationStep } from './components/ValidationStep';
import { CompletionStep } from './components/CompletionStep';
import DocumentUploadStep from './components/DocumentUploadStep';
import { EmployerDashboard } from './components/EmployerDashboard';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { CheckCircle } from 'lucide-react';

function AppRefactored() {
  const {
    formData,
    showDashboard,
    totalSteps,
    updatePersonalInfo,
    updateTargetGroups,
    updateImportantDates,
    updateDocuments,
    handleUserTypeChange,
    nextStep,
    previousStep,
    completeForm,
    loginToDashboard,
    resetForm
  } = useFormState();

  const {
    employerInfo,
    updateEmployerInfo
  } = useEmployerState();

  if (showDashboard) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <EmployerDashboard 
            employerInfo={{
              companyName: employerInfo.companyName,
              contactName: employerInfo.contactName,
              contactEmail: employerInfo.contactEmail,
              contactPhone: employerInfo.contactPhone
            }}
            onNewApplication={resetForm} 
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Full Width Gray Section - Title and Step Indicator */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="text-4xl font-semibold mb-4 font-poppins">
              <span className="text-black">Réz</span>
              <span className="text-red-600">me</span> Employment Application
            </h1>
            <p className="text-gray35 font-poppins font-light text-lg max-w-2xl mx-auto">
              Complete this quick form to keep your application moving forward
            </p>
          </header>

          {/* Step Indicator */}
          <StepIndicator 
            currentStep={formData.currentStep} 
            totalSteps={totalSteps} 
            userType={formData.userType} 
          />
        </div>
      </section>
      
      <div className="container-main flex-1">
        <div className="content-wrapper">
          <div className="max-w-6xl mx-auto">

          {/* Main Content Card */}
          <main>
            <div className="card-body p-6 lg:p-8">
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
              
              {formData.currentStep === 4 && formData.userType === 'candidate' && (
                <DocumentUploadStep
                  targetGroups={formData.targetGroups}
                  documents={formData.documents}
                  onUpdate={updateDocuments}
                  onNext={nextStep}
                  onPrevious={previousStep}
                />
              )}
              
              {formData.currentStep === 5 && formData.userType === 'candidate' && (
                <ImportantDatesStep
                  importantDates={formData.importantDates}
                  onUpdate={updateImportantDates}
                  onNext={nextStep}
                  onPrevious={previousStep}
                  userType={formData.userType}
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
              
              {formData.currentStep === 6 && formData.userType === 'candidate' && (
                <ValidationStep
                  formData={formData}
                  onNext={nextStep}
                  onPrevious={previousStep}
                  userType={formData.userType}
                />
              )}
              
              {formData.currentStep === 4 && formData.userType === 'employer' && (
                <ValidationStep
                  formData={formData}
                  onNext={nextStep}
                  onPrevious={previousStep}
                  userType={formData.userType}
                />
              )}
              
              {formData.currentStep === 7 && formData.userType === 'candidate' && (
                <CompletionStep
                  formData={formData}
                  employerInfo={employerInfo}
                  onComplete={completeForm}
                />
              )}
              
              {formData.currentStep === 5 && formData.userType === 'employer' && (
                <CompletionStep
                  formData={formData}
                  employerInfo={employerInfo}
                  onComplete={completeForm}
                />
              )}
            </div>
          </main>
        </div>
      </div>
      </div>
      
      {/* Gray Background Section for Action Buttons and Below */}
      <section className="bg-gray-50 flex-1">
        <div className="container-main">
          <div className="max-w-6xl mx-auto px-4">
              
              {/* Action buttons for WelcomeStep */}
              {formData.currentStep === 1 && (
                <div className="max-w-4xl mx-auto text-center pt-2">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <button
                      onClick={nextStep}
                      className="btn-primary px-8 py-4 text-lg font-poppins min-w-[200px]"
                      aria-label={`Start ${formData.userType === 'candidate' ? 'candidate' : 'employer'} application process`}
                    >
                      {formData.userType === 'candidate' ? 'Start My Application' : 'Set Up My Company'}
                    </button>
                    
                    {formData.userType === 'employer' && loginToDashboard && (
                      <button
                        onClick={loginToDashboard}
                        className="btn-secondary px-8 py-4 text-lg font-poppins min-w-[200px]"
                        aria-label="Access existing employer dashboard"
                      >
                        View My Dashboard
                      </button>
                    )}
                  </div>

                  {/* Additional information */}
                  <div className="max-w-2xl mx-auto">
                    <button
                      className="flex items-center justify-center w-full p-4 text-sm text-gray35 hover:text-black transition-colors duration-200 focus-visible"
                      aria-label="Toggle Work Opportunity Tax Credit information"
                    >
                      <span className="font-medium">About the Work Opportunity Tax Credit</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="text-center mt-8 py-4">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-cinnabar mr-2" />
                  <span className="text-sm text-gray35 font-poppins">
                    Secure & WOTC Compliant
                  </span>
                </div>
              </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default AppRefactored; 