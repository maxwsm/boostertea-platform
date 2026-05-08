"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

const VALID_ACCESS_CODES = [
  "MRRT-ALPHA-773",
  "MRRT-BETA-892",
  "MRRT-GAMMA-415",
  "MRRT-DELTA-901",
  "MRRT-EPSILON-334",
  "MRRT-ZETA-556",
  "MRRT-ETA-289",
  "MRRT-THETA-742",
  "MRRT-IOTA-118",
  "MRRT-KAPPA-605"
];

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_ACCESS_CODES.includes(passcode.trim().toUpperCase())) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-graphite text-oatmeal relative overflow-hidden">
      {/* Background Pulse Effect */}
      <motion.div 
        className="absolute w-full h-full opacity-5 pointer-events-none"
        animate={{ 
          background: [
            "radial-gradient(circle at 50% 50%, #9FB29F 0%, transparent 40%)",
            "radial-gradient(circle at 50% 50%, #9FB29F 0%, transparent 50%)"
          ] 
        }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-sm flex flex-col items-center"
      >
        <Lock size={48} className="text-oatmeal/20 mb-8" />
        
        <h1 className="text-2xl font-sans font-light tracking-tight mb-2 text-center">
          I&sup3;.MRMRRT.ƐI
        </h1>
        <p className="text-sm text-oatmeal/50 text-center mb-10 font-mono">
          [ ЗАКРИТА АРХІТЕКТУРА ]<br/>
          Доступ лише за персональним ключем
        </p>

        <form onSubmit={handleAccess} className="w-full flex flex-col items-center">
          <motion.div 
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="w-full relative"
          >
            <input
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Введіть код доступу"
              className={`w-full bg-oatmeal/5 border ${error ? 'border-amber' : 'border-oatmeal/10'} rounded-[20px] px-6 py-4 text-center font-mono text-oatmeal placeholder:text-oatmeal/30 focus:outline-none focus:border-sage transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.2)]`}
            />
          </motion.div>
          
          <button 
            type="submit"
            className="mt-6 px-8 py-3 rounded-[20px] bg-oatmeal/10 hover:bg-oatmeal/20 transition-all font-mono text-sm tracking-widest text-oatmeal shadow-[0_5px_20px_rgba(0,0,0,0.1)] active:scale-95"
          >
            ІНІЦІАЛІЗАЦІЯ
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-amber text-sm font-mono text-center"
            >
              Код не знайдено. Доступ заборонено.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
