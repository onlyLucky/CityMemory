import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';

export function MobileNav() {
  const { navItems, activeNavScreen, setScreen } = useApp();

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="md:hidden flex justify-center bg-background flex-shrink-0 px-5 pt-2"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
    >
      <nav
        className="bg-primary rounded-full flex items-center gap-1 shadow-xl px-[20px] py-[8px]"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
      >
        {navItems.map(item => {
          const isActive = activeNavScreen === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => setScreen(item.id)}
              className={`relative flex flex-col items-center gap-0.5 rounded-full transition-all ${
                isActive ? 'bg-primary-foreground/15' : ''
              } px-[26px] py-[8px]`}
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
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
}
