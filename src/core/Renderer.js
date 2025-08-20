/**
 * @fileoverview Renderer class responsible for managing game rendering operations
 * and sprite management on the canvas.
 */

/**
 * @typedef {Object} RenderObject
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} width - Width of the object
 * @property {number} height - Height of the object
 * @property {string} [color] - Fill color for basic shapes
 * @property {HTMLImageElement} [sprite] - Image element for sprite rendering
 * @property {number} [opacity=1] - Opacity value between 0 and 1
 * @property {boolean} [visible=true] - Whether the object should be rendered
 */

class Renderer {
  /**
   * Creates a new Renderer instance
   * @param {HTMLCanvasElement} canvas - The canvas element to render to
   * @param {CanvasRenderingContext2D} context - The 2D rendering context
   */
  constructor(canvas, context) {
    if (!canvas || !context) {
      throw new Error('Canvas and context are required for Renderer');
    }

    this.canvas = canvas;
    this.ctx = context;
    this.renderQueue = new Map(); // Stores objects to render by layer
    this.sprites = new Map(); // Cache for loaded sprite images
    this.isRunning = false;
  }

  /**
   * Clears the entire canvas
   * @private
   */
  _clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Loads a sprite image and caches it
   * @param {string} id - Unique identifier for the sprite
   * @param {string} src - Image source URL
   * @returns {Promise<HTMLImageElement>} - Promise resolving to the loaded image
   */
  async loadSprite(id, src) {
    if (this.sprites.has(id)) {
      return this.sprites.get(id);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.sprites.set(id, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load sprite: ${src}`));
      img.src = src;
    });
  }

  /**
   * Adds an object to the render queue
   * @param {string} id - Unique identifier for the render object
   * @param {RenderObject} object - Object to render
   * @param {number} [layer=0] - Render layer (higher numbers render on top)
   */
  addToRenderQueue(id, object, layer = 0) {
    if (!this.renderQueue.has(layer)) {
      this.renderQueue.set(layer, new Map());
    }
    this.renderQueue.get(layer).set(id, object);
  }

  /**
   * Removes an object from the render queue
   * @param {string} id - Identifier of object to remove
   * @param {number} [layer=0] - Layer the object is on
   */
  removeFromRenderQueue(id, layer = 0) {
    const layerMap = this.renderQueue.get(layer);
    if (layerMap) {
      layerMap.delete(id);
    }
  }

  /**
   * Renders a single object
   * @param {RenderObject} obj - Object to render
   * @private
   */
  _renderObject(obj) {
    if (!obj.visible) return;

    this.ctx.save();
    this.ctx.globalAlpha = obj.opacity ?? 1;

    if (obj.sprite) {
      this.ctx.drawImage(obj.sprite, obj.x, obj.y, obj.width, obj.height);
    } else {
      // Fallback to colored rectangle if no sprite
      this.ctx.fillStyle = obj.color || '#ffffff';
      this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }

    this.ctx.restore();
  }

  /**
   * Renders all objects in the queue
   */
  render() {
    this._clearCanvas();

    // Sort layers to ensure correct rendering order
    const sortedLayers = Array.from(this.renderQueue.keys()).sort((a, b) => a - b);

    for (const layer of sortedLayers) {
      const layerObjects = this.renderQueue.get(layer);
      for (const obj of layerObjects.values()) {
        this._renderObject(obj);
      }
    }
  }

  /**
   * Starts the renderer
   */
  start() {
    this.isRunning = true;
  }

  /**
   * Stops the renderer
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Cleans up resources used by the renderer
   */
  destroy() {
    this.stop();
    this.renderQueue.clear();
    this.sprites.clear();
  }

  /**
   * Updates the canvas size
   * @param {number} width - New canvas width
   * @param {number} height - New canvas height
   */
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

export default Renderer;