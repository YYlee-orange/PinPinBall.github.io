import { fitCanvas } from "./coord.js";
import { bindInput } from "./input.js";
import { startLoop } from "./loop.js";
import { draw } from "./render.js";
import { createState, tick } from "./round.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const state = createState();
window.__game = state;

function resize() {
  fitCanvas(canvas, ctx);
}

window.addEventListener("resize", resize);
resize();
bindInput(canvas, state);

startLoop(
  (dt) => {
    if (state.scene === "playing") tick(state, dt);
  },
  () => draw(ctx, state)
);
