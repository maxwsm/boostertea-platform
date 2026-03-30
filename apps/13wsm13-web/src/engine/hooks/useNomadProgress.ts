import { useState, useEffect } from 'react';

const STORAGE_KEY_PROGRESS = '13wsm13_nomad_progress';
const STORAGE_KEY_AUTH = '13wsm13_nomad_auth';

export function useNomadProgress() {
    const [discovered, setDiscovered] = useState<Set<string>>(new Set());
    const [isAuth, setIsAuth] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        try {
            const savedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
            if (savedProgress) {
                setDiscovered(new Set(JSON.parse(savedProgress)));
            }

            const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
            if (savedAuth === 'true') {
                setIsAuth(true);
            }
        } catch (e) {
            console.warn("Storage access restricted. Progress won't be saved.");
        }
    }, []);

    const markDiscovered = (id: string) => {
        if (!id) return;
        setDiscovered((prev) => {
            if (prev.has(id)) return prev; // Avoid unnecessary re-renders
            const next = new Set(prev);
            next.add(id);
            try {
                localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(Array.from(next)));
            } catch (e) {}
            return next;
        });
    };

    const authenticate = () => {
        setIsAuth(true);
        try {
            localStorage.setItem(STORAGE_KEY_AUTH, 'true');
        } catch (e) {}
    };

    const clearAmnesia = () => {
        setIsAuth(false);
        setDiscovered(new Set());
        localStorage.removeItem(STORAGE_KEY_PROGRESS);
        localStorage.removeItem(STORAGE_KEY_AUTH);
    }

    return { 
        discovered, 
        isAuth, 
        authenticate, 
        markDiscovered,
        clearAmnesia
    };
}
