import React from 'react';
import clsx from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: 'cyan' | 'purple' | 'green' | 'pink' | 'none';
  showScanner?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowColor = 'cyan',
  showScanner = false,
  ...props
}) => {
  const glowClasses = {
    cyan: 'border-cyberCyan/20 shadow-neonCyan hover:border-cyberCyan/40',
    purple: 'border-cyberPurple/20 shadow-neonPurple hover:border-cyberPurple/40',
    green: 'border-cyberGreen/20 shadow-neonGreen hover:border-cyberGreen/40',
    pink: 'border-cyberPink/20 shadow-neonPink hover:border-cyberPink/40',
    none: 'border-white/10 shadow-lg'
  };

  return (
    <div
      className={clsx(
        'glass-panel relative rounded-xl p-5 overflow-hidden transition-all duration-300 backdrop-blur-md',
        glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {/* Laser corners / HUD borders */}
      <div className={clsx(
        "absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2",
        glowColor === 'cyan' && "border-cyberCyan",
        glowColor === 'purple' && "border-cyberPurple",
        glowColor === 'green' && "border-cyberGreen",
        glowColor === 'pink' && "border-cyberPink",
        glowColor === 'none' && "border-white/40"
      )} />
      <div className={clsx(
        "absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2",
        glowColor === 'cyan' && "border-cyberCyan",
        glowColor === 'purple' && "border-cyberPurple",
        glowColor === 'green' && "border-cyberGreen",
        glowColor === 'pink' && "border-cyberPink",
        glowColor === 'none' && "border-white/40"
      )} />
      <div className={clsx(
        "absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2",
        glowColor === 'cyan' && "border-cyberCyan",
        glowColor === 'purple' && "border-cyberPurple",
        glowColor === 'green' && "border-cyberGreen",
        glowColor === 'pink' && "border-cyberPink",
        glowColor === 'none' && "border-white/40"
      )} />
      <div className={clsx(
        "absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2",
        glowColor === 'cyan' && "border-cyberCyan",
        glowColor === 'purple' && "border-cyberPurple",
        glowColor === 'green' && "border-cyberGreen",
        glowColor === 'pink' && "border-cyberPink",
        glowColor === 'none' && "border-white/40"
      )} />

      {/* Hologram scanline effect */}
      {showScanner && (
        <div className="absolute inset-0 pointer-events-none opacity-20 hologram-noise">
          <div className="scanner-line w-full" />
        </div>
      )}

      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
