'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplorerStore } from '../../store/useExplorerStore';

export const UniverseScene: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const orbitGroupRefs = useRef<Array<THREE.Group | null>>([]);
  
  const { simulationParams } = useExplorerStore();
  const { orbitSpeed, showOrbitPaths } = simulationParams;

  const [textures, setTextures] = useState<{
    map: THREE.Texture | null;
    bumpMap: THREE.Texture | null;
    emissiveMap: THREE.Texture | null;
    specularMap: THREE.Texture | null;
    clouds: THREE.Texture | null;
  }>({ map: null, bumpMap: null, emissiveMap: null, specularMap: null, clouds: null });

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    Promise.all([
      new Promise<THREE.Texture | null>((resolve) => 
        loader.load('https://unpkg.com/three-globe/example/img/earth-day.jpg', resolve, undefined, () => resolve(null))
      ),
      new Promise<THREE.Texture | null>((resolve) => 
        loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png', resolve, undefined, () => resolve(null))
      ),
      new Promise<THREE.Texture | null>((resolve) => 
        loader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg', resolve, undefined, () => resolve(null))
      ),
      new Promise<THREE.Texture | null>((resolve) => 
        loader.load('https://unpkg.com/three-globe/example/img/earth-water.png', resolve, undefined, () => resolve(null))
      ),
      new Promise<THREE.Texture | null>((resolve) => 
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png', resolve, undefined, () => resolve(null))
      )
    ]).then(([map, bumpMap, emissiveMap, specularMap, clouds]) => {
      setTextures({ map, bumpMap, emissiveMap, specularMap, clouds });
    }).catch(err => {
      console.warn("Failed to load realistic earth textures in explorer", err);
    });
  }, []);

  // Generate 3 distinct orbital planes for satellites to look realistic
  const orbitsData = useMemo(() => {
    const planes = [
      { name: 'Equatorial', count: 20, radius: 3.5, tilt: new THREE.Euler(0, 0, 0), speed: 0.1, color: '#00FF9D' },
      { name: 'GPS Inclined', count: 18, radius: 4.0, tilt: new THREE.Euler(Math.PI / 6, 0, Math.PI / 8), speed: 0.16, color: '#00F5FF' },
      { name: 'Polar Orbit', count: 12, radius: 3.7, tilt: new THREE.Euler(Math.PI / 2, Math.PI / 6, 0), speed: 0.07, color: '#FF007A' }
    ];
    
    return planes.map((plane) => {
      const satellites = Array.from({ length: plane.count }).map((_, i) => {
        const angle = (i / plane.count) * Math.PI * 2 + Math.random() * 0.15;
        const size = 0.03 + Math.random() * 0.03;
        return { angle, size };
      });
      return { ...plane, satellites };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speedMultiplier = orbitSpeed / 30;
    
    // Rotate Earth and grids on tilted axis
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.02 * speedMultiplier;
    }
    if (cloudsRef.current) {
      // Wind speed slightly faster than Earth rotation with fluctuations
      cloudsRef.current.rotation.y = time * 0.024 * speedMultiplier + Math.sin(time * 0.05) * 0.005;
    }
    if (gridRef.current) {
      gridRef.current.rotation.y = -time * 0.012 * speedMultiplier;
    }
    
    // Rotate separate orbital planes
    orbitGroupRefs.current.forEach((ref, idx) => {
      const plane = orbitsData[idx];
      if (ref && plane) {
        ref.rotation.y = time * plane.speed * speedMultiplier;
      }
    });
  });

  const earthTilt = 23.44 * Math.PI / 180; // Earth's actual obliquity

  return (
    <group>
      {/* Tilted Earth System Group */}
      <group rotation={[0, 0, earthTilt]}>
        {/* Glow Ambient Shell */}
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial
            color="#00F5FF"
            wireframe
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Realistic Earth Core Sphere */}
        <mesh ref={earthRef}>
          <sphereGeometry args={[2.2, 64, 64]} />
          {textures.map ? (
            <meshPhongMaterial
              map={textures.map}
              bumpMap={textures.bumpMap || undefined}
              bumpScale={0.05}
              emissiveMap={textures.emissiveMap || undefined}
              emissive={new THREE.Color('#ffffff')}
              specularMap={textures.specularMap || undefined}
              specular={new THREE.Color('#222222')}
              shininess={25}
            />
          ) : (
            /* High-quality ocean/land fallback while loading maps */
            <meshStandardMaterial
              color="#0b2b40"
              roughness={0.6}
              metalness={0.1}
            />
          )}
        </mesh>

        {/* Atmospheric Clouds Overlay */}
        {textures.clouds && (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[2.22, 64, 64]} />
            <meshStandardMaterial
              map={textures.clouds}
              transparent={true}
              opacity={0.38}
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </mesh>
        )}

        {/* Cyber Grid Latitude/Longitude Lines */}
        <mesh ref={gridRef}>
          <sphereGeometry args={[2.24, 18, 18]} />
          <meshBasicMaterial
            color="#00F5FF"
            wireframe
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Satellites in Multi-Planar Inclined Orbits */}
      {orbitsData.map((plane, idx) => (
        <group key={idx} rotation={plane.tilt}>
          {/* Ring path */}
          {showOrbitPaths && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[plane.radius - 0.015, plane.radius + 0.015, 64]} />
              <meshBasicMaterial color={plane.color} transparent opacity={0.06} side={THREE.DoubleSide} />
            </mesh>
          )}
          
          {/* Rotating Satellites Group */}
          <group ref={(el) => { orbitGroupRefs.current[idx] = el; }}>
            {plane.satellites.map((sat, sIdx) => {
              const x = Math.cos(sat.angle) * plane.radius;
              const z = Math.sin(sat.angle) * plane.radius;
              
              // Pulsing beacon visual logic
              const isBeacon = sIdx % 4 === 0;
              
              return (
                <mesh key={sIdx} position={[x, 0, z]}>
                  <sphereGeometry args={[sat.size, 8, 8]} />
                  <meshBasicMaterial 
                    color={isBeacon ? "#FFFFFF" : plane.color} 
                    transparent 
                    opacity={isBeacon ? 0.95 : 0.7}
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}

      {/* Earth HUD coordinates */}
      <gridHelper
        args={[20, 20, '#6C63FF', '#141C34']}
        position={[0, -2.5, 0] as const}
        material-transparent={true}
        material-opacity={0.15}
      />
    </group>
  );
};
