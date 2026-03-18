import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONTS, TIER_NAMES } from '../config';
import { gameState } from '../systems/GameStateManager';
import { playClick, playMolt } from '../utils/audio';
import { UPGRADES } from '../data/upgrades';
import { shuffle } from '../utils/helpers';
import { UpgradeId } from '../types';

export class MoltScene extends Phaser.Scene {
  private chosen = false;

  constructor() {
    super('MoltScene');
  }

  create() {
    this.chosen = false;
    const state = gameState.getState();
    const tier = gameState.getCurrentTier();

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d1b2a, 0x0d1b2a, 0x1d3557, 0x1d3557, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title
    this.add.text(GAME_WIDTH / 2, 60, 'TIME TO MOLT!', {
      ...FONTS.title,
      fontSize: '48px',
      color: '#f1c40f',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 110, 'Your shell cracks open, revealing a stronger you.', {
      ...FONTS.body,
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Tier promotion
    this.add.text(GAME_WIDTH / 2, 155, `Promoted to: ${TIER_NAMES[tier] || tier}`, {
      ...FONTS.heading,
      color: '#2ecc71',
      fontSize: '22px',
    }).setOrigin(0.5);

    // Molting animation - lobster sprite
    const lobster = this.add.image(GAME_WIDTH / 2, 230, 'player-lobster').setScale(2.5).setAlpha(0.3);

    // Shimmer effect
    this.tweens.add({
      targets: lobster,
      alpha: 1,
      scaleX: 3,
      scaleY: 3,
      duration: 1500,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        playMolt();
        // Particle burst
        for (let i = 0; i < 20; i++) {
          const p = this.add.graphics();
          p.fillStyle(COLORS.gold, 0.7);
          p.fillCircle(0, 0, 2 + Math.random() * 2);
          p.setPosition(GAME_WIDTH / 2, 230);
          this.tweens.add({
            targets: p,
            x: GAME_WIDTH / 2 + (Math.random() - 0.5) * 300,
            y: 230 + (Math.random() - 0.5) * 150,
            alpha: 0,
            duration: 600 + Math.random() * 400,
          });
        }
      },
    });

    // Choose upgrade
    this.add.text(GAME_WIDTH / 2, 320, 'Choose your evolution:', FONTS.heading).setOrigin(0.5);

    // Filter available upgrades (not at max stacks)
    const available = shuffle(UPGRADES.filter(u => state.upgrades[u.id] < u.maxStacks));
    const toShow = available.slice(0, 3);

    if (toShow.length === 0) {
      // All maxed - give bonus score
      this.add.text(GAME_WIDTH / 2, 430, 'All upgrades maxed! +500 bonus points!', {
        ...FONTS.score,
        fontSize: '22px',
      }).setOrigin(0.5);
      gameState.addScore(500);
      gameState.completeMolt();
      this.time.delayedCall(2000, () => this.scene.start('LadderScene', { fromChallenge: true, passed: true }));
      return;
    }

    const cardW = 300, cardH = 180, gap = 40;
    const totalW = toShow.length * cardW + (toShow.length - 1) * gap;
    const startX = (GAME_WIDTH - totalW) / 2;

    toShow.forEach((upgrade, i) => {
      const cx = startX + i * (cardW + gap) + cardW / 2;
      const cy = 460;
      const currentStacks = state.upgrades[upgrade.id];

      const cardBg = this.add.graphics();
      cardBg.fillStyle(COLORS.midPanel, 1);
      cardBg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
      cardBg.lineStyle(2, COLORS.foam, 0.3);
      cardBg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);

      // Upgrade name
      this.add.text(cx, cy - 55, upgrade.name, {
        ...FONTS.heading,
        fontSize: '18px',
        color: '#f1c40f',
      }).setOrigin(0.5);

      // Description
      this.add.text(cx, cy - 10, upgrade.description, {
        ...FONTS.body,
        fontSize: '14px',
        wordWrap: { width: cardW - 30 },
        align: 'center',
      }).setOrigin(0.5);

      // Stack indicator
      if (upgrade.maxStacks > 1) {
        let stackText = '';
        for (let s = 0; s < upgrade.maxStacks; s++) {
          stackText += s < currentStacks ? '\u25CF ' : '\u25CB ';
        }
        this.add.text(cx, cy + 40, stackText, {
          ...FONTS.small,
          color: '#f1c40f',
        }).setOrigin(0.5);
      }

      // Click zone
      const zone = this.add.zone(cx, cy, cardW, cardH).setInteractive(
        new Phaser.Geom.Rectangle(0, 0, cardW, cardH),
        Phaser.Geom.Rectangle.Contains
      );

      zone.on('pointerover', () => {
        if (this.chosen) return;
        cardBg.clear();
        cardBg.fillStyle(0x2a3f5f, 1);
        cardBg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
        cardBg.lineStyle(2, COLORS.gold, 0.6);
        cardBg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
      });

      zone.on('pointerout', () => {
        if (this.chosen) return;
        cardBg.clear();
        cardBg.fillStyle(COLORS.midPanel, 1);
        cardBg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
        cardBg.lineStyle(2, COLORS.foam, 0.3);
        cardBg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
      });

      zone.on('pointerdown', () => {
        if (this.chosen) return;
        this.chosen = true;
        playClick();

        gameState.applyUpgrade(upgrade.id as UpgradeId);
        gameState.completeMolt();

        // Highlight chosen
        cardBg.clear();
        cardBg.fillStyle(COLORS.correct, 0.3);
        cardBg.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);
        cardBg.lineStyle(2, COLORS.correct, 0.8);
        cardBg.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 8);

        this.add.text(GAME_WIDTH / 2, 580, `${upgrade.name} acquired!`, {
          ...FONTS.heading,
          color: '#2ecc71',
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
          this.scene.start('LadderScene', { fromChallenge: true, passed: true });
        });
      });
    });
  }
}
