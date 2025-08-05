import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { WOTCFormData } from '../types/wotc';
import { validateDates, formatDate } from '../utils/dateValidation';

interface ValidationStepProps {
  formData: WOTCFormData;
  onNext: () => void;
  onPrevious: () => void;
  userType?: 'candidate' | 'employer';
}

export const ValidationStep: React.FC<ValidationStepProps> = ({
  formData,
  onNext,
  onPrevious,
  userType = 'candidate'
}) => {
  const dateValidation = validateDates(formData.importantDates, userType);
  const selectedGroups = formData.targetGroups.filter(group => group.selected);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          {dateValidation.isValid ? (
            <CheckCircle className="w-10 h-10 text-black" />
          ) : (
            <XCircle className="w-10 h-10 text-cinnabar" />
          )}
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">Validation Results</h2>
        <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
          {userType === 'candidate' 
            ? "Thank you. I'm now checking that: 1) Gave Info ≤ Offered Job ≤ Hired ≤ Started Work. If any dates are out of order, I'll ask you to revise."
            : "Thank you. I'm now validating the employment dates to ensure compliance with WOTC requirements. If any dates are inconsistent, I'll ask you to revise."
          }
        </p>
      </div>

      {/* Date Validation Results */}
      <div className={`rounded-xl p-8 mb-8 shadow-sm ${
        dateValidation.isValid 
          ? 'bg-white border-l-4 border-black' 
          : 'bg-white border-l-4 border-cinnabar'
      }`}>
        <div className="flex items-center mb-6">
          {dateValidation.isValid ? (
            <CheckCircle className="w-7 h-7 text-black mr-3" />
          ) : (
            <XCircle className="w-7 h-7 text-cinnabar mr-3" />
          )}
          <h3 className="font-medium text-black font-poppins text-xl">
            Date Sequence Validation
          </h3>
        </div>
        
        {dateValidation.isValid ? (
          <p className="text-gray35 font-poppins font-light leading-relaxed">
            ✓ All dates are in the correct chronological order and meet compliance requirements.
          </p>
        ) : (
          <div>
            <p className="text-black font-medium mb-4 font-poppins">The following issues were found:</p>
            <ul className="list-disc list-inside text-gray35 space-y-2 font-poppins font-light">
              {dateValidation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Summary of Information */}
      <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-100">
        <h3 className="font-medium text-black mb-6 font-poppins text-xl">Information Summary</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-black mb-3 font-poppins">Personal Information</h4>
            <div className="space-y-2 text-sm text-gray35 font-poppins font-light">
              <p><strong className="font-medium text-black">Name:</strong> {formData.personalInfo.fullName}</p>
              <p><strong className="font-medium text-black">Date of Birth:</strong> {formatDate(formData.personalInfo.dateOfBirth)}</p>
              <p><strong className="font-medium text-black">Address:</strong> {formData.personalInfo.streetAddress}, {formData.personalInfo.city}, {formData.personalInfo.state} {formData.personalInfo.zipCode}</p>
              <p><strong className="font-medium text-black">SSN (Last 4):</strong> ****{formData.personalInfo.ssnLastFour}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-black mb-3 font-poppins">Target Groups</h4>
            {selectedGroups.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray35 font-poppins font-light">
                {selectedGroups.map(group => (
                  <li key={group.id}>• {group.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray35 italic font-poppins font-light">No target groups selected</p>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <h4 className="font-medium text-black mb-3 font-poppins">Important Dates</h4>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray35 font-poppins font-light">
            <div>
              <p className="mb-2"><strong className="font-medium text-black">Gave Info:</strong> {formatDate(formData.importantDates.dateGaveInfo)}</p>
              <p><strong className="font-medium text-black">Offered:</strong> {formatDate(formData.importantDates.dateOffered)}</p>
            </div>
            <div>
              <p className="mb-2"><strong className="font-medium text-black">Hired:</strong> {formatDate(formData.importantDates.dateHired)}</p>
              <p><strong className="font-medium text-black">Started:</strong> {formatDate(formData.importantDates.dateStarted)}</p>
            </div>
          </div>
        </div>
      </div>

      {!dateValidation.isValid && (
        <div className="bg-white border-l-4 border-cinnabar rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-cinnabar mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray35 font-poppins">
              <p className="font-medium mb-2 text-black">Action Required:</p>
              <p className="font-light leading-relaxed">Please go back and correct the date issues before proceeding. The dates must be in chronological order and cannot be in the future.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-12">
        <button
          onClick={onPrevious}
          className="flex items-center px-8 py-4 text-gray35 hover:text-black transition-all duration-200 font-poppins font-medium rounded-xl hover:bg-gray-50"
        >
          <ArrowLeft className="mr-3 w-5 h-5" />
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!dateValidation.isValid}
          className={`font-medium py-4 px-10 rounded-xl transition-all duration-200 flex items-center font-poppins ${
            dateValidation.isValid
              ? 'bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray35 cursor-not-allowed'
          }`}
        >
          {dateValidation.isValid ? 'Proceed to Completion' : 'Fix Errors First'}
          <ArrowRight className="ml-3 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};