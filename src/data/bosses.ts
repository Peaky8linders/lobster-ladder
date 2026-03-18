import { Boss } from '../types';

export const BOSSES: Boss[] = [
  // ============================================================
  // FLOOR 7 - Shreyas "The Mantis Shrimp" Doshi
  // ============================================================
  {
    id: 'boss_shreyas',
    name: 'Shreyas Doshi',
    crustaceanName: 'The Mantis Shrimp',
    crustaceanType: 'mantis_shrimp',
    company: 'Stripe/Twitter',
    framework: 'LNO Framework',
    ability: {
      type: 'classify',
      name: 'LNO Punch',
      description: 'Classifies your answers as Leverage, Neutral, or Overhead',
    },
    introLine: "Ah, a challenger. Let me classify you... Hmm, you're giving strong 'Overhead' energy right now.",
    quoteOnDefeat: "You've correctly identified this fight as... Overhead for me. Well played, I'll go focus on Leverage tasks.",
    quoteOnVictory: "As I suspected - you spent too long on Neutral tasks and missed the Leverage play. Classic PM mistake.",
    color: 0x7c3aed,
    floor: 7,
    hp: 3,
    questions: ['q11', 'q9', 'q10', 'q73'],
  },

  // ============================================================
  // FLOOR 10 - April "The Positioning Prawn" Dunford
  // ============================================================
  {
    id: 'boss_april',
    name: 'April Dunford',
    crustaceanName: 'The Positioning Prawn',
    crustaceanType: 'prawn',
    company: 'Obviously Awesome',
    framework: 'Product Positioning',
    ability: {
      type: 'reposition',
      name: 'Obviously Awesome Shuffle',
      description: 'Shuffles answer positions mid-question',
    },
    introLine: "Before we fight, let me ask: what's your competitive alternative? Because right now, your alternative is losing.",
    quoteOnDefeat: "Well, you've clearly positioned yourself as the winner. I can't even argue with that market category.",
    quoteOnVictory: "You were poorly positioned from the start. You thought you were fighting a prawn, but I'm Obviously Awesome.",
    color: 0x2563eb,
    floor: 10,
    hp: 3,
    questions: ['q59', 'q14', 'q55', 'q4'],
  },

  // ============================================================
  // FLOOR 12 - Hamilton "The Power Lobster" Helmer
  // ============================================================
  {
    id: 'boss_hamilton',
    name: 'Hamilton Helmer',
    crustaceanName: 'The Power Lobster',
    crustaceanType: 'lobster',
    company: 'Strategy Capital',
    framework: '7 Powers',
    ability: {
      type: 'shield',
      name: '7 Powers Shield',
      description: '7-segment shield you must break through',
    },
    introLine: "I have 7 Powers protecting me. Scale Economies, Network Economies, Counter-Positioning... shall I continue, or are you already overwhelmed?",
    quoteOnDefeat: "Impressive. You broke through all 7 Powers. I must admit, your strategy had... Process Power.",
    quoteOnVictory: "You lacked a single Power. In strategy, that means you had no moat. And lobsters with no moat get eaten.",
    color: 0xdc2626,
    floor: 12,
    hp: 7,
    questions: ['q54', 'q55', 'q56', 'q61', 'q62'],
  },

  // ============================================================
  // FLOOR 15 - Annie "The Betting Crab" Duke
  // ============================================================
  {
    id: 'boss_annie',
    name: 'Annie Duke',
    crustaceanName: 'The Betting Crab',
    crustaceanType: 'crab',
    company: 'How to Decide',
    framework: 'Thinking in Bets',
    ability: {
      type: 'probability',
      name: 'Confidence Wager',
      description: 'Bet your confidence level before answering',
    },
    introLine: "Life is poker, not chess. I can see your cards, and I'm estimating a 73% chance you lose. Want to bet against me?",
    quoteOnDefeat: "I assigned a 27% probability to this outcome. But a good decision can still lose, and a bad decision can still win. You just got lucky. ...Okay fine, you were good.",
    quoteOnVictory: "You went all-in with a pair of twos. That wasn't brave, that was resulting. Read my book.",
    color: 0x059669,
    floor: 15,
    hp: 4,
    questions: ['q71', 'q44', 'q43', 'q73'],
  },

  // ============================================================
  // FLOOR 17 - Molly "The Lego Crab" Graham
  // ============================================================
  {
    id: 'boss_molly',
    name: 'Molly Graham',
    crustaceanName: 'The Lego Crab',
    crustaceanType: 'crab',
    company: 'Lambda School',
    framework: 'Give Away Your Legos',
    ability: {
      type: 'delegate',
      name: 'Lego Delegation',
      description: 'Spawns mini-crab sub-questions',
    },
    introLine: "I used to own ALL the Legos. Then I learned to give them away. Now I have an army of tiny crabs with Legos. Your move.",
    quoteOnDefeat: "You know what? I'm giving you this victory. It's called delegation. ...Okay, you earned it. Take the Legos.",
    quoteOnVictory: "You tried to hold onto all your Legos instead of delegating. Classic early-career mistake. Let go, little lobster.",
    color: 0xd97706,
    floor: 17,
    hp: 3,
    questions: ['q30', 'q36', 'q37', 'q33'],
  },

  // ============================================================
  // FLOOR 19 - Stewart "The Hermit Crab" Butterfield
  // ============================================================
  {
    id: 'boss_stewart',
    name: 'Stewart Butterfield',
    crustaceanName: 'The Hermit Crab',
    crustaceanType: 'hermit_crab',
    company: 'Slack',
    framework: 'Utility Curves',
    ability: {
      type: 'retreat',
      name: 'Product Empathy Shell',
      description: 'Retreats into shell after you miss, immune for one turn',
    },
    introLine: "*retreats slightly into shell* Don't worry, I'm not scared. I'm just... deeply empathizing with the user experience of being attacked by a lobster.",
    quoteOnDefeat: "You understood my feelings. That's product empathy. I'm retreating into my shell now... but with respect. *slides away gracefully*",
    quoteOnVictory: "You lacked empathy for the user. I mean me. I'm the user in this scenario. And the experience was NOT delightful.",
    color: 0x4338ca,
    floor: 19,
    hp: 4,
    questions: ['q72', 'q13', 'q8', 'q3'],
  },

  // ============================================================
  // FLOOR 20 - Ben "The Fearless Lobster" Horowitz
  // ============================================================
  {
    id: 'boss_ben',
    name: 'Ben Horowitz',
    crustaceanName: 'The Fearless Lobster',
    crustaceanType: 'lobster',
    company: 'a16z',
    framework: 'The Hard Thing',
    ability: {
      type: 'charge',
      name: 'Run Toward Fear',
      description: 'Timer is halved - answer fast!',
    },
    introLine: "The hard thing about hard things? There's no formula. There's just ME. Running straight at you. At double speed.",
    quoteOnDefeat: "The hard thing about hard things... is losing to a crustacean. This is not in my book. I may need a second edition.",
    quoteOnVictory: "There are no silver bullets. Only lead ones. And I just hit you with all of them. Welcome to the struggle.",
    color: 0xb91c1c,
    floor: 20,
    hp: 3,
    questions: ['q38', 'q40', 'q41', 'q44'],
  },

  // ============================================================
  // FLOOR 22 - Melanie "The Demo-Crab" Perkins
  // ============================================================
  {
    id: 'boss_melanie',
    name: 'Melanie Perkins',
    crustaceanName: 'The Demo-Crab',
    crustaceanType: 'crab',
    company: 'Canva',
    framework: 'Democratize Design',
    ability: {
      type: 'design',
      name: 'Canvas Attack',
      description: 'Questions presented as visual design choices',
    },
    introLine: "I made design accessible to billions. Now I'm going to make losing accessible to you. And it'll look beautiful.",
    quoteOnDefeat: "You've proven that anyone can win - even without a design degree. I suppose I taught you well. Drag, drop, victory.",
    quoteOnVictory: "Design matters. And your answers were giving... default template energy. I expected more creativity from a lobster.",
    color: 0x7c3aed,
    floor: 22,
    hp: 4,
    questions: ['q65', 'q63', 'q64', 'q67', 'q69'],
  },

  // ============================================================
  // FLOOR 23 - Bret "The Swiss Army Lobster" Taylor
  // ============================================================
  {
    id: 'boss_bret',
    name: 'Bret Taylor',
    crustaceanName: 'The Swiss Army Lobster',
    crustaceanType: 'lobster',
    company: 'Sierra AI',
    framework: 'Multi-domain',
    ability: {
      type: 'multi_attack',
      name: 'Swiss Army Claws',
      description: 'Each question from a different domain',
    },
    introLine: "I built Google Maps, invented the Facebook Like button, ran Salesforce, and now I'm building AI. You sure you want to fight someone with THIS many claws?",
    quoteOnDefeat: "I've built products used by billions, but I couldn't beat one determined crustacean. Adding 'lobster combat' to my resume.",
    quoteOnVictory: "I have claws for product, engineering, design, AND strategy. You brought a single claw to a Swiss Army fight.",
    color: 0x0369a1,
    floor: 23,
    hp: 4,
    questions: ['q77', 'q46', 'q58', 'q19'],
  },

  // ============================================================
  // FLOOR 24 - Elena "The Growth Shrimp" Verna
  // ============================================================
  {
    id: 'boss_elena',
    name: 'Elena Verna',
    crustaceanName: 'The Growth Shrimp',
    crustaceanType: 'shrimp',
    company: 'Lovable',
    framework: 'Growth Loops',
    ability: {
      type: 'compound',
      name: 'Compound Growth',
      description: 'Difficulty compounds - wrong=harder, right=easier',
    },
    introLine: "Growth isn't linear, it's exponential. Every wrong answer makes the next question harder. I'm a compounding machine, baby.",
    quoteOnDefeat: "Your growth loop was stronger than mine. Correct answers compounded into victory. I taught you well... wait, did I?",
    quoteOnVictory: "Your retention curve hit zero. Classic sign of no product-market fit. Maybe work on your activation metric before challenging me again.",
    color: 0xc026d3,
    floor: 24,
    hp: 4,
    questions: ['q16', 'q25', 'q26', 'q24', 'q28'],
  },

  // ============================================================
  // FLOOR 25 - Brian "The Lobster King" Chesky
  // ============================================================
  {
    id: 'boss_brian',
    name: 'Brian Chesky',
    crustaceanName: 'The Lobster King',
    crustaceanType: 'lobster',
    company: 'Airbnb',
    framework: 'Design Thinking',
    ability: {
      type: 'aura',
      name: 'Design Aura',
      description: 'All answers look equally beautiful - no visual cues',
    },
    introLine: "Welcome to the Lobster King's domain. I've designed this arena to be an 11-star experience. For me. For you it'll be a 1-star experience.",
    quoteOnDefeat: "You didn't just win. You designed a victory. That's founder mode energy. Now go review every detail of your celebration.",
    quoteOnVictory: "You were thinking like a manager. I needed you to think like a founder. A designer-founder who reviews every pixel. Better luck never.",
    color: 0xea580c,
    floor: 25,
    hp: 4,
    questions: ['q39', 'q63', 'q1', 'q60'],
  },

  // ============================================================
  // FLOOR 26 - Marc "The Boom Lobster" Andreessen
  // ============================================================
  {
    id: 'boss_marc',
    name: 'Marc Andreessen',
    crustaceanName: 'The Boom Lobster',
    crustaceanType: 'lobster',
    company: 'a16z',
    framework: 'Software Eating World',
    ability: {
      type: 'boom_bust',
      name: 'Boom or Bust',
      description: '2x points but wrong answers cost 2 HP',
    },
    introLine: "Software is eating the world. And I'm the lobster that's eating the software. High risk, high reward. Let's see if you have the stomach for it.",
    quoteOnDefeat: "Software is eating the world, but you just ate my lunch. I'm going to go write a 10,000-word blog post about this loss.",
    quoteOnVictory: "You bet big and lost bigger. That's not venture-scale thinking. In my world, we call that a 'down round.' Come back with better fundamentals.",
    color: 0x4f46e5,
    floor: 26,
    hp: 3,
    questions: ['q57', 'q1', 'q51', 'q14'],
  },

  // ============================================================
  // FLOOR 27 - Chip "The Elder Crab" Conley
  // ============================================================
  {
    id: 'boss_chip',
    name: 'Chip Conley',
    crustaceanName: 'The Elder Crab',
    crustaceanType: 'crab',
    company: 'Modern Elder Academy',
    framework: 'Wisdom@Work',
    ability: {
      type: 'debuff',
      name: 'Elder Wisdom',
      description: 'Philosophical questions with nuanced answers',
    },
    introLine: "Young lobster, I've been in this ocean longer than your company's been incorporated. Let me share some wisdom... by crushing you with it.",
    quoteOnDefeat: "Wisdom isn't about winning or losing. It's about... okay fine, losing stinks. But I'm old enough to be gracious about it. Well fought, young one.",
    quoteOnVictory: "Age and treachery always overcome youth and skill. That's not a quote - that's my lived experience, specifically right now.",
    color: 0x92400e,
    floor: 27,
    hp: 4,
    questions: ['q45', 'q35', 'q43', 'q42'],
  },

  // ============================================================
  // FLOOR 28 - Howie "The AI Crab" Liu
  // ============================================================
  {
    id: 'boss_howie',
    name: 'Howie Liu',
    crustaceanName: 'The AI Crab',
    crustaceanType: 'crab',
    company: 'Airtable',
    framework: 'AI Restructuring',
    ability: {
      type: 'restructure',
      name: 'Org Restructure',
      description: 'Question format changes randomly each turn',
    },
    introLine: "I restructured Airtable's entire product strategy around AI. Now I'm restructuring this fight. Every round, the rules change. Good luck.",
    quoteOnDefeat: "You adapted to every restructure. That's... actually what I look for in a hire. Send me your resume. I'm serious.",
    quoteOnVictory: "The format changed and you couldn't keep up. In AI, adaptability is survival. Consider yourself disrupted.",
    color: 0x0f766e,
    floor: 28,
    hp: 4,
    questions: ['q53', 'q46', 'q49', 'q50', 'q52'],
  },

  // ============================================================
  // FLOOR 30 - Eoghan "The Phoenix Crab" McCabe (FINAL BOSS)
  // ============================================================
  {
    id: 'boss_eoghan',
    name: 'Eoghan McCabe',
    crustaceanName: 'The Phoenix Crab',
    crustaceanType: 'crab',
    company: 'Intercom',
    framework: 'Rising from Ashes',
    ability: {
      type: 'revive',
      name: 'Phoenix Revival',
      description: 'Revives once at 50% HP after defeat',
    },
    introLine: "I stepped down as CEO, watched from the sidelines, and came back stronger. You think defeating me once will be enough? I ALWAYS come back.",
    quoteOnDefeat: "You beat me... TWICE. I came back from the ashes and you still won. I need to go reflect on this at my castle in Ireland. Genuinely humbled.",
    quoteOnVictory: "I've been knocked down by boards, by markets, by doubt. I always rise. You? You just got toasted by a phoenix. Stay down.",
    color: 0xbe123c,
    floor: 30,
    hp: 4,
    questions: ['q80', 'q38', 'q40', 'q74', 'q75'],
  },
];

export function getBossForFloor(floor: number): Boss | undefined {
  return BOSSES.find(b => b.floor === floor);
}
