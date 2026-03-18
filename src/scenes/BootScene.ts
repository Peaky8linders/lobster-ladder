import Phaser from 'phaser';
import { generateAllSprites } from '../utils/sprites';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    try {
      generateAllSprites(this);
      console.log('[BootScene] Sprites generated. Textures:', this.textures.getTextureKeys().filter(k => !k.startsWith('__')).join(', '));
    } catch (e) {
      console.error('[BootScene] Sprite generation failed:', e);
    }
    this.time.delayedCall(50, () => {
      this.scene.start('MenuScene');
    });
  }
}
