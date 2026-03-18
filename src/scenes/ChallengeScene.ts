import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONTS, BALANCE } from '../config';
import { gameState } from '../systems/GameStateManager';
import { questionEngine } from '../systems/QuestionEngine';
import { playClick, playCorrect, playWrong, playStreak } from '../utils/audio';
import { difficultyForTier } from '../utils/helpers';
import { Floor, Question, HotTake } from '../types';

export class ChallengeScene extends Phaser.Scene {
  private floor!: Floor;
  private answered = false;
  private rapidFireScore = 0;
  private rapidFireTimer = 0;
  private rapidFireActive = false;
  private timerText?: Phaser.GameObjects.Text;
  private timerEvent?: Phaser.Time.TimerEvent;

  constructor() {
    super('ChallengeScene');
  }

  create(data: { floor: Floor }) {
    this.floor = data.floor;
    this.answered = false;
    this.rapidFireScore = 0;
    this.rapidFireActive = false;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d1b2a, 0x0d1b2a, 0x1b2838, 0x1b2838, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Floor header
    this.add.text(GAME_WIDTH / 2, 25, `Floor ${this.floor.number} - ${this.floor.title}`, {
      ...FONTS.heading,
      color: '#8ecae6',
    }).setOrigin(0.5);

    switch (this.floor.challengeType) {
      case 'rapid_fire':
        this.setupRapidFire();
        break;
      case 'hot_take':
        this.setupHotTake();
        break;
      case 'framework_match':
        this.setupFrameworkMatch();
        break;
      default:
        this.setupQuiz();
        break;
    }
  }

  // === QUIZ MODE ===
  private setupQuiz() {
    const [minD, maxD] = difficultyForTier(this.floor.tier);
    const question = questionEngine.getQuestion(minD, maxD);
    if (!question) {
      this.returnToLadder(true, 50);
      return;
    }

    this.renderQuestion(question);
  }

