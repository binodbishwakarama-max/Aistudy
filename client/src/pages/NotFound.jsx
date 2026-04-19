import React from 'react';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--danger)]/10 text-4xl text-[var(--danger)] shadow-[var(--shadow-soft)]">
                404
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight">Page not found</h1>
            <p className="mb-8 max-w-sm text-[var(--text-secondary)]">
                Sorry, we couldn’t find the page you’re looking for. It might have been removed or relocated.
            </p>
            <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(26,115,232,0.18)] transition-mindflow hover:bg-[var(--accent-light)]"
            >
                <MoveLeft size={18} />
                Back to Safe Harbor
            </Link>
        </div>
    );
};

export default NotFound;
