import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ChevronRight,
  BookOpen,
  FileText,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { getSemester } from '../../data/dsuHubData';

const SemesterPage = () => {
  const { branchSlug, semesterNum } = useParams();
  const semester = getSemester(branchSlug, semesterNum);

  if (!semester) {
    return <Navigate to="/dsu-hub" replace />;
  }

  const { branch } = semester;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pb-20">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-surface)] py-6 px-4 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)] mb-3 sm:mb-4" aria-label="Breadcrumb">
            <Link to="/dsu-hub" className="hover:text-[var(--text-primary)] transition-colors">DSU Hub</Link>
            <ChevronRight size={12} />
            <Link to={`/dsu-hub/${branch.slug}`} className="hover:text-[var(--text-primary)] transition-colors">{branch.shortName}</Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-[var(--text-primary)]">Semester {semester.number}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[var(--accent)] mb-2">
            <span>{branch.name}</span>
            <span>•</span>
            <span>Sem {semester.number}</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Semester {semester.number} Question Papers &amp; Guidance
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            All subjects, syllabus modules, exam patterns, and previous year mid-term and end-sem question papers for {branch.name} (Sem {semester.number}).
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 sm:px-10 pt-6 sm:pt-10">
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Semester {semester.number} Subjects ({semester.subjects.length})
          </h2>
          <span className="text-[11px] sm:text-xs text-[var(--text-muted)]">Dayananda Sagar University</span>
        </div>

        {/* Subject Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {semester.subjects.map((sub) => (
            <Link
              key={sub.code}
              to={`/dsu-hub/${branch.slug}/${semester.number}/${sub.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 transition-all hover:border-[var(--accent)] hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-1 rounded">
                    {sub.code}
                  </span>
                  <span className="font-semibold text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded">
                    {sub.credits} Credits
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {sub.name}
                </h3>

                {sub.guidance && (
                  <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {sub.guidance.notes}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
                <span>{sub.pyqs?.length || 0} Question Papers Available</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Studying for Semester {semester.number} exams?
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Upload your notes or slides to generate personalized study decks in seconds.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--accent-strong)] transition-colors flex-shrink-0"
          >
            <Sparkles size={13} />
            <span>Generate Flashcards</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SemesterPage;
