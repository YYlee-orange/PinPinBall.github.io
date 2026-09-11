import { closestOnSeg, dot, len, reflect } from "../math.js";
import { RESTITUTION } from "../config.js";

export function resolveCircleCircle(ball, cx, cy, r, e = RESTITUTION) {
  const dx = ball.x - cx;
  const dy = ball.y - cy;
  const dist = len(dx, dy) || 0.0001;
  const min = ball.r + r;
  if (dist >= min) return false;
  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = min - dist;
  ball.x += nx * overlap;
  ball.y += ny * overlap;
  const bounced = dot(ball.vx, ball.vy, nx, ny) < 0;
  const v = reflect(ball.vx, ball.vy, nx, ny, e);
  ball.vx = v.vx;
  ball.vy = v.vy;
  return bounced;
}

export function resolveCircleVerts(ball, verts, e = RESTITUTION) {
  let best = null;
  for (let i = 0; i < verts.length; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % verts.length];
    const p = closestOnSeg(ball.x, ball.y, a.x, a.y, b.x, b.y);
    const dx = ball.x - p.x;
    const dy = ball.y - p.y;
    const dist = len(dx, dy);
    if (dist < ball.r && (best == null || dist < best.dist)) {
      best = { dist, dx, dy, ax: a.x, ay: a.y, bx: b.x, by: b.y };
    }
  }
  if (!best) {
    if (!pointInPoly(ball.x, ball.y, verts)) return false;
    let push = null;
    for (let i = 0; i < verts.length; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % verts.length];
      const p = closestOnSeg(ball.x, ball.y, a.x, a.y, b.x, b.y);
      const d = len(ball.x - p.x, ball.y - p.y);
      if (push == null || d < push.d) push = { d, x: p.x, y: p.y };
    }
    if (!push) return false;
    const n = { x: ball.x - push.x, y: ball.y - push.y };
    const nl = len(n.x, n.y) || 1;
    n.x /= nl;
    n.y /= nl;
    ball.x = push.x + n.x * ball.r;
    ball.y = push.y + n.y * ball.r;
    const v = reflect(ball.vx, ball.vy, n.x, n.y, e);
    ball.vx = v.vx;
    ball.vy = v.vy;
    return true;
  }
  const dist = best.dist || 0.0001;
  const nx = best.dx / dist;
  const ny = best.dy / dist;
  ball.x = ball.x + nx * (ball.r - dist);
  ball.y = ball.y + ny * (ball.r - dist);
  const bounced = dot(ball.vx, ball.vy, nx, ny) < 0;
  const v = reflect(ball.vx, ball.vy, nx, ny, e);
  ball.vx = v.vx;
  ball.vy = v.vy;
  return bounced;
}

function pointInPoly(x, y, verts) {
  let inside = false;
  for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
    const yi = verts[i].y;
    const yj = verts[j].y;
    if (yi > y !== yj > y) {
      const xj = verts[j].x;
      const xi = verts[i].x;
      if (x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0000001) + xi) inside = !inside;
    }
  }
  return inside;
}

export function resolveCircleSegment(ball, ax, ay, bx, by, nxHint, nyHint, e = RESTITUTION) {
  const p = closestOnSeg(ball.x, ball.y, ax, ay, bx, by);
  const dx = ball.x - p.x;
  const dy = ball.y - p.y;
  const dist = len(dx, dy);
  if (dist >= ball.r) return false;
  let nx;
  let ny;
  if (dist < 1e-6) {
    nx = nxHint;
    ny = nyHint;
  } else {
    nx = dx / dist;
    ny = dy / dist;
    if (nx * nxHint + ny * nyHint < 0) {
      nx = nxHint;
      ny = nyHint;
    }
  }
  ball.x = p.x + nx * ball.r;
  ball.y = p.y + ny * ball.r;
  const bounced = dot(ball.vx, ball.vy, nx, ny) < 0;
  const v = reflect(ball.vx, ball.vy, nx, ny, e);
  ball.vx = v.vx;
  ball.vy = v.vy;
  return bounced;
}

export function resolveWalls(ball, w, h, e = RESTITUTION) {
  let hit = false;
  if (ball.y - ball.r < 0) {
    ball.y = ball.r;
    if (ball.vy < 0) {
      ball.vy = -ball.vy * e;
      hit = true;
    }
  }
  if (ball.y + ball.r > h) {
    ball.y = h - ball.r;
    if (ball.vy > 0) {
      ball.vy = -ball.vy * e;
      hit = true;
    }
  }
  if (ball.x - ball.r < 0) {
    ball.x = ball.r;
    if (ball.vx < 0) {
      ball.vx = -ball.vx * e;
      hit = true;
    }
  }
  return hit;
}
