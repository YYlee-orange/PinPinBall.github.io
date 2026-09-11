import {
  BRICK_ANGLES,
  BRICK_RADIUS,
  CELL_H,
  CELL_W,
  COL_GAP,
  FAIL_X,
  GRID_PAD_X,
  GRID_PAD_Y,
  HP_MAX,
  HP_RAMP_TIME,
  ROW_GAP,
  SHAPES,
  START_HP_MAX,
} from "../config.js";
import { pick, randInt, regularPoly } from "../math.js";

const HUES = [12, 32, 48, 88, 145, 175, 200, 265, 310];

export function cellCenter(col, row) {
  return {
    x: FAIL_X + GRID_PAD_X + col * (CELL_W + COL_GAP) + CELL_W / 2,
    y: GRID_PAD_Y + row * (CELL_H + ROW_GAP) + CELL_H / 2,
  };
}

export function hpForElapsed(elapsed) {
  if (elapsed >= HP_RAMP_TIME) return randInt(1, HP_MAX);
  const t = Math.max(0, elapsed) / HP_RAMP_TIME;
  const cap = Math.round(START_HP_MAX + (HP_MAX - START_HP_MAX) * t);
  return randInt(1, Math.max(1, cap));
}

export function makeBrick(col, row, elapsed) {
  const { x, y } = cellCenter(col, row);
  const shape = pick(SHAPES);
  const rot = shape === "circle" ? 0 : pick(BRICK_ANGLES);
  const hp = hpForElapsed(elapsed);
  return {
    col,
    row,
    x,
    y,
    shape,
    rot,
    hp,
    maxHp: hp,
    hue: pick(HUES),
    r: BRICK_RADIUS * (1 + Math.random() * 0.4),
    alive: true,
  };
}

export function brickVerts(brick) {
  const n = brick.shape === "tri" ? 3 : brick.shape === "square" ? 4 : 5;
  return regularPoly(n, brick.x, brick.y, brick.r, brick.rot);
}

export function syncBrickPos(brick) {
  const p = cellCenter(brick.col, brick.row);
  brick.x = p.x;
  brick.y = p.y;
}

export function brickColor(brick) {
  const t = Math.min(1, Math.max(0, (brick.hp - 1) / (HP_MAX - 1)));
  const l = 76 - t * 46;
  const s = 68 + t * 12;
  return `hsl(${brick.hue}, ${s}%, ${l}%)`;
}

export function drawBrick(ctx, brick) {
  ctx.save();
  ctx.fillStyle = brickColor(brick);
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 2;
  if (brick.shape === "circle") {
    ctx.beginPath();
    ctx.arc(brick.x, brick.y, brick.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    const verts = brickVerts(brick);
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = brick.hp >= 18 ? "#fff" : "#1a1a1a";
  ctx.font = `bold ${Math.max(16, brick.r * 0.7)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(brick.hp), brick.x, brick.y + 1);
  ctx.restore();
}
