'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplorerStore } from '../../store/useExplorerStore';

// Realistic astronomical orbital/tilt configuration
const PLANET_DATA = [
  { name: 'Mercury', radius: 3.8, size: 0.14, color: '#8E8E93', speed: 4.15, ecc: 0.205, inclination: 7.0, axialTilt: 0.03 },
  { name: 'Venus', radius: 5.4, size: 0.22, color: '#E5C185', speed: 1.62, ecc: 0.007, inclination: 3.4, axialTilt: 177.3 }, // Retrograde rotation
  { name: 'Earth', radius: 7.2, size: 0.25, color: '#2F80ED', speed: 1.0, hasMoon: true, ecc: 0.017, inclination: 0.0, axialTilt: 23.44 },
  { name: 'Mars', radius: 9.0, size: 0.18, color: '#EB5757', speed: 0.53, ecc: 0.093, inclination: 1.8, axialTilt: 25.19 },
  { name: 'Jupiter', radius: 12.0, size: 0.55, color: '#F2C94C', speed: 0.084, ecc: 0.048, inclination: 1.3, axialTilt: 3.13 },
  { name: 'Saturn', radius: 15.2, size: 0.46, color: '#E0A96D', speed: 0.034, hasRings: true, ecc: 0.054, inclination: 2.5, axialTilt: 26.73 },
  { name: 'Uranus', radius: 18.2, size: 0.35, color: '#56CCF2', speed: 0.012, ecc: 0.047, inclination: 0.8, axialTilt: 97.77 }, // Side rotation
  { name: 'Neptune', radius: 21.2, size: 0.33, color: '#2D9CDB', speed: 0.006, ecc: 0.009, inclination: 1.8, axialTilt: 28.32 },
];

const OrbitLine: React.FC<{
  radius: number;
  ecc: number;
  color: string;
  inclination: number;
}> = ({ radius, ecc, color, inclination }) => {
  const points = useMemo(() => {
    const list = [];
    const semiMajor = radius;
    const semiMinor = radius * Math.sqrt(1.0 - ecc * ecc);
    const numPoints = 128;
    
    const focalDistance = semiMajor * ecc;
    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * Math.PI * 2;
      const x = Math.cos(theta) * semiMajor - focalDistance;
      const z = Math.sin(theta) * semiMinor;
      list.push(new THREE.Vector3(x, 0, z));
    }
    return list;
  }, [radius, ecc]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  const incRad = inclination * Math.PI / 180;

  return (
    <group rotation={[incRad, 0, 0]}>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.12} />
      </line>
    </group>
  );
};

