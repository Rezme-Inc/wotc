import React, { useState } from 'react';
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
import { SignUpLogin } from './components/SignUpLogin';
import { CandidateDashboard } from './components/CandidateDashboard';
import { EmployerSelectionStep } from './components/EmployerSelectionStep';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const WOTCDropdown: React.FC = () => {
  const [showAbout, setShowAbout] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setShowAbout(!showAbout)}
        className="flex items-center justify-center w-full p-4 text-sm text-gray35 hover:text-black transition-colors duration-200 focus-visible"
        aria-expanded={showAbout}
        aria-label="Toggle Work Opportunity Tax Credit information"
      >
        <span className="font-medium">About the Work Opportunity Tax Credit</span>
        {showAbout ? (
          <ChevronUp className="w-4 h-4 ml-2" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-2" />
        )}
      </button>
      
      {showAbout && (
        <div className="card p-6 bg-blue-50 border-blue-200 animate-fade-in">
          <p className="text-sm text-gray35 font-poppins leading-relaxed">
            The WOTC program provides federal tax credits to employers who hire individuals 
            from certain target groups that have consistently faced significant barriers to 
            employment. Credits can range from $1,200 to $9,600 per qualified employee.
          </p>
        </div>
      )}
    </>
  );
};

function AppRefactored() {
  const {
    formData,
    userProfile,
    currentEmployerInfo,
    showDashboard,
    showSignUpLogin,
    showEmployerSelection,
    isAuthenticated,
    totalSteps,
    updatePersonalInfo,
    updateTargetGroups,
    updateImportantDates,
    updateDocuments,
    handleUserTypeChange,
    nextStep,
    previousStep,
    startNewApplication,
    handleEmployerSelection,
    cancelEmployerSelection,
    completeForm,
    handleSignUpComplete,
    handleLoginComplete,
    loginToDashboard,
    logout,
    goToWelcomePage,
    resetForm
  } = useFormState();

  const {
    employerInfo,
    updateEmployerInfo
  } = useEmployerState();

  // Show employer selection page for logged-in users starting new application
  if (showEmployerSelection) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onLogoClick={goToWelcomePage} />
        <div className="flex-1" style={{backgroundColor: 'var(--color-gray-light)', paddingTop: '5rem', paddingBottom: '5rem'}}>
          <div className="max-w-6xl mx-auto px-6">
            <EmployerSelectionStep 
              onNext={handleEmployerSelection}
              onBack={cancelEmployerSelection}
            />
          </div>
        </div>
        <Footer onLogoClick={goToWelcomePage} />
      </div>
    );
  }

  // Show sign-up/login page for candidates after form completion
  if (showSignUpLogin) {
    return (
      <SignUpLogin 
        formData={formData}
        onSignUpComplete={handleSignUpComplete}
        onLoginComplete={handleLoginComplete}
      />
    );
  }

  // Show dashboard based on user type
  if (showDashboard) {
    if (formData.userType === 'candidate' || isAuthenticated) {
      return (
        <CandidateDashboard 
          userProfile={userProfile}
          onNewApplication={startNewApplication}
          onLogout={logout}
        />
      );
    } else {
      return (
        <div className="min-h-screen flex flex-col">
          <Header onLogoClick={goToWelcomePage} />
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
          <Footer onLogoClick={goToWelcomePage} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogoClick={resetForm} />
      
      {/* Full Width Gray Section - Title and Step Indicator */}
      <section style={{backgroundColor: 'var(--color-gray-light)', paddingTop: '5rem', paddingBottom: '5rem'}}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-poppins">
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
      
      <section style={{backgroundColor: 'var(--color-background)', paddingTop: '5rem', paddingBottom: '5rem'}}>
        <div className="container-main flex-1">
          <div className="content-wrapper">
            <div className="max-w-6xl mx-auto">

          {/* Main Content Card */}
          <main>
            <div>
              {formData.currentStep === 1 && (
                <WelcomeStep 
                  userType={formData.userType}
                  onUserTypeChange={handleUserTypeChange}
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
                  documents={formData.documents}
                  onDocumentsUpdate={updateDocuments}
                  onNext={nextStep}
                  onPrevious={previousStep}
                  userType={formData.userType}
                />
              )}
              
              {formData.currentStep === 3 && formData.userType === 'employer' && (
                <ImportantDatesStep
                  importantDates={formData.importantDates}
                  onUpdate={updateImportantDates}
                  documents={formData.documents}
                  onDocumentsUpdate={updateDocuments}
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
      </section>
      
      {/* Gray Background Section for Action Buttons and Below */}
      <section className="flex-1" style={{backgroundColor: 'var(--color-gray-light)', paddingTop: '5rem', paddingBottom: '5rem'}}>
        <div className="max-w-6xl mx-auto px-4">
              
              {/* Action buttons for WelcomeStep */}
              {formData.currentStep === 1 && (
                <div className="max-w-4xl mx-auto text-center">
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
                    <WOTCDropdown />
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
      </section>
      
      <Footer onLogoClick={goToWelcomePage} />
    </div>
  );
}

export default AppRefactored; 