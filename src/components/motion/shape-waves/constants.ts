export const SHAPE_MODES = { mixed: 0, squares: 1, circles: 2, triangles: 3 } as const;
export type ShapeWavesShapes = keyof typeof SHAPE_MODES;

export const DEFAULT_MAX_DPR = 1.5;
export const MAX_MASK_SIZE = 1024;
export const NOISE_CELLS = 32;
export const TIME_RATE = 0.1;
export const SIMULATION_STEP = 1 / 60;
export const WAVE_SPEED = 0.42;
export const WAVE_FRICTION = 0.94;
export const WAVE_DECAY = 0.972;
export const SETTLED_THRESHOLD = 0.01;
export const INTRO_BAND = 0.2;
export const INTRO_WARP = 0.3;
export const INTRO_JITTER = 0.16;
export const INTRO_END = 1 + INTRO_WARP + INTRO_JITTER + INTRO_BAND;
