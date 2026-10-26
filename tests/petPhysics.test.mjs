import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, getHorizontalBounds, getVerticalBounds, moveTowards, getPatrolWaypoints } from '../src/components/pet/petPhysics.js';

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
