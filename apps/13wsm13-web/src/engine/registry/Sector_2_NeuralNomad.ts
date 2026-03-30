// ═══════════════════════════════════════════════════════════════════════
// SECTOR 2 :: NEURAL NOMAD (THE ACADEMY FORT)
// Latitude Range: 0.35 to 0.60
// Contains: The Fort Citadel, MathRoom, Tokenomics, Neurochem, Evolution,
// Blockchain, Architecture, and DAO.
// ═══════════════════════════════════════════════════════════════════════

import { PLine, PIcon, sphToCart, TAU } from "../utils/math";

// ПАК 10: MathRoom (Математична Кімната)
import { getMathRoomGallery } from "../models/MathRoom/MathRoomGallery";
import { getGoldbachConjecture } from "../models/MathRoom/Math_GoldbachConjecture";
import { getTuringMachineTape } from "../models/MathRoom/Math_TuringMachine";
import { getHardyRamanujanCircle } from "../models/MathRoom/Math_HardyCircle";
import { getInterferencePattern } from "../models/MathRoom/Math_InterferencePattern";
import { getGoldbachComet } from "../models/MathRoom/Math_GoldbachComet";

// ПАК 11: Tokenomics (Токеноміка Достатку)
import { getRoomTokenomics } from "../models/Academy_Neural_Nomad/Tokenomics/Room_Tokenomics";
import { getTokenLiquidityTree } from "../models/Academy_Neural_Nomad/Tokenomics/Token_LiquidityTree";
import { getTokenDistWaterfall } from "../models/Academy_Neural_Nomad/Tokenomics/Token_DistWaterfall";
import { getTokenValueMagnet } from "../models/Academy_Neural_Nomad/Tokenomics/Token_ValueMagnet";
import { getTokenCircWheel } from "../models/Academy_Neural_Nomad/Tokenomics/Token_CircWheel";
import { getTokenCapStairs } from "../models/Academy_Neural_Nomad/Tokenomics/Token_CapStairs";

// ПАК 12: NeuroChem (Кімната Нейрохімії)
import { getRoomNeuroChem } from "../models/Academy_Neural_Nomad/NeuroChem/Room_NeuroChem";
import { getNeuroFear } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_Fear";
import { getNeuroLove } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_Love";
import { getNeuroJoy } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_Joy";
import { getNeuroJackpot } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_Jackpot";
import { getNeuroSadness } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_Sadness";
import { getNeuroInterest } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_Interest";
import { getNeuroAwe } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_Awe";
import { getNeuroInteractiveTrigger } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_InteractiveTrigger";

// ПАК 13: WebEvolution (Еволюція Web)
import { getRoomWebEvolution } from "../models/Academy_Neural_Nomad/WebEvolution/Room_WebEvolution";
import { getEvolClosedBox } from "../models/Academy_Neural_Nomad/WebEvolution/Evol_ClosedBox";
import { getEvolBankVault } from "../models/Academy_Neural_Nomad/WebEvolution/Evol_BankVault";
import { getEvolSmartContract } from "../models/Academy_Neural_Nomad/WebEvolution/Evol_SmartContract";
import { getEvolOwnership } from "../models/Academy_Neural_Nomad/WebEvolution/Evol_Ownership";
import { getEvolIdentity } from "../models/Academy_Neural_Nomad/WebEvolution/Evol_Identity";
import { getEvolSculpture } from "../models/Academy_Neural_Nomad/WebEvolution/Evol_Sculpture";
import { getEvolWeb } from "../models/Academy_Neural_Nomad/WebEvolution/Evol_Web";
import { getEvolPortal } from "../models/Academy_Neural_Nomad/WebEvolution/Evol_Portal";

// ПАК 14: Blockchain (Архітектура Блокчейну)
import { getRoomBlockchain } from "../models/Academy_Neural_Nomad/Blockchain/Room_Blockchain";
import { getBlockChainPhysics } from "../models/Academy_Neural_Nomad/Blockchain/Block_ChainPhysics";
import { getBlockMinerNode } from "../models/Academy_Neural_Nomad/Blockchain/Block_MinerNode";
import { getBlockCoinAnatomy } from "../models/Academy_Neural_Nomad/Blockchain/Block_CoinAnatomy";
import { getBlockLedger } from "../models/Academy_Neural_Nomad/Blockchain/Block_Ledger";
import { getBlockConsensus } from "../models/Academy_Neural_Nomad/Blockchain/Block_Consensus";

