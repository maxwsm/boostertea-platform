'use client';

import React, { useState, useEffect } from 'react';
import MasterCanvas from '@/components/canvas/MasterCanvas';
import { MeadowScene } from '@/engine/ui/MeadowScene';

export default function App() {
    const [scene, setScene] = useState<'meadow' | 'fort'>('meadow');

    // In a NextJS environment we need to make sure canvas only runs on the client
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Default theme behavior (forcing dark class for Neo-Cyberpunk)
        if (!document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    if (!isMounted) return null;

    return (
        <main className="relative w-screen h-screen overflow-hidden bg-black selection:bg-[#0f0] selection:text-black">
            {scene === 'meadow' && (
                <MeadowScene onRewind={() => setScene('fort')} />
            )}
            
            {scene === 'fort' && (
                <MasterCanvas />
            )}
        </main>
    );
}