const Planet: React.FC<{
  name: string;
  radius: number;
  size: number;
  color: string;
  speed: number;
  ecc: number;
  inclination: number;
  axialTilt: number;
  textures: Record<string, THREE.Texture | null>;
  hasMoon?: boolean;
  hasRings?: boolean;
  solarSystemSpeed: number;
  showOrbitTrails: boolean;
}> = ({ name, radius, size, color, speed, ecc, inclination, axialTilt, textures, hasMoon, hasRings, solarSystemSpeed, showOrbitTrails }) => {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  const semiMajor = radius;
  const semiMinor = radius * Math.sqrt(1.0 - ecc * ecc);
  const focalDistance = semiMajor * ecc;
  const incRad = inclination * Math.PI / 180;
  const tiltRad = axialTilt * Math.PI / 180;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const orbitAngle = time * speed * (solarSystemSpeed / 30) * 0.15;
    
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(orbitAngle) * semiMajor - focalDistance;
      orbitGroupRef.current.position.z = Math.sin(orbitAngle) * semiMinor;
    }
    if (planetRef.current) {
      const dir = axialTilt > 90 ? -1 : 1;
      planetRef.current.rotation.y = time * 0.7 * dir;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.022; // independent cloud drift
    }
  });

  const texture = textures[name] || null;

  return (
    <group rotation={[incRad, 0, 0]}>
      <group ref={orbitGroupRef}>
        <group rotation={[0, 0, tiltRad]}>
          {/* Main planet sphere */}
          <mesh ref={planetRef} castShadow receiveShadow>
            <sphereGeometry args={[size, 32, 32]} />
            {name === 'Earth' && textures.Earth ? (
              // Photorealistic Earth rendering with specular, bump, and night lights
              <meshPhongMaterial 
                map={textures.Earth}
                bumpMap={textures.EarthBump || undefined}
                bumpScale={0.05}
                emissiveMap={textures.EarthNight || undefined}
                emissive={new THREE.Color('#ffffff')}
                specularMap={textures.EarthSpec || undefined}
                specular={new THREE.Color('#222222')}
                shininess={25}
              />
            ) : texture ? (
              <meshStandardMaterial 
                map={texture} 
                roughness={name === 'Venus' ? 0.95 : 0.7} 
                metalness={0.1}
              />
            ) : (
              <meshStandardMaterial 
                color={color} 
                roughness={0.7} 
                metalness={0.1}
                emissive={new THREE.Color(color).multiplyScalar(0.08)}
              />
            )}
          </mesh>

          {/* Earth atmospheric clouds layer */}
          {name === 'Earth' && textures.EarthClouds && (
            <mesh ref={cloudsRef}>
              <sphereGeometry args={[size * 1.015, 32, 32]} />
              <meshStandardMaterial
                map={textures.EarthClouds}
                transparent={true}
                opacity={0.38}
                depthWrite={false}
                blending={THREE.NormalBlending}
              />
            </mesh>
          )}

          {/* Saturn Rings */}
          {hasRings && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size * 1.35, size * 2.2, 64]} />
              <meshStandardMaterial 
                color="#A08C68" 
                transparent 
                opacity={0.5} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          )}
        </group>

        {/* Moon */}
        {hasMoon && (
          <mesh position={[size * 1.5, 0.08, 0]}>
            <sphereGeometry args={[size * 0.22, 16, 16]} />
            <meshStandardMaterial color="#A5A5A5" roughness={0.9} />
          </mesh>
        )}
      </group>
    </group>
  );
};

// Solar Flares Emitting Solar Winds with gesture controls acceleration
const SolarFlares: React.FC<{ activeSpeed: number }> = ({ activeSpeed }) => {
  const count = 30;
  const pointsRef = useRef<THREE.Points>(null);
  
  const flareData = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const pitch = Math.acos(2 * Math.random() - 1);
      const speed = 0.6 + Math.random() * 0.8;
      const startRadius = 1.7;
      return { angle, pitch, speed, startRadius };
    });
  }, []);

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    if (posAttr) {
      for (let i = 0; i < count; i++) {
        const flare = flareData[i]!;
        const speedFactor = activeSpeed / 30;
        const distance = flare.startRadius + (time * flare.speed * speedFactor) % 3.0;
        
        positions[i * 3] = distance * Math.sin(flare.pitch) * Math.cos(flare.angle);
        positions[i * 3 + 1] = distance * Math.sin(flare.pitch) * Math.sin(flare.angle);
        positions[i * 3 + 2] = distance * Math.cos(flare.pitch);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#FF5D00" 
        size={0.08} 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Asteroid Belt between Mars and Jupiter
const AsteroidBelt: React.FC<{ activeSpeed: number }> = ({ activeSpeed }) => {
  const count = 150;
  const pointsRef = useRef<THREE.Points>(null);
  
  const asteroids = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10.1 + Math.random() * 1.1; // Centered between Mars and Jupiter
      const height = (Math.random() - 0.5) * 0.3;
      const speed = 0.08 + Math.random() * 0.06;
      return { angle, radius, height, speed };
    });
  }, []);

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    if (posAttr) {
      asteroids.forEach((ast, i) => {
        const currentAngle = ast.angle + time * ast.speed * (activeSpeed / 30) * 0.15;
        positions[i * 3] = Math.cos(currentAngle) * ast.radius;
        positions[i * 3 + 1] = ast.height;
        positions[i * 3 + 2] = Math.sin(currentAngle) * ast.radius;
      });
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#8B7B6B" 
        size={0.05} 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
      />
    </points>
  );
};

