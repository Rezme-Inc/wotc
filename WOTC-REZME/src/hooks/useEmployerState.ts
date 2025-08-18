import { useState, useCallback } from 'react';

export interface EmployerInfo {
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

export interface WOTCApplication {
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

export interface CertifiedEmployee {
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

const getInitialEmployerInfo = (): EmployerInfo => ({
  companyName: '',
  employerEIN: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  contactName: '',
  contactTitle: '',
  contactPhone: '',
  contactEmail: '',
  jobTitle: '',
  startDate: '',
  hourlyWage: '',
  hoursPerWeek: ''
});

// Mock data - in a real app, this would come from an API
const getMockApplications = (): WOTCApplication[] => [
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
];

const getMockCertifiedEmployees = (): CertifiedEmployee[] => [
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
];

export const useEmployerState = () => {
  const [employerInfo, setEmployerInfo] = useState<EmployerInfo>(getInitialEmployerInfo());
  const [applications, setApplications] = useState<WOTCApplication[]>(getMockApplications());
  const [certifiedEmployees, setCertifiedEmployees] = useState<CertifiedEmployee[]>(getMockCertifiedEmployees());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'applications' | 'certified'>('applications');

  const updateEmployerInfo = useCallback((info: EmployerInfo) => {
    setEmployerInfo(info);
  }, []);

  const resetEmployerInfo = useCallback(() => {
    setEmployerInfo(getInitialEmployerInfo());
  }, []);

  const filteredApplications = applications.filter((app: WOTCApplication) => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTaxCredits = certifiedEmployees.reduce((sum: number, emp: CertifiedEmployee) => sum + emp.taxCredit, 0);
  const activeCertifications = certifiedEmployees.filter((emp: CertifiedEmployee) => emp.status === 'active').length;
  const completedCertifications = certifiedEmployees.filter((emp: CertifiedEmployee) => emp.status === 'completed').length;

  return {
    employerInfo,
    applications,
    certifiedEmployees,
    searchTerm,
    statusFilter,
    activeTab,
    filteredApplications,
    totalTaxCredits,
    activeCertifications,
    completedCertifications,
    updateEmployerInfo,
    resetEmployerInfo,
    setSearchTerm,
    setStatusFilter,
    setActiveTab
  };
}; 