/**
 * @fileoverview Enemy class implementation for Space Invaders game
 * Handles enemy behavior, movement patterns, and state management
 */

class Enemy {
    /**
     * Creates a new enemy instance
     * @param {Object} config - Enemy configuration object
     * @param {number} config.x - Initial x position
     * @param {number} config.y - Initial y position
     * @param {number} config.width - Enemy width
     * @param {number} config.height - Enemy height
     * @param {number} config.speed - Movement speed
     * @param {number} config.health - Initial health points
     * @param {string} config.type - Enemy type identifier
     * @param {string} config.movementPattern - Movement pattern identifier
     */
    constructor(config) {
        // Position and dimensions
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 32;
        this.height = config.height || 32;
        
        // Movement and behavior
        this.speed = config.speed || 2;
        this.direction = 1; // 1 for right, -1 for left
        this.movementPattern = config.movementPattern || 'horizontal';
        
        // Game state
        this.health = config.health || 1;
        this.type = config.type || 'basic';
        this.isActive = true;
        this.points = this.calculatePoints();
        
        // Internal state
        this._lastUpdate = Date.now();
        this._animationFrame = 0;
    }

    /**
     * Updates enemy position and state
     * @param {number} deltaTime - Time elapsed since last update in milliseconds
     * @param {Object} gameState - Current game state
     * @returns {void}
     */
    update(deltaTime, gameState) {
        if (!this.isActive) return;

        this._updatePosition(deltaTime);
        this._updateAnimation(deltaTime);
        this._checkBoundaries(gameState);
    }

    /**
     * Handles enemy taking damage
     * @param {number} damage - Amount of damage to apply
     * @returns {boolean} - Returns true if enemy is destroyed
     */
    takeDamage(damage) {
        this.health -= damage;
        
        if (this.health <= 0) {
            this.isActive = false;
            return true;
        }
        return false;
    }

    /**
     * Gets enemy's current collision bounds
     * @returns {Object} Collision rectangle
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Calculates point value based on enemy type
     * @private
     * @returns {number} Point value
     */
    calculatePoints() {
        const pointValues = {
            'basic': 10,
            'advanced': 20,
            'boss': 50
        };
        return pointValues[this.type] || 10;
    }

    /**
     * Updates enemy position based on movement pattern
     * @private
     * @param {number} deltaTime - Time elapsed since last update
     */
    _updatePosition(deltaTime) {
        const movement = this.speed * deltaTime / 1000;

        switch (this.movementPattern) {
            case 'horizontal':
                this.x += movement * this.direction;
                break;
            case 'vertical':
                this.y += movement;
                break;
            case 'zigzag':
                this.x += movement * this.direction;
                this.y += Math.sin(this._lastUpdate / 1000) * movement;
                break;
            default:
                this.x += movement * this.direction;
        }

        this._lastUpdate = Date.now();
    }

    /**
     * Updates enemy animation state
     * @private
     * @param {number} deltaTime - Time elapsed since last update
     */
    _updateAnimation(deltaTime) {
        this._animationFrame = (this._animationFrame + deltaTime / 200) % 2;
    }

    /**
     * Checks and handles boundary collisions
     * @private
     * @param {Object} gameState - Current game state
     */
    _checkBoundaries(gameState) {
        const margin = 10;
        
        // Horizontal boundaries
        if (this.x <= margin || this.x >= gameState.width - this.width - margin) {
            this.direction *= -1;
            this.y += this.height; // Move down when hitting edge
        }

        // Vertical boundaries
        if (this.y >= gameState.height - this.height - margin) {
            this.isActive = false;
            gameState.onEnemyReachedBottom?.();
        }
    }

    /**
     * Checks if enemy can fire based on game rules
     * @returns {boolean} Whether enemy can fire
     */
    canFire() {
        return this.isActive && Math.random() < 0.01; // 1% chance to fire per update
    }

    /**
     * Gets enemy's current state for saving/serialization
     * @returns {Object} Enemy state
     */
    getState() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            type: this.type,
            isActive: this.isActive,
            direction: this.direction,
            movementPattern: this.movementPattern
        };
    }
}

export default Enemy;