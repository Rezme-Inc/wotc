import React from 'react';

interface DashboardTabsProps {
  activeTab: 'applications' | 'certified';
  applicationsCount: number;
  certifiedCount: number;
  onTabChange: (tab: 'applications' | 'certified') => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  applicationsCount,
  certifiedCount,
  onTabChange
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onTabChange('applications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'applications'
                ? 'border-black text-black'
                : 'border-transparent text-gray35 hover:text-black hover:border-gray-300'
            }`}
          >
            WOTC Applications ({applicationsCount})
          </button>
          <button
            onClick={() => onTabChange('certified')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'certified'
                ? 'border-black text-black'
                : 'border-transparent text-gray35 hover:text-black hover:border-gray-300'
            }`}
          >
            Certified WOTC ({certifiedCount})
          </button>
        </nav>
      </div>
    </div>
  );
}; 