  private renderQuestion(question: Question) {
    this.answered = false;

    // Question text
    const qText = this.add.text(GAME_WIDTH / 2, 120, question.text, {
      ...FONTS.body,
      fontSize: '20px',
      wordWrap: { width: 900 },
      lineSpacing: 6,
      align: 'center',
    }).setOrigin(0.5);

    // Source
    this.add.text(GAME_WIDTH / 2, 180, `- ${question.source}`, {
      ...FONTS.small,
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Answer options (2x2 grid)
    const labels = ['A', 'B', 'C', 'D'];
    const startY = 260;
    const colW = 500, rowH = 80;
    const optionBgs: Phaser.GameObjects.Graphics[] = [];

    // Check if bigger_brain upgrade should eliminate options
    const eliminateCount = gameState.getUpgradeStacks('bigger_brain');
    const wrongIndices: number[] = [];
    for (let i = 0; i < question.options.length; i++) {
      if (i !== question.correctIndex) wrongIndices.push(i);
    }
    const eliminated = new Set(wrongIndices.slice(0, eliminateCount));

    question.options.forEach((opt, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ox = GAME_WIDTH / 2 + (col === 0 ? -colW / 2 - 20 : 20);
      const oy = startY + row * rowH;

      const isEliminated = eliminated.has(i);

      const optBg = this.add.graphics();
      optBg.fillStyle(isEliminated ? 0x1b2838 : 0x1b2838, 1);
      optBg.fillRoundedRect(ox, oy, colW, 60, 6);
      optBg.lineStyle(1.5, isEliminated ? 0x333333 : 0x8ecae6, isEliminated ? 0.2 : 0.3);
      optBg.strokeRoundedRect(ox, oy, colW, 60, 6);
      optionBgs.push(optBg);

      const labelTxt = this.add.text(ox + 25, oy + 30, `${labels[i]}.`, {
        ...FONTS.body,
        color: isEliminated ? '#333333' : '#f1c40f',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);

      const optText = this.add.text(ox + 50, oy + 30, opt, {
        ...FONTS.body,
        color: isEliminated ? '#444444' : '#e2e8f0',
        wordWrap: { width: colW - 70 },
      }).setOrigin(0, 0.5);

      if (isEliminated) {
        // Show strikethrough effect
        const line = this.add.graphics();
        line.lineStyle(1, 0x666666, 0.5);
        line.beginPath();
        line.moveTo(ox + 15, oy + 30);
        line.lineTo(ox + colW - 15, oy + 30);
        line.strokePath();
        return;
      }

      const zone = this.add.zone(ox + colW / 2, oy + 30, colW, 60).setInteractive(
        new Phaser.Geom.Rectangle(0, 0, colW, 60),
        Phaser.Geom.Rectangle.Contains
      );

      zone.on('pointerover', () => {
        if (this.answered) return;
        optBg.clear();
        optBg.fillStyle(0x2a3f5f, 1);
        optBg.fillRoundedRect(ox, oy, colW, 60, 6);
        optBg.lineStyle(1.5, 0x8ecae6, 0.6);
        optBg.strokeRoundedRect(ox, oy, colW, 60, 6);
      });

      zone.on('pointerout', () => {
        if (this.answered) return;
        optBg.clear();
        optBg.fillStyle(0x1b2838, 1);
        optBg.fillRoundedRect(ox, oy, colW, 60, 6);
        optBg.lineStyle(1.5, 0x8ecae6, 0.3);
        optBg.strokeRoundedRect(ox, oy, colW, 60, 6);
      });

      zone.on('pointerdown', () => {
        if (this.answered) return;
        this.answered = true;
        playClick();
        this.handleAnswer(i === question.correctIndex, question, optionBgs, i, question.correctIndex);
      });
    });
  }

  private handleAnswer(correct: boolean, question: Question, optBgs: Phaser.GameObjects.Graphics[], chosen: number, correctIdx: number) {
    // Highlight correct/wrong
    const labels = ['A', 'B', 'C', 'D'];
    const startY = 260;
    const colW = 500, rowH = 80;

    question.options.forEach((_, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ox = GAME_WIDTH / 2 + (col === 0 ? -colW / 2 - 20 : 20);
      const oy = startY + row * rowH;

      const bg = optBgs[i];
      if (!bg) return;
      bg.clear();
      if (i === correctIdx) {
        bg.fillStyle(COLORS.correct, 0.3);
      } else if (i === chosen && !correct) {
        bg.fillStyle(COLORS.wrong, 0.3);
      } else {
        bg.fillStyle(0x1b2838, 0.5);
      }
      bg.fillRoundedRect(ox, oy, colW, 60, 6);
    });

    if (correct) {
      playCorrect();
      gameState.recordCorrectAnswer();
      gameState.addScore(BALANCE.pointsPerCorrect);
      if (gameState.getState().streak >= BALANCE.streakBonusThreshold) {
        playStreak();
      }

      // Score popup
      const popup = this.add.text(GAME_WIDTH / 2, 460, `+${BALANCE.pointsPerCorrect}`, FONTS.score).setOrigin(0.5);
      this.tweens.add({ targets: popup, y: 430, alpha: 0, duration: 1000 });

      this.add.text(GAME_WIDTH / 2, 510, 'CORRECT!', {
        ...FONTS.heading,
        color: '#2ecc71',
        fontSize: '28px',
      }).setOrigin(0.5);
    } else {
      playWrong();
      gameState.recordWrongAnswer();
      const alive = gameState.takeDamage();

      this.add.text(GAME_WIDTH / 2, 510, 'WRONG!', {
        ...FONTS.heading,
        color: '#e74c3c',
        fontSize: '28px',
      }).setOrigin(0.5);

      if (!alive) {
        this.add.text(GAME_WIDTH / 2, 545, 'Your shell cracked...', FONTS.body).setOrigin(0.5);
      }
    }

    // Fun fact
    if (question.funFact) {
      this.add.text(GAME_WIDTH / 2, 580, question.funFact, {
        ...FONTS.small,
        fontStyle: 'italic',
        wordWrap: { width: 800 },
        align: 'center',
      }).setOrigin(0.5);
    }

    // Continue after delay
    this.time.delayedCall(2000, () => {
      this.returnToLadder(correct, correct ? BALANCE.pointsPerCorrect : 0);
    });
  }

  // === RAPID FIRE MODE ===
  private setupRapidFire() {
    this.rapidFireActive = true;
    this.rapidFireScore = 0;

    this.add.text(GAME_WIDTH / 2, 70, 'RAPID FIRE!', {
      ...FONTS.heading,
      color: '#f1c40f',
      fontSize: '32px',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 100, 'Answer as many as you can!', FONTS.body).setOrigin(0.5);

    this.timerText = this.add.text(GAME_WIDTH / 2, 140, '15', {
      ...FONTS.score,
      fontSize: '36px',
    }).setOrigin(0.5);

    let timeLeft = BALANCE.rapidFireTime / 1000;
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        timeLeft--;
        if (this.timerText) this.timerText.setText(String(timeLeft));
        if (timeLeft <= 0) {
          this.rapidFireActive = false;
          this.endRapidFire();
        }
      },
      repeat: timeLeft - 1,
    });

    this.nextRapidFireQuestion();
  }

  private rapidFireContainer?: Phaser.GameObjects.Container;

  private nextRapidFireQuestion() {
    if (!this.rapidFireActive) return;

    // Clear previous question elements
    if (this.rapidFireContainer) {
      this.rapidFireContainer.destroy(true);
      this.rapidFireContainer = undefined;
    }

    const [minD, maxD] = difficultyForTier(this.floor.tier);
    const question = questionEngine.getQuestion(minD, maxD);
    if (!question) {
      this.endRapidFire();
      return;
    }

    // Use a simple 2-option format for speed
    const correctOpt = question.options[question.correctIndex];
    const wrongOpts = question.options.filter((_, i) => i !== question.correctIndex);
    const wrongOpt = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];

    const shuffled = Math.random() > 0.5 ? [correctOpt, wrongOpt] : [wrongOpt, correctOpt];
    const correctIdx = shuffled.indexOf(correctOpt);

    const qText = this.add.text(GAME_WIDTH / 2, 240, question.text, {
      ...FONTS.body,
      fontSize: '18px',
      wordWrap: { width: 800 },
      align: 'center',
    }).setOrigin(0.5);

    const scoreDisplay = this.add.text(GAME_WIDTH - 100, 140, `Score: ${this.rapidFireScore}`, FONTS.score);

    const buttons: Phaser.GameObjects.GameObject[] = [qText, scoreDisplay];

    shuffled.forEach((opt, i) => {
      const bx = GAME_WIDTH / 2 + (i === 0 ? -260 : 20);
      const by = 340;
      const bw = 480, bh = 60;

      const optBg = this.add.graphics();
      optBg.fillStyle(0x1b2838, 1);
      optBg.fillRoundedRect(bx, by, bw, bh, 6);
      optBg.lineStyle(1.5, 0x8ecae6, 0.3);
      optBg.strokeRoundedRect(bx, by, bw, bh, 6);

      const optText = this.add.text(bx + bw / 2, by + bh / 2, opt, {
        ...FONTS.body,
        wordWrap: { width: bw - 30 },
      }).setOrigin(0.5);

      const zone = this.add.zone(bx + bw / 2, by + bh / 2, bw, bh).setInteractive(
        new Phaser.Geom.Rectangle(0, 0, bw, bh),
        Phaser.Geom.Rectangle.Contains
      );

      zone.on('pointerdown', () => {
        if (!this.rapidFireActive) return;
        if (i === correctIdx) {
          playCorrect();
          this.rapidFireScore++;
          gameState.recordCorrectAnswer();
          gameState.addScore(50);
        } else {
          playWrong();
          gameState.recordWrongAnswer();
        }
        // Container destroy handles all children
        this.nextRapidFireQuestion();
      });

      buttons.push(optBg, optText, zone);
    });

    // Store for cleanup
    this.rapidFireContainer = this.add.container(0, 0, buttons as Phaser.GameObjects.GameObject[]);
  }

