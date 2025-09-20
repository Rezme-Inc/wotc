import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Users, Info, X } from 'lucide-react';
import { TargetGroup } from '../types/wotc';

interface TargetGroupsStepProps {
  targetGroups: TargetGroup[];
  onUpdate: (groups: TargetGroup[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const TargetGroupsStep: React.FC<TargetGroupsStepProps> = ({
  targetGroups,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [modalGroup, setModalGroup] = useState<TargetGroup | null>(null);

  const handleGroupToggle = (groupId: string) => {
    const updatedGroups = targetGroups.map(group =>
      group.id === groupId ? { ...group, selected: !group.selected } : group
    );
    onUpdate(updatedGroups);
  };

  const openModal = (group: TargetGroup) => {
    setModalGroup(group);
  };

  const closeModal = () => {
    setModalGroup(null);
  };

  const selectedCount = targetGroups.filter(group => group.selected).length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <Users className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">Target Groups</h2>
        <p className="text-gray35 mb-4 font-poppins font-light text-lg leading-relaxed">
          Which of the following targeted group(s) describe you? (Select all that apply)
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm font-poppins font-medium leading-relaxed">
            <strong>Documentation Required:</strong> Any category you select will require documentation to prove that you belong to the group. Don't worry—we'll help you collect the documents from the people that could help you gather them.
          </p>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="bg-white border-l-4 border-cinnabar rounded-lg p-5 mb-8 shadow-sm">
          <p className="text-black text-sm font-poppins font-medium">
            <strong>{selectedCount}</strong> target group{selectedCount !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      <div className="space-y-5">
        {targetGroups.map((group) => (
          <div key={group.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            <div className="p-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={group.selected}
                  onChange={() => handleGroupToggle(group.id)}
                  className="mt-1 mr-4 h-5 w-5 text-black focus:ring-black border-gray-300 rounded transition-colors duration-200"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <h3 className="font-medium text-black font-poppins text-lg mr-2">{group.name}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        openModal(group);
                      }}
                      className="text-gray-400 hover:text-black transition-colors duration-200"
                      title="Click for more details"
                    >
                      <Info size={18} />
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray35 font-poppins font-light leading-relaxed">{group.description}</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mt-10 border border-gray-100">
        <p className="text-sm text-gray35 font-poppins font-light leading-relaxed">
          <strong className="font-medium text-black">Note:</strong> You may select multiple categories if they apply to you. 
          If none of these categories apply, you may proceed without selecting any.
        </p>
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
          onClick={onNext}
          className="btn-primary flex items-center px-10 py-4"
        >
          Continue
          <ArrowRight className="ml-3 w-5 h-5" />
        </button>
      </div>

      {/* Modal */}
      {modalGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-black font-poppins">{modalGroup.name}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-black transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray35 font-poppins font-light leading-relaxed">{modalGroup.description}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-poppins font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};