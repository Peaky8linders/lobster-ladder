export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const COLORS = {
  background: 0x0a1628,
  lobsterRed: 0xe63946,
  lobsterOrange: 0xf4845f,
  shell: 0xd4a574,
  ocean: 0x1d3557,
  deepOcean: 0x0d1b2a,
  foam: 0xa8dadc,
  gold: 0xf1c40f,
  white: 0xffffff,
  darkPanel: 0x0d1b2a,
  midPanel: 0x1b2838,
  correct: 0x2ecc71,
  wrong: 0xe74c3c,
  tier1: 0x8ecae6,
  tier2: 0x219ebc,
  tier3: 0x023047,
  tier4: 0xffb703,
  tier5: 0xfb8500,
  tier6: 0xe63946,
  tier7: 0xd4a574,
};

export const FONTS = {
  title: { fontSize: '52px', color: '#e63946', fontFamily: 'monospace', fontStyle: 'bold' },
  subtitle: { fontSize: '22px', color: '#8ecae6', fontFamily: 'monospace' },
  heading: { fontSize: '20px', color: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold' },
  body: { fontSize: '16px', color: '#e2e8f0', fontFamily: 'monospace' },
  small: { fontSize: '13px', color: '#8ecae6', fontFamily: 'monospace' },
  button: { fontSize: '18px', color: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold' },
  score: { fontSize: '24px', color: '#f1c40f', fontFamily: 'monospace', fontStyle: 'bold' },
  damage: { fontSize: '28px', color: '#e74c3c', fontFamily: 'monospace', fontStyle: 'bold' },
  bossName: { fontSize: '28px', color: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold' },
};

export const BALANCE = {
  startingHp: 3,
  maxHp: 7,
  totalFloors: 30,
  bossQuestions: 3,
  rapidFireTime: 15000,
  streakBonusThreshold: 3,
  pointsPerCorrect: 100,
  pointsPerBoss: 500,
  pointsPerFloor: 50,
  timerPerQuestion: 20000,
  moltFloors: [3, 7, 12, 17, 22, 27],
};

export const TIER_NAMES: Record<string, string> = {
  intern: 'Intern',
  junior_pm: 'Junior PM',
  pm: 'PM',
  senior_pm: 'Senior PM',
  director: 'Director',
  vp: 'VP Product',
  cpo: 'CPO',
};
