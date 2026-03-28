'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-3 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-sm border border-red-500/20 transition-colors"
    >
      Logout
    </button>
  );
}
