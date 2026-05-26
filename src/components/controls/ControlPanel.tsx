'use client';

import React from 'react';
import { useExplorerStore } from '../../store/useExplorerStore';
import { GlassCard } from '../ui/GlassCard';
import { 
  Thermometer, Eye, Settings, Play, Pause, Video, 
  Orbit, Activity, Sun, Zap 
} from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const { 
    simulationParams, 
    updateSimulationParam, 
    isWebcamActive, 
    setWebcamActive,
    scale
  } = useExplorerStore();

  const { 
    temperature, 
    visualizationMode, 
    showElectronCloud, 
    isSimulating,
    orbitSpeed,
    showOrbitPaths,
    cellPulseSpeed,
    showMitochondriaOutline,
    solarSystemSpeed,
    showOrbitTrails,
    quarkSpinSpeed,
    gluonBindingStrength
  } = simulationParams;

  return (
    <GlassCard className="w-full flex flex-col gap-4 border border-cyberCyan/15 pointer-events-auto" glowColor="cyan">
      {/* HUD Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-cyberCyan/20">
        <Settings className="w-5 h-5 text-cyberCyan" />
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Quantum Physics Controls</h2>
      </div>

      {/* 1. Cosmic (Galaxy/Solar System) Scale Controls */}
      {scale === 'galaxy' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-1 text-cyberCyan">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Solar Orbit Speed</span>
              </div>
              <span className="font-bold text-cyberCyan">{solarSystemSpeed} AU/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={solarSystemSpeed}
              onChange={(e) => updateSimulationParam('solarSystemSpeed', parseInt(e.target.value))}
              className="w-full h-1 bg-spaceLight border border-white/5 rounded-lg appearance-none cursor-pointer accent-cyberCyan pointer-events-auto"
            />
            <span className="text-[10px] font-mono text-white/40 block">Adjusts orbital rotation multiplier of planetary bodies.</span>
          </div>

          <label className="flex items-center justify-between p-2 rounded bg-spaceLight/40 border border-white/5 cursor-pointer pointer-events-auto hover:bg-spaceLight/60">
            <span className="text-xs font-mono text-slate-300">Display Orbit Trails</span>
            <input
              type="checkbox"
              checked={showOrbitTrails}
              onChange={(e) => updateSimulationParam('showOrbitTrails', e.target.checked)}
              className="w-4 h-4 border-cyberCyan bg-spaceDark rounded cursor-pointer accent-cyberCyan pointer-events-auto"
            />
          </label>
        </div>
      )}

      {/* 2. Planetary Scale Controls */}
      {scale === 'earth' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-1 text-cyberCyan">
                <Orbit className="w-4 h-4" />
                <span>Planetary Orbit Velocity</span>
              </div>
              <span className="font-bold text-cyberCyan">{orbitSpeed} km/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={orbitSpeed}
              onChange={(e) => updateSimulationParam('orbitSpeed', parseInt(e.target.value))}
              className="w-full h-1 bg-spaceLight border border-white/5 rounded-lg appearance-none cursor-pointer accent-cyberCyan pointer-events-auto"
            />
            <span className="text-[10px] font-mono text-white/40 block">Adjusts coordinate orbiting speed and satellite translation.</span>
          </div>

          <label className="flex items-center justify-between p-2 rounded bg-spaceLight/40 border border-white/5 cursor-pointer pointer-events-auto hover:bg-spaceLight/60">
            <span className="text-xs font-mono text-slate-300">Display Satellite Orbit Path</span>
            <input
              type="checkbox"
              checked={showOrbitPaths}
              onChange={(e) => updateSimulationParam('showOrbitPaths', e.target.checked)}
              className="w-4 h-4 border-cyberCyan bg-spaceDark rounded cursor-pointer accent-cyberCyan pointer-events-auto"
            />
          </label>
        </div>
      )}

      {/* 3. Cellular Scale Controls */}
      {scale === 'cell' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-1 text-cyberGreen">
                <Activity className="w-4 h-4" />
                <span>Membrane Deformation Frequency</span>
              </div>
              <span className="font-bold text-cyberGreen">{cellPulseSpeed} Hz</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={cellPulseSpeed}
              onChange={(e) => updateSimulationParam('cellPulseSpeed', parseInt(e.target.value))}
              className="w-full h-1 bg-spaceLight border border-white/5 rounded-lg appearance-none cursor-pointer accent-cyberGreen pointer-events-auto"
            />
            <span className="text-[10px] font-mono text-white/40 block">Controls cytoplasmic membrane volumetric expansion.</span>
          </div>

          <label className="flex items-center justify-between p-2 rounded bg-spaceLight/40 border border-white/5 cursor-pointer pointer-events-auto hover:bg-spaceLight/60">
            <span className="text-xs font-mono text-slate-300">Organelles Wireframe Mesh</span>
            <input
              type="checkbox"
              checked={showMitochondriaOutline}
              onChange={(e) => updateSimulationParam('showMitochondriaOutline', e.target.checked)}
              className="w-4 h-4 border-cyberGreen bg-spaceDark rounded cursor-pointer accent-cyberGreen pointer-events-auto"
            />
          </label>
        </div>
      )}

      {/* 4. Molecular / Atomic Scale Controls */}
      {(scale === 'molecule' || scale === 'atom') && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-1 text-cyberPink">
                <Thermometer className="w-4 h-4" />
                <span>Thermal Energy (Temp)</span>
              </div>
              <span className="font-bold text-cyberPink">{temperature}°C</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={temperature}
              onChange={(e) => updateSimulationParam('temperature', parseInt(e.target.value))}
              className="w-full h-1 bg-spaceLight border border-white/5 rounded-lg appearance-none cursor-pointer accent-cyberPink pointer-events-auto"
            />
            <span className="text-[10px] font-mono text-white/40 block">Adjusts atomic thermal harmonic vibration velocity.</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-white/70 uppercase tracking-widest flex items-center gap-1">
              <Eye className="w-4 h-4 text-cyberCyan" /> Visual Representation
            </span>
            <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
              {(['ball-stick', 'space-filling', 'wireframe'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSimulationParam('visualizationMode', mode)}
                  className={`py-2 rounded border uppercase font-bold transition-all duration-200 pointer-events-auto ${
                    visualizationMode === mode
                      ? 'border-cyberCyan bg-cyberCyan/10 text-white shadow-neonCyan'
                      : 'border-white/10 bg-spaceLight/50 text-slate-400 hover:border-cyberCyan/40 hover:text-white'
                  }`}
                >
                  {mode.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between p-2 rounded bg-spaceLight/40 border border-white/5 cursor-pointer pointer-events-auto hover:bg-spaceLight/60">
            <span className="text-xs font-mono text-slate-300">Quantum Probability Shells</span>
            <input
              type="checkbox"
              checked={showElectronCloud}
              onChange={(e) => updateSimulationParam('showElectronCloud', e.target.checked)}
              className="w-4 h-4 border-cyberCyan bg-spaceDark rounded cursor-pointer accent-cyberCyan pointer-events-auto"
            />
          </label>
        </div>
      )}

      {/* 5. Quantum (Quark) Scale Controls */}
      {scale === 'quark' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-1 text-cyberPurple">
                <Orbit className="w-4 h-4 text-purple-400" />
                <span>Quark Spin Velocity</span>
              </div>
              <span className="font-bold text-cyberPurple">{quarkSpinSpeed} MeV/c</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={quarkSpinSpeed}
              onChange={(e) => updateSimulationParam('quarkSpinSpeed', parseInt(e.target.value))}
              className="w-full h-1 bg-spaceLight border border-white/5 rounded-lg appearance-none cursor-pointer accent-cyberPurple pointer-events-auto"
            />
            <span className="text-[10px] font-mono text-white/40 block">Controls the spin rotation frequency of elementary quarks.</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-1 text-cyberGreen">
                <Zap className="w-4 h-4 text-green-400" />
                <span>Gluon Binding Tension</span>
              </div>
              <span className="font-bold text-cyberGreen">{gluonBindingStrength} GeV</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={gluonBindingStrength}
              onChange={(e) => updateSimulationParam('gluonBindingStrength', parseInt(e.target.value))}
              className="w-full h-1 bg-spaceLight border border-white/5 rounded-lg appearance-none cursor-pointer accent-cyberGreen pointer-events-auto"
            />
            <span className="text-[10px] font-mono text-white/40 block">Tunes the elasticity and vibration amplitude of gluon tubes.</span>
          </div>
        </div>
      )}

      {/* Global Control Toggles */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-white/5">
        <button
          onClick={() => updateSimulationParam('isSimulating', !isSimulating)}
          className={`flex items-center justify-between p-2 rounded border transition-all duration-200 pointer-events-auto ${
            isSimulating
              ? 'border-cyberGreen/20 bg-cyberGreen/5 text-cyberGreen hover:bg-cyberGreen/10'
              : 'border-cyberPink/20 bg-cyberPink/5 text-cyberPink hover:bg-cyberPink/10'
          }`}
        >
          <span className="text-xs font-mono font-bold">PHYSICS ROTATION</span>
          {isSimulating ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setWebcamActive(!isWebcamActive)}
          className={`flex items-center justify-between p-2 rounded border transition-all duration-200 pointer-events-auto ${
            isWebcamActive
              ? 'border-cyberPurple bg-cyberPurple/10 text-white shadow-neonPurple'
              : 'border-white/10 bg-spaceLight/40 text-slate-400 hover:border-cyberPurple/40 hover:text-white'
          }`}
        >
          <span className="text-xs font-mono font-bold">WEBCAM HAND TRACKING</span>
          <Video className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
};
