import type React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { useIsMobile } from '../components/ui/use-mobile';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopHeader } from './DesktopHeader';
import { MobileNav } from './MobileNav';

interface AppShellProps {
  /** Mobile page content */
  children: React.ReactNode;
  /** Desktop dashboard view (shown on md+ when on a main nav screen) */
  desktopDashboard?: React.ReactNode;
}

export function AppShell({ children, desktopDashboard }: AppShellProps) {
  const { screen } = useApp();
  const isMobile = useIsMobile();

  // Pages that should show the full desktop dashboard on desktop
  const mainNavScreens = ['home', 'leaderboard', 'messages', 'profile'];
  const showDashboard = !isMobile && desktopDashboard && mainNavScreens.includes(screen);

  return (
    <div className="flex h-full w-full bg-background">
      {/* ── Desktop sidebar (md+) ── */}
      <DesktopSidebar />

      {/* ── Main column ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop top bar (md+) */}
        <DesktopHeader />

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {/* Desktop: dashboard or sub-page content */}
          <div className="hidden md:block h-full overflow-auto">
            {showDashboard ? (
              desktopDashboard
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={screen}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Mobile: page content */}
          <div className="md:hidden h-full overflow-auto p-[0px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile bottom nav ── */}
        <MobileNav />
      </main>
    </div>
  );
}
