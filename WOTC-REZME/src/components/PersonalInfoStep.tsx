import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, User, MapPin, Phone, Calendar, Shield, FileCheck } from 'lucide-react';
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

  const validateAndProceed = () => {
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
    
    setErrors(newErrors);
    
    if (newErrors.length === 0) {
      onNext();
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
          <strong className="text-black">Job applicant:</strong> Fill in the lines below and check any boxes that apply. Complete only this side.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="card border-l-4 border-cinnabar p-6 mb-8 bg-red-50">
          <h3 className="text-black font-medium mb-3 font-poppins flex items-center">
            <span className="w-2 h-2 bg-cinnabar rounded-full mr-3"></span>
            Please correct the following:
          </h3>
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <li key={index} className="form-error flex items-start">
                <span className="text-cinnabar mr-2">•</span>
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
                <label className="form-label">
                  Your name *
                </label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => onUpdate({ ...personalInfo, fullName: e.target.value })}
                  className="form-input"
                  placeholder="Enter your full legal name"
                  required
                  aria-describedby="name-hint"
                />
                <p id="name-hint" className="form-hint">
                  Enter your full legal name as it appears on official documents
                </p>
              </div>

              <div>
                <label className="form-label">
                  Social security number ▶ *
                </label>
                <input
                  type="text"
                  value={personalInfo.socialSecurityNumber}
                  onChange={(e) => {
                    const formatted = formatSSN(e.target.value);
                    onUpdate({ ...personalInfo, socialSecurityNumber: formatted });
                  }}
                  className="form-input"
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  required
                  aria-describedby="ssn-hint"
                />
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
                value={personalInfo.streetAddress}
                onChange={(e) => onUpdate({ ...personalInfo, streetAddress: e.target.value })}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                placeholder="Enter your street address"
              />
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
                    value={personalInfo.city}
                    onChange={(e) => onUpdate({ ...personalInfo, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                    placeholder="City"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={personalInfo.state}
                    onChange={(e) => onUpdate({ ...personalInfo, state: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                    placeholder="State"
                    maxLength={2}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={personalInfo.zipCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      onUpdate({ ...personalInfo, zipCode: value });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                    placeholder="ZIP Code"
                    maxLength={5}
                  />
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
                  value={personalInfo.county}
                  onChange={(e) => onUpdate({ ...personalInfo, county: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your county"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Telephone number *
                </label>
                <input
                  type="text"
                  value={personalInfo.telephoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    onUpdate({ ...personalInfo, telephoneNumber: formatted });
                  }}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="(XXX) XXX-XXXX"
                  maxLength={14}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-base font-medium text-black mb-3 font-poppins">
                Enter your date of birth (month, day, year) *
              </label>
              <input
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={(e) => onUpdate({ ...personalInfo, dateOfBirth: e.target.value })}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
              />
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