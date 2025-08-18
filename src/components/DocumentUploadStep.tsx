import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, AlertTriangle, CheckCircle, HelpCircle, Eye, Download } from 'lucide-react';
import { TargetGroup, DocumentUpload } from '../types/wotc';

interface DocumentUploadStepProps {
  targetGroups: TargetGroup[];
  documents: DocumentUpload[];
  onUpdate: (documents: DocumentUpload[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DOCUMENT_REQUIREMENTS: Record<string, string[]> = {
  veteran: [
    'DD-214 (Certificate of Release or Discharge from Active Duty)',
    'Veterans Affairs identification card',
    'Military service records or discharge papers',
    'Any VA correspondence or benefits documentation'
  ],
  snap_tanf: [
    'Current or recent SNAP/Food Stamp benefit letter',
    'SNAP EBT card (photo of front and back)',
    'TANF (Temporary Assistance for Needy Families) award letter',
    'State assistance program documentation showing 3+ months of benefits'
  ],
  ex_felon: [
    'Court records showing felony conviction',
    'Prison release documentation or discharge papers',
    'Probation or parole completion certificate',
    'Background check or criminal history record (within 1 year of hire)'
  ],
  vocational_rehab: [
    'Vocational rehabilitation completion certificate',
    'State vocational rehabilitation agency referral letter',
    'Individual Employment Plan (IEP) or similar documentation',
    'Documentation of physical or mental disability'
  ],
  summer_youth: [
    'Birth certificate or government-issued ID proving age 16-17',
    'School attendance records (showing non-regular attendance)',
    'Academic transcript or enrollment verification',
    'Proof of family income (if applicable)'
  ],
  unemployed_veteran: [
    'DD-214 (Certificate of Release or Discharge)',
    'Unemployment compensation records (showing 4+ weeks but less than 6 months)',
    'State unemployment office documentation',
    'Job search records or workforce agency registration'
  ],
  disabled_veteran: [
    'DD-214 (Certificate of Release or Discharge)',
    'VA disability rating determination letter (showing service-connected disability)',
    'Unemployment compensation records (showing 6+ months unemployment)',
    'VA medical records or disability award letter'
  ],
  long_term_family_assistance: [
    'TANF payment history showing 18+ consecutive months',
    'State family assistance program documentation',
    'Welfare case management records',
    'Documentation showing continuous receipt ending on hire date'
  ]
};

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  targetGroups,
  documents,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [showUploaded, setShowUploaded] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<DocumentUpload | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const selectedTargetGroups = targetGroups.filter(group => group.selected);

  const handleDrag = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(targetGroupId);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    handleFiles(files, targetGroupId);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, targetGroupId: string) => {
    const files = Array.from(e.target.files || []) as File[];
    handleFiles(files, targetGroupId);
  };

  const handleFiles = (files: File[], targetGroupId: string) => {
    const targetGroup = selectedTargetGroups.find(group => group.id === targetGroupId);
    if (!targetGroup) return;

    const newDocuments = files.map(file => ({
      id: `${targetGroupId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      targetGroupId,
      targetGroupName: targetGroup.name,
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      file
    }));

    onUpdate([...documents, ...newDocuments]);
  };

  const removeDocument = (documentId: string) => {
    onUpdate(documents.filter(doc => doc.id !== documentId));
  };

  const getDocumentsForGroup = (targetGroupId: string) => {
    return documents.filter(doc => doc.targetGroupId === targetGroupId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasDocumentsForAllGroups = selectedTargetGroups.every(group => 
    getDocumentsForGroup(group.id).length > 0
  );

  const canProceed = selectedTargetGroups.length === 0 || hasDocumentsForAllGroups;

  const createFilePreviewURL = (file: File) => {
    return URL.createObjectURL(file);
  };

  const getFilePreviewURL = (doc: DocumentUpload) => {
    if (doc.file) {
      return createFilePreviewURL(doc.file);
    }
    return null;
  };

  const isPreviewable = (fileType: string) => {
    return fileType.includes('pdf') || 
           fileType.includes('image/') || 
           fileType.includes('text/');
  };

  const handlePreviewDocument = (doc: DocumentUpload) => {
    setPreviewDocument(doc);
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  // Cleanup blob URLs when component unmounts or documents change
  useEffect(() => {
    return () => {
      documents.forEach(doc => {
        if (doc.file) {
          const url = getFilePreviewURL(doc);
          if (url) {
            URL.revokeObjectURL(url);
          }
        }
      });
    };
  }, [documents]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <Upload className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">
          Supporting Documentation
        </h2>
        <p className="text-gray35 mb-4 font-poppins font-light text-lg leading-relaxed">
          Please upload supporting documents for your selected target group categories. 
          These documents help verify your eligibility for the Work Opportunity Tax Credit.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 max-w-4xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">i</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-800 space-y-1 font-light">
                <li>• Upload at least one document for each target group you selected</li>
                <li>• Documents must be clear, legible, and verify your eligibility</li>
                <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX, TXT (max 10MB each)</li>
                <li>• Your information will be kept confidential and used only for WOTC verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {selectedTargetGroups.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">No Target Groups Selected</h3>
              <p className="text-yellow-700 text-sm">
                You haven't selected any target groups. Please go back to the previous step to select your applicable categories.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedTargetGroups.map((group) => {
        const groupDocuments = getDocumentsForGroup(group.id);
        const requirements = DOCUMENT_REQUIREMENTS[group.id] || [];
        
        return (
          <div key={group.id} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-medium text-black mb-2">{group.name}</h3>
                <p className="text-gray35 text-sm font-light leading-relaxed mb-3">
                  {group.description}
                </p>
                
                <div className="mb-4 flex items-center gap-3">
                  {requirements.length > 0 && (
                    <button
                      onClick={() => setShowHelp(showHelp === group.id ? null : group.id)}
                      className="inline-flex items-center text-black hover:text-gray35 text-sm font-medium transition-colors duration-200 bg-gray-50 px-3 py-1 rounded-lg hover:bg-gray-100"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Required Documents
                    </button>
                  )}
                  
                  {groupDocuments.length > 0 && (
                    <button
                      onClick={() => setShowUploaded(showUploaded === group.id ? null : group.id)}
                      className="inline-flex items-center text-green-700 hover:text-green-600 text-sm font-medium transition-colors duration-200 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Uploaded ({groupDocuments.length})
                    </button>
                  )}
                </div>
                
                {/* Document Requirements */}
                {showHelp === group.id && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Required Supporting Documents:</h4>
                    <p className="text-xs text-blue-700 mb-3 font-light">
                      Upload at least one of the following documents to verify your eligibility for this target group:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-2">
                      {requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-600 font-medium">
                        💡 Tip: Clear, legible scans or photos work best. Multiple documents strengthen your application.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Uploaded Documents View */}
                {showUploaded === group.id && groupDocuments.length > 0 && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Your Uploaded Documents for {group.name}
                    </h4>
                    <div className="space-y-3">
                      {groupDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-900">{doc.fileName}</p>
                              <p className="text-xs text-green-600">
                                {formatFileSize(doc.fileSize)} • Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-green-500 mt-1">
                                File type: {doc.fileType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isPreviewable(doc.fileType) && (
                              <button
                                onClick={() => handlePreviewDocument(doc)}
                                className="text-green-600 hover:text-green-700 transition-colors duration-200 p-2 rounded-lg hover:bg-green-100"
                                title="Preview document"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => removeDocument(doc.id)}
                              className="text-green-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                              title="Remove document"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs text-green-600 font-medium">
                        ✅ You can upload additional documents or remove existing ones as needed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center ml-4">
                {groupDocuments.length > 0 ? (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full mb-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{groupDocuments.length} file{groupDocuments.length !== 1 ? 's' : ''} uploaded</span>
                    </div>
                    <div className="text-xs text-gray-500 max-w-40 truncate">
                      Latest: {groupDocuments[groupDocuments.length - 1]?.fileName}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Documents Required</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive === group.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragEnter={(e) => handleDrag(e, group.id)}
              onDragLeave={(e) => handleDrag(e, group.id)}
              onDragOver={(e) => handleDrag(e, group.id)}
              onDrop={(e) => handleDrop(e, group.id)}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray35 font-light mb-4">
                Drag and drop files here, or{' '}
                <button
                  onClick={() => fileInputRefs.current[group.id]?.click()}
                  className="text-black font-medium hover:underline"
                >
                  browse to upload
                </button>
              </p>
              <p className="text-sm text-gray-400 font-light">
                Supports: PDF, JPG, PNG, DOC, DOCX, TXT (Max 10MB per file)
              </p>
              
              <input
                ref={(el) => fileInputRefs.current[group.id] = el}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                onChange={(e) => handleFileInput(e, group.id)}
                className="hidden"
              />
            </div>

            {/* Compact Uploaded Files List */}
            {groupDocuments.length > 0 && showUploaded !== group.id && (
              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {groupDocuments.length} document{groupDocuments.length !== 1 ? 's' : ''} uploaded
                  </p>
                  <button
                    onClick={() => setShowUploaded(group.id)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View details →
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Progress Summary */}
      {selectedTargetGroups.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-medium text-black mb-3">Upload Progress</h3>
          <div className="space-y-2">
            {selectedTargetGroups.map((group) => {
              const groupDocuments = getDocumentsForGroup(group.id);
              return (
                <div key={group.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray35">{group.name}</span>
                  <div className="flex items-center">
                    {groupDocuments.length > 0 ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{groupDocuments.length} file{groupDocuments.length !== 1 ? 's' : ''}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 text-gray35 hover:text-black font-medium transition-colors duration-200"
        >
          <span>← Previous</span>
        </button>
        
        <div className="text-center">
          {!canProceed && (
            <p className="text-sm text-yellow-600 mb-2">
              Please upload at least one document for each selected target group
            </p>
          )}
        </div>
        
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
            canProceed
              ? 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] w-full flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium text-black">Document Preview</h3>
                <p className="text-sm text-gray35 mt-1">{previewDocument.fileName}</p>
              </div>
              <div className="flex items-center gap-3">
                {previewDocument.file && (
                  <a
                    href={getFilePreviewURL(previewDocument) || '#'}
                    download={previewDocument.fileName}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                )}
                <button
                  onClick={closePreview}
                  className="text-gray35 hover:text-black transition-colors duration-200 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-hidden">
              {previewDocument.file && getFilePreviewURL(previewDocument) ? (
                <div className="h-full">
                  {previewDocument.fileType.includes('pdf') ? (
                    <iframe
                      src={getFilePreviewURL(previewDocument) || ''}
                      className="w-full h-full border border-gray-200 rounded-lg"
                      title={previewDocument.fileName}
                    />
                  ) : previewDocument.fileType.includes('image/') ? (
                    <div className="flex items-center justify-center h-full">
                      <img
                        src={getFilePreviewURL(previewDocument) || ''}
                        alt={previewDocument.fileName}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                      />
                    </div>
                  ) : previewDocument.fileType.includes('text/') ? (
                    <iframe
                      src={getFilePreviewURL(previewDocument) || ''}
                      className="w-full h-full border border-gray-200 rounded-lg bg-white"
                      title={previewDocument.fileName}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray35 mb-2">Preview not available for this file type</p>
                        <p className="text-sm text-gray-400 mb-4">{previewDocument.fileType}</p>
                        <a
                          href={getFilePreviewURL(previewDocument) || '#'}
                          download={previewDocument.fileName}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download to View
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray35 mb-2">Unable to preview this document</p>
                    <p className="text-sm text-gray-400">The file may be corrupted or in an unsupported format</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray35">
                  <span className="font-medium">File size:</span> {formatFileSize(previewDocument.fileSize)} • 
                  <span className="font-medium ml-2">Type:</span> {previewDocument.fileType} • 
                  <span className="font-medium ml-2">Target Group:</span> {previewDocument.targetGroupName}
                </div>
                <button
                  onClick={closePreview}
                  className="px-4 py-2 text-sm font-medium text-gray35 hover:text-black transition-colors duration-200"
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

export default DocumentUploadStep; 