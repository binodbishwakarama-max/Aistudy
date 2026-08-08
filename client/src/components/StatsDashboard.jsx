import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Brain, BookOpen, Clock, Flame, Target, Trophy, Zap } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { getAnalytics } from '../services/api';

const getHeatColor = (count) => {
  if (count === 0) return 'bg-[rgba(0,0,0,0.06)]';
  if (count <= 1) return 'bg-[rgba(0,113,227,0.18)]';
  if (count <= 3) return 'bg-[rgba(0,113,227,0.38)]';
  if (count <= 5) return 'bg-[rgba(0,113,227,0.58)]';
  return 'bg-[var(--accent)]';
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-xs shadow-[var(--shadow-soft)]">
      <div className="mb-1 text-[var(--text-muted)]">{label}</div>
      {payload.map((point, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: point.color }} />
          {point.name}: <span className="font-semibold text-[var(--text-primary)]">{point.value}</span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subtitle, accent = false }) => (
  <div className={`glass-card p-5 ${accent ? 'border-[var(--border-accent)] bg-[var(--bg-strong)]' : ''}`}>
    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent ? 'bg-[var(--bg-elevated)] text-[var(--accent)]' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}>
      <Icon size={18} />
    </div>
    <div className={`mt-5 text-3xl font-semibold ${accent ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
      {value}
    </div>
    <div className="mt-2 text-sm text-[var(--text-secondary)]">{label}</div>
    {subtitle && <div className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</div>}
  </div>
);

const DifficultyBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--text-secondary)]">{label}</span>
        <span className="font-semibold text-[var(--text-primary)]">{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <Motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
};

const EmptyChart = ({ message }) => (
  <div className="flex h-52 flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--bg-surface)] text-center sm:h-56">
    <p className="text-sm font-medium text-[var(--text-secondary)]">{message}</p>
    <p className="mt-2 max-w-xs text-xs text-[var(--text-muted)]">
      Complete a flashcard or quiz session to start tracking activity here.
    </p>
  </div>
);

const StatsDashboard = () => {
  const { gameState } = useGamification();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    totalTimeSpent: 0,
    cardsReviewed: 0,
    dueCount: 0,
    difficulty: { easy: 0, medium: 0, hard: 0 },
    weeklyActivity: [],
    heatmap: [],
    hasSessionData: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const data = await getAnalytics();
        if (!active) return;

        setStats({
          totalQuestions: data.totalQuestions || 0,
          correctAnswers: data.correctAnswers || 0,
          totalTimeSpent: data.totalTimeSpent || 0,
          cardsReviewed: data.cardsReviewed || 0,
          dueCount: data.dueCount || 0,
          difficulty: data.difficulty || { easy: 0, medium: 0, hard: 0 },
          weeklyActivity: data.weeklyActivity || [],
          heatmap: data.heatmap || [],
          hasSessionData: Boolean(data.hasSessionData),
        });
      } catch {
        if (active) {
          setError('Could not load analytics. Try again after your next study session.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">Loading stats...</p>
        </div>
      </div>
    );
  }

  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
  const activeDays = stats.heatmap.filter((item) => item.count > 0).length;
  const weeklyHasData = stats.weeklyActivity.some((day) => day.cards > 0 || day.quizzes > 0);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {error && (
        <div className="rounded-[var(--radius-md)] border border-[rgba(215,0,21,0.2)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      <Motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">Progress</p>
            <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your study momentum</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              Real data from your decks and study sessions — no placeholders.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="info-chip">
              <Trophy size={14} className="text-[var(--warm)]" />
              <span>Level {gameState.level}</span>
            </div>
            <div className="info-chip">
              <Flame size={14} className="text-[var(--warm)]" />
              <span>{gameState.streak} day streak</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Target} label="Quiz accuracy" value={stats.totalQuestions > 0 ? `${accuracy}%` : '—'} subtitle={stats.totalQuestions > 0 ? `${stats.correctAnswers}/${stats.totalQuestions} correct` : 'No quiz sessions yet'} />
          <StatCard icon={BookOpen} label="Cards reviewed" value={stats.cardsReviewed} subtitle={stats.dueCount > 0 ? `${stats.dueCount} due now` : 'SRS tracked'} />
          <StatCard icon={Clock} label="Study time" value={stats.totalTimeSpent > 0 ? formatTime(stats.totalTimeSpent) : '—'} subtitle={stats.hasSessionData ? 'From recorded sessions' : 'No sessions yet'} />
          <StatCard icon={Zap} label="XP earned" value={gameState.xp} subtitle="Current total" accent />
        </div>
      </Motion.section>

      <Motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="section-shell p-5 sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Weekly activity</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Cards and quizzes completed this week</p>
          </div>
          {weeklyHasData && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                Cards
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-light)]" />
                Quizzes
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          {weeklyHasData ? (
            <div className="h-52 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeklyActivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cardsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="quizFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-light)" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="var(--accent-light)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="cards" name="Cards" stroke="var(--accent)" strokeWidth={2.5} fill="url(#cardsFill)" dot={false} activeDot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="quizzes" name="Quizzes" stroke="var(--accent-light)" strokeWidth={2} fill="url(#quizFill)" dot={false} activeDot={{ r: 4, fill: 'var(--accent-light)', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart message="No activity recorded this week" />
          )}
        </div>
      </Motion.section>

      <Motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="section-shell p-5 sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Study heatmap</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {activeDays > 0
                ? `${activeDays} active days in the last 12 weeks`
                : 'No study sessions recorded yet'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-[var(--text-muted)]">
            <span>Less</span>
            <span className="h-3 w-3 rounded-sm bg-[rgba(0,0,0,0.06)]" />
            <span className="h-3 w-3 rounded-sm bg-[rgba(0,113,227,0.18)]" />
            <span className="h-3 w-3 rounded-sm bg-[rgba(0,113,227,0.35)]" />
            <span className="h-3 w-3 rounded-sm bg-[rgba(0,113,227,0.55)]" />
            <span className="h-3 w-3 rounded-sm bg-[var(--accent)]" />
            <span>More</span>
          </div>
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto pb-2">
          {Array.from({ length: 12 }, (_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const cell = stats.heatmap[weekIndex * 7 + dayIndex];
                if (!cell) return <div key={dayIndex} className="h-3.5 w-3.5" />;

                return (
                  <div
                    key={dayIndex}
                    className={`h-3.5 w-3.5 rounded-sm ${getHeatColor(cell.count)}`}
                    title={`${cell.key}: ${cell.count} session${cell.count === 1 ? '' : 's'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </Motion.section>

      {stats.cardsReviewed > 0 && (
        <Motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="section-shell p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Brain size={18} className="text-[var(--accent)]" />
            <h3 className="text-xl font-semibold">Knowledge breakdown</h3>
          </div>

          <div className="mt-6 space-y-4">
            <DifficultyBar label="Mastered" value={stats.difficulty.easy} total={stats.cardsReviewed} color="var(--success)" />
            <DifficultyBar label="Learning" value={stats.difficulty.medium} total={stats.cardsReviewed} color="var(--warm)" />
            <DifficultyBar label="Needs review" value={stats.difficulty.hard} total={stats.cardsReviewed} color="var(--danger)" />
          </div>
        </Motion.section>
      )}
    </div>
  );
};

export default StatsDashboard;
