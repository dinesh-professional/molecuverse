'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplorerStore } from '../../store/useExplorerStore';

export const AtomScene: React.FC = () => {
  const nucleusRef = useRef<THREE.Group>(null);
  const shellRef1 = useRef<THREE.Group>(null);
  const shellRef2 = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Points>(null);
  const { simulationParams, detectedGesture } = useExplorerStore();
  const { temperature } = simulationParams;

  // Generate nucleon coordinates (dense bundle of protons and neutrons)
  const nucleons = useMemo(() => {
    const list = [];
    const count = 14; // Nitrogen/Carbon nucleus scale
    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on sphere for packing nucleons
      const phi = Math.acos(-1.0 + (2.0 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 0.52;
      
      const x = Math.sin(phi) * Math.cos(theta) * radius + (Math.random() - 0.5) * 0.08;
      const y = Math.sin(phi) * Math.sin(theta) * radius + (Math.random() - 0.5) * 0.08;
      const z = Math.cos(phi) * radius + (Math.random() - 0.5) * 0.08;
      
      list.push({
        basePos: new THREE.Vector3(x, y, z),
        type: i % 2 === 0 ? 'proton' : 'neutron',
        phaseOffset: Math.random() * Math.PI * 2
      });
    }
    return list;
  }, []);

  // Generate electron cloud particle coordinates (Quantum probability cloud)
  const cloudParticles = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Gaussian distribution for electron orbital shell probability
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      // Radius distribution peaking around 2.5 and 4.2 units (representing orbitals)
      const r = (Math.random() > 0.4 ? 2.5 : 4.2) + (Math.random() - 0.5) * 0.8;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  const nucleonRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const isGrab = detectedGesture === 'grab';
    const shakeFactor = isGrab ? 8 : 1 + (temperature / 35);
    const orbitalSpeedMult = isGrab ? 6 : 1 + (temperature / 100);

    // Liquid Drop Model: Individual nucleon vibrations to represent high-energy nuclear bounds
    nucleons.forEach((n, idx) => {
      const mesh = nucleonRefs.current[idx];
      if (mesh) {
        // High frequency micro-jitter unique to each nucleon
        const freq = 45 + idx * 2;
        const amplitude = 0.015 * shakeFactor;
        
        mesh.position.set(
          n.basePos.x + Math.sin(time * freq + n.phaseOffset) * amplitude,
          n.basePos.y + Math.cos(time * (freq + 3) + n.phaseOffset) * amplitude,
          n.basePos.z + Math.sin(time * (freq - 4) + n.phaseOffset) * amplitude
        );
      }
    });

    // Nucleus rotation drift
    if (nucleusRef.current) {
      nucleusRef.current.rotation.y = time * 0.25;
      nucleusRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    }

    // Electron orbital rotation (Classic Bohr orbit rings)
    // Electrons move at relativistic-like high speeds
    if (shellRef1.current) {
      shellRef1.current.rotation.z = time * 12.0 * orbitalSpeedMult;
    }
    if (shellRef2.current) {
      shellRef2.current.rotation.x = time * 8.0 * orbitalSpeedMult;
      shellRef2.current.rotation.y = time * 9.0 * orbitalSpeedMult;
    }

    // Wavefunction oscillation: modulate quantum probability cloud scaling
    if (cloudRef.current) {
      cloudRef.current.rotation.y = time * 0.04 * orbitalSpeedMult;
      
      const wavePulse = 1.0 + Math.sin(time * 10) * 0.02 * (temperature / 50);
      cloudRef.current.scale.setScalar(wavePulse);
    }
  });

  return (
    <group>
      {/* 1. Nucleus Core (Protons & Neutrons - Liquid Drop Model) */}
      <group ref={nucleusRef}>
        {nucleons.map((n, idx) => (
          <mesh 
            key={idx} 
            ref={(el) => {
              if (el) nucleonRefs.current[idx] = el;
            }}
            position={n.basePos}
          >
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color={n.type === 'proton' ? '#FF007A' : '#94A3B8'}
              emissive={n.type === 'proton' ? '#FF007A' : '#475569'}
              emissiveIntensity={0.65}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* 2. Quantum Electron Probability Density Cloud */}
      <points ref={cloudRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={cloudParticles}
            count={cloudParticles.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00F5FF"
          size={0.05}
          transparent
          opacity={0.35}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3. High-Speed Relativistic Orbit Shell Rings */}
      <group ref={shellRef1}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.51, 64]} />
          <meshBasicMaterial color="#00F5FF" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        {/* Electron 1 with tail visual */}
        <mesh position={[2.5, 0, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#00F5FF" />
        </mesh>
        <mesh position={[2.46, 0.4, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#00F5FF" transparent opacity={0.4} />
        </mesh>
        {/* Electron 2 */}
        <mesh position={[-2.5, 0, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#00F5FF" />
        </mesh>
        <mesh position={[-2.46, -0.4, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#00F5FF" transparent opacity={0.4} />
        </mesh>
      </group>

      <group ref={shellRef2}>
        <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
          <ringGeometry args={[4.2, 4.21, 64]} />
          <meshBasicMaterial color="#00FF9D" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        {/* Electron 3 */}
        <mesh position={[0, 4.2, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#00FF9D" />
        </mesh>
        <mesh position={[0.3, 4.15, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#00FF9D" transparent opacity={0.4} />
        </mesh>
        {/* Electron 4 */}
        <mesh position={[0, -4.2, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#00FF9D" />
        </mesh>
        <mesh position={[-0.3, -4.15, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#00FF9D" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Subatomic grid lines */}
      <gridHelper
        args={[20, 20, '#FF007A', '#141C34']}
        position={[0, -5, 0] as const}
        material-transparent={true}
        material-opacity={0.15}
      />
    </group>
  );
};
