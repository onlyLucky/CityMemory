import React, { useState } from 'react';
import { ChevronLeft, Award, Check, Lock } from 'lucide-react';
import { ACHIEVEMENTS, type Achievement } from '../data/game-data';

interface AchievementsScreenProps {
  onBack: () => void;
}

type Filter = 'all' | 'unlocked' | 'inProgress';

const TIER: Record<string, { bg: string; text: string; label: string }> = {
  bronze:  { bg: 'bg-amber-100',  text: 'text-amber-600',        label: '铜牌' },
  silver:  { bg: 'bg-muted',      text: 'text-muted-foreground', label: '银牌' },
  gold:    { bg: 'bg-yellow-100', text: 'text-yellow-500',       label: '金牌' },
  diamond: { bg: 'bg-blue-100',   text: 'text-blue-500',         label: '钻石' },
};

function AchievementCard({ a }: { a: Achievement }) {
  const tier = TIER[a.tier];
  const pct = a.progress !== undefined && a.target ? Math.min(100, Math.round((a.progress / a.target) * 100)) : 0;

  return (
    <div className={`bg-card rounded-2xl border border-border px-4 py-4 flex items-start gap-4 ${!a.unlocked ? 'opacity-65' : ''}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${a.unlocked ? `${tier.bg} ${tier.text}` : 'bg-muted text-muted-foreground'}`}>
        <Award size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="text-foreground" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{a.name}</p>
          <span className={`rounded-full px-1.5 py-0.5 ${a.unlocked ? `${tier.bg} ${tier.text}` : 'bg-muted text-muted-foreground'}`}
            style={{ fontSize: '0.5625rem', fontWeight: 600 }}>
            {tier.label}
          </span>
        </div>
        <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{a.description}</p>
        {!a.unlocked && a.progress !== undefined && a.target !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-muted-foreground flex-shrink-0" style={{ fontSize: '0.625rem' }}>{a.progress}/{a.target}</span>
          </div>
        )}
      </div>
      <div className="flex-shrink-0 mt-0.5">
        {a.unlocked
          ? <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"><Check size={12} className="text-primary-foreground" /></div>
          : <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center"><Lock size={11} className="text-muted-foreground" /></div>
        }
      </div>
    </div>
  );
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const total = ACHIEVEMENTS.length;
  const pct = Math.round((unlockedCount / total) * 100);
  const recentName = ACHIEVEMENTS.filter(a => a.unlocked).slice(-1)[0]?.name ?? '—';

  const filtered = ACHIEVEMENTS.filter(a =>
    filter === 'all' ? true : filter === 'unlocked' ? a.unlocked : !a.unlocked
  );
  const categories = [...new Set(filtered.map(a => a.category))];

  const tabs: Array<{ id: Filter; label: string }> = [
    { id: 'all',        label: `全部 (${total})` },
    { id: 'unlocked',   label: `已获得 (${unlockedCount})` },
    { id: 'inProgress', label: `进行中 (${total - unlockedCount})` },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-auto">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <ChevronLeft size={18} className="text-primary-foreground" />
        </button>
        <div>
          <p className="text-foreground" style={{ fontSize: '1.125rem', fontWeight: 600 }}>我的成就</p>
          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>已解锁 {unlockedCount}/{total}</p>
        </div>
      </div>

      {/* Hero stats */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="bg-primary rounded-2xl px-5 py-4">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: '已获成就', value: `${unlockedCount}个` },
              { label: '总进度',   value: `${pct}%` },
              { label: '最近获得', value: recentName },
            ].map(s => (
              <div key={s.label} className="bg-primary-foreground/10 rounded-xl py-3 px-2 text-center">
                <p className="text-primary-foreground/60" style={{ fontSize: '0.5625rem' }}>{s.label}</p>
                <p className="text-primary-foreground font-bold truncate mt-0.5"
                  style={{ fontSize: s.label === '最近获得' ? '0.6875rem' : '1rem' }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-primary-foreground/60" style={{ fontSize: '0.6875rem' }}>总体进度</span>
            <span className="text-primary-foreground/60" style={{ fontSize: '0.6875rem' }}>{pct}%</span>
          </div>
          <div className="h-2 bg-primary-foreground/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary-foreground rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 pb-4 flex gap-2 flex-wrap flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3.5 py-1.5 rounded-full border transition-all ${filter === t.id ? 'bg-primary text-primary-foreground border-transparent' : 'bg-card text-muted-foreground border-border hover:bg-accent'}`}
            style={{ fontSize: '0.8125rem' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Achievement list */}
      <div className="px-4 pb-28 space-y-5">
        {categories.map(cat => (
          <div key={cat}>
            <p className="text-muted-foreground mb-2.5 px-1"
              style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {cat}
            </p>
            <div className="space-y-2">
              {filtered.filter(a => a.category === cat).map(a => (
                <AchievementCard key={a.id} a={a} />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10" style={{ fontSize: '0.875rem' }}>暂无成就</p>
        )}
      </div>
    </div>
  );
}
