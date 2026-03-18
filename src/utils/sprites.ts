import Phaser from 'phaser';
import { BOSSES } from '../data/bosses';

function adjustColor(color: number, amount: number): number {
  const r = Math.min(255, Math.max(0, ((color >> 16) & 0xff) + amount));
  const gc = Math.min(255, Math.max(0, ((color >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (color & 0xff) + amount));
  return (r << 16) | (gc << 8) | b;
}

// Draw a filled ellipse using arc (more reliable across renderers)
function fillOval(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
  g.beginPath();
  g.arc(x, y, 1, 0, Math.PI * 2);
  g.closePath();
  // Phaser's fillEllipse should work, but let's use it directly
  g.fillEllipse(x, y, w, h);
}

function drawLobsterBody(g: Phaser.GameObjects.Graphics, cx: number, cy: number, color: number, s: number) {
  const clawColor = adjustColor(color, 40);
  const tailColor = adjustColor(color, -40);

  // Body (main oval)
  g.fillStyle(color, 1);
  g.fillEllipse(cx, cy, s * 0.5, s * 0.8);

  // Tail
  g.fillStyle(tailColor, 1);
  g.fillEllipse(cx, cy + s * 0.45, s * 0.35, s * 0.15);
  g.fillEllipse(cx, cy + s * 0.55, s * 0.25, s * 0.12);
  // Tail fan
  g.fillTriangle(cx - s * 0.15, cy + s * 0.6, cx + s * 0.15, cy + s * 0.6, cx, cy + s * 0.72);

  // Left claw
  g.fillStyle(clawColor, 1);
  g.fillCircle(cx - s * 0.35, cy - s * 0.2, s * 0.12);
  g.fillRect(cx - s * 0.28, cy - s * 0.25, s * 0.1, s * 0.06);
  // Right claw
  g.fillCircle(cx + s * 0.35, cy - s * 0.2, s * 0.12);
  g.fillRect(cx + s * 0.18, cy - s * 0.25, s * 0.1, s * 0.06);

  // Eyes
  g.fillStyle(0xffffff, 1);
  g.fillCircle(cx - s * 0.08, cy - s * 0.28, s * 0.055);
  g.fillCircle(cx + s * 0.08, cy - s * 0.28, s * 0.055);
  g.fillStyle(0x111111, 1);
  g.fillCircle(cx - s * 0.08, cy - s * 0.28, s * 0.03);
  g.fillCircle(cx + s * 0.08, cy - s * 0.28, s * 0.03);

  // Antennae
  g.lineStyle(1.5, clawColor, 0.8);
  g.beginPath();
  g.moveTo(cx - s * 0.06, cy - s * 0.35);
  g.lineTo(cx - s * 0.25, cy - s * 0.55);
  g.moveTo(cx + s * 0.06, cy - s * 0.35);
  g.lineTo(cx + s * 0.25, cy - s * 0.55);
  g.strokePath();
}

function drawCrabBody(g: Phaser.GameObjects.Graphics, cx: number, cy: number, color: number, s: number) {
  const clawColor = adjustColor(color, 40);

  // Wide body
  g.fillStyle(color, 1);
  g.fillEllipse(cx, cy, s * 0.7, s * 0.5);

  // Legs (3 per side)
  g.lineStyle(2, adjustColor(color, -20), 0.8);
  for (let i = 0; i < 3; i++) {
    const ly = cy + (i - 1) * s * 0.1;
    g.beginPath();
    g.moveTo(cx - s * 0.32, ly);
    g.lineTo(cx - s * 0.48, ly + s * 0.06);
    g.moveTo(cx + s * 0.32, ly);
    g.lineTo(cx + s * 0.48, ly + s * 0.06);
    g.strokePath();
  }

  // Big claws
  g.fillStyle(clawColor, 1);
  g.fillCircle(cx - s * 0.42, cy - s * 0.22, s * 0.1);
  g.fillRect(cx - s * 0.36, cy - s * 0.2, s * 0.06, s * 0.15);
  g.fillCircle(cx + s * 0.42, cy - s * 0.22, s * 0.1);
  g.fillRect(cx + s * 0.3, cy - s * 0.2, s * 0.06, s * 0.15);

  // Eye stalks + eyes
  g.fillStyle(color, 1);
  g.fillRect(cx - s * 0.1, cy - s * 0.28, s * 0.04, s * 0.08);
  g.fillRect(cx + s * 0.06, cy - s * 0.28, s * 0.04, s * 0.08);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(cx - s * 0.08, cy - s * 0.3, s * 0.045);
  g.fillCircle(cx + s * 0.08, cy - s * 0.3, s * 0.045);
  g.fillStyle(0x111111, 1);
  g.fillCircle(cx - s * 0.08, cy - s * 0.3, s * 0.025);
  g.fillCircle(cx + s * 0.08, cy - s * 0.3, s * 0.025);
}

function drawShrimpBody(g: Phaser.GameObjects.Graphics, cx: number, cy: number, color: number, s: number) {
  const clawColor = adjustColor(color, 40);

  // Curved elongated body
  g.fillStyle(color, 1);
  g.fillEllipse(cx, cy - s * 0.05, s * 0.28, s * 0.55);
  // Tail curl
  g.fillEllipse(cx + s * 0.08, cy + s * 0.3, s * 0.22, s * 0.15);

  // Segments
  g.lineStyle(1, adjustColor(color, -25), 0.3);
  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.moveTo(cx - s * 0.1, cy + i * s * 0.09);
    g.lineTo(cx + s * 0.1, cy + i * s * 0.09);
    g.strokePath();
  }

  // Small claws
  g.fillStyle(clawColor, 1);
  g.fillCircle(cx - s * 0.2, cy - s * 0.3, s * 0.06);
  g.fillCircle(cx + s * 0.2, cy - s * 0.3, s * 0.06);

  // Long antennae
  g.lineStyle(1, clawColor, 0.7);
  g.beginPath();
  g.moveTo(cx - s * 0.04, cy - s * 0.35);
  g.lineTo(cx - s * 0.3, cy - s * 0.6);
  g.moveTo(cx + s * 0.04, cy - s * 0.35);
  g.lineTo(cx + s * 0.3, cy - s * 0.6);
  g.strokePath();

  // Eyes
  g.fillStyle(0xffffff, 1);
  g.fillCircle(cx - s * 0.07, cy - s * 0.33, s * 0.04);
  g.fillCircle(cx + s * 0.07, cy - s * 0.33, s * 0.04);
  g.fillStyle(0x111111, 1);
  g.fillCircle(cx - s * 0.07, cy - s * 0.33, s * 0.02);
  g.fillCircle(cx + s * 0.07, cy - s * 0.33, s * 0.02);
}

// === BOSS ACCESSORIES ===

type AccessoryFn = (g: Phaser.GameObjects.Graphics, cx: number, cy: number, s: number) => void;

const bossAccessories: Record<string, AccessoryFn> = {
  boss_shreyas: (g, cx, cy, s) => {
    // Boxing gloves
    g.fillStyle(0xff4444, 1);
    g.fillCircle(cx - s * 0.25, cy - s * 0.35, s * 0.08);
    g.fillCircle(cx + s * 0.25, cy - s * 0.35, s * 0.08);
  },
  boss_april: (g, cx, cy, s) => {
    // Crown
    g.fillStyle(0xf1c40f, 1);
    g.fillRect(cx - s * 0.15, cy - s * 0.42, s * 0.3, s * 0.06);
    g.fillTriangle(cx - s * 0.12, cy - s * 0.42, cx - s * 0.06, cy - s * 0.52, cx, cy - s * 0.42);
    g.fillTriangle(cx, cy - s * 0.42, cx + s * 0.06, cy - s * 0.54, cx + s * 0.12, cy - s * 0.42);
  },
  boss_hamilton: (g, cx, cy, s) => {
    // 7 shield dots
    g.lineStyle(1.5, 0xf1c40f, 0.8);
    g.strokeCircle(cx, cy, s * 0.16);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
      g.fillStyle(0xf1c40f, 1);
      g.fillCircle(cx + Math.cos(a) * s * 0.16, cy + Math.sin(a) * s * 0.16, s * 0.02);
    }
  },
  boss_annie: (g, cx, cy, s) => {
    // Dice
    g.fillStyle(0xffffff, 1);
    g.fillRect(cx - s * 0.45, cy - s * 0.45, s * 0.08, s * 0.08);
    g.fillRect(cx + s * 0.37, cy - s * 0.45, s * 0.08, s * 0.08);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx - s * 0.41, cy - s * 0.41, s * 0.012);
  },
  boss_molly: (g, cx, cy, s) => {
    // Lego bricks
    [0xff4444, 0x4488ff, 0xffee00, 0x44cc44].forEach((c, i) => {
      g.fillStyle(c, 1);
      g.fillRect(cx - s * 0.25 + i * s * 0.13, cy + s * 0.32, s * 0.09, s * 0.05);
    });
  },
  boss_stewart: (g, cx, cy, s) => {
    // Spiral shell
    g.fillStyle(0xd4a574, 0.7);
    g.fillCircle(cx + s * 0.12, cy + s * 0.05, s * 0.18);
    g.lineStyle(1, 0x8b6914, 0.5);
    g.strokeCircle(cx + s * 0.12, cy + s * 0.05, s * 0.12);
    g.strokeCircle(cx + s * 0.12, cy + s * 0.05, s * 0.06);
  },
  boss_ben: (g, cx, cy, s) => {
    // Red headband
    g.fillStyle(0xff0000, 0.9);
    g.fillRect(cx - s * 0.18, cy - s * 0.32, s * 0.36, s * 0.04);
    g.lineStyle(2, 0xff0000, 0.7);
    g.beginPath();
    g.moveTo(cx + s * 0.18, cy - s * 0.3);
    g.lineTo(cx + s * 0.3, cy - s * 0.22);
    g.strokePath();
  },
  boss_melanie: (g, cx, cy, s) => {
    // Paint dots
    [0xff4444, 0x4488ff, 0xffcc00, 0x44cc44, 0xff88cc].forEach((c, i) => {
      g.fillStyle(c, 1);
      g.fillCircle(cx - s * 0.12 + i * s * 0.06, cy + s * 0.35, s * 0.02);
    });
  },
  boss_bret: (g, cx, cy, s) => {
    // Multi-color tool dots
    [0x4285f4, 0x1877f2, 0x00a1e0, 0x10a37f].forEach((c, i) => {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
      g.fillStyle(c, 0.8);
      g.fillCircle(cx + Math.cos(a) * s * 0.35, cy + Math.sin(a) * s * 0.15, s * 0.04);
    });
  },
  boss_elena: (g, cx, cy, s) => {
    // Growth arrow
    g.lineStyle(2, 0x44ff44, 0.8);
    g.beginPath();
    g.moveTo(cx - s * 0.15, cy + s * 0.1);
    g.lineTo(cx, cy - s * 0.05);
    g.lineTo(cx + s * 0.15, cy - s * 0.15);
    g.strokePath();
  },
  boss_brian: (g, cx, cy, s) => {
    // Royal crown
    g.fillStyle(0xf1c40f, 1);
    g.fillRect(cx - s * 0.15, cy - s * 0.38, s * 0.3, s * 0.06);
    g.fillTriangle(cx - s * 0.1, cy - s * 0.38, cx - s * 0.05, cy - s * 0.48, cx, cy - s * 0.38);
    g.fillTriangle(cx, cy - s * 0.38, cx + s * 0.05, cy - s * 0.5, cx + s * 0.1, cy - s * 0.38);
  },
  boss_marc: (g, cx, cy, s) => {
    // Starburst
    g.lineStyle(1.5, 0xf1c40f, 0.4);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * s * 0.25, cy + Math.sin(a) * s * 0.25);
      g.lineTo(cx + Math.cos(a) * s * 0.38, cy + Math.sin(a) * s * 0.38);
      g.strokePath();
    }
  },
  boss_chip: (g, cx, cy, s) => {
    // Reading glasses
    g.lineStyle(1.5, 0xcccccc, 0.9);
    g.strokeCircle(cx - s * 0.08, cy - s * 0.18, s * 0.045);
    g.strokeCircle(cx + s * 0.08, cy - s * 0.18, s * 0.045);
    g.beginPath();
    g.moveTo(cx - s * 0.035, cy - s * 0.18);
    g.lineTo(cx + s * 0.035, cy - s * 0.18);
    g.strokePath();
  },
  boss_howie: (g, cx, cy, s) => {
    // Circuit traces
    g.lineStyle(1, 0x00ffaa, 0.5);
    g.beginPath();
    g.moveTo(cx - s * 0.12, cy - s * 0.08);
    g.lineTo(cx, cy + s * 0.08);
    g.lineTo(cx + s * 0.12, cy - s * 0.04);
    g.strokePath();
    g.fillStyle(0x00ffaa, 0.7);
    g.fillCircle(cx - s * 0.12, cy - s * 0.08, s * 0.018);
    g.fillCircle(cx + s * 0.12, cy - s * 0.04, s * 0.018);
  },
  boss_eoghan: (g, cx, cy, s) => {
    // Phoenix flames
    g.fillStyle(0xff4500, 0.2);
    g.fillCircle(cx, cy, s * 0.45);
    g.fillStyle(0xff6600, 0.15);
    g.fillCircle(cx, cy - s * 0.05, s * 0.35);
    // Wing hints
    g.lineStyle(2, 0xff6600, 0.5);
    g.beginPath();
    g.moveTo(cx - s * 0.25, cy);
    g.lineTo(cx - s * 0.42, cy - s * 0.25);
    g.moveTo(cx + s * 0.25, cy);
    g.lineTo(cx + s * 0.42, cy - s * 0.25);
    g.strokePath();
  },
};

