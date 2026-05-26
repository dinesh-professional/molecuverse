'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplorerStore } from '../../store/useExplorerStore';

export const ParticleZoomEffect: React.FC = () => {
  const { scale } = useExplorerStore();
  const pointsRef = useRef<THREE.Points>(null);
  
  // Track animation state locally
  const animationState = useRef({
    progress: 1.0, // 0 to 1, 1 means finished
    direction: 1, // 1: zoom in, -1: zoom out
  });

  const particleCount = 120;

  // Generate particle velocities and initial positions
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vels = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Direct particles in a cylindrical tunnel direction (along Z axis mostly)
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 3;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20; // spread along Z axis

      vels[i * 3] = Math.cos(angle) * 0.1;
      vels[i * 3 + 1] = Math.sin(angle) * 0.1;
      vels[i * 3 + 2] = (Math.random() + 0.5) * 8.0; // speed along Z
    }
    return [pos, vels];
  }, []);

  // Trigger effect when scale changes
  useEffect(() => {
    animationState.current.progress = 0.0;
  }, [scale]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    
    const state = animationState.current;
    if (state.progress < 1.0) {
      state.progress += delta * 1.5; // Complete in ~0.7 seconds
      
      const geom = pointsRef.current.geometry;
      if (!geom) return;
      const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
      if (!posAttr) return;
      
      // Update particles along Z axis to simulate fly-through tunnel
      for (let i = 0; i < particleCount; i++) {
        const zVel = velocities[i * 3 + 2] || 0;
        posAttr.setZ(
          i,
          positions[i * 3 + 2]! + zVel * state.progress * 15.0 * (scale === 'earth' ? -1 : 1)
        );
      }
      posAttr.needsUpdate = true;
      
      // Fade particles out as progress reaches 1.0
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = Math.sin(state.progress * Math.PI) * 0.8;
      }
      
      // Rotate the tunnel slightly for dynamic spin
      pointsRef.current.rotation.z += 0.02;
    } else {
      // Hide when not active
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = 0;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00F5FF"
        size={0.12}
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
