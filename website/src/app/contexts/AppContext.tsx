import React, { createContext, useContext, useState, useMemo } from 'react';
import { Home, Trophy, Mail, User } from 'lucide-react';
import { MOCK_MESSAGES, type Message } from '../data/game-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AppPhase = 'splash' | 'auth' | 'main';

export type Screen =
  | 'home'
  | 'leaderboard'
  | 'messages'
  | 'profile'
  | 'settings'
  | 'friends'
  | 'userDetail'
  | 'editProfile'
  | 'battleDetail'
  | 'about'
  | 'serviceAgreement'
  | 'privacyPolicy'
  | 'rateUs'
  | 'achievements';

export interface NavItem {
  id: Screen;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

// ---------------------------------------------------------------------------
// Context value shape
// ---------------------------------------------------------------------------

interface AppContextValue {
  // Phase management
  phase: AppPhase;
  setPhase: React.Dispatch<React.SetStateAction<AppPhase>>;

  // Screen / routing (will be replaced by react-router later)
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;

  // Battle
  battleActive: boolean;
  setBattleActive: React.Dispatch<React.SetStateAction<boolean>>;

  // Game state
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  userScore: number;
  setUserScore: React.Dispatch<React.SetStateAction<number>>;
  litProvinces: Record<string, string[]>;
  setLitProvinces: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;

  // User
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  viewingUser: string;
  setViewingUser: React.Dispatch<React.SetStateAction<string>>;

  // Messages
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  unreadMsgs: number;

  // Derived / helpers
  navItems: NavItem[];
  activeNavScreen: Screen;

  // Actions
  handleBattleFinish: (won: boolean, litProvince: string | null) => void;
  handleViewUser: (name: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AppContext = createContext<AppContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AppProvider({ children }: { children: React.ReactNode }) {
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

  // Derived values
  const unreadMsgs = useMemo(
    () => messages.filter(m => !m.read).length,
    [messages],
  );

  const navItems: NavItem[] = useMemo(
    () => [
      { id: 'home', label: '首页', icon: <Home size={19} /> },
      { id: 'leaderboard', label: '排行', icon: <Trophy size={19} /> },
      { id: 'messages', label: '消息', icon: <Mail size={19} />, badge: unreadMsgs },
      { id: 'profile', label: '我的', icon: <User size={19} /> },
    ],
    [unreadMsgs],
  );

  const mainNavScreens: Screen[] = ['home', 'leaderboard', 'messages', 'profile'];
  const activeNavScreen: Screen = mainNavScreens.includes(screen)
    ? screen
    : ('profile' as Screen);

  // Actions
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

  const handleViewUser = (name: string) => {
    setViewingUser(name);
    setScreen('userDetail');
  };

  const value: AppContextValue = useMemo(
    () => ({
      phase,
      setPhase,
      screen,
      setScreen,
      battleActive,
      setBattleActive,
      selectedCountry,
      setSelectedCountry,
      userScore,
      setUserScore,
      litProvinces,
      setLitProvinces,
      userName,
      setUserName,
      viewingUser,
      setViewingUser,
      messages,
      setMessages,
      unreadMsgs,
      navItems,
      activeNavScreen,
      handleBattleFinish,
      handleViewUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      phase,
      screen,
      battleActive,
      selectedCountry,
      userScore,
      litProvinces,
      userName,
      viewingUser,
      messages,
      unreadMsgs,
      navItems,
      activeNavScreen,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an <AppProvider>');
  }
  return ctx;
}
