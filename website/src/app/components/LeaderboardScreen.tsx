import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, Globe } from 'lucide-react';
import { LEADERBOARD_GLOBAL, type LeaderboardEntry } from './game-data';

const WEEKLY: LeaderboardEntry[] = [
  { rank: 1, name: '城市漫游者', score: 280, wins: 18, total: 23, avatar: '', province: '上海' },
  { rank: 2, name: '地理王者', score: 220, wins: 15, total: 19, avatar: '', province: '北京' },
  { rank: 3, name: '你的昵称', score: 180, wins: 12, total: 16, avatar: '', province: '浙江', isCurrentUser: true },
  { rank: 4, name: '知行合一', score: 150, wins: 10, total: 14, avatar: '', province: '浙江' },
  { rank: 5, name: '山河无限', score: 130, wins: 9, total: 13, avatar: '', province: '广东' },
];

const FRIENDS: LeaderboardEntry[] = [
  { rank: 1, name: '知行合一', score: 2756, wins: 165, total: 220, avatar: '', province: '浙江' },
  { rank: 2, name: '城市漫游者', score: 3210, wins: 198, total: 245, avatar: '', province: '上海' },
  { rank: 3, name: '你的昵称', score: 1280, wins: 28, total: 45, avatar: '', province: '浙江', isCurrentUser: true },
  { rank: 4, name: '地图探索者', score: 1987, wins: 119, total: 167, avatar: '', province: '黑龙江' },
  { rank: 5, name: '旅行者小明', score: 980, wins: 45, total: 78, avatar: '', province: '四川' },
];

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

type TabId = 'global' | 'friends' | 'weekly';

interface LeaderboardScreenProps {
  onViewUser?: (name: string) => void;
}

export function LeaderboardScreen({ onViewUser }: LeaderboardScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>('global');

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'global', label: '全国榜', icon: <Globe size={13} /> },
    { id: 'friends', label: '好友榜', icon: <Users size={13} /> },
    { id: 'weekly', label: '周榜', icon: <TrendingUp size={13} /> },
  ];

  const data = activeTab === 'global' ? LEADERBOARD_GLOBAL : activeTab === 'friends' ? FRIENDS : WEEKLY;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="flex flex-col h-full bg-background overflow-auto">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-foreground">排行榜</h1>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>地理达人竞技榜单</p>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground'
              }`}
              style={{ fontSize: '0.8125rem' }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      {top3.length >= 3 && (
        <div className="px-4 pb-4">
          <div className="bg-primary rounded-2xl p-5">
            <div className="flex items-end justify-center gap-3">
              {/* 2nd */}
              <div className="flex flex-col items-center">
                <NameAvatar name={top3[1].name} size={36} inverted />
                <p className="text-primary-foreground font-medium text-center mt-1 mb-1 truncate w-16" style={{ fontSize: '0.75rem' }}>{top3[1].name}</p>
                <div className="bg-primary-foreground/10 rounded-t-xl w-16 h-14 flex flex-col items-center justify-center">
                  <span className="text-primary-foreground/70 font-bold" style={{ fontSize: '1.125rem' }}>2</span>
                  <span className="text-primary-foreground/50" style={{ fontSize: '0.625rem' }}>{top3[1].score}</span>
                </div>
              </div>
              {/* 1st */}
              <div className="flex flex-col items-center">
                <Trophy size={18} className="text-yellow-400 mb-0.5" />
                <NameAvatar name={top3[0].name} size={44} inverted />
                <p className="text-primary-foreground font-semibold text-center mt-1 mb-1 truncate" style={{ fontSize: '0.75rem', width: 72 }}>{top3[0].name}</p>
                <div className="bg-primary-foreground rounded-t-xl h-20 flex flex-col items-center justify-center" style={{ width: 72 }}>
                  <span className="text-primary font-bold" style={{ fontSize: '1.5rem' }}>1</span>
                  <span className="text-primary font-semibold" style={{ fontSize: '0.625rem' }}>{top3[0].score}</span>
                </div>
              </div>
              {/* 3rd */}
              <div className="flex flex-col items-center">
                <NameAvatar name={top3[2].name} size={36} inverted />
                <p className="text-primary-foreground font-medium text-center mt-1 mb-1 truncate w-16" style={{ fontSize: '0.75rem' }}>{top3[2].name}</p>
                <div className="bg-primary-foreground/10 rounded-t-xl w-16 h-10 flex flex-col items-center justify-center">
                  <span className="text-primary-foreground/70 font-bold" style={{ fontSize: '1.125rem' }}>3</span>
                  <span className="text-primary-foreground/50" style={{ fontSize: '0.625rem' }}>{top3[2].score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="px-4 pb-24 space-y-2">
        {rest.map(entry => (
          <LeaderboardRow key={entry.rank} entry={entry} onViewUser={onViewUser} />
        ))}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, onViewUser }: { entry: LeaderboardEntry; onViewUser?: (name: string) => void }) {
  const winRate = entry.total > 0 ? Math.round((entry.wins / entry.total) * 100) : 0;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        entry.isCurrentUser ? 'bg-primary border-primary' : 'bg-card border-border hover:bg-accent'
      } ${!entry.isCurrentUser && onViewUser ? 'cursor-pointer' : ''}`}
      onClick={() => { if (!entry.isCurrentUser && onViewUser) onViewUser(entry.name); }}
    >
      <span className={`w-5 text-center font-bold ${entry.isCurrentUser ? 'text-primary-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.875rem' }}>
        {entry.rank}
      </span>
      <NameAvatar name={entry.name} size={32} inverted={entry.isCurrentUser} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${entry.isCurrentUser ? 'text-primary-foreground' : 'text-foreground'}`} style={{ fontSize: '0.875rem' }}>
          {entry.name} {entry.isCurrentUser && '(我)'}
        </p>
        <p className={entry.isCurrentUser ? 'text-primary-foreground/60' : 'text-muted-foreground'} style={{ fontSize: '0.75rem' }}>
          {entry.province} · 胜率 {winRate}%
        </p>
      </div>
      <div className="text-right">
        <p className={`font-bold ${entry.isCurrentUser ? 'text-primary-foreground' : 'text-foreground'}`} style={{ fontSize: '0.875rem' }}>
          {entry.score}
        </p>
        <p className={entry.isCurrentUser ? 'text-primary-foreground/60' : 'text-muted-foreground'} style={{ fontSize: '0.75rem' }}>
          积分
        </p>
      </div>
    </div>
  );
}
