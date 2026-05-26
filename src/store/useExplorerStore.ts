import { create } from 'zustand';
import { ScaleLevel, SimulationParams, Message, Molecule } from '../types';
import { MOLECULES } from '../utils/molecules';

interface ExplorerState {
  // Navigation & Scale
  scale: ScaleLevel;
  zoom: number; // 0 to 100 within current scale or continuous scale indicator
  setScale: (scale: ScaleLevel) => void;
  setZoom: (zoom: number) => void;
  
  // View State for Smooth Transition
  currentView: 'landing' | 'explorer';
  setView: (view: 'landing' | 'explorer') => void;

  // Selected Molecule
  activeMoleculeId: string;
  activeMolecule: Molecule;
  setActiveMoleculeId: (id: string) => void;
  
  // Simulation Settings
  simulationParams: SimulationParams;
  updateSimulationParam: <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => void;
  resetSimulation: () => void;
  
  // Chat AI state
  chatMessages: Message[];
  addChatMessage: (msg: Message) => void;
  isChatLoading: boolean;
  setChatLoading: (loading: boolean) => void;
  
  // Gesture State
  isWebcamActive: boolean;
  setWebcamActive: (active: boolean) => void;
  detectedGesture: 'none' | 'pinch' | 'rotate' | 'grab' | 'calibration';
  setDetectedGesture: (gesture: 'none' | 'pinch' | 'rotate' | 'grab' | 'calibration') => void;
  gestureX: number;
  gestureY: number;
  setGestureCoords: (x: number, y: number) => void;
  
  // Quiz
  score: number;
  addScore: (points: number) => void;
  resetScore: () => void;

  // Responsive Layout state
  isMobile: boolean;
  setMobile: (isMobile: boolean) => void;
}

const initialSimulationParams: SimulationParams = {
  temperature: 25,
  pressure: 50,
  vibrationSpeed: 1,
  visualizationMode: 'ball-stick',
  showElectronCloud: true,
  isSimulating: true,
  orbitSpeed: 30,
  showOrbitPaths: true,
  cellPulseSpeed: 20,
  showMitochondriaOutline: true,
  solarSystemSpeed: 30,
  showOrbitTrails: true,
  quarkSpinSpeed: 30,
  gluonBindingStrength: 50
};

const initialChatMessages: Message[] = [
  {
    sender: 'ai',
    text: "Welcome to MolecuVerse AI terminal. Ask me any question about molecular physics, covalent bonding, organic polymers, or biochemical interactions. I can analyze the molecule currently loaded in your focus viewport.",
    timestamp: "09:00 AM"
  }
];

export const useExplorerStore = create<ExplorerState>((set) => ({
  // Navigation
  scale: 'galaxy',
  zoom: 10,
  setScale: (scale) => set({ scale }),
  setZoom: (zoom) => set({ zoom }),
  
  // View State
  currentView: 'landing',
  setView: (currentView) => set({ currentView }),
  
  // Selected Molecule
  activeMoleculeId: 'h2o',
  activeMolecule: MOLECULES[0],
  setActiveMoleculeId: (id) => set(() => {
    const mol = MOLECULES.find(m => m.id === id) || MOLECULES[0];
    return { 
      activeMoleculeId: id,
      activeMolecule: mol
    };
  }),
  
  // Simulation
  simulationParams: initialSimulationParams,
  updateSimulationParam: (key, value) => set((state) => ({
    simulationParams: {
      ...state.simulationParams,
      [key]: value
    }
  })),
  resetSimulation: () => set({ simulationParams: initialSimulationParams }),
  
  // Chat
  chatMessages: initialChatMessages,
  addChatMessage: (msg) => set((state) => ({
    chatMessages: [...state.chatMessages, msg]
  })),
  isChatLoading: false,
  setChatLoading: (isChatLoading) => set({ isChatLoading }),
  
  // Gesture
  isWebcamActive: false,
  setWebcamActive: (isWebcamActive) => set({ isWebcamActive }),
  detectedGesture: 'none',
  setDetectedGesture: (detectedGesture) => set({ detectedGesture }),
  gestureX: 0.5,
  gestureY: 0.5,
  setGestureCoords: (gestureX, gestureY) => set({ gestureX, gestureY }),
  
  // Quiz
  score: 0,
  addScore: (points) => set((state) => ({ score: state.score + points })),
  resetScore: () => set({ score: 0 }),
  
  // Responsive Layout
  isMobile: false,
  setMobile: (isMobile) => set({ isMobile })
}));
