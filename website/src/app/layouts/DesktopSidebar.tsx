import { User, Map, Sun, Moon, Bell, Megaphone, Users, ChevronRight, Swords, Target, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../components/ThemeProvider';
import { useApp } from '../contexts/AppContext';

export function DesktopSidebar() {
  const { isDark, toggleTheme } = useTheme();
  const { userName, userScore, unreadMsgs, messages, setScreen } = useApp();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0 overflow-hidden">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Map size={17} className="text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sidebar-foreground font-semibold leading-tight truncate" style={{ fontSize: '0.8125rem' }}>城市猜猜猜</p>
            <p className="text-muted-foreground truncate" style={{ fontSize: '0.6875rem' }}>地理知识对战</p>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* User Profile */}
        <div className="mx-3 mt-3 rounded-xl overflow-hidden border border-sidebar-border">
          <div className="bg-primary px-3 py-3">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 border-2 border-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                <User size={17} className="text-primary-foreground/70" />
              </div>
              <div className="min-w-0">
                <p className="text-primary-foreground/50" style={{ fontSize: '0.5625rem' }}>城市猜猜猜 · 探索者</p>
                <p className="text-primary-foreground font-semibold truncate" style={{ fontSize: '0.9375rem' }}>{userName}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '积分', value: String(userScore) },
                { label: '胜率', value: '62%' },
                { label: '对战', value: '45' },
              ].map(s => (
                <div key={s.label} className="bg-primary-foreground/10 rounded-lg py-2 px-1 text-center">
                  <p className="text-primary-foreground font-bold" style={{ fontSize: '0.875rem' }}>{s.value}</p>
                  <p className="text-primary-foreground/50" style={{ fontSize: '0.5rem' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Weekly checkin */}
          <div className="bg-sidebar-accent px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-muted-foreground" style={{ fontSize: '0.5625rem' }}>本周打卡</span>
              <span className="text-sidebar-foreground font-semibold" style={{ fontSize: '0.5625rem' }}>连续 12 天</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['日','一','二','三','四','五','六'].map((d, i) => {
                const checked = [true,true,true,true,false,true,true][i];
                return (
                  <div key={d} className="flex flex-col items-center gap-0.5">
                    <span className="text-muted-foreground" style={{ fontSize: '0.4375rem' }}>{d}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${checked ? 'bg-primary' : 'bg-muted'}`}>
                      {checked && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="mx-3 mt-3 rounded-xl border border-sidebar-border overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <Bell size={13} className="text-sidebar-foreground" />
              <span className="text-sidebar-foreground font-semibold" style={{ fontSize: '0.75rem' }}>消息通知</span>
              {unreadMsgs > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full font-semibold px-1.5 py-0.5" style={{ fontSize: '0.5rem' }}>{unreadMsgs}</span>
              )}
            </div>
            <ChevronRight size={12} className="text-muted-foreground" />
          </div>
          <div className="py-1">
            {messages.slice(0, 3).map(msg => {
              const typeIcon =
                msg.type === 'official' ? <Megaphone size={11} className="text-sidebar-foreground" /> :
                msg.type === 'friend'   ? <Users size={11} className="text-sidebar-foreground" /> :
                <Bell size={11} className="text-muted-foreground" />;
              return (
                <div key={msg.id} className="flex items-start gap-2 px-3 py-2 hover:bg-sidebar-accent transition-colors">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 relative mt-0.5">
                    {typeIcon}
                    {!msg.read && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full border border-sidebar" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`truncate ${!msg.read ? 'text-sidebar-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.6875rem', fontWeight: !msg.read ? 600 : 400 }}>{msg.title}</p>
                    <p className="text-muted-foreground truncate" style={{ fontSize: '0.5625rem' }}>{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="mx-3 mt-3 mb-3 rounded-xl border border-sidebar-border p-3">
          <p className="text-muted-foreground mb-2.5" style={{ fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>本周数据</p>
          <div className="space-y-2">
            {[
              { icon: <Swords size={11} />, label: '对战次数', value: '8 场' },
              { icon: <Target size={11} />, label: '正确率',   value: '72%' },
              { icon: <Calendar size={11} />, label: '连续打卡', value: '12 天' },
              { icon: <TrendingUp size={11} />, label: '本周积分', value: '+64' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-muted-foreground flex-shrink-0">{s.icon}</span>
                <span className="text-muted-foreground flex-1 truncate" style={{ fontSize: '0.6875rem' }}>{s.label}</span>
                <span className="text-sidebar-foreground font-semibold" style={{ fontSize: '0.6875rem' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: theme toggle */}
      <div className="px-3 pb-4 pt-2 border-t border-sidebar-border flex-shrink-0">
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
          <span className="font-medium" style={{ fontSize: '0.8125rem' }}>{isDark ? '切换亮色' : '切换暗色'}</span>
        </motion.button>
      </div>
    </aside>
  );
}
