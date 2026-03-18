import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONTS, TIER_NAMES } from '../config';
import { gameState } from '../systems/GameStateManager';
import { playClick, playGameOver, playMolt } from '../utils/audio';
import { formatTime } from '../utils/helpers';
import { questionEngine } from '../systems/QuestionEngine';
import { RunSummary } from '../types';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: { won: boolean }) {
    const summary = gameState.getRunSummary();
    const won = data?.won || false;

    // Background
    const bg = this.add.graphics();
    if (won) {
      bg.fillGradientStyle(0x0d1b2a, 0x0d1b2a, 0x023047, 0x023047, 1);
    } else {
      bg.fillGradientStyle(0x0d1b2a, 0x0d1b2a, 0x1a0a0a, 0x1a0a0a, 1);
    }
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (won) {
      playMolt();
      this.add.text(GAME_WIDTH / 2, 60, 'YOU REACHED CPO!', {
        ...FONTS.title,
        fontSize: '52px',
        color: '#f1c40f',
      }).setOrigin(0.5);

      this.add.text(GAME_WIDTH / 2, 120, 'From intern to Chief Product Officer - one shell at a time.', {
        ...FONTS.body,
        fontStyle: 'italic',
      }).setOrigin(0.5);

      // Victory particles
      for (let i = 0; i < 40; i++) {
        const colors = [COLORS.gold, COLORS.lobsterRed, COLORS.lobsterOrange, COLORS.foam];
        const p = this.add.graphics();
        p.fillStyle(colors[i % colors.length], 0.7);
        p.fillCircle(0, 0, 2 + Math.random() * 3);
        p.setPosition(Math.random() * GAME_WIDTH, -10);
        this.tweens.add({
          targets: p,
          y: GAME_HEIGHT + 10,
          x: p.x + (Math.random() - 0.5) * 100,
          alpha: 0,
          duration: 2000 + Math.random() * 2000,
          delay: Math.random() * 1000,
          repeat: -1,
        });
      }
    } else {
      playGameOver();
      this.add.text(GAME_WIDTH / 2, 60, 'YOUR CLIMB ENDS', {
        ...FONTS.title,
        fontSize: '48px',
        color: '#e74c3c',
      }).setOrigin(0.5);

      this.add.text(GAME_WIDTH / 2, 120, 'Your shell crumbled. But every lobster molts again...', {
        ...FONTS.body,
        fontStyle: 'italic',
      }).setOrigin(0.5);
    }

    // Stats card
    const cardX = GAME_WIDTH / 2, cardY = 350, cardW = 500, cardH = 300;
    const card = this.add.graphics();
    card.fillStyle(COLORS.darkPanel, 0.9);
    card.fillRoundedRect(cardX - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);
    card.lineStyle(2, won ? COLORS.gold : COLORS.lobsterRed, 0.4);
    card.strokeRoundedRect(cardX - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);

    const leftCol = cardX - 100;
    const rightCol = cardX + 100;
    let statY = cardY - 110;
    const lineH = 36;

    const addStat = (label: string, value: string, col: 'left' | 'right' = 'left') => {
      const x = col === 'left' ? leftCol : rightCol;
      this.add.text(x - 90, statY, label, FONTS.small);
      this.add.text(x + 90, statY, value, {
        ...FONTS.body,
        fontStyle: 'bold',
        color: '#f1c40f',
      }).setOrigin(1, 0);
      statY += lineH;
    };

    addStat('FLOOR REACHED', `${summary.finalFloor}`, 'left');
    statY -= lineH;
    addStat('RANK', TIER_NAMES[summary.tierReached] || summary.tierReached, 'right');

    addStat('SCORE', summary.score.toLocaleString(), 'left');
    statY -= lineH;
    addStat('BEST STREAK', `${summary.bestStreak}`, 'right');

    addStat('ACCURACY', `${Math.round(summary.accuracy * 100)}%`, 'left');
    statY -= lineH;
    addStat('TIME', formatTime(summary.totalTime), 'right');

    addStat('BOSSES', `${summary.bossesDefeated.length} defeated`, 'left');

    // Boss names
    if (summary.bossesDefeated.length > 0) {
      statY += 5;
      this.add.text(cardX, statY, summary.bossesDefeated.join(' | '), {
        ...FONTS.small,
        fontSize: '11px',
        color: '#8ecae6',
        wordWrap: { width: cardW - 40 },
        align: 'center',
      }).setOrigin(0.5, 0);
    }

    // Share text
    this.add.text(GAME_WIDTH / 2, 530, this.generateShareText(summary, won), {
      ...FONTS.small,
      color: '#4a6fa5',
      wordWrap: { width: 450 },
      align: 'center',
    }).setOrigin(0.5);

    // Buttons
    this.createButton(GAME_WIDTH / 2 - 130, 610, 'CLIMB AGAIN', COLORS.lobsterRed, () => {
      playClick();
      gameState.newRun();
      questionEngine.reset();
      this.scene.start('LadderScene');
    });

    this.createButton(GAME_WIDTH / 2 + 130, 610, 'MAIN MENU', COLORS.ocean, () => {
      playClick();
      this.scene.start('MenuScene');
    });

    // Copy share text button
    this.createButton(GAME_WIDTH / 2, 565, 'COPY RESULTS', COLORS.midPanel, () => {
      playClick();
      const text = this.generateShareText(summary, won);
      navigator.clipboard?.writeText(text).catch(() => {});
    });
  }

  private generateShareText(summary: RunSummary, won: boolean): string {
    const tierEmoji: Record<string, string> = {
      intern: '\u{1F476}', junior_pm: '\u{1F9D1}', pm: '\u{1F4BC}',
      senior_pm: '\u{1F4AA}', director: '\u{1F451}', vp: '\u{2B50}', cpo: '\u{1F680}',
    };
    const emoji = tierEmoji[summary.tierReached] || '\u{1F99E}';
    return `${emoji} Lobster Ladder ${emoji}\n` +
      `${won ? 'I reached CPO!' : `Reached Floor ${summary.finalFloor}`}\n` +
      `Score: ${summary.score.toLocaleString()} | Streak: ${summary.bestStreak} | ${Math.round(summary.accuracy * 100)}% accuracy\n` +
      `Bosses: ${summary.bossesDefeated.length} defeated\n` +
      `Inspired by @lennysan's Newsletter`;
  }

  private createButton(x: number, y: number, label: string, color: number, onClick: () => void) {
    const w = 200, h = 44, r = 6;
    const btnBg = this.add.graphics();
    btnBg.fillStyle(color, 1);
    btnBg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);

    this.add.text(x, y, label, { ...FONTS.button, fontSize: '14px' }).setOrigin(0.5);

    const zone = this.add.zone(x, y, w, h).setInteractive(
      new Phaser.Geom.Rectangle(0, 0, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    zone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(COLORS.gold, 0.8);
      btnBg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);
    });
    zone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(color, 1);
      btnBg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);
    });
    zone.on('pointerdown', onClick);
  }
}
