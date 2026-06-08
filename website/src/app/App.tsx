import { ThemeProvider } from './components/ThemeProvider';
import { AppProvider, useApp } from './contexts/AppContext';
import { AppShell } from './layouts/AppShell';
import { HomeScreen } from './pages/HomeScreen';
import { BattleFlow } from './features/battle/BattleFlow';
import { LeaderboardScreen } from './pages/LeaderboardScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { MessagesScreen } from './pages/MessagesScreen';
import { SettingsScreen } from './pages/SettingsScreen';
import { DesktopDashboard } from './features/battle/DesktopDashboard';
import { SplashScreen } from './pages/SplashScreen';
import { AuthScreen } from './pages/AuthScreen';
import { FriendsScreen } from './pages/FriendsScreen';
import { UserDetailScreen } from './pages/UserDetailScreen';
import { EditProfileScreen } from './pages/EditProfileScreen';
import { BattleDetailScreen } from './pages/BattleDetailScreen';
import { AboutScreen } from './pages/AboutScreen';
import { ServiceAgreementScreen } from './pages/ServiceAgreementScreen';
import { PrivacyPolicyScreen } from './pages/PrivacyPolicyScreen';
import { RateUsScreen } from './pages/RateUsScreen';
import { AchievementsScreen } from './pages/AchievementsScreen';

function AppContent() {
  const {
    phase,
    setPhase,
    screen,
    setScreen,
    battleActive,
    setBattleActive,
    selectedCountry,
    setSelectedCountry,
    userScore,
    userName,
    setUserName,
    litProvinces,
    viewingUser,
    handleBattleFinish,
    handleViewUser,
  } = useApp();

  // Splash phase
  if (phase === 'splash') {
    return <SplashScreen onDone={() => setPhase('auth')} />;
  }

  // Auth phase
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

  // Main app content
  const pageContent = (
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

  return (
    <AppShell
      desktopDashboard={
        <DesktopDashboard
          onStartBattle={() => setBattleActive(true)}
          litProvinces={litProvinces}
          selectedCountry={selectedCountry}
        />
      }
    >
      {pageContent}
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
