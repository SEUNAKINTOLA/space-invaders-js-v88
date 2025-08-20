/**
 * @fileoverview Enemy entity class for Space Invaders game
 * Handles enemy behavior, state management, and movement patterns
 */

// Constants for enemy configuration
const ENEMY_DEFAULTS = {
    width: 32,
    height: 32,
    speed: 2,
    health: 1,
    points: 10
};

/**
 * Represents an enemy entity in the game
 */
class Enemy {
    /**
     * Creates a new Enemy instance
     * @param {Object} config - Enemy configuration
     * @param {number} config.x - Initial X position
     * @param {number} config.y - Initial Y position
     * @param {string} config.type - Enemy type identifier
     * @param {Object} [config.pattern] - Movement pattern configuration
     * @param {number} [config.health] - Enemy health points
     * @param {number} [config.speed] - Movement speed
     * @param {number} [config.points] - Score points value
     */
    constructor(config) {
        if (!config || typeof config !== 'object') {
            throw new Error('Enemy requires configuration object');
        }

        // Required properties
        this.validatePosition(config.x, config.y);
        this.x = config.x;
        this.y = config.y;
        this.type = this.validateType(config.type);

        // Optional properties with defaults
        this.width = config.width || ENEMY_DEFAULTS.width;
        this.height = config.height || ENEMY_DEFAULTS.height;
        this.speed = config.speed || ENEMY_DEFAULTS.speed;
        this.health = config.health || ENEMY_DEFAULTS.health;
        this.points = config.points || ENEMY_DEFAULTS.points;
        
        // State management
        this.isActive = true;
        this.isVisible = true;
        this.direction = 1; // 1 for right, -1 for left
        this.pattern = config.pattern || null;
        this.patternStep = 0;
        
        // Movement tracking
        this.lastUpdate = performance.now();
        this.velocity = { x: 0, y: 0 };
    }

    /**
     * Validates position coordinates
     * @private
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @throws {Error} If coordinates are invalid
     */
    validatePosition(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number' || 
            isNaN(x) || isNaN(y)) {
            throw new Error('Invalid enemy position coordinates');
        }
    }

    /**
     * Validates enemy type
     * @private
     * @param {string} type - Enemy type identifier
     * @returns {string} Validated type
     * @throws {Error} If type is invalid
     */
    validateType(type) {
        if (!type || typeof type !== 'string') {
            throw new Error('Invalid enemy type');
        }
        return type;
    }

    /**
     * Updates enemy state and position
     * @param {number} deltaTime - Time elapsed since last update
     * @param {Object} bounds - Screen boundaries
     */
    update(deltaTime, bounds) {
        if (!this.isActive) return;

        if (this.pattern) {
            this.updatePattern(deltaTime);
        } else {
            this.updateBasicMovement(deltaTime, bounds);
        }

        this.lastUpdate = performance.now();
    }

    /**
     * Updates position based on pattern
     * @private
     * @param {number} deltaTime - Time elapsed since last update
     */
    updatePattern(deltaTime) {
        if (!this.pattern || !this.pattern.getPosition) return;

        const newPosition = this.pattern.getPosition(this.patternStep);
        if (newPosition) {
            this.x = newPosition.x;
            this.y = newPosition.y;
            this.patternStep++;
        }
    }

    /**
     * Updates position using basic side-to-side movement
     * @private
     * @param {number} deltaTime - Time elapsed since last update
     * @param {Object} bounds - Screen boundaries
     */
    updateBasicMovement(deltaTime, bounds) {
        const movement = this.speed * this.direction * deltaTime;
        this.x += movement;

        // Boundary checking
        if (bounds) {
            if (this.x <= bounds.left || this.x + this.width >= bounds.right) {
                this.direction *= -1; // Reverse direction
                this.y += this.height; // Move down
            }
        }
    }

    /**
     * Handles enemy taking damage
     * @param {number} amount - Amount of damage to take
     * @returns {boolean} Whether the enemy was destroyed
     */
    takeDamage(amount) {
        if (!this.isActive) return false;
        
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
            return true;
        }
        return false;
    }

    /**
     * Destroys the enemy
     */
    destroy() {
        this.isActive = false;
        this.isVisible = false;
    }

    /**
     * Gets the current enemy bounds
     * @returns {Object} Enemy bounds rectangle
     */
    getBounds() {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Checks collision with another entity
     * @param {Object} entity - Entity to check collision with
     * @returns {boolean} Whether collision occurred
     */
    checkCollision(entity) {
        if (!this.isActive || !entity) return false;

        const enemyBounds = this.getBounds();
        const entityBounds = entity.getBounds();

        return !(enemyBounds.left > entityBounds.right || 
                enemyBounds.right < entityBounds.left || 
                enemyBounds.top > entityBounds.bottom ||
                enemyBounds.bottom < entityBounds.top);
    }
}

// Export the Enemy class
export default Enemy;