import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Calendar, AlertCircle, AlertTriangle, Upload, FileText, X, Eye, Download } from 'lucide-react';
import { ImportantDates, DocumentUpload } from '../types/wotc';
import { useValidation } from '../hooks/useValidation';

interface ImportantDatesStepProps {
  importantDates: ImportantDates;
  onUpdate: (dates: ImportantDates) => void;
  documents: DocumentUpload[];
  onDocumentsUpdate: (documents: DocumentUpload[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  userType?: 'candidate' | 'employer';
}

export const ImportantDatesStep: React.FC<ImportantDatesStepProps> = ({
  importantDates,
  onUpdate,
  documents,
  onDocumentsUpdate,
  onNext,
  onPrevious,
  userType = 'candidate'
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<DocumentUpload | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { validateImportantDates } = useValidation();

  const validateAndProceed = () => {
    const validation = validateImportantDates(importantDates, userType);
    setErrors(validation.errors);

    if (validation.isValid) {
      onNext();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newDocuments = files.map(file => ({
      id: `employment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      targetGroupId: 'employment_docs',
      targetGroupName: 'Employment Documents',
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      file
    }));

    onDocumentsUpdate([...documents, ...newDocuments]);
  };

  const removeDocument = (documentId: string) => {
    onDocumentsUpdate(documents.filter(doc => doc.id !== documentId));
  };

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

  const employmentDocuments = documents.filter(doc => doc.targetGroupId === 'employment_docs');

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
          <Calendar className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-black mb-4 font-poppins">Important Dates</h2>
        {userType === 'candidate' ? (
          <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
            Please provide the following employment-related dates for compliance verification.
          </p>
        ) : (
          <p className="text-gray35 font-poppins font-light text-lg leading-relaxed">
            Please confirm the following employment-related dates provided by your candidate. Update any dates if needed.
          </p>
        )}
      </div>

            {errors.length > 0 && (
        <div className="error-banner">
          <h3 className="error-banner-header">
            <AlertTriangle className="w-5 h-5 mr-3" />
            The following issues were found:
          </h3>
          <ul className="error-banner-list">
            {errors.map((error, index) => (
              <li key={index} className="error-banner-item">
                <span className="text-red-500 mr-2 font-bold">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-8">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-black mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-2 text-black font-poppins">
                {userType === 'candidate' ? 'Date Sequence Requirements:' : 'Date Sequence Requirements:'}
              </p>
              <p className="text-gray35 font-poppins font-light leading-relaxed">
                {userType === 'candidate' 
                  ? 'These dates must be in chronological order: 1. Gave Info → 2. Offered → 3. Hired → 4. Started'
                  : 'For employers: 1. Gave Info → 2. Offered (both Hired & Started must come after steps 1 and 2)'
                }
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-black mb-3 font-poppins">
            {userType === 'candidate' 
              ? '1. Date You First Provided Target Group Information *'
              : '1. Date You Were First Provided Target Group Information *'
            }
          </label>
          <input
            type="date"
            value={importantDates.dateGaveInfo}
            onChange={(e) => onUpdate({ ...importantDates, dateGaveInfo: e.target.value })}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
          />
          <p className="text-sm text-gray35 mt-2 font-poppins font-light leading-relaxed">
            {userType === 'candidate'
              ? 'On what date did you first provide information to your employer that you belong to one of these targeted groups?'
              : 'On what date did the candidate first provide information that they belong to one of these targeted groups?'
            }
          </p>
        </div>

        <div>
          <label className="block text-base font-medium text-black mb-3 font-poppins">
            {userType === 'candidate'
              ? '2. Date You Were Offered This Position *'
              : '2. Date You Offered This Position *'
            }
          </label>
          <input
            type="date"
            value={importantDates.dateOffered}
            onChange={(e) => onUpdate({ ...importantDates, dateOffered: e.target.value })}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
          />
          <p className="text-sm text-gray35 mt-2 font-poppins font-light leading-relaxed">
            {userType === 'candidate'
              ? 'On what date were you offered this position?'
              : 'On what date did you offer this position to the candidate?'
            }
          </p>
        </div>

        <div>
          <label className="block text-base font-medium text-black mb-3 font-poppins">
            {userType === 'candidate'
              ? '3. Date You Were Hired *'
              : '3. Date Candidate Was Hired *'
            }
          </label>
          <input
            type="date"
            value={importantDates.dateHired}
            onChange={(e) => onUpdate({ ...importantDates, dateHired: e.target.value })}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
          />
          <p className="text-sm text-gray35 mt-2 font-poppins font-light leading-relaxed">
            {userType === 'candidate'
              ? 'On what date were you hired?'
              : 'On what date was the candidate hired?'
            }
          </p>
        </div>

        <div>
          <label className="block text-base font-medium text-black mb-3 font-poppins">
            {userType === 'candidate'
              ? '4. Date You Started Work *'
              : '4. Date Candidate Started Work *'
            }
          </label>
          <input
            type="date"
            value={importantDates.dateStarted}
            onChange={(e) => onUpdate({ ...importantDates, dateStarted: e.target.value })}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-poppins text-gray35 bg-white shadow-sm hover:shadow-md"
          />
          <p className="text-sm text-gray35 mt-2 font-poppins font-light leading-relaxed">
            {userType === 'candidate'
              ? 'On what date did you start work?'
              : 'On what date did the candidate start work?'
            }
          </p>
        </div>
      </div>

      {/* Optional Employment Documents Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
        <div className="mb-6">
          <h3 className="text-xl font-medium text-black mb-2 font-poppins">
            Supporting Employment Documents (Optional)
          </h3>
          <p className="text-gray35 text-sm font-poppins font-light leading-relaxed mb-4">
            You may optionally upload documents related to your employment dates, such as offer letters, 
            email confirmations, conditional job offers, or other employment correspondence.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-xs font-poppins font-medium">
              💡 <strong>Helpful Documents:</strong> Job offer letters, email confirmations of offers, 
              conditional employment letters, signed employment agreements, or HR correspondence.
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray35 font-light mb-4">
            Drag and drop files here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-black font-medium hover:underline"
            >
              browse to upload
            </button>
          </p>
          <p className="text-sm text-gray-400 font-light">
            Supports: PDF, JPG, PNG, HEIC, DOC, DOCX, TXT (Max 10MB per file)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.doc,.docx,.txt"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Uploaded Documents List */}
        {employmentDocuments.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-black mb-3 font-poppins">
              Uploaded Employment Documents ({employmentDocuments.length})
            </h4>
            <div className="space-y-3">
              {employmentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(doc.fileSize)} • Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPreviewable(doc.fileType) && (
                      <button
                        onClick={() => handlePreviewDocument(doc)}
                        className="text-gray-600 hover:text-gray-800 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                        title="Preview document"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                      title="Remove document"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
          onClick={validateAndProceed}
          className="btn-primary flex items-center px-10 py-4"
        >
          Continue
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
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Document Uploaded</h4>
                        <p className="text-gray-600 mb-4">
                          Your {previewDocument.fileName.split('.').pop()?.toUpperCase()} document was uploaded successfully.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-green-800">Employment document ready for review</span>
                          </div>
                        </div>
                        <a
                          href={getFilePreviewURL(previewDocument) || '#'}
                          download={previewDocument.fileName}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download to View Full Document
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
                  <span className="font-medium ml-2">Type:</span> {previewDocument.fileType}
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