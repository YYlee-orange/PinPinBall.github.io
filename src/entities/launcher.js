import {
  BALL_R,
  BEAD_GAP,
  LAUNCH_SPEED,
  LAUNCH_X,
  LAUNCH_Y,
  TABLE_CX,
  TABLE_CY1,
  TABLE_CY2,
  TABLE_R,
} from "../config.js";
import { clamp } from "../math.js";

function rayHitsCircle(ang, cx, cy, r) {
  const dx = cx - LAUNCH_X;
  const dy = cy - LAUNCH_Y;
  const rx = Math.cos(ang);
  const ry = Math.sin(ang);
  const proj = dx * rx + dy * ry;
  if (proj < 0) return false;
  const closestX = LAUNCH_X + rx * proj;
  const closestY = LAUNCH_Y + ry * proj;
  return Math.hypot(closestX - cx, closestY - cy) < r;
}

function blocked(ang) {
  const reff = TABLE_R + BALL_R;
  return (
    rayHitsCircle(ang, TABLE_CX, TABLE_CY1, reff) ||
    rayHitsCircle(ang, TABLE_CX, TABLE_CY2, reff)
  );
}

function scanLimit(dir) {
  const step = 0.003;
  let last = 0;
  for (let a = 0; dir > 0 ? a < 1.25 : a > -1.25; a += dir * step) {
    if (blocked(a)) return last;
    last = a;
  }
  return last;
}

export const AIM_MIN = scanLimit(-1);
export const AIM_MAX = scanLimit(1);

export function clampAimAngle(ang) {
  return clamp(ang, AIM_MIN, AIM_MAX);
}

export function aimFromPointer(px, py) {
  const dx = px - LAUNCH_X;
  const dy = py - LAUNCH_Y;
  return clampAimAngle(Math.atan2(dy, dx));
}

export function launchVelocity(ang) {
  return {
    vx: Math.cos(ang) * LAUNCH_SPEED,
    vy: Math.sin(ang) * LAUNCH_SPEED,
  };
}

export function beadDelay() {
  return BEAD_GAP / LAUNCH_SPEED;
}
