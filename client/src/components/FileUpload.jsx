import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = () => {
  const navigate = useNavigate();
  const { handleFileUpload, loading, text, error } = useStudy();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  };

  const onFileSelect = (e) => {
    if (e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const processFile = (file) => {
    setFileName(file.name);
    handleFileUpload(file);
  };

  return (
    <div className="w-full">
      <div className="p-6 sm:p-8">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-10 transition-mindflow cursor-pointer group
            ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border)] hover:border-[var(--border-accent)]'}
            ${loading ? 'pointer-events-none' : ''}
            ${text ? 'border-[var(--success)]/40 bg-[var(--success)]/5' : ''}
          `}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.txt"
            onChange={onFileSelect}
          />

          <div className="flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-4"
                >
                  <div className="relative mb-5">
                    <div className="w-12 h-12 border-2 border-[var(--border)] rounded-full" />
                    <div className="absolute inset-0 w-12 h-12 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Analyzing your document...</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Extracting text for study materials</p>
                </motion.div>
              ) : text ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-4"
                >
                  <div className="w-12 h-12 bg-[var(--success)]/20 rounded-xl flex items-center justify-center mb-4 border border-[var(--success)]/30">
                    <CheckCircle size={24} className="text-[var(--success)]" />
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{fileName}</p>
                  <p className="text-xs text-[var(--success)] font-semibold mt-1">Ready — click below to start studying</p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-4"
                >
                  <div className="w-12 h-12 bg-[var(--bg-elevated)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/10 transition-mindflow border border-[var(--border)]">
                    <Upload size={22} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Drop a file here, or{' '}
                    <span className="text-[var(--accent-light)] underline underline-offset-4 decoration-[var(--accent)]/50">
                      browse
                    </span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">PDF or TXT up to 25k characters</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 px-4 py-3 mt-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)] text-sm font-medium"
          >
            <AlertCircle size={16} />
            <p>{error}</p>
          </motion.div>
        )}

        {text && !loading && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/study');
              }}
              className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white font-semibold rounded-xl transition-mindflow glow-shadow flex items-center justify-center gap-2 text-sm"
            >
              Start Studying <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
