export type ScaleLevel = 'galaxy' | 'earth' | 'cell' | 'molecule' | 'atom' | 'quark';

export interface Atom {
  id: number;
  element: 'H' | 'C' | 'N' | 'O' | 'Na' | 'Cl' | 'P' | 'S' | string;
  x: number; // relative coordinate x
  y: number; // relative coordinate y
  z: number; // relative coordinate z
}

export interface Bond {
  from: number;
  to: number;
  type: 'single' | 'double' | 'triple' | 'covalent' | 'ionic' | 'hydrogen';
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  description: string;
  mass: string;
  category: string; // e.g. "Solvent", "Organic Compound", "Bio-polymer", "Stimulant"
  hazard: string; // e.g. "Non-hazardous", "Flammable", "Toxic"
  funFact: string;
  atoms: Atom[];
  bonds: Bond[];
}

export interface SimulationParams {
  temperature: number; // 0 to 100 (represents thermal motion / vibration scale)
  pressure: number; // 0 to 100 (represents kinetic motion boundary speed)
  vibrationSpeed: number; // oscillation frequency multiplier
  visualizationMode: 'ball-stick' | 'space-filling' | 'wireframe';
  showElectronCloud: boolean;
  isSimulating: boolean;
  orbitSpeed: number; // Planetary orbit speed (0 to 100)
  showOrbitPaths: boolean; // Planetary orbit line toggle
  cellPulseSpeed: number; // Cellular membrane pulse speed (0 to 100)
  showMitochondriaOutline: boolean; // Cell organelles outline toggle
  solarSystemSpeed: number; // Cosmic scale solar orbit multiplier (0 to 100)
  showOrbitTrails: boolean; // Cosmic scale orbit path trails
  quarkSpinSpeed: number; // Quantum scale quark spin multiplier (0 to 100)
  gluonBindingStrength: number; // Quantum scale gluon string tension (0 to 100)
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
