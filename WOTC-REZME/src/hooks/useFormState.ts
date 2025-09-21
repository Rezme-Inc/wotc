import { useState, useCallback } from 'react';
import { WOTCFormData, PersonalInfo, ImportantDates, TargetGroup, DocumentUpload, EmployerInfo, WOTCApplication, UserProfile } from '../types/wotc';
import { TARGET_GROUPS } from '../data/targetGroups';
import { CANDIDATE_STEPS, EMPLOYER_STEPS } from '../utils/constants';

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

const getInitialPersonalInfo = (): PersonalInfo => ({
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
  veteranUnemployed4to6Months: false,
  veteranDisabledDischarged: false,
  veteranDisabledUnemployed6Months: false,
  tanfFamily: false,
  unemploymentCompensation: false
});

const getInitialEmployerInfo = (): EmployerInfo => ({
  companyName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  jobTitle: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: ''
});

export const useFormState = () => {
  const [formData, setFormData] = useState<WOTCFormData>({
    userType: 'candidate',
    personalInfo: getInitialPersonalInfo(),
    targetGroups: TARGET_GROUPS,
    importantDates: getInitialDates('candidate'),
    documents: [],
    currentStep: 1,
    isComplete: false,
    documentationComplete: false
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: '',
    applications: [],
    currentApplicationId: undefined
  });

  const [currentEmployerInfo, setCurrentEmployerInfo] = useState<EmployerInfo>(getInitialEmployerInfo());
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSignUpLogin, setShowSignUpLogin] = useState(false);
  const [showEmployerSelection, setShowEmployerSelection] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const totalSteps = formData.userType === 'candidate' ? CANDIDATE_STEPS : EMPLOYER_STEPS;

  const updatePersonalInfo = useCallback((info: PersonalInfo) => {
    setFormData((prev: WOTCFormData) => ({ ...prev, personalInfo: info }));
  }, []);

  const updateTargetGroups = useCallback((groups: TargetGroup[]) => {
    setFormData((prev: WOTCFormData) => ({ ...prev, targetGroups: groups }));
  }, []);

  const updateImportantDates = useCallback((dates: ImportantDates) => {
    setFormData((prev: WOTCFormData) => ({ ...prev, importantDates: dates }));
  }, []);

  const updateDocuments = useCallback((documents: DocumentUpload[]) => {
    setFormData((prev: WOTCFormData) => ({ ...prev, documents }));
  }, []);

  const handleUserTypeChange = useCallback((type: 'candidate' | 'employer') => {
    setFormData((prev: WOTCFormData) => ({ 
      ...prev, 
      userType: type,
      currentStep: 1,
      isComplete: false,
      importantDates: getInitialDates(type)
    }));
  }, []);

  const nextStep = useCallback(() => {
    setFormData((prev: WOTCFormData) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const previousStep = useCallback(() => {
    setFormData((prev: WOTCFormData) => ({ ...prev, currentStep: prev.currentStep - 1 }));
  }, []);

  // Start new application flow
  const startNewApplication = useCallback(() => {
    if (isAuthenticated) {
      // For authenticated users, show employer selection
      setShowEmployerSelection(true);
      setShowDashboard(false);
    } else {
      // For non-authenticated users, start normal flow
      resetForm();
    }
  }, [isAuthenticated]);

  // Handle employer selection completion
  const handleEmployerSelection = useCallback((employerInfo: EmployerInfo) => {
    setCurrentEmployerInfo(employerInfo);
    setShowEmployerSelection(false);
    setFormData((prev: WOTCFormData) => ({
      ...prev,
      userType: 'candidate',
      currentStep: 2, // Skip welcome step, go directly to personal info
      isComplete: false,
      personalInfo: getInitialPersonalInfo(),
      targetGroups: TARGET_GROUPS.map(group => ({ ...group, selected: false })),
      importantDates: getInitialDates('candidate'),
      documents: [],
      documentationComplete: false
    }));
  }, []);

  // Cancel employer selection
  const cancelEmployerSelection = useCallback(() => {
    setShowEmployerSelection(false);
    setShowDashboard(true);
  }, []);

  const completeForm = useCallback(() => {
    const completedApplication: WOTCApplication = {
      id: `app-${Date.now()}`,
      employerInfo: currentEmployerInfo,
      personalInfo: formData.personalInfo,
      targetGroups: formData.targetGroups,
      importantDates: formData.importantDates,
      documents: formData.documents,
      isComplete: true,
      createdDate: new Date().toISOString(),
      submittedDate: new Date().toISOString()
    };

    if (isAuthenticated) {
      // For authenticated users, add to their applications and go back to dashboard
      setUserProfile((prev: UserProfile) => ({
        ...prev,
        applications: [...prev.applications, completedApplication]
      }));
      setFormData((prev: WOTCFormData) => ({ ...prev, isComplete: true }));
      setShowDashboard(true);
    } else {
      // For non-authenticated users, show sign-up/login
      setFormData((prev: WOTCFormData) => ({ ...prev, isComplete: true }));
      if (formData.userType === 'employer') {
        setShowDashboard(true);
      } else {
        setShowSignUpLogin(true);
      }
    }
  }, [formData, currentEmployerInfo, isAuthenticated]);

  const handleSignUpComplete = useCallback((email: string, password: string) => {
    // Create initial application from completed form
    const initialApplication: WOTCApplication = {
      id: `app-${Date.now()}`,
      employerInfo: currentEmployerInfo,
      personalInfo: formData.personalInfo,
      targetGroups: formData.targetGroups,
      importantDates: formData.importantDates,
      documents: formData.documents,
      isComplete: true,
      createdDate: new Date().toISOString(),
      submittedDate: new Date().toISOString()
    };

    setUserProfile({
      email,
      applications: [initialApplication],
      currentApplicationId: initialApplication.id
    });
    setIsAuthenticated(true);
    setShowSignUpLogin(false);
    setShowDashboard(true);
  }, [formData, currentEmployerInfo]);

  const handleLoginComplete = useCallback((email: string, password: string) => {
    // In a real app, you'd fetch user data from server
    // For now, we'll create a profile with the current application if completing a form
    if (formData.isComplete) {
      const newApplication: WOTCApplication = {
        id: `app-${Date.now()}`,
        employerInfo: currentEmployerInfo,
        personalInfo: formData.personalInfo,
        targetGroups: formData.targetGroups,
        importantDates: formData.importantDates,
        documents: formData.documents,
        isComplete: true,
        createdDate: new Date().toISOString(),
        submittedDate: new Date().toISOString()
      };

      setUserProfile({
        email,
        applications: [newApplication],
        currentApplicationId: newApplication.id
      });
    } else {
      setUserProfile({
        email,
        applications: [],
        currentApplicationId: undefined
      });
    }

    setIsAuthenticated(true);
    setShowSignUpLogin(false);
    setShowDashboard(true);
  }, [formData, currentEmployerInfo]);

  const loginToDashboard = useCallback(() => {
    setShowDashboard(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserProfile({
      email: '',
      applications: [],
      currentApplicationId: undefined
    });
    setCurrentEmployerInfo(getInitialEmployerInfo());
    setShowDashboard(false);
    setShowSignUpLogin(false);
    setShowEmployerSelection(false);
    resetForm();
  }, []);

  const resetForm = useCallback(() => {
    setShowDashboard(false);
    setShowSignUpLogin(false);
    setShowEmployerSelection(false);
    setCurrentEmployerInfo(getInitialEmployerInfo());
    setFormData((prev: WOTCFormData) => ({
      userType: 'candidate',
      personalInfo: getInitialPersonalInfo(),
      targetGroups: TARGET_GROUPS.map(group => ({ ...group, selected: false })),
      importantDates: getInitialDates('candidate'),
      documents: [],
      currentStep: 1,
      isComplete: false,
      documentationComplete: false
    }));
  }, []);

  return {
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
    resetForm,
    setShowDashboard
  };
}; 