export interface PersonalInfo {
  fullName: string;
  socialSecurityNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  telephoneNumber: string;
  dateOfBirth: string;
  conditionalCertification: boolean;
  targetGroupStatements: boolean;
  veteranUnemployed4to6Months: boolean;
  veteranDisabledDischarged: boolean;
  veteranDisabledUnemployed6Months: boolean;
  tanfFamily: boolean;
  unemploymentCompensation: boolean;
}

export interface TargetGroup {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

export interface ImportantDates {
  dateGaveInfo: string;
  dateOffered: string;
  dateHired: string;
  dateStarted: string;
}

export interface WOTCFormData {
  personalInfo: PersonalInfo;
  targetGroups: TargetGroup[];
  importantDates: ImportantDates;
  currentStep: number;
  isComplete: boolean;
  userType: 'candidate' | 'employer';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}