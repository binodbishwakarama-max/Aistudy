import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle, FileText, Sparkles, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../context/StudyContext';

const formatFileSize = (size) => {
  if (!size && size !== 0) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUpload = () => {
  const navigate = useNavigate();
  const { handleFileUpload, loading, text, error } = useStudy();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileMeta, setFileMeta] = useState(null);

  const processFile = (file) => {
    setFileMeta({
      name: file.name,
      size: formatFileSize(file.size),
      kind: file.type === 'application/pdf' ? 'PDF' : 'TXT',
    });
    handleFileUpload(file);
  };

  return (
    <div className="w-full">
      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
          <div
            className={`rounded-[28px] border-2 border-dashed p-6 transition-mindflow sm:p-8 ${
              text
                ? 'border-[rgba(24,128,56,0.32)] bg-[rgba(24,128,56,0.05)]'
                : isDragging
                  ? 'border-[var(--border-accent)] bg-[var(--bg-strong)]'
                  : 'border-[var(--border)] bg-[var(--bg-elevated)]'
            } ${loading ? 'pointer-events-none' : ''}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const files = event.dataTransfer.files;
              if (files.length > 0) {
                processFile(files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.txt"
              onChange={(event) => {
                if (event.target.files?.length) {
                  processFile(event.target.files[0]);
                }
              }}
            />

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[220px] flex-col items-center justify-center text-center"
                >
                  <div className="relative mb-5 h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold">Preparing your material</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
                    Extracting text and setting up your study workspace.
                  </p>
                </motion.div>
              ) : text ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[220px] flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(24,128,56,0.12)] text-[var(--success)]">
                      <CheckCircle size={24} />
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <div className="pill-badge border-[rgba(24,128,56,0.22)] bg-[rgba(24,128,56,0.08)] text-[var(--success)]">
                        Ready
                      </div>
                      {fileMeta?.kind && <div className="pill-badge">{fileMeta.kind}</div>}
                      {fileMeta?.size && <div className="pill-badge">{fileMeta.size}</div>}
                    </div>

                    <h3 className="font-heading mt-5 text-2xl font-bold">
                      {fileMeta?.name || 'Document uploaded'}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                      Your material is ready. Open the study space to generate flashcards, a quiz, or a review sheet.
                    </p>
                  </div>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate('/study');
                    }}
                    className="primary-button mt-6 w-full justify-center sm:w-auto"
                  >
                    Open study space
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[220px] flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--accent)] shadow-[var(--shadow-soft)]">
                      <Upload size={22} />
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <div className="pill-badge">
                        <Sparkles size={14} className="text-[var(--accent)]" />
                        Simple upload
                      </div>
                      <div className="pill-badge">
                        <FileText size={14} className="text-[var(--warm)]" />
                        PDF and TXT
                      </div>
                    </div>

                    <h3 className="font-heading mt-5 text-2xl font-bold">Drop a file here or browse your notes</h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                      Upload lecture notes, summaries, or reading material. MindFlow will prepare it for review.
                    </p>
                  </div>

                  <div className="mt-6 text-sm text-[var(--text-muted)]">
                    Tip: smaller, focused source files usually produce cleaner study sets.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { label: 'Formats', value: 'PDF and TXT' },
              { label: 'Best for', value: 'Notes and study guides' },
              { label: 'Suggested size', value: 'Up to 25k characters' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4">
                <div className="text-sm font-medium text-[var(--text-muted)]">{item.label}</div>
                <div className="mt-2 text-sm font-semibold leading-7 text-[var(--text-primary)]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-3 rounded-2xl border border-[rgba(217,48,37,0.22)] bg-[rgba(217,48,37,0.06)] px-4 py-3 text-sm"
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
