'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplorerStore } from '../../store/useExplorerStore';
import { Atom, Bond } from '../../types';

// CPK Color code mappings (tailored for high visual contrast neon design)
const CPK_MAP: Record<string, { color: string; emissive: string; size: number; name: string }> = {
  H: { color: '#FFFFFF', emissive: '#CCCCCC', size: 0.35, name: 'Hydrogen' },
  C: { color: '#1E293B', emissive: '#334155', size: 0.65, name: 'Carbon' },
  O: { color: '#FF007A', emissive: '#FF007A', size: 0.55, name: 'Oxygen' },
  N: { color: '#00F5FF', emissive: '#00F5FF', size: 0.60, name: 'Nitrogen' },
  P: { color: '#EAB308', emissive: '#CA8A04', size: 0.75, name: 'Phosphorus' },
  Cl: { color: '#00FF9D', emissive: '#00FF9D', size: 0.70, name: 'Chlorine' },
  Na: { color: '#8B5CF6', emissive: '#7C3AED', size: 0.80, name: 'Sodium' },
  default: { color: '#6C63FF', emissive: '#6C63FF', size: 0.50, name: 'Element' }
};

// Sub-component: 3D Bond Cylinder
interface BondProps {
  fromAtom: Atom;
  toAtom: Atom;
  type: Bond['type'];
  mode: 'ball-stick' | 'space-filling' | 'wireframe';
  vibrationOffsetFrom: THREE.Vector3;
  vibrationOffsetTo: THREE.Vector3;
}

const BondCylinder: React.FC<BondProps> = ({
  fromAtom,
  toAtom,
  type,
  mode,
  vibrationOffsetFrom,
  vibrationOffsetTo
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const sphereRefs = useRef<THREE.Mesh[]>([]);

  // If in space-filling mode, bonds are swallowed by large atom spheres
  if (mode === 'space-filling') return null;

  const radius = mode === 'wireframe' ? 0.02 : 0.08;

  const commonMaterial = mode === 'wireframe' ? (
    <meshBasicMaterial color="#6C63FF" transparent opacity={0.4} wireframe />
  ) : (
    <meshStandardMaterial
      color="#1E293B"
      emissive="#6C63FF"
      emissiveIntensity={0.4}
      roughness={0.1}
      metalness={0.8}
    />
  );

  const posA = new THREE.Vector3(fromAtom.x, fromAtom.y, fromAtom.z).add(vibrationOffsetFrom);
  const posB = new THREE.Vector3(toAtom.x, toAtom.y, toAtom.z).add(vibrationOffsetTo);
  const midpoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
  const distance = posA.distanceTo(posB);
  const direction = new THREE.Vector3().subVectors(posB, posA).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

  useFrame(() => {
    if (!meshRef.current) return;

    const currentPosA = new THREE.Vector3(fromAtom.x, fromAtom.y, fromAtom.z).add(vibrationOffsetFrom);
    const currentPosB = new THREE.Vector3(toAtom.x, toAtom.y, toAtom.z).add(vibrationOffsetTo);

    const currentMidpoint = new THREE.Vector3().addVectors(currentPosA, currentPosB).multiplyScalar(0.5);
    const currentDistance = currentPosA.distanceTo(currentPosB);
    const currentDirection = new THREE.Vector3().subVectors(currentPosB, currentPosA).normalize();
    const currentQuaternion = new THREE.Quaternion().setFromUnitVectors(up, currentDirection);

    meshRef.current.position.copy(currentMidpoint);
    meshRef.current.quaternion.copy(currentQuaternion);
    meshRef.current.scale.set(1, currentDistance, 1);

    if (type === 'hydrogen') {
      sphereRefs.current.forEach((ref) => {
        if (ref) {
          ref.scale.set(1, 1 / currentDistance, 1);
        }
      });
    }
  });

  const renderCylinders = () => {
    if (type === 'hydrogen') {
      const spheresCount = 5;
      return (
        <>
          {Array.from({ length: spheresCount }).map((_, i) => {
            const t = (i / (spheresCount - 1)) - 0.5;
            return (
              <group key={i} position={[0, t, 0]}>
                <mesh
                  ref={(el) => {
                    if (el) sphereRefs.current[i] = el;
                  }}
                >
                  <sphereGeometry args={[radius * 1.2, 8, 8]} />
                  <meshBasicMaterial color="#00F5FF" transparent opacity={0.8} />
                </mesh>
              </group>
            );
          })}
        </>
      );
    }

    if (type === 'double') {
      return (
        <>
          <mesh position={[-0.12, 0, 0]}>
            <cylinderGeometry args={[radius * 0.8, radius * 0.8, 1, 8]} />
            {commonMaterial}
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <cylinderGeometry args={[radius * 0.8, radius * 0.8, 1, 8]} />
            {commonMaterial}
          </mesh>
        </>
      );
    }

    if (type === 'triple') {
      return (
        <>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[radius * 0.7, radius * 0.7, 1, 8]} />
            {commonMaterial}
          </mesh>
          <mesh position={[-0.16, 0, 0]}>
            <cylinderGeometry args={[radius * 0.6, radius * 0.6, 1, 8]} />
            {commonMaterial}
          </mesh>
          <mesh position={[0.16, 0, 0]}>
            <cylinderGeometry args={[radius * 0.6, radius * 0.6, 1, 8]} />
            {commonMaterial}
          </mesh>
        </>
      );
    }

    return (
      <mesh>
        <cylinderGeometry args={[radius, radius, 1, 8]} />
        {commonMaterial}
      </mesh>
    );
  };

  return (
    <group ref={meshRef} position={midpoint} quaternion={quaternion} scale={[1, distance, 1]}>
      {renderCylinders()}
    </group>
  );
};

