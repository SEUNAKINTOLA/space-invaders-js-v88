/**
 * @fileoverview Player entity class representing the player's ship in Space Invaders
 * Handles player movement, shooting, and state management
 */

class Player {
    /**
     * @param {Object} config - Player configuration object
     * @param {number} config.x - Initial x position
     * @param {number} config.y - Initial y position
     * @param {number} config.width - Player ship width
     * @param {number} config.height - Player ship height
     * @param {number} config.speed - Movement speed
     * @param {number} config.shootCooldown - Minimum time between shots in ms
     */
    constructor(config) {
        // Position
        this.x = config.x || 0;
        this.y = config.y || 0;
        
        // Dimensions
        this.width = config.width || 32;
        this.height = config.height || 32;
        
        // Movement
        this.speed = config.speed || 5;
        this.direction = {
            left: false,
            right: false
        };
        
        // Shooting
        this.shootCooldown = config.shootCooldown || 250;
        this.lastShotTime = 0;
        
        // State
        this.active = true;
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.invulnerabilityDuration = 2000; // 2 seconds
    }

    /**
     * Updates player position and state
     * @param {number} deltaTime - Time elapsed since last update in ms
     * @param {Object} bounds - Screen boundaries
     */
    update(deltaTime, bounds) {
        if (!this.active) return;

        // Update position based on input
        this._updatePosition(deltaTime, bounds);
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTimer += deltaTime;
            if (this.invulnerabilityTimer >= this.invulnerabilityDuration) {
                this.invulnerable = false;
                this.invulnerabilityTimer = 0;
            }
        }
    }

    /**
     * Updates player position based on current input
     * @private
     * @param {number} deltaTime - Time elapsed since last update
     * @param {Object} bounds - Screen boundaries
     */
    _updatePosition(deltaTime, bounds) {
        const movement = this._calculateMovement(deltaTime);
        
        // Apply movement within bounds
        const newX = this.x + movement;
        if (newX >= bounds.left && newX + this.width <= bounds.right) {
            this.x = newX;
        }
    }

    /**
     * Calculates movement amount based on current direction
     * @private
     * @param {number} deltaTime - Time elapsed since last update
     * @returns {number} Movement amount
     */
    _calculateMovement(deltaTime) {
        let movement = 0;
        if (this.direction.left) movement -= this.speed;
        if (this.direction.right) movement += this.speed;
        return movement * (deltaTime / 16.67); // Normalize to 60 FPS
    }

    /**
     * Attempts to fire a shot
     * @returns {boolean} Whether the shot was fired
     */
    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime >= this.shootCooldown && this.active) {
            this.lastShotTime = currentTime;
            return true;
        }
        return false;
    }

    /**
     * Handles player taking damage
     * @returns {boolean} Whether the player was damaged
     */
    takeDamage() {
        if (this.invulnerable || !this.active) return false;
        
        this.lives--;
        if (this.lives <= 0) {
            this.active = false;
            return true;
        }
        
        // Activate invulnerability
        this.invulnerable = true;
        this.invulnerabilityTimer = 0;
        
        return true;
    }

    /**
     * Sets movement direction
     * @param {string} direction - 'left' or 'right'
     * @param {boolean} value - Whether movement in that direction is active
     */
    setDirection(direction, value) {
        if (direction in this.direction) {
            this.direction[direction] = value;
        }
    }

    /**
     * Gets the current player bounds for collision detection
     * @returns {Object} Bounds rectangle
     */
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    /**
     * Resets player to initial state
     * @param {Object} config - Reset configuration
     */
    reset(config = {}) {
        this.x = config.x || this.x;
        this.y = config.y || this.y;
        this.active = true;
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.direction.left = false;
        this.direction.right = false;
        this.lastShotTime = 0;
    }
}

export default Player;