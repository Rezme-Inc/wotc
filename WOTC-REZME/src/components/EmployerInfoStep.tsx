import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Building2, Phone, FileText, AlertTriangle, AlertCircle } from 'lucide-react';

interface EmployerInfo {
  companyName: string;
  employerEIN: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;
  jobTitle: string;
  startDate: string;
  hourlyWage: string;
  hoursPerWeek: string;
}

interface EmployerInfoStepProps {
  employerInfo: EmployerInfo;
  onUpdate: (info: EmployerInfo) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const EmployerInfoStep: React.FC<EmployerInfoStepProps> = ({
  employerInfo,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: boolean}>({});

  const validateAndProceed = () => {
    const newErrors: string[] = [];
    const newFieldErrors: {[key: string]: boolean} = {};
    
    // Get all input elements by ID
    const companyNameInput = document.getElementById('companyName') as HTMLInputElement;
    const employerEINInput = document.getElementById('employerEIN') as HTMLInputElement;
    const streetAddressInput = document.getElementById('streetAddress') as HTMLInputElement;
    const cityInput = document.getElementById('city') as HTMLInputElement;
    const stateInput = document.getElementById('state') as HTMLInputElement;
    const zipCodeInput = document.getElementById('zipCode') as HTMLInputElement;
    const contactNameInput = document.getElementById('contactName') as HTMLInputElement;
    const contactTitleInput = document.getElementById('contactTitle') as HTMLInputElement;
    const contactPhoneInput = document.getElementById('contactPhone') as HTMLInputElement;
    const contactEmailInput = document.getElementById('contactEmail') as HTMLInputElement;
    const jobTitleInput = document.getElementById('jobTitle') as HTMLInputElement;
    const startDateInput = document.getElementById('startDate') as HTMLInputElement;
    const hourlyWageInput = document.getElementById('hourlyWage') as HTMLInputElement;
    const hoursPerWeekInput = document.getElementById('hoursPerWeek') as HTMLInputElement;

    // Reset validation classes
    [companyNameInput, employerEINInput, streetAddressInput, cityInput, stateInput, zipCodeInput, 
     contactNameInput, contactTitleInput, contactPhoneInput, contactEmailInput, jobTitleInput, 
     startDateInput, hourlyWageInput, hoursPerWeekInput].forEach(input => {
      if (input) {
        input.classList.remove('is-valid', 'is-invalid');
      }
    });
    
    // Validate and set classes for each field
    if (!employerInfo.companyName.trim()) {
      newErrors.push('Company name is required');
      companyNameInput?.classList.add('is-invalid');
      newFieldErrors.companyName = true;
    } else {
      companyNameInput?.classList.add('is-valid');
      newFieldErrors.companyName = false;
    }
    
    if (!employerInfo.employerEIN.trim()) {
      newErrors.push('Employer EIN is required');
      employerEINInput?.classList.add('is-invalid');
      newFieldErrors.employerEIN = true;
    } else if (!/^\d{9}$/.test(employerInfo.employerEIN.replace(/\D/g, ''))) {
      newErrors.push('Employer EIN must be in format XX-XXXXXXX');
      employerEINInput?.classList.add('is-invalid');
      newFieldErrors.employerEIN = true;
    } else {
      employerEINInput?.classList.add('is-valid');
      newFieldErrors.employerEIN = false;
    }
    
    if (!employerInfo.streetAddress.trim()) {
      newErrors.push('Street address is required');
      streetAddressInput?.classList.add('is-invalid');
      newFieldErrors.streetAddress = true;
    } else {
      streetAddressInput?.classList.add('is-valid');
      newFieldErrors.streetAddress = false;
    }
    
    if (!employerInfo.city.trim()) {
      newErrors.push('City is required');
      cityInput?.classList.add('is-invalid');
      newFieldErrors.city = true;
    } else {
      cityInput?.classList.add('is-valid');
      newFieldErrors.city = false;
    }
    
    if (!employerInfo.state.trim()) {
      newErrors.push('State is required');
      stateInput?.classList.add('is-invalid');
      newFieldErrors.state = true;
    } else {
      stateInput?.classList.add('is-valid');
      newFieldErrors.state = false;
    }
    
    if (!employerInfo.zipCode.trim()) {
      newErrors.push('ZIP code is required');
      zipCodeInput?.classList.add('is-invalid');
      newFieldErrors.zipCode = true;
    } else {
      zipCodeInput?.classList.add('is-valid');
      newFieldErrors.zipCode = false;
    }
    
    if (!employerInfo.contactName.trim()) {
      newErrors.push('Contact name is required');
      contactNameInput?.classList.add('is-invalid');
      newFieldErrors.contactName = true;
    } else {
      contactNameInput?.classList.add('is-valid');
      newFieldErrors.contactName = false;
    }
    
    if (!employerInfo.contactTitle.trim()) {
      newErrors.push('Contact title is required');
      contactTitleInput?.classList.add('is-invalid');
      newFieldErrors.contactTitle = true;
    } else {
      contactTitleInput?.classList.add('is-valid');
      newFieldErrors.contactTitle = false;
    }
    
    if (!employerInfo.contactPhone.trim()) {
      newErrors.push('Contact phone is required');
      contactPhoneInput?.classList.add('is-invalid');
      newFieldErrors.contactPhone = true;
    } else {
      contactPhoneInput?.classList.add('is-valid');
      newFieldErrors.contactPhone = false;
    }
    
    if (!employerInfo.contactEmail.trim()) {
      newErrors.push('Contact email is required');
      contactEmailInput?.classList.add('is-invalid');
      newFieldErrors.contactEmail = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employerInfo.contactEmail)) {
      newErrors.push('Please provide a valid email address');
      contactEmailInput?.classList.add('is-invalid');
      newFieldErrors.contactEmail = true;
    } else {
      contactEmailInput?.classList.add('is-valid');
      newFieldErrors.contactEmail = false;
    }
    
    if (!employerInfo.jobTitle.trim()) {
      newErrors.push('Job title is required');
      jobTitleInput?.classList.add('is-invalid');
      newFieldErrors.jobTitle = true;
    } else {
      jobTitleInput?.classList.add('is-valid');
      newFieldErrors.jobTitle = false;
    }
    
    if (!employerInfo.startDate) {
      newErrors.push('Start date is required');
      startDateInput?.classList.add('is-invalid');
      newFieldErrors.startDate = true;
    } else {
      startDateInput?.classList.add('is-valid');
      newFieldErrors.startDate = false;
    }
    
    if (!employerInfo.hourlyWage.trim()) {
      newErrors.push('Hourly wage is required');
      hourlyWageInput?.classList.add('is-invalid');
      newFieldErrors.hourlyWage = true;
    } else if (parseFloat(employerInfo.hourlyWage) <= 0) {
      newErrors.push('Hourly wage must be greater than $0.00');
      hourlyWageInput?.classList.add('is-invalid');
      newFieldErrors.hourlyWage = true;
    } else if (parseFloat(employerInfo.hourlyWage) < 7.25) {
      newErrors.push('Hourly wage should be at least federal minimum wage ($7.25)');
      hourlyWageInput?.classList.add('is-invalid');
      newFieldErrors.hourlyWage = true;
    } else {
      hourlyWageInput?.classList.add('is-valid');
      newFieldErrors.hourlyWage = false;
    }
    
    if (!employerInfo.hoursPerWeek.trim()) {
      newErrors.push('Hours per week is required');
      hoursPerWeekInput?.classList.add('is-invalid');
      newFieldErrors.hoursPerWeek = true;
    } else if (parseInt(employerInfo.hoursPerWeek) <= 0 || parseInt(employerInfo.hoursPerWeek) > 80) {
      newErrors.push('Hours per week must be between 1 and 80');
      hoursPerWeekInput?.classList.add('is-invalid');
      newFieldErrors.hoursPerWeek = true;
    } else {
      hoursPerWeekInput?.classList.add('is-valid');
      newFieldErrors.hoursPerWeek = false;
    }
    
    setErrors(newErrors);
    setFieldErrors(newFieldErrors);
    
    if (newErrors.length === 0) {
      // Add a small delay to show the validation feedback, then proceed
      setTimeout(() => {
        onNext();
      }, 500);
    }
  };

  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const formatWage = (value: string) => {
    // Remove all non-digit and non-decimal characters
    let cleaned = value.replace(/[^0-9.]/g, '');
    
    // Handle empty input
    if (!cleaned) return '';
    
    // Handle just a decimal point
    if (cleaned === '.') return '0.';
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts[1];
    }
    
