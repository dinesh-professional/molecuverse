'use client';

import React from 'react';
import { useExplorerStore } from '../../store/useExplorerStore';
import { MOLECULES } from '../../utils/molecules';
import { GlassCard } from '../ui/GlassCard';
import { Atom } from '../../types';
import { Award, Zap, AlertTriangle, ShieldCheck, Globe, Dna, Compass, Sparkles, Orbit, Sun } from 'lucide-react';

export const MoleculeDetails: React.FC = () => {
  const { activeMolecule, setActiveMoleculeId, scale } = useExplorerStore();

  // Calculate atom distribution
  const atomCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    activeMolecule.atoms.forEach((atom: Atom) => {
      counts[atom.element] = (counts[atom.element] || 0) + 1;
    });
    return counts;
  }, [activeMolecule]);

  return (
    <GlassCard className="w-full h-fit lg:h-[calc(100vh-180px)] overflow-y-auto flex flex-col gap-4 border border-cyberCyan/20 pointer-events-auto" glowColor="cyan" showScanner>
      {/* 0. Cosmic Details */}
      {scale === 'galaxy' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Orbit className="w-6 h-6 text-cyberCyan text-glow-cyan animate-pulse" />
            <div>
              <h2 className="text-xl font-bold font-sans tracking-wide text-cyberCyan text-glow-cyan">
                SOLAR SYSTEM
              </h2>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Milky Way - Orion Arm</span>
            </div>
          </div>
          
          <hr className="border-cyberCyan/20" />

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">SYSTEM MASS</span>
              <span className="text-sm font-semibold text-white/90">~1.99e30 kg</span>
            </div>
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">STAR CLASS</span>
              <span className="text-sm font-semibold text-cyberPurple">G2V Yellow Dwarf</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded text-xs font-mono border bg-cyberGreen/10 border-cyberGreen/30 text-cyberGreen">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <div>
              <span className="block font-bold">GRAVITATIONAL LOCK</span>
              <span className="opacity-90">Stable Planetary Orbit Synced</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm text-slate-300 leading-relaxed font-sans">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberCyan/80">Description</h3>
            <p className="bg-spaceLight/30 p-3 rounded border border-white/5 text-xs">
              The Solar System is our gravitationally bound system centered on the Sun. At this scale, view the orbital loops of planets from Mercury to Neptune, with planetary sizes scaled for visual clarity.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberCyan/80">System Composition</h3>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Central Star (Sun)</span>
                <span className="text-cyberCyan font-bold">1</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Inner Terrestrial</span>
                <span className="text-cyberCyan font-bold">4</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Outer Gas Giants</span>
                <span className="text-cyberCyan font-bold">4</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Known Moons</span>
                <span className="text-cyberPink font-bold">290+</span>
              </div>
            </div>
          </div>

          <div className="bg-cyberPurple/10 border border-cyberPurple/30 rounded p-3 text-xs font-sans text-purple-200">
            <div className="flex items-center gap-1 text-cyberPurple font-mono font-bold mb-1 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Fun Fact
            </div>
            <p className="italic text-white/80">
              The Sun accounts for 99.86% of the mass in the Solar System. The remaining 0.14% is mostly Jupiter.
            </p>
          </div>
        </div>
      )}

      {/* 1. Planetary Details */}
      {scale === 'earth' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyberCyan text-glow-cyan animate-pulse" />
            <div>
              <h2 className="text-xl font-bold font-sans tracking-wide text-cyberCyan text-glow-cyan">
                PLANET EARTH
              </h2>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Planetary Grid Sector</span>
            </div>
          </div>
          
          <hr className="border-cyberCyan/20" />

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">MASS</span>
              <span className="text-sm font-semibold text-white/90">5.97e24 kg</span>
            </div>
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">CLASS</span>
              <span className="text-sm font-semibold text-cyberPurple">Terrestrial</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded text-xs font-mono border bg-cyberGreen/10 border-cyberGreen/30 text-cyberGreen">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <div>
              <span className="block font-bold">ATMOSPHERE STABILITY</span>
              <span className="opacity-90">Oxygen/Nitrogen Matrix (Secure)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm text-slate-300 leading-relaxed font-sans">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberCyan/80">Description</h3>
            <p className="bg-spaceLight/30 p-3 rounded border border-white/5 text-xs">
              Earth is the third planet from the Sun and the only astronomical object known to harbor life. In this orbit viewport, you can view the surrounding satellite communication array and track orbital telemetry.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberCyan/80">Satellite Network Composition</h3>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Natural (Moon)</span>
                <span className="text-cyberCyan font-bold">1</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Communication</span>
                <span className="text-cyberCyan font-bold">2,400+</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Meteorological</span>
                <span className="text-cyberCyan font-bold">340+</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Space Debris</span>
                <span className="text-cyberPink font-bold">12,000+</span>
              </div>
            </div>
          </div>

          <div className="bg-cyberPurple/10 border border-cyberPurple/30 rounded p-3 text-xs font-sans text-purple-200">
            <div className="flex items-center gap-1 text-cyberPurple font-mono font-bold mb-1 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Fun Fact
            </div>
            <p className="italic text-white/80">
              Earth is the only planet in the Solar System not named after a mythological god or goddess.
            </p>
          </div>
        </div>
      )}

      {/* 2. Cellular Details */}
      {scale === 'cell' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Dna className="w-6 h-6 text-cyberGreen text-glow-green animate-pulse" />
            <div>
              <h2 className="text-xl font-bold font-sans tracking-wide text-cyberGreen text-glow-green">
                EUKARYOTIC CELL
              </h2>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Organic Biological Matrix</span>
            </div>
          </div>
          
          <hr className="border-cyberGreen/20" />

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">DIAMETER</span>
              <span className="text-sm font-semibold text-white/90">20 μm</span>
            </div>
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">CYTOSOL pH</span>
              <span className="text-sm font-semibold text-cyberPurple">7.2</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded text-xs font-mono border bg-cyberCyan/10 border-cyberCyan/30 text-cyberCyan">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <div>
              <span className="block font-bold">CELLULAR HEALTH</span>
              <span className="opacity-90">Active Respiration (Adenosine Triphosphate)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm text-slate-300 leading-relaxed font-sans">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberGreen/80">Description</h3>
            <p className="bg-spaceLight/30 p-3 rounded border border-white/5 text-xs">
              A eukaryotic cell is a complex structural unit containing membrane-bound organelles. The central nucleus stores DNA, while surrounding mitochondria generate ATP to fuel metabolic operations.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberGreen/80">Organelles Count</h3>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Mitochondria</span>
                <span className="text-cyberGreen font-bold">4</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Lysosomes</span>
                <span className="text-cyberGreen font-bold">4</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Nucleus Core</span>
                <span className="text-cyberGreen font-bold">1</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Nucleolus</span>
                <span className="text-cyberGreen font-bold">1</span>
              </div>
            </div>
          </div>

          <div className="bg-cyberPurple/10 border border-cyberPurple/30 rounded p-3 text-xs font-sans text-purple-200">
            <div className="flex items-center gap-1 text-cyberPurple font-mono font-bold mb-1 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Fun Fact
            </div>
            <p className="italic text-white/80">
              Mitochondria have their own independent genome (mtDNA), pointing to an evolutionary origins story as engulfed bacteria.
            </p>
          </div>
        </div>
      )}

      {/* 3. Molecular & Atomic Details */}
      {(scale === 'molecule' || scale === 'atom') && (
        <div className="flex flex-col gap-4">
          {/* Molecule Selector drop-down */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-cyberCyan/80">Active Compound</label>
            <select
              value={activeMolecule.id}
              onChange={(e) => setActiveMoleculeId(e.target.value)}
              className="bg-spaceLight border border-cyberCyan/30 text-white rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyberCyan pointer-events-auto"
            >
              {MOLECULES.map((m) => (
                <option key={m.id} value={m.id} className="bg-spaceDark">
                  {m.name} ({m.formula})
                </option>
              ))}
            </select>
          </div>

          <hr className="border-cyberCyan/20" />

          {/* Main Chemical Identity */}
          <div>
            <h2 className="text-2xl font-bold font-sans tracking-wide text-glow-cyan text-cyberCyan">
              {activeMolecule.name}
            </h2>
            <span className="text-xs font-mono text-white/50">Formula: </span>
            <span className="text-sm font-mono font-bold text-cyberGreen">{activeMolecule.formula}</span>
          </div>

          {/* Numerical Stats Dashboard */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">MASS</span>
              <span className="text-sm font-semibold text-white/90">{activeMolecule.mass}</span>
            </div>
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">CLASS</span>
              <span className="text-sm font-semibold text-cyberPurple">{activeMolecule.category}</span>
            </div>
          </div>

          {/* Danger/Hazard rating alert box */}
          <div className={`flex items-center gap-2.5 p-3 rounded text-xs font-mono border ${
            activeMolecule.hazard.includes('Toxic') || activeMolecule.hazard.includes('Flammable')
              ? 'bg-cyberPink/10 border-cyberPink/30 text-cyberPink'
              : 'bg-cyberGreen/10 border-cyberGreen/30 text-cyberGreen'
          }`}>
            {activeMolecule.hazard.includes('Toxic') || activeMolecule.hazard.includes('Flammable') ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 shrink-0" />
            )}
            <div>
              <span className="block font-bold">HAZARD PROFILE</span>
              <span className="opacity-90">{activeMolecule.hazard}</span>
            </div>
          </div>

          {/* Description Text */}
          <div className="flex flex-col gap-1 text-sm text-slate-300 leading-relaxed font-sans">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberCyan/80">Molecular Structure</h3>
            <p className="bg-spaceLight/30 p-3 rounded border border-white/5 text-xs">
              {activeMolecule.description}
            </p>
          </div>

          {/* Atom Counts list */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberCyan/80">Atomic Composition</h3>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {Object.entries(atomCounts).map(([elem, count]) => (
                <div key={elem} className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                  <span className="text-white/70 font-semibold">{elem} ({elem === 'H' ? 'Hydrogen' : elem === 'C' ? 'Carbon' : elem === 'O' ? 'Oxygen' : elem === 'N' ? 'Nitrogen' : elem === 'P' ? 'Phosphorus' : 'Other'})</span>
                  <span className="text-cyberCyan font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Fact Callout Box */}
          <div className="bg-cyberPurple/10 border border-cyberPurple/30 rounded p-3 text-xs font-sans text-purple-200">
            <div className="flex items-center gap-1 text-cyberPurple font-mono font-bold mb-1 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Fun Fact
            </div>
            <p className="italic text-white/80">{activeMolecule.funFact}</p>
          </div>
        </div>
      )}

      {/* 4. Quantum Quark Details */}
      {scale === 'quark' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyberPink text-glow-pink animate-pulse" />
            <div>
              <h2 className="text-xl font-bold font-sans tracking-wide text-cyberPink text-glow-pink">
                PROTON NUCLEUS
              </h2>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Quantum Elementary Scale</span>
            </div>
          </div>
          
          <hr className="border-cyberPink/20" />

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">MASS</span>
              <span className="text-sm font-semibold text-white/90">1.67e-27 kg</span>
            </div>
            <div className="bg-spaceLight/50 p-2.5 rounded border border-white/5">
              <span className="text-white/40 block">HADRON CLASS</span>
              <span className="text-sm font-semibold text-cyberPurple">Baryon (Stable)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded text-xs font-mono border bg-cyberPink/10 border-cyberPink/30 text-cyberPink">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div>
              <span className="block font-bold">STRONG FORCE BINDING</span>
              <span className="opacity-90">Asymptotic Freedom / Confinement</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm text-slate-300 leading-relaxed font-sans">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberPink/80">Description</h3>
            <p className="bg-spaceLight/30 p-3 rounded border border-white/5 text-xs">
              A proton consists of three valence quarks (two Up, one Down) bound by strong force gluons. Quarks possess fractional charges and colors, which must combine to form a white/neutral composite baryon.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyberPink/80">Quark Sub-Structure</h3>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Up Quarks (+2/3e)</span>
                <span className="text-cyberCyan font-bold">2</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Down Quarks (-1/3e)</span>
                <span className="text-cyberCyan font-bold">1</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Gluons (Gauge Bosons)</span>
                <span className="text-cyberGreen font-bold">3 Fields</span>
              </div>
              <div className="flex justify-between bg-spaceLight/40 p-2 rounded border border-white/5">
                <span className="text-white/70">Net Electric Charge</span>
                <span className="text-cyberPink font-bold">+1 e</span>
              </div>
            </div>
          </div>

          <div className="bg-cyberPurple/10 border border-cyberPurple/30 rounded p-3 text-xs font-sans text-purple-200">
            <div className="flex items-center gap-1 text-cyberPurple font-mono font-bold mb-1 uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Fun Fact
            </div>
            <p className="italic text-white/80">
              Quarks are never found in isolation. If you try to pull them apart, the strong force grows stronger, eventually creating a new quark-antiquark pair from the energy.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
