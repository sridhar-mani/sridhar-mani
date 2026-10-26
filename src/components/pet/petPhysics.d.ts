export function clamp(value: number, min: number, max: number): number;
export function getHorizontalBounds(viewportWidth: number, petWidth?: number, gutter?: number): { minX: number; maxX: number };
export function getVerticalBounds(viewportHeight: number, petHeight?: number, gutter?: number): { minY: number; maxY: number };
export function moveTowards(current: number, target: number, maxDelta: number): number;
export function getPatrolWaypoints(minX: number, maxX: number): number[];
export function stepVerticalPhysics(position: number, velocity: number, dt: number, floorY: number, ceilingY: number, gravity?: number, restitution?: number, bounceThreshold?: number): { position: number; velocity: number; landed: boolean; bounced: boolean; hitCeiling: boolean };
