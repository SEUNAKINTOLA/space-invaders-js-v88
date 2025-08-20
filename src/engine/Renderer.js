/**
 * @fileoverview Renderer class handling all canvas rendering operations for the game engine
 * @module engine/Renderer
 */

/**
 * Configuration for renderer initialization
 * @typedef {Object} RendererConfig
 * @property {number} width - Canvas width in pixels
 * @property {number} height - Canvas height in pixels
 * @property {string} backgroundColor - Default background color
 * @property {boolean} [smoothing=false] - Enable image smoothing
 */

/**
 * Manages canvas rendering operations for the game engine
 */
class Renderer {
    /**
     * Creates a new Renderer instance
     * @param {RendererConfig} config - Renderer configuration
     * @throws {Error} If canvas creation fails
     */
    constructor(config) {
        if (!config || typeof config !== 'object') {
            throw new Error('Invalid renderer configuration');
        }

        this.width = config.width || 800;
        this.height = config.height || 600;
        this.backgroundColor = config.backgroundColor || '#000000';
        this.smoothing = config.smoothing || false;

        this.initializeCanvas();
    }

    /**
     * Initializes the canvas and context
     * @private
     * @throws {Error} If canvas creation fails
     */
    initializeCanvas() {
        try {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            
            this.context = this.canvas.getContext('2d');
            if (!this.context) {
                throw new Error('Failed to get 2D context');
            }

            // Configure context defaults
            this.context.imageSmoothingEnabled = this.smoothing;
            this.context.textBaseline = 'middle';
            this.context.textAlign = 'center';
        } catch (error) {
            throw new Error(`Canvas initialization failed: ${error.message}`);
        }
    }

    /**
     * Attaches the canvas to a DOM element
     * @param {HTMLElement} container - DOM element to attach canvas to
     * @throws {Error} If container is invalid
     */
    attach(container) {
        if (!(container instanceof HTMLElement)) {
            throw new Error('Invalid container element');
        }
        container.appendChild(this.canvas);
    }

    /**
     * Clears the entire canvas
     */
    clear() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Draws an image on the canvas
     * @param {HTMLImageElement} image - Image to draw
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} [width] - Optional width to draw image
     * @param {number} [height] - Optional height to draw image
     */
    drawImage(image, x, y, width, height) {
        if (!(image instanceof HTMLImageElement)) {
            throw new Error('Invalid image element');
        }

        try {
            if (width && height) {
                this.context.drawImage(image, x, y, width, height);
            } else {
                this.context.drawImage(image, x, y);
            }
        } catch (error) {
            console.error('Error drawing image:', error);
        }
    }

    /**
     * Draws a sprite from a sprite sheet
     * @param {HTMLImageElement} spriteSheet - Sprite sheet image
     * @param {number} sourceX - Source X coordinate in sprite sheet
     * @param {number} sourceY - Source Y coordinate in sprite sheet
     * @param {number} sourceWidth - Width of sprite in sprite sheet
     * @param {number} sourceHeight - Height of sprite in sprite sheet
     * @param {number} destX - Destination X coordinate on canvas
     * @param {number} destY - Destination Y coordinate on canvas
     * @param {number} destWidth - Destination width on canvas
     * @param {number} destHeight - Destination height on canvas
     */
    drawSprite(spriteSheet, sourceX, sourceY, sourceWidth, sourceHeight, 
               destX, destY, destWidth, destHeight) {
        try {
            this.context.drawImage(
                spriteSheet,
                sourceX, sourceY,
                sourceWidth, sourceHeight,
                destX, destY,
                destWidth, destHeight
            );
        } catch (error) {
            console.error('Error drawing sprite:', error);
        }
    }

    /**
     * Draws text on the canvas
     * @param {string} text - Text to draw
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} [color='white'] - Text color
     * @param {string} [font='16px Arial'] - Font specification
     */
    drawText(text, x, y, color = 'white', font = '16px Arial') {
        try {
            this.context.fillStyle = color;
            this.context.font = font;
            this.context.fillText(text, x, y);
        } catch (error) {
            console.error('Error drawing text:', error);
        }
    }

    /**
     * Gets the canvas context
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
     * Sets the background color
     * @param {string} color - CSS color string
     */
    setBackgroundColor(color) {
        this.backgroundColor = color;
    }

    /**
     * Resizes the canvas
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Restore context settings that are reset on resize
        this.context.imageSmoothingEnabled = this.smoothing;
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';
    }
}

export default Renderer;