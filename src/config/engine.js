/**
 * @fileoverview Engine configuration settings for Space Invaders game
 * Contains core engine parameters, canvas settings, and performance configurations
 */

// Canvas default settings
const CANVAS_CONFIG = {
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  contextType: '2d',
  smoothing: false, // Disable image smoothing for pixel-perfect rendering
};

// Game loop configuration
const LOOP_CONFIG = {
  targetFPS: 60,
  maxDeltaTime: 1000 / 30, // Cap max frame time to prevent spiral of death
  updateInterval: 1000 / 60, // 60 updates per second
  panicThreshold: 300, // Time in ms before triggering panic mode
};

// Debug settings
const DEBUG_CONFIG = {
  showFPS: process.env.NODE_ENV === 'development',
  drawColliders: false,
  logPerformance: process.env.NODE_ENV === 'development',
  verboseLogging: false,
};

// Rendering settings
const RENDER_CONFIG = {
  clearBeforeRender: true,
  antialiasing: false,
  pixelRatio: window.devicePixelRatio || 1,
  imageSmoothingEnabled: false,
  maxParticles: 1000,
};

// Physics configuration
const PHYSICS_CONFIG = {
  gravity: { x: 0, y: 0 },
  friction: 0.98,
  bounceThreshold: 0.2,
  velocityIterations: 8,
  positionIterations: 3,
};

// Asset loading configuration
const ASSET_CONFIG = {
  baseUrl: '/assets/',
  timeout: 30000, // Asset load timeout in ms
  retryAttempts: 3,
  batchSize: 5, // Number of concurrent asset loads
};

// Performance thresholds
const PERFORMANCE_CONFIG = {
  maxEntities: 1000,
  cullingThreshold: 100, // Distance in pixels for object culling
  maxParticleEffects: 20,
  frameTimeWarning: 16.67, // Warning threshold for frame time (ms)
};

// Collision detection settings
const COLLISION_CONFIG = {
  spatialHashCellSize: 64,
  maxObjectsPerCell: 10,
  broadphaseMargin: 5,
  quadTreeMaxDepth: 5,
  quadTreeMaxObjects: 10,
};

/**
 * Validates and initializes engine configuration
 * @param {Object} customConfig - Optional custom configuration to override defaults
 * @returns {Object} Merged and validated configuration
 * @throws {Error} If configuration validation fails
 */
function initializeEngineConfig(customConfig = {}) {
  try {
    const mergedConfig = {
      canvas: { ...CANVAS_CONFIG, ...customConfig.canvas },
      loop: { ...LOOP_CONFIG, ...customConfig.loop },
      debug: { ...DEBUG_CONFIG, ...customConfig.debug },
      render: { ...RENDER_CONFIG, ...customConfig.render },
      physics: { ...PHYSICS_CONFIG, ...customConfig.physics },
      assets: { ...ASSET_CONFIG, ...customConfig.assets },
      performance: { ...PERFORMANCE_CONFIG, ...customConfig.performance },
      collision: { ...COLLISION_CONFIG, ...customConfig.collision },
    };

    validateConfig(mergedConfig);
    return mergedConfig;
  } catch (error) {
    throw new Error(`Engine configuration error: ${error.message}`);
  }
}

/**
 * Validates configuration values
 * @private
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If validation fails
 */
function validateConfig(config) {
  // Validate canvas dimensions
  if (config.canvas.width <= 0 || config.canvas.height <= 0) {
    throw new Error('Invalid canvas dimensions');
  }

  // Validate FPS settings
  if (config.loop.targetFPS <= 0 || config.loop.targetFPS > 240) {
    throw new Error('Invalid target FPS value');
  }

  // Validate physics iterations
  if (config.physics.velocityIterations <= 0 || config.physics.positionIterations <= 0) {
    throw new Error('Invalid physics iteration values');
  }

  // Validate collision settings
  if (config.collision.quadTreeMaxDepth <= 0 || config.collision.quadTreeMaxObjects <= 0) {
    throw new Error('Invalid collision configuration values');
  }
}

// Export configurations and initializer
export {
  initializeEngineConfig,
  CANVAS_CONFIG,
  LOOP_CONFIG,
  DEBUG_CONFIG,
  RENDER_CONFIG,
  PHYSICS_CONFIG,
  ASSET_CONFIG,
  PERFORMANCE_CONFIG,
  COLLISION_CONFIG,
};