export const MoleculeScene: React.FC = () => {
  const { activeMolecule, simulationParams, detectedGesture } = useExplorerStore();
  const { temperature, vibrationSpeed, visualizationMode, showElectronCloud } = simulationParams;
  const moleculeGroupRef = useRef<THREE.Group>(null);

  // Phase offsets for organic uncoordinated vibrations
  const vibrationPhases = useMemo(() => {
    return activeMolecule.atoms.map(() => ({
      x: Math.random() * Math.PI * 2,
      y: Math.random() * Math.PI * 2,
      z: Math.random() * Math.PI * 2,
      freqMod: 0.8 + Math.random() * 0.4
    }));
  }, [activeMolecule]);

  const offsets = useMemo(() => {
    return activeMolecule.atoms.map(() => new THREE.Vector3());
  }, [activeMolecule]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const isGrab = detectedGesture === 'grab';
    const tempIntensity = (isGrab ? 100 : temperature) / 1000;
    
    // Smooth rotational drift with fluid multi-axis wiggles (realistic gas/fluid kinetic rotation)
    if (moleculeGroupRef.current) {
      if (!simulationParams.isSimulating) {
        moleculeGroupRef.current.rotation.y = time * 0.05;
      } else {
        moleculeGroupRef.current.rotation.y = time * 0.08 + Math.sin(time * 0.15) * 0.02;
        moleculeGroupRef.current.rotation.x = Math.sin(time * 0.25) * 0.04 + Math.cos(time * 0.1) * 0.01;
        moleculeGroupRef.current.rotation.z = Math.cos(time * 0.2) * 0.025;
      }
    }

    // High-fidelity Multi-Harmonic thermal vibrations (Keplerian/Brownian jitter)
    activeMolecule.atoms.forEach((_, idx) => {
      const phases = vibrationPhases[idx];
      const offset = offsets[idx];
      
      if (phases && offset && simulationParams.isSimulating) {
        const baseFreq = isGrab ? 42 : 14 + vibrationSpeed * 11;
        const freq = baseFreq * phases.freqMod;
        
        // Multi-frequency superposition (harmonic combinations) representing realistic thermal noise
        const shakeX = Math.sin(time * freq + phases.x) * 0.7 + 
                       Math.sin(time * freq * 2.15 + phases.y) * 0.22 + 
                       Math.cos(time * freq * 0.47) * 0.08;

        const shakeY = Math.cos(time * freq * 0.95 + phases.y) * 0.7 + 
                       Math.sin(time * freq * 1.84 + phases.z) * 0.22 + 
                       Math.sin(time * freq * 0.58) * 0.08;

        const shakeZ = Math.sin(time * freq * 1.12 + phases.z) * 0.7 + 
                       Math.cos(time * freq * 2.38 + phases.x) * 0.22 + 
                       Math.cos(time * freq * 0.39) * 0.08;

        offset.set(
          shakeX * tempIntensity,
          shakeY * tempIntensity,
          shakeZ * tempIntensity
        );
      }
    });
  });

  return (
    <group ref={moleculeGroupRef}>
      {/* Render Bonds */}
      {activeMolecule.bonds.map((bond, idx) => {
        const fromAtom = activeMolecule.atoms.find(a => a.id === bond.from);
        const toAtom = activeMolecule.atoms.find(a => a.id === bond.to);
        
        if (!fromAtom || !toAtom) return null;
        
        return (
          <BondCylinder
            key={`bond-${idx}`}
            fromAtom={fromAtom}
            toAtom={toAtom}
            type={bond.type}
            mode={visualizationMode}
            vibrationOffsetFrom={offsets[fromAtom.id] || new THREE.Vector3()}
            vibrationOffsetTo={offsets[toAtom.id] || new THREE.Vector3()}
          />
        );
      })}

      {/* Render Atoms */}
      {activeMolecule.atoms.map((atom, idx) => {
        const specs = CPK_MAP[atom.element] || CPK_MAP.default;
        
        let displayRadius = specs.size;
        if (visualizationMode === 'space-filling') {
          displayRadius = specs.size * 1.8;
        } else if (visualizationMode === 'wireframe') {
          displayRadius = specs.size * 0.7;
        }

        return (
          <AtomMesh
            key={`atom-${atom.id}`}
            atom={atom}
            radius={displayRadius}
            specs={specs}
            mode={visualizationMode}
            showCloud={showElectronCloud}
            offset={offsets[atom.id] || new THREE.Vector3()}
          />
        );
      })}
    </group>
  );
};

// Sub-component: 3D Atom Mesh with optional Electron Cloud shell
interface AtomMeshProps {
  atom: Atom;
  radius: number;
  specs: typeof CPK_MAP.H;
  mode: 'ball-stick' | 'space-filling' | 'wireframe';
  showCloud: boolean;
  offset: THREE.Vector3;
}

const AtomMesh: React.FC<AtomMeshProps> = ({
  atom,
  radius,
  specs,
  mode,
  showCloud,
  offset
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(atom.x + offset.x, atom.y + offset.y, atom.z + offset.z);
    }
  });

  return (
    <group>
      {/* Main Atom sphere */}
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 32, 32]} />
        {mode === 'wireframe' ? (
          <meshBasicMaterial color={specs.color} wireframe transparent opacity={0.6} />
        ) : (
          <meshStandardMaterial
            color={specs.color}
            emissive={specs.emissive}
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={atom.element === 'C' ? 0.9 : 0.2}
          />
        )}
      </mesh>

      {/* Electron Cloud Shell */}
      {showCloud && mode !== 'wireframe' && (
        <mesh position={[atom.x + offset.x, atom.y + offset.y, atom.z + offset.z]}>
          <sphereGeometry args={[radius * 2.4, 24, 24]} />
          <meshBasicMaterial
            color={specs.color}
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
