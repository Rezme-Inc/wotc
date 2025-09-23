import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, User, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
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
  const [showAffirmations, setShowAffirmations] = useState<boolean>(false);
  const [validFields, setValidFields] = useState<{[key: string]: boolean}>({});

  const validateAndProceed = () => {
    const newErrors: string[] = [];
    const newFieldErrors: {[key: string]: boolean} = {};
    const newValidFields: {[key: string]: boolean} = {};

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

    // Clear previous validation classes
    [fullNameInput, ssnInput, addressInput, cityInput, stateInput, zipInput, countyInput, phoneInput, dobInput].forEach(input => {
      input?.classList.remove('is-valid', 'is-invalid');
    });

    if (!personalInfo.fullName.trim()) {
      newErrors.push('Your name is required');
      fullNameInput?.classList.add('is-invalid');
      newFieldErrors.fullName = true;
      newValidFields.fullName = false;
    } else {
      fullNameInput?.classList.add('is-valid');
      newFieldErrors.fullName = false;
      newValidFields.fullName = true;
    }

    if (!personalInfo.socialSecurityNumber.trim()) {
      newErrors.push('Social security number is required');
      ssnInput?.classList.add('is-invalid');
      newFieldErrors.socialSecurityNumber = true;
      newValidFields.socialSecurityNumber = false;
    } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(personalInfo.socialSecurityNumber.replace(/\D/g, ''))) {
      newErrors.push('Social security number must be 9 digits');
      ssnInput?.classList.add('is-invalid');
      newFieldErrors.socialSecurityNumber = true;
      newValidFields.socialSecurityNumber = false;
    } else {
      ssnInput?.classList.add('is-valid');
      newFieldErrors.socialSecurityNumber = false;
      newValidFields.socialSecurityNumber = true;
    }

    if (!personalInfo.streetAddress.trim()) {
      newErrors.push('Street address is required');
      addressInput?.classList.add('is-invalid');
      newFieldErrors.streetAddress = true;
      newValidFields.streetAddress = false;
    } else {
      addressInput?.classList.add('is-valid');
      newFieldErrors.streetAddress = false;
      newValidFields.streetAddress = true;
    }

    if (!personalInfo.city.trim()) {
      newErrors.push('City is required');
      cityInput?.classList.add('is-invalid');
      newFieldErrors.city = true;
      newValidFields.city = false;
    } else {
      cityInput?.classList.add('is-valid');
      newFieldErrors.city = false;
      newValidFields.city = true;
    }

    if (!personalInfo.state.trim()) {
      newErrors.push('State is required');
      stateInput?.classList.add('is-invalid');
      newFieldErrors.state = true;
      newValidFields.state = false;
    } else {
      stateInput?.classList.add('is-valid');
      newFieldErrors.state = false;
      newValidFields.state = true;
    }

    if (!personalInfo.zipCode.trim()) {
      newErrors.push('ZIP code is required');
      zipInput?.classList.add('is-invalid');
      newFieldErrors.zipCode = true;
      newValidFields.zipCode = false;
    } else {
      zipInput?.classList.add('is-valid');
      newFieldErrors.zipCode = false;
      newValidFields.zipCode = true;
    }

    if (!personalInfo.county.trim()) {
      newErrors.push('County is required');
      countyInput?.classList.add('is-invalid');
      newFieldErrors.county = true;
      newValidFields.county = false;
    } else {
      countyInput?.classList.add('is-valid');
      newFieldErrors.county = false;
      newValidFields.county = true;
    }

    if (!personalInfo.telephoneNumber.trim()) {
      newErrors.push('Telephone number is required');
      phoneInput?.classList.add('is-invalid');
      newFieldErrors.telephoneNumber = true;
      newValidFields.telephoneNumber = false;
    } else {
      phoneInput?.classList.add('is-valid');
      newFieldErrors.telephoneNumber = false;
      newValidFields.telephoneNumber = true;
    }

    if (!personalInfo.dateOfBirth) {
      newErrors.push('Date of birth is required');
      dobInput?.classList.add('is-invalid');
      newFieldErrors.dateOfBirth = true;
      newValidFields.dateOfBirth = false;
    } else {
      const birthDate = new Date(personalInfo.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.push('Date of birth cannot be in the future');
        dobInput?.classList.add('is-invalid');
        newFieldErrors.dateOfBirth = true;
        newValidFields.dateOfBirth = false;
      } else {
        dobInput?.classList.add('is-valid');
        newFieldErrors.dateOfBirth = false;
        newValidFields.dateOfBirth = true;
      }
    }

    setErrors(newErrors);
    setFieldErrors(newFieldErrors);
    setValidFields(newValidFields);
    
    // Always show affirmations for valid fields, regardless of whether there are errors
    setShowAffirmations(true);

    if (newErrors.length === 0) {
      // Only proceed to next step if all fields are valid
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

  const handleInputChange = (field: string, value: string) => {
    // Clear affirmations when user starts typing
    if (showAffirmations) {
      setShowAffirmations(false);
      setValidFields({});
    }
    onUpdate({ ...personalInfo, [field]: value });
  };

  // Encouraging messages for each field
  const affirmationMessages = {
    fullName: "Perfect! Your name looks great!",
    socialSecurityNumber: "Excellent! Your SSN is properly formatted!",
    streetAddress: "Great! Your address is complete!",
    city: "Nice! City information looks good!",
    state: "Perfect! State is properly entered!",
    zipCode: "Excellent! ZIP code is valid!",
    county: "Great! County information is complete!",
    telephoneNumber: "Perfect! Phone number is properly formatted!",
    dateOfBirth: "Excellent! Date of birth is valid!"
  };

  // Component for positive affirmation
  const PositiveAffirmation = ({ field }: { field: string }) => {
    if (!showAffirmations || !validFields[field]) return null;
    
    return (
      <div className="positive-affirmation">
        <CheckCircle className="positive-affirmation-icon" />
        {affirmationMessages[field as keyof typeof affirmationMessages]}
      </div>
    );
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

      <div className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="space-y-6">
            {/* Name and SSN Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="form-label">
                  Your name *
                </label>
                <div className="field-error-container">
                  <input
                    type="text"
                    className="form-input"
                    id="fullName"
                    value={personalInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full legal name"
                    required
                  />
                  {fieldErrors.fullName && (
                    <AlertCircle className="field-error-icon" />
                  )}
                </div>
                {/* <div className="valid-feedback">
                  Looks good!
                </div> */}
                <div className="invalid-feedback">
                  Please provide your full legal name.
                </div>
                <PositiveAffirmation field="fullName" />
              </div>

              <div>
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
                      handleInputChange('socialSecurityNumber', formatted);
                    }}
                    placeholder="XXX-XX-XXXX"
                    maxLength={11}
                    required
                  />
                  {fieldErrors.socialSecurityNumber && (
                    <AlertCircle className="field-error-icon" />
                  )}
                </div>
                {/* <div className="valid-feedback">
                  Looks good!
                </div> */}
                <div className="invalid-feedback">
                  Please provide a valid 9-digit SSN.
                </div>
                <PositiveAffirmation field="socialSecurityNumber" />
                <p id="ssn-hint" className="form-hint">
                  Required for tax credit verification
                </p>
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-base font-medium text-black mb-3 font-poppins">
                Street address where you live *
              </label>
              <input
                type="text"
                id="streetAddress"
                value={personalInfo.streetAddress}
                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                className="form-input"
                placeholder="Enter your street address"
              />
              <PositiveAffirmation field="streetAddress" />
            </div>

            {/* City, State, ZIP */}
            <div>
              <label className="block text-base font-medium text-black mb-3 font-poppins">
                City or town, state, and ZIP code *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    id="city"
                    value={personalInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="form-input"
                    placeholder="City"
                  />
                  <PositiveAffirmation field="city" />
                </div>
                <div>
                  <input
                    type="text"
                    id="state"
                    value={personalInfo.state}
                    onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                    className="form-input"
                    placeholder="State"
                    maxLength={2}
                  />
                  <PositiveAffirmation field="state" />
                </div>
                <div>
                  <input
                    type="text"
                    id="zipCode"
                    value={personalInfo.zipCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('zipCode', value);
                    }}
                    className="form-input"
                    placeholder="ZIP Code"
                    maxLength={5}
                  />
                  <PositiveAffirmation field="zipCode" />
                </div>
              </div>
            </div>

            {/* County and Phone Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  County *
                </label>
                <input
                  type="text"
                  id="county"
                  value={personalInfo.county}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                  className="form-input"
                  placeholder="Enter your county"
                />
                <PositiveAffirmation field="county" />
              </div>

              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Telephone number *
                </label>
                <input
                  type="text"
                  id="telephoneNumber"
                  value={personalInfo.telephoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    handleInputChange('telephoneNumber', formatted);
                  }}
                  className="form-input"
                  placeholder="(XXX) XXX-XXXX"
                  maxLength={14}
                />
                <PositiveAffirmation field="telephoneNumber" />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-base font-medium text-black mb-3 font-poppins">
              Enter your date of birth (month, day, year) *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={personalInfo.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="form-input"
              />
              <PositiveAffirmation field="dateOfBirth" />
            </div>
          </div>
        </div>

        {/* City, State, ZIP - Separated Fields */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="space-y-8">
            {/* Section 1 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4 mt-1">
                <span className="text-black font-medium font-poppins text-lg mr-3">1</span>
                <input
                  type="checkbox"
                  checked={personalInfo.conditionalCertification}
                  onChange={(e) => onUpdate({ ...personalInfo, conditionalCertification: e.target.checked })}
                  className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-black font-poppins font-light leading-relaxed">
                  Check here if you received a conditional certification from the state workforce agency (SWA) or a participating local agency for the work opportunity credit.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4 mt-1">
                <span className="text-black font-medium font-poppins text-lg mr-3">2</span>
                <input
                  type="checkbox"
                  checked={personalInfo.targetGroupStatements}
                  onChange={(e) => onUpdate({ ...personalInfo, targetGroupStatements: e.target.checked })}
                  className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-black font-poppins font-light leading-relaxed mb-4">
                  Check here if any of the following statements apply to you.
                </p>
                <ul className="list-disc list-inside text-gray35 font-poppins font-light space-y-3 ml-4">
                  <li>I am a member of a family that has received assistance from Temporary Assistance for Needy Families (TANF) for any 9 months during the past 18 months.</li>
                  <li>I am a veteran and a member of a family that received Supplemental Nutrition Assistance Program (SNAP) benefits (food stamps) for at least a 3-month period during the past 15 months.</li>
                  <li>I was referred here by a rehabilitation agency approved by the state, an employment network under the Ticket to Work program, or the Department of Veterans Affairs.</li>
                  <li>I am at least age 18 but <strong>not</strong> age 40 or older and I am a member of a family that:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li><strong>a.</strong> Received SNAP benefits (food stamps) for the past 6 months; <strong>or</strong></li>
                      <li><strong>b.</strong> Received SNAP benefits (food stamps) for at least 3 of the past 5 months, <strong>but</strong> is no longer eligible to receive them.</li>
                    </ul>
                  </li>
                  <li>During the past year, I was convicted of a felony or released from prison for a felony.</li>
                  <li>I received supplemental security income (SSI) benefits for any month ending during the past 60 days.</li>
                  <li>I am a veteran and I was unemployed for a period or periods totaling at least 4 weeks but less than 6 months during the past year.</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4 mt-1">
                <span className="text-black font-medium font-poppins text-lg mr-3">3</span>
                <input
                  type="checkbox"
                  checked={personalInfo.veteranUnemployed4to6Months}
                  onChange={(e) => onUpdate({ ...personalInfo, veteranUnemployed4to6Months: e.target.checked })}
                  className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-black font-poppins font-light leading-relaxed">
                  Check here if you are a veteran and you were unemployed for a period or periods totaling at least 6 months during the past year.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4 mt-1">
                <span className="text-black font-medium font-poppins text-lg mr-3">4</span>
                <input
                  type="checkbox"
                  checked={personalInfo.veteranDisabledDischarged}
                  onChange={(e) => onUpdate({ ...personalInfo, veteranDisabledDischarged: e.target.checked })}
                  className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-black font-poppins font-light leading-relaxed">
                  Check here if you are a veteran entitled to compensation for a service-connected disability and you were discharged or released from active duty in the U.S. Armed Forces during the past year.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4 mt-1">
                <span className="text-black font-medium font-poppins text-lg mr-3">5</span>
                <input
                  type="checkbox"
                  checked={personalInfo.veteranDisabledUnemployed6Months}
                  onChange={(e) => onUpdate({ ...personalInfo, veteranDisabledUnemployed6Months: e.target.checked })}
                  className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-black font-poppins font-light leading-relaxed">
                  Check here if you are a veteran entitled to compensation for a service-connected disability and you were unemployed for a period or periods totaling at least 6 months during the past year.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4 mt-1">
                <span className="text-black font-medium font-poppins text-lg mr-3">6</span>
                <input
                  type="checkbox"
                  checked={personalInfo.tanfFamily}
                  onChange={(e) => onUpdate({ ...personalInfo, tanfFamily: e.target.checked })}
                  className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-black font-poppins font-light leading-relaxed mb-4">
                  Check here if you are a member of a family that:
                </p>
                <ul className="list-disc list-inside text-gray35 font-poppins font-light space-y-2 ml-4">
                  <li>Received TANF payments for at least the past 18 months; <strong>or</strong></li>
                  <li>Received TANF payments for any 18 months beginning after August 5, 1997, and the earliest 18-month period beginning after August 5, 1997, ended during the past 2 years; <strong>or</strong></li>
                  <li>Stopped being eligible for TANF payments during the past 2 years because federal or state law limited the maximum time those payments could be made.</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4 mt-1">
                <span className="text-black font-medium font-poppins text-lg mr-3">7</span>
                <input
                  type="checkbox"
                  checked={personalInfo.unemploymentCompensation}
                  onChange={(e) => onUpdate({ ...personalInfo, unemploymentCompensation: e.target.checked })}
                  className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-black font-poppins font-light leading-relaxed">
                  Check here if you received unemployment compensation for at least 26 weeks during the past year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <button
          onClick={onPrevious}
          className="btn-ghost flex items-center px-8 py-4"
          aria-label="Go back to previous step"
        >
          <ArrowLeft className="mr-3 w-5 h-5" aria-hidden="true" />
          Previous
        </button>
        <button
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