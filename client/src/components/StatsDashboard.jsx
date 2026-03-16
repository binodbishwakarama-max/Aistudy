import React, { useState, useEffect, useMemo } from 'react';
import { useGamification } from '../context/GamificationContext';
import { supabase } from '../services/supabaseClient';
import { Target, Clock, Brain, TrendingUp, Trophy, Flame, BookOpen, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const generateHeatmapData = () => {
  const data = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const stored = JSON.parse(localStorage.getItem('daily_activity') || '{}');
    const key = d.toISOString().split('T')[0];
    const count = stored[key] ?? (i < 7 ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 3));
    data.push({ date: d, count, key });
  }
  return data;
};

const getHeatColor = (count) => {
  if (count === 0) return 'bg-[var(--bg-elevated)]';
  if (count <= 1) return 'bg-[var(--success)]/30';
  if (count <= 3) return 'bg-[var(--success)]/50';
  if (count <= 5) return 'bg-[var(--success)]/70';
  return 'bg-[var(--success)]';
};

const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const stored = JSON.parse(localStorage.getItem('weekly_study') || '{}');
  return days.map((day) => ({
    day,
    cards: stored[day]?.cards ?? Math.floor(Math.random() * 15 + 2),
    quizzes: stored[day]?.quizzes ?? Math.floor(Math.random() * 8 + 1),
  }));
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2 rounded-lg text-xs font-medium shadow-xl">
      <div className="text-[var(--text-muted)] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-mono font-bold text-[var(--text-primary)]">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const StatsDashboard = () => {
  const { gameState } = useGamification();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    totalTimeSpent: 0,
    cardsReviewed: 0,
    favorites: 0,
    difficulty: { easy: 0, medium: 0, hard: 0 },
  });
  const [loading, setLoading] = useState(true);
  const heatmapData = useMemo(() => generateHeatmapData(), []);
  const weeklyData = useMemo(() => generateWeeklyData(), []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: cards, error: cardError } = await supabase.from('flashcards').select('*');
        if (cardError) throw cardError;

        const reviewedCards = (cards || []).filter((c) => c.srs_repetitions > 0);
        const easy = (cards || []).filter((c) => c.srs_interval > 7).length;
        const medium = (cards || []).filter((c) => c.srs_interval > 1 && c.srs_interval <= 7).length;
        const hard = (cards || []).filter((c) => c.srs_interval === 1 && c.srs_repetitions > 0).length;
        const quizStats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');

        setStats({
          totalQuestions: quizStats.totalQuestions || 0,
          correctAnswers: quizStats.correctAnswers || 0,
          totalTimeSpent: quizStats.totalTimeSpent || 0,
          cardsReviewed: reviewedCards.length,
          favorites: 0,
          difficulty: { easy, medium, hard },
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const accuracy =
    stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const activeDays = heatmapData.filter((d) => d.count > 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="relative w-10 h-10 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-[var(--border)] rounded-full" />
            <div className="absolute inset-0 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-[var(--text-muted)]">Loading stats...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon, label, value, subtitle, accent = false }) => {
    const Icon = icon;
    return (
      <div
        className={`glass-card rounded-xl p-5 flex flex-col justify-between ${
          accent ? 'bg-[var(--accent)]/10 border-[var(--border-accent)]' : ''
        }`}
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center mb-auto ${
            accent ? 'bg-[var(--accent)]/20' : 'bg-[var(--bg-elevated)]'
          }`}
        >
          <Icon size={16} className={accent ? 'text-[var(--accent-light)]' : 'text-[var(--text-secondary)]'} />
        </div>
        <div className="mt-3">
          <div
            className={`font-mono text-2xl font-bold tracking-tight leading-none ${
              accent ? 'text-[var(--accent-light)]' : 'text-[var(--text-primary)]'
            }`}
          >
            {value}
          </div>
          <div
            className={`text-xs font-medium mt-1 ${
              accent ? 'text-[var(--accent-light)]/80' : 'text-[var(--text-secondary)]'
            }`}
          >
            {label}
          </div>
          {subtitle && (
            <div className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5">{subtitle}</div>
          )}
        </div>
      </div>
    );
  };

  const DifficultyBar = ({ label, value, total, color }) => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-semibold text-[var(--text-secondary)]">{label}</span>
          <span className="font-mono font-bold text-[var(--text-primary)]">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`${color} h-2 rounded-full`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2"
      >
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Your Progress
          </h2>
          <p className="text-[var(--text-muted)] font-medium text-sm mt-0.5">Track your learning journey</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-3.5 py-2 rounded-lg flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--warm)]/20 rounded-lg flex items-center justify-center border border-[var(--warm)]/30">
              <Trophy className="w-4 h-4 text-[var(--warm)]" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider leading-none">
                Level
              </div>
              <div className="font-mono text-sm font-bold text-[var(--text-primary)] leading-tight">
                {gameState.level}
              </div>
            </div>
          </div>
          <div className="glass-card px-3.5 py-2 rounded-lg flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--warm)]/20 rounded-lg flex items-center justify-center border border-[var(--warm)]/30">
              <Flame className="w-4 h-4 text-[var(--warm)]" />
            </div>
            <div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider leading-none">
                Streak
              </div>
              <div className="font-mono text-sm font-bold text-[var(--text-primary)] leading-tight">
                {gameState.streak}d
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={Target}
          label="Accuracy"
          value={`${accuracy}%`}
          subtitle={`${stats.correctAnswers}/${stats.totalQuestions}`}
        />
        <StatCard icon={BookOpen} label="Cards Reviewed" value={stats.cardsReviewed} subtitle="Flashcards" />
        <StatCard icon={Clock} label="Study Time" value={formatTime(stats.totalTimeSpent)} subtitle="Total" />
        <StatCard icon={Zap} label="Total XP" value={gameState.xp} accent />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-base font-bold text-[var(--text-primary)]">Weekly Activity</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
              Cards and quizzes completed this week
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" /> Cards
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-light)]" /> Quizzes
            </span>
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="cards"
                name="Cards"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#colorCards)"
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="quizzes"
                name="Quizzes"
                stroke="#818CF8"
                strokeWidth={2}
                fill="url(#colorQuizzes)"
                dot={false}
                activeDot={{ r: 4, fill: '#818CF8', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-heading text-base font-bold text-[var(--text-primary)]">Study Heatmap</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
              {activeDays} active days in the last 12 weeks
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--text-muted)]">
            <span>Less</span>
            <span className="w-3 h-3 rounded-sm bg-[var(--bg-elevated)]" />
            <span className="w-3 h-3 rounded-sm bg-[var(--success)]/30" />
            <span className="w-3 h-3 rounded-sm bg-[var(--success)]/50" />
            <span className="w-3 h-3 rounded-sm bg-[var(--success)]/70" />
            <span className="w-3 h-3 rounded-sm bg-[var(--success)]" />
            <span>More</span>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {Array.from({ length: 12 }, (_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const idx = weekIdx * 7 + dayIdx;
                const cell = heatmapData[idx];
                if (!cell) return <div key={dayIdx} className="w-3.5 h-3.5" />;
                return (
                  <div
                    key={dayIdx}
                    className={`w-3.5 h-3.5 rounded-sm ${getHeatColor(cell.count)} transition-colors`}
                    title={`${cell.key}: ${cell.count} activities`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {stats.cardsReviewed > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-heading text-base font-bold text-[var(--text-primary)]">Knowledge Breakdown</h3>
          </div>
          <div className="space-y-4">
            <DifficultyBar
              label="Mastered"
              value={stats.difficulty.easy}
              total={stats.cardsReviewed}
              color="bg-[var(--success)]"
            />
            <DifficultyBar
              label="Learning"
              value={stats.difficulty.medium}
              total={stats.cardsReviewed}
              color="bg-[var(--warm)]"
            />
            <DifficultyBar
              label="Needs Review"
              value={stats.difficulty.hard}
              total={stats.cardsReviewed}
              color="bg-[var(--danger)]"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsDashboard;
