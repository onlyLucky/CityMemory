import React, { useState } from 'react';
import { Zap, Trophy, MapPin, Award, ChevronRight, Map, X } from 'lucide-react';
import chinaMapImg from '../../../imports/首页/9a39d2dacc22188ce1be74c233caeef1f9aead2d.png';
import {
  LEADERBOARD_GLOBAL, ACHIEVEMENTS, COUNTRIES,
  type LeaderboardEntry, type Achievement,
} from '../../data/game-data';

interface DesktopDashboardProps {
  onStartBattle: () => void;
  litProvinces: Record<string, string[]>;
  selectedCountry: string;
}

function NameAvatar({ name, size = 32, inverted = false }: { name: string; size?: number; inverted?: boolean }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${inverted ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-foreground'}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {name.slice(0, 1)}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-xl flex flex-col w-full max-w-lg" style={{ maxHeight: '80vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h3 className="text-foreground font-semibold" style={{ fontSize: '1rem' }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 bg-muted rounded-lg hover:bg-accent transition-colors">
            <X size={15} className="text-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function PodiumEntry({ entry, rank, isFirst = false }: { entry: LeaderboardEntry; rank: number; isFirst?: boolean }) {
  const barH = isFirst ? 56 : rank === 2 ? 40 : 32;
  return (
    <div className="flex flex-col items-center">
      {isFirst && <Trophy size={12} className="text-yellow-400 mb-0.5" />}
      <NameAvatar name={entry.name} size={isFirst ? 36 : 28} />
      <p className="text-foreground font-medium text-center mt-1 truncate" style={{ width: 52, fontSize: '0.625rem' }}>{entry.name}</p>
      <div className="bg-primary rounded-t-xl w-12 flex flex-col items-center justify-center mt-1" style={{ height: barH }}>
        <span className="text-primary-foreground font-bold" style={{ fontSize: isFirst ? '1.125rem' : '0.9375rem' }}>{rank}</span>
        <span className="text-primary-foreground/50" style={{ fontSize: '0.5rem' }}>{entry.score}</span>
      </div>
    </div>
  );
}

function LeaderRow({ entry }: { entry: LeaderboardEntry }) {
  const winRate = entry.total > 0 ? Math.round((entry.wins / entry.total) * 100) : 0;
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all ${entry.isCurrentUser ? 'bg-primary border-primary' : 'bg-muted/40 border-transparent hover:border-border'}`}>
      <span className={`w-4 text-center font-bold flex-shrink-0 ${entry.isCurrentUser ? 'text-primary-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.75rem' }}>
        {entry.rank}
      </span>
      <NameAvatar name={entry.name} size={26} inverted={entry.isCurrentUser} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${entry.isCurrentUser ? 'text-primary-foreground' : 'text-foreground'}`} style={{ fontSize: '0.75rem' }}>
          {entry.name}{entry.isCurrentUser && ' (我)'}
        </p>
        <p className={`truncate ${entry.isCurrentUser ? 'text-primary-foreground/60' : 'text-muted-foreground'}`} style={{ fontSize: '0.625rem' }}>
          {entry.province} · {winRate}%
        </p>
      </div>
      <span className={`font-bold flex-shrink-0 ${entry.isCurrentUser ? 'text-primary-foreground' : 'text-foreground'}`} style={{ fontSize: '0.75rem' }}>
        {entry.score}
      </span>
    </div>
  );
}


function AchievementBadge({ a }: { a: Achievement }) {
  const tierColor: Record<string, string> = { bronze: 'text-amber-600', silver: 'text-muted-foreground', gold: 'text-yellow-500', diamond: 'text-blue-400' };
  const tierLabel: Record<string, string> = { bronze: '铜', silver: '银', gold: '金', diamond: '钻' };
  return (
    <div className="flex items-center gap-2.5 bg-muted/40 rounded-xl px-3 py-2.5 border border-border/50">
      <div className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
        <Award size={13} className={tierColor[a.tier]} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-foreground font-semibold truncate" style={{ fontSize: '0.75rem' }}>{a.name}</p>
          <span className={`flex-shrink-0 ${tierColor[a.tier]}`} style={{ fontSize: '0.5625rem' }}>{tierLabel[a.tier]}</span>
        </div>
        <p className="text-muted-foreground truncate" style={{ fontSize: '0.625rem' }}>{a.description}</p>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, badge, action }: {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-foreground">{icon}</span>
        <span className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>{title}</span>
        {badge}
      </div>
      {action}
    </div>
  );
}

export function DesktopDashboard({ onStartBattle, litProvinces, selectedCountry }: DesktopDashboardProps) {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const country = COUNTRIES.find(c => c.id === selectedCountry)!;
  const lit = litProvinces[selectedCountry] ?? [];
  const litSet = new Set(lit);
  const top3 = LEADERBOARD_GLOBAL.slice(0, 3);
  const restEntries = LEADERBOARD_GLOBAL.slice(3, 8);
  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.unlocked);
  const progressPct = country.provinces.length > 0
    ? Math.round((lit.length / country.provinces.length) * 100)
    : 0;

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-5 flex gap-4" style={{ minHeight: '100%' }}>

        {/* ── CENTER COLUMN: map + battle CTA + province grid ─ */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Hero / Battle CTA */}
          <div className="bg-primary rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 bg-primary-foreground/10 rounded-full px-3 py-1 mb-3">
                  <MapPin size={10} className="text-primary-foreground/60" />
                  <span className="text-primary-foreground/60" style={{ fontSize: '0.6875rem' }}>亚洲 · 中国</span>
                </div>
                <p className="text-primary-foreground font-bold mb-1.5" style={{ fontSize: '1.25rem', lineHeight: 1.25 }}>城市猜猜猜</p>
                <p className="text-primary-foreground/60 mb-5" style={{ fontSize: '0.8125rem' }}>
                  已探索 {lit.length}/{country.provinces.length} 个省份
                </p>
                <button
                  onClick={onStartBattle}
                  className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
                  style={{ fontSize: '0.9375rem' }}
                >
                  <Zap size={16} />
                  开始匹配
                </button>
              </div>
              <div className="flex-shrink-0 opacity-80" style={{ width: 130, height: 130 }}>
                <img src={chinaMapImg} alt="中国地图" className="w-full h-full object-contain" draggable={false} />
              </div>
            </div>
          </div>

          {/* Province Unlock Map */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Map size={14} className="text-foreground" />
                <span className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>解锁地图</span>
                <span className="text-muted-foreground" style={{ fontSize: '0.6875rem' }}>{country.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden" style={{ width: 80 }}>
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="text-foreground font-semibold flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                  {lit.length}/{country.provinces.length}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))' }}>
                {country.provinces.map(p => {
                  const isLit = litSet.has(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`rounded-lg py-2 px-1.5 text-center transition-all ${isLit ? 'bg-primary' : 'bg-muted/60 border border-border/50'}`}
                    >
                      <p className={`font-medium leading-tight ${isLit ? 'text-primary-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.6875rem' }}>
                        {p.name}
                      </p>
                      {isLit && <div className="w-1 h-1 rounded-full bg-primary-foreground/50 mx-auto mt-1" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: leaderboard + achievements ───────── */}
        <div className="flex-shrink-0 flex flex-col gap-4" style={{ width: 268 }}>

          {/* Leaderboard */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <SectionHeader
              icon={<Trophy size={14} />}
              title="全国排行榜"
              action={
                <button
                  onClick={() => setLeaderboardOpen(true)}
                  className="flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontSize: '0.6875rem' }}
                >
                  全部 <ChevronRight size={12} />
                </button>
              }
            />
            <div className="px-4 pt-3 pb-1">
              {/* Podium */}
              <div className="bg-muted/50 rounded-xl p-3 mb-3 flex items-end justify-center gap-3">
                <PodiumEntry entry={top3[1]} rank={2} />
                <PodiumEntry entry={top3[0]} rank={1} isFirst />
                <PodiumEntry entry={top3[2]} rank={3} />
              </div>
              {/* Ranks 4–8 */}
              <div className="space-y-1 pb-3">
                {restEntries.map(entry => (
                  <LeaderRow key={entry.rank} entry={entry} />
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <SectionHeader
              icon={<Award size={14} />}
              title="已获成就"
              badge={
                <span className="bg-primary text-primary-foreground rounded-full font-semibold px-1.5 py-0.5" style={{ fontSize: '0.5625rem' }}>
                  {unlockedAchievements.length}
                </span>
              }
            />
            <div className="p-3 space-y-2">
              {unlockedAchievements.map(a => (
                <AchievementBadge key={a.id} a={a} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ────────────────────────────────────────────── */}
      {leaderboardOpen && (
        <Modal title="全国排行榜" onClose={() => setLeaderboardOpen(false)}>
          <div className="space-y-1.5">
            {LEADERBOARD_GLOBAL.map(entry => (
              <LeaderRow key={entry.rank} entry={entry} />
            ))}
          </div>
        </Modal>
      )}

    </div>
  );
}
