import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  ArrowRight,
  GraduationCap,
  Sparkles,
  FileText,
  CheckCircle2,
  ChevronRight,
  Zap
} from 'lucide-react';
import { DSU_BRANCHES, searchDsuSubjects } from '../../data/dsuHubData';

const DsuHubLanding = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    return searchDsuSubjects(searchQuery);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-surface)] py-14 px-6 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">
              <span>Dayananda Sagar University</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-[var(--text-primary)]">
            DSU Question Papers &amp; Exam Notes
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Free, unblocked access to branch-wise previous year question papers (PYQs), passing strategies, and high-yield module guidance for DSU engineering semesters.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject name or code (e.g. 21CS32, DBMS, Algorithms)..."
              className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] py-3.5 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-6 sm:px-10 pt-10">
        {/* Search Results State */}
        {searchQuery.trim().length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Search Results ({searchResults.length})
              </h2>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[var(--accent)] font-semibold hover:underline"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-12 text-center">
                <FileText className="mx-auto h-10 w-10 text-[var(--text-muted)] mb-3" />
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  No matching subjects found for "{searchQuery}".
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Try searching by subject code (e.g., 21CS42) or broader keywords.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {searchResults.map((sub) => (
                  <Link
                    key={`${sub.branch.slug}-${sub.semesterNumber}-${sub.code}`}
                    to={`/dsu-hub/${sub.branch.slug}/${sub.semesterNumber}/${sub.slug}`}
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-all hover:border-[var(--accent)] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2 font-mono">
                      <span>{sub.branch.shortName} • Sem {sub.semesterNumber}</span>
                      <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-bold text-[var(--text-primary)]">
                        {sub.code}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {sub.name}
                    </h3>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
                      <span>{sub.pyqs?.length || 0} Question Papers Available</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Select Your Engineering Branch
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Choose your department to browse semester papers and subject guidance.
                </p>
              </div>
            </div>

            {/* Branch Cards Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {DSU_BRANCHES.map((branch) => (
                <Link
                  key={branch.slug}
                  to={`/dsu-hub/${branch.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-1 rounded-md">
                        {branch.shortName}
                      </span>
                      {branch.badge && (
                        <span className="text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded">
                          {branch.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                      {branch.name}
                    </h3>

                    <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {branch.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                    <span>{branch.semesters.length} Semesters Listed</span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Soft Conversion Banner */}
            <div className="mt-14 rounded-2xl border border-[var(--border-accent)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)] p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between shadow-sm">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] mb-2">
                  <Sparkles size={14} />
                  <span>AI Study Assistant</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Have a DSU lecture PDF or notes?
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  MindFlow automatically converts your course slides into active recall flashcards, practice quizzes, and SM-2 spaced review queues in 10 seconds.
                </p>
              </div>
              <div className="mt-6 sm:mt-0 flex-shrink-0">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[var(--accent-strong)] transition-all"
                >
                  <Zap size={14} />
                  <span>Try AI Generator Free</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DsuHubLanding;
