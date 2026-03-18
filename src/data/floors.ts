import { Floor } from '../types';

export const FLOORS: Floor[] = [
  // === INTERN (Floors 1-3) ===
  {
    number: 1,
    title: 'The Lobby',
    description: "You've arrived! Try not to break the coffee machine on day one.",
    tier: 'intern',
    challengeType: 'quiz',
  },
  {
    number: 2,
    title: 'The Supply Closet',
    description: 'Someone left a stack of post-its and a broken dreams whiteboard in here.',
    tier: 'intern',
    challengeType: 'quiz',
  },
  {
    number: 3,
    title: 'The Onboarding Maze',
    description: 'You need to complete 47 compliance trainings before lunch. Good luck.',
    tier: 'intern',
    challengeType: 'quiz',
  },

  // === JUNIOR PM (Floors 4-7) ===
  {
    number: 4,
    title: 'The Standup That Never Ends',
    description: "It's been 45 minutes. Dave is still talking about his weekend.",
    tier: 'junior_pm',
    challengeType: 'quiz',
  },
  {
    number: 5,
    title: 'The JIRA Graveyard',
    description: 'Thousands of tickets. None assigned. All marked urgent.',
    tier: 'junior_pm',
    challengeType: 'hot_take',
  },
  {
    number: 6,
    title: 'The Stakeholder Gauntlet',
    description: 'Five VPs. Five conflicting priorities. One you. Zero authority.',
    tier: 'junior_pm',
    challengeType: 'quiz',
  },
  {
    number: 7,
    title: 'The First Real Meeting',
    description: "Shreyas awaits. He's already classified your chances as 'Overhead'.",
    tier: 'junior_pm',
    challengeType: 'quiz',
    bossId: 'shreyas',
  },

  // === PM (Floors 8-12) ===
  {
    number: 8,
    title: 'The Roadmap Mirage',
    description: 'It looked so clear in the strategy deck. Now it looks like abstract art.',
    tier: 'pm',
    challengeType: 'framework_match',
  },
  {
    number: 9,
    title: 'The Metrics Dungeon',
    description: 'DAU, MAU, WAU, NPS, CSAT, ARR... is this a job or a bowl of alphabet soup?',
    tier: 'pm',
    challengeType: 'rapid_fire',
  },
  {
    number: 10,
    title: "April's Design Review",
    description: "She's redesigned the entire product in Figma while you were getting coffee.",
    tier: 'pm',
    challengeType: 'hot_take',
    bossId: 'april',
  },
  {
    number: 11,
    title: 'The Launch That Launched Itself',
    description: 'Engineering pushed to prod on Friday at 4:59 PM. Godspeed.',
    tier: 'pm',
    challengeType: 'quiz',
  },
  {
    number: 12,
    title: "Hamilton's Growth Arena",
    description: 'He wants a 10x growth plan by Monday. It is currently Sunday night.',
    tier: 'pm',
    challengeType: 'framework_match',
    bossId: 'hamilton',
  },

  // === SENIOR PM (Floors 13-17) ===
  {
    number: 13,
    title: 'The Strategy Offsite',
    description: "Two days at a vineyard to 'align on vision'. The wine budget exceeds eng headcount.",
    tier: 'senior_pm',
    challengeType: 'hot_take',
  },
  {
    number: 14,
    title: 'The Platform vs. Product War',
    description: 'Two tribes. One codebase. Zero shared OKRs. May the best deck win.',
    tier: 'senior_pm',
    challengeType: 'rapid_fire',
  },
  {
    number: 15,
    title: "Annie's Execution Chamber",
    description: 'She ships faster than you can open Google Docs. Prepare yourself.',
    tier: 'senior_pm',
    challengeType: 'framework_match',
    bossId: 'annie',
  },
  {
    number: 16,
    title: 'The Technical Debt Swamp',
    description: "The codebase is 40% TODO comments and 60% 'temporary' workarounds from 2019.",
    tier: 'senior_pm',
    challengeType: 'quiz',
  },
  {
    number: 17,
    title: "Molly's User Research Lab",
    description: "She's watched 200 user sessions and knows your product is bad. Prove her wrong.",
    tier: 'senior_pm',
    challengeType: 'hot_take',
    bossId: 'molly',
  },

  // === DIRECTOR (Floors 18-22) ===
  {
    number: 18,
    title: 'The Reorg Thunderdome',
    description: 'New VP, new structure, new mission statement. Same broken Slack channels.',
    tier: 'director',
    challengeType: 'rapid_fire',
  },
  {
    number: 19,
    title: "Stewart's Strategy Crucible",
    description: "He'll ask you to explain your strategy in one sentence. You have three decks.",
    tier: 'director',
    challengeType: 'framework_match',
    bossId: 'stewart',
  },
  {
    number: 20,
    title: "Ben's Monetization Minefield",
    description: 'He wants to know your unit economics. You want to know what unit economics means.',
    tier: 'director',
    challengeType: 'quiz',
    bossId: 'ben',
  },
  {
    number: 21,
    title: 'The Board Prep Bunker',
    description: "72 slides. 12 appendices. The CEO will look at exactly one chart.",
    tier: 'director',
    challengeType: 'rapid_fire',
  },
  {
    number: 22,
    title: "Melanie's Product-Market Fit Test",
    description: "She's seen a thousand pivots. She can smell a vanity metric from orbit.",
    tier: 'director',
    challengeType: 'hot_take',
    bossId: 'melanie',
  },

  // === VP (Floors 23-27) ===
  {
    number: 23,
    title: "Bret's AI Strategy Summit",
    description: "He's been thinking about this since before GPT-1. You just discovered ChatGPT.",
    tier: 'vp',
    challengeType: 'framework_match',
    bossId: 'bret',
  },
  {
    number: 24,
    title: "Elena's Data-Driven Dojo",
    description: "She doesn't accept vibes as a data source. Bring your A/B tests or go home.",
    tier: 'vp',
    challengeType: 'rapid_fire',
    bossId: 'elena',
  },
  {
    number: 25,
    title: "Brian's Pricing Pressure Cooker",
    description: "Free tier? Premium? Enterprise? He's about to make you rethink everything.",
    tier: 'vp',
    challengeType: 'quiz',
    bossId: 'brian',
  },
  {
    number: 26,
    title: "Marc's Zero-to-One Chamber",
    description: "He asks: 'What important truth do very few people agree with you on?' You freeze.",
    tier: 'vp',
    challengeType: 'hot_take',
    bossId: 'marc',
  },
  {
    number: 27,
    title: "Chip's Organizational Labyrinth",
    description: "She's mapped every dysfunction in your company. Now it's your turn to fix them.",
    tier: 'vp',
    challengeType: 'framework_match',
    bossId: 'chip',
  },

  // === CPO (Floors 28-30) ===
  {
    number: 28,
    title: "Howie's Product Vision Volcano",
    description: "He's erupting with opinions about your 5-year plan. Your plan was 'survive Q3'.",
    tier: 'cpo',
    challengeType: 'rapid_fire',
    bossId: 'howie',
  },
  {
    number: 29,
    title: 'The Existential Crisis Floor',
    description: "Is product even real? Are OKRs just astrology for business people? You're spiraling.",
    tier: 'cpo',
    challengeType: 'hot_take',
  },
  {
    number: 30,
    title: 'The Corner Office',
    description: "The final boss. He's been here before, died, and came back stronger.",
    tier: 'cpo',
    challengeType: 'framework_match',
    bossId: 'eoghan',
  },
];

export function getFloor(num: number): Floor | undefined {
  return FLOORS.find(f => f.number === num);
}
