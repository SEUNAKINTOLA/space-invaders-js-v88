/**
 * @fileoverview Canvas-related constants for Space Invaders game
 * Contains configuration values for canvas dimensions, scaling, and rendering settings
 */

/**
 * Base canvas dimensions for the game viewport
 * @constant {Object} CANVAS_DIMENSIONS
 */
export const CANVAS_DIMENSIONS = {
  WIDTH: 800,
  HEIGHT: 600,
  ASPECT_RATIO: 4 / 3
};

/**
 * Canvas rendering context configuration
 * @constant {Object} CANVAS_CONTEXT
 */
export const CANVAS_CONTEXT = {
  TYPE: '2d',
  SMOOTHING_ENABLED: false,
  ALPHA: true
};

/**
 * Canvas scaling modes for different display scenarios
 * @enum {string}
 */
export const SCALE_MODES = {
  FIT: 'fit',
  FILL: 'fill',
  STRETCH: 'stretch'
};

/**
 * Pixel ratio settings for handling different display densities
 * @constant {Object} PIXEL_RATIO
 */
export const PIXEL_RATIO = {
  DEFAULT: 1,
  MIN: 1,
  MAX: 4
};

/**
 * Canvas clear settings
 * @constant {Object} CLEAR_CONFIG
 */
export const CLEAR_CONFIG = {
  X: 0,
  Y: 0,
  PRESERVE_TRANSFORM: true
};

/**
 * Canvas background configuration
 * @constant {Object} BACKGROUND_CONFIG
 */
export const BACKGROUND_CONFIG = {
  COLOR: '#000000',
  ALPHA: 1.0
};

/**
 * Canvas performance settings
 * @constant {Object} PERFORMANCE_CONFIG
 */
export const PERFORMANCE_CONFIG = {
  BUFFER_SIZE: 32,
  MAX_SPRITES: 1000,
  BATCH_SIZE: 100
};

/**
 * Canvas layer configuration
 * @constant {Object} LAYER_CONFIG
 */
export const LAYER_CONFIG = {
  BACKGROUND: 0,
  GAME_OBJECTS: 1,
  PARTICLES: 2,
  UI: 3,
  OVERLAY: 4,
  MAX_LAYERS: 5
};

/**
 * Canvas rendering quality settings
 * @constant {Object} QUALITY_SETTINGS
 */
export const QUALITY_SETTINGS = {
  HIGH: {
    antialiasing: true,
    shadowQuality: 'high',
    particleLimit: 1000
  },
  MEDIUM: {
    antialiasing: true,
    shadowQuality: 'medium',
    particleLimit: 500
  },
  LOW: {
    antialiasing: false,
    shadowQuality: 'low',
    particleLimit: 200
  }
};

/**
 * Debug rendering settings
 * @constant {Object} DEBUG_CONFIG
 */
export const DEBUG_CONFIG = {
  SHOW_FPS: false,
  SHOW_BOUNDS: false,
  SHOW_COLLIDERS: false,
  SHOW_GRID: false
};

/**
 * Validation functions for canvas settings
 * @namespace
 */
export const CanvasValidation = {
  /**
   * Validates dimensions are within acceptable ranges
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {boolean} True if dimensions are valid
   */
  isValidDimension: (width, height) => {
    return width > 0 && 
           height > 0 && 
           width <= 4096 && 
           height <= 4096;
  },

  /**
   * Validates scale mode is supported
   * @param {string} mode - Scale mode to validate
   * @returns {boolean} True if scale mode is valid
   */
  isValidScaleMode: (mode) => {
    return Object.values(SCALE_MODES).includes(mode);
  }
};