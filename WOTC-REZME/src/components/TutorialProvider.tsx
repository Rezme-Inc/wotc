import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TutorialContextType {
  showTutorial: boolean;
  currentUserType: 'candidate' | 'employer';
  currentStep: number;
  openTutorial: () => void;
  closeTutorial: () => void;
  setUserType: (type: 'candidate' | 'employer') => void;
  setCurrentStep: (step: number) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<'candidate' | 'employer'>('candidate');
  const [currentStep, setCurrentStep] = useState(0);

  const openTutorial = () => setShowTutorial(true);
  const closeTutorial = () => setShowTutorial(false);
  const setUserType = (type: 'candidate' | 'employer') => setCurrentUserType(type);

  return (
    <TutorialContext.Provider
      value={{
        showTutorial,
        currentUserType,
        currentStep,
        openTutorial,
        closeTutorial,
        setUserType,
        setCurrentStep
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}; 