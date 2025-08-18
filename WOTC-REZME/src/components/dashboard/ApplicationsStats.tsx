import React from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ApplicationsStatsProps {
  totalApplications: number;
  pendingSWA: number;
  certified: number;
  overdue: number;
}

export const ApplicationsStats: React.FC<ApplicationsStatsProps> = ({
  totalApplications,
  pendingSWA,
  certified,
  overdue
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-2xl font-semibold text-black">{totalApplications}</p>
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
            <p className="text-2xl font-semibold text-black">{pendingSWA}</p>
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
            <p className="text-2xl font-semibold text-black">{certified}</p>
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
            <p className="text-2xl font-semibold text-black">{overdue}</p>
            <p className="text-sm text-gray35 font-light">Overdue</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 