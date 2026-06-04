import React, { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';

interface FriendsScreenProps {
  onBack: () => void;
  onViewUser: (name: string) => void;
}

interface Friend {
  name: string;
  province: string;
  wins: number;
  total: number;
}

const FRIENDS: Friend[] = [
  { name: '知行合一', province: '浙江', wins: 165, total: 220 },
  { name: '城市漫游者', province: '上海', wins: 198, total: 245 },
  { name: '地图探索者', province: '黑龙江', wins: 119, total: 167 },
  { name: '旅行者小明', province: '四川', wins: 45, total: 78 },
  { name: '地理小白', province: '安徽', wins: 54, total: 89 },
];

const PENDING = { name: '山河无限', province: '广东' };

function NameAvatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div
      className="bg-muted rounded-full flex items-center justify-center flex-shrink-0 text-foreground font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name[0]}
    </div>
  );
}

export function FriendsScreen({ onBack, onViewUser }: FriendsScreenProps) {
  const [query, setQuery] = useState('');

  const filtered = FRIENDS.filter(f =>
    f.name.includes(query) || f.province.includes(query)
  );

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={onBack}
            className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <ChevronLeft size={18} className="text-primary-foreground" />
          </button>
          <div>
            <p className="text-foreground font-semibold" style={{ fontSize: '1.125rem' }}>我的好友</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>管理好友列表</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
          <Search size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索好友"
            className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            style={{ fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 pb-6">
        {/* Friends list */}
        <p className="text-muted-foreground font-semibold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          好友列表 ({filtered.length})
        </p>
        <div className="space-y-2 mb-6">
          {filtered.map(friend => {
            const winRate = Math.round((friend.wins / friend.total) * 100);
            return (
              <button
                key={friend.name}
                onClick={() => onViewUser(friend.name)}
                className="w-full flex items-center gap-3 bg-card rounded-2xl px-4 py-3 border border-border hover:bg-accent transition-colors text-left"
              >
                <NameAvatar name={friend.name} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold truncate" style={{ fontSize: '0.9375rem' }}>
                    {friend.name}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                    {friend.province} · 胜率 {winRate}%
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); }}
                  className="bg-primary text-primary-foreground rounded-full px-3 py-1 font-semibold flex-shrink-0"
                  style={{ fontSize: '0.75rem' }}
                >
                  对战
                </button>
              </button>
            );
          })}
        </div>

        {/* Pending */}
        <p className="text-muted-foreground font-semibold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          待处理 (1)
        </p>
        <div className="bg-card rounded-2xl px-4 py-3 border border-border">
          <div className="flex items-center gap-3">
            <NameAvatar name={PENDING.name} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-semibold truncate" style={{ fontSize: '0.9375rem' }}>
                {PENDING.name}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                {PENDING.province} · 请求添加好友
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-primary text-primary-foreground rounded-full px-3 py-1 font-semibold"
                style={{ fontSize: '0.75rem' }}
              >
                接受
              </button>
              <button
                className="bg-muted text-muted-foreground rounded-full px-3 py-1 font-semibold"
                style={{ fontSize: '0.75rem' }}
              >
                拒绝
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
