import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, User, AlertCircle, AlertTriangle } from 'lucide-react';
import { PersonalInfo } from '../types/wotc';

interface PersonalInfoStepProps {
  personalInfo: PersonalInfo;
  onUpdate: (info: PersonalInfo) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  personalInfo,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: boolean}>({});

  const validateAndProceed = () => {
    const newErrors: string[] = [];
    const newFieldErrors: {[key: string]: boolean} = {};
    
    // Check all required fields and add validation classes
    const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
    const ssnInput = document.getElementById('socialSecurityNumber') as HTMLInputElement;
    const addressInput = document.getElementById('streetAddress') as HTMLInputElement;
    const cityInput = document.getElementById('city') as HTMLInputElement;
    const stateInput = document.getElementById('state') as HTMLInputElement;
    const zipInput = document.getElementById('zipCode') as HTMLInputElement;
    const countyInput = document.getElementById('county') as HTMLInputElement;
    const phoneInput = document.getElementById('telephoneNumber') as HTMLInputElement;
    const dobInput = document.getElementById('dateOfBirth') as HTMLInputElement;

    // Reset validation classes
    [fullNameInput, ssnInput, addressInput, cityInput, stateInput, zipInput, countyInput, phoneInput, dobInput].forEach(input => {
      if (input) {
        input.classList.remove('is-valid', 'is-invalid');
      }
    });
    
    // Validate and set classes
    if (!personalInfo.fullName.trim()) {
      newErrors.push('Your name is required');
      fullNameInput?.classList.add('is-invalid');
      newFieldErrors.fullName = true;
    } else {
      fullNameInput?.classList.add('is-valid');
      newFieldErrors.fullName = false;
    }
    
    if (!personalInfo.socialSecurityNumber.trim()) {
      newErrors.push('Social security number is required');
      ssnInput?.classList.add('is-invalid');
      newFieldErrors.socialSecurityNumber = true;
    } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(personalInfo.socialSecurityNumber.replace(/\D/g, ''))) {
      newErrors.push('Social security number must be 9 digits');
      ssnInput?.classList.add('is-invalid');
      newFieldErrors.socialSecurityNumber = true;
    } else {
      ssnInput?.classList.add('is-valid');
      newFieldErrors.socialSecurityNumber = false;
    }
    
    if (!personalInfo.streetAddress.trim()) {
      newErrors.push('Street address is required');
      addressInput?.classList.add('is-invalid');
      newFieldErrors.streetAddress = true;
    } else {
      addressInput?.classList.add('is-valid');
      newFieldErrors.streetAddress = false;
    }
    
    if (!personalInfo.city.trim()) {
      newErrors.push('City is required');
      cityInput?.classList.add('is-invalid');
      newFieldErrors.city = true;
    } else {
      cityInput?.classList.add('is-valid');
      newFieldErrors.city = false;
    }
    
    if (!personalInfo.state.trim()) {
      newErrors.push('State is required');
      stateInput?.classList.add('is-invalid');
      newFieldErrors.state = true;
    } else {
      stateInput?.classList.add('is-valid');
      newFieldErrors.state = false;
    }
    
    if (!personalInfo.zipCode.trim()) {
      newErrors.push('ZIP code is required');
      zipInput?.classList.add('is-invalid');
      newFieldErrors.zipCode = true;
    } else {
      zipInput?.classList.add('is-valid');
      newFieldErrors.zipCode = false;
    }
    
    if (!personalInfo.county.trim()) {
      newErrors.push('County is required');
      countyInput?.classList.add('is-invalid');
      newFieldErrors.county = true;
    } else {
      countyInput?.classList.add('is-valid');
      newFieldErrors.county = false;
    }
    
    if (!personalInfo.telephoneNumber.trim()) {
      newErrors.push('Telephone number is required');
      phoneInput?.classList.add('is-invalid');
      newFieldErrors.telephoneNumber = true;
    } else {
      phoneInput?.classList.add('is-valid');
      newFieldErrors.telephoneNumber = false;
    }
    
    if (!personalInfo.dateOfBirth) {
      newErrors.push('Date of birth is required');
      dobInput?.classList.add('is-invalid');
      newFieldErrors.dateOfBirth = true;
    } else {
      const birthDate = new Date(personalInfo.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.push('Date of birth cannot be in the future');
        dobInput?.classList.add('is-invalid');
        newFieldErrors.dateOfBirth = true;
      } else {
        dobInput?.classList.add('is-valid');
        newFieldErrors.dateOfBirth = false;
      }
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

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <User className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">Personal Information</h2>
        <p className="text-gray35 font-poppins font-light text-lg leading-relaxed mb-2">
          <strong className="text-black">Job applicant:</strong> Please complete this page and continue.
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
        {/* Basic Information Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm col-12">
          <div className="row">
            {/* Name and SSN Row */}
            <div className="col-md-6">
              <label htmlFor="fullName" className="form-label">
                Your name *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="fullName"
                  value={personalInfo.fullName}
                  onChange={(e) => onUpdate({ ...personalInfo, fullName: e.target.value })}
                  placeholder="Enter your full legal name"
                  required
                />
                {fieldErrors.fullName && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide your full legal name.
              </div>
              <div className="form-hint">
                Enter your full legal name as it appears on official documents
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="socialSecurityNumber" className="form-label">
                Social security number ▶ *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="socialSecurityNumber"
                  value={personalInfo.socialSecurityNumber}
                  onChange={(e) => {
                    const formatted = formatSSN(e.target.value);
                    onUpdate({ ...personalInfo, socialSecurityNumber: formatted });
                  }}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  required
                />
                {fieldErrors.socialSecurityNumber && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide a valid social security number.
              </div>
              <div className="form-hint">
                Required for tax credit verification
              </div>
            </div>

            {/* Street Address */}
            <div className="col-12">
              <label htmlFor="streetAddress" className="form-label">
                Street address where you live *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="streetAddress"
                  value={personalInfo.streetAddress}
                  onChange={(e) => onUpdate({ ...personalInfo, streetAddress: e.target.value })}
                  placeholder="Enter your street address"
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
                Please provide your street address.
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
                  value={personalInfo.city}
                  onChange={(e) => onUpdate({ ...personalInfo, city: e.target.value })}
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
                  value={personalInfo.state}
                  onChange={(e) => onUpdate({ ...personalInfo, state: e.target.value.toUpperCase() })}
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
                  value={personalInfo.zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onUpdate({ ...personalInfo, zipCode: value });
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

            {/* County and Phone Row */}
            <div className="col-md-6">
              <label htmlFor="county" className="form-label">
                County *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="county"
                  value={personalInfo.county}
                  onChange={(e) => onUpdate({ ...personalInfo, county: e.target.value })}
                  placeholder="Enter your county"
                  required
                />
                {fieldErrors.county && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide your county.
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="telephoneNumber" className="form-label">
                Telephone number *
              </label>
              <div className="field-error-container">
                <input
                  type="text"
                  className="form-input"
                  id="telephoneNumber"
                  value={personalInfo.telephoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    onUpdate({ ...personalInfo, telephoneNumber: formatted });
                  }}
                  placeholder="(XXX) XXX-XXXX"
                  maxLength={14}
                  required
                />
                {fieldErrors.telephoneNumber && (
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

            {/* Date of Birth */}
            <div className="col-12">
              <label htmlFor="dateOfBirth" className="form-label">
                Enter your date of birth (month, day, year) *
              </label>
              <div className="field-error-container">
                <input
                  type="date"
                  className="form-input"
                  id="dateOfBirth"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => onUpdate({ ...personalInfo, dateOfBirth: e.target.value })}
                  required
                />
                {fieldErrors.dateOfBirth && (
                  <AlertCircle className="field-error-icon" />
                )}
              </div>
              <div className="valid-feedback">
                Looks good!
              </div>
              <div className="invalid-feedback">
                Please provide your date of birth.
              </div>
            </div>
          </div>
        </div>

        {/* Checkbox Sections */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm col-12">
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="conditionalCertification"
                checked={personalInfo.conditionalCertification}
                onChange={(e) => onUpdate({ ...personalInfo, conditionalCertification: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="conditionalCertification">
                <span className="font-bold text-black mr-2">1.</span>
                Check here if you received a conditional certification from the state workforce agency (SWA) or a participating local agency for the work opportunity credit.
              </label>
            </div>

            {/* Section 2 */}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="targetGroupStatements"
                checked={personalInfo.targetGroupStatements}
                onChange={(e) => onUpdate({ ...personalInfo, targetGroupStatements: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="targetGroupStatements">
                <span className="font-bold text-black mr-2">2.</span>
                Check here if any of the following statements apply to you.
              </label>
            </div>
            <div className="ml-8 mt-3">
              <ul className="text-gray35 font-poppins space-y-2">
                <li>• I am a member of a family that has received assistance from Temporary Assistance for Needy Families (TANF) for any 9 months during the past 18 months.</li>
                <li>• I am a veteran and a member of a family that received Supplemental Nutrition Assistance Program (SNAP) benefits (food stamps) for at least a 3-month period during the past 15 months.</li>
                <li>• I was referred here by a rehabilitation agency approved by the state, an employment network under the Ticket to Work program, or the Department of Veterans Affairs.</li>
                <li>• I am at least age 18 but <strong>not</strong> age 40 or older and I am a member of a family that:
                  <ul className="ml-6 mt-2 space-y-1">
                    <li><strong>a.</strong> Received SNAP benefits (food stamps) for the past 6 months; <strong>or</strong></li>
                    <li><strong>b.</strong> Received SNAP benefits (food stamps) for at least 3 of the past 5 months, <strong>but</strong> is no longer eligible to receive them.</li>
                  </ul>
                </li>
                <li>• During the past year, I was convicted of a felony or released from prison for a felony.</li>
                <li>• I received supplemental security income (SSI) benefits for any month ending during the past 60 days.</li>
                <li>• I am a veteran and I was unemployed for a period or periods totaling at least 4 weeks but less than 6 months during the past year.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="veteranUnemployed4to6Months"
                checked={personalInfo.veteranUnemployed4to6Months}
                onChange={(e) => onUpdate({ ...personalInfo, veteranUnemployed4to6Months: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="veteranUnemployed4to6Months">
                <span className="font-bold text-black mr-2">3.</span>
                Check here if you are a veteran and you were unemployed for a period or periods totaling at least 6 months during the past year.
              </label>
            </div>

            {/* Section 4 */}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="veteranDisabledDischarged"
                checked={personalInfo.veteranDisabledDischarged}
                onChange={(e) => onUpdate({ ...personalInfo, veteranDisabledDischarged: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="veteranDisabledDischarged">
                <span className="font-bold text-black mr-2">4.</span>
                Check here if you are a veteran entitled to compensation for a service-connected disability and you were discharged or released from active duty in the U.S. Armed Forces during the past year.
              </label>
            </div>

            {/* Section 5 */}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="veteranDisabledUnemployed6Months"
                checked={personalInfo.veteranDisabledUnemployed6Months}
                onChange={(e) => onUpdate({ ...personalInfo, veteranDisabledUnemployed6Months: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="veteranDisabledUnemployed6Months">
                <span className="font-bold text-black mr-2">5.</span>
                Check here if you are a veteran entitled to compensation for a service-connected disability and you were unemployed for a period or periods totaling at least 6 months during the past year.
              </label>
            </div>

            {/* Section 6 */}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="tanfFamily"
                checked={personalInfo.tanfFamily}
                onChange={(e) => onUpdate({ ...personalInfo, tanfFamily: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="tanfFamily">
                <span className="font-bold text-black mr-2">6.</span>
                Check here if you are a member of a family that:
              </label>
            </div>
            <div className="ml-8 mt-3">
              <ul className="text-gray35 font-poppins space-y-2">
                <li>• Received TANF payments for at least the past 18 months; <strong>or</strong></li>
                <li>• Received TANF payments for any 18 months beginning after August 5, 1997, and the earliest 18-month period beginning after August 5, 1997, ended during the past 2 years; <strong>or</strong></li>
                <li>• Stopped being eligible for TANF payments during the past 2 years because federal or state law limited the maximum time those payments could be made.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="unemploymentCompensation"
                checked={personalInfo.unemploymentCompensation}
                onChange={(e) => onUpdate({ ...personalInfo, unemploymentCompensation: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="unemploymentCompensation">
                <span className="font-bold text-black mr-2">7.</span>
                Check here if you received unemployment compensation for at least 26 weeks during the past year.
              </label>
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