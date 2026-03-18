export type CareerTier = 'intern' | 'junior_pm' | 'pm' | 'senior_pm' | 'director' | 'vp' | 'cpo';
export type ChallengeType = 'quiz' | 'rapid_fire' | 'hot_take' | 'framework_match';
export type CrustaceanType = 'lobster' | 'crab' | 'shrimp' | 'prawn' | 'crawfish' | 'mantis_shrimp' | 'hermit_crab';
export type QuestionCategory = 'product' | 'growth' | 'career' | 'leadership' | 'ai' | 'strategy' | 'design';
export type UpgradeId = 'thicker_shell' | 'sharper_claws' | 'bigger_brain' | 'growth_loop' | 'network_effect';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  source: string;
  category: QuestionCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  funFact?: string;
}

export interface HotTake {
  id: string;
  quote: string;
  speaker: string;
  agreeReasoning: string;
  disagreeReasoning: string;
  funFact: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface BossAbility {
  type: string;
  name: string;
  description: string;
}

export interface Boss {
  id: string;
  name: string;
  crustaceanName: string;
  crustaceanType: CrustaceanType;
  company: string;
  framework: string;
  ability: BossAbility;
  quoteOnDefeat: string;
  quoteOnVictory: string;
  introLine: string;
  color: number;
  floor: number;
  hp: number;
  questions: string[];
}

export interface Floor {
  number: number;
  tier: CareerTier;
  challengeType: ChallengeType;
  bossId?: string;
  title: string;
  description: string;
}

export interface Upgrade {
  id: UpgradeId;
  name: string;
  description: string;
  maxStacks: number;
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  currentFloor: number;
  score: number;
  streak: number;
  bestStreak: number;
  moltsCompleted: number;
  bossesDefeated: string[];
  upgrades: Record<UpgradeId, number>;
  questionsAnswered: number;
  questionsCorrect: number;
  startTime: number;
}

export interface RunSummary {
  finalFloor: number;
  tierReached: CareerTier;
  score: number;
  bossesDefeated: string[];
  bestStreak: number;
  accuracy: number;
  totalTime: number;
  won: boolean;
}
