/**
 * @fileoverview Touch Controls UI Component
 * Handles the rendering and management of touch control UI elements
 * for mobile/touch device gameplay.
 */

class TouchControls {
    /**
     * @param {Object} config - Configuration object
     * @param {number} config.width - Canvas width
     * @param {number} config.height - Canvas height
     */
    constructor(config) {
        this.width = config.width;
        this.height = config.height;
        this.touchElements = [];
        this.isVisible = false;
        
        // Touch control button dimensions and positions
        this.buttonSize = 80;
        this.buttonPadding = 20;
        
        this.initializeTouchControls();
    }

    /**
     * Initialize touch control elements and their positions
     * @private
     */
    initializeTouchControls() {
        // Left movement button
        this.leftButton = {
            x: this.buttonPadding,
            y: this.height - this.buttonSize - this.buttonPadding,
            width: this.buttonSize,
            height: this.buttonSize,
            action: 'left',
            label: '←'
        };

        // Right movement button
        this.rightButton = {
            x: this.buttonSize + (this.buttonPadding * 2),
            y: this.height - this.buttonSize - this.buttonPadding,
            width: this.buttonSize,
            height: this.buttonSize,
            action: 'right',
            label: '→'
        };

        // Fire button
        this.fireButton = {
            x: this.width - this.buttonSize - this.buttonPadding,
            y: this.height - this.buttonSize - this.buttonPadding,
            width: this.buttonSize,
            height: this.buttonSize,
            action: 'fire',
            label: '🔥'
        };

        this.touchElements = [this.leftButton, this.rightButton, this.fireButton];
    }

    /**
     * Show touch controls
     */
    show() {
        this.isVisible = true;
    }

    /**
     * Hide touch controls
     */
    hide() {
        this.isVisible = false;
    }

    /**
     * Check if a point is within a button's bounds
     * @param {number} x - Touch X coordinate
     * @param {number} y - Touch Y coordinate
     * @param {Object} button - Button object to check
     * @returns {boolean}
     * @private
     */
    isPointInButton(x, y, button) {
        return x >= button.x &&
               x <= button.x + button.width &&
               y >= button.y &&
               y <= button.y + button.height;
    }

    /**
     * Handle touch event and return corresponding action
     * @param {number} touchX - Touch X coordinate
     * @param {number} touchY - Touch Y coordinate
     * @returns {string|null} Action to perform or null if no button pressed
     */
    handleTouch(touchX, touchY) {
        if (!this.isVisible) return null;

        for (const button of this.touchElements) {
            if (this.isPointInButton(touchX, touchY, button)) {
                return button.action;
            }
        }
        return null;
    }

    /**
     * Render touch controls on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        if (!this.isVisible) return;

        ctx.save();
        
        // Set semi-transparent style for buttons
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        
        // Render each button
        for (const button of this.touchElements) {
            // Draw button background
            ctx.beginPath();
            ctx.roundRect(button.x, button.y, button.width, button.height, 10);
            ctx.fill();
            ctx.stroke();

            // Draw button label
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                button.label,
                button.x + button.width / 2,
                button.y + button.height / 2
            );
        }

        ctx.restore();
    }

    /**
     * Update touch control positions on resize
     * @param {number} width - New canvas width
     * @param {number} height - New canvas height
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.initializeTouchControls();
    }
}

export default TouchControls;