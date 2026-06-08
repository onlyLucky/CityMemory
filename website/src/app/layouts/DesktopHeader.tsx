import { Map, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useApp } from '../contexts/AppContext';

export function DesktopHeader() {
  const { isDark, toggleTheme } = useTheme();
  const { unreadMsgs } = useApp();

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 bg-card border-b border-border flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
          <Map size={13} className="text-primary-foreground" />
        </div>
        <span className="text-foreground font-semibold" style={{ fontSize: '0.875rem' }}>城市猜猜猜</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="p-1.5 bg-muted rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <div className="relative p-1.5 bg-muted rounded-lg text-foreground">
          <Bell size={15} />
          {unreadMsgs > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-destructive rounded-full" />
          )}
        </div>
      </div>
    </header>
  );
}