export const GalaxyScene: React.FC = () => {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const { simulationParams, detectedGesture } = useExplorerStore();
  const { solarSystemSpeed, showOrbitTrails } = simulationParams;

  const [textures, setTextures] = useState<Record<string, THREE.Texture | null>>({});

  // Asynchronously load real NASA/planetary maps
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    const textureUrls: Record<string, string> = {
      Mercury: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mercurymap.jpg',
      Venus: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/venusmap.jpg',
      Earth: 'https://unpkg.com/three-globe/example/img/earth-day.jpg',
      EarthBump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
      EarthNight: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
      EarthSpec: 'https://unpkg.com/three-globe/example/img/earth-water.png',
      EarthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
      Mars: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/marsmap1k.jpg',
      Jupiter: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupitermap.jpg',
      Saturn: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/saturnmap.jpg',
      Uranus: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/uranusmap.jpg',
      Neptune: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/neptunemap.jpg',
      Sun: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/sunmap.jpg'
    };

    const loadedTextures: Record<string, THREE.Texture | null> = {};
    
    Promise.all(
      Object.entries(textureUrls).map(([name, url]) => {
        return new Promise<void>((resolve) => {
          loader.load(
            url,
            (tex) => {
              loadedTextures[name] = tex;
              resolve();
            },
            undefined,
            () => {
              loadedTextures[name] = null;
              resolve();
            }
          );
        });
      })
    ).then(() => {
      setTextures(loadedTextures);
    }).catch(err => {
      console.warn("Failed to load photorealistic planetary texture layers", err);
    });
  }, []);

  const isGrab = detectedGesture === 'grab';
  const speedMult = isGrab ? 3.0 : 1.0;
  const activeSpeed = solarSystemSpeed * speedMult;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rate = isGrab ? 2.5 : 1.0;
    
    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.025 * rate;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z = -time * 0.008 * rate;
      const glowScale = 1.0 + Math.sin(time * 1.5 * rate) * 0.02;
      coronaRef.current.scale.set(glowScale, glowScale, glowScale);
    }
  });

  return (
    <group>
      {/* Central Solar Point Light */}
      <pointLight position={[0, 0, 0]} intensity={isGrab ? 6.0 : 3.5} distance={100} decay={1.5} color="#FFE600" />

      {/* Solar Wind Flare Emissive Particles */}
      <SolarFlares activeSpeed={activeSpeed} />

      {/* Sun mesh with authentic surface mapping */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.7, 32, 32]} />
        {textures.Sun ? (
          <meshBasicMaterial map={textures.Sun} />
        ) : (
          <meshBasicMaterial color="#FFE600" />
        )}
      </mesh>

      {/* Solar Corona Layer */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshBasicMaterial 
          color="#FF5D00" 
          transparent 
          opacity={0.22} 
          blending={THREE.AdditiveBlending} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Elliptical Keplerian Orbit Trails */}
      {showOrbitTrails && PLANET_DATA.map((planet) => (
        <OrbitLine 
          key={`trail-${planet.name}`} 
          radius={planet.radius} 
          ecc={planet.ecc} 
          color={planet.color} 
          inclination={planet.inclination}
        />
      ))}

      {/* Asteroid Belt */}
      <AsteroidBelt activeSpeed={activeSpeed} />

      {/* Cosmic background grid */}
      <gridHelper
        args={[60, 30, '#00F5FF', '#12192A']}
        position={[0, -2.5, 0] as const}
        material-transparent={true}
        material-opacity={0.12}
      />

      {/* Orbiting Planets with real surface textures */}
      {PLANET_DATA.map((planet) => (
        <Planet 
          key={planet.name} 
          {...planet} 
          textures={textures}
          solarSystemSpeed={activeSpeed} 
          showOrbitTrails={showOrbitTrails} 
        />
      ))}
    </group>
  );
};
