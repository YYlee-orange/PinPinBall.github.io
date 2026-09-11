import { NODE_R } from "../config.js";
import { cellCenter } from "./brick.js";

export function makeNode(kind, col, row) {
  const p = cellCenter(col, row);
  return { kind, col, row, x: p.x, y: p.y, r: NODE_R, alive: true };
}

export function syncNodePos(node) {
  const p = cellCenter(node.col, node.row);
  node.x = p.x;
  node.y = p.y;
}

export function drawGrowNode(ctx, node) {
  const { x, y, r } = node;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#0a0a0a";
  ctx.fill();
  ctx.lineWidth = r * 0.18;
  ctx.strokeStyle = "#3ddc5a";
  ctx.stroke();
  ctx.strokeStyle = "#3ddc5a";
  ctx.lineCap = "round";
  ctx.lineWidth = r * 0.2;
  const a = r * 0.42;
  ctx.beginPath();
  ctx.moveTo(x - a, y);
  ctx.lineTo(x + a, y);
  ctx.moveTo(x, y - a);
  ctx.lineTo(x, y + a);
  ctx.stroke();
  ctx.restore();
}

export function drawBlastNode(ctx, node) {
  const { x, y, r } = node;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(r / 18, r / 18);
  burstPath(ctx);
  ctx.fillStyle = "#fff8e8";
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 1.8;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function burstPath(ctx) {
  const spikes = [
    [0, -18], [4, -10], [12, -14], [8, -5], [18, -4], [10, 2],
    [16, 10], [6, 7], [4, 16], [0, 9], [-7, 16], [-6, 7],
    [-17, 9], [-10, 1], [-18, -5], [-8, -5], [-13, -14], [-4, -10],
  ];
  ctx.beginPath();
  ctx.moveTo(spikes[0][0], spikes[0][1]);
  for (let i = 1; i < spikes.length; i++) ctx.lineTo(spikes[i][0], spikes[i][1]);
  ctx.closePath();
}

export function drawBurstFx(ctx, fx) {
  const t = Math.min(1, fx.t);
  const radius = 10 + t * 92;
  ctx.save();
  ctx.globalAlpha = 1 - t;
  ctx.beginPath();
  ctx.arc(fx.x, fx.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "#ff8a1a";
  ctx.lineWidth = 7 - t * 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fx.x, fx.y, radius * 0.72, 0, Math.PI * 2);
  ctx.strokeStyle = "#ffc14d";
  ctx.lineWidth = 3 - t * 1.5;
  ctx.stroke();
  ctx.restore();
}
