import React from 'react';
import { ChevronLeft, ChevronRight, MapPin, Globe, Swords, Zap, Star, FileText, Shield } from 'lucide-react';

interface AboutScreenProps {
  onBack: () => void;
  onOpenServiceAgreement?: () => void;
  onOpenPrivacy?: () => void;
  onOpenRateUs?: () => void;
}

export function AboutScreen({ onBack, onOpenServiceAgreement, onOpenPrivacy, onOpenRateUs }: AboutScreenProps) {
  const features = [
    { icon: <Globe size={18} />, title: '全球地理题库', desc: '涵盖 100+ 国家城市知识，持续更新扩充' },
    { icon: <Swords size={18} />, title: '实时 PvP 对战', desc: '与全国玩家同步对战，积分匹配，公平竞技' },
    { icon: <Zap size={18} />, title: '解锁地图探索', desc: '胜利解锁省份，将世界点亮成你的足迹' },
    { icon: <Star size={18} />, title: '成就勋章系统', desc: '完成挑战获得专属成就，展示探索实力' },
  ];

  const legalItems = [
    { icon: <FileText size={16} />, label: '用户服务协议', onPress: onOpenServiceAgreement },
    { icon: <Shield size={16} />,   label: '隐私政策',     onPress: onOpenPrivacy },
    { icon: <Star size={16} />,     label: '给我们评分',   onPress: onOpenRateUs },
  ];

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
          <p className="text-foreground" style={{ fontSize: '1.125rem', fontWeight: 600 }}>关于应用</p>
          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>城市猜猜猜</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-28 space-y-4 overflow-auto">
        {/* Hero */}
        <div className="bg-primary rounded-2xl px-5 py-7 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/15 flex items-center justify-center mb-4">
            <MapPin size={40} className="text-primary-foreground" />
          </div>
          <p className="text-primary-foreground" style={{ fontSize: '1.625rem', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1.1 }}>
            城市猜猜猜
          </p>
          <p className="text-primary-foreground/60 mt-1.5" style={{ fontSize: '0.8125rem' }}>
            一城一世界，一战见真章
          </p>
          <div className="mt-3 bg-primary-foreground/10 rounded-full px-4 py-1.5">
            <span className="text-primary-foreground/80" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              版本 1.0.0 (Build 2026.05)
            </span>
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="text-muted-foreground mb-2 px-1" style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>核心功能</p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {features.map((f, i) => (
              <div key={f.title} className={`flex items-start gap-3.5 px-4 py-3.5 ${i < features.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center text-foreground flex-shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground" style={{ fontSize: '0.875rem', fontWeight: 600 }}>{f.title}</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team info */}
        <div>
          <p className="text-muted-foreground mb-2 px-1" style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>开发信息</p>
          <div className="bg-card rounded-2xl border border-border px-4 py-1">
            {[
              { label: '开发商', value: '城市猜猜猜工作室' },
              { label: '技术框架', value: 'React · Tailwind · PWA' },
              { label: '最后更新', value: '2026年05月31日' },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex justify-between items-center py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{row.label}</p>
                <p className="text-foreground" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal links */}
        <div>
          <p className="text-muted-foreground mb-2 px-1" style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>法律与反馈</p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {legalItems.map((item, i) => (
              <button
                key={item.label}
                onClick={item.onPress}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors text-left ${i < legalItems.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center text-foreground flex-shrink-0">
                  {item.icon}
                </div>
                <p className="flex-1 text-foreground" style={{ fontSize: '0.875rem' }}>{item.label}</p>
                <ChevronRight size={15} className="text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-muted-foreground" style={{ fontSize: '0.6875rem' }}>
          © 2026 城市猜猜猜工作室 · 保留所有权利
        </p>
      </div>
    </div>
  );
}
