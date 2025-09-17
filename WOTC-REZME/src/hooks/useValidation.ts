import { useState, useCallback } from 'react';
import { PersonalInfo, ImportantDates, ValidationResult } from '../types/wotc';


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
    const newErrors: string[] = [];
    
    // Check if all dates are provided
    if (!dates.dateGaveInfo) newErrors.push('1. Date gave info is required');
    if (!dates.dateOffered) newErrors.push('2. Date offered is required');
    if (!dates.dateHired) newErrors.push('3. Date hired is required');
    if (!dates.dateStarted) newErrors.push('4. Date started is required');
    
    // If all dates are provided, validate sequence and future dates
    if (newErrors.length === 0) {
      const gaveInfo = new Date(dates.dateGaveInfo);
      const offered = new Date(dates.dateOffered);
      const hired = new Date(dates.dateHired);
      const started = new Date(dates.dateStarted);
      
      // Check if dates are valid
      if (isNaN(gaveInfo.getTime())) newErrors.push('1. Date gave info is invalid');
      if (isNaN(offered.getTime())) newErrors.push('2. Date offered is invalid');
      if (isNaN(hired.getTime())) newErrors.push('3. Date hired is invalid');
      if (isNaN(started.getTime())) newErrors.push('4. Date started is invalid');
      
      if (newErrors.length === 0) {
        // Check sequence based on user type
        if (userType === 'candidate') {
          // Candidate: 1 ≤ 2 ≤ 3 ≤ 4
          if (gaveInfo > offered) {
            newErrors.push('1. Gave Info must be on or before 2. Offered Job');
          }
          if (offered > hired) {
            newErrors.push('2. Offered Job must be on or before 3. Hired date');
          }
          if (hired > started) {
            newErrors.push('3. Hired must be on or before 4. Started Work');
          }
        } else {
          // Employer: 1 ≤ 2, and both 3 & 4 must be after 1 & 2
          if (gaveInfo > offered) {
            newErrors.push('1. Gave Info must be on or before 2. Offered Job');
          }
          if (hired < gaveInfo) {
            newErrors.push('3. Hired must be on or after 1. Gave Info');
          }
          if (hired < offered) {
            newErrors.push('3. Hired must be on or after 2. Offered Job');
          }
          if (started < gaveInfo) {
            newErrors.push('4. Started Work must be on or after 1. Gave Info');
          }
          if (started < offered) {
            newErrors.push('4. Started Work must be on or after 2. Offered Job');
          }
        }
        
        // Check that dates are not in the future
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (gaveInfo > today) newErrors.push('1. Gave Info cannot be in the future');
        if (offered > today) newErrors.push('2. Offered Job cannot be in the future');
        if (hired > today) newErrors.push('3. Hired cannot be in the future');
        if (started > today) newErrors.push('4. Started Work cannot be in the future');
      }
    }
    
    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
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