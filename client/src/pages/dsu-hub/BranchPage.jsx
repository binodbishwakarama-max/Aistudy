import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ChevronRight,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getBranchBySlug } from '../../data/dsuHubData';

const BranchPage = () => {
  const { branchSlug } = useParams();
  const branch = getBranchBySlug(branchSlug);

  if (!branch) {
    return <Navigate to="/dsu-hub" replace />;
  }

  const allSubjects = branch.semesters.flatMap((s) =>
    s.subjects.map((sub) => ({ ...sub, semesterNumber: s.number }))
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pb-20">
      {/* Breadcrumb & Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-surface)] py-6 px-4 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)] mb-3 sm:mb-4" aria-label="Breadcrumb">
            <Link to="/dsu-hub" className="hover:text-[var(--text-primary)] transition-colors">DSU Hub</Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-[var(--text-primary)]">{branch.shortName}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-0.5 rounded">
              {branch.shortName} Department
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Dayananda Sagar University
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {branch.name}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {branch.description} Select your current semester to view previous exam question papers, passing criteria, and recommended module priorities.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 sm:px-10 pt-6 sm:pt-10">
        {/* Semester Selection Grid */}
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Layers size={18} className="text-[var(--accent)]" />
            <span>Select Semester</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branch.semesters.map((sem) => (
              <Link
                key={sem.number}
                to={`/dsu-hub/${branch.slug}/${sem.number}`}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 transition-all hover:border-[var(--accent)] hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] bg-[var(--bg-elevated)] px-2.5 py-1 rounded">
                    Semester {sem.number}
                  </span>
                  <span className="text-xs text-[var(--accent)] font-semibold">
                    {sem.subjects.length} Subjects
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {sem.number}th Semester Archive
                </h3>

                <ul className="mt-3 space-y-1 text-xs text-[var(--text-secondary)]">
                  {sem.subjects.slice(0, 3).map((sub) => (
                    <li key={sub.code} className="truncate">
                      • {sub.code}: {sub.name}
                    </li>
                  ))}
                  {sem.subjects.length > 3 && (
                    <li className="text-[11px] text-[var(--text-muted)] italic">
                      + {sem.subjects.length - 3} more subjects...
                    </li>
                  )}
                </ul>

                <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
                  <span>Browse Question Papers</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Subjects Directory for this Branch */}
        <div className="mt-14">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--accent)]" />
            <span>All Subjects in {branch.shortName}</span>
          </h2>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] divide-y divide-[var(--border)] overflow-hidden">
            {allSubjects.map((sub) => (
              <Link
                key={sub.code}
                to={`/dsu-hub/${branch.slug}/${sub.semesterNumber}/${sub.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">
                    {sub.code}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {sub.name}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">Semester {sub.semesterNumber}</span>
                  </div>
                </div>

                <div className="mt-2 sm:mt-0 flex items-center gap-4 text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent)]">
                  <span>{sub.pyqs?.length || 0} Papers</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BranchPage;
