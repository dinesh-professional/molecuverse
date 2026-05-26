'use client';

import React, { useState, useEffect } from 'react';
import { useExplorerStore } from '../store/useExplorerStore';
import { MainCanvas } from '../components/canvas/MainCanvas';
import { ScaleSlider } from '../components/controls/ScaleSlider';
import { ControlPanel } from '../components/controls/ControlPanel';
import { GestureController } from '../components/controls/GestureController';
import { MoleculeDetails } from '../components/panels/MoleculeDetails';
import { AIAssistant } from '../components/panels/AIAssistant';
import { QuizPanel } from '../components/panels/QuizPanel';
import { NeonButton } from '../components/ui/NeonButton';
import { 
  Atom, Compass, Database, ShieldAlert, Sparkles, 
  Info, Award, ArrowLeft, BrainCircuit 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UnifiedApp() {
  const { 
    scale, 
    activeMolecule, 
    detectedGesture, 
    isWebcamActive, 
    setWebcamActive,
    currentView,
    setView,
    setMobile
  } = useExplorerStore();

  const [rightPanelTab, setRightPanelTab] = useState<'details' | 'ai' | 'quiz'>('details');

  // Track window resizing for mobile devices
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile]);

  // Auto reset right panel tab to details when scale zoom shifts
  useEffect(() => {
    setRightPanelTab('details');
  }, [scale]);

  return (
    <main className="relative w-screen h-screen bg-spaceDark overflow-hidden select-none font-sans text-white">
      {/* 1. shared full-bleed background 3D Canvas */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <MainCanvas />
      </div>

      {/* 2. Panoramic Radial Overlay grids */}
      <div className="absolute inset-0 bg-radial-cyber pointer-events-none z-15" />

      {/* 3. Transition Overlays */}
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          /* Landing Screen HUD View */
          <motion.div
            key="landing-hud"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-20 flex flex-col justify-between p-8 pointer-events-none"
          >
            {/* Header Telemetry */}
            <header className="relative w-full max-w-7xl mx-auto border-b border-cyberCyan/10 pb-4 flex justify-between items-center pointer-events-auto">
              <div className="flex items-center gap-2">
                <Atom className="w-8 h-8 text-cyberCyan animate-spin-slow text-glow-cyan" />
                <span className="font-mono font-black text-xl tracking-widest text-white">
                  MOLECU<span className="text-cyberCyan text-glow-cyan">VERSE</span>
                </span>
              </div>
              <div className="hidden md:flex gap-6 text-xs font-mono text-white/50 tracking-wider">
                <span className="hover:text-cyberCyan transition-colors cursor-pointer flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" /> DB_STATUS: SECURE
                </span>
                <span className="hover:text-cyberGreen transition-colors cursor-pointer flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> SCALE: AUTO
                </span>
              </div>
            </header>

            {/* Central Callout Area */}
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-8 my-auto pointer-events-auto">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-1.5 bg-cyberCyan/10 border border-cyberCyan/30 text-cyberCyan px-3 py-1 rounded-full text-xs font-mono tracking-widest animate-pulse w-fit mx-auto uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> Next-Gen Visualizations Ready
                </div>
                <h1 className="text-5xl md:text-8xl font-orbitron font-black uppercase tracking-tighter text-white">
                  EXPLORE THE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyberCyan via-cyberPurple to-cyberPink text-glow-cyan">
                    NANO COSMOS
                  </span>
                </h1>
                <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
                  Zoom from planetary scale down to individual quarks, manipulate molecular structures via hand gesture AI, and solve chemical puzzles with a neural companion.
                </p>
              </div>

              <button 
                onClick={() => setView('explorer')}
                className="mt-4 pointer-events-auto"
              >
                <NeonButton variant="cyan" className="px-8 py-3.5 text-base shadow-neonCyan hover:scale-105 transition-all">
                  LAUNCH EXPLORER CORE
                </NeonButton>
              </button>
            </div>

            {/* Footer readouts */}
            <footer className="w-full max-w-7xl mx-auto border-t border-cyberCyan/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/30 pointer-events-auto">
              <div className="flex gap-4">
                <span>COGNITIVE CORE V0.1</span>
                <span>GPU INSTANCING ACTIVE</span>
                <span>FPS: 144.00</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyberPink font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>RESEARCH LABORATORY COMPLIANT</span>
              </div>
            </footer>
          </motion.div>
        ) : (
          /* Cockpit Cockpit Panel Overlay */
          <motion.div
            key="explorer-hud"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex flex-col pointer-events-none"
          >
            {/* Top HUD Cockpit bar */}
            <header className="w-full flex justify-between items-center p-4 bg-spaceDark/90 backdrop-blur-md border-b border-cyberCyan/10 shrink-0 pointer-events-auto">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('landing')}
                  className="flex items-center justify-center p-2 rounded bg-spaceLight/50 border border-white/5 hover:border-cyberCyan/40 hover:bg-cyberCyan/5 text-slate-300 hover:text-white transition-all duration-200 pointer-events-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <Atom className="w-6 h-6 text-cyberCyan animate-spin-slow text-glow-cyan" />
                  <span className="font-mono font-black text-sm tracking-widest text-white">
                    MOLECU<span className="text-cyberCyan text-glow-cyan">VERSE</span>
                  </span>
                </div>
              </div>

              {/* Telemetry diagnostics */}
              <div className="hidden md:flex items-center gap-4 bg-spaceLight/40 border border-cyberCyan/20 px-4 py-1.5 rounded-full font-mono text-[10px] tracking-wider text-white/80">
                <span>COSMOS DEV: <span className="text-cyberCyan font-bold">-{scale.toUpperCase()}_ZONE</span></span>
                <span className="w-1.5 h-1.5 bg-cyberGreen rounded-full animate-ping" />
                <span>LOD STATE: <span className="text-cyberGreen font-bold">OPTIMIZED</span></span>
              </div>

              {/* Hand tracking webcam controllers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWebcamActive(!isWebcamActive)}
                  className={`pointer-events-auto flex items-center gap-2 font-mono text-[10px] bg-spaceLight/40 px-2 sm:px-3.5 py-1.5 rounded-full border transition-all duration-300 hover:scale-102 ${
                    isWebcamActive 
                      ? 'border-cyberPurple text-white shadow-neonPurple bg-cyberPurple/10' 
                      : 'border-cyberPurple/30 text-white/70 hover:border-cyberPurple hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isWebcamActive ? 'bg-cyberPurple animate-pulse shadow-neonPurple' : 'bg-white/30'}`} />
                  <span className="hidden sm:inline">OPEN CAMERA: {isWebcamActive ? 'ACTIVE' : 'INACTIVE'}</span>
                  <span className="inline sm:hidden">{isWebcamActive ? 'CAM' : 'OFF'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-2.5 font-mono text-[10px] text-white/50 bg-spaceLight/40 border border-cyberPurple/20 px-3.5 py-1.5 rounded-full">
                  <span>GESTURE:</span>
                  {isWebcamActive ? (
                    <span className="text-cyberGreen font-bold flex items-center gap-1">
                      CAMERA ACTIVE • {detectedGesture.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-white/40 font-bold">VIRTUAL PAD ON</span>
                  )}
                </div>
              </div>
            </header>

            {/* Split viewport and dashboard sidebar */}
            <div className="flex flex-col lg:flex-row flex-1 w-full overflow-hidden relative">
              {/* Left Side: Click-through interactive spacer area */}
              <div className="flex-1 w-full h-[40vh] lg:h-full relative">
                {/* Viewport contextual detail bar */}
                <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-spaceDark/85 border border-cyberCyan/15 rounded-full px-4 lg:px-6 py-1.5 lg:py-2 backdrop-blur-md flex items-center gap-2 lg:gap-6 text-[8px] lg:text-[10px] font-mono text-white/50 shadow-lg shadow-black/50 pointer-events-auto whitespace-nowrap">
                  <span className="hidden sm:inline">GRID: ACTIVE</span>
                  <span className="hidden sm:inline">•</span>
                  {scale === 'galaxy' && <span>COSMIC SCALE</span>}
                  {scale === 'earth' && <span>PLANETARY SCALE</span>}
                  {scale === 'cell' && <span>CELLULAR SCALE</span>}
                  {scale === 'molecule' && <span>MOLECULAR: {activeMolecule.name}</span>}
                  {scale === 'atom' && <span>ATOMIC SCALE</span>}
                  {scale === 'quark' && <span>QUANTUM SCALE</span>}
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">LINK: ONLINE</span>
                </footer>
              </div>

              {/* Right Side: Floating controls hud panel */}
              <aside className="pointer-events-auto w-full lg:w-[440px] h-[60vh] lg:h-full border-t lg:border-t-0 lg:border-l border-cyberCyan/15 bg-spaceDark/75 backdrop-blur-lg flex flex-col overflow-y-auto p-4 lg:p-6 gap-4 lg:gap-6 relative z-10 select-none shadow-2xl">
                {/* Scale Selector slider */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-[10px] font-mono font-bold tracking-widest text-cyberCyan/80 uppercase">
                    // 01. System Zoom Scale
                  </h2>
                  <ScaleSlider />
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-cyberCyan/20 to-transparent" />

                {/* Physics control sliders */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-[10px] font-mono font-bold tracking-widest text-cyberGreen/80 uppercase">
                    // 02. Simulation Parameters
                  </h2>
                  <ControlPanel />
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-cyberGreen/20 to-transparent" />

                {/* Gesture controls webcam box */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-[10px] font-mono font-bold tracking-widest text-cyberPurple/80 uppercase">
                    // 03. Spatial Hand Tracking
                  </h2>
                  <GestureController />
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-cyberPurple/20 to-transparent" />

                {/* Telemetry sidebar tabs */}
                <div className="flex flex-col gap-4 pb-4">
                  <div className="flex justify-between items-center gap-2">
                    <h2 className="text-[10px] font-mono font-bold tracking-widest text-cyberPink/80 uppercase shrink-0">
                      // 04. Telemetry
                    </h2>
                    
                    <div className="flex bg-spaceLight/60 border border-cyberCyan/15 p-0.5 rounded-lg shadow-lg">
                      <button
                        onClick={() => setRightPanelTab('details')}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-all duration-200 ${
                          rightPanelTab === 'details'
                            ? 'bg-cyberCyan/15 border border-cyberCyan/30 text-cyberCyan'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Info className="w-3.5 h-3.5" /> DETAILS
                      </button>
                      
                      <button
                        onClick={() => setRightPanelTab('ai')}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-all duration-200 ${
                          rightPanelTab === 'ai'
                            ? 'bg-cyberPurple/15 border border-cyberPurple/30 text-cyberPurple'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <BrainCircuit className="w-3.5 h-3.5" /> AI CHAT
                      </button>

                      <button
                        onClick={() => setRightPanelTab('quiz')}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-all duration-200 ${
                          rightPanelTab === 'quiz'
                            ? 'bg-cyberGreen/15 border border-cyberGreen/30 text-cyberGreen'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" /> QUIZ
                      </button>
                    </div>
                  </div>

                  <div className="w-full">
                    <AnimatePresence mode="wait">
                      {rightPanelTab === 'details' && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <MoleculeDetails />
                        </motion.div>
                      )}
                      {rightPanelTab === 'ai' && (
                        <motion.div
                          key="ai"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <AIAssistant />
                        </motion.div>
                      )}
                      {rightPanelTab === 'quiz' && (
                        <motion.div
                          key="quiz"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <QuizPanel />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
