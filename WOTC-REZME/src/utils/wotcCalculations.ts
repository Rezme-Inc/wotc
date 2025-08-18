export interface WOTCCalculationResult {
  eligibleWages: number;
  creditRate: number;
  taxCredit: number;
}

export const calculateTaxCredit = (
  hoursWorked: number, 
  totalWages: number, 
  targetGroup: string
): WOTCCalculationResult => {
  const isVeteran = targetGroup.toLowerCase().includes('veteran');
  const maxEligibleWages = isVeteran ? 24000 : 6000;
  const eligibleWages = Math.min(totalWages, maxEligibleWages);
  
  if (hoursWorked >= 400) {
    return { 
      eligibleWages, 
      creditRate: 40, 
      taxCredit: eligibleWages * 0.40 
    };
  } else if (hoursWorked >= 120) {
    return { 
      eligibleWages, 
      creditRate: 25, 
      taxCredit: eligibleWages * 0.25 
    };
  }
  
  return { 
    eligibleWages: 0, 
    creditRate: 0, 
    taxCredit: 0 
  };
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'submitted': 
      return 'status-info';
    case 'pending_swa': 
      return 'status-warning';
    case 'conditional_cert': 
      return 'status-success';
    case 'final_cert': 
      return 'status-success bg-green-100 text-green-800 border-green-300';
    case 'denied': 
      return 'status-error';
    default: 
      return 'status-badge bg-gray-100 text-gray35 border-gray-200';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'submitted': return 'Form Submitted';
    case 'pending_swa': return 'Pending SWA Response';
    case 'conditional_cert': return 'Conditional Certification';
    case 'final_cert': return 'Final Certification';
    case 'denied': return 'Denied';
    default: return status;
  }
};

export const getNextActionMessage = (app: any): string => {
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