    // Limit whole number part to 3 digits (max $999)
    if (parts[0] && parts[0].length > 3) {
      parts[0] = parts[0].slice(0, 3);
    }
    
    // Limit decimal places to 2
    if (parts.length === 2) {
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
      }
      cleaned = parts[0] + '.' + (parts[1] || '');
    } else {
      cleaned = parts[0];
    }
    
    // Final check for max value
    const numValue = parseFloat(cleaned);
    if (!isNaN(numValue) && numValue > 999.99) {
      cleaned = '999.99';
    }
    
    return cleaned;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <Building2 className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">Employer Information</h2>
        <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
          Please provide your company information and job details for Form 8850 completion.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="error-banner">
          <h3 className="error-banner-header">
            <AlertTriangle className="w-5 h-5 mr-3" />
            Please correct the following errors:
          </h3>
          <ul className="error-banner-list">
            {errors.map((error, index) => (
              <li key={index} className="error-banner-item">
                <span className="text-red-500 mr-2 font-bold">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row">
        {/* Company Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm col-12">
          <h3 className="font-medium text-black mb-6 font-poppins text-xl flex items-center">
            <Building2 className="w-6 h-6 mr-3" />
            Company Information
          </h3>
          
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="companyName" className="form-label">
                Company Name *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="companyName"
                  value={employerInfo.companyName}
                  onChange={(e) => onUpdate({ ...employerInfo, companyName: e.target.value })}
                  placeholder="Enter company name"
                  required
                />
                {fieldErrors.companyName && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid company name.
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="employerEIN" className="form-label">
                Employer EIN *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="employerEIN"
                  value={employerInfo.employerEIN}
                  onChange={(e) => {
                    const formatted = formatEIN(e.target.value);
                    onUpdate({ ...employerInfo, employerEIN: formatted });
                  }}
                  placeholder="XX-XXXXXXX"
                  maxLength={10}
                  required
                />
                {fieldErrors.employerEIN && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid employer EIN.
              </div>
              <div className="form-hint">
                Required for tax credit processing
              </div>
            </div>

            {/* Street Address */}
            <div className="col-12">
              <label htmlFor="streetAddress" className="form-label">
                Street Address *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="streetAddress"
                  value={employerInfo.streetAddress}
                  onChange={(e) => onUpdate({ ...employerInfo, streetAddress: e.target.value })}
                  placeholder="Enter company street address"
                  required
                />
                {fieldErrors.streetAddress && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid street address.
              </div>
            </div>

            {/* City, State, ZIP */}
            <div className="col-md-6">
              <label htmlFor="city" className="form-label">
                City *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="city"
                  value={employerInfo.city}
                  onChange={(e) => onUpdate({ ...employerInfo, city: e.target.value })}
                  placeholder="City"
                  required
                />
                {fieldErrors.city && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid city.
              </div>
            </div>

            <div className="col-md-3">
              <label htmlFor="state" className="form-label">
                State *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="state"
                  value={employerInfo.state}
                  onChange={(e) => onUpdate({ ...employerInfo, state: e.target.value.toUpperCase() })}
                  placeholder="State"
                  maxLength={2}
                  required
                />
                {fieldErrors.state && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid state.
              </div>
            </div>

            <div className="col-md-3">
              <label htmlFor="zipCode" className="form-label">
                ZIP Code *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="zipCode"
                  value={employerInfo.zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onUpdate({ ...employerInfo, zipCode: value });
                  }}
                  placeholder="ZIP Code"
                  maxLength={5}
                  required
                />
                {fieldErrors.zipCode && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid ZIP code.
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm col-12">
          <h3 className="font-medium text-black mb-6 font-poppins text-xl flex items-center">
            <Phone className="w-6 h-6 mr-3" />
            Contact Information
          </h3>
          
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="contactName" className="form-label">
                Contact Name *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="contactName"
                  value={employerInfo.contactName}
                  onChange={(e) => onUpdate({ ...employerInfo, contactName: e.target.value })}
                  placeholder="Enter contact person name"
                  required
                />
                {fieldErrors.contactName && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid contact name.
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="contactTitle" className="form-label">
                Contact Title *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="contactTitle"
                  value={employerInfo.contactTitle}
                  onChange={(e) => onUpdate({ ...employerInfo, contactTitle: e.target.value })}
                  placeholder="Enter contact title"
                  required
                />
                {fieldErrors.contactTitle && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid contact title.
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="contactPhone" className="form-label">
                Contact Phone *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="contactPhone"
                  value={employerInfo.contactPhone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    onUpdate({ ...employerInfo, contactPhone: formatted });
                  }}
                  placeholder="(XXX) XXX-XXXX"
                  maxLength={14}
                  required
                />
                {fieldErrors.contactPhone && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid phone number.
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="contactEmail" className="form-label">
                Contact Email *
              </label>
              <div className="field-error-container">
                <input
                  type="email"
                  className="form-input"
                  id="contactEmail"
                  value={employerInfo.contactEmail}
                  onChange={(e) => onUpdate({ ...employerInfo, contactEmail: e.target.value })}
                  placeholder="Enter contact email"
                  required
                />
                {fieldErrors.contactEmail && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid email address.
              </div>
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm col-12">
          <h3 className="font-medium text-black mb-6 font-poppins text-xl flex items-center">
            <FileText className="w-6 h-6 mr-3" />
            Job Information
          </h3>
          
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="jobTitle" className="form-label">
                Job Title *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="jobTitle"
                  value={employerInfo.jobTitle}
                  onChange={(e) => onUpdate({ ...employerInfo, jobTitle: e.target.value })}
                  placeholder="Enter job title"
                  required
                />
                {fieldErrors.jobTitle && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid job title.
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label">
                Start Date *
              </label>
              <div className="field-error-container">
                <input
                  type="date"
                  className="form-input"
                  id="startDate"
                  value={employerInfo.startDate}
                  onChange={(e) => onUpdate({ ...employerInfo, startDate: e.target.value })}
                  required
                />
                {fieldErrors.startDate && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid start date.
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="hourlyWage" className="form-label">
                Hourly Wage *
              </label>
              <div className="field-error-container">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-poppins font-medium pointer-events-none z-10">$</span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2rem' }}
                    id="hourlyWage"
                    value={employerInfo.hourlyWage}
                    onChange={(e) => {
                      const formatted = formatWage(e.target.value);
                      onUpdate({ ...employerInfo, hourlyWage: formatted });
                    }}
                    placeholder="15.00"
                    required
                  />
                </div>
                {fieldErrors.hourlyWage && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid hourly wage ($7.25 - $999.99).
              </div>
              <div className="form-hint">
                Enter hourly wage in dollars and cents (e.g., 15.50)
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="hoursPerWeek" className="form-label">
                Hours Per Week *
              </label>
              <div className="field-error-container">
                <input
                  type="number"
                  className="form-input"
                  id="hoursPerWeek"
                  value={employerInfo.hoursPerWeek}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (isNaN(value) || value < 0) {
                      onUpdate({ ...employerInfo, hoursPerWeek: '' });
                    } else if (value > 80) {
                      onUpdate({ ...employerInfo, hoursPerWeek: '80' });
                    } else {
                      onUpdate({ ...employerInfo, hoursPerWeek: e.target.value });
                    }
                  }}
                  placeholder="40"
                  min="1"
                  max="80"
                  required
                />
                {fieldErrors.hoursPerWeek && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide valid hours per week (1-80).
              </div>
              <div className="form-hint">
                Standard full-time is 40 hours per week
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <button
          type="button"
          onClick={onPrevious}
          className="btn-ghost flex items-center px-8 py-4"
          aria-label="Go back to previous step"
        >
          <ArrowLeft className="mr-3 w-5 h-5" aria-hidden="true" />
          Previous
        </button>
        <button
          type="button"
          onClick={validateAndProceed}
          className="btn-primary flex items-center px-10 py-4"
          aria-label="Continue to next step"
        >
          Continue
          <ArrowRight className="ml-3 w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};