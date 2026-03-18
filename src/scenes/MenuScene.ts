import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONTS } from '../config';
import { playClick, playBubble } from '../utils/audio';
import { gameState } from '../systems/GameStateManager';

interface Bubble {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
  wobble: number;
}

export class MenuScene extends Phaser.Scene {
  private bubbles: Bubble[] = [];
  private bubblesGfx!: Phaser.GameObjects.Graphics;

  constructor() {
    super('MenuScene');
  }

  create() {
    console.log('MenuScene create START');

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.background, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Subtle wave lines
    bg.lineStyle(1, 0x8ecae6, 0.06);
    for (let y = 100; y < GAME_HEIGHT; y += 60) {
      bg.beginPath();
      for (let x = 0; x <= GAME_WIDTH; x += 4) {
        const wy = y + Math.sin(x * 0.01 + y * 0.1) * 8;
        if (x === 0) bg.moveTo(x, wy);
        else bg.lineTo(x, wy);
      }
      bg.strokePath();
    }

    console.log('MenuScene bg done');

    // Bubbles
    this.bubbles = [];
    for (let i = 0; i < 40; i++) {
      this.bubbles.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        speed: 0.2 + Math.random() * 0.5,
        size: 2 + Math.random() * 4,
        alpha: 0.05 + Math.random() * 0.15,
        wobble: Math.random() * Math.PI * 2,
      });
    }
    this.bubblesGfx = this.add.graphics();

    console.log('MenuScene bubbles done');

    // Title
    this.add.text(GAME_WIDTH / 2, 160, 'LOBSTER LADDER', {
      fontSize: '64px',
      color: '#e63946',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 230, 'Climb the Product Ladder', {
      fontSize: '22px',
      color: '#8ecae6',
      fontFamily: 'monospace',
    } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);

    console.log('MenuScene title done');

    // Player lobster (use texture if available, fallback to graphics)
    if (this.textures.exists('player-lobster')) {
      const lobster = this.add.image(GAME_WIDTH / 2, 340, 'player-lobster').setScale(2.5);
      this.tweens.add({
        targets: lobster,
        y: 350,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      console.log('player-lobster texture not found, drawing fallback');
      const lobGfx = this.add.graphics();
      lobGfx.fillStyle(COLORS.lobsterRed, 1);
      lobGfx.fillEllipse(GAME_WIDTH / 2, 340, 30, 45);
      lobGfx.fillEllipse(GAME_WIDTH / 2 - 25, 320, 15, 10);
      lobGfx.fillEllipse(GAME_WIDTH / 2 + 25, 320, 15, 10);
      lobGfx.fillStyle(0xffffff, 1);
      lobGfx.fillCircle(GAME_WIDTH / 2 - 6, 325, 3);
      lobGfx.fillCircle(GAME_WIDTH / 2 + 6, 325, 3);
    }

    console.log('MenuScene lobster done');

    // Tagline
    this.add.text(GAME_WIDTH / 2, 420, 'From Intern to CPO - one shell at a time', {
      fontSize: '16px',
      color: '#e2e8f0',
      fontFamily: 'monospace',
      fontStyle: 'italic',
    } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);

    // Start button
    const btnW = 260, btnH = 56, btnR = 8;
    const btnX = GAME_WIDTH / 2, btnY = 500;
    const btnBg = this.add.graphics();
    btnBg.fillStyle(COLORS.lobsterRed, 1);
    btnBg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, btnR);
    btnBg.lineStyle(2, COLORS.lobsterOrange, 0.6);
    btnBg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, btnR);

    this.add.text(btnX, btnY, 'START CLIMB', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);

    const zone = this.add.zone(btnX, btnY, btnW, btnH).setInteractive();
    zone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(COLORS.lobsterOrange, 1);
      btnBg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, btnR);
      btnBg.lineStyle(2, COLORS.gold, 0.8);
      btnBg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, btnR);
    });
    zone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(COLORS.lobsterRed, 1);
      btnBg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, btnR);
      btnBg.lineStyle(2, COLORS.lobsterOrange, 0.6);
      btnBg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, btnR);
    });
    zone.on('pointerdown', () => {
      playClick();
      gameState.newRun();
      this.scene.start('LadderScene');
    });

    // Credits
    this.add.text(GAME_WIDTH / 2, 650, "Inspired by Lenny's Newsletter & Podcast", {
      fontSize: '13px',
      color: '#8ecae6',
      fontFamily: 'monospace',
    } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 672, 'v0.1.0 | Built with Phaser 3 | 2026', {
      fontSize: '13px',
      color: '#4a6fa5',
      fontFamily: 'monospace',
    } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);

    console.log('MenuScene create DONE');
  }

  update() {
    if (!this.bubblesGfx) return;
    this.bubblesGfx.clear();
    for (const b of this.bubbles) {
      b.y -= b.speed;
      b.wobble += 0.02;
      b.x += Math.sin(b.wobble) * 0.3;
      if (b.y < -10) {
        b.y = GAME_HEIGHT + 10;
        b.x = Math.random() * GAME_WIDTH;
      }
      this.bubblesGfx.fillStyle(0x8ecae6, b.alpha);
      this.bubblesGfx.fillCircle(b.x, b.y, b.size);
    }
  }
}