// ПАК 15: Architecture (Сучасна Архітектура)
import { getRoomArchitecture } from "../models/Academy_Neural_Nomad/Architecture/Room_Architecture";
import { getArchBiomimicry } from "../models/Academy_Neural_Nomad/Architecture/Arch_Biomimicry";
import { getArchDeconstructivism } from "../models/Academy_Neural_Nomad/Architecture/Arch_Deconstructivism";
import { getArchKinetic } from "../models/Academy_Neural_Nomad/Architecture/Arch_Kinetic";
import { getArchGlassLight } from "../models/Academy_Neural_Nomad/Architecture/Arch_GlassLight";
import { getArchStructuralExp } from "../models/Academy_Neural_Nomad/Architecture/Arch_StructuralExp";

// ПАК 16: DAO (Децентралізовані Організації)
import { getRoomDAO } from "../models/Academy_Neural_Nomad/DAO/Room_DAO";
import { getDaoRoundTable } from "../models/Academy_Neural_Nomad/DAO/DAO_RoundTable";
import { getDaoVotingToken } from "../models/Academy_Neural_Nomad/DAO/DAO_VotingToken";
import { getDaoTreasury } from "../models/Academy_Neural_Nomad/DAO/DAO_Treasury";
import { getDaoAutomation } from "../models/Academy_Neural_Nomad/DAO/DAO_Automation";
import { getDaoSwarmControl } from "../models/Academy_Neural_Nomad/DAO/DAO_SwarmControl";
import { getDaoPyramidCollapse } from "../models/Academy_Neural_Nomad/DAO/DAO_PyramidCollapse";
import { getDaoHoloCourt } from "../models/Academy_Neural_Nomad/DAO/DAO_HoloCourt";
import { getDaoInductionTrigger } from "../models/Academy_Neural_Nomad/DAO/DAO_Trigger";

// Зшивання 2.5: Топова Деталізація Академії
import { getKnowledgePrism, getServerRacks, getQuantumOrrery } from "../models/NeuralNomad/ArchitecturalElements";

// Зшивання Фаза 5: Мікропроцесорна Підлога (Кремнієвий Чіп)
import { getSiliconFloorGrid } from "../models/Academy_Neural_Nomad/SiliconFloorGrid";

// Constants for Ecosystem
const SYM_1313 = ["🌐","📦","🧭","🎒","💻","🔗","🗂","🔐","🪙","⛺","🏔","✈","🚁","📡","🧠","🔥","📊","⚙","🧬","⚖","🌍","📱","🛡","🏗"];

