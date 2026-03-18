import { Upgrade } from '../types';

export const UPGRADES: Upgrade[] = [
  {
    id: 'thicker_shell',
    name: 'Thicker Shell',
    description: '+1 Max HP (your shell grows back stronger)',
    maxStacks: 4,
  },
  {
    id: 'sharper_claws',
    name: 'Sharper Claws',
    description: 'Bosses take +1 extra damage per correct answer',
    maxStacks: 3,
  },
  {
    id: 'bigger_brain',
    name: 'Bigger Brain',
    description: 'Eliminate one wrong answer on quiz questions',
    maxStacks: 2,
  },
  {
    id: 'growth_loop',
    name: 'Growth Loop',
    description: '2x score during answer streaks of 3+',
    maxStacks: 1,
  },
  {
    id: 'network_effect',
    name: 'Network Effect',
    description: '+5 seconds on timed questions per correct answer',
    maxStacks: 1,
  },
];
