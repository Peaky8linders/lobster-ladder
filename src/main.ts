import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { LadderScene } from './scenes/LadderScene';
import { ChallengeScene } from './scenes/ChallengeScene';
import { BossScene } from './scenes/BossScene';
import { MoltScene } from './scenes/MoltScene';
import { GameOverScene } from './scenes/GameOverScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0a1628',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, LadderScene, ChallengeScene, BossScene, MoltScene, GameOverScene],
};

const game = new Phaser.Game(gameConfig);

if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__LOBSTER_GAME__ = game;
}
