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
import { CheckCircle, FileText } from 'lucide-react';

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
      <div className="container-main flex-1">
        <div className="content-wrapper">
          <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-black mb-4 font-poppins">
              Rézme WOTC Compliance Assistant
            </h1>
            <p className="text-gray35 font-poppins font-light text-lg max-w-2xl mx-auto">
              Work Opportunity Tax Credit {formData.userType === 'candidate' ? 'Pre-Screening' : 'Employer'} Portal
            </p>
          </header>

          {/* Step Indicator */}
          <StepIndicator 
            currentStep={formData.currentStep} 
            totalSteps={totalSteps} 
            userType={formData.userType} 
          />

          {/* Main Content Card */}
          <main className="card animate-fade-in">
            <div className="card-body p-8 lg:p-12">
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

          {/* Security Badge */}
          <div className="text-center mt-12 py-4">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-5 h-5 text-cinnabar mr-2" />
              <span className="text-sm text-gray35 font-poppins">
                Secure & WOTC Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default AppRefactored; 