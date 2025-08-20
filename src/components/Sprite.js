/**
 * Sprite.js
 * Handles sprite rendering and management for game entities
 */

class Sprite {
    /**
     * Creates a new Sprite instance
     * @param {Object} config - Sprite configuration object
     * @param {string} config.imageUrl - URL of the sprite image
     * @param {number} config.width - Width of the sprite
     * @param {number} config.height - Height of the sprite
     * @param {number} [config.frameCount=1] - Number of frames for animated sprites
     * @param {number} [config.scale=1] - Scale factor for the sprite
     * @param {number} [config.rotation=0] - Rotation in radians
     */
    constructor(config) {
        this.validateConfig(config);
        
        this.image = new Image();
        this.image.src = config.imageUrl;
        this.width = config.width;
        this.height = config.height;
        this.frameCount = config.frameCount || 1;
        this.currentFrame = 0;
        this.scale = config.scale || 1;
        this.rotation = config.rotation || 0;
        
        this.isLoaded = false;
        this.loadPromise = this.loadImage();
    }

    /**
     * Validates the sprite configuration
     * @private
     * @param {Object} config - Configuration to validate
     * @throws {Error} If configuration is invalid
     */
    validateConfig(config) {
        if (!config) {
            throw new Error('Sprite configuration is required');
        }
        if (!config.imageUrl || typeof config.imageUrl !== 'string') {
            throw new Error('Valid imageUrl is required');
        }
        if (!config.width || !config.height || 
            config.width <= 0 || config.height <= 0) {
            throw new Error('Valid width and height are required');
        }
    }

    /**
     * Loads the sprite image
     * @private
     * @returns {Promise} Resolves when image is loaded
     */
    loadImage() {
        return new Promise((resolve, reject) => {
            this.image.onload = () => {
                this.isLoaded = true;
                resolve();
            };
            this.image.onerror = () => {
                reject(new Error(`Failed to load sprite image: ${this.image.src}`));
            };
        });
    }

    /**
     * Renders the sprite to the canvas context
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} x - X coordinate to render at
     * @param {number} y - Y coordinate to render at
     */
    render(ctx, x, y) {
        if (!this.isLoaded) {
            return;
        }

        ctx.save();
        
        // Transform context for rotation and scaling
        ctx.translate(x + (this.width * this.scale) / 2, 
                     y + (this.height * this.scale) / 2);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        // Calculate frame position for sprite sheets
        const frameX = (this.currentFrame % this.frameCount) * this.width;
        
        // Draw the sprite
        ctx.drawImage(
            this.image,
            frameX, 0,
            this.width, this.height,
            -this.width / 2, -this.height / 2,
            this.width, this.height
        );

        ctx.restore();
    }

    /**
     * Updates the sprite animation frame
     */
    updateFrame() {
        if (this.frameCount > 1) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }

    /**
     * Sets the sprite's scale
     * @param {number} scale - New scale factor
     */
    setScale(scale) {
        if (typeof scale !== 'number' || scale <= 0) {
            throw new Error('Scale must be a positive number');
        }
        this.scale = scale;
    }

    /**
     * Sets the sprite's rotation
     * @param {number} radians - Rotation in radians
     */
    setRotation(radians) {
        if (typeof radians !== 'number') {
            throw new Error('Rotation must be a number');
        }
        this.rotation = radians;
    }

    /**
     * Checks if the sprite image has finished loading
     * @returns {boolean} True if sprite is ready to render
     */
    isReady() {
        return this.isLoaded;
    }

    /**
     * Gets the sprite's dimensions
     * @returns {Object} Width and height of the sprite
     */
    getDimensions() {
        return {
            width: this.width * this.scale,
            height: this.height * this.scale
        };
    }
}

export default Sprite;