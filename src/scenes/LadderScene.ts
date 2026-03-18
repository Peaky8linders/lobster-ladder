import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONTS, BALANCE, TIER_NAMES } from '../config';
import { gameState } from '../systems/GameStateManager';
import { questionEngine } from '../systems/QuestionEngine';
import { playClick, playClimb } from '../utils/audio';
import { tierToColor } from '../utils/helpers';
import { getFloor } from '../data/floors';
import { getBossForFloor } from '../data/bosses';

export class LadderScene extends Phaser.Scene {
  constructor() {
    super('LadderScene');
  }

  create(data?: { fromChallenge?: boolean; passed?: boolean; scoreEarned?: number }) {
    const state = gameState.getState();

    // Handle returning from a challenge
    if (data?.fromChallenge) {
      if (data.passed) {
        // Check if we need a molt
        if (BALANCE.moltFloors.includes(state.currentFloor)) {
          gameState.advanceFloor();
          this.scene.start('MoltScene');
          return;
        }
        gameState.advanceFloor();
        // Check win
        if (state.currentFloor > BALANCE.totalFloors) {
          this.scene.start('GameOverScene', { won: true });
          return;
        }
        playClimb();
      } else {
        // Failed - check if dead
        if (state.hp <= 0) {
          this.scene.start('GameOverScene', { won: false });
          return;
        }
        // Still alive, stay on same floor
      }
    } else {
      // Fresh start
      questionEngine.reset();
    }

    this.drawScene();
  }

