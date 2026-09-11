import { BALL_R, LAUNCH_X, LAUNCH_Y } from "../config.js";

export function makeBall() {
  return {
    x: LAUNCH_X,
    y: LAUNCH_Y,
    vx: 0,
    vy: 0,
    r: BALL_R,
    state: "idle",
    returnT: 0,
    fromX: 0,
    fromY: 0,
    floorBounced: false,
  };
}

export function drawBall(ctx, ball) {
  const { x, y, r } = ball;
  const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, "#ffe44d");
  g.addColorStop(1, "#e6c200");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const eyeW = r * 0.26;
  const eyeH = r * 0.32;
  const eyeY = y - r * 0.1;
  const leftX = x - r * 0.38;
  const rightX = x + r * 0.38;

  drawEye(ctx, leftX, eyeY, eyeW, eyeH);
  drawEye(ctx, rightX, eyeY, eyeW, eyeH);

  ctx.fillStyle = "#e07040";
  ellipse(ctx, x, y + r * 0.55, r * 0.2, r * 0.1);
}

function drawEye(ctx, ex, ey, rx, ry) {
  ellipseFill(ctx, ex, ey, rx, ry, "#fff");
  ellipseFill(ctx, ex, ey, rx * 0.78, ry * 0.78, "#3dcc6a");
  ellipseFill(ctx, ex, ey, rx * 0.38, ry * 0.42, "#1a1208");
}

function ellipseFill(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, rx, ry);
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
