import React, { useState } from 'react';
import { uploadDocument } from '../services/api';
import '../styles/Dashboard.css';

const FileUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf')) {
      alert('Only PDF files are supported');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadDocument(formData);
      
      setUploadedFiles(prev => [{
        id: response.document_id,
        name: response.filename,
        size: file.size,
        date: new Date().toLocaleDateString()
      }, ...prev]);
      
      alert('File uploaded successfully! Processing for RAG...');
      
      if (onUploadSuccess) {
        onUploadSuccess(response.document_id);
      }
    } catch (error) {
      alert('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-card card">
      <h2 style={{ marginBottom: '24px' }}>Upload Documents</h2>
      
      <div className="upload-area">
        {uploading ? (
          <div className="flex-center">
            <div className="loading-spinner" style={{ width: '40px', height: '40px' }} />
          </div>
        ) : (
          <>
            <div className="upload-icon">
              📤
            </div>
            <p className="upload-text">
              Upload a PDF file
            </p>
            <p className="upload-hint">
              Click to select a file (max 10MB)
            </p>
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="upload-button">
              Choose File
            </label>
          </>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="file-list">
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Uploaded Files</h3>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {formatFileSize(file.size)} • {file.date}
                  </div>
                </div>
              </div>
              <div style={{ color: 'var(--success)', fontSize: '0.9rem' }}>
                Ready for RAG
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;