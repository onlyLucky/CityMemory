import React, { useState, useEffect } from 'react';
import { Home, Trophy, Mail, User, Map, Sun, Moon, Bell, Megaphone, Users, ChevronRight, Swords, Target, Calendar, TrendingUp } from 'lucide-react';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { HomeScreen } from './components/HomeScreen';
import { BattleFlow } from './components/BattleFlow';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DesktopDashboard } from './components/DesktopDashboard';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { UserDetailScreen } from './components/UserDetailScreen';
import { EditProfileScreen } from './components/EditProfileScreen';
import { BattleDetailScreen } from './components/BattleDetailScreen';
import { AboutScreen } from './components/AboutScreen';
import { ServiceAgreementScreen } from './components/ServiceAgreementScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { RateUsScreen } from './components/RateUsScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { MOCK_MESSAGES, type Message } from './components/game-data';

type AppPhase = 'splash' | 'auth' | 'main';
type Screen = 'home' | 'leaderboard' | 'messages' | 'profile' | 'settings'
  | 'friends' | 'userDetail' | 'editProfile' | 'battleDetail'
  | 'about' | 'serviceAgreement' | 'privacyPolicy' | 'rateUs' | 'achievements';

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const [phase, setPhase] = useState<AppPhase>('splash');
  const [screen, setScreen] = useState<Screen>('home');
  const [battleActive, setBattleActive] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('cn');
  const [userScore, setUserScore] = useState(1280);
  const [userName, setUserName] = useState('你的昵称');
  const [litProvinces, setLitProvinces] = useState<Record<string, string[]>>({
    cn: ['bj', 'sh', 'gd', 'zj', 'js', 'sd', 'sc', 'hn', 'hb', 'ah', 'he', 'sx'],
  });
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [viewingUser, setViewingUser] = useState<string>('');

  const unreadMsgs = messages.filter(m => !m.read).length;

  const handleBattleFinish = (won: boolean, litProvince: string | null) => {
    const change = won ? 12 : -8;
    setUserScore(s => Math.max(100, s + change));
    if (won && litProvince) {
      setLitProvinces(prev => {
        const current = prev[selectedCountry] ?? [];
        if (current.includes(litProvince)) return prev;
        return { ...prev, [selectedCountry]: [...current, litProvince] };
      });
    }
    setBattleActive(false);
    setScreen('home');
  };

  const navItems: Array<{ id: Screen; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'home',        label: '首页', icon: <Home size={19} /> },
    { id: 'leaderboard', label: '排行', icon: <Trophy size={19} /> },
    { id: 'messages',    label: '消息', icon: <Mail size={19} />, badge: unreadMsgs },
    { id: 'profile',     label: '我的', icon: <User size={19} /> },
  ];

  // Splash
  if (phase === 'splash') {
    return <SplashScreen onDone={() => setPhase('auth')} />;
  }

  // Auth
  if (phase === 'auth') {
    return (
      <AuthScreen
        onAuth={(name) => {
          setUserName(name);
          setPhase('main');
        }}
      />
    );
  }

  // Battle overlay
  if (battleActive) {
    return (
      <div className="w-full h-full">
        <BattleFlow
          selectedCountry={selectedCountry}
          onFinish={handleBattleFinish}
          onCancel={() => setBattleActive(false)}
        />
      </div>
    );
  }

  const handleViewUser = (name: string) => {
    setViewingUser(name);
    setScreen('userDetail');
  };

  const mobileContent = (
    <>
      {screen === 'home' && (
        <HomeScreen
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          litProvinces={litProvinces}
          onStartBattle={() => setBattleActive(true)}
          userScore={userScore}
        />
      )}
      {screen === 'leaderboard' && (
        <LeaderboardScreen onViewUser={handleViewUser} />
      )}
      {screen === 'messages' && <MessagesScreen />}
      {screen === 'profile' && (
        <ProfileScreen
          userName={userName}
          userScore={userScore}
          onOpenSettings={() => setScreen('settings')}
          onOpenFriends={() => setScreen('friends')}
          onEditProfile={() => setScreen('editProfile')}
          onViewBattleDetail={() => setScreen('battleDetail')}
          onOpenAchievements={() => setScreen('achievements')}
        />
      )}
      {screen === 'settings' && (
        <SettingsScreen
          onBack={() => setScreen('profile')}
          onOpenAbout={() => setScreen('about')}
          onOpenPrivacy={() => setScreen('privacyPolicy')}
        />
      )}
      {screen === 'about' && (
        <AboutScreen
          onBack={() => setScreen('settings')}
          onOpenServiceAgreement={() => setScreen('serviceAgreement')}
          onOpenPrivacy={() => setScreen('privacyPolicy')}
          onOpenRateUs={() => setScreen('rateUs')}
        />
      )}
      {screen === 'serviceAgreement' && <ServiceAgreementScreen onBack={() => setScreen('about')} />}
      {screen === 'privacyPolicy' && <PrivacyPolicyScreen onBack={() => setScreen('about')} />}
      {screen === 'rateUs' && <RateUsScreen onBack={() => setScreen('about')} />}
      {screen === 'achievements' && <AchievementsScreen onBack={() => setScreen('profile')} />}
      {screen === 'friends' && (
        <FriendsScreen
          onBack={() => setScreen('profile')}
          onViewUser={handleViewUser}
        />
      )}
      {screen === 'userDetail' && (
        <UserDetailScreen
          userName={viewingUser}
          onBack={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'editProfile' && (
        <EditProfileScreen
          userName={userName}
          onBack={() => setScreen('profile')}
          onSave={(name) => {
            setUserName(name);
            setScreen('profile');
          }}
        />
      )}
      {screen === 'battleDetail' && (
        <BattleDetailScreen onBack={() => setScreen('profile')} />
      )}
    </>
  );

  const mainNavScreens: Screen[] = ['home', 'leaderboard', 'messages', 'profile'];
  const activeNavScreen = mainNavScreens.includes(screen) ? screen : ('profile' as Screen);

  return (
    <AppShell
      navItems={navItems}
      activeScreen={activeNavScreen}
      onNavigate={(s) => setScreen(s)}
      isDark={isDark}
      onToggleTheme={toggleTheme}
      userScore={userScore}
      userName={userName}
      messages={messages}
      desktopDashboard={
        <DesktopDashboard
          onStartBattle={() => setBattleActive(true)}
          litProvinces={litProvinces}
          selectedCountry={selectedCountry}
        />
      }
    >
      {mobileContent}
    </AppShell>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  desktopDashboard: React.ReactNode;
  navItems: Array<{ id: Screen; label: string; icon: React.ReactNode; badge?: number }>;
  activeScreen: Screen;
  onNavigate: (s: Screen) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  userScore: number;
  userName: string;
  messages: Message[];
}

function AppShell({ children, desktopDashboard, navItems, activeScreen, onNavigate, isDark, onToggleTheme, userScore, userName, messages }: AppShellProps) {
  const unreadBadge = navItems.find(n => n.id === 'messages')?.badge ?? 0;

  return (
    <div className="flex h-full w-full bg-background">

      {/* ── Desktop sidebar ─────────────────────────────────── */}
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
                {unreadBadge > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full font-semibold px-1.5 py-0.5" style={{ fontSize: '0.5rem' }}>{unreadBadge}</span>
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
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            <span className="font-medium" style={{ fontSize: '0.8125rem' }}>{isDark ? '切换亮色' : '切换暗色'}</span>
          </button>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-6 py-3 bg-card border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Map size={13} className="text-primary-foreground" />
            </div>
            <span className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>城市猜猜猜</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleTheme}
              className="p-1.5 bg-muted rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <div className="relative p-1.5 bg-muted rounded-lg text-foreground">
              <Bell size={15} />
              {unreadBadge > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-destructive rounded-full" />
              )}
            </div>
          </div>
        </header>

        {/* Content: desktop dashboard OR mobile screen */}
        <div className="flex-1 overflow-hidden">
          <div className="hidden md:block h-full">
            {desktopDashboard}
          </div>
          <div className="md:hidden h-full overflow-auto p-[0px]">
            {children}
          </div>
        </div>

        {/* ── Mobile bottom nav — pill style from Figma ─────── */}
        <div
          className="md:hidden flex justify-center bg-background flex-shrink-0 px-5 pt-2"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
        >
          <nav className="bg-primary rounded-full flex items-center gap-1 shadow-xl px-[20px] py-[8px]" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
            {navItems.map(item => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex flex-col items-center gap-0.5 rounded-full transition-all ${ isActive ? 'bg-primary-foreground/15' : '' } px-[26px] py-[8px]`}
                >
                  <span className={isActive ? 'text-primary-foreground' : 'text-primary-foreground/40'}>
                    {item.icon}
                  </span>
                  <span
                    className={isActive ? 'text-primary-foreground' : 'text-primary-foreground/40'}
                    style={{ fontSize: '0.5625rem', fontWeight: isActive ? 600 : 400 }}
                  >
                    {item.label}
                  </span>
                  {(item.badge ?? 0) > 0 && (
                    <span className="absolute top-1 right-3 w-3.5 h-3.5 bg-destructive text-primary-foreground text-[7px] font-bold rounded-full flex items-center justify-center">
                      {(item.badge ?? 0) > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
