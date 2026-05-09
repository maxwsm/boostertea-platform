/**
 * INTAKE TYPES — Context-driven situation input system
 * 
 * People can't describe situations well in free text.
 * The system guides through structured contexts with clear descriptions.
 */

export type LifeContext =
  | "work"
  | "business"
  | "finance"
  | "relationships"
  | "sexuality"
  | "partnership"
  | "family"
  | "mentalHealth";

export interface ContextCategory {
  id: LifeContext;
  label: string;
  description: string;
  lucideIcon: string; // Lucide icon name
  situations: SubSituation[];
}

export interface SubSituation {
  id: string;
  text: string; // 2 sentences max — clear, simple description
  shadowHint: string; // Which shadow this typically activates
  chemistryShift: {
    cortisol: number; // delta from baseline
    dopamine: number;
    oxytocin: number;
  };
}

export type VacationPeriod = "less1m" | "1to3m" | "3to6m" | "6plus" | "dontRemember";
export type FamilyStatus = "single" | "inRelationship" | "married" | "divorced";
export type ChildrenStatus = "none" | "has" | "expecting";
export type WorkCycle = "less3m" | "3to12m" | "1to3y" | "3plusY";

export interface BioParameters {
  avgSleepHours: number;         // 3-10
  lastVacation7Days: VacationPeriod;
  birthDate: string;              // ISO date string
  familyStatus: FamilyStatus;
  children: ChildrenStatus;
  hasPets: boolean;
  avgWorkCycle: WorkCycle;
  comfortFinancialThreshold: number; // $100 - $100,000
  partnerInfo?: {
    age?: number;
    context?: string;
  };
}

export interface IntakeResult {
  context: LifeContext;
  situation: SubSituation;
  freeText?: string;
  bioParameters: BioParameters;
}

/** Calculate age from birthdate */
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Saturn cycle phase determination */
export function getSaturnPhase(age: number): { phase: string; description: string } {
  if (age >= 27 && age <= 30) return { phase: "Перший повернення Сатурна", description: "Криза ідентичності. Хто я насправді? Переоцінка всіх life choices." };
  if (age >= 36 && age <= 38) return { phase: "Опозиція Сатурна", description: "Перевірка обраного шляху. Якщо фундамент хибний — тріщини стають розломами." };
  if (age >= 42 && age <= 44) return { phase: "Квадратура Сатурна", description: "Midlife crisis. Усвідомлення скінченності часу. Пошук сенсу." };
  if (age >= 56 && age <= 60) return { phase: "Друге повернення Сатурна", description: "Мудрість або гіркота. Прийняття або опір. Спадщина або порожнеча." };
  return { phase: "Стабільна фаза", description: "Немає активного транзиту Сатурна. Час для побудови." };
}

/** Calculate stress multiplier from bio parameters */
export function calculateStressMultiplier(bio: BioParameters): number {
  let multiplier = 1.0;
  
  if (bio.avgSleepHours < 6) multiplier += 0.3;
  else if (bio.avgSleepHours < 7) multiplier += 0.1;
  
  if (bio.lastVacation7Days === "6plus" || bio.lastVacation7Days === "dontRemember") multiplier += 0.25;
  else if (bio.lastVacation7Days === "3to6m") multiplier += 0.15;
  
  if (bio.familyStatus === "divorced") multiplier += 0.1;
  if (bio.children === "has" && bio.familyStatus === "single") multiplier += 0.15;
  
  if (bio.avgWorkCycle === "less3m") multiplier += 0.1; // pattern of avoidance
  
  return Math.min(2.0, multiplier);
}
