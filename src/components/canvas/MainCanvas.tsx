'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useExplorerStore } from '../../store/useExplorerStore';
import { ScaleLevel } from '../../types';
import { UniverseScene } from './UniverseScene';
import { CellularScene } from './CellularScene';
import { MoleculeScene } from './MoleculeScene';
import { AtomScene } from './AtomScene';
import { GalaxyScene } from './GalaxyScene';
import { QuarkScene } from './QuarkScene';
import { ParticleZoomEffect } from './ParticleZoomEffect';

// Camera controller to smoothly interpolate zoom and position during scale shifts
const CameraController: React.FC = () => {
  const { scale, isWebcamActive, gestureX, gestureY, detectedGesture, currentView, isMobile } = useExplorerStore();
  const { camera } = useThree();
  
  // Target and current look-at focus points for cinematic panning
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  const targetPos = useRef(new THREE.Vector3(0, 0, 15));
  const angleX = useRef(0);
  const angleY = useRef(0);
  const distance = useRef(15);
  
  // Set camera positions based on scale target and view mode
  useEffect(() => {
    let targetDist = 15;
    let lookAtX = 0;
    
    if (currentView === 'landing') {
      targetDist = 11; // Cinematic wide zoom for landing page
      lookAtX = 0;     // Centered Earth
    } else {
      switch (scale) {
        case 'galaxy':
          targetDist = 28;
          lookAtX = 3.5;
          break;
        case 'earth':
          targetDist = 7.5; // Zoom closer to realistic Earth
          lookAtX = 1.35;   // Shift Earth slightly to the left (by looking slightly right)
          break;
        case 'cell':
          targetDist = 12;
          lookAtX = 2.0;    // Shift cell slightly to the left
          break;
        case 'molecule':
          targetDist = 15;
          lookAtX = 2.5;    // Shift molecule slightly to the left
          break;
        case 'atom':
          targetDist = 8;
          lookAtX = 1.35;   // Shift atom slightly to the left
          break;
        case 'quark':
          targetDist = 10;
          lookAtX = 1.5;
          break;
      }
    }
    
    if (isMobile) {
      lookAtX = 0;
    }
    
    targetLookAt.current.set(lookAtX, 0, 0);
    targetPos.current.set(lookAtX, 0, targetDist);
    distance.current = targetDist;
    angleX.current = 0;
    angleY.current = 0;
  }, [scale, currentView, isMobile]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smoothly interpolate the camera's focus lookAt point
    currentLookAt.current.lerp(targetLookAt.current, 0.05);
    
    const isManualActive = isWebcamActive || detectedGesture === 'rotate' || detectedGesture === 'pinch';

    if (!isManualActive) {
      // Add subtle drift animation
      camera.position.x += Math.sin(time * 0.5) * 0.001;
      camera.position.y += Math.cos(time * 0.5) * 0.001;
      
      // Calculate relative camera position to the lookAt target to prevent jumps
      const relCamPos = new THREE.Vector3().subVectors(camera.position, currentLookAt.current);
      const dist = relCamPos.length();
      if (dist > 0.1) {
        distance.current = dist;
        angleX.current = Math.atan2(relCamPos.x, relCamPos.z);
        angleY.current = Math.asin(THREE.MathUtils.clamp(relCamPos.y / dist, -0.99, 0.99));
      }
      
      // Lerp camera to target position offset by the current focus point
      const offsetTargetPos = new THREE.Vector3(
        currentLookAt.current.x,
        currentLookAt.current.y,
        currentLookAt.current.z + distance.current
      );
      
      // Use targetPos.current if transition occurred, else float relative to lookAt
      const defaultPos = camera.position.distanceTo(targetPos.current) > 2.0 ? targetPos.current : offsetTargetPos;
      camera.position.lerp(defaultPos, 0.05);
    } else {
      // Gesture and virtual drag handling (panning around the shifted center)
      if (detectedGesture === 'rotate') {
        angleX.current = (gestureX - 0.5) * Math.PI * 2;
        angleY.current = (gestureY - 0.5) * (Math.PI / 1.5);
      } else if (detectedGesture === 'pinch') {
        distance.current = (gestureY * 22) + 3;
      }
      
      const x = currentLookAt.current.x + distance.current * Math.sin(angleX.current) * Math.cos(angleY.current);
      const y = currentLookAt.current.y + distance.current * Math.sin(angleY.current);
      const z = currentLookAt.current.z + distance.current * Math.cos(angleX.current) * Math.cos(angleY.current);
      
      targetPos.current.set(x, y, z);
      camera.position.lerp(targetPos.current, 0.1);
    }
    
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

// Scene routing selector
const SceneRouter: React.FC = () => {
  const { scale, currentView } = useExplorerStore();

  if (currentView === 'landing') {
    return <UniverseScene />;
  }

  return (
    <>
      {scale === 'galaxy' && <GalaxyScene />}
      {scale === 'earth' && <UniverseScene />}
      {scale === 'cell' && <CellularScene />}
      {scale === 'molecule' && <MoleculeScene />}
      {scale === 'atom' && <AtomScene />}
      {scale === 'quark' && <QuarkScene />}
    </>
  );
};

export const MainCanvas: React.FC = () => {
  const { isWebcamActive, currentView, scale, detectedGesture, isMobile } = useExplorerStore();

  // Calculate target lookAt X coordinate to match camera panning
  let targetX = 0;
  if (currentView === 'explorer' && !isMobile) {
    switch (scale) {
      case 'galaxy':
        targetX = 3.5;
        break;
      case 'earth':
        targetX = 1.35;
        break;
      case 'cell':
        targetX = 2.0;
        break;
      case 'molecule':
        targetX = 2.5;
        break;
      case 'atom':
        targetX = 1.35;
        break;
      case 'quark':
        targetX = 1.5;
        break;
    }
  }

  return (
    <div className="relative w-full h-full bg-spaceDark overflow-hidden select-none">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial-cyber pointer-events-none z-0" />

      {/* R3F WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full relative z-10"
      >
        <color attach="background" args={['#050811']} />
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F5FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#6C63FF" />
        <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />
        
        {/* Cinematic Stars Background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={1.5} />
        
        {/* Render Scene Selector */}
        <SceneRouter />
        
        {/* Dynamic Scale Transition Particles */}
        <ParticleZoomEffect />
        
        {/* Camera controllers */}
        <CameraController />
        
        {/* Orbit Controls (Disabled during direct gesture webcam or virtual pad overrides to avoid input collision) */}
        <OrbitControls 
          target={[targetX, 0, 0]}
          enableDamping
          dampingFactor={0.05}
          maxDistance={50}
          minDistance={2}
          enabled={!isWebcamActive && detectedGesture !== 'rotate' && detectedGesture !== 'pinch'}
        />
      </Canvas>
      
      {/* Cinematic HUD Grid Overlay */}
      <div className="absolute inset-0 border-[1px] border-cyberCyan/10 pointer-events-none z-20 m-4 rounded-lg">
        {/* Safe area bracket lines */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyberCyan/35" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyberCyan/35" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyberCyan/35" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyberCyan/35" />
      </div>
    </div>
  );
};