  private drawScene() {
    const state = gameState.getState();
    const floor = getFloor(state.currentFloor);
    if (!floor) {
      this.scene.start('GameOverScene', { won: true });
      return;
    }

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a1628, 0x0a1628, 0x0d1b2a, 0x0d1b2a, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // === LEFT PANEL: Player Status ===
    const panelX = 40;
    const panel = this.add.graphics();
    panel.fillStyle(COLORS.darkPanel, 0.8);
    panel.fillRoundedRect(panelX - 10, 30, 240, 340, 8);

    // Player lobster
    this.add.image(panelX + 110, 90, 'player-lobster').setScale(2);

    // Tier badge
    const tierColor = tierToColor(state.currentFloor <= 3 ? 'intern' : gameState.getCurrentTier());
    const tierBg = this.add.graphics();
    tierBg.fillStyle(tierColor, 0.3);
    tierBg.fillRoundedRect(panelX, 130, 220, 28, 4);
    this.add.text(panelX + 110, 144, TIER_NAMES[gameState.getCurrentTier()] || 'Intern', {
      ...FONTS.small,
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // HP
    this.add.text(panelX + 10, 175, 'SHELLS', FONTS.small);
    for (let i = 0; i < state.maxHp; i++) {
      const sx = panelX + 10 + i * 28;
      if (i < state.hp) {
        this.add.image(sx + 10, 205, 'shell-icon').setScale(1.2);
      } else {
        this.add.image(sx + 10, 205, 'shell-icon').setScale(1.2).setAlpha(0.2);
      }
    }

    // Score
    this.add.text(panelX + 10, 230, 'SCORE', FONTS.small);
    this.add.text(panelX + 10, 250, state.score.toLocaleString(), FONTS.score);

    // Streak
    this.add.text(panelX + 10, 285, 'STREAK', FONTS.small);
    this.add.text(panelX + 10, 305, `${state.streak} (best: ${state.bestStreak})`, FONTS.body);

    // Bosses defeated
    this.add.text(panelX + 10, 335, `BOSSES: ${state.bossesDefeated.length}`, FONTS.small);

    // === CENTER: Ladder View ===
    const ladderX = GAME_WIDTH / 2;
    const ladderTopY = 80;
    const floorSpacing = 100;
    const visibleFloors = 5;
    const currentIdx = state.currentFloor;

    // Ladder rails
    const railGfx = this.add.graphics();
    railGfx.lineStyle(3, 0x8ecae6, 0.15);
    railGfx.beginPath();
    railGfx.moveTo(ladderX - 90, ladderTopY);
    railGfx.lineTo(ladderX - 90, ladderTopY + visibleFloors * floorSpacing);
    railGfx.moveTo(ladderX + 90, ladderTopY);
    railGfx.lineTo(ladderX + 90, ladderTopY + visibleFloors * floorSpacing);
    railGfx.strokePath();

    // Draw visible floors (current floor at center, show above and below)
    for (let offset = -2; offset <= 2; offset++) {
      const floorNum = currentIdx - offset; // Higher floors at top
      if (floorNum < 1 || floorNum > BALANCE.totalFloors) continue;

      const fy = ladderTopY + (offset + 2) * floorSpacing;
      const fl = getFloor(floorNum);
      if (!fl) continue;

      const isCurrent = floorNum === currentIdx;
      const isCompleted = floorNum < currentIdx;
      const alpha = isCurrent ? 1 : (isCompleted ? 0.4 : 0.6);

      // Rung
      const rungGfx = this.add.graphics();
      rungGfx.lineStyle(2, tierToColor(fl.tier), alpha * 0.5);
      rungGfx.beginPath();
      rungGfx.moveTo(ladderX - 85, fy);
      rungGfx.lineTo(ladderX + 85, fy);
      rungGfx.strokePath();

      // Floor number
      const numColor = isCurrent ? '#f1c40f' : (isCompleted ? '#4a6fa5' : '#8ecae6');
      this.add.text(ladderX - 120, fy - 8, `F${floorNum}`, {
        ...FONTS.small,
        color: numColor,
        fontStyle: isCurrent ? 'bold' : 'normal',
      }).setOrigin(0.5);

      // Floor title
      this.add.text(ladderX, fy - 8, fl.title, {
        fontSize: isCurrent ? '16px' : '13px',
        color: isCurrent ? '#ffffff' : '#8ecae6',
        fontFamily: 'monospace',
        fontStyle: isCurrent ? 'bold' : 'normal',
      } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5).setAlpha(alpha);

      // Boss indicator
      if (fl.bossId) {
        const boss = getBossForFloor(floorNum);
        if (boss) {
          const bossLabel = isCompleted ? '[DEFEATED]' : `BOSS: ${boss.crustaceanName}`;
          this.add.text(ladderX, fy + 12, bossLabel, {
            ...FONTS.small,
            color: isCompleted ? '#2ecc71' : '#e63946',
            fontSize: '11px',
          }).setOrigin(0.5).setAlpha(alpha);
        }
      }

      // Current floor marker
      if (isCurrent) {
        this.add.image(ladderX - 140, fy - 4, 'player-lobster').setScale(1.5);

        // Highlight glow
        const glow = this.add.graphics();
        glow.fillStyle(COLORS.gold, 0.05);
        glow.fillRoundedRect(ladderX - 160, fy - 24, 320, 48, 6);
      }

      // Checkmark for completed
      if (isCompleted) {
        this.add.text(ladderX + 120, fy - 8, '\u2713', {
          fontSize: '16px',
          color: '#2ecc71',
          fontFamily: 'monospace',
        } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);
      }
    }

    // === RIGHT PANEL: Floor Info ===
    const rightX = GAME_WIDTH - 310;
    const rightPanel = this.add.graphics();
    rightPanel.fillStyle(COLORS.darkPanel, 0.8);
    rightPanel.fillRoundedRect(rightX, 30, 280, 380, 8);

    // Floor title
    this.add.text(rightX + 140, 55, `FLOOR ${state.currentFloor}`, {
      ...FONTS.heading,
      color: '#f1c40f',
    }).setOrigin(0.5);

    this.add.text(rightX + 140, 80, floor.title, FONTS.heading).setOrigin(0.5);

    // Tier
    const tBg = this.add.graphics();
    tBg.fillStyle(tierToColor(floor.tier), 0.3);
    tBg.fillRoundedRect(rightX + 30, 100, 220, 24, 4);
    this.add.text(rightX + 140, 112, TIER_NAMES[floor.tier] || '', {
      ...FONTS.small,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Description
    const descText = this.add.text(rightX + 20, 140, floor.description, {
      ...FONTS.body,
      wordWrap: { width: 240 },
      lineSpacing: 4,
    });

    // Challenge type
    const challengeLabel: Record<string, string> = {
      quiz: 'QUIZ',
      rapid_fire: 'RAPID FIRE',
      hot_take: 'HOT TAKE',
      framework_match: 'FRAMEWORK MATCH',
    };
    this.add.text(rightX + 140, 260, `Type: ${challengeLabel[floor.challengeType] || 'QUIZ'}`, FONTS.small).setOrigin(0.5);

    // Boss warning
    if (floor.bossId) {
      const boss = getBossForFloor(state.currentFloor);
      if (boss) {
        const warnBg = this.add.graphics();
        warnBg.fillStyle(0xe63946, 0.15);
        warnBg.fillRoundedRect(rightX + 15, 280, 250, 60, 4);
        this.add.text(rightX + 140, 295, `BOSS FIGHT`, {
          ...FONTS.small,
          color: '#e63946',
          fontStyle: 'bold',
        }).setOrigin(0.5);
        this.add.text(rightX + 140, 315, boss.crustaceanName, {
          ...FONTS.body,
          color: '#ffffff',
        }).setOrigin(0.5);
      }
    }

    // ENTER FLOOR button
    this.createButton(rightX + 140, 380, floor.bossId ? 'FIGHT BOSS' : 'ENTER FLOOR', () => {
      playClick();
      if (floor.bossId) {
        const boss = getBossForFloor(state.currentFloor);
        if (boss) {
          this.scene.start('BossScene', { boss, floor });
          return;
        }
      }
      this.scene.start('ChallengeScene', { floor });
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void) {
    const w = 220, h = 48, r = 6;
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.lobsterRed, 1);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);

    this.add.text(x, y, label, FONTS.button).setOrigin(0.5);

    const zone = this.add.zone(x, y, w, h).setInteractive(
      new Phaser.Geom.Rectangle(0, 0, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(COLORS.lobsterOrange, 1);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(COLORS.lobsterRed, 1);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);
    });
    zone.on('pointerdown', onClick);
  }
}
