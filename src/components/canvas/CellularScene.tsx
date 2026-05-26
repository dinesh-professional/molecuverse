'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplorerStore } from '../../store/useExplorerStore';

// Golgi Apparatus nested stacks representation
const GolgiApparatus: React.FC = () => {
  return (
    <group position={[1.4, 0.4, -0.8]} rotation={[0.4, 0.7, -0.2]}>
      {Array.from({ length: 4 }).map((_, i) => {
        const radius = 0.5 + i * 0.16;
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.02, radius + 0.02, 32, 1, 0, Math.PI * 0.75]} />
            <meshStandardMaterial 
              color="#FF007A" 
              emissive="#FF007A" 
              emissiveIntensity={0.5} 
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.65} 
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Endoplasmic Reticulum wrapping the nucleus
const EndoplasmicReticulum: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const scaleVal = 1.0 + Math.sin(time * 0.5) * 0.015;
      meshRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      meshRef.current.rotation.y = time * 0.015;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.75, 12, 12]} />
      <meshBasicMaterial 
        color="#8B5CF6" 
        wireframe 
        transparent 
        opacity={0.12} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Cytoskeleton Microtubules stretching from nucleus to membrane
const MicrotubuleLine: React.FC<{ start: THREE.Vector3; control: THREE.Vector3; end: THREE.Vector3 }> = ({ start, control, end }) => {
  const lineMesh = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    const points = curve.getPoints(20);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: '#6C63FF',
      transparent: true,
      opacity: 0.16
    });
    return new THREE.Line(geom, mat);
  }, [start, control, end]);

  return <primitive object={lineMesh} />;
};

