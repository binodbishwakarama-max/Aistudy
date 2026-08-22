import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ChevronRight,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Tag,
  ArrowRight,
  Share2,
  Video,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  GraduationCap
} from 'lucide-react';
import { getSubject } from '../../data/dsuHubData';
import { toast } from 'react-hot-toast';

const EXAM_TYPE_LABELS = {
  end_sem: { label: 'End Semester', bg: 'bg-[var(--success)]/10', text: 'text-[var(--success)]' },
  mid1: { label: 'Mid-Term 1 (CIA-1)', bg: 'bg-[var(--accent)]/10', text: 'text-[var(--accent)]' },
  mid2: { label: 'Mid-Term 2 (CIA-2)', bg: 'bg-[var(--accent)]/10', text: 'text-[var(--accent)]' },
  other: { label: 'Supplementary / Model', bg: 'bg-[var(--text-muted)]/10', text: 'text-[var(--text-muted)]' },
};

const resolveFileUrl = (url) => {
  if (!url) return '#';
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const parsed = new URL(url);
      if (parsed.pathname.startsWith('/sample-pyqs/')) {
        return parsed.pathname;
      }
    }
  } catch {
    // fallback
  }
  return url;
};

const SubjectPage = () => {
  const { branchSlug, semesterNum, subjectCode } = useParams();
  const subject = getSubject(branchSlug, semesterNum, subjectCode);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  if (!subject) {
    return <Navigate to="/dsu-hub" replace />;
  }

  const { branch, semester, guidance, pyqs = [], resources = [], predictedQuestions = [] } = subject;

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${subject.name} (${subject.code}) PYQs & Resources - DSU Hub`,
          text: `Question papers, predicted questions, and open-source video courses for ${subject.name} at Dayananda Sagar University.`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pb-24">
      {/* Header & Breadcrumb */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-surface)] py-6 px-4 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)] mb-3 sm:mb-4" aria-label="Breadcrumb">
            <Link to="/dsu-hub" className="hover:text-[var(--text-primary)] transition-colors">DSU Hub</Link>
            <ChevronRight size={12} />
            <Link to={`/dsu-hub/${branch.slug}`} className="hover:text-[var(--text-primary)] transition-colors">{branch.shortName}</Link>
            <ChevronRight size={12} />
            <Link to={`/dsu-hub/${branch.slug}/${semester.number}`} className="hover:text-[var(--text-primary)] transition-colors">Sem {semester.number}</Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-[var(--text-primary)] truncate max-w-[140px] sm:max-w-none">{subject.code}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-0.5 rounded">
              {subject.code}
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2.5 py-0.5 rounded">
              {branch.shortName} • Sem {semester.number}
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2.5 py-0.5 rounded">
              {subject.credits} Credits
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] leading-snug">
              {subject.name}
            </h1>
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all w-full sm:w-auto flex-shrink-0"
            >
              <Share2 size={14} />
              <span>Share Subject</span>
            </button>
          </div>

          {/* Quick Tab Navigator */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All Materials
            </button>
            <button
              onClick={() => setActiveTab('pyqs')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'pyqs'
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FileText size={13} />
              <span>Papers ({pyqs.length})</span>
            </button>
            {predictedQuestions.length > 0 && (
              <button
                onClick={() => setActiveTab('predicted')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'predicted'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Flame size={13} className="text-amber-500" />
                <span>Predicted Questions ({predictedQuestions.length})</span>
              </button>
            )}
            {resources.length > 0 && (
              <button
                onClick={() => setActiveTab('resources')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'resources'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <GraduationCap size={13} className="text-emerald-500" />
                <span>Open Source Courses ({resources.length})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 sm:px-10 pt-6 sm:pt-10 grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Main Learning Materials */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">

          {/* 1. Exam Guidance Block */}
          {(activeTab === 'all' || activeTab === 'pyqs') && guidance && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-base mb-3 sm:mb-4">
                <Lightbulb size={18} />
                <h2>DSU Exam Strategy &amp; Guidance</h2>
              </div>

              <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 sm:space-y-4">
                <p>{guidance.notes}</p>

                {guidance.passingTips && (
                  <div className="rounded-xl border border-[rgba(24,128,56,0.2)] bg-[var(--success-soft)] p-3.5 sm:p-4 text-xs text-[var(--text-primary)]">
                    <span className="font-bold text-[var(--success)] block mb-1">
                      💡 High-Yield Passing Strategy:
                    </span>
                    {guidance.passingTips}
                  </div>
                )}

                {guidance.highYieldTopics && guidance.highYieldTopics.length > 0 && (
                  <div className="pt-1 sm:pt-2">
                    <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                      Most Repeated Question Topics
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {guidance.highYieldTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] sm:text-xs rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1 font-medium text-[var(--text-secondary)]"
                        >
                          <Tag size={10} className="text-[var(--accent)]" />
                          <span>{topic}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 2. High-Probability Predicted Exam Questions */}
          {(activeTab === 'all' || activeTab === 'predicted') && predictedQuestions.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-amber-500" />
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                    🔥 Most Predictable Exam Questions ({predictedQuestions.length})
                  </h2>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                  High Probability
                </span>
              </div>

              <div className="space-y-3">
                {predictedQuestions.map((item, idx) => {
                  const isExpanded = expandedQuestions[idx];
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:p-5 transition-all hover:border-[var(--border-accent)]"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {item.probability || 'High Probability'}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">
                          {item.marks} Marks
                        </span>
                        {item.module && (
                          <span className="text-[10px] sm:text-[11px] font-medium text-[var(--text-muted)]">
                            {item.module}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] leading-snug">
                        Q{idx + 1}. {item.question}
                      </h3>

                      {item.answerKey && (
                        <div className="mt-3 pt-3 border-t border-[var(--border)]">
                          <button
                            onClick={() => toggleQuestion(idx)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            <span>{isExpanded ? 'Hide Key Solution Strategy' : 'View Key Solution Strategy & Answer Breakdown'}</span>
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                              <span className="font-bold text-[var(--text-primary)] block mb-1">
                                🔑 Key Points to Include for Full Marks:
                              </span>
                              <p>{item.answerKey}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. Open Source Video Lectures & Playlists */}
          {(activeTab === 'all' || activeTab === 'resources') && resources.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap size={20} className="text-emerald-500" />
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                    🎓 Open Source Courses &amp; Video Playlists ({resources.length})
                  </h2>
                </div>
                <span className="text-xs text-[var(--text-muted)]">MIT • Stanford • Harvard • NPTEL</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {res.provider}
                        </span>
                        <ExternalLink size={12} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                        {res.title}
                      </h3>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                      <span className="capitalize">{res.type.replace('_', ' ')}</span>
                      <span className="font-semibold text-[var(--accent)] group-hover:underline">Watch Course ↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 4. Previous Year Questions Section */}
          {(activeTab === 'all' || activeTab === 'pyqs') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[var(--accent)]" />
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                    Previous Year Question Papers ({pyqs.length})
                  </h2>
                </div>
                <span className="text-xs text-[var(--text-muted)]">DSU Verified</span>
              </div>

              {pyqs.length === 0 ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 sm:p-8 text-center text-xs text-[var(--text-muted)]">
                  Question papers for this subject are currently being digitized. Check back soon!
                </div>
              ) : (
                <div className="space-y-3">
                  {pyqs.map((paper, idx) => {
                    const typeInfo = EXAM_TYPE_LABELS[paper.examType] || EXAM_TYPE_LABELS.other;

                    return (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:p-5 transition-all hover:border-[var(--border-accent)] hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded ${typeInfo.bg} ${typeInfo.text}`}>
                              {typeInfo.label}
                            </span>
                            <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
                              Year {paper.year}
                            </span>
                            {paper.duration && (
                              <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">
                                ⏱️ {paper.duration}
                              </span>
                            )}
                            {paper.maxMarks && (
                              <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">
                                🎯 {paper.maxMarks} Marks
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                            {paper.title}
                          </h3>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">
                            Dayananda Sagar University • {subject.code} {paper.date ? `• Exam Date: ${paper.date}` : ''}
                          </p>
                        </div>

                        <div className="w-full sm:w-auto pt-2 sm:pt-0">
                          <a
                            href={resolveFileUrl(paper.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all active:scale-[0.98]"
                          >
                            <ExternalLink size={13} />
                            <span>View PDF Paper</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

        </div>

        {/* Right Col: Soft Conversion CTA Card */}
        <aside className="space-y-6">
          <div className="sticky top-24 rounded-2xl border border-[var(--border-accent)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-elevated)] p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] mb-4">
              <Sparkles size={20} />
            </div>

            <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
              Studying for {subject.code}?
            </h3>

            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              Don't just read old papers. Upload your {subject.name} lecture notes to MindFlow and generate:
            </p>

            <ul className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[var(--success)] flex-shrink-0" />
                <span>Active-recall flashcards from lecture slides</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[var(--success)] flex-shrink-0" />
                <span>Adaptive multiple-choice mock questions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[var(--success)] flex-shrink-0" />
                <span>SM-2 spaced review scheduling</span>
              </li>
            </ul>

            <Link
              to={`/register?subject=${encodeURIComponent(subject.code)}`}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3 text-xs font-bold text-white shadow hover:bg-[var(--accent-strong)] transition-all"
            >
              <Zap size={14} />
              <span>Create Free Study Deck</span>
            </Link>

            <p className="mt-3 text-center text-[11px] text-[var(--text-muted)]">
              100% Free for DSU Students • No credit card required
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default SubjectPage;
