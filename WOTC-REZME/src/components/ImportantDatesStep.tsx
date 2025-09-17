import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Calendar, AlertCircle, AlertTriangle } from 'lucide-react';
import { ImportantDates } from '../types/wotc';
import { useValidation } from '../hooks/useValidation';

interface ImportantDatesStepProps {
  importantDates: ImportantDates;
  onUpdate: (dates: ImportantDates) => void;
  onNext: () => void;
  onPrevious: () => void;
  userType?: 'candidate' | 'employer';
}

export const ImportantDatesStep: React.FC<ImportantDatesStepProps> = ({
  importantDates,
  onUpdate,
  onNext,
  onPrevious,
  userType = 'candidate'
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const { validateImportantDates } = useValidation();

  const validateAndProceed = () => {
    const validation = validateImportantDates(importantDates, userType);
    setErrors(validation.errors);

    if (validation.isValid) {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <Calendar className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">Important Dates</h2>
        {userType === 'candidate' ? (
          <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
            Please provide the following employment-related dates for compliance verification.
          </p>
        ) : (
          <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
            Please confirm the following employment-related dates provided by your candidate. Update any dates if needed.
          </p>
        )}
      </div>

            {errors.length > 0 && (
        <div className="error-banner">
          <h3 className="error-banner-header">
            <AlertTriangle className="w-5 h-5 mr-3" />
            The following issues were found:
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
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-black mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-2 text-black font-poppins">
                {userType === 'candidate' ? 'Date Sequence Requirements:' : 'Date Sequence Requirements:'}
              </p>
              <p className="text-gray35 font-poppins font-light leading-relaxed">
                {userType === 'candidate' 
                  ? 'These dates must be in chronological order: 1. Gave Info → 2. Offered → 3. Hired → 4. Started'
                  : 'For employers: 1. Gave Info → 2. Offered (both Hired & Started must come after steps 1 and 2)'
                }
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-black mb-3 font-poppins">
            {userType === 'candidate' 
              ? '1. Date You First Provided Target Group Information ate You First Provided Target Group Information *'
              : '1. Date You Were First Provided Target Group Information *'
            }
          </label>
          <input
            type="date"
            value={importantDates.dateGaveInfo}
            onChange={(e) => onUpdate({ ...importantDates, dateGaveInfo: e.target.value })}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
          />
          <p className="text-sm text-gray35 mt-2 font-poppins font-light leading-relaxed">
            {userType === 'candidate'
              ? 'On what date did you first provide information to your employer that you belong to one of these targeted groups?'
              : 'On what date did the candidate first provide information that they belong to one of these targeted groups?'
            }
          </p>
        </div>

        <div>
          <label className="block text-base font-medium text-black mb-3 font-poppins">
            {userType === 'candidate'
              ? '2. Date You Were Offered This Position *'
              : '2. Date You Offered This Position *'
            }
          </label>
          <input
            type="date"
            value={importantDates.dateOffered}
            onChange={(e) => onUpdate({ ...importantDates, dateOffered: e.target.value })}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
          />
          <p className="text-sm text-gray35 mt-2 font-poppins font-light leading-relaxed">
            {userType === 'candidate'
              ? 'On what date were you offered this position?'
              : 'On what date did you offer this position to the candidate?'
            }
          </p>
        </div>

        <div>
          <label className="block text-base font-medium text-black mb-3 font-poppins">
            {userType === 'candidate'
              ? '3. Date You Were Hired *'
              : '3. Date Candidate Was Hired *'
            }
          </label>
          <input
            type="date"
            value={importantDates.dateHired}
            onChange={(e) => onUpdate({ ...importantDates, dateHired: e.target.value })}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
          />
          <p className="text-sm text-gray35 mt-2 font-poppins font-light leading-relaxed">
            {userType === 'candidate'
              ? 'On what date were you hired?'
              : 'On what date was the candidate hired?'
            }
          </p>
        </div>

        <div>
          <label className="block text-base font-medium text-black mb-3 font-poppins">
            {userType === 'candidate'
              ? '4. ate You Started Work *'
              : '4. Date Candidate Started Work *'
            }
          </label>
          <input
            type="date"
            value={importantDates.dateStarted}
            onChange={(e) => onUpdate({ ...importantDates, dateStarted: e.target.value })}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
          />
          <p className="text-sm text-gray35 mt-2 font-poppins font-light leading-relaxed">
            {userType === 'candidate'
              ? 'On what date did you start work?'
              : 'On what date did the candidate start work?'
            }
          </p>
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