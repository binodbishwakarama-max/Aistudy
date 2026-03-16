import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Clock, TrendingUp, Brain, Calendar } from 'lucide-react';

const SRSDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    due: 0,
    mastered: 0,
    learning: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .not('next_review_at', 'is', null);

        if (error) throw error;

        const now = new Date();
        const total = (data || []).length;
        const due = (data || []).filter((c) => new Date(c.next_review_at) <= now).length;
        const mastered = (data || []).filter((c) => c.srs_interval > 21).length;
        const learning = total - mastered;

        setStats({ total, due, mastered, learning });
      } catch (err) {
        console.error('Error fetching SRS stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="w-6 h-6 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-[var(--text-muted)]">Loading Brain Stats...</span>
      </div>
    );
  }

  const items = [
    { icon: Brain, label: 'Total Cards', value: stats.total, color: 'var(--accent)' },
    { icon: Clock, label: 'Due Today', value: stats.due, color: stats.due > 0 ? 'var(--danger)' : 'var(--success)', pulse: stats.due > 0 },
    { icon: TrendingUp, label: 'Learning', value: stats.learning, color: 'var(--warm)' },
    { icon: Calendar, label: 'Mastered', value: stats.mastered, color: 'var(--accent-light)' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1">
        SRS Overview
      </h3>
      {items.map(({ icon: Icon, label, value, color, pulse }) => (
        <div
          key={label}
          className="glass-card rounded-xl p-3 flex items-center gap-3 relative"
        >
          {pulse && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--danger)] rounded-full animate-pulse" />
          )}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-lg font-bold text-[var(--text-primary)]">{value}</div>
            <div className="text-[10px] font-medium text-[var(--text-muted)]">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SRSDashboard;
