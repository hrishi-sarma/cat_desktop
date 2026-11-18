import React, { useEffect, useRef } from 'react';
import { CatState, CatSkin, CatHat, PlacedItem, RoomTheme } from '../types/cat';
import { SHOP_ITEMS, ROOM_THEMES } from '../constants/shopCatalog';

interface CatRendererProps {
  width: number;
  height: number;
  catState: CatState;
  skin: CatSkin;
  hat: CatHat;
  catX: number;
  catY: number;
  facingLeft: boolean;
  placedItems: PlacedItem[];
  currentRoom: RoomTheme;
  cursorPos: { x: number; y: number } | null;
  activeYarn: { x: number; y: number } | null;
  activeFood: { x: number; y: number } | null;
  particles: Particle[];
  onCatClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export interface Particle {
  id: string;
  type: 'heart' | 'sparkle' | 'zzz' | 'coin';
  x: number;
  y: number;
  vy: number;
  vx: number;
  life: number;
  text?: string;
}

export const CatRenderer: React.FC<CatRendererProps> = ({
  width,
  height,
  catState,
  skin,
  hat,
  catX,
  catY,
  facingLeft,
  placedItems,
  currentRoom,
  cursorPos,
  activeYarn,
  activeFood,
  particles,
  onCatClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const tickRef = useRef<number>(0);

  // Store mutable props in a Ref to keep the RAF loop 100% stable without re-mounting
  const propsRef = useRef({
    catState,
    skin,
    hat,
    catX,
    catY,
    facingLeft,
    placedItems,
    currentRoom,
    cursorPos,
    activeYarn,
    activeFood,
    particles,
  });

  // Keep propsRef in sync
  useEffect(() => {
    propsRef.current = {
      catState,
      skin,
      hat,
      catX,
      catY,
      facingLeft,
      placedItems,
      currentRoom,
      cursorPos,
      activeYarn,
      activeFood,
      particles,
    };
  }, [
    catState,
    skin,
    hat,
    catX,
    catY,
    facingLeft,
    placedItems,
    currentRoom,
    cursorPos,
    activeYarn,
    activeFood,
    particles,
  ]);

  // Single Stable Render Loop (mounts once per width/height change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      tickRef.current += 1;
      const tick = tickRef.current;

      const {
        catState: cs,
        skin: sk,
        hat: ht,
        catX: cx,
        catY: cy,
        facingLeft: fl,
        placedItems: pi,
        currentRoom: cr,
        cursorPos: cp,
        activeYarn: ay,
        activeFood: af,
        particles: pt,
      } = propsRef.current;

      ctx.clearRect(0, 0, width, height);

      // 1. Background
      drawRoomBackground(ctx, width, height, cr);

      // 2. Placed Furniture (bright & vibrant)
      drawPlacedFurniture(ctx, pi, width, height);

      // 3. Items (Yarn/Food)
      if (ay) drawYarnBall(ctx, ay.x, ay.y, tick);
      if (af) drawFoodBowl(ctx, af.x, af.y);

      // 4. Cat Sprite & Hat
      drawCatSprite(ctx, cx, cy, width, height, cs, sk, ht, fl, tick, cp);

      // 5. Particles
      drawParticles(ctx, pt);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={onCatClick}
      className="cat-canvas cursor-pointer select-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        imageRendering: 'pixelated',
      }}
    />
  );
};

// ==========================================
// DRAWING HELPER FUNCTIONS
// ==========================================

function drawRoomBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  room: RoomTheme
) {
  const roomMeta = ROOM_THEMES[room] || ROOM_THEMES.bedroom;
  const floorY = h * 0.7;

  // Draw Wall
  const wallGradient = ctx.createLinearGradient(0, 0, 0, floorY);
  if (room === 'bedroom') {
    wallGradient.addColorStop(0, '#1e1b4b');
    wallGradient.addColorStop(1, '#312e81');
  } else if (room === 'living') {
    wallGradient.addColorStop(0, '#0f172a');
    wallGradient.addColorStop(1, '#1e293b');
  } else if (room === 'garden') {
    wallGradient.addColorStop(0, '#0284c7');
    wallGradient.addColorStop(1, '#38bdf8');
  } else if (room === 'cafe') {
    wallGradient.addColorStop(0, '#451a03');
    wallGradient.addColorStop(1, '#78350f');
  } else if (room === 'starry') {
    wallGradient.addColorStop(0, '#020617');
    wallGradient.addColorStop(1, '#0f172a');
  } else if (room === 'galaxy') {
    wallGradient.addColorStop(0, '#09090b');
    wallGradient.addColorStop(0.5, '#1a0533');
    wallGradient.addColorStop(1, '#2e0854');
  } else {
    wallGradient.addColorStop(0, '#1e1b4b');
    wallGradient.addColorStop(1, '#4338ca');
  }

  ctx.fillStyle = wallGradient;
  ctx.fillRect(0, 0, w, floorY);

  // Draw Floor
  ctx.fillStyle = roomMeta.floorColor;
  ctx.fillRect(0, floorY, w, h - floorY);

  // Baseboard
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, floorY - 3, w, 3);

  // Draw Specific Room Details & Furniture
  if (room === 'bedroom') {
    drawBedroomDetails(ctx, w, h, floorY);
  } else if (room === 'living') {
    drawLivingRoomDetails(ctx, w, h, floorY);
  } else if (room === 'garden') {
    drawGardenDetails(ctx, w, h, floorY);
  } else if (room === 'cafe') {
    drawCafeDetails(ctx, w, h, floorY);
  } else if (room === 'library') {
    drawLibraryDetails(ctx, w, h, floorY);
  } else if (room === 'starry') {
    drawStarryNightDetails(ctx, w, h, floorY);
  } else if (room === 'galaxy') {
    drawGalaxyDetails(ctx, w, h, floorY);
  }

  // Floor plank lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 1;
  for (let py = floorY + 15; py < h; py += 15) {
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
    ctx.stroke();
  }
}

