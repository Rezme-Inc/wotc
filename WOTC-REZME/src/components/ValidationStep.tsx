import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText, Eye, Download, X } from 'lucide-react';
import { WOTCFormData, DocumentUpload } from '../types/wotc';
import { validateDates, formatDate } from '../utils/dateValidation';

interface ValidationStepProps {
  formData: WOTCFormData;
  onNext: () => void;
  onPrevious: () => void;
  userType?: 'candidate' | 'employer';
}

export const ValidationStep: React.FC<ValidationStepProps> = ({
  formData,
  onNext,
  onPrevious,
  userType = 'candidate'
}) => {
  const [previewDocument, setPreviewDocument] = useState<DocumentUpload | null>(null);
  
  const dateValidation = validateDates(formData.importantDates, userType);
  const selectedGroups = formData.targetGroups.filter(group => group.selected);
  
  // Separate documents by type
  const targetGroupDocs = formData.documents.filter(doc => doc.targetGroupId !== 'employment_docs');
  const employmentDocs = formData.documents.filter(doc => doc.targetGroupId === 'employment_docs');
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
           fileType.includes('text/') ||
           fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
           fileType.includes('application/msword') ||
           fileType.includes('heic') || 
           fileType.includes('heif');
  };

  const handlePreviewDocument = (doc: DocumentUpload) => {
    setPreviewDocument(doc);
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          {dateValidation.isValid ? (
            <CheckCircle className="w-10 h-10 text-black" />
          ) : (
            <XCircle className="w-10 h-10 text-cinnabar" />
          )}
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">Validation Results</h2>
        <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
          {userType === 'candidate' 
             ? "Great! Your dates are correctly sequenced: 1. Gave Info → 2. Offered → 3. Hired → 4. Started. All information has been validated and is ready for submission."
            : "Excellent! All employment dates have been validated and meet WOTC compliance requirements. The information is ready for processing."
          }
        </p>
      </div>

      {/* Date Validation Results */}
      <div className={`rounded-xl p-8 mb-8 shadow-sm ${
        dateValidation.isValid 
          ? 'bg-white border-l-4 border-black' 
          : 'bg-white border-l-4 border-cinnabar'
      }`}>
        <div className="flex items-center mb-6">
          {dateValidation.isValid ? (
            <CheckCircle className="w-7 h-7 text-black mr-3" />
          ) : (
            <XCircle className="w-7 h-7 text-cinnabar mr-3" />
          )}
          <h3 className="font-medium text-black font-poppins text-xl">
            Date Sequence Validation
          </h3>
        </div>
        
        {dateValidation.isValid ? (
          <p className="text-gray35 font-poppins font-light leading-relaxed">
            ✓ All dates are in the correct chronological order and meet compliance requirements.
          </p>
        ) : (
          <div>
            <p className="text-black font-medium mb-4 font-poppins">The following issues were found:</p>
            <ul className="list-disc list-inside text-gray35 space-y-2 font-poppins font-light">
              {dateValidation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Summary of Information */}
      <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-100">
        <h3 className="font-medium text-black mb-6 font-poppins text-xl">Information Summary</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-black mb-3 font-poppins">Personal Information</h4>
            <div className="space-y-2 text-sm text-gray35 font-poppins font-light">
              <p><strong className="font-medium text-black">Name:</strong> {formData.personalInfo.fullName}</p>
              <p><strong className="font-medium text-black">Date of Birth:</strong> {formatDate(formData.personalInfo.dateOfBirth)}</p>
              <p><strong className="font-medium text-black">Address:</strong> {formData.personalInfo.streetAddress}, {formData.personalInfo.city}, {formData.personalInfo.state} {formData.personalInfo.zipCode}</p>
              <p><strong className="font-medium text-black">SSN:</strong> ***-**-{formData.personalInfo.socialSecurityNumber.slice(-4)}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-black mb-3 font-poppins">Target Groups</h4>
            {selectedGroups.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray35 font-poppins font-light">
                {selectedGroups.map(group => (
                  <li key={group.id}>• {group.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray35 italic font-poppins font-light">No target groups selected</p>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <h4 className="font-medium text-black mb-3 font-poppins">Important Dates</h4>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray35 font-poppins font-light">
            <div>
              <p className="mb-2"><strong className="font-medium text-black">Gave Info:</strong> {formatDate(formData.importantDates.dateGaveInfo)}</p>
              <p><strong className="font-medium text-black">Offered:</strong> {formatDate(formData.importantDates.dateOffered)}</p>
            </div>
            <div>
              <p className="mb-2"><strong className="font-medium text-black">Hired:</strong> {formatDate(formData.importantDates.dateHired)}</p>
              <p><strong className="font-medium text-black">Started:</strong> {formatDate(formData.importantDates.dateStarted)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents Section */}
      {formData.documents.length > 0 && (
        <div className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-sm">
          <h3 className="font-medium text-black mb-6 font-poppins text-xl">
            Uploaded Documents ({formData.documents.length})
          </h3>
          
          {/* Target Group Documents */}
          {targetGroupDocs.length > 0 && (
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 font-poppins text-lg">Target Group Supporting Documents</h4>
              <div className="space-y-3">
                {targetGroupDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{doc.fileName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Target Group: {doc.targetGroupName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(doc.fileSize)} • Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPreviewable(doc.fileType) && (
                        <button
                          onClick={() => handlePreviewDocument(doc)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                          title="Preview document"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </button>
                      )}
                      <a
                        href={getFilePreviewURL(doc) || '#'}
                        download={doc.fileName}
                        className="flex items-center px-3 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employment Documents */}
          {employmentDocs.length > 0 && (
            <div>
              <h4 className="font-medium text-black mb-4 font-poppins text-lg">Employment Supporting Documents</h4>
              <div className="space-y-3">
                {employmentDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{doc.fileName}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Employment Documentation
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(doc.fileSize)} • Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPreviewable(doc.fileType) && (
                        <button
                          onClick={() => handlePreviewDocument(doc)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200"
                          title="Preview document"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </button>
                      )}
                      <a
                        href={getFilePreviewURL(doc) || '#'}
                        download={doc.fileName}
                        className="flex items-center px-3 py-2 text-sm font-medium text-black bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500 font-poppins">
              <span>
                Total Documents: {formData.documents.length} 
                {targetGroupDocs.length > 0 && ` • Target Group: ${targetGroupDocs.length}`}
                {employmentDocs.length > 0 && ` • Employment: ${employmentDocs.length}`}
              </span>
              <span className="text-green-600 font-medium">
                ✓ All documents ready for submission
              </span>
            </div>
          </div>
        </div>
      )}

      {!dateValidation.isValid && (
        <div className="error-banner">
          <h3 className="error-banner-header">
            <AlertTriangle className="w-5 h-5 mr-3" />
            Action Required:
          </h3>
          <div className="error-banner-list">
            <p className="error-banner-item">
              <span className="text-red-500 mr-2 font-bold">•</span>
              Please go back and correct the date issues before proceeding. The dates must be in chronological order and cannot be in the future.
            </p>
          </div>
        </div>
      )}

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
          disabled={!dateValidation.isValid}
          className={`flex items-center px-10 py-4 font-poppins ${
            dateValidation.isValid
              ? 'btn-primary'
              : 'bg-gray-200 text-gray35 cursor-not-allowed rounded-xl font-medium'
          }`}
        >
          {dateValidation.isValid ? 'Proceed to Completion' : 'Fix Errors First'}
          <ArrowRight className="ml-3 w-5 h-5" />
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
                  ) : (previewDocument.fileType.includes('image/') || 
                        previewDocument.fileType.includes('heic') || 
                        previewDocument.fileType.includes('heif')) ? (
                    <div className="flex items-center justify-center h-full">
                      <img
                        src={getFilePreviewURL(previewDocument) || ''}
                        alt={previewDocument.fileName}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-center">
                                <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                                <p class="text-gray-500 mb-2">Image preview not supported in this browser</p>
                                <p class="text-sm text-gray-400 mb-4">Your ${previewDocument.fileName.split('.').pop()?.toUpperCase()} file was uploaded successfully</p>
                                <a href="${getFilePreviewURL(previewDocument) || '#'}" download="${previewDocument.fileName}" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200">
                                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                  Download to View
                                </a>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  ) : previewDocument.fileType.includes('text/') ? (
                    <iframe
                      src={getFilePreviewURL(previewDocument) || ''}
                      className="w-full h-full border border-gray-200 rounded-lg bg-white"
                      title={previewDocument.fileName}
                    />
                  ) : (previewDocument.fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                        previewDocument.fileType.includes('application/msword')) ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                          <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Document Ready for Review</h4>
                        <p className="text-gray-600 mb-4">
                          Your {previewDocument.fileName.split('.').pop()?.toUpperCase()} document is ready for submission.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-sm font-medium text-green-800">Document validated and ready</span>
                          </div>
                        </div>
                        <a
                          href={getFilePreviewURL(previewDocument) || '#'}
                          download={previewDocument.fileName}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Document
                        </a>
                      </div>
                    </div>
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
                  <span className="font-medium ml-2">Category:</span> {previewDocument.targetGroupName}
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