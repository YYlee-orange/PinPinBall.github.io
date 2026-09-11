import { BALL_R, FAIL_X, GRID_PAD_Y, H, LAUNCH_X, LAUNCH_Y, TABLE_CX, W } from "./config.js";
import { drawBall } from "./entities/ball.js";
import { drawBrick } from "./entities/brick.js";
import { drawBlastNode, drawBurstFx, drawGrowNode } from "./entities/nodes.js";
import { previewDots } from "./round.js";
import { drawTable } from "./table.js";

const PAUSE = { x: (FAIL_X + W) / 2, y: GRID_PAD_Y * 0.5, r: 18 };

export function pauseHit() {
  return PAUSE;
}

export function draw(ctx, s) {
  drawTable(ctx);

  for (const b of s.bricks) if (b.alive) drawBrick(ctx, b);
  for (const n of s.nodes) {
    if (!n.alive) continue;
    if (n.kind === "grow") drawGrowNode(ctx, n);
    else drawBlastNode(ctx, n);
  }
  for (const fx of s.fx) drawBurstFx(ctx, fx);

  if (s.aiming && s.scene === "playing") {
    const dots = previewDots(s.aimAngle);
    ctx.fillStyle = "rgba(255,220,120,0.95)";
    dots.forEach((d, i) => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 3.2 - i * 0.25, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  for (const ball of s.balls) {
    if (ball.state === "flying" || ball.state === "returning") drawBall(ctx, ball);
  }
  if (!s.firing) {
    const idle = s.balls.find((b) => b.state === "idle") || {
      x: LAUNCH_X,
      y: LAUNCH_Y,
      r: BALL_R,
    };
    drawBall(ctx, idle);
  }

  drawHud(ctx, s);
  if (s.scene === "paused") overlay(ctx, "PAUSED", "tap to resume");
  if (s.scene === "result") overlay(ctx, "GAME OVER", `分数：${s.score}  ·  tap to retry`);
}

function drawHud(ctx, s) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(PAUSE.x, PAUSE.y, PAUSE.r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
  ctx.fillStyle = "#eee";
  if (s.scene === "paused") {
    ctx.beginPath();
    ctx.moveTo(PAUSE.x - 5, PAUSE.y - 8);
    ctx.lineTo(PAUSE.x + 8, PAUSE.y);
    ctx.lineTo(PAUSE.x - 5, PAUSE.y + 8);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(PAUSE.x - 6, PAUSE.y - 7, 4, 14);
    ctx.fillRect(PAUSE.x + 2, PAUSE.y - 7, 4, 14);
  }

  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#f2f2f2";
  ctx.fillText("分数：" + s.score, W - 16, 12);

  const midX = (FAIL_X + W) / 2;
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.fillText("最高分：" + s.highScore, midX, H - GRID_PAD_Y * 0.38);

  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("x" + s.ballCount, TABLE_CX, LAUNCH_Y);
  ctx.restore();
}

function overlay(ctx, title, sub) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 42px sans-serif";
  ctx.fillText(title, W / 2, H / 2 - 18);
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText(sub, W / 2, H / 2 + 22);
  ctx.restore();
}
