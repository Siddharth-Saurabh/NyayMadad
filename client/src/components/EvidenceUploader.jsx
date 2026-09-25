import React, { useState } from 'react';
import { Upload, FileCheck, ShieldCheck, AlertCircle, Trash2, Eye, Lock, FileText, Image as ImageIcon } from 'lucide-react';
import api from '../api/client';

export default function EvidenceUploader({ complaintId, onUploadSuccess, readOnly = false }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [hashPreview, setHashPreview] = useState(null);

  // Compute live SHA-256 for instant feedback in browser
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError(null);
    setFile(selectedFile);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHashPreview(hashHex);
    } catch (err) {
      console.warn('Could not compute client-side SHA-256:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !complaintId) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      formData.append('isSensitive', isSensitive);

      const res = await api.post(`/complaints/${complaintId}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success) {
        setFile(null);
        setDescription('');
        setHashPreview(null);
        if (onUploadSuccess) onUploadSuccess(res.data.evidence);
      }
    } catch (err) {
      setError(err.message || 'Evidence upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (readOnly) return null;

  return (
    <div className="civic-card p-5 bg-white border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Secure Evidence Upload</h3>
        </div>
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Lock className="w-3 h-3 text-slate-400" /> SHA-256 Hashed
        </span>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Drag & Drop input */}
        <div className="border-2 border-dashed border-slate-300 hover:border-nyay-500 rounded-xl p-6 text-center bg-slate-50 transition cursor-pointer relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,application/pdf,audio/*,video/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-800">
            {file ? file.name : 'Click or drag evidence files here'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Supports Screenshots, Photos, Bank Statements (PDF), Call Recordings & Videos (up to 50MB)
          </p>
        </div>

        {file && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" /> {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
              <button
                type="button"
                onClick={() => { setFile(null); setHashPreview(null); }}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </div>
            {hashPreview && (
              <div className="text-[10px] text-emerald-800 font-mono break-all bg-emerald-100/60 p-1.5 rounded">
                SHA-256 Integrity: {hashPreview}
              </div>
            )}
          </div>
        )}

        {/* Description & sensitive tag */}
        <div className="space-y-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this evidence (e.g. Fraudulent transaction SMS screenshot)..."
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nyay-500 focus:outline-none"
          />
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isSensitive}
              onChange={(e) => setIsSensitive(e.target.checked)}
              className="rounded text-nyay-600 focus:ring-nyay-500"
            />
            <span>Mark as sensitive material (restricted to senior investigating officers only)</span>
          </label>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full py-2.5 px-4 rounded-xl bg-nyay-700 hover:bg-nyay-800 text-white font-semibold text-xs shadow transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? 'Calculating Hash & Uploading...' : 'Upload & Verify Integrity'}
        </button>
      </form>
    </div>
  );
}
