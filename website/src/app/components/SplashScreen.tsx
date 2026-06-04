import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const t0 = setTimeout(() => setStage(1), 80);
    const t1 = setTimeout(() => setStage(2), 650);
    const t2 = setTimeout(() => setStage(3), 1350);
    const t3 = setTimeout(onDone, 2800);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="w-full h-full bg-primary flex flex-col items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes splashDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(1); }
          40%            { opacity: 1;   transform: scale(1.5); }
        }
      `}</style>

      {/* Decorative rings */}
      {[320, 480, 640].map(size => (
        <div key={size} className="absolute rounded-full border border-primary-foreground/8 pointer-events-none"
          style={{ width: size, height: size, top: '50%', left: '50%', transform: 'translate(-50%, -52%)' }} />
      ))}

      {/* Content */}
      <div className="flex flex-col items-center z-10"
        style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>

        <div className="w-24 h-24 rounded-3xl bg-primary-foreground/15 flex items-center justify-center mb-7"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 16px 48px rgba(0,0,0,0.2)' }}>
          <MapPin size={46} className="text-primary-foreground" />
        </div>

        <p className="text-primary-foreground" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1 }}>
          城市猜猜猜
        </p>

        <p className="text-primary-foreground/60 mt-2.5"
          style={{ fontSize: '0.9375rem', opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s' }}>
          一城一世界，一战见真章
        </p>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-20 flex items-center gap-2.5"
        style={{ opacity: stage >= 2 ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-full bg-primary-foreground/50"
            style={{ width: 6, height: 6, animation: `splashDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>

      {/* Version */}
      <p className="absolute bottom-8 text-primary-foreground/30"
        style={{ fontSize: '0.6875rem', opacity: stage >= 3 ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        v1.0.0
      </p>
    </div>
  );
}
