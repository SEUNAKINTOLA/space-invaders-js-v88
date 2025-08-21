/**
 * @fileoverview Base GameObject class that provides core functionality for all game entities
 * @module engine/GameObject
 */

/**
 * Represents a base game object with position, size, and basic physics properties
 */
class GameObject {
    /**
     * Creates a new GameObject
     * @param {Object} config - Configuration object for the game object
     * @param {number} [config.x=0] - Initial x position
     * @param {number} [config.y=0] - Initial y position
     * @param {number} [config.width=0] - Width of the game object
     * @param {number} [config.height=0] - Height of the game object
     * @param {number} [config.velocityX=0] - Initial velocity in x direction
     * @param {number} [config.velocityY=0] - Initial velocity in y direction
     * @param {boolean} [config.active=true] - Whether the object is active in the game
     * @param {string} [config.tag=''] - Tag for identifying object type
     */
    constructor(config = {}) {
        // Position
        this.x = config.x || 0;
        this.y = config.y || 0;

        // Dimensions
        this.width = config.width || 0;
        this.height = config.height || 0;

        // Physics
        this.velocityX = config.velocityX || 0;
        this.velocityY = config.velocityY || 0;

        // State
        this.active = config.active !== undefined ? config.active : true;
        this.tag = config.tag || '';

        // Unique identifier
        this._id = GameObject.generateId();
    }

    /**
     * Generates a unique identifier for game objects
     * @private
     * @returns {string} Unique identifier
     */
    static generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Updates the game object's position based on velocity
     * @param {number} deltaTime - Time elapsed since last update in seconds
     */
    update(deltaTime) {
        if (!this.active) return;

        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }

    /**
     * Gets the bounding box for collision detection
     * @returns {Object} Bounding box with x, y, width, and height
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
     * Checks if this object collides with another game object
     * @param {GameObject} other - The other game object to check collision with
     * @returns {boolean} True if objects collide, false otherwise
     */
    collidesWith(other) {
        if (!this.active || !other.active) return false;

        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();

        return !(bounds1.x + bounds1.width < bounds2.x ||
                bounds2.x + bounds2.width < bounds1.x ||
                bounds1.y + bounds1.height < bounds2.y ||
                bounds2.y + bounds2.height < bounds1.y);
    }

    /**
     * Sets the velocity of the game object
     * @param {number} x - Velocity in x direction
     * @param {number} y - Velocity in y direction
     */
    setVelocity(x, y) {
        this.velocityX = x;
        this.velocityY = y;
    }

    /**
     * Sets the position of the game object
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Activates or deactivates the game object
     * @param {boolean} value - Whether to activate (true) or deactivate (false)
     */
    setActive(value) {
        this.active = Boolean(value);
    }

    /**
     * Gets the unique identifier of the game object
     * @returns {string} Unique identifier
     */
    getId() {
        return this._id;
    }
}

export default GameObject;