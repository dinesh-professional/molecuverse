'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useExplorerStore } from '../../store/useExplorerStore';
import { GlassCard } from '../ui/GlassCard';
import { Camera, AlertCircle, Sparkles, HelpCircle, Move } from 'lucide-react';

// Global cache for dynamic script loading promises to prevent race conditions during renders/hot-reloads
const scriptPromises: Record<string, Promise<void>> = {};

const loadScript = (src: string): Promise<void> => {
  if (scriptPromises[src]) {
    return scriptPromises[src]!;
  }
  
  const promise = new Promise<void>((resolve, reject) => {
    // Check if libraries are already available globally
    if (src.includes('hands.js') && (window as any).Hands) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      const scriptEl = existingScript as HTMLScriptElement;
      const originalOnload = scriptEl.onload;
      scriptEl.onload = (e) => {
        if (originalOnload) (originalOnload as Function)(e);
        resolve();
      };
      scriptEl.onerror = () => reject(new Error(`Failed to bind to existing script tag: ${src}`));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });

  scriptPromises[src] = promise;
  return promise;
};

export const GestureController: React.FC = () => {
  const { 
    isWebcamActive, 
    setWebcamActive,
    detectedGesture, 
    setDetectedGesture, 
    gestureX, 
    gestureY, 
    setGestureCoords 
  } = useExplorerStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Virtual pad backup coordinates when webcam is off
  const handleVirtualDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWebcamActive) return; // ignore if webcam is active
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setGestureCoords(x, y);
    
    if (e.buttons === 1) {
      setDetectedGesture('rotate');
    } else {
      setDetectedGesture('none');
    }
  };

  const handleVirtualMouseUp = () => {
    if (!isWebcamActive) {
      setDetectedGesture('none');
    }
  };

  // Load MediaPipe Hands dynamically from CDN and connect to webcam feed
  useEffect(() => {
    let active = true;
    let localStream: MediaStream | null = null;
    let animationFrameId: number | null = null;

    if (!isWebcamActive) {
      setIsLoaded(false);
      return;
    }

    const loadScriptsAndRun = async () => {
      setErrorMsg(null);
      setIsLoaded(false);
      try {
        // 1. Verify media devices support and request camera stream
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Webcam APIs are not supported in this browser.');
        }

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            },
            audio: false
          });
        } catch (err: any) {
          // Provide highly descriptive feedback depending on WebRTC error type
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            throw new Error('Webcam access was denied by the user. Please check browser permission settings.');
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            throw new Error('No camera hardware device could be located on this system.');
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            throw new Error('Camera is already in use by another application or tab.');
          } else {
            throw new Error(`Webcam initialization failed: ${err.message || err.name}`);
          }
        }

        if (!active) {
          // Stop stream tracks immediately if effect was cleaned up while getting permission
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        localStream = stream;

        // Attach stream to video ref
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(pErr => console.warn('Video play blocked:', pErr));
            }
          };
        }

        // 2. Load MediaPipe Hands script
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');

        if (!active) return;

        const mpHands = (window as any).Hands;
        if (!mpHands) {
          throw new Error('MediaPipe Hands library failed to load from CDN.');
        }

        const hands = new mpHands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results: any) => {
          if (!active) return;
          
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            // Render skeleton mapping onto canvas
            ctx.fillStyle = '#00F5FF';
            ctx.strokeStyle = '#00FF9D';
            ctx.lineWidth = 2;

            // Draw skeleton lines
            const drawConnection = (p1Idx: number, p2Idx: number) => {
              const p1 = landmarks[p1Idx];
              const p2 = landmarks[p2Idx];
              if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                ctx.stroke();
              }
            };

            // Draw fingers connections
            for (let i = 0; i < 4; i++) {
              drawConnection(i, i + 1); // thumb
              drawConnection(i * 4 + 5, i * 4 + 6); // indices
              drawConnection(i * 4 + 6, i * 4 + 7);
              drawConnection(i * 4 + 7, i * 4 + 8);
            }
            // Draw palm base
            drawConnection(0, 5);
            drawConnection(5, 9);
            drawConnection(9, 13);
            drawConnection(13, 17);
            drawConnection(17, 0);

            // Draw joints points
            landmarks.forEach((lm: any) => {
              ctx.beginPath();
              ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
              ctx.fill();
            });

            // Analyze gestures
            const indexTip = landmarks[8];
            const thumbTip = landmarks[4];
            const middleTip = landmarks[12];
            const wrist = landmarks[0];

            if (indexTip && thumbTip && middleTip && wrist) {
              setGestureCoords(1 - indexTip.x, indexTip.y); // invert X for mirror effect

              const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
              const fistDist = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);

              if (pinchDist < 0.05) {
                setDetectedGesture('pinch');
              } else if (fistDist < 0.22) {
                setDetectedGesture('grab');
              } else {
                setDetectedGesture('rotate');
              }
            }
          } else {
            setDetectedGesture('none');
          }
        });

        // 3. Set up the requestAnimationFrame loop to feed frames to MediaPipe
        let processing = false;
        const tick = async () => {
          if (!active) return;

          if (videoRef.current && videoRef.current.readyState >= 2 && !processing) {
            processing = true;
            try {
              await hands.send({ image: videoRef.current });
              if (active) {
                setIsLoaded(true);
              }
            } catch (tickErr) {
              console.warn('Frame processing failed: ', tickErr);
            } finally {
              processing = false;
            }
          }
          if (active) {
            animationFrameId = requestAnimationFrame(tick);
          }
        };

        // Start processing frames
        tick();

      } catch (err: any) {
        console.error('Camera load error: ', err);
        setErrorMsg(err.message || 'Failed to initialize the hand tracking camera.');
        setWebcamActive(false);
      }
    };

    loadScriptsAndRun();

    return () => {
      active = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isWebcamActive, setDetectedGesture, setGestureCoords, setWebcamActive]);

  return (
    <GlassCard className="w-full border border-cyberPurple/25 pointer-events-auto" glowColor="purple">
      <div className="flex items-center gap-2 pb-2 border-b border-cyberPurple/20 text-xs font-mono mb-3 text-white/80">
        <Camera className="w-4 h-4 text-cyberPurple" />
        <span className="font-bold tracking-widest">HAND GESTURE TRACKER</span>
      </div>

      {isWebcamActive ? (
        <div className="relative aspect-video bg-black rounded overflow-hidden border border-cyberPurple/30 flex items-center justify-center">
          {/* Webcam Element with autoplay & playsinline */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            playsInline
            autoPlay
            muted
          />
          
          {/* Coordinate joint overlay rendering */}
          <canvas
            ref={canvasRef}
            width={320}
            height={240}
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none scale-x-[-1]"
          />
          
          {!isLoaded && (
            <span className="text-[10px] font-mono text-white/50 animate-pulse z-20">
              Initializing spatial camera...
            </span>
          )}
          
          {/* Realtime gesture badge overlay */}
          {detectedGesture !== 'none' && (
            <div className="absolute top-2 left-2 z-20 bg-cyberPurple/80 border border-cyberPurple text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-[0_0_8px_rgba(108,99,255,0.4)] uppercase">
              GESTURE: {detectedGesture}
            </div>
          )}
        </div>
      ) : (
        // Backup touch track pad UI when webcam is inactive
        <div className="flex flex-col gap-2">
          <div
            onMouseMove={handleVirtualDrag}
            onMouseLeave={handleVirtualMouseUp}
            onMouseUp={handleVirtualMouseUp}
            className="relative aspect-video rounded bg-spaceLight/50 border border-white/5 cursor-crosshair flex flex-col items-center justify-center pointer-events-auto hover:border-cyberPurple/30 transition-all duration-300"
          >
            <Move className="w-5 h-5 text-white/30 mb-1" />
            <span className="text-[10px] font-mono text-white/40 text-center px-4">
              Drag mouse inside viewport to Rotate camera manually.
            </span>

            {/* Simulated cursor dot mapping */}
            {detectedGesture === 'rotate' && (
              <div 
                className="absolute w-2 h-2 bg-cyberPurple rounded-full shadow-neonPurple pointer-events-none"
                style={{ left: `${gestureX * 100}%`, top: `${gestureY * 100}%` }}
              />
            )}
          </div>
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyberPink mt-1.5 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Guide HUD Footer */}
      <div className="flex flex-col gap-1 mt-3 text-[10px] font-mono text-white/30 border-t border-cyberPurple/15 pt-2">
        <span className="text-[9px] font-bold text-white/50 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyberPurple" /> SPATIAL INTERACTION MANUAL:
        </span>
        <span>• PINCH THUMB + INDEX: Zoom camera</span>
        <span>• WAVE HAND: Orbit & rotate coordinates</span>
        <span>• GRAB FIST: Trigger active simulation acceleration</span>
      </div>
    </GlassCard>
  );
};
