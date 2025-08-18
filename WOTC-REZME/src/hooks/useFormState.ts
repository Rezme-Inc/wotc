import { useState, useCallback } from 'react';
import { WOTCFormData, PersonalInfo, ImportantDates, TargetGroup, DocumentUpload } from '../types/wotc';
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

  const [showDashboard, setShowDashboard] = useState(false);

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

  const completeForm = useCallback(() => {
    if (formData.userType === 'employer') {
      setShowDashboard(true);
    } else {
      setFormData((prev: WOTCFormData) => ({ ...prev, isComplete: true }));
    }
  }, [formData.userType]);

  const loginToDashboard = useCallback(() => {
    setShowDashboard(true);
  }, []);

  const resetForm = useCallback(() => {
    setShowDashboard(false);
    setFormData((prev: WOTCFormData) => ({
      ...prev,
      currentStep: 1,
      isComplete: false,
      personalInfo: getInitialPersonalInfo(),
      targetGroups: TARGET_GROUPS,
      importantDates: getInitialDates(prev.userType),
      documents: [],
      documentationComplete: false
    }));
  }, []);

  return {
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
    resetForm,
    setShowDashboard
  };
}; 