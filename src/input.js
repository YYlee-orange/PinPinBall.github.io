import { pointerToWorld } from "./coord.js";
import { aimFromPointer } from "./entities/launcher.js";
import { canShoot, resetState, startVolley } from "./round.js";
import { pauseHit } from "./render.js";
import { len } from "./math.js";

export function bindInput(canvas, state) {
  let down = false;
  let dragging = false;

  function pos(e) {
    const t = e.touches ? e.touches[0] || e.changedTouches[0] : e;
    return pointerToWorld(canvas, t.clientX, t.clientY);
  }

  function onPause(p) {
    const hit = pauseHit();
    return len(p.x - hit.x, p.y - hit.y) <= hit.r + 8;
  }

  function start(e) {
    e.preventDefault();
    const p = pos(e);
    if (state.scene === "result") {
      resetState(state);
      return;
    }
    if (onPause(p)) {
      if (state.scene === "playing") state.scene = "paused";
      else if (state.scene === "paused") state.scene = "playing";
      return;
    }
    if (state.scene === "paused") {
      state.scene = "playing";
      return;
    }
    if (!canShoot(state)) return;
    down = true;
    dragging = true;
    state.aiming = true;
    state.aimAngle = aimFromPointer(p.x, p.y);
  }

  function move(e) {
    if (!down || !dragging) return;
    e.preventDefault();
    const p = pos(e);
    state.aimAngle = aimFromPointer(p.x, p.y);
  }

  function end(e) {
    if (!down) return;
    e.preventDefault();
    down = false;
    dragging = false;
    if (state.aiming && canShoot(state)) startVolley(state, state.aimAngle);
    state.aiming = false;
  }

  canvas.addEventListener("pointerdown", start, { passive: false });
  window.addEventListener("pointermove", move, { passive: false });
  window.addEventListener("pointerup", end, { passive: false });
  window.addEventListener("pointercancel", end, { passive: false });
}
