import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { ChevronRight, Moon, Sun, Globe, Bell, Shield, Trash2, LogOut, Info, ChevronLeft, Check, X } from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  onOpenAbout?: () => void;
  onOpenPrivacy?: () => void;
}

const LANGUAGES = [
  { code: 'zh-CN', label: '简体中文', region: '中国大陆' },
  { code: 'zh-TW', label: '繁體中文', region: '台湾 / 香港' },
  { code: 'en',    label: 'English',  region: 'English' },
  { code: 'ja',    label: '日本語',   region: 'Japanese' },
  { code: 'ko',    label: '한국어',   region: 'Korean' },
];

function LangModal({ current, onSelect, onClose }: { current: string; onSelect: (c: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-t-2xl md:rounded-2xl w-full md:max-w-sm border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-foreground" style={{ fontSize: '1rem', fontWeight: 600 }}>选择语言</p>
          <button onClick={onClose} className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
            <X size={14} className="text-foreground" />
          </button>
        </div>
        {LANGUAGES.map((lang, i) => {
          const active = lang.code === current;
          return (
            <button
              key={lang.code}
              onClick={() => { onSelect(lang.code); onClose(); }}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-accent transition-colors ${i < LANGUAGES.length - 1 ? 'border-b border-border' : ''} ${active ? 'bg-primary/5' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <p className={active ? 'text-primary' : 'text-foreground'} style={{ fontSize: '0.9375rem', fontWeight: active ? 600 : 400 }}>{lang.label}</p>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{lang.region}</p>
              </div>
              {active && <Check size={16} className="text-primary flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SettingsScreen({ onBack, onOpenAbout, onOpenPrivacy }: SettingsScreenProps) {
  const { isDark, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('zh-CN');
  const [reminderOn, setReminderOn] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);

  const langLabel = LANGUAGES.find(l => l.code === lang)?.label ?? '简体中文';

  const sections = [
    {
      title: '通知',
      items: [
        { icon: <Bell size={15} />, label: '每日提醒', sub: '每天 9:00 提醒对战', type: 'toggle' as const, value: reminderOn, onToggle: () => setReminderOn(v => !v) },
      ],
    },
    {
      title: '外观',
      items: [
        { icon: isDark ? <Moon size={15} /> : <Sun size={15} />, label: '深色模式', sub: isDark ? '护眼夜间模式' : '明亮日间模式', type: 'toggle' as const, value: isDark, onToggle: toggleTheme },
      ],
    },
    {
      title: '语言与地区',
      items: [
        { icon: <Globe size={15} />, label: '语言', sub: langLabel, type: 'nav' as const, onPress: () => setLangOpen(true) },
      ],
    },
    {
      title: '隐私与数据',
      items: [
        { icon: <Shield size={15} />, label: '隐私政策', sub: '了解数据收集与使用方式', type: 'nav' as const, onPress: onOpenPrivacy },
        { icon: <Trash2 size={15} />, label: cacheCleared ? '缓存已清除' : '清除缓存', sub: cacheCleared ? '清除完成' : '24.6 MB', type: 'nav' as const, onPress: () => setCacheCleared(true) },
      ],
    },
    {
      title: '账号',
      items: [
        { icon: <Info size={15} />, label: '关于城市猜猜猜', sub: '版本 1.0.0', type: 'nav' as const, onPress: onOpenAbout },
        { icon: <LogOut size={15} />, label: '退出登录', type: 'nav' as const, danger: true },
      ],
    },
  ];

  return (
    <>
      <div className="flex flex-col h-full bg-background overflow-auto">
        {/* Header */}
        <div className="px-4 pt-5 pb-4 flex items-center gap-3 flex-shrink-0">
          <button onClick={onBack} className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <ChevronLeft size={18} className="text-primary-foreground" />
          </button>
          <div>
            <p className="text-foreground" style={{ fontSize: '1.125rem', fontWeight: 600 }}>设置</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>偏好与账号管理</p>
          </div>
        </div>

        {/* Sections */}
        <div className="px-4 pb-28 space-y-5">
          {sections.map(section => (
            <div key={section.title}>
              <p className="text-muted-foreground mb-2 px-1" style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {section.title}
              </p>
              <div className="bg-card rounded-2xl overflow-hidden border border-border">
                {section.items.map((item, idx) => (
                  <div
                    key={item.label}
                    onClick={'onPress' in item && item.onPress ? item.onPress : undefined}
                    className={`flex items-center gap-3 px-4 py-3.5
                      ${idx < section.items.length - 1 ? 'border-b border-border' : ''}
                      ${'onPress' in item && item.onPress ? 'cursor-pointer hover:bg-accent transition-colors' : ''}
                    `}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${'danger' in item && item.danger ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground'}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${'danger' in item && item.danger ? 'text-destructive' : 'text-foreground'}`} style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</p>
                      {'sub' in item && item.sub && (
                        <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{item.sub}</p>
                      )}
                    </div>
                    {item.type === 'toggle' ? (
                      <button
                        onClick={e => { e.stopPropagation(); if ('onToggle' in item && item.onToggle) item.onToggle(); }}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${'value' in item && item.value ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-transform shadow-sm ${'value' in item && item.value ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    ) : (
                      <ChevronRight size={15} className="text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="text-center text-muted-foreground py-2" style={{ fontSize: '0.6875rem' }}>
            城市猜猜猜 v1.0.0 · 一城一世界，一战见真章
          </p>
        </div>
      </div>

      {langOpen && <LangModal current={lang} onSelect={setLang} onClose={() => setLangOpen(false)} />}
    </>
  );
}
