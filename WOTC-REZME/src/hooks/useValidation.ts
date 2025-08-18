import { useState, useCallback } from 'react';
import { PersonalInfo, ImportantDates, ValidationResult } from '../types/wotc';
import { validateDates } from '../utils/dateValidation';

export const useValidation = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const validatePersonalInfo = useCallback((personalInfo: PersonalInfo): ValidationResult => {
    const newErrors: string[] = [];
    
    if (!personalInfo.fullName.trim()) {
      newErrors.push('Your name is required');
    }
    
    if (!personalInfo.socialSecurityNumber.trim()) {
      newErrors.push('Social security number is required');
    } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(personalInfo.socialSecurityNumber.replace(/\D/g, ''))) {
      newErrors.push('Social security number must be 9 digits');
    }
    
    if (!personalInfo.streetAddress.trim()) {
      newErrors.push('Street address is required');
    }
    
    if (!personalInfo.city.trim()) {
      newErrors.push('City is required');
    }
    
    if (!personalInfo.state.trim()) {
      newErrors.push('State is required');
    }
    
    if (!personalInfo.zipCode.trim()) {
      newErrors.push('ZIP code is required');
    }
    
    if (!personalInfo.county.trim()) {
      newErrors.push('County is required');
    }
    
    if (!personalInfo.telephoneNumber.trim()) {
      newErrors.push('Telephone number is required');
    }
    
    if (!personalInfo.dateOfBirth) {
      newErrors.push('Date of birth is required');
    } else {
      const birthDate = new Date(personalInfo.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.push('Date of birth cannot be in the future');
      }
    }
    
    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }, []);

  const validateEmployerInfo = useCallback((employerInfo: any): ValidationResult => {
    const newErrors: string[] = [];
    
    if (!employerInfo.companyName?.trim()) {
      newErrors.push('Company name is required');
    }
    
    if (!employerInfo.employerEIN?.trim()) {
      newErrors.push('Employer EIN is required');
    } else if (!/^\d{2}-?\d{7}$/.test(employerInfo.employerEIN.replace(/\D/g, ''))) {
      newErrors.push('Employer EIN must be 9 digits');
    }
    
    if (!employerInfo.streetAddress?.trim()) {
      newErrors.push('Company address is required');
    }
    
    if (!employerInfo.city?.trim()) {
      newErrors.push('City is required');
    }
    
    if (!employerInfo.state?.trim()) {
      newErrors.push('State is required');
    }
    
    if (!employerInfo.zipCode?.trim()) {
      newErrors.push('ZIP code is required');
    }
    
    if (!employerInfo.contactName?.trim()) {
      newErrors.push('Contact name is required');
    }
    
    if (!employerInfo.contactPhone?.trim()) {
      newErrors.push('Contact phone is required');
    }
    
    if (!employerInfo.contactEmail?.trim()) {
      newErrors.push('Contact email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employerInfo.contactEmail)) {
      newErrors.push('Please enter a valid email address');
    }
    
    if (!employerInfo.jobTitle?.trim()) {
      newErrors.push('Job title is required');
    }
    
    if (!employerInfo.startDate?.trim()) {
      newErrors.push('Start date is required');
    }
    
    if (!employerInfo.hourlyWage?.trim()) {
      newErrors.push('Hourly wage is required');
    } else if (isNaN(Number(employerInfo.hourlyWage)) || Number(employerInfo.hourlyWage) <= 0) {
      newErrors.push('Please enter a valid hourly wage');
    }
    
    if (!employerInfo.hoursPerWeek?.trim()) {
      newErrors.push('Hours per week is required');
    } else if (isNaN(Number(employerInfo.hoursPerWeek)) || Number(employerInfo.hoursPerWeek) <= 0) {
      newErrors.push('Please enter valid hours per week');
    }
    
    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }, []);

  const validateImportantDates = useCallback((dates: ImportantDates, userType: 'candidate' | 'employer'): ValidationResult => {
    return validateDates(dates, userType);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const setValidationErrors = useCallback((newErrors: string[]) => {
    setErrors(newErrors);
  }, []);

  return {
    errors,
    validatePersonalInfo,
    validateEmployerInfo,
    validateImportantDates,
    clearErrors,
    setValidationErrors
  };
}; 