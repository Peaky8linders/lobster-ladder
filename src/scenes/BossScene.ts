import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONTS, BALANCE } from '../config';
import { gameState } from '../systems/GameStateManager';
import { bossEngine } from '../systems/BossEngine';
import { playClick, playCorrect, playWrong, playBossEntrance, playBossDefeat } from '../utils/audio';
import { Boss, Floor, Question } from '../types';

export class BossScene extends Phaser.Scene {
  private boss!: Boss;
  private floor!: Floor;
  private answered = false;
  private battleStarted = false;
  private bossHpBar!: Phaser.GameObjects.Graphics;
  private playerHpDisplay!: Phaser.GameObjects.Text;
  private questionContainer: Phaser.GameObjects.GameObject[] = [];
  private abilityTextObj?: Phaser.GameObjects.Text;

  constructor() {
    super('BossScene');
  }

  create(data: { boss: Boss; floor: Floor }) {
    this.answered = false;
    this.battleStarted = false;
    this.boss = data.boss;
    this.floor = data.floor;

    bossEngine.startFight(this.boss);

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d1b2a, 0x0d1b2a, 0x1b2838, 0x1b2838, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Boss entrance
    this.showBossEntrance();
  }

  private showBossEntrance() {
    playBossEntrance();

    // Boss name reveal
    const nameText = this.add.text(GAME_WIDTH / 2, 100, this.boss.crustaceanName, {
      ...FONTS.bossName,
      fontSize: '36px',
    }).setOrigin(0.5).setAlpha(0);

    const realName = this.add.text(GAME_WIDTH / 2, 145, `${this.boss.name} | ${this.boss.company}`, {
      ...FONTS.small,
      color: '#8ecae6',
    }).setOrigin(0.5).setAlpha(0);

    // Boss sprite
    const bossKey = `boss-${this.boss.id}`;
    const bossSprite = this.add.image(GAME_WIDTH + 100, 220, bossKey).setScale(2.5).setAlpha(0);

    // Intro line
    const introLine = this.add.text(GAME_WIDTH / 2, 310, `"${this.boss.introLine}"`, {
      ...FONTS.body,
      fontStyle: 'italic',
      color: '#f4845f',
      wordWrap: { width: 600 },
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    // Ability description
    const abilityDesc = this.add.text(GAME_WIDTH / 2, 370, `Ability: ${this.boss.ability.name} - ${this.boss.ability.description}`, {
      ...FONTS.small,
      color: '#ffb703',
      wordWrap: { width: 700 },
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    // Animate entrance
    this.tweens.add({ targets: nameText, alpha: 1, duration: 500 });
    this.tweens.add({ targets: realName, alpha: 1, duration: 500, delay: 300 });
    this.tweens.add({ targets: bossSprite, x: GAME_WIDTH / 2, alpha: 1, duration: 800, delay: 200, ease: 'Back.easeOut' });
    this.tweens.add({ targets: introLine, alpha: 1, duration: 500, delay: 800 });
    this.tweens.add({ targets: abilityDesc, alpha: 1, duration: 500, delay: 1000 });

    // "FIGHT!" button after intro
    this.time.delayedCall(1500, () => {
      this.createButton(GAME_WIDTH / 2, 440, 'FIGHT!', () => {
        if (this.battleStarted) return;
        this.battleStarted = true;
        playClick();
        // Clear intro elements
        nameText.destroy();
        realName.destroy();
        bossSprite.destroy();
        introLine.destroy();
        abilityDesc.destroy();
        this.startBattle();
      });
    });
  }

  private startBattle() {
    // Draw battle UI
    this.drawBattleUI();
    this.showNextQuestion();
  }

  private drawBattleUI() {
    // Player side (left)
    this.add.image(160, 120, 'player-lobster').setScale(2);
    this.add.text(160, 170, 'YOU', FONTS.heading).setOrigin(0.5);

    // Player HP
    this.playerHpDisplay = this.add.text(160, 195, '', FONTS.body).setOrigin(0.5);
    this.updatePlayerHp();

    // Boss side (right)
    const bossKey = `boss-${this.boss.id}`;
    this.add.image(GAME_WIDTH - 160, 120, bossKey).setScale(2);
    this.add.text(GAME_WIDTH - 160, 170, this.boss.crustaceanName, {
      ...FONTS.heading,
      fontSize: '14px',
    }).setOrigin(0.5);

    // Boss HP bar
    this.bossHpBar = this.add.graphics();
    this.updateBossHpBar();

    // VS text
    this.add.text(GAME_WIDTH / 2, 120, 'VS', {
      ...FONTS.title,
      fontSize: '40px',
      color: '#f1c40f',
    }).setOrigin(0.5);

    // Ability text area
    this.abilityTextObj = this.add.text(GAME_WIDTH / 2, 250, '', {
      ...FONTS.small,
      color: '#ffb703',
      fontStyle: 'italic',
      align: 'center',
    }).setOrigin(0.5);

    // Divider
    const divider = this.add.graphics();
    divider.lineStyle(1, 0x8ecae6, 0.2);
    divider.beginPath();
    divider.moveTo(80, 270);
    divider.lineTo(GAME_WIDTH - 80, 270);
    divider.strokePath();
  }

  private updatePlayerHp() {
    const state = gameState.getState();
    let shells = '';
    for (let i = 0; i < state.maxHp; i++) {
      shells += i < state.hp ? '\u{1F41A}' : '\u{1F4A2}';
    }
    this.playerHpDisplay.setText(shells);
  }

  private updateBossHpBar() {
    const bs = bossEngine.getState();
    const barX = GAME_WIDTH - 280, barY = 195, barW = 240, barH = 16;

    this.bossHpBar.clear();
    // Background
    this.bossHpBar.fillStyle(0x333333, 1);
    this.bossHpBar.fillRoundedRect(barX, barY, barW, barH, 3);
    // Fill
    const pct = bs.hp / bs.maxHp;
    const fillColor = pct > 0.5 ? COLORS.wrong : (pct > 0.25 ? 0xffb703 : 0xe63946);
    this.bossHpBar.fillStyle(fillColor, 1);
    this.bossHpBar.fillRoundedRect(barX, barY, barW * pct, barH, 3);

    // Shield segments for Hamilton
    if (bs.shieldSegments > 0) {
      for (let i = 0; i < 7; i++) {
        const segX = barX + i * (barW / 7);
        const active = i < bs.shieldSegments;
        this.bossHpBar.fillStyle(active ? 0x4f46e5 : 0x333333, active ? 0.6 : 0.2);
        this.bossHpBar.fillRect(segX, barY + barH + 4, barW / 7 - 2, 6);
      }
    }
  }

  private showNextQuestion() {
    // Clear previous question
    this.questionContainer.forEach(obj => obj.destroy());
    this.questionContainer = [];

    const question = bossEngine.getNextQuestion();
    if (!question) {
      // No more questions - boss wins by attrition
      this.endBattle(false);
      return;
    }

    this.answered = false;

    // Question text
    const qText = this.add.text(GAME_WIDTH / 2, 310, question.text, {
      ...FONTS.body,
      fontSize: '18px',
      wordWrap: { width: 850 },
      align: 'center',
    }).setOrigin(0.5);
    this.questionContainer.push(qText);

    // Answer options (2x2)
    const labels = ['A', 'B', 'C', 'D'];
    const startY = 390;
    const colW = 480, rowH = 70;

    // Bigger Brain upgrade: eliminate wrong options
    const eliminateCount = gameState.getUpgradeStacks('bigger_brain');
    const wrongIndices: number[] = [];
    for (let j = 0; j < question.options.length; j++) {
      if (j !== question.correctIndex) wrongIndices.push(j);
    }
    const eliminated = new Set(wrongIndices.slice(0, eliminateCount));

    question.options.forEach((opt, i) => {
      if (eliminated.has(i)) return; // skip eliminated options
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ox = GAME_WIDTH / 2 + (col === 0 ? -colW / 2 - 15 : 15);
      const oy = startY + row * rowH;

      const optBg = this.add.graphics();
      optBg.fillStyle(0x1b2838, 1);
      optBg.fillRoundedRect(ox, oy, colW, 55, 6);
      optBg.lineStyle(1.5, this.boss.color, 0.3);
      optBg.strokeRoundedRect(ox, oy, colW, 55, 6);
      this.questionContainer.push(optBg);

      const labelTxt = this.add.text(ox + 20, oy + 27, `${labels[i]}.`, {
        ...FONTS.body,
        color: '#f1c40f',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);
      this.questionContainer.push(labelTxt);

      const optText = this.add.text(ox + 45, oy + 27, opt, {
        ...FONTS.body,
        fontSize: '14px',
        wordWrap: { width: colW - 60 },
      }).setOrigin(0, 0.5);
      this.questionContainer.push(optText);

      const zone = this.add.zone(ox + colW / 2, oy + 27, colW, 55).setInteractive(
        new Phaser.Geom.Rectangle(0, 0, colW, 55),
        Phaser.Geom.Rectangle.Contains
      );
      this.questionContainer.push(zone);

      zone.on('pointerover', () => {
        if (this.answered) return;
        optBg.clear();
        optBg.fillStyle(0x2a3f5f, 1);
        optBg.fillRoundedRect(ox, oy, colW, 55, 6);
        optBg.lineStyle(1.5, this.boss.color, 0.6);
        optBg.strokeRoundedRect(ox, oy, colW, 55, 6);
      });

      zone.on('pointerout', () => {
        if (this.answered) return;
        optBg.clear();
        optBg.fillStyle(0x1b2838, 1);
        optBg.fillRoundedRect(ox, oy, colW, 55, 6);
        optBg.lineStyle(1.5, this.boss.color, 0.3);
        optBg.strokeRoundedRect(ox, oy, colW, 55, 6);
      });

      zone.on('pointerdown', () => {
        if (this.answered) return;
        this.answered = true;
        playClick();

        const correct = i === question.correctIndex;
        const result = bossEngine.processAnswer(correct);

        // Flash correct/wrong
        if (correct) {
          playCorrect();
          optBg.clear();
          optBg.fillStyle(COLORS.correct, 0.3);
          optBg.fillRoundedRect(ox, oy, colW, 55, 6);
        } else {
          playWrong();
          optBg.clear();
          optBg.fillStyle(COLORS.wrong, 0.3);
          optBg.fillRoundedRect(ox, oy, colW, 55, 6);
        }

        // Ability text
        if (result.abilityText && this.abilityTextObj) {
          this.abilityTextObj.setText(result.abilityText);
          this.tweens.add({
            targets: this.abilityTextObj,
            alpha: { from: 1, to: 0.5 },
            duration: 500,
            yoyo: true,
          });
        }

        // Update UI
        this.updateBossHpBar();
        this.updatePlayerHp();

        // Check end conditions
        this.time.delayedCall(1500, () => {
          if (result.bossDefeated) {
            this.endBattle(true);
          } else if (result.playerDead) {
            this.endBattle(false);
          } else {
            this.showNextQuestion();
          }
        });
      });
    });
  }

  private endBattle(won: boolean) {
    this.questionContainer.forEach(obj => obj.destroy());
    this.questionContainer = [];

    if (won) {
      playBossDefeat();

      // Victory screen
      this.add.text(GAME_WIDTH / 2, 350, 'BOSS DEFEATED!', {
        ...FONTS.title,
        color: '#2ecc71',
        fontSize: '42px',
      }).setOrigin(0.5);

      this.add.text(GAME_WIDTH / 2, 410, `"${this.boss.quoteOnDefeat}"`, {
        ...FONTS.body,
        fontStyle: 'italic',
        color: '#f4845f',
        wordWrap: { width: 600 },
        align: 'center',
      }).setOrigin(0.5);

      this.add.text(GAME_WIDTH / 2, 470, `+${BALANCE.pointsPerBoss} bonus points!`, FONTS.score).setOrigin(0.5);

      // Particles
      for (let i = 0; i < 30; i++) {
        const p = this.add.graphics();
        p.fillStyle(this.boss.color, 0.8);
        p.fillCircle(0, 0, 2 + Math.random() * 3);
        p.setPosition(GAME_WIDTH / 2, 350);
        this.tweens.add({
          targets: p,
          x: GAME_WIDTH / 2 + (Math.random() - 0.5) * 400,
          y: 350 + (Math.random() - 0.5) * 200,
          alpha: 0,
          duration: 800 + Math.random() * 400,
        });
      }

      this.time.delayedCall(3000, () => {
        this.scene.start('LadderScene', { fromChallenge: true, passed: true, scoreEarned: BALANCE.pointsPerBoss });
      });
    } else {
      this.add.text(GAME_WIDTH / 2, 350, 'DEFEATED...', {
        ...FONTS.title,
        color: '#e74c3c',
        fontSize: '42px',
      }).setOrigin(0.5);

      this.add.text(GAME_WIDTH / 2, 410, `"${this.boss.quoteOnVictory}"`, {
        ...FONTS.body,
        fontStyle: 'italic',
        color: '#e74c3c',
        wordWrap: { width: 600 },
        align: 'center',
      }).setOrigin(0.5);

      this.time.delayedCall(3000, () => {
        if (gameState.getState().hp <= 0) {
          this.scene.start('GameOverScene', { won: false });
        } else {
          this.scene.start('LadderScene', { fromChallenge: true, passed: false, scoreEarned: 0 });
        }
      });
    }
  }

  private createButton(x: number, y: number, label: string, onClick: () => void) {
    const w = 200, h = 50, r = 6;
    const bg = this.add.graphics();
    bg.fillStyle(this.boss.color, 0.8);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);

    const txt = this.add.text(x, y, label, FONTS.button).setOrigin(0.5);

    const zone = this.add.zone(x, y, w, h).setInteractive(
      new Phaser.Geom.Rectangle(0, 0, w, h),
      Phaser.Geom.Rectangle.Contains
    );

    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(COLORS.gold, 0.8);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(this.boss.color, 0.8);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, r);
    });
    zone.on('pointerdown', onClick);
  }
}
