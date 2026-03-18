import { PlayerState, RunSummary, CareerTier, UpgradeId } from '../types';
import { BALANCE } from '../config';

class GameStateManager {
  private state!: PlayerState;

  constructor() {
    this.newRun();
  }

  newRun(): void {
    this.state = {
      hp: BALANCE.startingHp,
      maxHp: BALANCE.startingHp,
      currentFloor: 1,
      score: 0,
      streak: 0,
      bestStreak: 0,
      moltsCompleted: 0,
      bossesDefeated: [],
      upgrades: {
        thicker_shell: 0,
        sharper_claws: 0,
        bigger_brain: 0,
        growth_loop: 0,
        network_effect: 0,
      },
      questionsAnswered: 0,
      questionsCorrect: 0,
      startTime: Date.now(),
    };
  }

  getState(): Readonly<PlayerState> {
    return this.state;
  }

  advanceFloor(): void {
    this.state.currentFloor++;
    this.state.score += BALANCE.pointsPerFloor;
  }

  addScore(amount: number): void {
    let multiplier = 1;
    if (this.state.upgrades.growth_loop > 0 && this.state.streak >= BALANCE.streakBonusThreshold) {
      multiplier = 2;
    }
    this.state.score += amount * multiplier;
  }

  takeDamage(amount: number = 1): boolean {
    this.state.hp = Math.max(0, this.state.hp - amount);
    return this.state.hp > 0;
  }

  heal(amount: number): void {
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + amount);
  }

  incrementStreak(): void {
    this.state.streak++;
    if (this.state.streak > this.state.bestStreak) {
      this.state.bestStreak = this.state.streak;
    }
  }

  resetStreak(): void {
    this.state.streak = 0;
  }

  recordCorrectAnswer(): void {
    this.state.questionsAnswered++;
    this.state.questionsCorrect++;
    this.incrementStreak();
  }

  recordWrongAnswer(): void {
    this.state.questionsAnswered++;
    this.resetStreak();
  }

  defeatBoss(bossId: string): void {
    if (!this.state.bossesDefeated.includes(bossId)) {
      this.state.bossesDefeated.push(bossId);
    }
    this.addScore(BALANCE.pointsPerBoss);
  }

  applyUpgrade(id: UpgradeId): void {
    this.state.upgrades[id]++;
    if (id === 'thicker_shell') {
      this.state.maxHp = Math.min(BALANCE.maxHp, this.state.maxHp + 1);
      this.state.hp = Math.min(this.state.maxHp, this.state.hp + 1);
    }
  }

  getCurrentTier(): CareerTier {
    const f = this.state.currentFloor;
    if (f <= 3) return 'intern';
    if (f <= 7) return 'junior_pm';
    if (f <= 12) return 'pm';
    if (f <= 17) return 'senior_pm';
    if (f <= 22) return 'director';
    if (f <= 27) return 'vp';
    return 'cpo';
  }

  hasUpgrade(id: UpgradeId): boolean {
    return this.state.upgrades[id] > 0;
  }

  getUpgradeStacks(id: UpgradeId): number {
    return this.state.upgrades[id];
  }

  completeMolt(): void {
    this.state.moltsCompleted++;
  }

  getRunSummary(): RunSummary {
    const answered = this.state.questionsAnswered;
    return {
      finalFloor: this.state.currentFloor,
      tierReached: this.getCurrentTier(),
      score: this.state.score,
      bossesDefeated: [...this.state.bossesDefeated],
      bestStreak: this.state.bestStreak,
      accuracy: answered > 0 ? this.state.questionsCorrect / answered : 0,
      totalTime: Date.now() - this.state.startTime,
      won: this.state.currentFloor > BALANCE.totalFloors,
    };
  }
}

export const gameState = new GameStateManager();
