/**
 * @fileoverview Collision system configuration settings
 * Defines core parameters and thresholds for the collision detection system
 */

/**
 * @typedef {Object} QuadTreeConfig
 * @property {number} maxDepth - Maximum depth of the quadtree
 * @property {number} maxObjects - Maximum objects per node before splitting
 * @property {number} minSize - Minimum node size before stopping subdivision
 */

/**
 * @typedef {Object} CollisionConfig 
 * @property {number} broadphaseMargin - Margin for broad-phase collision detection
 * @property {boolean} enableBroadphase - Enable/disable broad-phase optimization
 * @property {string} collisionStrategy - Collision detection strategy to use
 */

/**
 * QuadTree configuration settings
 * @type {QuadTreeConfig}
 */
export const quadTreeConfig = {
  maxDepth: 8,
  maxObjects: 10,
  minSize: 20
};

/**
 * Collision detection thresholds and tolerances
 * @type {Object}
 */
export const collisionThresholds = {
  minimumDistance: 1.0, // Minimum distance to register collision
  velocityThreshold: 0.1, // Minimum velocity for dynamic collision checks
  pushbackForce: 0.5, // Force to separate colliding objects
  maxIterations: 3 // Maximum collision resolution iterations
};

/**
 * Main collision system configuration
 * @type {CollisionConfig}
 */
export const collisionConfig = {
  broadphaseMargin: 50,
  enableBroadphase: true,
  collisionStrategy: 'hybrid', // 'simple', 'quadtree', or 'hybrid'
  debug: {
    showBounds: false,
    showQuadTree: false,
    logCollisions: false
  }
};

/**
 * Collision layer definitions for filtering
 * @type {Object}
 */
export const collisionLayers = {
  PLAYER: 1 << 0,
  ENEMY: 1 << 1,
  PROJECTILE: 1 << 2,
  POWERUP: 1 << 3,
  BOUNDARY: 1 << 4,
  ALL: 0xFFFFFFFF
};

/**
 * Collision matrix defining which layers can collide
 * @type {Object}
 */
export const collisionMatrix = {
  [collisionLayers.PLAYER]: collisionLayers.ENEMY | collisionLayers.PROJECTILE | collisionLayers.POWERUP | collisionLayers.BOUNDARY,
  [collisionLayers.ENEMY]: collisionLayers.PLAYER | collisionLayers.PROJECTILE | collisionLayers.BOUNDARY,
  [collisionLayers.PROJECTILE]: collisionLayers.PLAYER | collisionLayers.ENEMY | collisionLayers.BOUNDARY,
  [collisionLayers.POWERUP]: collisionLayers.PLAYER,
  [collisionLayers.BOUNDARY]: collisionLayers.ALL
};

/**
 * Performance optimization settings
 * @type {Object}
 */
export const optimizationSettings = {
  spatialHashingGridSize: 100,
  enableSleeping: true,
  sleepVelocityThreshold: 0.1,
  sleepTimeThreshold: 1000
};

/**
 * Collision response configuration
 * @type {Object}
 */
export const responseConfig = {
  defaultRestitution: 0.5,
  defaultFriction: 0.3,
  enableInterpolation: true,
  interpolationFactor: 0.5
};

/**
 * Validates collision configuration settings
 * @param {CollisionConfig} config - Configuration to validate
 * @throws {Error} If configuration is invalid
 */
export const validateConfig = (config) => {
  if (!config) {
    throw new Error('Collision configuration is required');
  }

  if (typeof config.broadphaseMargin !== 'number' || config.broadphaseMargin < 0) {
    throw new Error('Invalid broadphaseMargin value');
  }

  if (typeof config.enableBroadphase !== 'boolean') {
    throw new Error('enableBroadphase must be a boolean');
  }

  const validStrategies = ['simple', 'quadtree', 'hybrid'];
  if (!validStrategies.includes(config.collisionStrategy)) {
    throw new Error(`Invalid collision strategy. Must be one of: ${validStrategies.join(', ')}`);
  }
};

// Export default configuration
export default {
  quadTree: quadTreeConfig,
  thresholds: collisionThresholds,
  collision: collisionConfig,
  layers: collisionLayers,
  matrix: collisionMatrix,
  optimization: optimizationSettings,
  response: responseConfig,
  validate: validateConfig
};