/**
 * @fileoverview Canvas management class for the game engine
 * Handles canvas initialization, resizing, and rendering context
 */

/**
 * Configuration for canvas initialization
 * @typedef {Object} CanvasConfig
 * @property {number} width - Canvas width in pixels
 * @property {number} height - Canvas height in pixels
 * @property {string} containerId - ID of container element
 * @property {boolean} [transparentBackground=false] - Enable transparent background
 * @property {boolean} [antialiasing=true] - Enable antialiasing
 */

/**
 * Manages the game canvas and rendering context
 */
export class Canvas {
  /**
   * Creates a new Canvas instance
   * @param {CanvasConfig} config - Canvas configuration
   * @throws {Error} If container element not found or canvas creation fails
   */
  constructor(config) {
    this.validateConfig(config);
    
    this.width = config.width;
    this.height = config.height;
    this.containerId = config.containerId;
    this.transparentBackground = config.transparentBackground ?? false;
    this.antialiasing = config.antialiasing ?? true;

    this.initializeCanvas();
    this.setupResizeHandler();
  }

  /**
   * Validates the provided configuration
   * @private
   * @param {CanvasConfig} config - Canvas configuration to validate
   * @throws {Error} If configuration is invalid
   */
  validateConfig(config) {
    if (!config) {
      throw new Error('Canvas configuration is required');
    }
    if (!Number.isFinite(config.width) || config.width <= 0) {
      throw new Error('Invalid canvas width');
    }
    if (!Number.isFinite(config.height) || config.height <= 0) {
      throw new Error('Invalid canvas height');
    }
    if (!config.containerId || typeof config.containerId !== 'string') {
      throw new Error('Container ID is required');
    }
  }

  /**
   * Initializes the canvas element and context
   * @private
   * @throws {Error} If canvas creation or context acquisition fails
   */
  initializeCanvas() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      throw new Error(`Container element with id '${this.containerId}' not found`);
    }

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Configure canvas context
    const contextOptions = {
      alpha: this.transparentBackground,
      antialias: this.antialiasing,
    };

    this.context = this.canvas.getContext('2d', contextOptions);
    if (!this.context) {
      throw new Error('Failed to get 2D rendering context');
    }

    container.appendChild(this.canvas);
  }

  /**
   * Sets up window resize handler for responsive canvas
   * @private
   */
  setupResizeHandler() {
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    this.handleResize(); // Initial resize
  }

  /**
   * Handles canvas resize to maintain aspect ratio
   * @private
   */
  handleResize() {
    const container = this.canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const aspectRatio = this.width / this.height;

    let newWidth = containerWidth;
    let newHeight = containerWidth / aspectRatio;

    if (newHeight > containerHeight) {
      newHeight = containerHeight;
      newWidth = containerHeight * aspectRatio;
    }

    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;
  }

  /**
   * Clears the entire canvas
   */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Gets the canvas rendering context
   * @returns {CanvasRenderingContext2D} The 2D rendering context
   */
  getContext() {
    return this.context;
  }

  /**
   * Gets the canvas element
   * @returns {HTMLCanvasElement} The canvas element
   */
  getCanvas() {
    return this.canvas;
  }

  /**
   * Gets the current canvas dimensions
   * @returns {{width: number, height: number}} Canvas dimensions
   */
  getDimensions() {
    return {
      width: this.width,
      height: this.height
    };
  }

  /**
   * Updates canvas dimensions
   * @param {number} width - New canvas width
   * @param {number} height - New canvas height
   * @throws {Error} If dimensions are invalid
   */
  setDimensions(width, height) {
    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
      throw new Error('Invalid dimensions');
    }
    
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.handleResize();
  }

  /**
   * Destroys the canvas instance and removes event listeners
   */
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
}