import {
  FAIL_X,
  LANE_WALL_BOT,
  LANE_WALL_TOP,
  TABLE_CX,
  TABLE_CY1,
  TABLE_CY2,
  TABLE_R,
  W,
  H,
} from "./config.js";

export const tableCircles = [
  { x: TABLE_CX, y: TABLE_CY1, r: TABLE_R },
  { x: TABLE_CX, y: TABLE_CY2, r: TABLE_R },
];

const laneTop = LANE_WALL_TOP;
const laneBot = LANE_WALL_BOT;

export const laneWalls = [
  { ax: FAIL_X, ay: laneTop, bx: W, by: laneTop, nx: 0, ny: 1 },
  { ax: FAIL_X, ay: laneBot, bx: W, by: laneBot, nx: 0, ny: -1 },
  { ax: FAIL_X, ay: 0, bx: FAIL_X, by: laneTop, nx: -1, ny: 0 },
  { ax: FAIL_X, ay: laneBot, bx: FAIL_X, by: H, nx: -1, ny: 0 },
];

export function drawTable(ctx) {
  ctx.save();
  ctx.fillStyle = "#101014";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#e23b3b";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.moveTo(FAIL_X, 0);
  ctx.lineTo(FAIL_X, H);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(210,210,220,0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(FAIL_X, laneTop);
  ctx.lineTo(W, laneTop);
  ctx.moveTo(FAIL_X, laneBot);
  ctx.lineTo(W, laneBot);
  ctx.stroke();

  for (const c of tableCircles) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = "#1c1c24";
    ctx.fill();
    ctx.strokeStyle = "#3a3a4a";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.fillStyle = "#2a2a32";
  ctx.beginPath();
  ctx.moveTo(W, 18);
  ctx.lineTo(W - 22, 36);
  ctx.lineTo(W, 54);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W, H - 18);
  ctx.lineTo(W - 22, H - 36);
  ctx.lineTo(W, H - 54);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(W - 14, 0, 14, H);
  ctx.restore();
}