export function buildSector2NeuralNomad(): { lines: PLine[], icons: PIcon[] } {
    const lines: PLine[] = [];
    const icons: PIcon[] = [];

    const nnLat = 0.40;
    
    // Fort Base Silhouette (Ruins + Rebuilt lines combined)
    const fortR = 0.018;
    for(let i=0; i<60; i++) {
        const a = (i/60)*TAU;
        const base = sphToCart(nnLat + Math.cos(a)*fortR, Math.sin(a)*fortR, 0);
        const top = sphToCart(nnLat + Math.cos(a)*fortR, Math.sin(a)*fortR, 80 + Math.sin(a*5)*20);
        lines.push({ p1: base, p2: top, colorMode: 2, width: 2.0 });
    }
    
    // 1313 Ecosystem Elements (Orbiting the Fort)
    for(let i=0; i<1313; i++) {
        const latOffset = (Math.random()-0.5)*0.06;
        const lonOffset = (Math.random()-0.5)*0.06;
        const elev = 10 + Math.random()*200;
        const char = SYM_1313[Math.floor(Math.random()*SYM_1313.length)];
        icons.push({ p: sphToCart(nnLat + latOffset, lonOffset, elev), char, size: 8 + Math.random()*16, type: 'obj', meta: { colorMode: 2 } });
    }

    // Central Hub Blueprints
    icons.push({ p: sphToCart(nnLat, 0, 150), char: "NEURALNOMAD V2", size: 40, type: 'text', meta: { colorMode: 2 } });
    icons.push({ p: sphToCart(nnLat+0.005, 0, 100), char: "WE WILL 100% REALIZE THIS", size: 20, type: 'text' });
    icons.push({ p: sphToCart(nnLat+0.008, 0, 80), char: "WHO IS WITH US?", size: 20, type: 'text' });

    // Grid/Ground Lines replaced with SILICON MICROPROCESSOR BOARD
    const siliconData = getSiliconFloorGrid(0.35, 0.65, -0.05, 0.05, 0);
    lines.push(...siliconData.lines);
    icons.push(...siliconData.icons);

    // ==========================================
    // ЗШИВАННЯ: ПАК 10 (МАТЕМАТИЧНА КІМНАТА)
    // ==========================================
    const pushData = (data: { lines: PLine[], icons: PIcon[] }) => {
        lines.push(...data.lines);
        icons.push(...data.icons);
    };

    // Базова кімната
    pushData(getMathRoomGallery(nnLat + 0.05, 50));
    
    // Експонати (встановлені всередині або поруч із галереєю)
    pushData(getGoldbachConjecture());
    pushData(getTuringMachineTape(0, ["1","0","1","1","0"]));
    pushData(getHardyRamanujanCircle());
    pushData(getInterferencePattern(0));
    pushData(getGoldbachComet());

    // ==========================================
    // ЗШИВАННЯ: ПАК 11 (ТОКЕНОМІКА)
    // ==========================================
    const tokLat = nnLat + 0.08;
    pushData(getRoomTokenomics(tokLat, 50));
    pushData(getTokenLiquidityTree());
    pushData(getTokenDistWaterfall());
    pushData(getTokenValueMagnet());
    pushData(getTokenCircWheel(0));
    pushData(getTokenCapStairs());

    // ==========================================
    // ЗШИВАННЯ: ПАК 12 (НЕЙРОХІМІЯ)
    // ==========================================
    const neuroLat = nnLat + 0.11;
    pushData(getRoomNeuroChem(neuroLat, 50));
    pushData(getNeuroFear(0));
    pushData(getNeuroLove(0));
    pushData(getNeuroJoy(0));
    pushData(getNeuroJackpot(0));
    pushData(getNeuroSadness(0));
    pushData(getNeuroInterest(0));
    pushData(getNeuroAwe(0));
    pushData(getNeuroInteractiveTrigger());

    // ==========================================
    // ЗШИВАННЯ: ПАК 13 (WEB EVOLUTION)
    // ==========================================
    const evolLat = nnLat + 0.14;
    pushData(getRoomWebEvolution(evolLat, 50));
    pushData(getEvolClosedBox(0));
    pushData(getEvolBankVault());
    pushData(getEvolSmartContract(0));
    pushData(getEvolOwnership());
    pushData(getEvolIdentity(0));
    pushData(getEvolSculpture(0));
    pushData(getEvolWeb(0));
    pushData(getEvolPortal(0));

    // ==========================================
    // ЗШИВАННЯ: ПАК 14 (БЛОКЧЕЙН АРХІТЕКТУРА)
    // ==========================================
    const chainLat = nnLat + 0.17;
    pushData(getRoomBlockchain(chainLat, 50));
    pushData(getBlockChainPhysics(0));
    pushData(getBlockMinerNode(0));
    pushData(getBlockCoinAnatomy(0));
    pushData(getBlockLedger());
    pushData(getBlockConsensus(0));

    // ==========================================
    // ЗШИВАННЯ: ПАК 15 (СУЧАСНА АРХІТЕКТУРА)
    // ==========================================
    const archLat = nnLat + 0.20;
    pushData(getRoomArchitecture(archLat, 50));
    pushData(getArchBiomimicry(0));
    pushData(getArchDeconstructivism());
    pushData(getArchKinetic(0));
    pushData(getArchGlassLight());
    pushData(getArchStructuralExp());

    // ==========================================
    // ЗШИВАННЯ: ПАК 16 (DAO - ФІНАЛ)
    // ==========================================
    const daoLat = nnLat + 0.23;
    pushData(getRoomDAO(daoLat, 50));
    pushData(getDaoRoundTable(0));
    pushData(getDaoVotingToken(0));
    pushData(getDaoTreasury());
    pushData(getDaoAutomation(0));
    pushData(getDaoSwarmControl(0));
    pushData(getDaoPyramidCollapse(0));
    pushData(getDaoHoloCourt(0));
    pushData(getDaoInductionTrigger(0));

    // Silicon grid continues here via generic sector cover from 0.35 to 0.65

    // High Detail Procedural Objects (Phase 2.5)
    // 1. Knowledge Prism (Hovering over the entrance of Neural Nomad)
    const baseLat = 0.35;
    pushData(getKnowledgePrism(baseLat, 0.0, 50));

    // 2. Server Racks (Data storage near Tokenomics Modules)
    pushData(getServerRacks(0.05, -0.4, 0));

    // 3. Quantum Orrery (Floating astronomical clock representing Blockchain orbits)
    pushData(getQuantumOrrery(-0.15, 0.4, 60));

    return { lines, icons };
}
