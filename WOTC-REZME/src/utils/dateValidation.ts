import { ImportantDates, ValidationResult } from '../types/wotc';

export const validateDates = (dates: ImportantDates, userType: 'candidate' | 'employer' = 'candidate'): ValidationResult => {
  const errors: string[] = [];
  
  // Convert dates to Date objects for comparison
  const gaveInfo = new Date(dates.dateGaveInfo);
  const offered = new Date(dates.dateOffered);
  const hired = new Date(dates.dateHired);
  const started = new Date(dates.dateStarted);
  
  // Check if all dates are valid
  if (isNaN(gaveInfo.getTime())) errors.push('Date gave info is invalid');
  if (isNaN(offered.getTime())) errors.push('Date offered is invalid');
  if (isNaN(hired.getTime())) errors.push('Date hired is invalid');
  if (isNaN(started.getTime())) errors.push('Date started is invalid');
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  if (userType === 'candidate') {
    // Candidate validation: Gave Info ≤ Offered ≤ Hired ≤ Started
    if (gaveInfo > offered) {
      errors.push('Date gave info must be on or before the date offered');
    }
    
    if (offered > hired) {
      errors.push('Offered Job must be on or before Hired date');
    }
    
    if (hired > started) {
      errors.push('Hired must be on or before Started date');
    }
  } else {
    // Employer validation: Different logic
    // 1. Date gave info must be same as or before date offered
    if (gaveInfo > offered) {
      errors.push('Date applicant gave information must be on or before the date applicant was offered job');
    }
    
    // 2. Date hired must be on or after both gave info and offered dates
    if (hired < gaveInfo) {
      errors.push('Date hired must be on or after the date applicant gave information');
    }
    
    if (hired < offered) {
      errors.push('Date hired must be on or after the date applicant was offered job');
    }
    
    // 3. Date started must be on or after both gave info and offered dates
    if (started < gaveInfo) {
      errors.push('Date started must be on or after the date applicant gave information');
    }
    
    if (started < offered) {
      errors.push('Date started must be on or after the date applicant was offered job');
    }
  }
  
  // Check that dates are not in the future
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  if (gaveInfo > today) errors.push('Date gave info cannot be in the future');
  if (offered > today) errors.push('Date offered cannot be in the future');
  if (hired > today) errors.push('Date hired cannot be in the future');
  if (started > today) errors.push('Date started cannot be in the future');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};