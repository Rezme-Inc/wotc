import React from 'react';
import { Building2, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  companyName: string;
  onNewApplication: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  companyName,
  onNewApplication
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-black mr-4" />
            <div>
              <h1 className="text-2xl font-semibold text-black">WOTC Management Dashboard</h1>
              <p className="text-gray35 font-light">{companyName}</p>
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
  );
}; 