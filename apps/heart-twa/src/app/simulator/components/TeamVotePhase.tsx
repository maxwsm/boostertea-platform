import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { slideUp, staggerContainer, tapScale } from "./animations";
import { MultiplayerSession, VotingTopic, GroupVote } from "@/data/game-simulator/multiplayerEngine";
import { PlayerState } from "@/data/game-simulator/rules";
import { ActionResult } from "@/data/game-simulator/assetNodes";

interface Props {
  topic: VotingTopic;
  multiplayerSession: MultiplayerSession;
  setMultiplayerSession: React.Dispatch<React.SetStateAction<MultiplayerSession | null>>;
  applyResult: (r: ActionResult) => void;
  setPhase: (p: any) => void;
  step: number;
  cash: number;
  isNeuroMode: boolean;
}

export const TeamVotePhase: React.FC<Props> = ({ topic, multiplayerSession, setMultiplayerSession, applyResult, setPhase, step, cash, isNeuroMode }) => {
  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;

  const handleVote = (playerVote: "YES" | "NO") => {
    const votes: GroupVote["votes"] = [{ playerId: "p1", vote: playerVote, reason: "Моє рішення як CEO" }];
    
    let yesCount = playerVote === "YES" ? 1 : 0;
    let noCount = playerVote === "NO" ? 1 : 0;

    // NPCs vote based on motivation bias
    multiplayerSession.players.slice(1).forEach(p => {
      const bias = topic.motivationBias[p.hiddenMotivation] || "ABSTAIN";
      votes.push({ playerId: p.id, vote: bias, reason: p.statedMotivation });
      if (bias === "YES") yesCount++;
      if (bias === "NO") noCount++;
    });

    const outcome = yesCount > noCount ? "PASSED" : "BLOCKED";
    
    if (outcome === "PASSED") {
      applyResult({ financialDelta: cash * topic.financialImpact.yes, mentalDelta: topic.mentalImpact.yes, socialDelta: 0, mindset: "NEUTRAL", title: `Ухвала: ${topic.title}`, message: `Рішення прийнято командою (${yesCount} ЗА, ${noCount} ПРОТИ).`, lesson: topic.lesson, isBlackSwan: false });
    } else {
      applyResult({ financialDelta: cash * topic.financialImpact.no, mentalDelta: topic.mentalImpact.no, socialDelta: 0, mindset: "NEUTRAL", title: `Відхилено: ${topic.title}`, message: `Команда заблокувала рішення (${yesCount} ЗА, ${noCount} ПРОТИ).`, lesson: topic.lesson, isBlackSwan: false });
    }

    setMultiplayerSession(prev => prev ? {
      ...prev,
      votingHistory: [...prev.votingHistory, { step, topic: topic.id, description: topic.title, votes, outcome, hiddenConsequence: topic.lesson }]
    } : null);

    setPhase("EVENT"); // Proceed to event after vote
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-4 relative z-50">
      <motion.div variants={slideUp} className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] backdrop-blur-xl">
        <Users className="text-indigo-400 mb-4" size={32} />
        <p className="text-[10px] text-indigo-400/70 uppercase font-mono tracking-widest mb-2">Рада Партнерів: Стратегічне рішення</p>
        <p className="font-black text-xl text-white mb-3 leading-tight">{topic.title}</p>
        <p className={cls("text-white/70 mb-8")}>{topic.description}</p>
        
        <div className="flex gap-3">
          <motion.button 
            {...tapScale}
            onClick={() => handleVote("YES")} 
            className="flex-1 py-4 bg-gradient-to-br from-green-500/20 to-green-600/10 text-green-400 font-bold rounded-xl border border-green-500/50 hover:bg-green-500/30 transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)]"
          >
            Голосувати ЗА
          </motion.button>
          <motion.button 
            {...tapScale}
            onClick={() => handleVote("NO")} 
            className="flex-1 py-4 bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-400 font-bold rounded-xl border border-red-500/50 hover:bg-red-500/30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.15)]"
          >
            Голосувати ПРОТИ
          </motion.button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-indigo-500/20 flex justify-between items-center">
          <p className="text-[9px] text-white/30 font-mono">Ваші партнери проголосують автоматично на основі їхніх прихованих мотивів.</p>
          <div className="flex -space-x-2">
            {multiplayerSession.players.slice(1).map((p, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[8px]">{p.name.charAt(0)}</div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
