import React, { useState, useEffect } from 'react';
import { Download, FileText, FileSignature as Signature, AlertCircle, AlertTriangle } from 'lucide-react';
import { WOTCFormData } from '../types/wotc';
import { formatDate } from '../utils/dateValidation';

interface CompletionStepProps {
  formData: WOTCFormData;
  employerInfo?: {
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
  };
  onComplete: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  formData,
  employerInfo,
  onComplete
}) => {
  const [signature, setSignature] = useState('');
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: boolean}>({});
  
  // Editable form state
  const [editablePersonalInfo, setEditablePersonalInfo] = useState(formData.personalInfo);
  const [editableImportantDates, setEditableImportantDates] = useState(formData.importantDates);
  
  // Editable checkbox state - will be initialized after getFormCheckboxes is defined
  const [editableCheckboxes, setEditableCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
    checkbox7: false
  });

    const handleSubmit = () => {
    const newErrors: string[] = [];
    const newFieldErrors: {[key: string]: boolean} = {};

    if (!signature.trim()) {
      newErrors.push(`${formData.userType === 'employer' ? 'Employer' : 'Electronic'} signature is required`);
      newFieldErrors.signature = true;
    } else {
      newFieldErrors.signature = false;
    }

    if (!signatureDate) {
      newErrors.push('Signature date is required');
      newFieldErrors.signatureDate = true;
    } else {
      newFieldErrors.signatureDate = false;
    }

    if (!isAgreed) {
      newErrors.push(`You must agree to the ${formData.userType === 'employer' ? 'employer' : ''} certification statement`);
      newFieldErrors.isAgreed = true;
    } else {
      newFieldErrors.isAgreed = false;
    }

    setErrors(newErrors);
    setFieldErrors(newFieldErrors);
    
    if (newErrors.length === 0) {
      onComplete();
    }
  };

  const formatDateForForm = (dateString: string): string => {
    if (!dateString) return '';
    // Parse the date string directly to avoid timezone issues
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      return `${month}/${day}/${year}`;
    }
    // Fallback for other date formats
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatSSNForDisplay = (ssn: string): string => {
    if (!ssn) return '';
    const digits = ssn.replace(/\D/g, '');
    if (digits.length === 9) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    }
    return ssn;
  };

  const formatEINForDisplay = (ein: string): string => {
    if (!ein) return '';
    const digits = ein.replace(/\D/g, '');
    if (digits.length === 9) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
    }
    return ein;
  };

  // Map selected target groups to form checkboxes
  const getFormCheckboxes = () => {
    const selectedGroups = formData.targetGroups.filter(group => group.selected);
    const checkboxes = {
      checkbox1: false, // Conditional certification
      checkbox2: false, // Any of the following statements
      checkbox3: false, // Veteran unemployed 6+ months
      checkbox4: false, // Veteran disabled discharged past year
      checkbox5: false, // Veteran disabled unemployed 6+ months
      checkbox6: false, // TANF family
      checkbox7: false  // Unemployed 27+ consecutive weeks
    };

    selectedGroups.forEach(group => {
      switch (group.id) {
        case 'snap_tanf':
        case 'ex_felon':
        case 'vocational_rehab':
        case 'summer_youth':
          checkboxes.checkbox2 = true;
          break;
        case 'unemployed_veteran':
          checkboxes.checkbox2 = true;
          checkboxes.checkbox3 = true;
          break;
        case 'disabled_veteran':
          checkboxes.checkbox4 = true;
          checkboxes.checkbox5 = true;
          break;
        case 'long_term_family_assistance':
          checkboxes.checkbox6 = true;
          break;
        case 'veteran':
          checkboxes.checkbox2 = true;
          break;
      }
    });

    return checkboxes;
  };

  // Initialize editable checkboxes with computed values
  useEffect(() => {
    const computedCheckboxes = getFormCheckboxes();
    setEditableCheckboxes(computedCheckboxes);
  }, [formData.targetGroups]);

  const handleCheckboxChange = (checkboxId: keyof typeof editableCheckboxes) => {
    setEditableCheckboxes(prev => ({
      ...prev,
      [checkboxId]: !prev[checkboxId]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <FileText className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">
          IRS Form 8850 {formData.userType === 'employer' ? 'Employer Section' : 'Preview'}
        </h2>
        <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
          {formData.userType === 'employer' 
            ? 'Here is the employer section of IRS Form 8850 with your company information. Please review carefully.'
            : 'Here is a preview of IRS Form 8850 with your entries. Please review carefully.'
          }
        </p>
      </div>

      {errors.length > 0 && (
        <div className="error-banner">
          <h3 className="error-banner-header">
            <AlertTriangle className="w-5 h-5 mr-3" />
            Please complete the following:
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

      {/* Edit Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">✏️</span>
          </div>
          <div>
            <p className="text-blue-800 text-sm font-poppins font-medium">
              <strong>Editable Form:</strong> You can click on any field or checkbox below to make corrections before final submission.
            </p>
          </div>
        </div>
      </div>

      {/* Form 8850 Preview */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-8 shadow-lg font-mono text-sm">
        {/* Form Header */}
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-3xl font-bold">8850</div>
              <div className="text-xs">(Rev. March 2016)</div>
              <div className="text-xs">Department of the Treasury</div>
              <div className="text-xs">Internal Revenue Service</div>
            </div>
            <div className="text-center flex-1 mx-8">
              <div className="text-lg font-bold">Pre-Screening Notice and Certification Request for</div>
              <div className="text-lg font-bold">the Work Opportunity Credit</div>
              <div className="text-xs mt-1">▶ Information about Form 8850 and its separate instructions is at www.irs.gov/form8850.</div>
            </div>
            <div className="text-right">
              <div className="text-sm">OMB No. 1545-1500</div>
            </div>
          </div>
        </div>

        {formData.userType === 'employer' ? (
          /* Employer Section */
          <div className="mb-6">
            <div className="font-bold text-center mb-6 text-lg">
              For Employer's Use Only
            </div>

            {/* Employer Information Fields */}
            <div className="space-y-6">
              {/* Employer Name, Phone, EIN Row */}
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="font-medium">Employer's name</span>
                  <div className="border-b border-gray-400 pb-1 mt-1">
                    <span className="font-poppins">{employerInfo?.companyName || '_'.repeat(40)}</span>
                  </div>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <span className="font-medium">Telephone no.</span>
                  <div className="border-b border-gray-400 pb-1 mt-1 w-32">
                    <span className="font-poppins">{employerInfo?.contactPhone || '_'.repeat(15)}</span>
                  </div>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <span className="font-medium">EIN ▶</span>
                  <div className="border-b border-gray-400 pb-1 mt-1 w-32">
                    <span className="font-poppins">{formatEINForDisplay(employerInfo?.employerEIN || '') || '_'.repeat(12)}</span>
                  </div>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <span className="font-medium">Street address</span>
                <div className="border-b border-gray-400 pb-1 mt-1">
                  <span className="font-poppins">{employerInfo?.streetAddress || '_'.repeat(80)}</span>
                </div>
              </div>

              {/* City, State, ZIP */}
              <div>
                <span className="font-medium">City or town, state, and ZIP code</span>
                <div className="border-b border-gray-400 pb-1 mt-1">
                  <span className="font-poppins">
                    {employerInfo?.city && employerInfo?.state && employerInfo?.zipCode
                      ? `${employerInfo.city}, ${employerInfo.state} ${employerInfo.zipCode}`
                      : '_'.repeat(80)
                    }
                  </span>
                </div>
              </div>

              {/* Contact Person and Phone */}
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="font-medium">Person to contact, if different from above</span>
                  <div className="border-b border-gray-400 pb-1 mt-1">
                    <span className="font-poppins">{employerInfo?.contactName || '_'.repeat(40)}</span>
                  </div>
                </div>
                <div className="ml-8 flex-shrink-0">
                  <span className="font-medium">Telephone no.</span>
                  <div className="border-b border-gray-400 pb-1 mt-1 w-40">
                    <span className="font-poppins">{employerInfo?.contactPhone || '_'.repeat(15)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Street Address */}
              <div>
                <span className="font-medium">Street address</span>
                <div className="border-b border-gray-400 pb-1 mt-1">
                  <span className="font-poppins">{employerInfo?.streetAddress || '_'.repeat(80)}</span>
                </div>
              </div>

              {/* Contact City, State, ZIP */}
              <div>
                <span className="font-medium">City or town, state, and ZIP code</span>
                <div className="border-b border-gray-400 pb-1 mt-1">
                  <span className="font-poppins">
                    {employerInfo?.city && employerInfo?.state && employerInfo?.zipCode
                      ? `${employerInfo.city}, ${employerInfo.state} ${employerInfo.zipCode}`
                      : '_'.repeat(80)
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Target Group Section */}
            <div className="mt-8 mb-6">
              <div className="text-xs leading-relaxed mb-4">
                If, based on the individual's age and home address, he or she is a member of group 4 or 6 (as described under <em>Members of Targeted Groups</em> in the separate instructions), enter that group number (4 or 6)
                <span className="ml-4">▶ <span className="border-b border-gray-400 pb-1 w-16 inline-block"></span></span>
              </div>
            </div>

            {/* Important Dates Section */}
            <div className="mb-8">
              <div className="text-sm font-medium mb-4">Date applicant:</div>
              <div className="grid grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="font-medium text-xs mb-2">Gave information</div>
                  <div className="border-b border-gray-400 pb-1">
                    <input
                      type="date"
                      value={editableImportantDates.dateGaveInfo}
                      onChange={(e) => setEditableImportantDates({...editableImportantDates, dateGaveInfo: e.target.value})}
                      className="bg-transparent border-none outline-none font-poppins text-xs w-full text-center"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs mb-2">Was offered job</div>
                  <div className="border-b border-gray-400 pb-1">
                    <input
                      type="date"
                      value={editableImportantDates.dateOffered}
                      onChange={(e) => setEditableImportantDates({...editableImportantDates, dateOffered: e.target.value})}
                      className="bg-transparent border-none outline-none font-poppins text-xs w-full text-center"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs mb-2">Was hired</div>
                  <div className="border-b border-gray-400 pb-1">
                    <input
                      type="date"
                      value={editableImportantDates.dateHired}
                      onChange={(e) => setEditableImportantDates({...editableImportantDates, dateHired: e.target.value})}
                      className="bg-transparent border-none outline-none font-poppins text-xs w-full text-center"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs mb-2">Started job</div>
                  <div className="border-b border-gray-400 pb-1">
                    <input
                      type="date"
                      value={editableImportantDates.dateStarted}
                      onChange={(e) => setEditableImportantDates({...editableImportantDates, dateStarted: e.target.value})}
                      className="bg-transparent border-none outline-none font-poppins text-xs w-full text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Certification Statement */}
            <div className="text-xs leading-relaxed mb-6">
              Under penalties of perjury, I declare that the applicant provided the information on this form on or before the day a job was offered to the applicant and that the information I have furnished is, to the best of my knowledge, true, correct, and complete. Based on the information the job applicant furnished on page 1, I believe the individual is a member of a targeted group. I hereby request a certification that the individual is a member of a targeted group.
            </div>

            {/* Signature Section */}
            <div className="border-t border-gray-400 pt-4">
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <div className="font-medium text-sm">Employer's signature ▶</div>
                  <div className="border-b border-gray-400 pb-1 mt-1">
                    <span className="font-poppins">{signature || '_'.repeat(40)}</span>
                  </div>
                </div>
                <div className="ml-8 w-32">
                  <div className="font-medium text-sm">Title</div>
                  <div className="border-b border-gray-400 pb-1 mt-1">
                    <span className="font-poppins">{employerInfo?.contactTitle || '_'.repeat(20)}</span>
                  </div>
                </div>
                <div className="ml-8 w-32">
                  <div className="font-medium text-sm">Date</div>
                  <div className="border-b border-gray-400 pb-1 mt-1">
                    <span className="font-poppins">{formatDateForForm(signatureDate) || '_'.repeat(10)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Candidate Section - Original Form */
          <>
            <div className="mb-6">
          <div className="font-bold text-center mb-6 text-sm">
            Job applicant: Fill in the lines below and check any boxes that apply. Complete only this side.
          </div>

          {/* Basic Information Fields */}
          <div className="space-y-4">
            {/* Name and SSN Row */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <span className="font-medium">Your name</span>
                <div className="border-b border-gray-400 pb-1 mt-1">
                  <input
                    type="text"
                    value={editablePersonalInfo.fullName}
                    onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, fullName: e.target.value})}
                    className="bg-transparent border-none outline-none font-poppins w-full text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className="ml-8 flex-shrink-0">
                <span className="font-medium">Social security number ▶</span>
                <div className="border-b border-gray-400 pb-1 mt-1 w-40">
                  <input
                    type="text"
                    value={editablePersonalInfo.socialSecurityNumber}
                    onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, socialSecurityNumber: e.target.value})}
                    className="bg-transparent border-none outline-none font-poppins w-full text-sm"
                    placeholder="___-__-____"
                    maxLength={11}
                  />
                </div>
              </div>
            </div>

            {/* Street Address */}
            <div>
              <span className="font-medium">Street address where you live</span>
              <div className="border-b border-gray-400 pb-1 mt-1">
                <input
                  type="text"
                  value={editablePersonalInfo.streetAddress}
                  onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, streetAddress: e.target.value})}
                  className="bg-transparent border-none outline-none font-poppins w-full text-sm"
                  placeholder="Enter your street address"
                />
              </div>
            </div>

            {/* City, State, ZIP */}
            <div>
              <span className="font-medium">City or town, state, and ZIP code</span>
              <div className="border-b border-gray-400 pb-1 mt-1 flex gap-2">
                <input
                  type="text"
                  value={editablePersonalInfo.city}
                  onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, city: e.target.value})}
                  className="bg-transparent border-none outline-none font-poppins flex-1 text-sm"
                  placeholder="City"
                />
                <span className="font-poppins text-sm">,</span>
                <input
                  type="text"
                  value={editablePersonalInfo.state}
                  onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, state: e.target.value})}
                  className="bg-transparent border-none outline-none font-poppins w-12 text-sm"
                  placeholder="ST"
                  maxLength={2}
                />
                <input
                  type="text"
                  value={editablePersonalInfo.zipCode}
                  onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, zipCode: e.target.value})}
                  className="bg-transparent border-none outline-none font-poppins w-20 text-sm"
                  placeholder="ZIP"
                  maxLength={10}
                />
              </div>
            </div>

            {/* County and Phone Row */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <span className="font-medium">County</span>
                <div className="border-b border-gray-400 pb-1 mt-1">
                  <input
                    type="text"
                    value={editablePersonalInfo.county}
                    onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, county: e.target.value})}
                    className="bg-transparent border-none outline-none font-poppins w-full text-sm"
                    placeholder="Enter county"
                  />
                </div>
              </div>
              <div className="ml-8 flex-shrink-0">
                <span className="font-medium">Telephone number</span>
                <div className="border-b border-gray-400 pb-1 mt-1 w-40">
                  <input
                    type="text"
                    value={editablePersonalInfo.telephoneNumber}
                    onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, telephoneNumber: e.target.value})}
                    className="bg-transparent border-none outline-none font-poppins w-full text-sm"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <span className="font-medium">If you are under age 40, enter your date of birth (month, day, year)</span>
              <div className="border-b border-gray-400 pb-1 mt-1 w-60">
                <input
                  type="date"
                  value={editablePersonalInfo.dateOfBirth}
                  onChange={(e) => setEditablePersonalInfo({...editablePersonalInfo, dateOfBirth: e.target.value})}
                  className="bg-transparent border-none outline-none font-poppins w-full text-sm"
                />
              </div>
            </div>
          </div>
            </div>

            <div className="space-y-4 mb-8">
            {/* Section 1 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4">
                <span className="font-bold mr-3">1</span>
                <div 
                  className="w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCheckboxChange('checkbox1')}
                >
                  {editableCheckboxes.checkbox1 && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                Check here if you received a conditional certification from the state workforce agency (SWA) or a participating local agency for the work opportunity credit.
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4">
                <span className="font-bold mr-3">2</span>
                <div 
                  className="w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCheckboxChange('checkbox2')}
                >
                  {editableCheckboxes.checkbox2 && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                <div className="mb-2">Check here if <strong>any</strong> of the following statements apply to you.</div>
                <ul className="list-none space-y-1 ml-2 text-xs">
                  <li>• I am a member of a family that has received assistance from Temporary Assistance for Needy Families (TANF) for any 9 months during the past 18 months.</li>
                  <li>• I am a veteran and a member of a family that received Supplemental Nutrition Assistance Program (SNAP) benefits (food stamps) for at least a 3-month period during the past 15 months.</li>
                  <li>• I was referred here by a rehabilitation agency approved by the state, an employment network under the Ticket to Work program, or the Department of Veterans Affairs.</li>
                  <li>• I am at least age 18 but <strong>not</strong> age 40 or older and I am a member of a family that:
                    <div className="ml-4 mt-1">
                      <div><strong>a.</strong> Received SNAP benefits (food stamps) for the past 6 months; <strong>or</strong></div>
                      <div><strong>b.</strong> Received SNAP benefits (food stamps) for at least 3 of the past 5 months, <strong>but</strong> is no longer eligible to receive them.</div>
                    </div>
                  </li>
                  <li>• During the past year, I was convicted of a felony or released from prison for a felony.</li>
                  <li>• I received supplemental security income (SSI) benefits for any month ending during the past 60 days.</li>
                  <li>• I am a veteran and I was unemployed for a period or periods totaling at least 4 weeks but less than 6 months during the past year.</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4">
                <span className="font-bold mr-3">3</span>
                <div 
                  className="w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCheckboxChange('checkbox3')}
                >
                  {editableCheckboxes.checkbox3 && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                Check here if you are a veteran and you were unemployed for a period or periods totaling at least 6 months during the past year.
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4">
                <span className="font-bold mr-3">4</span>
                <div 
                  className="w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCheckboxChange('checkbox4')}
                >
                  {editableCheckboxes.checkbox4 && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                Check here if you are a veteran entitled to compensation for a service-connected disability and you were discharged or released from active duty in the U.S. Armed Forces during the past year.
              </div>
            </div>

            {/* Section 5 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4">
                <span className="font-bold mr-3">5</span>
                <div 
                  className="w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCheckboxChange('checkbox5')}
                >
                  {editableCheckboxes.checkbox5 && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                Check here if you are a veteran entitled to compensation for a service-connected disability and you were unemployed for a period or periods totaling at least 6 months during the past year.
              </div>
            </div>

            {/* Section 6 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4">
                <span className="font-bold mr-3">6</span>
                <div 
                  className="w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCheckboxChange('checkbox6')}
                >
                  {editableCheckboxes.checkbox6 && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                <div className="mb-2">Check here if you are a member of a family that:</div>
                <ul className="list-none space-y-1 ml-2 text-xs">
                  <li>• Received TANF payments for at least the past 18 months; <strong>or</strong></li>
                  <li>• Received TANF payments for any 18 months beginning after August 5, 1997, and the earliest 18-month period beginning after August 5, 1997, ended during the past 2 years; <strong>or</strong></li>
                  <li>• Stopped being eligible for TANF payments during the past 2 years because federal or state law limited the maximum time those payments could be made.</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="flex items-start">
              <div className="flex items-center mr-4">
                <span className="font-bold mr-3">7</span>
                <div 
                  className="w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCheckboxChange('checkbox7')}
                >
                  {editableCheckboxes.checkbox7 && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                Check here if you are in a period of unemployment that is at least 27 consecutive weeks and for all or part of that period you received unemployment compensation.
              </div>
            </div>
            </div>

            {/* Signature Section */}
            <div className="border-t-2 border-black pt-4">
            <div className="text-center font-bold mb-4">Signature—All Applicants Must Sign</div>
            <div className="text-xs mb-4 leading-relaxed">
              Under penalties of perjury, I declare that I gave the above information to the employer on or before the day I was offered a job, and it is, to the best of my knowledge, true, correct, and complete.
            </div>
            
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <div className="font-medium">Job applicant's signature ▶</div>
                <div className="border-b border-gray-400 pb-1 mt-1">
                  <span className="font-poppins">{signature || '_'.repeat(40)}</span>
                </div>
              </div>
              <div className="ml-8 w-40">
                <div className="font-medium">Date</div>
                <div className="border-b border-gray-400 pb-1 mt-1">
                  <span className="font-poppins">{formatDateForForm(signatureDate) || '_'.repeat(15)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-xs mt-4">
              <div>For Privacy Act and Paperwork Reduction Act Notice, see page 2.</div>
              <div>Cat. No. 22851L</div>
              <div>Form <strong>8850</strong> (Rev. 3-2016)</div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Electronic Signature Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-8">
        <h3 className="font-medium text-black mb-6 flex items-center font-poppins text-xl">
          <Signature className="w-6 h-6 mr-3" />
          {formData.userType === 'employer' ? 'Employer Signature Required' : 'Candidate Signature Required'}
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-base font-medium text-black mb-3 font-poppins">
              {formData.userType === 'employer' 
                ? 'To complete the employer section, please type your full legal name as an electronic signature under penalties of perjury *'
                : 'To complete your section, please type your full legal name as an electronic signature under penalties of perjury *'
              }
            </label>
            <div className="field-error-container">
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
                placeholder="Type your full legal name here"
              />
              {fieldErrors.signature && (
                <AlertCircle className="field-error-icon" />
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-base font-medium text-black mb-3 font-poppins">
              Signature Date *
            </label>
            <div className="field-error-container">
              <input
                type="date"
                value={signatureDate}
                onChange={(e) => setSignatureDate(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
              />
              {fieldErrors.signatureDate && (
                <AlertCircle className="field-error-icon" />
              )}
            </div>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="certification"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="mt-1 mr-4 h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
            />
            <label htmlFor="certification" className="text-sm text-gray35 font-poppins font-light leading-relaxed">
              <strong className="font-medium text-black">Under penalties of perjury:</strong> 
              {formData.userType === 'employer' 
                ? ' I declare that the applicant provided the information on this form on or before the day a job was offered to the applicant and that the information I have furnished is, to the best of my knowledge, true, correct, and complete.'
                : ' I certify that the information provided above is true and complete to the best of my knowledge. I understand that this information will be used to determine eligibility for the Work Opportunity Tax Credit.'
              }
            </label>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={handleSubmit}
          className="bg-cinnabar hover:bg-red-600 text-white font-medium py-5 px-12 rounded-xl transition-all duration-200 flex items-center mx-auto text-lg font-poppins shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Download className="mr-3 w-6 h-6" />
          {formData.userType === 'employer' ? 'Complete Employer Section' : 'Complete Your Section'}
        </button>
        <p className="text-sm text-gray35 mt-4 font-poppins font-light">
          {formData.userType === 'employer' 
            ? 'Great—the employer section is complete. The form will be submitted to the State Workforce Agency for processing.'
            : 'Great—your section is complete. I\'ve sent the form to your employer for signature and submission. You\'ll receive a copy by email when it\'s filed.'
          }
        </p>
      </div>
    </div>
  );
};