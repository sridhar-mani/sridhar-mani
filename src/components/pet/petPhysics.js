/** Clamp a finite value to an ordered range. */
export function clamp(value, min, max) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  if (!Number.isFinite(value)) return low;
  return Math.min(high, Math.max(low, value));
}

/** Return horizontal bounds that keep a fixed-size pet inside the viewport. */
export function getHorizontalBounds(viewportWidth, petWidth = 64, gutter = 8) {
  const width = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  const spriteWidth = Number.isFinite(petWidth) ? Math.max(0, petWidth) : 64;
  const safeGutter = Number.isFinite(gutter) ? Math.max(0, gutter) : 8;
  const lastVisibleX = Math.max(0, width - spriteWidth);
  const minX = Math.min(safeGutter, lastVisibleX);
  const maxX = Math.max(minX, lastVisibleX - safeGutter);
  return { minX, maxX };
}

/** Return bottom-offset bounds that keep the pet's sprite inside the viewport. */
export function getVerticalBounds(viewportHeight, petHeight = 72, gutter = 8) {
  const height = Number.isFinite(viewportHeight) ? Math.max(0, viewportHeight) : 0;
  const spriteHeight = Number.isFinite(petHeight) ? Math.max(0, petHeight) : 72;
  const safeGutter = Number.isFinite(gutter) ? Math.max(0, gutter) : 8;
  const lastVisibleY = Math.max(0, height - spriteHeight);
  const minY = Math.min(safeGutter, lastVisibleY);
  const maxY = Math.max(minY, lastVisibleY - safeGutter);
  return { minY, maxY };
}

/** Move toward a target by at most maxDelta without overshooting. */
export function moveTowards(current, target, maxDelta) {
  if (!Number.isFinite(current)) return Number.isFinite(target) ? target : 0;
  if (!Number.isFinite(target)) return current;
  const step = Number.isFinite(maxDelta) ? Math.max(0, maxDelta) : 0;
  return current + clamp(target - current, -step, step);
}

/** Stable, screen-relative patrol stops; callers choose them in a random order. */
export function getPatrolWaypoints(minX, maxX) {
  const low = Math.min(minX, maxX);
  const high = Math.max(minX, maxX);
  const span = high - low;
  return [0.15, 0.38, 0.62, 0.85].map((ratio) => low + span * ratio);
}

/** Integrate one bounded vertical-physics step in viewport bottom-offset coordinates. */
export function stepVerticalPhysics(position, velocity, dt, floorY, ceilingY, gravity = 1400, restitution = 0.42, bounceThreshold = 80) {
  const safeFloor = Number.isFinite(floorY) ? floorY : 0;
  const safeCeiling = Math.max(safeFloor, Number.isFinite(ceilingY) ? ceilingY : safeFloor);
  const safePosition = Number.isFinite(position) ? position : safeFloor;
  const safeVelocity = Number.isFinite(velocity) ? velocity : 0;
  const safeDt = clamp(dt, 0, 0.05);
  const safeGravity = Number.isFinite(gravity) ? Math.max(0, gravity) : 1400;
  const safeRestitution = clamp(restitution, 0, 1);
  let nextPosition = safePosition + safeVelocity * safeDt;
  let nextVelocity = safeVelocity - safeGravity * safeDt;
  let landed = false;
  let bounced = false;
  let hitCeiling = false;

  if (nextPosition > safeCeiling) {
    nextPosition = safeCeiling;
    if (nextVelocity > 0) nextVelocity = 0;
    hitCeiling = true;
  }

  if (nextPosition <= safeFloor) {
    nextPosition = safeFloor;
    landed = true;
    if (Math.abs(nextVelocity) > bounceThreshold) {
      nextVelocity = -nextVelocity * safeRestitution;
      bounced = true;
    } else {
      nextVelocity = 0;
    }
  }

  return { position: nextPosition, velocity: nextVelocity, landed, bounced, hitCeiling };
}

/** Pick a small random depth variation near the bottom, away from central page content. */
export function getPatrolDepthTarget(minY, maxY, randomValue = Math.random()) {
  const low = Math.min(minY, maxY);
  const high = Math.max(minY, maxY);
  const safeRandom = clamp(randomValue, 0, 1);
  return low + (high - low) * 0.18 * safeRandom;
}
