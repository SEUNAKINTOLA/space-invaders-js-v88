/**
 * @fileoverview Base Sprite class for game objects
 * Handles basic sprite properties, rendering, and transformations
 */

/**
 * Represents a basic sprite object in the game
 */
class Sprite {
  /**
   * Create a new Sprite
   * @param {Object} config - Sprite configuration
   * @param {number} config.x - Initial x position
   * @param {number} config.y - Initial y position
   * @param {number} config.width - Sprite width
   * @param {number} config.height - Sprite height
   * @param {string} [config.color='#ffffff'] - Fill color for basic rendering
   * @param {Image} [config.image=null] - Optional sprite image
   */
  constructor(config = {}) {
    // Position
    this.x = config.x || 0;
    this.y = config.y || 0;

    // Dimensions
    this.width = config.width || 32;
    this.height = config.height || 32;

    // Visual properties
    this.color = config.color || '#ffffff';
    this.image = config.image || null;

    // Transform properties
    this.rotation = 0;
    this.scale = {
      x: 1,
      y: 1
    };

    // State
    this.visible = true;
    this.active = true;
  }

  /**
   * Update sprite logic
   * @param {number} deltaTime - Time elapsed since last update in milliseconds
   */
  update(deltaTime) {
    // Base update logic - to be extended by child classes
  }

  /**
   * Render the sprite to the canvas context
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  render(ctx) {
    if (!this.visible) return;

    ctx.save();

    // Apply transformations
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale.x, this.scale.y);

    if (this.image) {
      // Render sprite image
      ctx.drawImage(
        this.image,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      // Render rectangle if no image
      ctx.fillStyle = this.color;
      ctx.fillRect(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }

    ctx.restore();
  }

  /**
   * Get the sprite's bounding box
   * @returns {Object} Bounding box with x, y, width, height
   */
  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Set the sprite's position
   * @param {number} x - New x position
   * @param {number} y - New y position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Set the sprite's scale
   * @param {number} x - Scale factor on x axis
   * @param {number} y - Scale factor on y axis
   */
  setScale(x, y) {
    this.scale.x = x;
    this.scale.y = y;
  }

  /**
   * Set the sprite's rotation in radians
   * @param {number} angle - Rotation angle in radians
   */
  setRotation(angle) {
    this.rotation = angle;
  }

  /**
   * Check if this sprite intersects with another sprite
   * @param {Sprite} other - Other sprite to check collision with
   * @returns {boolean} True if sprites intersect
   */
  intersects(other) {
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds();

    return !(bounds2.x >= bounds1.x + bounds1.width ||
             bounds2.x + bounds2.width <= bounds1.x ||
             bounds2.y >= bounds1.y + bounds1.height ||
             bounds2.y + bounds2.height <= bounds1.y);
  }
}

export default Sprite;