function drawBedroomDetails(ctx: CanvasRenderingContext2D, w: number, _h: number, floorY: number) {
  // Bed on left
  const bedX = 12;
  const bedY = floorY - 32;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(bedX, bedY - 14, 8, 42); // Headboard
  ctx.fillStyle = '#4338ca';
  ctx.fillRect(bedX + 8, bedY, 52, 24); // Blanket
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(bedX + 18, bedY + 8, 9, 5, 0, 0, Math.PI * 2); // Pillow
  ctx.fill();

  // Bedside nightstand & glowing lamp on right
  const tableX = w - 42;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(tableX, floorY - 24, 22, 24);
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(tableX + 11, floorY - 32, 7, 0, Math.PI, true);
  ctx.fill();

  // Mini Window with stars
  const winX = w - 90;
  const winY = 40;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(winX, winY, 36, 36);
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(winX + 10, winY + 10, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.strokeRect(winX, winY, 36, 36);
}

function drawLivingRoomDetails(ctx: CanvasRenderingContext2D, w: number, _h: number, floorY: number) {
  // Comfortable Sofa on left
  const sofaX = 12;
  const sofaY = floorY - 28;
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(sofaX, sofaY - 14, 58, 18); // Backrest
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(sofaX - 4, sofaY - 8, 8, 28); // Armrest left
  ctx.fillRect(sofaX + 54, sofaY - 8, 8, 28); // Armrest right
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(sofaX, sofaY, 58, 14); // Cushion

  // Wall Painting on wall center
  const frameX = w / 2 - 20;
  const frameY = 38;
  ctx.fillStyle = '#b45309';
  ctx.fillRect(frameX, frameY, 40, 26);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(frameX + 3, frameY + 3, 34, 20);
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(frameX + 26, frameY + 9, 4, 0, Math.PI * 2);
  ctx.fill();

  // Coffee Table & Mug on right
  ctx.fillStyle = '#78350f';
  ctx.fillRect(w - 55, floorY - 16, 42, 16);
  ctx.font = '16px sans-serif';
  ctx.fillText('☕', w - 34, floorY - 22);
}

function drawGardenDetails(ctx: CanvasRenderingContext2D, w: number, _h: number, floorY: number) {
  // Sun in sky
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(40, 42, 14, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy Clouds
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(w - 60, 38, 12, 0, Math.PI * 2);
  ctx.arc(w - 48, 34, 15, 0, Math.PI * 2);
  ctx.arc(w - 34, 38, 12, 0, Math.PI * 2);
  ctx.fill();

  // Bushes along the floor line
  ctx.fillStyle = '#16a34a';
  for (let bx = 15; bx < w; bx += 50) {
    ctx.beginPath();
    ctx.arc(bx, floorY - 2, 14, Math.PI, 0);
    ctx.fill();
  }

  // Flowers on grass
  const flowerIcons = ['🌷', '🌸', '🌻', '🌼', '🌺'];
  const positions = [35, 105, 175, 245, 315];
  positions.forEach((fx, idx) => {
    if (fx < w - 20) {
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(flowerIcons[idx % flowerIcons.length], fx, floorY + 12);
    }
  });
}

function drawCafeDetails(ctx: CanvasRenderingContext2D, w: number, _h: number, floorY: number) {
  // Chalkboard Menu on wall
  ctx.fillStyle = '#78350f';
  ctx.fillRect(15, 35, 68, 38);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(18, 38, 62, 32);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Cat Café ☕', 49, 48);
  ctx.fillText('Espresso $3', 49, 58);

  // Cafe Counter on right
  const counterX = w - 95;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(counterX, floorY - 32, 85, 32);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(counterX - 4, floorY - 35, 93, 4);

  // Espresso machine & donut
  ctx.font = '16px sans-serif';
  ctx.fillText('☕', counterX + 22, floorY - 42);
  ctx.fillText('🍩', counterX + 55, floorY - 42);

  // Mini Cafe Table & Stools on left
  ctx.fillStyle = '#92400e';
  ctx.fillRect(35, floorY - 20, 22, 20); // Table stem
  ctx.fillRect(20, floorY - 22, 52, 4); // Table top
  ctx.font = '16px sans-serif';
  ctx.fillText('🪑', 10, floorY - 8);
  ctx.fillText('🪑', 62, floorY - 8);
}

function drawLibraryDetails(ctx: CanvasRenderingContext2D, w: number, _h: number, floorY: number) {
  // Bookshelves across background wall
  const shelfY = 35;
  const shelfHeight = floorY - 38;

  ctx.fillStyle = '#451a03';
  ctx.fillRect(12, shelfY, w - 24, shelfHeight);

  // Shelf dividers & colorful books
  const bookColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  for (let sy = shelfY + 20; sy < floorY - 8; sy += 26) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(12, sy, w - 24, 4);

    let bx = 18;
    let cIdx = 0;
    while (bx < w - 28) {
      const bWidth = 6 + (bx % 5);
      const bHeight = 15 + (bx % 6);
      ctx.fillStyle = bookColors[cIdx % bookColors.length];
      ctx.fillRect(bx, sy - bHeight, bWidth, bHeight);
      bx += bWidth + 2;
      cIdx++;
    }
  }

  // Reading Lamp on right
  ctx.font = '20px sans-serif';
  ctx.fillText('💡', w - 40, floorY - 14);
}

function drawStarryNightDetails(ctx: CanvasRenderingContext2D, w: number, _h: number, floorY: number) {
  // Moon
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(w - 50, 38, 16, 0, Math.PI * 2);
  ctx.fill();
  // Moon crescent overlay
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(w - 44, 34, 13, 0, Math.PI * 2);
  ctx.fill();

  // Stars scattered across sky
  const starPositions = [
    [20, 18], [60, 30], [95, 12], [130, 25], [170, 8], [210, 22],
    [240, 38], [280, 14], [320, 28], [355, 10], [40, 50], [160, 45],
    [290, 50], [80, 52], [220, 52], [350, 48],
  ];
  starPositions.forEach(([sx, sy]) => {
    if (sx < w - 30) {
      const brightness = 0.6 + Math.random() * 0.4;
      ctx.fillStyle = `rgba(253, 224, 71, ${brightness})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Big accent star (5-pointed)
  drawFivePointStar(ctx, 35, 55, 7, '#fde047', 1.0);
  drawFivePointStar(ctx, w / 2, 20, 6, '#a5f3fc', 1.0);

  // Telescope on floor
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔭', w - 30, floorY - 6);

  // Small comfy mat / rug on floor
  ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.beginPath();
  ctx.ellipse(w / 2, floorY + 10, 55, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Constellation lines (Orion-ish)
  ctx.strokeStyle = 'rgba(165, 243, 252, 0.3)';
  ctx.lineWidth = 0.8;
  const constStars: [number, number][] = [[70, 15], [82, 28], [76, 42], [90, 36], [96, 22]];
  ctx.beginPath();
  constStars.forEach(([cx2, cy2], i) => {
    if (i === 0) ctx.moveTo(cx2, cy2);
    else ctx.lineTo(cx2, cy2);
  });
  ctx.stroke();
  constStars.forEach(([cx2, cy2]) => {
    ctx.fillStyle = '#a5f3fc';
    ctx.beginPath();
    ctx.arc(cx2, cy2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGalaxyDetails(ctx: CanvasRenderingContext2D, w: number, _h: number, floorY: number) {
  // Swirling galaxy spiral using arcs
  const gx = w / 2;
  const gy = floorY * 0.45;

  // Outer nebula glow
  const nebula1 = ctx.createRadialGradient(gx, gy, 2, gx, gy, 55);
  nebula1.addColorStop(0, 'rgba(139, 92, 246, 0.5)');
  nebula1.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
  nebula1.addColorStop(1, 'rgba(9, 9, 11, 0)');
  ctx.fillStyle = nebula1;
  ctx.beginPath();
  ctx.ellipse(gx, gy, 65, 45, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Second nebula offset
  const nebula2 = ctx.createRadialGradient(gx - 20, gy + 10, 0, gx - 20, gy + 10, 40);
  nebula2.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
  nebula2.addColorStop(1, 'rgba(9, 9, 11, 0)');
  ctx.fillStyle = nebula2;
  ctx.beginPath();
  ctx.ellipse(gx - 20, gy + 10, 40, 28, -Math.PI / 5, 0, Math.PI * 2);
  ctx.fill();

  // Galaxy core bright dot
  const coreGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 12);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.4, '#c4b5fd');
  coreGrad.addColorStop(1, 'rgba(139,92,246,0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(gx, gy, 12, 0, Math.PI * 2);
  ctx.fill();

  // Stars
  const gStars = [
    [15, 10], [40, 5], [80, 18], [120, 8], [160, 20], [200, 6],
    [230, 30], [280, 12], [320, 22], [350, 8], [30, 45], [270, 40],
    [100, 50], [190, 50], [340, 42],
  ];
  gStars.forEach(([sx, sy]) => {
    if (sx < w) {
      ctx.fillStyle = `rgba(255,255,255,${0.5 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Accent 5-point stars
  drawFivePointStar(ctx, 20, 30, 5, '#fde047', 0.9);
  drawFivePointStar(ctx, w - 25, 25, 5, '#c4b5fd', 0.9);
  drawFivePointStar(ctx, 55, 55, 4, '#a5f3fc', 0.8);

  // Shooting star streak
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(w * 0.15, 38);
  ctx.lineTo(w * 0.15 + 30, 52);
  ctx.stroke();

  // Planet on right side
  ctx.fillStyle = '#6d28d9';
  ctx.beginPath();
  ctx.arc(w - 30, 48, 12, 0, Math.PI * 2);
  ctx.fill();
  // Planet ring
  ctx.strokeStyle = '#a78bfa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(w - 30, 48, 20, 6, Math.PI / 6, 0, Math.PI * 2);
  ctx.stroke();

  // Floor — dark space floor
  ctx.fillStyle = 'rgba(88, 28, 135, 0.3)';
  ctx.beginPath();
  ctx.ellipse(w / 2, floorY + 8, 70, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rocket emoji
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🚀', 25, floorY - 8);
}

function drawFivePointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 2) + (i * 4 * Math.PI) / 5;
    const innerAngle = outerAngle + (2 * Math.PI) / 10;
    const ox = cx + r * Math.cos(outerAngle);
    const oy = cy - r * Math.sin(outerAngle);
    const ix = cx + (r * 0.45) * Math.cos(innerAngle);
    const iy = cy - (r * 0.45) * Math.sin(innerAngle);
    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPlacedFurniture(
  ctx: CanvasRenderingContext2D,
  items: PlacedItem[],
  w: number,
  h: number
) {
  items.forEach((p) => {
    const itemMeta = SHOP_ITEMS.find((i) => i.id === p.itemId);
    if (!itemMeta) return;

    const posX = (p.x / 100) * w;
    const posY = (p.y / 100) * h;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(posX, posY + 12, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Large high-contrast full-opacity icon
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(itemMeta.icon, posX, posY);
  });
}

function drawYarnBall(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
  const rollAngle = (tick * 0.06) % (Math.PI * 2);
  const bounce = Math.sin(tick * 0.04) * 2;
  ctx.save();
  ctx.translate(x, y + bounce);
  ctx.rotate(rollAngle);
  ctx.font = '26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧶', 0, 0);
  ctx.restore();
}

function drawFoodBowl(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🍗', x, y);
}

function drawCatSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  state: CatState,
  skin: CatSkin,
  hat: CatHat,
  facingLeft: boolean,
  tick: number,
  cursorPos: { x: number; y: number } | null
) {
  const clampedX = Math.max(45, Math.min(w - 45, x));
  const floorY = h * 0.7;
  const clampedY = Math.max(floorY + 10, Math.min(h - 35, y || h - 55));

  ctx.save();
  ctx.translate(clampedX, clampedY);

  const scaleX = facingLeft ? -1.8 : 1.8;
  ctx.scale(scaleX, 1.8);

  const colors = getSkinColors(skin);

  let bounceY = 0;
  let eyeClosed = false;

  if (state === 'WALK') {
    bounceY = Math.sin(tick * 0.06) * 2;
  } else if (state === 'RUN') {
    bounceY = Math.sin(tick * 0.12) * 3;
  } else if (state === 'SLEEP') {
    bounceY = Math.sin(tick * 0.015) * 1.5;
    eyeClosed = true;
  } else if (state === 'STRETCH') {
    bounceY = -4;
  } else if (state === 'HAPPY') {
    bounceY = Math.abs(Math.sin(tick * 0.08)) * -4;
  }

  const cy = bounceY;

  // 1. Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 14, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Tail
  ctx.strokeStyle = colors.body;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const tailWiggle = Math.sin(tick * 0.03) * 5;
  ctx.moveTo(12, cy + 5);
  ctx.quadraticCurveTo(22 + tailWiggle, cy - 8, 18 + tailWiggle, cy - 18);
  ctx.stroke();

  // 3. Body
  ctx.fillStyle = colors.body;
  ctx.beginPath();
  if (state === 'SLEEP' || state === 'SIT') {
    ctx.ellipse(0, cy + 4, 16, 13, 0, 0, Math.PI * 2);
  } else {
    ctx.ellipse(0, cy + 2, 17, 12, 0, 0, Math.PI * 2);
  }
  ctx.fill();

  // Belly Patch
  ctx.fillStyle = colors.belly;
  ctx.beginPath();
  ctx.ellipse(-2, cy + 5, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. Legs
  ctx.fillStyle = colors.body;
  if (state === 'WALK' || state === 'RUN') {
    const legFreq = state === 'RUN' ? 0.12 : 0.06;
    const legOffset = Math.sin(tick * legFreq) * 4;
    ctx.fillRect(-12 + legOffset, cy + 10, 5, 8);
    ctx.fillRect(7 - legOffset, cy + 10, 5, 8);
  } else if (state !== 'SLEEP') {
    ctx.fillRect(-11, cy + 9, 5, 7);
    ctx.fillRect(6, cy + 9, 5, 7);
  }

  // 5. Head
  ctx.beginPath();
  const headY = cy - 10;
  ctx.arc(-6, headY, 13, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = colors.body;
  // Left Ear
  ctx.beginPath();
  ctx.moveTo(-16, headY - 6);
  ctx.lineTo(-12, headY - 20);
  ctx.lineTo(-6, headY - 11);
  ctx.closePath();
  ctx.fill();

  // Right Ear
  ctx.beginPath();
  ctx.moveTo(-4, headY - 11);
  ctx.lineTo(2, headY - 20);
  ctx.lineTo(4, headY - 6);
  ctx.closePath();
  ctx.fill();

  // Inner Ear Pink
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.moveTo(-14, headY - 7);
  ctx.lineTo(-12, headY - 17);
  ctx.lineTo(-8, headY - 11);
  ctx.closePath();
  ctx.fill();

  // Eyes
  if (eyeClosed || state === 'SLEEP') {
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-11, headY - 2, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-3, headY - 2, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  } else {
    let eyeOffsetX = 0;
    if (cursorPos) {
      const dx = cursorPos.x - x;
      eyeOffsetX = Math.max(-2, Math.min(2, dx * 0.02));
    }

    // Black Pupils
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-11 + eyeOffsetX, headY - 2, 2.8, 0, Math.PI * 2);
    ctx.arc(-3 + eyeOffsetX, headY - 2, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // White Catchlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-12 + eyeOffsetX, headY - 3, 1, 0, Math.PI * 2);
    ctx.arc(-4 + eyeOffsetX, headY - 3, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nose & Mouth
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(-7, headY + 3, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Whiskers
  ctx.strokeStyle = colors.whisker;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-14, headY + 2);
  ctx.lineTo(-21, headY + 1);
  ctx.moveTo(-14, headY + 4);
  ctx.lineTo(-20, headY + 6);

  ctx.moveTo(0, headY + 2);
  ctx.lineTo(7, headY + 1);
  ctx.moveTo(0, headY + 4);
  ctx.lineTo(6, headY + 6);
  ctx.stroke();

  // 6. Draw Hat Overlay
  if (hat !== 'none') {
    drawHat(ctx, -7, headY - 12, hat);
  }

  ctx.restore();
}

function drawHat(ctx: CanvasRenderingContext2D, x: number, y: number, hat: string) {
  ctx.save();
  ctx.translate(x, y);

  if (hat === 'birthday' || hat === 'party' || hat === 'birthday_hat') {
    // Cone pointing UP
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(-7, 0); // bottom left base
    ctx.lineTo(0, -19); // TOP TIP
    ctx.lineTo(7, 0); // bottom right base
    ctx.closePath();
    ctx.fill();

    // Yellow stripes
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-5, -6);
    ctx.lineTo(5, -6);
    ctx.moveTo(-3, -12);
    ctx.lineTo(3, -12);
    ctx.stroke();

    // Pom-pom on top
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -20, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (hat === 'crown' || hat === 'golden_crown') {
    // Gold Crown pointing UP
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-8, -3, 16, 3);

    ctx.beginPath();
    ctx.moveTo(-8, -3);
    ctx.lineTo(-8, -13);
    ctx.lineTo(-4, -7);
    ctx.lineTo(0, -15);
    ctx.lineTo(4, -7);
    ctx.lineTo(8, -13);
    ctx.lineTo(8, -3);
    ctx.closePath();
    ctx.fill();

    // Red Jewels on tips
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-8, -13, 1.5, 0, Math.PI * 2);
    ctx.arc(0, -15, 1.5, 0, Math.PI * 2);
    ctx.arc(8, -13, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (hat === 'bow' || hat === 'pink_bow') {
    // Cute Pink Ribbon Bow
    ctx.fillStyle = '#ec4899';
    // Left loop
    ctx.beginPath();
    ctx.ellipse(-5, -4, 5, 3.5, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    // Right loop
    ctx.beginPath();
    ctx.ellipse(5, -4, 5, 3.5, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    // Center knot
    ctx.fillStyle = '#be185d';
    ctx.beginPath();
    ctx.arc(0, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (hat === 'star_bow') {
    // Star-shaped glittery bow — two star lobes + center star knot
    // Left lobe (rotated star shape)
    ctx.save();
    ctx.translate(-6, -5);
    ctx.rotate(-Math.PI / 8);
    drawHatStar(ctx, 0, 0, 6, '#f0abfc', '#d946ef');
    ctx.restore();
    // Right lobe
    ctx.save();
    ctx.translate(6, -5);
    ctx.rotate(Math.PI / 8);
    drawHatStar(ctx, 0, 0, 6, '#f0abfc', '#d946ef');
    ctx.restore();
    // Center knot
    drawHatStar(ctx, 0, -5, 3.5, '#fde047', '#f59e0b');
    // Trailing ribbons
    ctx.strokeStyle = '#d946ef';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-1, -2);
    ctx.quadraticCurveTo(-5, 2, -4, 6);
    ctx.moveTo(1, -2);
    ctx.quadraticCurveTo(5, 2, 4, 6);
    ctx.stroke();
  } else if (hat === 'star_crown') {
    // Five-star celestial crown
    // Base band
    const bandGrad = ctx.createLinearGradient(-10, 0, 10, 0);
    bandGrad.addColorStop(0, '#b45309');
    bandGrad.addColorStop(0.5, '#fde047');
    bandGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = bandGrad;
    ctx.fillRect(-10, -4, 20, 5);
    // Three stars along the top of the band
    drawHatStar(ctx, 0, -9, 6, '#fde047', '#f59e0b');  // center tall
    drawHatStar(ctx, -8, -6, 4, '#fde047', '#f59e0b'); // left
    drawHatStar(ctx, 8, -6, 4, '#fde047', '#f59e0b');  // right
    // Two small accent stars
    drawHatStar(ctx, -4, -5, 2.5, '#a5f3fc', '#38bdf8');
    drawHatStar(ctx, 4, -5, 2.5, '#a5f3fc', '#38bdf8');
    // Sparkle dots
    ctx.fillStyle = '#ffffff';
    [-9, -5, 0, 5, 9].forEach((dx) => {
      ctx.beginPath();
      ctx.arc(dx, -1, 0.8, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (hat === 'wizard' || hat === 'wizard_hat') {
    // Blue Wizard Hat pointing UP
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(-7, -1);
    ctx.lineTo(-2, -21); // TOP TIP
    ctx.lineTo(6, -1);
    ctx.closePath();
    ctx.fill();

    // Gold Star
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-1, -10, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawHatStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  fillColor: string,
  strokeColor: string
) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    const innerAngle = outerAngle + (2 * Math.PI) / 10;
    const ox = cx + r * Math.cos(outerAngle);
    const oy = cy + r * Math.sin(outerAngle);
    const ix = cx + (r * 0.42) * Math.cos(innerAngle);
    const iy = cy + (r * 0.42) * Math.sin(innerAngle);
    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

function getSkinColors(skin: CatSkin) {
  switch (skin) {
    case 'tuxedo':
      return { body: '#1e293b', belly: '#f8fafc', whisker: '#94a3b8' };
    case 'calico':
      return { body: '#ea580c', belly: '#f8fafc', whisker: '#78350f' };
    case 'black':
      return { body: '#0f172a', belly: '#334155', whisker: '#64748b' };
    case 'snow':
      return { body: '#f8fafc', belly: '#e2e8f0', whisker: '#cbd5e1' };
    case 'grey_tabby':
      return { body: '#64748b', belly: '#f1f5f9', whisker: '#334155' };
    case 'orange':
    default:
      return { body: '#f97316', belly: '#ffedd5', whisker: '#c2410c' };
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);

    if (p.type === 'heart') {
      ctx.font = '16px sans-serif';
      ctx.fillText('❤️', p.x, p.y);
    } else if (p.type === 'sparkle') {
      ctx.font = '16px sans-serif';
      ctx.fillText('✨', p.x, p.y);
    } else if (p.type === 'zzz') {
      ctx.font = '14px bold sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Zzz', p.x, p.y);
    } else if (p.type === 'coin') {
      ctx.font = '14px bold sans-serif';
      ctx.fillStyle = '#eab308';
      ctx.fillText(p.text || '+🪙', p.x, p.y);
    }

    ctx.restore();
  });
}
