export const scrollMotionState = {
  position: 0,
  progress: 0,
  velocity: 0,
  direction: 1,
  intensity: 0,
};

export function updateScrollMotion(next: Partial<typeof scrollMotionState>) {
  Object.assign(scrollMotionState, next);
}
