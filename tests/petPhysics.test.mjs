import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, getHorizontalBounds, getVerticalBounds, moveTowards, getPatrolWaypoints, getRandomPatrolTarget, stepVerticalPhysics, getPatrolDepthTarget } from '../src/components/pet/petPhysics.js';

test('clamp handles values outside and inside the range', () => {
  assert.equal(clamp(-5, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
  assert.equal(clamp(5, 0, 10), 5);
});

test('clamp safely handles reversed bounds and non-finite values', () => {
  assert.equal(clamp(5, 10, 0), 5);
  assert.equal(clamp(Number.NaN, 10, 20), 10);
});

test('horizontal bounds leave the full sprite visible on normal and narrow screens', () => {
  assert.deepEqual(getHorizontalBounds(1280), { minX: 8, maxX: 1208 });
  const narrow = getHorizontalBounds(70);
  assert.ok(narrow.minX >= 0);
  assert.ok(narrow.maxX >= narrow.minX);
  assert.ok(narrow.maxX + 64 <= 70);
});

test('vertical bounds keep the sprite visible and collapse safely on tiny screens', () => {
  assert.deepEqual(getVerticalBounds(800), { minY: 8, maxY: 720 });
  assert.deepEqual(getVerticalBounds(50), { minY: 0, maxY: 0 });
});

test('moveTowards never overshoots and handles zero or invalid delta', () => {
  assert.equal(moveTowards(10, 30, 5), 15);
  assert.equal(moveTowards(30, 10, 50), 10);
  assert.equal(moveTowards(10, 30, 0), 10);
  assert.equal(moveTowards(10, 30, Number.NaN), 10);
});

test('patrol waypoints are ordered and remain within bounds', () => {
  const points = getPatrolWaypoints(8, 1208);
  assert.equal(points.length, 4);
  assert.deepEqual([...points].sort((a, b) => a - b), points);
  assert.ok(points.every((point) => point >= 8 && point <= 1208));
  assert.ok(new Set(points).size === points.length);
});

test('vertical integration applies gravity without exceeding the time-step cap', () => {
  const step = stepVerticalPhysics(100, 100, 1, 8, 720);
  assert.equal(step.position, 105);
  assert.equal(step.velocity, 30);
  assert.equal(step.landed, false);
});

test('vertical integration bounces at the floor and settles low-energy landings', () => {
  const bounce = stepVerticalPhysics(10, -200, 0.05, 8, 720);
  assert.equal(bounce.position, 8);
  assert.equal(bounce.landed, true);
  assert.equal(bounce.bounced, true);
  assert.ok(bounce.velocity > 0);

  const settled = stepVerticalPhysics(8.2, -10, 0.05, 8, 720);
  assert.equal(settled.position, 8);
  assert.equal(settled.velocity, 0);
  assert.equal(settled.bounced, false);
});

test('vertical integration stops upward motion at the ceiling', () => {
  const step = stepVerticalPhysics(718, 500, 0.05, 8, 720);
  assert.equal(step.position, 720);
  assert.equal(step.velocity, 0);
  assert.equal(step.hitCeiling, true);
});

test('random depth stops cover most of the safe viewport without leaving bounds', () => {
  assert.equal(getPatrolDepthTarget(8, 708, 0), 64);
  assert.equal(getPatrolDepthTarget(8, 708, 1), 652);
  assert.equal(getPatrolDepthTarget(8, 708, 0.5), 358);
  assert.ok(getPatrolDepthTarget(8, 708, 0.5) > 134);
  assert.equal(getPatrolDepthTarget(0, 0, 1), 0);
});


test('random patrol targets stay in bounds and travel a meaningful distance', () => {
  const left = getRandomPatrolTarget(8, 1208, 600, 0);
  const right = getRandomPatrolTarget(8, 1208, 600, 0.999);
  assert.equal(left, 8);
  assert.ok(right <= 1208 && right >= 740);
  assert.ok(Math.abs(left - 600) >= 140);
  assert.ok(Math.abs(right - 600) >= 140);
  assert.equal(getRandomPatrolTarget(10, 10, 5, 0.5), 10);
});
