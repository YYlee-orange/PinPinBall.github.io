export function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
}

export function len(x, y) {
  return Math.hypot(x, y);
}

export function dot(ax, ay, bx, by) {
  return ax * bx + ay * by;
}

export function norm(x, y) {
  const l = Math.hypot(x, y) || 1;
  return { x: x / l, y: y / l };
}

export function reflect(vx, vy, nx, ny, e) {
  const vn = vx * nx + vy * ny;
  if (vn >= 0) return { vx, vy };
  const s = (1 + e) * vn;
  return { vx: vx - s * nx, vy: vy - s * ny };
}

export function closestOnSeg(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const t = clamp(((px - ax) * abx + (py - ay) * aby) / (abx * abx + aby * aby || 1), 0, 1);
  return { x: ax + abx * t, y: ay + aby * t };
}

export function regularPoly(n, cx, cy, radius, rot) {
  const verts = [];
  const start = rot - Math.PI / 2;
  for (let i = 0; i < n; i++) {
    const a = start + (i * 2 * Math.PI) / n;
    verts.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
  }
  return verts;
}

export function polyEdges(verts) {
  const edges = [];
  for (let i = 0; i < verts.length; i++) {
    edges.push([verts[i], verts[(i + 1) % verts.length]]);
  }
  return edges;
}

export function randInt(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

export function pick(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}
