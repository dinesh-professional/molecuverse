'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplorerStore } from '../../store/useExplorerStore';

// Quark sub-component with dynamic color-charge HSL cycling
const QuarkMesh: React.FC<{
  positionRef: React.RefObject<THREE.Vector3>;
  hueOffset: number;
  name: string;
  charge: string;
}> = ({ positionRef, hueOffset, name, charge }) => {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame((state) => {
    if (meshRef.current && positionRef.current) {
      meshRef.current.position.copy(positionRef.current);
    }
    
    // Smooth QCD color-charge cycle: Red -> Green -> Blue in HSL space
    const time = state.clock.getElapsedTime();
    const hue = (time * 80 + hueOffset) % 360;
    
    if (materialRef.current) {
      // Safely set HSL color values using Three.js built-in API
      materialRef.current.color.setHSL(hue / 360, 1.0, 0.55);
      materialRef.current.emissive.setHSL(hue / 360, 1.0, 0.55);
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial 
          ref={materialRef}
          roughness={0.2} 
          metalness={0.8}
          emissiveIntensity={0.65}
        />
      </mesh>
    </group>
  );
};

const GluonField: React.FC<{
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  strength: number;
  speed: number;
}> = ({ start, end, color, strength, speed }) => {
  const pointsRef = useRef<THREE.Group>(null);
  const numPoints = 18;
  const beads = useMemo(() => Array.from({ length: numPoints }), []);
  
  const baselineDist = 2.25; // Approximate resting distance between quarks

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!pointsRef.current) return;
    
    const children = pointsRef.current.children;
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    dir.normalize();
    
    // Orthonormal basis vector creation
    const temp = Math.abs(dir.y) < 0.99 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const u = new THREE.Vector3().crossVectors(dir, temp).normalize();
    const v = new THREE.Vector3().crossVectors(dir, u).normalize();
    
    const coils = 3.5;
    
    // Asymptotic Freedom Physics:
    const stretch = len / baselineDist;
    const waveAmp = 0.28 * (1.0 - strength / 130) * Math.max(0.2, 1.8 - stretch);
    const waveFreq = time * (speed / 30) * 15 * Math.max(0.5, stretch * 1.5);
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const pos = new THREE.Vector3().lerpVectors(start, end, t);
      
      const angle = t * Math.PI * 2 * coils + waveFreq;
      const envelope = Math.sin(t * Math.PI); // Keep endpoints fixed on quarks
      const amp = waveAmp * envelope;
      
      pos.addScaledVector(u, Math.cos(angle) * amp);
      pos.addScaledVector(v, Math.sin(angle) * amp);
      
      const child = children[i] as THREE.Mesh;
      if (child) {
        child.position.copy(pos);
      }
    }
  });

  return (
    <group ref={pointsRef}>
      {beads.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.85} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      ))}
    </group>
  );
};

export const QuarkScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Shared coordinate references for dynamic linking
  const q1Pos = useRef(new THREE.Vector3(0, 1.1, 0));
  const q2Pos = useRef(new THREE.Vector3(-1.0, -0.6, 0.6));
  const q3Pos = useRef(new THREE.Vector3(1.0, -0.6, -0.6));
  
  const { simulationParams, detectedGesture } = useExplorerStore();
  const { quarkSpinSpeed, gluonBindingStrength } = simulationParams;

  const isGrab = detectedGesture === 'grab';
  const speedMult = isGrab ? 3.0 : 1.0;
  const activeSpinSpeed = quarkSpinSpeed * speedMult;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const spinMultiplier = activeSpinSpeed / 30;
    
    // Orbital path calculations
    const radius = 1.3;
    const angle1 = time * 0.7 * spinMultiplier;
    const angle2 = angle1 + (Math.PI * 2) / 3;
    const angle3 = angle1 + (Math.PI * 4) / 3;
    
    // Quantum vibration (jitter) responding to binding strength
    const vibFreq = 30 + gluonBindingStrength * 0.25;
    const vibAmp = 0.09 * (1.0 - gluonBindingStrength / 115);
    
    const jitter = (offset: number) => Math.sin(time * vibFreq + offset) * vibAmp;
    
    q1Pos.current.set(
      Math.cos(angle1) * radius + jitter(0),
      jitter(1),
      Math.sin(angle1) * radius + jitter(2)
    );
    q2Pos.current.set(
      Math.cos(angle2) * radius + jitter(3),
      jitter(4),
      Math.sin(angle2) * radius + jitter(5)
    );
    q3Pos.current.set(
      Math.cos(angle3) * radius + jitter(6),
      jitter(7),
      Math.sin(angle3) * radius + jitter(8)
    );

    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      groupRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Proton Boundary Shell */}
      <mesh>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshBasicMaterial 
          color="#FF007A" 
          wireframe 
          transparent 
          opacity={0.06} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.42, 16, 16]} />
        <meshBasicMaterial 
          color="#6C63FF" 
          wireframe 
          transparent 
          opacity={0.03} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Valence Quarks with 120-degree HSL offsets for full Red-Green-Blue combination */}
      <QuarkMesh positionRef={q1Pos} hueOffset={0} name="Up" charge="+2/3" />
      <QuarkMesh positionRef={q2Pos} hueOffset={120} name="Up" charge="+2/3" />
      <QuarkMesh positionRef={q3Pos} hueOffset={240} name="Down" charge="-1/3" />

      {/* Gluon Fields */}
      <GluonField 
        start={q1Pos.current} 
        end={q2Pos.current} 
        color="#00FF9D" 
        strength={gluonBindingStrength} 
        speed={activeSpinSpeed} 
      />
      <GluonField 
        start={q2Pos.current} 
        end={q3Pos.current} 
        color="#FF007A" 
        strength={gluonBindingStrength} 
        speed={activeSpinSpeed} 
      />
      <GluonField 
        start={q3Pos.current} 
        end={q1Pos.current} 
        color="#00F5FF" 
        strength={gluonBindingStrength} 
        speed={activeSpinSpeed} 
      />

      {/* Quantum Lattice Coordinates grid */}
      <gridHelper
        args={[10, 10, '#FF007A', '#1C122C']}
        position={[0, -2.0, 0] as const}
        material-transparent={true}
        material-opacity={0.08}
      />
    </group>
  );
};
