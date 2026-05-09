"use client";

import { useState, useEffect } from "react";
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
  const [status, setStatus] = useState<"idle" | "error" | "success" | "locked">("idle");
  const [attempts, setAttempts] = useState(0);

  // Check lockout on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lockoutEnd = localStorage.getItem("mrrt_lockout_until");
      if (lockoutEnd && parseInt(lockoutEnd, 10) > Date.now()) {
        setStatus("locked");
      }
    }
  }, []);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "locked" || status === "success") return;

    if (VALID_ACCESS_CODES.includes(passcode.trim().toUpperCase())) {
      setStatus("success");
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 1500); // Give time to read success message before transition
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setStatus("locked");
        localStorage.setItem("mrrt_lockout_until", (Date.now() + 24 * 60 * 60 * 1000).toString());
      } else {
        setStatus("error");
        setTimeout(() => {
          setStatus(prev => prev !== "locked" ? "idle" : prev);
        }, 2000);
      }
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
            animate={status === "error" ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="w-full relative"
          >
            <input
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={status === "locked" || status === "success"}
              placeholder="Input_Access_Key"
              className={`w-full bg-oatmeal/5 border ${status === "error" ? 'border-amber' : status === "success" ? 'border-sage' : status === "locked" ? 'border-red-500/50' : 'border-oatmeal/10'} rounded-[20px] px-6 py-4 text-center font-mono text-oatmeal placeholder:text-oatmeal/30 focus:outline-none focus:border-sage transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.2)] disabled:opacity-50`}
            />
          </motion.div>
          
          <button 
            type="submit"
            disabled={status === "locked" || status === "success"}
            className="mt-6 px-8 py-3 rounded-[20px] bg-oatmeal/10 hover:bg-oatmeal/20 transition-all font-mono text-sm tracking-widest text-oatmeal shadow-[0_5px_20px_rgba(0,0,0,0.1)] active:scale-95 disabled:opacity-50"
          >
            ІНІЦІАЛІЗАЦІЯ
          </button>
        </form>

        <AnimatePresence mode="wait">
          {status === "error" && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 text-amber text-xs font-mono text-center px-4"
            >
              🔴 [ ПОМИЛКА ] Ключ не розпізнано. Рівень допуску недостатній.
            </motion.p>
          )}
          {status === "locked" && (
            <motion.p
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 text-red-400 text-xs font-mono text-center px-4"
            >
              ⛔️ [ БЛОКУВАННЯ ] Підозріла активність. Шлюз закрито на 24 години.
            </motion.p>
          )}
          {status === "success" && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 text-sage text-xs font-mono text-center px-4"
            >
              🟢 [ ІДЕНТИФІКАЦІЯ УСПІШНА ] Декодування системи... Вітаємо в Тіні.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
