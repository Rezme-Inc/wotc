import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Upload, 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calculator,
  Award,
  FileDown,
  Eye
} from 'lucide-react';

interface WOTCApplication {
  id: string;
  candidateName: string;
  position: string;
  submissionDate: string;
  status: 'submitted' | 'pending_swa' | 'conditional_cert' | 'final_cert' | 'denied';
  targetGroups: string[];
  daysWaiting: number;
  nextAction?: string;
  personalInfo?: {
    fullName: string;
    socialSecurityNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
    telephoneNumber: string;
    dateOfBirth: string;
  };
  importantDates?: {
    dateGaveInfo: string;
    dateOffered: string;
    dateHired: string;
    dateStarted: string;
  };
}

interface CertifiedEmployee {
  id: string;
  name: string;
  position: string;
  hireDate: string;
  targetGroup: string;
  hoursWorked: number;
  hourlyWage: number;
  totalWages: number;
  eligibleWages: number;
  creditRate: number;
  taxCredit: number;
  certificationDate: string;
  status: 'active' | 'completed';
}

interface EmployerDashboardProps {
  employerInfo: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
  onNewApplication: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  employerInfo,
  onNewApplication
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'certified'>('applications');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [showETAModal, setShowETAModal] = useState(false);
  const [selectedETAForm, setSelectedETAForm] = useState<'9061' | '9062' | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<WOTCApplication | null>(null);

  // Mock data for demonstration
  const [applications] = useState<WOTCApplication[]>([
    {
      id: '1',
      candidateName: 'John Smith',
      position: 'Customer Service Representative',
      submissionDate: '2024-01-15',
      status: 'submitted',
      targetGroups: ['Veteran', 'SNAP Recipient'],
      daysWaiting: 3,
      nextAction: 'Awaiting SWA response',
      personalInfo: {
        fullName: 'John Smith',
        socialSecurityNumber: '123-45-6789',
        streetAddress: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        county: 'Sangamon',
        telephoneNumber: '(555) 123-4567',
        dateOfBirth: '1985-03-15'
      },
      importantDates: {
        dateGaveInfo: '2024-01-10',
        dateOffered: '2024-01-12',
        dateHired: '2024-01-15',
        dateStarted: '2024-01-15'
      }
    },
    {
      id: '2',
      candidateName: 'Maria Garcia',
      position: 'Warehouse Associate',
      submissionDate: '2024-01-01',
      status: 'pending_swa',
      targetGroups: ['Ex-Felon'],
      daysWaiting: 17,
      nextAction: 'SWA response overdue - contact coordinator',
      personalInfo: {
        fullName: 'Maria Garcia',
        socialSecurityNumber: '987-65-4321',
        streetAddress: '456 Oak Avenue',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        county: 'Cook',
        telephoneNumber: '(555) 987-6543',
        dateOfBirth: '1990-07-22'
      },
      importantDates: {
        dateGaveInfo: '2023-12-28',
        dateOffered: '2023-12-30',
        dateHired: '2024-01-01',
        dateStarted: '2024-01-01'
      }
    },
    {
      id: '3',
      candidateName: 'David Johnson',
      position: 'Sales Associate',
      submissionDate: '2023-12-20',
      status: 'conditional_cert',
      targetGroups: ['Unemployed Veteran'],
      daysWaiting: 29,
      nextAction: 'Upload ETA Form 9062',
      personalInfo: {
        fullName: 'David Johnson',
        socialSecurityNumber: '456-78-9123',
        streetAddress: '789 Pine Street',
        city: 'Peoria',
        state: 'IL',
        zipCode: '61601',
        county: 'Peoria',
        telephoneNumber: '(555) 456-7890',
        dateOfBirth: '1982-11-08'
      },
      importantDates: {
        dateGaveInfo: '2023-12-15',
        dateOffered: '2023-12-18',
        dateHired: '2023-12-20',
        dateStarted: '2023-12-20'
      }
    }
  ]);

