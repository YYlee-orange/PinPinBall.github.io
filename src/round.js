import {
  BALL_MAX,
  BALL_START,
  BLAST_DMG,
  BLAST_ROW_P,
  DT,
  FLOOR_RESTITUTION,
  GRID_COLS,
  GRID_ROWS,
  GROW_ROW_P,
  H,
  LAUNCH_X,
  LAUNCH_Y,
  RETURN_TIME,
  SUBSTEPS,
  W,
} from "./config.js";
import { makeBall } from "./entities/ball.js";
import { brickVerts, makeBrick, syncBrickPos } from "./entities/brick.js";
import { makeNode, syncNodePos } from "./entities/nodes.js";
import { beadDelay, launchVelocity } from "./entities/launcher.js";
import { resolveCircleCircle, resolveCircleSegment, resolveCircleVerts, resolveWalls } from "./physics/collide.js";
import { integrate } from "./physics/integrate.js";
import { laneWalls, tableCircles } from "./table.js";
import { len, randInt, shuffle } from "./math.js";

const BEST_KEY = "pinpinball_best";

function loadBest() {
  try {
    const n = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

function noteScore(s) {
  if (s.score > s.highScore) {
    s.highScore = s.score;
    try {
      localStorage.setItem(BEST_KEY, String(s.highScore));
    } catch (_) {}
  }
}

export function createState() {
  const balls = [];
  for (let i = 0; i < BALL_START; i++) balls.push(makeBall());
  const s = {
    scene: "playing",
    balls,
    ballCount: BALL_START,
    bricks: [],
    nodes: [],
    fx: [],
    score: 0,
    highScore: loadBest(),
    wave: 0,
    aiming: false,
    aimAngle: 0,
    firing: false,
    fireLeft: 0,
    fireDelay: 0,
    fireVel: { vx: 0, vy: 0 },
    playTime: 0,
  };
  spawnRow(s);
  return s;
}

export function resetState(s) {
  const n = createState();
  Object.assign(s, n);
}

function occupiedCells(s, col) {
  const used = new Set();
  for (const b of s.bricks) if (b.alive && b.col === col) used.add(b.row);
  for (const n of s.nodes) if (n.alive && n.col === col) used.add(n.row);
  return used;
}

function emptyRows(s, col) {
  const used = occupiedCells(s, col);
  const rows = [];
  for (let r = 0; r < GRID_ROWS; r++) if (!used.has(r)) rows.push(r);
  return rows;
}

function spawnRow(s) {
  s.wave += 1;
  const col = GRID_COLS - 1;
  const count = randInt(1, 3);
  const rows = shuffle([...Array(GRID_ROWS).keys()]).slice(0, count);
  for (const row of rows) s.bricks.push(makeBrick(col, row, s.playTime));
  const holes = emptyRows(s, col);
  const canBlast = s.ballCount > 1 && !s.nodes.some((n) => n.alive && n.kind === "blast");
  const canGrow = s.ballCount < BALL_MAX;
  if (canBlast && holes.length && Math.random() < BLAST_ROW_P) {
    const i = (Math.random() * holes.length) | 0;
    const row = holes.splice(i, 1)[0];
    s.nodes.push(makeNode("blast", col, row));
  }
  if (canGrow && holes.length && Math.random() < GROW_ROW_P) {
    const row = holes[(Math.random() * holes.length) | 0];
    s.nodes.push(makeNode("grow", col, row));
  }
}

function advanceRows(s) {
  if (s.bricks.some((b) => b.alive && b.col === 0)) {
    noteScore(s);
    s.scene = "result";
    return;
  }
  for (const b of s.bricks) {
    if (!b.alive) continue;
    b.col -= 1;
    syncBrickPos(b);
  }
  for (const n of s.nodes) {
    if (!n.alive) continue;
    n.col -= 1;
    if (n.col < 0) n.alive = false;
    else syncNodePos(n);
  }
  spawnRow(s);
}

export function canShoot(s) {
  return (
    s.scene === "playing" &&
    !s.firing &&
    s.balls.every((b) => b.state === "idle") &&
    s.ballCount > 0
  );
}

export function startVolley(s, angle) {
  if (!canShoot(s)) return;
  s.firing = true;
  s.aiming = false;
  s.fireVel = launchVelocity(angle);
  s.fireLeft = s.ballCount;
  s.fireDelay = 0;
  releaseOne(s);
}

function releaseOne(s) {
  let ball = s.balls.find((b) => b.state === "idle");
  if (!ball) {
    ball = makeBall();
    s.balls.push(ball);
  }
  ball.floorBounced = false;
  ball.state = "flying";
  ball.x = LAUNCH_X;
  ball.y = LAUNCH_Y;
  ball.vx = s.fireVel.vx;
  ball.vy = s.fireVel.vy;
  s.fireLeft -= 1;
  if (s.fireLeft > 0) s.fireDelay = beadDelay();
}

function beginReturn(ball) {
  ball.state = "returning";
  ball.fromX = ball.x;
  ball.fromY = ball.y;
  ball.returnT = 0;
  ball.vx = 0;
  ball.vy = 0;
}

function hitBrick(s, brick) {
  brick.hp -= 1;
  if (brick.hp <= 0) {
    brick.alive = false;
    s.score += brick.maxHp;
    noteScore(s);
  }
}

function triggerBlast(s, node, ball) {
  node.alive = false;
  ball.state = "gone";
  s.ballCount = Math.max(0, s.ballCount - 1);
  s.fx.push({ x: node.x, y: node.y, r: node.r, t: 0 });
  for (const b of s.bricks) {
    if (!b.alive) continue;
    if (Math.abs(b.col - node.col) <= 1 && Math.abs(b.row - node.row) <= 1) {
      b.hp -= BLAST_DMG;
      if (b.hp <= 0) {
        b.alive = false;
        s.score += b.maxHp;
        noteScore(s);
      }
    }
  }
  if (s.ballCount <= 0) {
    noteScore(s);
    s.scene = "result";
  }
}

function triggerGrow(s, node, ball) {
  node.alive = false;
  if (s.ballCount >= BALL_MAX) return;
  s.ballCount += 1;
  const extra = makeBall();
  extra.state = "flying";
  extra.x = ball.x;
  extra.y = ball.y;
  extra.vx = ball.vx;
  extra.vy = ball.vy;
  extra.floorBounced = ball.floorBounced;
  s.balls.push(extra);
}

function collideNodes(s, ball) {
  for (const n of s.nodes) {
    if (!n.alive) continue;
    const d = len(ball.x - n.x, ball.y - n.y);
    if (d < ball.r + n.r) {
      if (n.kind === "blast") triggerBlast(s, n, ball);
      else triggerGrow(s, n, ball);
      return;
    }
  }
}

function physicsBall(s, ball) {
  const step = DT / SUBSTEPS;
  for (let i = 0; i < SUBSTEPS; i++) {
    if (ball.state !== "flying") return;
    integrate(ball, step);
    resolveWalls(ball, W, H);
    for (const w of laneWalls) {
      resolveCircleSegment(ball, w.ax, w.ay, w.bx, w.by, w.nx, w.ny);
    }
    for (const c of tableCircles) resolveCircleCircle(ball, c.x, c.y, c.r);
    for (const brick of s.bricks) {
      if (!brick.alive) continue;
      let bounced = false;
      if (brick.shape === "circle") {
        bounced = resolveCircleCircle(ball, brick.x, brick.y, brick.r);
      } else {
        bounced = resolveCircleVerts(ball, brickVerts(brick));
      }
      if (bounced) hitBrick(s, brick);
    }
    collideNodes(s, ball);
    if (ball.state !== "flying") return;
    if (ball.x + ball.r >= W) {
      if (!ball.floorBounced) {
        ball.floorBounced = true;
        ball.x = W - ball.r;
        if (ball.vx > 0) ball.vx = -ball.vx * FLOOR_RESTITUTION;
      } else {
        beginReturn(ball);
        return;
      }
    }
  }
}

export function tick(s, dt) {
  s.playTime += dt;
  for (let i = s.fx.length - 1; i >= 0; i--) {
    s.fx[i].t += dt / 0.42;
    if (s.fx[i].t >= 1) s.fx.splice(i, 1);
  }
  if (s.scene !== "playing") return;

  if (s.firing && s.fireLeft > 0) {
    s.fireDelay -= dt;
    if (s.fireDelay <= 0) releaseOne(s);
  }

  for (const ball of s.balls) {
    if (ball.state === "flying") physicsBall(s, ball);
    else if (ball.state === "returning") {
      ball.returnT += dt / RETURN_TIME;
      const t = Math.min(1, ball.returnT);
      const e = 1 - (1 - t) * (1 - t);
      ball.x = ball.fromX + (LAUNCH_X - ball.fromX) * e;
      ball.y = ball.fromY + (LAUNCH_Y - ball.fromY) * e;
      if (t >= 1) {
        ball.x = LAUNCH_X;
        ball.y = LAUNCH_Y;
        ball.state = "idle";
      }
    }
  }

  s.balls = s.balls.filter((b) => b.state !== "gone");

  const inPlay = s.balls.some((b) => b.state === "flying" || b.state === "returning");
  if (s.firing && s.fireLeft <= 0 && !inPlay) {
    s.firing = false;
    while (s.balls.length < s.ballCount) s.balls.push(makeBall());
    s.balls.forEach((b) => {
      b.state = "idle";
      b.x = LAUNCH_X;
      b.y = LAUNCH_Y;
    });
    if (s.scene === "playing") advanceRows(s);
  }
}

export function previewDots(angle) {
  const dots = [];
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  for (let i = 1; i <= 5; i++) {
    dots.push({
      x: LAUNCH_X + dx * (20 + i * 14),
      y: LAUNCH_Y + dy * (20 + i * 14),
    });
  }
  return dots;
}
