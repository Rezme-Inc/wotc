import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Building2, MapPin, Phone, Calendar, FileText } from 'lucide-react';

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

  const validateAndProceed = () => {
    const newErrors: string[] = [];
    
    if (!employerInfo.companyName.trim()) newErrors.push('Company name is required');
    if (!employerInfo.employerEIN.trim()) newErrors.push('Employer EIN is required');
    if (!employerInfo.streetAddress.trim()) newErrors.push('Street address is required');
    if (!employerInfo.city.trim()) newErrors.push('City is required');
    if (!employerInfo.state.trim()) newErrors.push('State is required');
    if (!employerInfo.zipCode.trim()) newErrors.push('ZIP code is required');
    if (!employerInfo.contactName.trim()) newErrors.push('Contact name is required');
    if (!employerInfo.contactTitle.trim()) newErrors.push('Contact title is required');
    if (!employerInfo.contactPhone.trim()) newErrors.push('Contact phone is required');
    if (!employerInfo.contactEmail.trim()) newErrors.push('Contact email is required');
    if (!employerInfo.jobTitle.trim()) newErrors.push('Job title is required');
    if (!employerInfo.startDate) newErrors.push('Start date is required');
    if (!employerInfo.hourlyWage.trim()) newErrors.push('Hourly wage is required');
    if (!employerInfo.hoursPerWeek.trim()) newErrors.push('Hours per week is required');
    
    setErrors(newErrors);
    
    if (newErrors.length === 0) {
      onNext();
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

  return (
    <div className="max-w-4xl mx-auto">
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
        <div className="bg-white border-l-4 border-cinnabar rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-black font-medium mb-3 font-poppins">Please correct the following:</h3>
          <ul className="list-disc list-inside text-gray35 text-sm space-y-2 font-poppins font-light">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-8">
        {/* Company Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="font-medium text-black mb-6 font-poppins text-xl flex items-center">
            <Building2 className="w-6 h-6 mr-3" />
            Company Information
          </h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={employerInfo.companyName}
                  onChange={(e) => onUpdate({ ...employerInfo, companyName: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Employer EIN *
                </label>
                <input
                  type="text"
                  value={employerInfo.employerEIN}
                  onChange={(e) => {
                    const formatted = formatEIN(e.target.value);
                    onUpdate({ ...employerInfo, employerEIN: formatted });
                  }}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="XX-XXXXXXX"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-black mb-3 font-poppins">
                Street Address *
              </label>
              <input
                type="text"
                value={employerInfo.streetAddress}
                onChange={(e) => onUpdate({ ...employerInfo, streetAddress: e.target.value })}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                placeholder="Enter company street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  City *
                </label>
                <input
                  type="text"
                  value={employerInfo.city}
                  onChange={(e) => onUpdate({ ...employerInfo, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  State *
                </label>
                <input
                  type="text"
                  value={employerInfo.state}
                  onChange={(e) => onUpdate({ ...employerInfo, state: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="State"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={employerInfo.zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onUpdate({ ...employerInfo, zipCode: value });
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="ZIP Code"
                  maxLength={5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="font-medium text-black mb-6 font-poppins text-xl flex items-center">
            <Phone className="w-6 h-6 mr-3" />
            Contact Information
          </h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={employerInfo.contactName}
                  onChange={(e) => onUpdate({ ...employerInfo, contactName: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Contact Title *
                </label>
                <input
                  type="text"
                  value={employerInfo.contactTitle}
                  onChange={(e) => onUpdate({ ...employerInfo, contactTitle: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter contact title"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Contact Phone *
                </label>
                <input
                  type="text"
                  value={employerInfo.contactPhone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    onUpdate({ ...employerInfo, contactPhone: formatted });
                  }}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="(XXX) XXX-XXXX"
                  maxLength={14}
                />
              </div>

              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={employerInfo.contactEmail}
                  onChange={(e) => onUpdate({ ...employerInfo, contactEmail: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter contact email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="font-medium text-black mb-6 font-poppins text-xl flex items-center">
            <FileText className="w-6 h-6 mr-3" />
            Job Information
          </h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={employerInfo.jobTitle}
                  onChange={(e) => onUpdate({ ...employerInfo, jobTitle: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter job title"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={employerInfo.startDate}
                  onChange={(e) => onUpdate({ ...employerInfo, startDate: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Hourly Wage *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray35 font-poppins">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={employerInfo.hourlyWage}
                    onChange={(e) => onUpdate({ ...employerInfo, hourlyWage: e.target.value })}
                    className="w-full pl-8 pr-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-black mb-3 font-poppins">
                  Hours Per Week *
                </label>
                <input
                  type="number"
                  value={employerInfo.hoursPerWeek}
                  onChange={(e) => onUpdate({ ...employerInfo, hoursPerWeek: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                  placeholder="40"
                  min="1"
                  max="80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <button
          onClick={onPrevious}
          className="flex items-center px-8 py-4 text-gray35 hover:text-black transition-all duration-200 font-poppins font-medium rounded-xl hover:bg-gray-50"
        >
          <ArrowLeft className="mr-3 w-5 h-5" />
          Previous
        </button>
        <button
          onClick={validateAndProceed}
          className="btn-primary flex items-center px-10 py-4"
        >
          Continue
          <ArrowRight className="ml-3 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};