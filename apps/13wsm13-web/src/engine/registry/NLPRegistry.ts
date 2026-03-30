// ═══════════════════════════════════════════════════════════════════════
// 13WSM13 :: GLOBAL NLP REGISTRY
// Central dictionary that aggregates all Translation Matrices from the 
// Academy Sectors (Math, Tokenomics, Neurochem, WebEvol, Blockchain, 
// Architecture, DAO) into a single queryable JSON object.
// ═══════════════════════════════════════════════════════════════════════

import { TranslationTokenomics } from "../models/Academy_Neural_Nomad/Tokenomics/Translation_Tokenomics";
import { TranslationNeuro } from "../models/Academy_Neural_Nomad/NeuroChem/Neuro_MultiLingualUI";
import { TranslationWebEvol } from "../models/Academy_Neural_Nomad/WebEvolution/Translation_WebEvol";
import { TranslationBlockchain } from "../models/Academy_Neural_Nomad/Blockchain/Translation_Blockchain";
import { TranslationArchitecture } from "../models/Academy_Neural_Nomad/Architecture/Translation_Architecture";
import { TranslationWave } from "../models/MathRoom/TranslationMatrix_Wave";     // Represents Math translations wrapper
import { TranslationDAO } from "../models/Academy_Neural_Nomad/DAO/Translation_DAO";

// Quick mock for MathRoom translations (as they were split over 5 files previously, 
// we will aggregate them here for simplicity if the imports fail)
const LocalMathRegistry = {
    math_interference: {
        en: { title: "Constructive Interference", text: "When two waves align perfectly, their peaks combine to create an output far greater than the sum of their parts. This is how synergy works." },
        uk: { title: "Конструктивна Інтерференція", text: "Коли дві хвилі ідеально збігаються, їхні піки об'єднуються, створюючи результат набагато більший, ніж проста сума частин. Це математика синергії." }
    },
    math_goldbach: {
        en: { title: "Goldbach's Conjecture", text: "Every even integer greater than 2 is the sum of two primes. Order emerging from the seeming chaos of prime numbers." },
        uk: { title: "Гіпотеза Гольдбаха", text: "Будь-яке парне число, більше за 2, можна подати як суму двох простих чисел. Це порядок, що виникає з позірного хаосу." }
    },
    ...TranslationWave // Try to spread if it exists
};

export const GlobalNLPRegistry: Record<string, any> = {
    ...LocalMathRegistry,
    ...TranslationTokenomics,
    ...TranslationNeuro,
    ...TranslationWebEvol,
    ...TranslationBlockchain,
    ...TranslationArchitecture,
    ...TranslationDAO
};

// Getter helper
export function getNlpText(id: string, lang: 'uk' | 'en' = 'uk') {
    if (!GlobalNLPRegistry[id]) return null;
    return GlobalNLPRegistry[id][lang];
}
