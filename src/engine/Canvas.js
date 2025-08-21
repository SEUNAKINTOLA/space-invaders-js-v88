/**
 * @fileoverview Canvas management class for Space Invaders game engine
 * Handles canvas initialization, rendering context, and basic drawing operations
 */

class Canvas {
    /**
     * @param {Object} config - Canvas configuration object
     * @param {number} config.width - Canvas width in pixels
     * @param {number} config.height - Canvas height in pixels
     * @param {string} config.containerId - ID of container element (optional)
     * @throws {Error} If canvas creation fails
     */
    constructor(config) {
        if (!config || typeof config !== 'object') {
            throw new Error('Canvas configuration is required');
        }

        this.width = config.width || 800;
        this.height = config.height || 600;
        this.canvas = null;
        this.context = null;
        
        this.initialize(config.containerId);
    }

    /**
     * Initialize canvas and get rendering context
     * @param {string} containerId - DOM container ID
     * @private
     */
    initialize(containerId) {
        try {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            if (containerId) {
                const container = document.getElementById(containerId);
                if (container) {
                    container.appendChild(this.canvas);
                } else {
                    document.body.appendChild(this.canvas);
                }
            } else {
                document.body.appendChild(this.canvas);
            }

            this.context = this.canvas.getContext('2d');
            if (!this.context) {
                throw new Error('Failed to get 2D rendering context');
            }

            // Set default canvas styling
            this.canvas.style.backgroundColor = '#000000';
            this.context.imageSmoothingEnabled = false; // Better for pixel art games
        } catch (error) {
            throw new Error(`Canvas initialization failed: ${error.message}`);
        }
    }

    /**
     * Clear the entire canvas
     */
    clear() {
        if (this.context) {
            this.context.clearRect(0, 0, this.width, this.height);
        }
    }

    /**
     * Draw an image on the canvas
     * @param {HTMLImageElement} image - Image to draw
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Width of the image
     * @param {number} height - Height of the image
     */
    drawImage(image, x, y, width, height) {
        if (!image || !this.context) return;
        
        try {
            this.context.drawImage(image, x, y, width, height);
        } catch (error) {
            console.error('Error drawing image:', error);
        }
    }

    /**
     * Draw text on the canvas
     * @param {string} text - Text to draw
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Object} options - Text drawing options
     * @param {string} options.color - Text color (default: white)
     * @param {string} options.font - Font style (default: 20px Arial)
     * @param {string} options.align - Text alignment (default: left)
     */
    drawText(text, x, y, options = {}) {
        if (!this.context || typeof text !== 'string') return;

        const defaultOptions = {
            color: '#FFFFFF',
            font: '20px Arial',
            align: 'left'
        };

        const settings = { ...defaultOptions, ...options };

        try {
            this.context.fillStyle = settings.color;
            this.context.font = settings.font;
            this.context.textAlign = settings.align;
            this.context.fillText(text, x, y);
        } catch (error) {
            console.error('Error drawing text:', error);
        }
    }

    /**
     * Resize canvas to new dimensions
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        if (!this.canvas) return;

        try {
            this.width = width;
            this.height = height;
            this.canvas.width = width;
            this.canvas.height = height;
        } catch (error) {
            console.error('Error resizing canvas:', error);
        }
    }

    /**
     * Get the canvas element
     * @returns {HTMLCanvasElement|null}
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Get the rendering context
     * @returns {CanvasRenderingContext2D|null}
     */
    getContext() {
        return this.context;
    }

    /**
     * Clean up canvas resources
     */
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.context = null;
    }
}

export default Canvas;