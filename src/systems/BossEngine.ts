import { Boss, Question } from '../types';
import { questionEngine } from './QuestionEngine';
import { gameState } from './GameStateManager';
import { BALANCE } from '../config';

export interface BossFightState {
  boss: Boss;
  hp: number;
  maxHp: number;
  questionsAsked: number;
  currentQuestion: Question | null;
  phase: number;
  shieldSegments: number;
  revived: boolean;
  difficultyModifier: number;
  defeated: boolean;
}

class BossEngine {
  private state!: BossFightState;

  startFight(boss: Boss): void {
    this.state = {
      boss,
      hp: boss.hp,
      maxHp: boss.hp,
      questionsAsked: 0,
      currentQuestion: null,
      phase: 0,
      shieldSegments: boss.ability.type === 'shield' ? 7 : 0,
      revived: false,
      difficultyModifier: 0,
      defeated: false,
    };
  }

  getState(): Readonly<BossFightState> {
    return this.state;
  }

  getNextQuestion(): Question | null {
    const questions = questionEngine.getQuestionsForBoss(this.state.boss.questions, 1);
    const q = questions[0] || null;
    this.state.currentQuestion = q;
    return q;
  }

  processAnswer(correct: boolean): {
    damageDealt: number;
    damageTaken: number;
    bossDefeated: boolean;
    playerDead: boolean;
    abilityText?: string;
  } {
    this.state.questionsAsked++;
    let damageDealt = 0;
    let damageTaken = 0;
    let abilityText: string | undefined;

    const extraDamage = gameState.getUpgradeStacks('sharper_claws');

    if (correct) {
      gameState.recordCorrectAnswer();
      damageDealt = 1 + extraDamage;

      // Ability-specific modifiers
      switch (this.state.boss.ability.type) {
        case 'classify': {
          // LNO: random classification affects damage
          const types = ['Leverage', 'Neutral', 'Overhead'];
          const roll = types[Math.floor(Math.random() * 3)];
          if (roll === 'Leverage') {
            damageDealt *= 2;
            abilityText = `LNO: LEVERAGE! 2x damage!`;
          } else if (roll === 'Overhead') {
            damageDealt = Math.max(1, Math.ceil(damageDealt * 0.5));
            abilityText = `LNO: Overhead... reduced damage.`;
          } else {
            abilityText = `LNO: Neutral. Standard damage.`;
          }
          break;
        }
        case 'shield':
          this.state.shieldSegments = Math.max(0, this.state.shieldSegments - 1);
          damageDealt = this.state.shieldSegments === 0 ? 1 + extraDamage : 0;
          abilityText = this.state.shieldSegments > 0
            ? `Shield cracked! ${this.state.shieldSegments} powers remain.`
            : `Shield broken! Full damage!`;
          break;
        case 'boom_bust':
          damageDealt *= 2;
          abilityText = `BOOM! 2x damage dealt!`;
          break;
        case 'compound':
          this.state.difficultyModifier = Math.max(-2, this.state.difficultyModifier - 1);
          abilityText = `Difficulty easing... next question simpler.`;
          break;
      }

      this.state.hp = Math.max(0, this.state.hp - damageDealt);
      gameState.addScore(BALANCE.pointsPerCorrect);
    } else {
      gameState.recordWrongAnswer();
      damageTaken = 1;

      switch (this.state.boss.ability.type) {
        case 'boom_bust':
          damageTaken = 2;
          abilityText = `BUST! Double damage taken!`;
          break;
        case 'charge':
          abilityText = `"Run toward fear!" Ben charges harder!`;
          break;
        case 'retreat':
          abilityText = `Stewart retreats into his empathy shell! Immune next turn.`;
          break;
        case 'compound':
          this.state.difficultyModifier = Math.min(2, this.state.difficultyModifier + 1);
          abilityText = `Difficulty compounding... next question harder!`;
          break;
        case 'delegate':
          abilityText = `Molly delegates a mini-crab to block your next attack!`;
          break;
      }

      gameState.takeDamage(damageTaken);
    }

    // Check revive mechanic
    let bossDefeated = this.state.hp <= 0;
    if (bossDefeated && this.state.boss.ability.type === 'revive' && !this.state.revived) {
      this.state.revived = true;
      this.state.hp = Math.ceil(this.state.maxHp / 2);
      bossDefeated = false;
      abilityText = `"You can't keep a good crab down!" Phoenix Revival! HP restored to 50%!`;
    }

    if (bossDefeated) {
      this.state.defeated = true;
      gameState.defeatBoss(this.state.boss.id);
    }

    return {
      damageDealt,
      damageTaken,
      bossDefeated,
      playerDead: gameState.getState().hp <= 0,
      abilityText,
    };
  }

  isBossDefeated(): boolean {
    return this.state.defeated;
  }
}

export const bossEngine = new BossEngine();
