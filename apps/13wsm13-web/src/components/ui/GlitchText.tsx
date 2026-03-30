import React from 'react';

interface GlitchTextProps {
    text: string;
    className?: string;
    as?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
    return (
        <span className={`relative inline-block group ${className}`}>
            <span className="relative z-10">{text}</span>
            <span className="absolute left-0 top-0 -ml-[2px] opacity-0 group-hover:opacity-100 group-hover:animate-pulse text-[#0ff] z-0 mix-blend-screen">{text}</span>
            <span className="absolute left-0 top-0 ml-[2px] opacity-0 group-hover:opacity-100 group-hover:animate-pulse text-[#f0f] z-0 mix-blend-screen">{text}</span>
        </span>
    );
}
