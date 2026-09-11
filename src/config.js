export const W = 904;
export const H = 572;

export const CIRCLE_NX = 0.15;
export const CIRCLE_NY1 = 0.25;
export const CIRCLE_NY2 = 0.75;
export const CIRCLE_R_OVER_H = 0.2;

export const TABLE_CX = CIRCLE_NX * W;
export const TABLE_CY1 = CIRCLE_NY1 * H;
export const TABLE_CY2 = CIRCLE_NY2 * H;
export const TABLE_R = CIRCLE_R_OVER_H * H;
export const LAUNCH_X = TABLE_CX + 52;
export const LAUNCH_Y = 0.5 * H;
export const FAIL_X = 0.35 * W;

export const BALL_R = 16 * 1.3;
export const BALL_MAX = 7;
export const BALL_START = 1;
export const GRAVITY = 760;
export const LAUNCH_SPEED = 520;
export const RESTITUTION = 0.62;
export const FLOOR_RESTITUTION = RESTITUTION * 1.5;
export const BEAD_GAP = BALL_R * 3;

export const HP_MAX = 27;
export const START_HP_MAX = 5;
export const HP_RAMP_TIME = 120;
export const BLAST_DMG = 10;
export const BLAST_ROW_P = 0.2;
export const GROW_ROW_P = 0.5;

export const GRID_COLS = 6;
export const GRID_ROWS = 5;
export const COL_GAP = 20;
export const GRID_PAD_X = 12;
export const CELL_W = (W - FAIL_X - GRID_PAD_X * 2 - COL_GAP * (GRID_COLS - 1)) / GRID_COLS;
export const GRID_PAD_Y = H * 0.1;
export const LANE_WALL_TOP = GRID_PAD_Y - 4;
export const LANE_WALL_BOT = H - GRID_PAD_Y + 10;
export const ROW_GAP = 16;
export const CELL_H = (H - GRID_PAD_Y * 2 - ROW_GAP * (GRID_ROWS - 1)) / GRID_ROWS;
export const BRICK_RADIUS = Math.min(CELL_W, CELL_H) * 0.46;
export const NODE_R = 20;

export const BRICK_ANGLES = [0, 15, 30, 45, 60].map((d) => (d * Math.PI) / 180);
export const SHAPES = ["tri", "square", "circle", "pent"];

export const DT = 1 / 60;
export const SUBSTEPS = 4;
export const RETURN_TIME = 0.45;
export const RECYCLE_X = W - 8;