  private endRapidFire() {
    this.rapidFireActive = false;
    if (this.timerEvent) this.timerEvent.remove();

    const resultText = this.rapidFireScore >= 3 ? 'Great job!' : 'Not bad!';
    this.add.text(GAME_WIDTH / 2, 480, `${resultText} ${this.rapidFireScore} correct!`, {
      ...FONTS.heading,
      color: '#f1c40f',
      fontSize: '28px',
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.returnToLadder(true, this.rapidFireScore * 50);
    });
  }

  // === HOT TAKE MODE ===
  private setupHotTake() {
    const [minD, maxD] = difficultyForTier(this.floor.tier);
    const hotTake = questionEngine.getHotTake(minD, maxD);
    if (!hotTake) {
      this.returnToLadder(true, 50);
      return;
    }

    this.add.text(GAME_WIDTH / 2, 70, 'HOT TAKE', {
      ...FONTS.heading,
      color: '#fb8500',
      fontSize: '28px',
    }).setOrigin(0.5);

    // Quote
    const quoteBox = this.add.graphics();
    quoteBox.fillStyle(0x1b2838, 0.8);
    quoteBox.fillRoundedRect(140, 110, GAME_WIDTH - 280, 120, 8);

    this.add.text(GAME_WIDTH / 2, 145, `"${hotTake.quote}"`, {
      ...FONTS.body,
      fontSize: '18px',
      fontStyle: 'italic',
      wordWrap: { width: GAME_WIDTH - 340 },
      align: 'center',
    }).setOrigin(0.5, 0);

    this.add.text(GAME_WIDTH / 2, 215, `- ${hotTake.speaker}`, {
      ...FONTS.small,
      color: '#f1c40f',
    }).setOrigin(0.5);

    // Agree / Disagree buttons
    const makeBtn = (x: number, label: string, color: number, reasoning: string) => {
      const w = 300, h = 60;
      const btnBg = this.add.graphics();
      btnBg.fillStyle(color, 0.3);
      btnBg.fillRoundedRect(x - w / 2, 280, w, h, 8);
      btnBg.lineStyle(2, color, 0.6);
      btnBg.strokeRoundedRect(x - w / 2, 280, w, h, 8);

      this.add.text(x, 310, label, {
        ...FONTS.button,
        fontSize: '22px',
      }).setOrigin(0.5);

      const zone = this.add.zone(x, 310, w, h).setInteractive(
        new Phaser.Geom.Rectangle(0, 0, w, h),
        Phaser.Geom.Rectangle.Contains
      );

      zone.on('pointerdown', () => {
        if (this.answered) return;
        this.answered = true;
        playClick();

        // Show both reasonings
        this.add.text(GAME_WIDTH / 2 - 280, 380, 'AGREE because:', {
          ...FONTS.small,
          color: '#2ecc71',
          fontStyle: 'bold',
        });
        this.add.text(GAME_WIDTH / 2 - 280, 400, hotTake.agreeReasoning, {
          ...FONTS.body,
          wordWrap: { width: 500 },
          fontSize: '14px',
        });

        this.add.text(GAME_WIDTH / 2 + 80, 380, 'DISAGREE because:', {
          ...FONTS.small,
          color: '#e74c3c',
          fontStyle: 'bold',
        });
        this.add.text(GAME_WIDTH / 2 + 80, 400, hotTake.disagreeReasoning, {
          ...FONTS.body,
          wordWrap: { width: 500 },
          fontSize: '14px',
        });

        // Always counts as correct (both are valid)
        gameState.recordCorrectAnswer();
        gameState.addScore(BALANCE.pointsPerCorrect);
        playCorrect();

        this.add.text(GAME_WIDTH / 2, 530, 'Both sides have merit! +100 points', {
          ...FONTS.body,
          color: '#f1c40f',
        }).setOrigin(0.5);

        if (hotTake.funFact) {
          this.add.text(GAME_WIDTH / 2, 560, hotTake.funFact, {
            ...FONTS.small,
            fontStyle: 'italic',
            wordWrap: { width: 700 },
            align: 'center',
          }).setOrigin(0.5);
        }

        this.time.delayedCall(3000, () => {
          this.returnToLadder(true, BALANCE.pointsPerCorrect);
        });
      });
    };

    makeBtn(GAME_WIDTH / 2 - 200, 'AGREE', COLORS.correct, hotTake.agreeReasoning);
    makeBtn(GAME_WIDTH / 2 + 200, 'DISAGREE', COLORS.wrong, hotTake.disagreeReasoning);
  }

  // === FRAMEWORK MATCH MODE ===
  private setupFrameworkMatch() {
    // Simplified: present as a quiz about which guest said what
    this.setupQuiz();
  }

  private returnToLadder(passed: boolean, scoreEarned: number) {
    this.scene.start('LadderScene', { fromChallenge: true, passed, scoreEarned });
  }
}
