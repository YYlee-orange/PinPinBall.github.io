import { DT } from "./config.js";

export function startLoop(update, draw) {
  let last = performance.now();
  let acc = 0;
  function frame(now) {
    const raw = Math.min(0.05, (now - last) / 1000);
    last = now;
    acc += raw;
    while (acc >= DT) {
      update(DT);
      acc -= DT;
    }
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
