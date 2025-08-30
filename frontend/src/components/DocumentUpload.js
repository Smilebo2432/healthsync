import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocument } from '../utils/api';

const DocumentUpload = ({ onUpload, documents }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const fileInputRef = React.useRef();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadStatus(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(
        (process.env.REACT_APP_API_URL || 'http://localhost:5001') + '/import-file',
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setUploadStatus({
        type: 'success',
        message: `File analyzed successfully! Found ${result.analysis.medications?.length || 0} medications.`
      });
      if (onUpload) onUpload(result);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error analyzing file: ${error.message}`
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadStatus(null);
    try {
      // Prepare form data for /import-file endpoint
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(
        (process.env.REACT_APP_API_URL || 'http://localhost:5001') + '/import-file',
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setUploadStatus({
        type: 'success',
        message: `File analyzed successfully! Found ${result.analysis.medications?.length || 0} medications.`
      });
      if (onUpload) onUpload(result);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error analyzing file: ${error.message}`
      });
    } finally {
      setUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!documentText.trim()) {
      setUploadStatus({
        type: 'error',
        message: 'Please enter document text for analysis.'
      });
      return;
    }

    try {
      setUploading(true);
      setUploadStatus(null);

      const result = await uploadDocument(documentText);
      
      setUploadStatus({
        type: 'success',
        message: `Document analyzed successfully! Found ${result.analysis.medications?.length || 0} medications.`
      });

      // Clear form
      setDocumentText('');
      
      // Notify parent component
      if (onUpload) {
        onUpload(result);
      }

    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error analyzing document: ${error.message}`
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus?.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Medical Documents</h2>
        <p className="text-lg text-gray-600">
          Drag & drop your prescriptions, lab results, or doctor notes for instant AI analysis
        </p>
      </div>

      {/* Upload Area */}
      <div className="max-w-2xl mx-auto">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop your medical documents here
          </h3>
          <p className="text-gray-500 mb-4">
            Or click to browse files (PDF, images, text)
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={handleFileButtonClick} disabled={uploading}>
            Choose Files
          </button>
          <input
            type="file"
            accept=".pdf,image/*,text/plain"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Text Input for MVP */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Or paste document text directly
          </h3>
          <textarea
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder="Paste your prescription, lab results, or doctor notes here..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleTextSubmit}
            disabled={uploading || !documentText.trim()}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus && (
        <div className="max-w-2xl mx-auto">
          <div className={`flex items-center p-4 rounded-md ${
            uploadStatus.type === 'success' ? 'bg-green-50 border border-green-200' :
            uploadStatus.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {getStatusIcon()}
            <p className={`ml-3 text-sm ${
              uploadStatus.type === 'success' ? 'text-green-800' :
              uploadStatus.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {uploadStatus.message}
            </p>
          </div>
        </div>
      )}

      {/* Recent Documents */}
      {documents.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recently Analyzed Documents</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {documents.slice(-4).reverse().map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">Document #{doc.id}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {doc.text.substring(0, 100)}...
                    </p>
                    <div className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-medium text-blue-600">
                      {doc.analysis.medications?.length || 0} medications
                    </div>
                    <div className="text-sm text-gray-500">
                      {doc.analysis.appointments?.length || 0} appointments
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>  
        </div>
      )}

      {/* Features */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What HealthSync AI Can Extract</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Medications</h4>
            <p className="text-sm text-gray-600">Dosage, frequency, instructions, and refill dates</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Appointments</h4>
            <p className="text-sm text-gray-600">Doctor visits, lab work, and follow-up schedules</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Health Metrics</h4>
            <p className="text-sm text-gray-600">Lab results, vital signs, and health trends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
