'use client';

import React from 'react';
import { useExplorerStore } from '../../store/useExplorerStore';
import { ScaleLevel } from '../../types';
import { Compass, ChevronsUpDown } from 'lucide-react';

const SCALES: { id: ScaleLevel; label: string; range: string; value: string }[] = [
  { id: 'galaxy', label: 'COSMIC', range: '10^12 m', value: '1.5 * 10^12 m' },
  { id: 'earth', label: 'PLANETARY', range: '10^7 m', value: '1.27 * 10^7 m' },
  { id: 'cell', label: 'CELLULAR', range: '10^-5 m', value: '1.5 * 10^-5 m' },
  { id: 'molecule', label: 'MOLECULAR', range: '10^-9 m', value: '8.4 * 10^-10 m' },
  { id: 'atom', label: 'ATOMIC', range: '10^-10 m', value: '1.2 * 10^-10 m' },
  { id: 'quark', label: 'QUANTUM', range: '10^-18 m', value: '1.0 * 10^-18 m' }
];

export const ScaleSlider: React.FC = () => {
  const { scale, setScale } = useExplorerStore();

  return (
    <div className="flex flex-col gap-4 bg-spaceDark/70 border border-cyberCyan/15 p-4 rounded-xl backdrop-blur-md w-full pointer-events-auto">
      {/* HUD Header */}
      <div className="flex items-center gap-2 pb-1.5 border-b border-cyberCyan/20 text-xs font-mono text-white/50">
        <Compass className="w-4 h-4 text-cyberCyan" />
        <span className="font-bold tracking-widest text-white/80">SCALE RADAR</span>
      </div>

      {/* Vertical Slider layout */}
      <div className="flex flex-col gap-1.5 relative">
        {SCALES.map((item) => {
          const isActive = scale === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setScale(item.id)}
              className={`text-left p-2.5 rounded border transition-all duration-300 flex flex-col gap-0.5 pointer-events-auto group relative overflow-hidden ${
                isActive
                  ? 'border-cyberCyan bg-cyberCyan/10 text-white shadow-neonCyan'
                  : 'border-white/5 bg-spaceLight/30 text-white/40 hover:border-cyberCyan/30 hover:text-white/80'
              }`}
            >
              {/* Highlight bar */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyberCyan shadow-neonCyan" />
              )}
              
              <div className="flex justify-between items-center w-full">
                <span className="text-[11px] font-mono font-bold tracking-wider">{item.label}</span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-cyberCyan' : 'text-white/30 group-hover:text-cyberCyan/60'}`}>
                  {item.range}
                </span>
              </div>
              
              <span className="text-[9px] font-mono text-white/30 truncate">
                {isActive ? `ZOOM LEVEL: ${item.value}` : 'STANDBY'}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Indicator footer */}
      <div className="flex items-center justify-between text-[9px] font-mono text-white/30 border-t border-cyberCyan/10 pt-2">
        <span>GRID RANGE RESOLVED</span>
        <ChevronsUpDown className="w-3.5 h-3.5 animate-pulse text-cyberCyan" />
      </div>
    </div>
  );
};
