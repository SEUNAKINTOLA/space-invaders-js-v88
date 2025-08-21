/**
 * @fileoverview Engine configuration settings for Space Invaders game
 * Contains core engine parameters, canvas settings, and game loop configuration
 */

/**
 * Canvas rendering configuration
 * @typedef {Object} CanvasConfig
 * @property {number} width - Canvas width in pixels
 * @property {number} height - Canvas height in pixels
 * @property {string} backgroundColor - Default canvas background color
 * @property {boolean} antialiasing - Enable/disable antialiasing
 */
const CANVAS_CONFIG = {
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    antialiasing: false,
    contextType: '2d',
    alpha: false // Better performance for full-screen games
};

/**
 * Game loop timing configuration
 * @typedef {Object} GameLoopConfig
 * @property {number} targetFPS - Target frames per second
 * @property {number} maxDeltaTime - Maximum allowed delta time (ms)
 * @property {number} updateInterval - Fixed update interval (ms)
 */
const GAME_LOOP_CONFIG = {
    targetFPS: 60,
    maxDeltaTime: 50, // Prevent spiral of death
    updateInterval: 1000 / 60, // 60 Hz physics update
    panic: 10 // Number of consecutive slow frames before panic mode
};

/**
 * Debug configuration settings
 * @typedef {Object} DebugConfig
 * @property {boolean} showFPS - Display FPS counter
 * @property {boolean} showColliders - Show collision boundaries
 * @property {boolean} logPerformance - Log performance metrics
 */
const DEBUG_CONFIG = {
    showFPS: process.env.NODE_ENV === 'development',
    showColliders: false,
    logPerformance: process.env.NODE_ENV === 'development',
    verboseLogging: false
};

/**
 * Physics engine configuration
 * @typedef {Object} PhysicsConfig
 * @property {number} gravity - Global gravity value
 * @property {number} maxVelocity - Maximum velocity for any entity
 * @property {number} friction - Global friction coefficient
 */
const PHYSICS_CONFIG = {
    gravity: 0, // Space game has no gravity
    maxVelocity: 1000,
    friction: 0.98,
    collisionPrecision: 2 // Collision detection precision level
};

/**
 * Rendering layer configuration
 * @typedef {Object} LayerConfig
 * @property {number} background - Background layer index
 * @property {number} entities - Game entities layer index
 * @property {number} effects - Visual effects layer index
 * @property {number} ui - UI elements layer index
 */
const LAYER_CONFIG = {
    background: 0,
    entities: 1,
    effects: 2,
    ui: 3,
    maxLayers: 4
};

/**
 * Asset loading configuration
 * @typedef {Object} AssetConfig
 * @property {number} timeout - Asset loading timeout in milliseconds
 * @property {string[]} supportedImageTypes - Supported image file types
 * @property {string[]} supportedAudioTypes - Supported audio file types
 */
const ASSET_CONFIG = {
    timeout: 5000,
    supportedImageTypes: ['.png', '.jpg', '.webp'],
    supportedAudioTypes: ['.mp3', '.wav', '.ogg'],
    maxConcurrentLoads: 5
};

/**
 * Engine performance configuration
 * @typedef {Object} PerformanceConfig
 * @property {number} maxParticles - Maximum number of particles
 * @property {number} entityPoolSize - Entity pool initial size
 * @property {boolean} useObjectPooling - Enable object pooling
 */
const PERFORMANCE_CONFIG = {
    maxParticles: 1000,
    entityPoolSize: 100,
    useObjectPooling: true,
    garbageCollectionInterval: 1000
};

/**
 * Global engine configuration object
 * @type {Object}
 */
const ENGINE_CONFIG = {
    canvas: CANVAS_CONFIG,
    gameLoop: GAME_LOOP_CONFIG,
    debug: DEBUG_CONFIG,
    physics: PHYSICS_CONFIG,
    layers: LAYER_CONFIG,
    assets: ASSET_CONFIG,
    performance: PERFORMANCE_CONFIG,
    
    // Engine core settings
    version: '1.0.0',
    maxEntities: 1000,
    updatePriority: {
        physics: 0,
        input: 1,
        ai: 2,
        animation: 3,
        render: 4
    }
};

// Freeze configuration to prevent runtime modifications
Object.freeze(ENGINE_CONFIG);
Object.freeze(ENGINE_CONFIG.canvas);
Object.freeze(ENGINE_CONFIG.gameLoop);
Object.freeze(ENGINE_CONFIG.debug);
Object.freeze(ENGINE_CONFIG.physics);
Object.freeze(ENGINE_CONFIG.layers);
Object.freeze(ENGINE_CONFIG.assets);
Object.freeze(ENGINE_CONFIG.performance);
Object.freeze(ENGINE_CONFIG.updatePriority);

export default ENGINE_CONFIG;