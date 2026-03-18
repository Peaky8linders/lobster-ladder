export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

export function formatTime(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const remaining = secs % 60;
  return `${mins}:${remaining.toString().padStart(2, '0')}`;
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function tierToColor(tier: string): number {
  const map: Record<string, number> = {
    intern: 0x8ecae6,
    junior_pm: 0x219ebc,
    pm: 0x023047,
    senior_pm: 0xffb703,
    director: 0xfb8500,
    vp: 0xe63946,
    cpo: 0xd4a574,
  };
  return map[tier] ?? 0xffffff;
}

export function difficultyForTier(tier: string): [number, number] {
  const map: Record<string, [number, number]> = {
    intern: [1, 1],
    junior_pm: [1, 2],
    pm: [2, 3],
    senior_pm: [2, 4],
    director: [3, 4],
    vp: [3, 5],
    cpo: [4, 5],
  };
  return map[tier] ?? [1, 5];
}
