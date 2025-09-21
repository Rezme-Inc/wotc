import React, { useState } from 'react';
import { FileText, Download, Eye, X, User, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { WOTCFormData, DocumentUpload, UserProfile, WOTCApplication } from '../types/wotc';

interface CandidateDashboardProps {
  userProfile: UserProfile;
  onNewApplication: () => void;
  onLogout: () => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  userProfile,
  onNewApplication,
  onLogout
}) => {
  const [previewDocument, setPreviewDocument] = useState<DocumentUpload | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'documents' | 'profile'>('overview');
  const [selectedApplication, setSelectedApplication] = useState<WOTCApplication | null>(
    userProfile.applications.length > 0 ? userProfile.applications[0] : null
  );

  // Get current data to display (either from selected application or default empty state)
  const currentData = selectedApplication || {
    personalInfo: { fullName: '', socialSecurityNumber: '', streetAddress: '', city: '', state: '', zipCode: '', county: '', telephoneNumber: '', dateOfBirth: '', conditionalCertification: false, targetGroupStatements: false, veteranUnemployed4to6Months: false, veteranDisabledDischarged: false, veteranDisabledUnemployed6Months: false, tanfFamily: false, unemploymentCompensation: false },
    targetGroups: [],
    importantDates: { dateGaveInfo: '', dateOffered: '', dateHired: '', dateStarted: '' },
    documents: [],
    isComplete: false
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isPreviewable = (fileType: string) => {
    return fileType.includes('pdf') ||
           fileType.includes('image/') ||
           fileType.includes('text/') ||
           fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
           fileType.includes('application/msword') ||
           fileType.includes('heic') ||
           fileType.includes('heif');
  };

  const handlePreviewDocument = (document: DocumentUpload) => {
    setPreviewDocument(document);
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  const createFilePreviewURL = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const getFilePreviewURL = (document: DocumentUpload): string => {
    if (document.file) {
      return createFilePreviewURL(document.file);
    }
    return '';
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSSNForDisplay = (ssn: string): string => {
    if (!ssn) return 'Not provided';
    const digits = ssn.replace(/\D/g, '');
    if (digits.length === 9) {
      return `***-**-${digits.slice(5, 9)}`;
    }
    return '***-**-****';
  };

  const selectedTargetGroups = currentData.targetGroups?.filter(group => group.selected) || [];
  const targetGroupDocs = currentData.documents?.filter(doc => doc.targetGroupId !== 'irs-form-8850' && doc.targetGroupId !== 'employment-documents') || [];
  const employmentDocs = currentData.documents?.filter(doc => doc.targetGroupId === 'employment-documents') || [];

  const TabButton: React.FC<{ id: string; label: string; isActive: boolean; onClick: () => void }> = ({
    id, label, isActive, onClick
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
        isActive
          ? 'bg-black text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-black font-poppins">RÉZME WOTC Dashboard</h1>
                <p className="text-sm text-gray-600 font-poppins">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onNewApplication}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-poppins text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </button>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 transition-colors font-poppins text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {userProfile.applications.length === 0 ? (
          /* No Applications State */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">No WOTC Applications Yet</h2>
            <p className="text-gray-600 mb-8 font-poppins max-w-md mx-auto">
              Start your first WOTC application by clicking the "New Application" button above.
            </p>
            <button
              onClick={onNewApplication}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors font-poppins flex items-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Your First Application
            </button>
          </div>
        ) : (
          <>
            {/* Application Summary Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 font-poppins">
                      {userProfile.applications.length} WOTC Application{userProfile.applications.length !== 1 ? 's' : ''} Submitted
                    </h3>
                    <p className="text-green-700 font-poppins">
                      Your applications have been submitted successfully. Employers will receive the completed forms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 mb-8">
              <TabButton 
                id="overview" 
                label="Overview" 
                isActive={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')} 
              />
              <TabButton 
                id="applications" 
                label={`Applications (${userProfile.applications.length})`}
                isActive={activeTab === 'applications'} 
                onClick={() => setActiveTab('applications')} 
              />
              {selectedApplication && (
                <>
                  <TabButton 
                    id="documents" 
                    label={`Documents (${(currentData.documents?.length || 0) + 1})`} // +1 for IRS Form 8850
                    isActive={activeTab === 'documents'} 
                    onClick={() => setActiveTab('documents')} 
                  />
                  <TabButton 
                    id="profile" 
                    label="Profile" 
                    isActive={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')} 
                  />
                </>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 font-poppins">Applications Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-poppins">Total Applications</span>
                      <span className="font-medium text-black font-poppins">{userProfile.applications.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-poppins">Completed Applications</span>
                      <span className="font-medium text-green-600 font-poppins">{userProfile.applications.filter(app => app.isComplete).length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-poppins">Total Documents</span>
                      <span className="font-medium text-black font-poppins">
                        {userProfile.applications.reduce((total, app) => total + (app.documents?.length || 0), 0) + userProfile.applications.length}
                      </span> {/* +1 IRS Form per application */}
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-poppins">Target Groups Disclosed</span>
                      <span className="font-medium text-black font-poppins">
                        {Array.from(new Set(
                          userProfile.applications.flatMap(app => 
                            app.targetGroups?.filter(group => group.selected).map(group => group.id) || []
                          )
                        )).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-poppins">Latest Application</span>
                      <span className="font-medium text-black font-poppins">
                        {userProfile.applications.length > 0 
                          ? new Date(userProfile.applications[userProfile.applications.length - 1].createdDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric'
                            })
                          : 'None'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Groups Disclosed */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 font-poppins">Target Groups You've Disclosed</h3>
                  {(() => {
                    // Get unique target groups across all applications
                    const allSelectedGroups = userProfile.applications.flatMap(app => 
                      app.targetGroups?.filter(group => group.selected) || []
                    );
                    
                    // Create a map to deduplicate by ID and count occurrences
                    const groupMap = new Map();
                    allSelectedGroups.forEach(group => {
                      if (groupMap.has(group.id)) {
                        groupMap.get(group.id).count += 1;
                      } else {
                        groupMap.set(group.id, { ...group, count: 1 });
                      }
                    });
                    
                    const uniqueGroups = Array.from(groupMap.values());
                    
                    return uniqueGroups.length > 0 ? (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {uniqueGroups.map((group) => (
                          <div key={group.id} className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-blue-900 font-poppins text-sm">{group.name}</h4>
                              {group.count > 1 && (
                                <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-poppins">
                                  {group.count} applications
                                </span>
                              )}
                            </div>
                            <p className="text-blue-700 text-xs font-poppins leading-relaxed">{group.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-poppins text-sm">No target groups disclosed yet</p>
                        <p className="text-gray-400 font-poppins text-xs mt-1">
                          Target groups will appear here when you complete applications
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-black mb-4 font-poppins">Recent Applications</h3>
                  {userProfile.applications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userProfile.applications.slice(-6).map((application) => (
                        <div key={application.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-black font-poppins text-sm">{application.employerInfo.companyName}</h4>
                            <span className="text-xs text-gray-500 font-poppins">
                              {new Date(application.createdDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 font-poppins mb-3">{application.employerInfo.jobTitle}</p>
                          
                          {/* Mini stats for this application */}
                          <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span className="font-poppins">
                              {application.targetGroups?.filter(g => g.selected).length || 0} groups
                            </span>
                            <span className="font-poppins">
                              {(application.documents?.length || 0) + 1} docs {/* +1 for IRS Form 8850 */}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                              <span className="text-xs text-green-600 font-poppins">Submitted</span>
                            </div>
                            {selectedApplication?.id !== application.id && (
                              <button
                                onClick={() => setSelectedApplication(application)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-poppins underline"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-poppins">No applications yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfile.applications.map((application) => (
                  <div 
                    key={application.id} 
                    className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all cursor-pointer ${
                      selectedApplication?.id === application.id 
                        ? 'border-black' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-black font-poppins">{application.employerInfo.companyName}</h3>
                        <p className="text-gray-600 font-poppins text-sm">{application.employerInfo.jobTitle}</p>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                    
                    {/* Target Groups Visual Indicators */}
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-700 mb-2 font-poppins">Target Groups Disclosed:</h4>
                      {(() => {
                        const selectedGroups = application.targetGroups?.filter(group => group.selected) || [];
                        
                        if (selectedGroups.length === 0) {
                          return (
                            <div className="text-xs text-gray-400 italic font-poppins">None selected</div>
                          );
                        }
                        
                        return (
                          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                            {selectedGroups.map((group) => (
                              <span
                                key={group.id}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-poppins font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                                title={group.description}
                              >
                                {group.name.length > 20 ? `${group.name.substring(0, 20)}...` : group.name}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div className="space-y-2 mb-4 pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-poppins">Target Groups</span>
                        <span className="font-medium font-poppins">{application.targetGroups?.filter(g => g.selected).length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-poppins">Documents</span>
                        <span className="font-medium font-poppins">{(application.documents?.length || 0) + 1}</span> {/* +1 for IRS Form 8850 */}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 font-poppins">
                      Submitted: {new Date(application.createdDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents and Profile tabs only show if an application is selected */}
            {selectedApplication && activeTab === 'documents' && (
              <div className="space-y-6">
                {/* IRS Form 8850 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 font-poppins">IRS Form 8850</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start justify-between mb-2">
                      <FileText className="w-5 h-5 text-green-600 mt-1" />
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setPreviewDocument({
                            id: 'irs-form-8850',
                            targetGroupId: 'irs-form-8850',
                            targetGroupName: 'IRS Form 8850',
                            fileName: `IRS_Form_8850_${selectedApplication.employerInfo.companyName.replace(/\s+/g, '_')}.pdf`,
                            fileType: 'application/irs-form',
                            fileSize: 0,
                            uploadDate: selectedApplication.createdDate
                          })}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="View Form"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            // Create a simplified download - in a real app this would generate a PDF
                            const formData = {
                              employer: selectedApplication.employerInfo.companyName,
                              personal: selectedApplication.personalInfo,
                              dates: selectedApplication.importantDates,
                              targetGroups: selectedApplication.targetGroups?.filter(g => g.selected) || []
                            };
                            const dataStr = JSON.stringify(formData, null, 2);
                            const dataBlob = new Blob([dataStr], {type: 'application/json'});
                            const url = URL.createObjectURL(dataBlob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `IRS_Form_8850_${selectedApplication.employerInfo.companyName.replace(/\s+/g, '_')}.json`;
                            link.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Download Form Data"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium text-green-800 text-sm font-poppins mb-1">
                      Completed IRS Form 8850
                    </h4>
                    <p className="text-xs text-green-700 font-poppins mb-2">
                      For: {selectedApplication.employerInfo.companyName}
                    </p>
                    <div className="flex justify-between text-xs text-green-600 font-poppins">
                      <span>Form completed and ready for employer signature</span>
                      <span>{new Date(selectedApplication.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Target Group Documents */}
                {targetGroupDocs.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-black mb-4 font-poppins">Target Group Supporting Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {targetGroupDocs.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <FileText className="w-5 h-5 text-gray-500 mt-1" />
                            <div className="flex space-x-1">
                              {isPreviewable(doc.fileType) && (
                                <button
                                  onClick={() => handlePreviewDocument(doc)}
                                  className="text-gray-400 hover:text-gray-600 p-1"
                                  title="Preview"
                                >
                                  <Eye size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  const url = getFilePreviewURL(doc);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = doc.fileName;
                                  a.click();
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                                title="Download"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-medium text-black text-sm font-poppins mb-1">{doc.fileName}</h4>
                          <p className="text-xs text-gray-500 font-poppins mb-2">{doc.targetGroupName}</p>
                          <div className="flex justify-between text-xs text-gray-400 font-poppins">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Employment Documents */}
                {employmentDocs.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-black mb-4 font-poppins">Employment Supporting Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {employmentDocs.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <FileText className="w-5 h-5 text-gray-500 mt-1" />
                            <div className="flex space-x-1">
                              {isPreviewable(doc.fileType) && (
                                <button
                                  onClick={() => handlePreviewDocument(doc)}
                                  className="text-gray-400 hover:text-gray-600 p-1"
                                  title="Preview"
                                >
                                  <Eye size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  const url = getFilePreviewURL(doc);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = doc.fileName;
                                  a.click();
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                                title="Download"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-medium text-black text-sm font-poppins mb-1">{doc.fileName}</h4>
                          <p className="text-xs text-gray-500 font-poppins mb-2">Employment Document</p>
                          <div className="flex justify-between text-xs text-gray-400 font-poppins">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentData.documents?.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 font-poppins mb-2">No Additional Documents</h3>
                    <p className="text-gray-500 font-poppins">Only the IRS Form 8850 was completed for this application</p>
                  </div>
                )}
              </div>
            )}

            {selectedApplication && activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-black mb-6 font-poppins">Profile Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-600 font-poppins">Email Address</label>
                    <p className="font-medium text-black font-poppins">{userProfile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-poppins">Account Type</label>
                    <p className="font-medium text-black font-poppins">WOTC Candidate</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-poppins">Total Applications</label>
                    <p className="font-medium text-black font-poppins">{userProfile.applications.length}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-poppins">Member Since</label>
                    <p className="font-medium text-black font-poppins">
                      {userProfile.applications.length > 0 
                        ? new Date(userProfile.applications[0].createdDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-black font-poppins">{previewDocument.fileName}</h3>
                <p className="text-sm text-gray-500 font-poppins">
                  {previewDocument.fileSize > 0 ? formatFileSize(previewDocument.fileSize) + ' • ' : ''}{previewDocument.targetGroupName}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-auto">
              {previewDocument.fileType === 'application/irs-form' ? (
                /* IRS Form 8850 Preview */
                <div className="space-y-6">
                  {/* Form Header */}
                  <div className="text-center border-b pb-4">
                    <h2 className="text-2xl font-bold font-poppins mb-2">Form 8850</h2>
                    <p className="text-lg font-poppins">Work Opportunity Credit Pre-Screening Notice and Certification Request</p>
                    <p className="text-sm text-gray-600 font-poppins mt-2">(For Employers and Applicants/Employees)</p>
                  </div>

                  {/* Employer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-black mb-3 font-poppins">Employer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Company Name:</label>
                        <p className="font-poppins">{selectedApplication?.employerInfo.companyName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Position:</label>
                        <p className="font-poppins">{selectedApplication?.employerInfo.jobTitle || 'Not provided'}</p>
                      </div>
                      {selectedApplication?.employerInfo.streetAddress && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700 font-poppins">Address:</label>
                          <p className="font-poppins">
                            {selectedApplication.employerInfo.streetAddress}
                            {selectedApplication.employerInfo.city && `, ${selectedApplication.employerInfo.city}`}
                            {selectedApplication.employerInfo.state && `, ${selectedApplication.employerInfo.state}`}
                            {selectedApplication.employerInfo.zipCode && ` ${selectedApplication.employerInfo.zipCode}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Employee Information */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-black mb-3 font-poppins">Employee Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Full Name:</label>
                        <p className="font-poppins">{selectedApplication?.personalInfo.fullName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Social Security Number:</label>
                        <p className="font-poppins">{formatSSNForDisplay(selectedApplication?.personalInfo.socialSecurityNumber || '')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Date of Birth:</label>
                        <p className="font-poppins">{formatDateForDisplay(selectedApplication?.personalInfo.dateOfBirth || '')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Phone:</label>
                        <p className="font-poppins">{selectedApplication?.personalInfo.telephoneNumber || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 font-poppins">Address:</label>
                        <p className="font-poppins">
                          {selectedApplication?.personalInfo.streetAddress && selectedApplication?.personalInfo.city && selectedApplication?.personalInfo.state
                            ? `${selectedApplication.personalInfo.streetAddress}, ${selectedApplication.personalInfo.city}, ${selectedApplication.personalInfo.state} ${selectedApplication.personalInfo.zipCode}`
                            : 'Not provided'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Important Dates */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-black mb-3 font-poppins">Important Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Date Information Provided:</label>
                        <p className="font-poppins">{formatDateForDisplay(selectedApplication?.importantDates.dateGaveInfo || '')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Date Job Offered:</label>
                        <p className="font-poppins">{formatDateForDisplay(selectedApplication?.importantDates.dateOffered || '')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Date Hired:</label>
                        <p className="font-poppins">{formatDateForDisplay(selectedApplication?.importantDates.dateHired || '')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 font-poppins">Date Started Work:</label>
                        <p className="font-poppins">{formatDateForDisplay(selectedApplication?.importantDates.dateStarted || '')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Target Groups */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-black mb-3 font-poppins">Target Group Certifications</h3>
                    {(() => {
                      const selectedGroups = selectedApplication?.targetGroups?.filter(group => group.selected) || [];
                      
                      if (selectedGroups.length === 0) {
                        return (
                          <p className="text-gray-500 font-poppins italic">No target groups selected</p>
                        );
                      }
                      
                      return (
                        <div className="space-y-3">
                          {selectedGroups.map((group, index) => (
                            <div key={group.id} className="flex items-start">
                              <div className="w-6 h-6 border-2 border-green-600 rounded flex items-center justify-center mr-3 mt-0.5">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-green-800 font-poppins">{group.name}</p>
                                <p className="text-sm text-green-700 font-poppins">{group.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Form Footer */}
                  <div className="border-t pt-4 text-center">
                    <p className="text-sm text-gray-600 font-poppins">
                      This form was completed on {new Date(selectedApplication?.createdDate || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 font-poppins mt-2">
                      Form ready for employer signature and submission to IRS
                    </p>
                  </div>
                </div>
              ) : previewDocument.fileType.includes('pdf') ? (
                <iframe
                  src={getFilePreviewURL(previewDocument)}
                  className="w-full h-96 border border-gray-200 rounded-lg"
                  title="Document Preview"
                />
              ) : (previewDocument.fileType.includes('image/') ||
                    previewDocument.fileType.includes('heic') ||
                    previewDocument.fileType.includes('heif')) ? (
                <img
                  src={getFilePreviewURL(previewDocument)}
                  alt="Document Preview"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2 font-poppins">Preview Not Available</h3>
                  <p className="text-gray-500 mb-4 font-poppins">
                    This file type cannot be previewed in the browser.
                  </p>
                  <button
                    onClick={() => {
                      const url = getFilePreviewURL(previewDocument);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = previewDocument.fileName;
                      a.click();
                    }}
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-poppins"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download Document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 