import React, { useState } from 'react';
import { ChevronRight, Star, Calendar, Book, Target, Award, User, Swords, Trophy, Zap, Globe, Settings, Users } from 'lucide-react';
import { ACHIEVEMENTS, BATTLE_HISTORY, type Achievement, type BattleRecord } from './game-data';

const DAYS = ['日', '一', '二', '三', '四', '五', '六'];

interface ProfileScreenProps {
  userName: string;
  userScore: number;
  onOpenSettings: () => void;
  onOpenFriends?: () => void;
  onEditProfile?: () => void;
  onViewBattleDetail?: () => void;
  onOpenAchievements?: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  '对战次数': <Swords size={16} />,
  '积分数': <Trophy size={16} />,
  '打卡次数': <Calendar size={16} />,
  '连续打卡': <Zap size={16} />,
  '国家探索': <Globe size={16} />,
};

export function ProfileScreen({ userName, userScore, onOpenSettings, onOpenFriends, onEditProfile, onViewBattleDetail, onOpenAchievements }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'history'>('stats');

  const wins = 28;
  const total = 45;
  const winRate = Math.round((wins / total) * 100);
  const correctRate = 72;
  const streak = 12;
  const weekCheckins = [true, true, true, true, false, true, true];

  return (
    <div className="flex flex-col h-full bg-background overflow-auto">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-foreground">我的</h1>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>个人中心</p>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-2 bg-card rounded-full border border-border"
        >
          <Settings size={16} className="text-foreground" />
        </button>
      </div>

      {/* User card */}
      <div className="px-4 pb-4">
        <div className="bg-primary rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/10 border-2 border-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-primary-foreground/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-primary-foreground/60" style={{ fontSize: '0.75rem' }}>城市猜猜猜 · 探索者</p>
              <p className="text-primary-foreground font-semibold" style={{ fontSize: '1.125rem', lineHeight: 1.3 }}>{userName}</p>
              <p className="text-primary-foreground/50 mt-0.5" style={{ fontSize: '0.75rem' }}>每天学一点，世界大一点</p>
            </div>
            <button onClick={onEditProfile} className="bg-primary-foreground/10 text-primary-foreground rounded-full flex items-center gap-1 flex-shrink-0" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              编辑
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '连续打卡', value: `${streak}`, unit: '天' },
              { label: '累计打卡', value: '45', unit: '天' },
              { label: '累计积分', value: String(userScore), unit: '分' },
            ].map(item => (
              <div key={item.label} className="bg-primary-foreground/10 rounded-xl py-3 px-2 text-center">
                <p className="text-primary-foreground/50" style={{ fontSize: '0.625rem' }}>{item.label}</p>
                <p className="text-primary-foreground font-bold" style={{ fontSize: '1.125rem', lineHeight: 1.2 }}>{item.value}</p>
                <p className="text-primary-foreground/50" style={{ fontSize: '0.625rem' }}>{item.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Friends quick entry */}
      {onOpenFriends && (
        <div className="px-4 pb-4">
          <button
            onClick={onOpenFriends}
            className="w-full bg-card rounded-2xl px-4 py-3.5 border border-border flex items-center gap-3 hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-foreground flex-shrink-0">
              <Users size={15} />
            </div>
            <span className="flex-1 text-left text-foreground" style={{ fontSize: '0.875rem' }}>我的好友</span>
            <ChevronRight size={15} className="text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Weekly check-in */}
      <div className="px-4 pb-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>本周打卡</p>
            <button className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              查看全部 <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <span className="text-muted-foreground" style={{ fontSize: '0.625rem' }}>{d}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${weekCheckins[i] ? 'bg-primary' : 'bg-muted'}`}>
                  {weekCheckins[i] && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-2 flex-1 flex-wrap">
            {(['stats', 'achievements', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground border border-border hover:bg-accent'
                }`}
                style={{ fontSize: '0.8125rem' }}
              >
                {tab === 'stats' ? '数据统计' : tab === 'achievements' ? '成就' : '对战记录'}
              </button>
            ))}
          </div>
          {activeTab === 'achievements' && onOpenAchievements && (
            <button onClick={onOpenAchievements} className="flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" style={{ fontSize: '0.75rem' }}>
              全部 <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 pb-24">
        {activeTab === 'stats' && <StatsPanel wins={wins} total={total} winRate={winRate} correctRate={correctRate} maxStreak={8} />}
        {activeTab === 'achievements' && <AchievementsPanel achievements={ACHIEVEMENTS} />}
        {activeTab === 'history' && <HistoryPanel records={BATTLE_HISTORY} onViewDetail={onViewBattleDetail} />}
      </div>
    </div>
  );
}