export const CellularScene: React.FC = () => {
  const membraneRef = useRef<THREE.Mesh>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const organellesGroupRef = useRef<THREE.Group>(null);
  const streamPointsRef = useRef<THREE.Points>(null);
  
  const { simulationParams, detectedGesture } = useExplorerStore();
  const { cellPulseSpeed, showMitochondriaOutline } = simulationParams;

  const isGrab = detectedGesture === 'grab';
  const speedMult = isGrab ? 3.0 : 1.0;

  // Generate coordinates for floating organelles
  const organelles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2.0 + Math.random() * 0.6;
      const speed = 0.15 + Math.random() * 0.2;
      return {
        pos: new THREE.Vector3(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 1.2,
          Math.sin(angle) * radius
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          0
        ),
        scale: 0.14 + Math.random() * 0.12,
        speed,
        phase: Math.random() * Math.PI * 2
      };
    });
  }, []);

  // Generate cytoplasmic streaming nutrient particles (ribosomes / proteins)
  const streamParticles = useMemo(() => {
    const count = 40;
    const list = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.6 + Math.random() * 2.0;
      const height = (Math.random() - 0.5) * 2.4;
      const speed = 0.2 + Math.random() * 0.4;
      const phase = Math.random() * Math.PI;
      const size = 0.02 + Math.random() * 0.03;
      return { angle, radius, height, speed, phase, size };
    });
    return list;
  }, []);

  // Generate cytoskeleton network lines
  const microtubules = useMemo(() => {
    const list = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const start = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * 1.3,
        Math.sin(phi) * Math.sin(theta) * 1.3,
        Math.cos(phi) * 1.3
      );
      const end = start.clone().multiplyScalar(2.7);
      
      const control = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7
        ));
        
      list.push({ start, control, end });
    }
    return list;
  }, []);

  const streamPositions = useMemo(() => new Float32Array(streamParticles.length * 3), [streamParticles]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pulseMultiplier = (cellPulseSpeed / 20) * speedMult;

    // Organic fluid membrane uneven deformation (representing cytoplasmic streaming / fluid pressure)
    if (membraneRef.current) {
      membraneRef.current.rotation.y = time * 0.03 * speedMult;
      membraneRef.current.rotation.x = time * 0.015 * speedMult;
      
      const scaleX = 1.0 + Math.sin(time * 1.1 * pulseMultiplier) * 0.035 + Math.cos(time * 0.5 * speedMult) * 0.01;
      const scaleY = 1.0 + Math.cos(time * 0.8 * pulseMultiplier) * 0.035 + Math.sin(time * 0.7 * speedMult) * 0.01;
      const scaleZ = 1.0 + Math.sin(time * 1.4 * pulseMultiplier) * 0.035 + Math.cos(time * 0.4 * speedMult) * 0.01;
      
      membraneRef.current.scale.set(scaleX, scaleY, scaleZ);
    }

    // Nucleus squishy vibration
    if (nucleusRef.current) {
      nucleusRef.current.rotation.y = -time * 0.05 * speedMult;
      
      const nScaleX = 1.0 + Math.cos(time * 1.5 * pulseMultiplier) * 0.02;
      const nScaleY = 1.0 + Math.sin(time * 1.2 * pulseMultiplier) * 0.02;
      const nScaleZ = 1.0 + Math.cos(time * 1.8 * pulseMultiplier) * 0.02;
      
      nucleusRef.current.scale.set(nScaleX, nScaleY, nScaleZ);
    }

    // Organelles multi-axis organic drift (representing cytoplasmic floating)
    if (organellesGroupRef.current) {
      organellesGroupRef.current.children.forEach((child, idx) => {
        const data = organelles[idx];
        if (data) {
          const rate = data.speed * speedMult;
          const driftX = Math.sin(time * rate + data.phase) * 0.18 + Math.cos(time * 0.3 * speedMult + data.phase) * 0.06;
          const driftY = Math.cos(time * rate * 0.85 + data.phase) * 0.18 + Math.sin(time * 0.4 * speedMult + data.phase) * 0.06;
          const driftZ = Math.sin(time * rate * 0.7 + data.phase) * 0.14 + Math.cos(time * 0.25 * speedMult + data.phase) * 0.06;
          
          child.position.set(
            data.pos.x + driftX,
            data.pos.y + driftY,
            data.pos.z + driftZ
          );
          child.rotation.x += 0.004 * speedMult;
          child.rotation.y += 0.002 * speedMult;
          child.rotation.z += 0.001 * speedMult;
        }
      });
    }

    // Cytoplasmic Streaming Flow updates (orbiting particles inside cell)
    if (streamPointsRef.current) {
      const posAttr = streamPointsRef.current.geometry.attributes.position;
      if (posAttr) {
        streamParticles.forEach((p, i) => {
          const flowAngle = p.angle + time * p.speed * 0.25 * pulseMultiplier;
          const bounce = Math.sin(time * 0.5 + p.phase) * 0.08;
          
          streamPositions[i * 3] = Math.cos(flowAngle) * p.radius;
          streamPositions[i * 3 + 1] = p.height + bounce;
          streamPositions[i * 3 + 2] = Math.sin(flowAngle) * p.radius;
        });
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Semi-transparent Cytoplasm/Cell Membrane */}
      <mesh ref={membraneRef}>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00FF9D"
          emissiveIntensity={0.2}
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Membrane Wireframe Overlay for technical structure */}
      <mesh>
        <sphereGeometry args={[4.22, 32, 32]} />
        <meshBasicMaterial
          color="#00FF9D"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Cell Nucleus (Glowing center) */}
      <mesh ref={nucleusRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial
          color="#6C63FF"
          emissive="#6C63FF"
          emissiveIntensity={0.4}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Nuclear Pores on nuclear membrane */}
      <points>
        <sphereGeometry args={[1.32, 24, 24]} />
        <pointsMaterial color="#FF007A" size={0.04} transparent opacity={0.75} sizeAttenuation />
      </points>
      
      {/* Inner Nucleolus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#FF007A" transparent opacity={0.9} />
      </mesh>

      {/* Cytoskeleton Structural Filament Lines */}
      {microtubules.map((tube, idx) => (
        <MicrotubuleLine key={idx} {...tube} />
      ))}

      {/* Folded Endoplasmic Reticulum wrapping the nucleus */}
      <EndoplasmicReticulum />

      {/* Golgi Apparatus Stack */}
      <GolgiApparatus />

      {/* Floating Organelles (Mitochondria with Cristae & Lysosomes) */}
      <group ref={organellesGroupRef}>
        {organelles.map((data, idx) => (
          <group key={idx} position={data.pos} rotation={data.rotation}>
            {/* Mitochondria shape (stretched capsule with inner folds) */}
            {idx % 2 === 0 ? (
              <group scale={[data.scale * 2.2, data.scale, data.scale]}>
                {/* Outer membrane (transparent) */}
                <mesh>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshStandardMaterial
                    color="#00FF9D"
                    emissive="#00FF9D"
                    emissiveIntensity={0.3}
                    roughness={0.2}
                    transparent
                    opacity={0.45}
                    wireframe={showMitochondriaOutline}
                  />
                </mesh>
                {/* Inner cristae membrane folds */}
                {!showMitochondriaOutline && (
                  <group scale={[0.85, 0.7, 0.7]}>
                    {Array.from({ length: 5 }).map((_, fIdx) => (
                      <mesh key={fIdx} position={[(fIdx - 2) * 0.35, 0, 0]}>
                        <torusGeometry args={[0.6, 0.15, 8, 24]} />
                        <meshStandardMaterial color="#059669" emissive="#047857" emissiveIntensity={0.25} />
                      </mesh>
                    ))}
                  </group>
                )}
              </group>
            ) : (
              // Lysosome (glowing green sphere)
              <mesh scale={[data.scale, data.scale, data.scale]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  color="#00F5FF"
                  emissive="#00F5FF"
                  emissiveIntensity={0.6}
                  roughness={0.1}
                  transparent
                  opacity={0.8}
                  wireframe={showMitochondriaOutline}
                />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Cytoplasmic Streaming Nutrient Particles */}
      <points ref={streamPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={streamPositions}
            count={streamParticles.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#00FF9D" 
          size={0.06} 
          transparent 
          opacity={0.5} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Cellular grid mesh */}
      <gridHelper
        args={[30, 30, '#00FF9D', '#141C34']}
        position={[0, -4.5, 0] as const}
        material-transparent={true}
        material-opacity={0.15}
      />
    </group>
  );
};
