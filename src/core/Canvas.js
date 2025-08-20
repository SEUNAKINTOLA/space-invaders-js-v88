/**
 * @fileoverview Canvas management system for Space Invaders game
 * Handles canvas initialization, resizing, and basic rendering operations
 */

/**
 * Manages the game canvas and provides core rendering functionality
 */
class Canvas {
  /**
   * @param {Object} config - Canvas configuration
   * @param {number} config.width - Initial canvas width
   * @param {number} config.height - Initial canvas height
   * @param {string} config.containerId - ID of container element
   * @param {boolean} [config.pixelated=true] - Whether to use pixelated rendering
   */
  constructor(config) {
    if (!config) {
      throw new Error('Canvas configuration is required');
    }

    this.width = config.width || 800;
    this.height = config.height || 600;
    this.pixelated = config.pixelated !== false;
    
    this.initializeCanvas(config.containerId);
    this.setupContext();
    this.bindEvents();
  }

  /**
   * Initializes the canvas element and adds it to the container
   * @param {string} containerId - ID of the container element
   * @private
   */
  initializeCanvas(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    container.appendChild(this.canvas);
  }

  /**
   * Sets up the canvas rendering context with appropriate settings
   * @private
   */
  setupContext() {
    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });

    if (this.pixelated) {
      this.ctx.imageSmoothingEnabled = false;
      this.canvas.style.imageRendering = 'pixelated';
    }
  }

  /**
   * Binds necessary event listeners
   * @private
   */
  bindEvents() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Handles window resize events
   * @private
   */
  handleResize() {
    const bounds = this.canvas.getBoundingClientRect();
    const scale = Math.min(
      window.innerWidth / this.width,
      window.innerHeight / this.height
    );

    this.canvas.style.width = `${this.width * scale}px`;
    this.canvas.style.height = `${this.height * scale}px`;
  }

  /**
   * Clears the entire canvas
   */
  clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Draws an image on the canvas
   * @param {HTMLImageElement} image - Image to draw
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Width of the image
   * @param {number} height - Height of the image
   */
  drawImage(image, x, y, width, height) {
    if (!image || !(image instanceof HTMLImageElement)) {
      console.warn('Invalid image provided to drawImage');
      return;
    }

    try {
      this.ctx.drawImage(image, x, y, width, height);
    } catch (error) {
      console.error('Error drawing image:', error);
    }
  }

  /**
   * Draws a sprite from a spritesheet
   * @param {HTMLImageElement} spritesheet - Spritesheet image
   * @param {number} sourceX - Source X coordinate in spritesheet
   * @param {number} sourceY - Source Y coordinate in spritesheet
   * @param {number} sourceWidth - Width of sprite in spritesheet
   * @param {number} sourceHeight - Height of sprite in spritesheet
   * @param {number} destX - Destination X coordinate on canvas
   * @param {number} destY - Destination Y coordinate on canvas
   * @param {number} destWidth - Destination width on canvas
   * @param {number} destHeight - Destination height on canvas
   */
  drawSprite(
    spritesheet,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destX,
    destY,
    destWidth,
    destHeight
  ) {
    if (!spritesheet || !(spritesheet instanceof HTMLImageElement)) {
      console.warn('Invalid spritesheet provided to drawSprite');
      return;
    }

    try {
      this.ctx.drawImage(
        spritesheet,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight
      );
    } catch (error) {
      console.error('Error drawing sprite:', error);
    }
  }

  /**
   * Gets the canvas rendering context
   * @returns {CanvasRenderingContext2D} The canvas rendering context
   */
  getContext() {
    return this.ctx;
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
   * Cleans up event listeners and resources
   */
  destroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.canvas.remove();
  }
}

export default Canvas;