'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExplorerStore } from '../../store/useExplorerStore';

export default function ExplorerRedirect() {
  const { setView } = useExplorerStore();
  const router = useRouter();

  useEffect(() => {
    setView('explorer');
    router.push('/');
  }, [setView, router]);

  return (
    <div className="w-screen h-screen bg-spaceDark flex items-center justify-center font-mono text-cyberCyan text-xs tracking-widest animate-pulse">
      INITIALIZING COGNITIVE INTERFACE...
    </div>
  );
}
