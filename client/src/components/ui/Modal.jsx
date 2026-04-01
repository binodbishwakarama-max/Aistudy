import React from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { X } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const Modal = ({ open, onClose, title, description, children }) => (
  <AnimatePresence>
    {open && (
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[140] flex items-center justify-center bg-[rgba(15,23,42,0.48)] px-4 py-8 backdrop-blur-sm"
      >
        <Motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}>
          <Card className="w-[min(32rem,calc(100vw-2rem))] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>}
                {description && <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
                <X size={18} />
              </Button>
            </div>
            <div className="mt-6">{children}</div>
          </Card>
        </Motion.div>
      </Motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