  // Mock certified employees data
  const [certifiedEmployees] = useState<CertifiedEmployee[]>([
    {
      id: '1',
      name: 'John Smith',
      position: 'Customer Service Representative',
      hireDate: '2024-01-15',
      targetGroup: 'Veteran',
      hoursWorked: 520,
      hourlyWage: 18.50,
      totalWages: 9620,
      eligibleWages: 6000,
      creditRate: 40,
      taxCredit: 2400,
      certificationDate: '2024-02-01',
      status: 'active'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      position: 'Warehouse Associate',
      hireDate: '2024-01-01',
      targetGroup: 'Ex-Felon',
      hoursWorked: 280,
      hourlyWage: 16.00,
      totalWages: 4480,
      eligibleWages: 4480,
      creditRate: 25,
      taxCredit: 1120,
      certificationDate: '2024-01-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'David Johnson',
      position: 'Sales Associate',
      hireDate: '2023-12-20',
      targetGroup: 'Disabled Veteran',
      hoursWorked: 800,
      hourlyWage: 22.00,
      totalWages: 17600,
      eligibleWages: 17600,
      creditRate: 40,
      taxCredit: 7040,
      certificationDate: '2024-01-05',
      status: 'completed'
    }
  ]);

  const calculateTaxCredit = (hoursWorked: number, totalWages: number, targetGroup: string) => {
    const isVeteran = targetGroup.toLowerCase().includes('veteran');
    const maxEligibleWages = isVeteran ? 24000 : 6000;
    const eligibleWages = Math.min(totalWages, maxEligibleWages);
    
    if (hoursWorked >= 400) {
      return { eligibleWages, creditRate: 40, taxCredit: eligibleWages * 0.40 };
    } else if (hoursWorked >= 120) {
      return { eligibleWages, creditRate: 25, taxCredit: eligibleWages * 0.25 };
    }
    return { eligibleWages: 0, creditRate: 0, taxCredit: 0 };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending_swa': return 'bg-yellow-100 text-yellow-800';
      case 'conditional_cert': return 'bg-green-100 text-green-800';
      case 'final_cert': return 'bg-emerald-100 text-emerald-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return 'Form Submitted';
      case 'pending_swa': return 'Pending SWA Response';
      case 'conditional_cert': return 'Conditional Certification';
      case 'final_cert': return 'Final Certification';
      case 'denied': return 'Denied';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'pending_swa': return <AlertTriangle className="w-4 h-4" />;
      case 'conditional_cert': return <CheckCircle className="w-4 h-4" />;
      case 'final_cert': return <CheckCircle className="w-4 h-4" />;
      case 'denied': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getNextActionMessage = (app: WOTCApplication) => {
    switch (app.status) {
      case 'submitted':
        return `Form 8850 has been successfully submitted to State SWA on ${new Date(app.submissionDate).toLocaleDateString()}. You will receive any conditional or final certification here.`;
      case 'pending_swa':
        return app.daysWaiting > 14 
          ? `It's been ${app.daysWaiting} days since filing and we have not yet received SWA's response. Please check your inbox or contact the state coordinator.`
          : `Awaiting SWA response. Submitted ${app.daysWaiting} days ago.`;
      case 'conditional_cert':
        return `The SWA response has arrived. To complete your WOTC claim, please follow the steps below:\n\n1. If you received Conditional Certification, upload ETA Form 9062.\n2. Otherwise, complete ETA Form 9061 (and ETA Form 9175 if long-term unemployed).`;
      default:
        return app.nextAction || '';
    }
  };

  const handleDownloadETAForm = (candidate: WOTCApplication, formType: '9061' | '9062') => {
    setSelectedCandidate(candidate);
    setSelectedETAForm(formType);
    setShowETAModal(true);
  };

  const generateETAFormData = (candidate: WOTCApplication, formType: '9061' | '9062') => {
    if (!candidate.personalInfo || !candidate.importantDates) return {};

    const commonData = {
      // Employee Information
      employeeName: candidate.personalInfo.fullName,
      employeeSSN: candidate.personalInfo.socialSecurityNumber,
      employeeAddress: candidate.personalInfo.streetAddress,
      employeeCity: candidate.personalInfo.city,
      employeeState: candidate.personalInfo.state,
      employeeZip: candidate.personalInfo.zipCode,
      employeePhone: candidate.personalInfo.telephoneNumber,
      employeeDOB: candidate.personalInfo.dateOfBirth,
      
      // Employer Information
      employerName: employerInfo.companyName,
      employerEIN: employerInfo.employerEIN,
      employerAddress: employerInfo.streetAddress,
      employerCity: employerInfo.city,
      employerState: employerInfo.state,
      employerZip: employerInfo.zipCode,
      employerPhone: employerInfo.contactPhone,
      
      // Job Information
      jobTitle: candidate.position,
      hireDate: candidate.importantDates.dateHired,
      startDate: candidate.importantDates.dateStarted,
      
      // Target Groups
      targetGroups: candidate.targetGroups.join(', ')
    };

    return commonData;
  };

  const downloadPrepopulatedForm = () => {
    if (!selectedCandidate || !selectedETAForm) return;

    const formData = generateETAFormData(selectedCandidate, selectedETAForm);
    const fileName = selectedETAForm === '9061' ? 'ETA-FORM-9061-(ENGLISH).pdf' : 'ETA-Form-9062.pdf';
    
    // Create a download link for the PDF
    const link = document.createElement('a');
    link.href = `/${fileName}`;
    link.download = `${fileName.replace('.pdf', '')}_${selectedCandidate.candidateName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowETAModal(false);
  };

  const generatePrintableForm = () => {
    if (!selectedCandidate || !selectedETAForm) return;

    // Get the candidate data and employer info
    const candidateData = selectedCandidate;
    const formData = {
      // Employee Information
      employeeName: candidateData.personalInfo?.fullName || candidateData.candidateName,
      employeeSSN: candidateData.personalInfo?.socialSecurityNumber || '',
      employeeAddress: candidateData.personalInfo?.streetAddress || '',
      employeeCity: candidateData.personalInfo?.city || '',
      employeeState: candidateData.personalInfo?.state || '',
      employeeZip: candidateData.personalInfo?.zipCode || '',
      employeeCounty: candidateData.personalInfo?.county || '',
      employeePhone: candidateData.personalInfo?.telephoneNumber || '',
      employeeDOB: candidateData.personalInfo?.dateOfBirth || '',
      
      // Employer Information
      employerName: employerInfo.companyName,
      employerEIN: employerInfo.employerEIN || '',
      employerAddress: employerInfo.streetAddress || '',
      employerCity: employerInfo.city || '',
      employerState: employerInfo.state || '',
      employerZip: employerInfo.zipCode || '',
      employerPhone: employerInfo.contactPhone || '',
      contactName: employerInfo.contactName || '',
      contactTitle: employerInfo.contactTitle || '',
      contactEmail: employerInfo.contactEmail || '',
      
      // Job Information
      jobTitle: candidateData.position,
      hireDate: candidateData.importantDates?.dateHired || '',
      startDate: candidateData.importantDates?.dateStarted || '',
      dateGaveInfo: candidateData.importantDates?.dateGaveInfo || '',
      dateOffered: candidateData.importantDates?.dateOffered || '',
      
      // Target Groups
      targetGroups: candidateData.targetGroups || []
    };
    
    // Create a new window with the form content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formContent = selectedETAForm === '9061' ? generateETA9061HTML(formData) : generateETA9062HTML(formData);
    
    printWindow.document.write(formContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    
    setShowETAModal(false);
  };

  const generateETA9061HTML = (data: any) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    const formatSSN = (ssn: string) => {
      if (!ssn) return '';
      const digits = ssn.replace(/\D/g, '');
      if (digits.length === 9) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
      }
      return ssn;
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ETA Form 9061 - ${data.employeeName}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11px; 
            margin: 20px; 
            line-height: 1.3;
            color: #000;
          }
          .form-header { 
            text-align: center; 
            font-weight: bold; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .form-section { 
            margin-bottom: 20px; 
            border: 1px solid #000;
            padding: 10px;
          }
          .form-row { 
            display: flex; 
            margin-bottom: 10px; 
            align-items: center;
          }
          .form-field { 
            margin-right: 20px; 
            flex: 1;
          }
          .form-label {
            font-weight: bold;
            margin-bottom: 5px;
            display: block;
          }
          .form-value {
            border-bottom: 1px solid #000;
            min-height: 20px;
            padding: 2px 5px;
            display: inline-block;
            min-width: 150px;
          }
          .checkbox-section {
            margin: 10px 0;
            padding: 5px;
            border: 1px solid #ccc;
          }
          .checkbox { 
            margin-right: 8px; 
            width: 15px;
            height: 15px;
            border: 1px solid #000;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
          }
          .signature-section {
            margin-top: 30px;
            border-top: 2px solid #000;
            padding-top: 20px;
          }
          .signature-line { 
            border-bottom: 1px solid #000; 
            width: 250px; 
            display: inline-block; 
            height: 25px;
            margin: 0 10px;
          }
          @media print {
            body { margin: 0; }
            .form-section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="form-header">
          <h1>U.S. DEPARTMENT OF LABOR</h1>
          <h2>Employment and Training Administration</h2>
          <h2>ETA FORM 9061</h2>
          <h3>Individual Characteristics Form</h3>
          <p>Work Opportunity Tax Credit Program (WOTC)</p>
        </div>
        
        <div class="form-section">
          <h4>SECTION A - EMPLOYEE INFORMATION</h4>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">1. Employee Name (Last, First, Middle):</span>
              <span class="form-value">${data.employeeName || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">2. Social Security Number:</span>
              <span class="form-value">${formatSSN(data.employeeSSN)}</span>
            </div>
            <div class="form-field">
              <span class="form-label">3. Date of Birth:</span>
              <span class="form-value">${formatDate(data.employeeDOB)}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">4. Street Address:</span>
              <span class="form-value">${data.employeeAddress || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">5. City:</span>
              <span class="form-value">${data.employeeCity || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">6. State:</span>
              <span class="form-value">${data.employeeState || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">7. ZIP Code:</span>
              <span class="form-value">${data.employeeZip || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">8. County:</span>
              <span class="form-value">${data.employeeCounty || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">9. Telephone Number:</span>
              <span class="form-value">${data.employeePhone || ''}</span>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h4>SECTION B - EMPLOYER INFORMATION</h4>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">10. Employer Name:</span>
              <span class="form-value">${data.employerName || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">11. EIN:</span>
              <span class="form-value">${data.employerEIN || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">12. Employer Address:</span>
              <span class="form-value">${data.employerAddress || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">13. City:</span>
              <span class="form-value">${data.employerCity || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">14. State:</span>
              <span class="form-value">${data.employerState || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">15. ZIP Code:</span>
              <span class="form-value">${data.employerZip || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">16. Contact Person:</span>
              <span class="form-value">${data.contactName || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">17. Phone:</span>
              <span class="form-value">${data.employerPhone || ''}</span>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h4>SECTION C - EMPLOYMENT INFORMATION</h4>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">18. Job Title/Position:</span>
              <span class="form-value">${data.jobTitle || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">19. Date Hired:</span>
              <span class="form-value">${formatDate(data.hireDate)}</span>
            </div>
            <div class="form-field">
              <span class="form-label">20. Date Started Work:</span>
              <span class="form-value">${formatDate(data.startDate)}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">21. Date Information Provided:</span>
              <span class="form-value">${formatDate(data.dateGaveInfo)}</span>
            </div>
            <div class="form-field">
              <span class="form-label">22. Date Job Offered:</span>
              <span class="form-value">${formatDate(data.dateOffered)}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4>SECTION D - TARGET GROUP INFORMATION</h4>
          <div class="checkbox-section">
            <p><strong>Target Groups Selected:</strong></p>
            ${Array.isArray(data.targetGroups) ? data.targetGroups.map(group => `
              <div style="margin: 5px 0;">
                <span class="checkbox">✓</span> ${group}
              </div>
            `).join('') : `<div><span class="checkbox">✓</span> ${data.targetGroups || 'None specified'}</div>`}
          </div>
        </div>
        
        <div class="signature-section">
          <h4>SECTION E - CERTIFICATION</h4>
          <p style="margin-bottom: 20px; font-size: 10px;">
            I certify that the information provided above is true and complete to the best of my knowledge. 
            I understand that this information will be used to determine eligibility for the Work Opportunity Tax Credit.
          </p>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">Employer Signature:</span>
              <span class="signature-line"></span>
            </div>
            <div class="form-field">
              <span class="form-label">Date:</span>
              <span class="signature-line"></span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">Title:</span>
              <span class="form-value">${data.contactTitle || ''}</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; font-size: 9px; text-align: center; border-top: 1px solid #000; padding-top: 10px;">
          <p>ETA Form 9061 (Rev. 12/2016) - Work Opportunity Tax Credit Program</p>
          <p>U.S. Department of Labor - Employment and Training Administration</p>
        </div>
      </body>
      </html>
    `;
  };

  const generateETA9062HTML = (data: any) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    const formatSSN = (ssn: string) => {
      if (!ssn) return '';
      const digits = ssn.replace(/\D/g, '');
      if (digits.length === 9) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
      }
      return ssn;
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ETA Form 9062 - ${data.employeeName}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11px; 
            margin: 20px; 
            line-height: 1.3;
            color: #000;
          }
          .form-header { 
            text-align: center; 
            font-weight: bold; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .form-section { 
            margin-bottom: 20px; 
            border: 1px solid #000;
            padding: 10px;
          }
          .form-row { 
            display: flex; 
            margin-bottom: 10px; 
            align-items: center;
          }
          .form-field { 
            margin-right: 20px; 
            flex: 1;
          }
          .form-label {
            font-weight: bold;
            margin-bottom: 5px;
            display: block;
          }
          .form-value {
            border-bottom: 1px solid #000;
            min-height: 20px;
            padding: 2px 5px;
            display: inline-block;
            min-width: 150px;
          }
          .checkbox-section {
            margin: 10px 0;
            padding: 5px;
            border: 1px solid #ccc;
          }
          .checkbox { 
            margin-right: 8px; 
            width: 15px;
            height: 15px;
            border: 1px solid #000;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
          }
          .signature-section {
            margin-top: 30px;
            border-top: 2px solid #000;
            padding-top: 20px;
          }
          .signature-line { 
            border-bottom: 1px solid #000; 
            width: 250px; 
            display: inline-block; 
            height: 25px;
            margin: 0 10px;
          }
          .certification-box {
            border: 2px solid #000;
            padding: 15px;
            margin: 20px 0;
            background-color: #f9f9f9;
          }
          @media print {
            body { margin: 0; }
            .form-section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="form-header">
          <h1>U.S. DEPARTMENT OF LABOR</h1>
          <h2>Employment and Training Administration</h2>
          <h2>ETA FORM 9062</h2>
          <h3>Conditional Certification</h3>
          <p>Work Opportunity Tax Credit Program (WOTC)</p>
        </div>
        
        <div class="form-section">
          <h4>SECTION A - EMPLOYEE INFORMATION</h4>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">1. Employee Name (Last, First, Middle):</span>
              <span class="form-value">${data.employeeName || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">2. Social Security Number:</span>
              <span class="form-value">${formatSSN(data.employeeSSN)}</span>
            </div>
            <div class="form-field">
              <span class="form-label">3. Date of Birth:</span>
              <span class="form-value">${formatDate(data.employeeDOB)}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">4. Street Address:</span>
              <span class="form-value">${data.employeeAddress || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">5. City:</span>
              <span class="form-value">${data.employeeCity || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">6. State:</span>
              <span class="form-value">${data.employeeState || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">7. ZIP Code:</span>
              <span class="form-value">${data.employeeZip || ''}</span>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h4>SECTION B - EMPLOYER INFORMATION</h4>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">8. Employer Name:</span>
              <span class="form-value">${data.employerName || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">9. EIN:</span>
              <span class="form-value">${data.employerEIN || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">10. Employer Address:</span>
              <span class="form-value">${data.employerAddress || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">11. City:</span>
              <span class="form-value">${data.employerCity || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">12. State:</span>
              <span class="form-value">${data.employerState || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">13. ZIP Code:</span>
              <span class="form-value">${data.employerZip || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">14. Contact Person:</span>
              <span class="form-value">${data.contactName || ''}</span>
            </div>
            <div class="form-field">
              <span class="form-label">15. Phone:</span>
              <span class="form-value">${data.employerPhone || ''}</span>
            </div>
          </div>
          </div>
        </div>
        
        <div class="form-section">
          <h4>SECTION C - EMPLOYMENT INFORMATION</h4>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">16. Job Title/Position:</span>
              <span class="form-value">${data.jobTitle || ''}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">17. Date Hired:</span>
              <span class="form-value">${formatDate(data.hireDate)}</span>
            </div>
            <div class="form-field">
              <span class="form-label">18. Date Started Work:</span>
              <span class="form-value">${formatDate(data.startDate)}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">19. Date Information Provided:</span>
              <span class="form-value">${formatDate(data.dateGaveInfo)}</span>
            </div>
            <div class="form-field">
              <span class="form-label">20. Date Job Offered:</span>
              <span class="form-value">${formatDate(data.dateOffered)}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4>SECTION D - TARGET GROUP CERTIFICATION</h4>
          <div class="checkbox-section">
            <p><strong>Certified Target Groups:</strong></p>
            ${Array.isArray(data.targetGroups) ? data.targetGroups.map(group => `
              <div style="margin: 5px 0;">
                <span class="checkbox">✓</span> ${group}
              </div>
            `).join('') : `<div><span class="checkbox">✓</span> ${data.targetGroups || 'None specified'}</div>`}
          </div>
        </div>

        <div class="certification-box">
          <h4>CONDITIONAL CERTIFICATION</h4>
          <p style="font-size: 10px; margin-bottom: 15px;">
            This serves as conditional certification that the above-named individual is a member of a targeted group 
            for purposes of the Work Opportunity Tax Credit. This certification is subject to verification by the 
            State Workforce Agency.
          </p>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">Certification Date:</span>
              <span class="form-value">${formatDate(new Date().toISOString())}</span>
            </div>
          </div>
        </div>
        
        <div class="signature-section">
          <h4>SECTION E - EMPLOYER CERTIFICATION</h4>
          <p style="margin-bottom: 20px; font-size: 10px;">
            I certify that the information provided above is true and complete to the best of my knowledge. 
            I understand that this conditional certification is subject to final verification by the State Workforce Agency.
          </p>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">Employer Signature:</span>
              <span class="signature-line"></span>
            </div>
            <div class="form-field">
              <span class="form-label">Date:</span>
              <span class="signature-line"></span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <span class="form-label">Title:</span>
              <span class="form-value">${data.contactTitle || ''}</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; font-size: 9px; text-align: center; border-top: 1px solid #000; padding-top: 10px;">
          <p>ETA Form 9062 (Rev. 12/2016) - Work Opportunity Tax Credit Program</p>
          <p>U.S. Department of Labor - Employment and Training Administration</p>
        </div>
      </body>
      </html>
    `;
  };
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTaxCredits = certifiedEmployees.reduce((sum, emp) => sum + emp.taxCredit, 0);
  const activeCertifications = certifiedEmployees.filter(emp => emp.status === 'active').length;
  const completedCertifications = certifiedEmployees.filter(emp => emp.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-black mr-4" />
              <div>
                <h1 className="text-2xl font-semibold text-black">WOTC Management Dashboard</h1>
                <p className="text-gray35 font-light">{employerInfo.companyName}</p>
              </div>
            </div>
            <button
              onClick={onNewApplication}
              className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              New WOTC Application
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'applications'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray35 hover:text-black hover:border-gray-300'
              }`}
            >
              WOTC Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('certified')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'certified'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray35 hover:text-black hover:border-gray-300'
              }`}
            >
              Certified WOTC ({certifiedEmployees.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'applications' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-black">{applications.length}</p>
                    <p className="text-sm text-gray35 font-light">Total Applications</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-black">
                      {applications.filter(app => app.status === 'pending_swa').length}
                    </p>
                    <p className="text-sm text-gray35 font-light">Pending SWA</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-black">
                      {applications.filter(app => app.status === 'conditional_cert' || app.status === 'final_cert').length}
                    </p>
                    <p className="text-sm text-gray35 font-light">Certified</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-black">
                      {applications.filter(app => app.daysWaiting > 14 && app.status === 'pending_swa').length}
                    </p>
                    <p className="text-sm text-gray35 font-light">Overdue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray35 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by candidate name or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Filter className="w-5 h-5 text-gray35 mr-2" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35"
                    >
                      <option value="all">All Status</option>
                      <option value="submitted">Form Submitted</option>
                      <option value="pending_swa">Pending SWA</option>
                      <option value="conditional_cert">Conditional Cert</option>
                      <option value="final_cert">Final Cert</option>
                      <option value="denied">Denied</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              {filteredApplications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-medium text-black mr-4">{app.candidateName}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span className="ml-1">{getStatusText(app.status)}</span>
                          </span>
                        </div>
                        <p className="text-gray35 font-light mb-2">{app.position}</p>
                        <div className="flex items-center text-sm text-gray35 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Submitted: {new Date(app.submissionDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {app.daysWaiting} days waiting
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray35 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200">
                          <Download className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDownloadETAForm(app, '9061')}
                          className="p-2 text-gray35 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          title="Download ETA Form 9061"
                        >
                          <FileDown className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDownloadETAForm(app, '9062')}
                          className="p-2 text-gray35 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          title="Download ETA Form 9062"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        {app.status === 'conditional_cert' && (
                          <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-cinnabar hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload ETA Forms
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Target Groups */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-black mb-2">Target Groups:</p>
                      <div className="flex flex-wrap gap-2">
                        {app.targetGroups.map((group, index) => (
                          <span key={index} className="bg-gray-100 text-gray35 px-3 py-1 rounded-full text-sm font-light">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Next Action */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                          {app.status === 'pending_swa' && app.daysWaiting > 14 ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-black" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-black mb-1">Next Action:</p>
                          <p className="text-sm text-gray35 font-light leading-relaxed whitespace-pre-line">
                            {getNextActionMessage(app)}
                          </p>
                          {app.status === 'conditional_cert' && (
                            <div className="mt-3 space-y-2">
                              <button
                                onClick={() => setShowUploadModal(true)}
                                className="text-sm text-black hover:text-gray-800 font-medium underline"
                              >
                                Please upload the ETA form(s) here. We'll bundle them with your candidate's file and prepare your final report.
                              </button>
                              <p className="text-sm text-gray35 font-light">
                                All WOTC documentation is now in your compliance dashboard. You may export a PDF audit packet at any time.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredApplications.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-black mb-2">No applications found</h3>
                <p className="text-gray35 font-light mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first WOTC application.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <button
                    onClick={onNewApplication}
                    className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center mx-auto"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Application
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'certified' && (
          <>
            {/* Certified WOTC Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-black">{certifiedEmployees.length}</p>
                    <p className="text-sm text-gray35 font-light">Total Certified</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-black">{activeCertifications}</p>
                    <p className="text-sm text-gray35 font-light">Active Employees</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-black">{completedCertifications}</p>
                    <p className="text-sm text-gray35 font-light">Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-black">${totalTaxCredits.toLocaleString()}</p>
                    <p className="text-sm text-gray35 font-light">Total Tax Credits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WOTC Calculation Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-medium text-black mb-4 flex items-center">
                <Calculator className="w-6 h-6 mr-3" />
                WOTC Tax Credit Calculation Rules
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray35 font-light">
                <div>
                  <h4 className="font-medium text-black mb-2">Standard Rate (40%)</h4>
                  <ul className="space-y-1">
                    <li>• Employee works 400+ hours</li>
                    <li>• Up to $6,000 in eligible wages</li>
                    <li>• Maximum credit: $2,400</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">Reduced Rate (25%)</h4>
                  <ul className="space-y-1">
                    <li>• Employee works 120-399 hours</li>
                    <li>• Up to $6,000 in eligible wages</li>
                    <li>• Maximum credit: $1,500</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">Veteran Exception</h4>
                  <ul className="space-y-1">
                    <li>• Up to $24,000 in eligible wages</li>
                    <li>• Maximum credit: $9,600 (40%)</li>
                    <li>• Same hour requirements apply</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    <li>• First year of employment</li>
                    <li>• Certified by state agency</li>
                    <li>• Member of targeted group</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Certified Employees List */}
            <div className="space-y-6">
              {certifiedEmployees.map((employee) => (
                <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-medium text-black mr-4">{employee.name}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {employee.status === 'active' ? 'Active' : 'Completed'}
                          </span>
                        </div>
                        <p className="text-gray35 font-light mb-2">{employee.position}</p>
                        <div className="flex items-center text-sm text-gray35 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Hired: {new Date(employee.hireDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            Certified: {new Date(employee.certificationDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-black">${employee.taxCredit.toLocaleString()}</p>
                        <p className="text-sm text-gray35 font-light">Tax Credit</p>
                      </div>
                    </div>

                    {/* Employee Details Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-black mb-3">Work Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray35">Hours Worked:</span>
                            <span className="font-medium text-black">{employee.hoursWorked}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray35">Hourly Wage:</span>
                            <span className="font-medium text-black">${employee.hourlyWage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray35">Total Wages:</span>
                            <span className="font-medium text-black">${employee.totalWages.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-black mb-3">WOTC Calculation</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray35">Eligible Wages:</span>
                            <span className="font-medium text-black">${employee.eligibleWages.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray35">Credit Rate:</span>
                            <span className="font-medium text-black">{employee.creditRate}%</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-2">
                            <span className="text-gray35">Tax Credit:</span>
                            <span className="font-semibold text-black">${employee.taxCredit.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-black mb-3">Target Group</h4>
                        <div className="space-y-2">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {employee.targetGroup}
                          </span>
                          <p className="text-xs text-gray35 font-light">
                            {employee.hoursWorked >= 400 
                              ? 'Qualifies for 40% credit rate'
                              : employee.hoursWorked >= 120
                              ? 'Qualifies for 25% credit rate'
                              : 'Does not qualify for credit'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray35 font-light">
                        Credit applies to first year wages only
                      </div>
                      <div className="flex space-x-3">
                        <button className="text-sm text-black hover:text-gray-800 font-medium underline">
                          View Documentation
                        </button>
                        <button 
                          onClick={() => handleDownloadETAForm(applications.find(app => app.candidateName === employee.name)!, '9061')}
                          className="text-sm text-black hover:text-gray-800 font-medium underline"
                        >
                          Download ETA Forms
                        </button>
                        <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
                          <Download className="w-4 h-4 mr-2" />
                          Export Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {certifiedEmployees.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-black mb-2">No certified employees yet</h3>
                <p className="text-gray35 font-light mb-6">
                  Once your WOTC applications are approved, certified employees will appear here with their tax credit calculations.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-medium text-black mb-4">Upload ETA Forms</h3>
            <p className="text-gray35 font-light mb-6">
              Please upload the required ETA forms to complete your WOTC claim.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray35 font-light">
                Drag and drop files here, or click to browse
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray35 hover:text-black transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ETA Form Preview Modal */}
      {showETAModal && selectedCandidate && selectedETAForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-black">
                  ETA Form {selectedETAForm} - {selectedCandidate.candidateName}
                </h3>
                <button
                  onClick={() => setShowETAModal(false)}
                  className="text-gray35 hover:text-black"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-black mb-4">Form Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray35 mb-1">Employee:</p>
                    <p className="font-medium text-black">{selectedCandidate.candidateName}</p>
                  </div>
                  <div>
                    <p className="text-gray35 mb-1">Position:</p>
                    <p className="font-medium text-black">{selectedCandidate.position}</p>
                  </div>
                  <div>
                    <p className="text-gray35 mb-1">Target Groups:</p>
                    <p className="font-medium text-black">{selectedCandidate.targetGroups.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray35 mb-1">Hire Date:</p>
                    <p className="font-medium text-black">
                      {selectedCandidate.importantDates ? new Date(selectedCandidate.importantDates.dateHired).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This form has been automatically populated with information from the candidate's Form 8850 
                  and your company details. Please review all information for accuracy before submission.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowETAModal(false)}
                  className="px-4 py-2 text-gray35 hover:text-black transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={generatePrintableForm}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate & Print Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};