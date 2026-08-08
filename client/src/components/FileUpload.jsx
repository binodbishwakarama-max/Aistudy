import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../context/StudyContext';

const formatFileSize = (size) => {
  if (!size && size !== 0) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const STAGES = [
  { id: 'parsing', label: 'Parsing document' },
  { id: 'generating', label: 'Generating flashcards' },
  { id: 'ready', label: 'Ready to study' },
];

const FileUpload = () => {
  const navigate = useNavigate();
  const {
    handleFileUploadAndGenerate,
    loading,
    uploadStage,
    flashcards,
    error,
    resetUploadStage,
  } = useStudy();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileMeta, setFileMeta] = useState(null);
  const [generatedCount, setGeneratedCount] = useState(0);

  const processFile = async (file) => {
    setFileMeta({
      name: file.name,
      size: formatFileSize(file.size),
      kind: file.type === 'application/pdf' ? 'PDF' : 'TXT',
    });

    const result = await handleFileUploadAndGenerate(file);
    if (result.ok) {
      setGeneratedCount(result.cardCount || flashcards.length);
      setTimeout(() => navigate('/flashcards'), 600);
    }
  };

  const isProcessing = loading || uploadStage === 'parsing' || uploadStage === 'generating';
  const isReady = uploadStage === 'ready' && generatedCount > 0;

  return (
    <div className="w-full">
      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        <div
          className={`rounded-[var(--radius-xl)] border-2 border-dashed p-6 transition-colors sm:p-8 ${
            isReady
              ? 'border-[rgba(36,138,61,0.35)] bg-[var(--success-soft)]'
              : isDragging
                ? 'border-[var(--border-accent)] bg-[var(--bg-strong)]'
                : 'border-[var(--border-strong)] bg-[var(--bg-surface)]'
          } ${isProcessing ? 'pointer-events-none' : ''}`}
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
            if (files.length > 0) processFile(files[0]);
          }}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={(event) => {
              if (event.target.files?.length) processFile(event.target.files[0]);
            }}
          />

          <AnimatePresence mode="wait">
            {isProcessing ? (
              <Motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[260px] flex-col items-center justify-center text-center"
              >
                <div className="relative mb-5 h-12 w-12">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                </div>
                <h3 className="font-heading text-2xl font-bold">
                  {uploadStage === 'parsing' ? 'Parsing your document' : 'Building your deck'}
                </h3>
                {fileMeta && (
                  <p className="mt-2 text-xs font-medium text-[var(--text-muted)]">
                    {fileMeta.name} · {fileMeta.kind} · {fileMeta.size}
                  </p>
                )}
                <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
                  {uploadStage === 'parsing'
                    ? 'Extracting text from your file…'
                    : 'AI is creating flashcards from your notes. This usually takes under a minute.'}
                </p>

                <div className="mt-8 w-full max-w-xs space-y-3 text-left">
                  {STAGES.map((stage) => {
                    const stageIndex = STAGES.findIndex((item) => item.id === uploadStage);
                    const currentIndex = STAGES.findIndex((item) => item.id === stage.id);
                    const done = currentIndex < stageIndex || uploadStage === 'ready';
                    const active = stage.id === uploadStage;

                    return (
                      <div
                        key={stage.id}
                        className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm ${
                          active ? 'bg-[var(--bg-strong)] text-[var(--accent)] font-semibold' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                            done ? 'bg-[var(--success)] text-white' : active ? 'bg-[var(--accent)] text-white' : 'bg-[rgba(0,0,0,0.06)]'
                          }`}
                        >
                          {done ? '✓' : currentIndex + 1}
                        </span>
                        {stage.label}
                      </div>
                    );
                  })}
                </div>
              </Motion.div>
            ) : isReady ? (
              <Motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[220px] flex-col items-center justify-center text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-heading mt-5 text-2xl font-bold">{generatedCount} cards ready</h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">Opening your study session…</p>
              </Motion.div>
            ) : (
              <Motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[220px] flex-col justify-between"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--accent)]">
                    <Upload size={20} />
                  </div>
                  <p className="mt-5 text-sm text-[var(--text-muted)]">PDF or TXT · builds cards automatically</p>
                  <h3 className="font-heading mt-2 text-2xl font-bold">Drop a lecture file</h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                    Upload once. MindFlow parses your notes, generates flashcards, and opens study mode.
                  </p>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <Motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-3 rounded-[var(--radius-md)] border border-[rgba(215,0,21,0.2)] bg-[var(--danger-soft)] px-4 py-3 text-sm"
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-[var(--danger)]" />
            <div className="flex-1">
              <span>{error}</span>
              <button
                type="button"
                onClick={resetUploadStage}
                className="mt-2 block text-sm font-semibold text-[var(--accent)]"
              >
                Try again
              </button>
            </div>
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
