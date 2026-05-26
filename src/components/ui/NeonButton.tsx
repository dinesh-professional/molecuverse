import React from 'react';
import clsx from 'clsx';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'green' | 'pink';
  glow?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  className,
  variant = 'cyan',
  glow = true,
  ...props
}) => {
  const variantStyles = {
    cyan: 'border-cyberCyan/60 text-cyberCyan hover:bg-cyberCyan/10 hover:shadow-neonCyan focus:ring-cyberCyan/50',
    purple: 'border-cyberPurple/60 text-cyberPurple hover:bg-cyberPurple/10 hover:shadow-neonPurple focus:ring-cyberPurple/50',
    green: 'border-cyberGreen/60 text-cyberGreen hover:bg-cyberGreen/10 hover:shadow-neonGreen focus:ring-cyberGreen/50',
    pink: 'border-cyberPink/60 text-cyberPink hover:bg-cyberPink/10 hover:shadow-neonPink focus:ring-cyberPink/50',
  };

  return (
    <button
      className={clsx(
        'relative overflow-hidden border px-4 py-2 text-sm font-mono uppercase tracking-widest transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
        variantStyles[variant],
        glow ? 'shadow-md' : '',
        'rounded-md',
        className
      )}
      {...props}
    >
      {/* Corner laser cuts */}
      <span className="absolute left-0 top-0 h-1.5 w-1.5 border-t border-l border-current opacity-80" />
      <span className="absolute right-0 top-0 h-1.5 w-1.5 border-t border-r border-current opacity-80" />
      <span className="absolute left-0 bottom-0 h-1.5 w-1.5 border-b border-l border-current opacity-80" />
      <span className="absolute right-0 bottom-0 h-1.5 w-1.5 border-b border-r border-current opacity-80" />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
