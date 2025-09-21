import React, { useState } from 'react';
import { Building2, ArrowRight, ArrowLeft } from 'lucide-react';

interface EmployerInfo {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  jobTitle: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface EmployerSelectionStepProps {
  onNext: (employerInfo: EmployerInfo) => void;
  onBack: () => void;
}

export const EmployerSelectionStep: React.FC<EmployerSelectionStepProps> = ({
  onNext,
  onBack
}) => {
  const [employerInfo, setEmployerInfo] = useState<EmployerInfo>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    jobTitle: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!employerInfo.companyName.trim()) {
      newErrors.push('Company name is required');
    }

    if (!employerInfo.jobTitle.trim()) {
      newErrors.push('Job title is required');
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onNext(employerInfo);
  };

  const updateField = (field: keyof EmployerInfo, value: string) => {
    setEmployerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <Building2 className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">
          New WOTC Application
        </h2>
        <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
          Please provide information about the employer you applied to for a job.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2 font-poppins">Please correct the following:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-center">
                <span className="text-red-500 mr-2">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <h3 className="font-medium text-black mb-6 flex items-center font-poppins text-xl">
            <Building2 className="w-6 h-6 mr-3" />
            Company Information
          </h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-base font-medium text-black mb-3 font-poppins">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                value={employerInfo.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                placeholder="Enter the company name"
                required
              />
            </div>

            <div>
              <label htmlFor="jobTitle" className="block text-base font-medium text-black mb-3 font-poppins">
                Job Title You Applied For *
              </label>
              <input
                type="text"
                id="jobTitle"
                value={employerInfo.jobTitle}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                placeholder="e.g., Software Developer, Sales Associate"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="streetAddress" className="block text-base font-medium text-black mb-3 font-poppins">
                  Street Address
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  value={employerInfo.streetAddress}
                  onChange={(e) => updateField('streetAddress', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="Company address (optional)"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-base font-medium text-black mb-3 font-poppins">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={employerInfo.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="City (optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="state" className="block text-base font-medium text-black mb-3 font-poppins">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={employerInfo.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="State (optional)"
                  maxLength={2}
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-base font-medium text-black mb-3 font-poppins">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  value={employerInfo.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="ZIP Code (optional)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm font-poppins font-medium">
            <strong>Note:</strong> This information will be used to generate your WOTC application for this specific employer. You can create multiple applications for different employers from your dashboard.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-8 rounded-xl transition-all duration-200 flex items-center font-poppins shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="mr-3 w-5 h-5" />
            Back to Dashboard
          </button>
          
          <button
            type="submit"
            className="bg-cinnabar hover:bg-red-600 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 flex items-center font-poppins shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue to Personal Info
            <ArrowRight className="ml-3 w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}; 