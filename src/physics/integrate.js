import { DT, GRAVITY, SUBSTEPS } from "../config.js";

export function integrate(ball, dt = DT / SUBSTEPS) {
  ball.vx += GRAVITY * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
}