// === PUBLIC API ===

export function generateLobsterSprite(scene: Phaser.Scene, key: string, color: number, size: number = 40) {
  const g = scene.add.graphics();
  drawLobsterBody(g, size, size, color, size);
  g.generateTexture(key, size * 2, size * 2);
  g.destroy();
}

export function generateBossSprite(scene: Phaser.Scene, key: string, color: number, size: number = 60, bossId?: string, crustaceanType?: string) {
  const g = scene.add.graphics();
  const cx = size, cy = size;

  switch (crustaceanType) {
    case 'crab':
    case 'hermit_crab':
      drawCrabBody(g, cx, cy, color, size);
      break;
    case 'shrimp':
    case 'prawn':
    case 'mantis_shrimp':
      drawShrimpBody(g, cx, cy, color, size);
      break;
    default:
      drawLobsterBody(g, cx, cy, color, size);
  }

  if (bossId && bossAccessories[bossId]) {
    bossAccessories[bossId](g, cx, cy, size);
  }

  g.generateTexture(key, size * 2, size * 2);
  g.destroy();
}

export function generateAllSprites(scene: Phaser.Scene) {
  // Player lobster
  generateLobsterSprite(scene, 'player-lobster', 0xe63946, 32);

  // All 15 boss sprites
  for (const boss of BOSSES) {
    generateBossSprite(scene, `boss-${boss.id}`, boss.color, 50, boss.id, boss.crustaceanType);
  }

  // Shell icon for HP
  const sg = scene.add.graphics();
  sg.fillStyle(0xd4a574, 1);
  sg.fillEllipse(10, 8, 16, 12);
  sg.lineStyle(1, 0x8b6914, 0.6);
  sg.beginPath();
  for (let i = 0; i < 4; i++) {
    sg.moveTo(4 + i * 4, 2);
    sg.lineTo(4 + i * 4, 14);
  }
  sg.strokePath();
  sg.generateTexture('shell-icon', 20, 16);
  sg.destroy();

  // Platform texture
  const pg = scene.add.graphics();
  pg.fillStyle(0x1b2838, 1);
  pg.fillRoundedRect(0, 0, 160, 32, 4);
  pg.lineStyle(1, 0x8ecae6, 0.4);
  pg.strokeRoundedRect(0, 0, 160, 32, 4);
  pg.generateTexture('platform', 160, 32);
  pg.destroy();
}
