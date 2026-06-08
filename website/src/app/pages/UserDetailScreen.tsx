import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface UserDetailScreenProps {
  userName: string;
  onBack: () => void;
}

interface BattleRecord {
  result: 'win' | 'lose';
  opponent: string;
  country: string;
  score: string;
  date: string;
}

const BATTLE_RECORDS: BattleRecord[] = [
  { result: 'win',  opponent: '地理小白',   country: '中国', score: '14:6',  date: '昨天' },
  { result: 'win',  opponent: '旅行者小明', country: '中国', score: '16:4',  date: '今天' },
  { result: 'lose', opponent: '地理王者',   country: '中国', score: '4:16',  date: '2天前' },
];

function NameAvatar({ name, size = 56, inverted = false }: { name: string; size?: number; inverted?: boolean }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
        inverted ? 'bg-primary-foreground text-primary' : 'bg-muted text-foreground'
      }`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name[0]}
    </div>
  );
}

export function UserDetailScreen({ userName, onBack }: UserDetailScreenProps) {
  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <ChevronLeft size={18} className="text-primary-foreground" />
        </button>
        <p className="text-foreground font-semibold" style={{ fontSize: '1.125rem' }}>
          {userName}
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 pb-6">
        {/* User card */}
        <div className="bg-primary rounded-2xl px-5 py-5 mb-4 flex items-center gap-4">
          <NameAvatar name={userName} size={56} inverted />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-primary-foreground font-bold truncate" style={{ fontSize: '1.125rem' }}>
                {userName}
              </p>
              <span
                className="bg-primary-foreground/20 text-primary-foreground rounded-full px-2 py-0.5 flex-shrink-0"
                style={{ fontSize: '0.6875rem' }}
              >
                探索者
              </span>
            </div>
            <p className="text-primary-foreground/70" style={{ fontSize: '0.8125rem' }}>
              浙江省
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: '积分', value: '3210' },
            { label: '胜率', value: '81%' },
            { label: '对战', value: '245' },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-2xl px-3 py-4 text-center border border-border">
              <p className="text-foreground font-bold mb-1" style={{ fontSize: '1.25rem' }}>
                {stat.value}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Recent battles */}
        <p className="text-foreground font-semibold mb-3" style={{ fontSize: '1rem' }}>
          最近对战
        </p>
        <div className="space-y-3 mb-6">
          {BATTLE_RECORDS.map((record, i) => (
            <div key={i} className="bg-card rounded-2xl px-4 py-3.5 border border-border flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 font-semibold flex-shrink-0 ${
                  record.result === 'win'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
                style={{ fontSize: '0.75rem' }}
              >
                {record.result === 'win' ? '胜' : '负'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-semibold truncate" style={{ fontSize: '0.9375rem' }}>
                  vs {record.opponent}
                </p>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  {record.country} · {record.date}
                </p>
              </div>
              <p className="text-foreground font-bold flex-shrink-0" style={{ fontSize: '1rem' }}>
                {record.score}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="bg-primary text-primary-foreground rounded-2xl w-full py-3.5 font-semibold"
          style={{ fontSize: '1rem' }}
        >
          发起对战
        </button>
      </div>
    </div>
  );
}