function StatsPanel({ wins, total, winRate, correctRate, maxStreak }: {
  wins: number; total: number; winRate: number; correctRate: number; maxStreak: number;
}) {
  const stats = [
    { icon: <Target size={15} />, label: '总对战次数', value: `${total}场` },
    { icon: <Star size={15} />, label: '胜利次数', value: `${wins}场 (${winRate}%)` },
    { icon: <Award size={15} />, label: '最高连胜', value: `${maxStreak}场` },
    { icon: <Book size={15} />, label: '答题正确率', value: `${correctRate}%` },
  ];

  return (
    <div className="space-y-2">
      {stats.map(s => (
        <div key={s.label} className="bg-card rounded-xl px-4 py-3.5 flex items-center gap-3 border border-border">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-foreground flex-shrink-0">
            {s.icon}
          </div>
          <span className="flex-1 text-muted-foreground" style={{ fontSize: '0.875rem' }}>{s.label}</span>
          <span className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

function AchievementsPanel({ achievements }: { achievements: Achievement[] }) {
  const tierColors: Record<string, string> = {
    bronze: 'text-amber-600',
    silver: 'text-muted-foreground',
    gold: 'text-yellow-500',
    diamond: 'text-blue-400',
  };
  const tierBg: Record<string, string> = {
    bronze: 'bg-amber-50',
    silver: 'bg-muted',
    gold: 'bg-yellow-50',
    diamond: 'bg-blue-50',
  };
  const tierLabel: Record<string, string> = { bronze: '铜', silver: '银', gold: '金', diamond: '钻石' };

  const categories = [...new Set(achievements.map(a => a.category))];

  return (
    <div className="space-y-4">
      {categories.map(cat => (
        <div key={cat}>
          <p className="text-muted-foreground mb-2" style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{cat}</p>
          <div className="space-y-2">
            {achievements.filter(a => a.category === cat).map(a => (
              <div
                key={a.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-border ${a.unlocked ? 'bg-card' : 'bg-muted opacity-70'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${a.unlocked ? `${tierBg[a.tier]} ${tierColors[a.tier]}` : 'bg-muted text-muted-foreground'}`}>
                  {CATEGORY_ICONS[a.category] ?? <Star size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-semibold ${a.unlocked ? 'text-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.875rem' }}>{a.name}</p>
                    <span className={`${tierColors[a.tier]}`} style={{ fontSize: '0.75rem' }}>{tierLabel[a.tier]}</span>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{a.description}</p>
                  {!a.unlocked && a.progress !== undefined && a.target !== undefined && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-border rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (a.progress / a.target) * 100)}%` }} />
                      </div>
                      <span className="text-muted-foreground" style={{ fontSize: '0.625rem' }}>{a.progress}/{a.target}</span>
                    </div>
                  )}
                </div>
                {a.unlocked && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryPanel({ records, onViewDetail }: { records: BattleRecord[]; onViewDetail?: () => void }) {
  return (
    <div className="space-y-2">
      {records.map(r => (
        <div
          key={r.id}
          className={`bg-card rounded-xl px-4 py-3.5 border border-border ${onViewDetail ? 'cursor-pointer hover:bg-accent transition-colors' : ''}`}
          onClick={onViewDetail}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
              r.result === 'win' ? 'bg-green-100 text-green-600' : r.result === 'draw' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-500'
            }`} style={{ fontSize: '0.75rem' }}>
              {r.result === 'win' ? '胜' : r.result === 'draw' ? '平' : '负'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User size={9} className="text-muted-foreground" />
                </div>
                <p className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>{r.opponent}</p>
                <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>· {r.country}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{r.date}</span>
                <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>比分 {r.myScore}:{r.oppScore}</span>
              </div>
            </div>
            <span className={`font-bold flex-shrink-0 ${r.scoreChange >= 0 ? 'text-green-500' : 'text-red-500'}`} style={{ fontSize: '0.875rem' }}>
              {r.scoreChange >= 0 ? '+' : ''}{r.scoreChange}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
