import React, { useState } from 'react';
import { ChevronLeft, MapPin, Star } from 'lucide-react';

interface RateUsScreenProps {
  onBack: () => void;
}

export function RateUsScreen({ onBack }: RateUsScreenProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center px-8">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-foreground text-center mb-2" style={{ fontSize: '1.375rem', fontWeight: 700 }}>评价已提交！</p>
        <p className="text-muted-foreground text-center mb-8" style={{ fontSize: '0.9375rem' }}>感谢您的宝贵意见，我们会持续改进</p>
        <button
          onClick={onBack}
          className="bg-primary text-primary-foreground rounded-2xl px-8 py-3.5"
          style={{ fontSize: '0.9375rem', fontWeight: 600 }}
        >
          返回
        </button>
      </div>
    );
  }

  const activeStars = hovered || selected;

  return (
    <div className="flex flex-col h-full bg-background overflow-auto">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <ChevronLeft size={18} className="text-primary-foreground" />
        </button>
        <div>
          <p className="text-foreground" style={{ fontSize: '1.125rem', fontWeight: 600 }}>给我们评分</p>
          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>您的反馈对我们非常重要</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 flex flex-col items-center">
        {/* App icon */}
        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mt-6 mb-6"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <MapPin size={44} className="text-primary-foreground" />
        </div>

        <p className="text-foreground text-center mb-2" style={{ fontSize: '1.375rem', fontWeight: 700 }}>感谢您的支持！</p>
        <p className="text-muted-foreground text-center mb-8" style={{ fontSize: '0.9375rem' }}>
          您的评价对我们非常重要，请为本应用打分
        </p>

        {/* Stars */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(n)}
              className="transition-transform active:scale-90"
              style={{ transform: n <= activeStars ? 'scale(1.15)' : 'scale(1)' }}
            >
              <Star
                size={40}
                className={n <= activeStars ? 'text-yellow-400' : 'text-muted'}
                fill={n <= activeStars ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>

        {/* Star label */}
        {selected > 0 && (
          <p className="text-foreground mb-6" style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
            {selected === 1 ? '非常不满意' : selected === 2 ? '不满意' : selected === 3 ? '一般' : selected === 4 ? '满意' : '非常满意！'}
          </p>
        )}

        {/* Comment box — shown after rating */}
        {selected > 0 && (
          <div className="w-full mb-6">
            <p className="text-foreground mb-2" style={{ fontSize: '0.875rem', fontWeight: 500 }}>告诉我们更多（可选）</p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="您的建议或反馈…"
              rows={4}
              className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none resize-none border border-border focus:border-primary transition-colors"
              style={{ fontSize: '0.875rem' }}
            />
          </div>
        )}

        {/* Submit */}
        {selected > 0 && (
          <button
            onClick={() => setSubmitted(true)}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 mb-8"
            style={{ fontSize: '0.9375rem', fontWeight: 600 }}
          >
            提交评价
          </button>
        )}
      </div>
    </div>
  );
}
