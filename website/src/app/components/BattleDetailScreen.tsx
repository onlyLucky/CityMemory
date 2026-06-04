import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { QUESTIONS_CN } from './game-data';

interface BattleDetailScreenProps {
  onBack: () => void;
}

const QUESTION_RESULTS = [true, true, true, true, true, false, false];

export function BattleDetailScreen({ onBack }: BattleDetailScreenProps) {
  const questions = QUESTIONS_CN.slice(0, 7);

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
          对战详情
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 pb-6">
        {/* Result hero card */}
        <div className="bg-primary rounded-2xl px-5 py-6 mb-5">
          {/* Victory badge */}
          <div className="flex justify-center mb-3">
            <span
              className="bg-accent text-accent-foreground rounded-full px-4 py-1 font-bold"
              style={{ fontSize: '0.875rem' }}
            >
              胜利
            </span>
          </div>

          {/* Score */}
          <p
            className="text-primary-foreground font-bold text-center mb-2"
            style={{ fontSize: '2.5rem', letterSpacing: '0.05em' }}
          >
            14 : 6
          </p>

          {/* Opponent */}
          <p className="text-primary-foreground/80 text-center mb-1" style={{ fontSize: '0.9375rem' }}>
            vs 地图探索者
          </p>

          {/* Meta */}
          <div className="flex justify-center gap-4 mt-3">
            <span className="text-primary-foreground/60" style={{ fontSize: '0.8125rem' }}>
              今天 14:23
            </span>
            <span className="text-primary-foreground/60" style={{ fontSize: '0.8125rem' }}>
              · 中国
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: '答题正确率', value: '70%' },
            { label: '连续答对', value: '3' },
            { label: '获得积分', value: '+12' },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-2xl px-3 py-4 text-center border border-border">
              <p className="text-foreground font-bold mb-1" style={{ fontSize: '1.125rem' }}>
                {stat.value}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: '0.6875rem' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Question detail */}
        <p className="text-foreground font-semibold mb-3" style={{ fontSize: '1rem' }}>
          题目详情
        </p>
        <div className="space-y-2">
          {questions.map((q, i) => {
            const correct = QUESTION_RESULTS[i];
            return (
              <div key={q.id} className="bg-card rounded-2xl px-4 py-3.5 border border-border flex items-center gap-3">
                {/* Number circle */}
                <div
                  className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                    correct
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                  style={{ width: 28, height: 28, fontSize: '0.75rem' }}
                >
                  {i + 1}
                </div>

                {/* Question text */}
                <p
                  className="flex-1 text-foreground truncate"
                  style={{ fontSize: '0.875rem' }}
                >
                  {q.text}
                </p>

                {/* Result badge */}
                <span
                  className={`rounded-full px-2.5 py-0.5 font-semibold flex-shrink-0 ${
                    correct
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                  style={{ fontSize: '0.6875rem' }}
                >
                  {correct ? '正确' : '错误'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
