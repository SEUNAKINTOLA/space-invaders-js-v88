/**
 * @fileoverview Base Collider component for handling collision detection
 * @module engine/collision/Collider
 */

/**
 * @typedef {Object} BoundingBox
 * @property {number} x - X coordinate of the top-left corner
 * @property {number} y - Y coordinate of the top-left corner
 * @property {number} width - Width of the bounding box
 * @property {number} height - Height of the bounding box
 */

/**
 * @typedef {Object} CollisionInfo
 * @property {boolean} colliding - Whether a collision occurred
 * @property {number} overlap - Amount of overlap between colliders
 * @property {string} side - Side of collision ('top', 'bottom', 'left', 'right')
 */

/**
 * Base Collider class for handling collision detection between game objects
 */
class Collider {
    /**
     * Create a new Collider
     * @param {number} x - X coordinate of collider
     * @param {number} y - Y coordinate of collider
     * @param {number} width - Width of collider
     * @param {number} height - Height of collider
     * @param {string} [type='box'] - Type of collider ('box' or 'circle')
     */
    constructor(x, y, width, height, type = 'box') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.enabled = true;
        this.layer = 0; // Collision layer for filtering
        this.tag = ''; // Optional tag for identifying collider type
    }

    /**
     * Get the current bounding box of the collider
     * @returns {BoundingBox} Current bounding box
     */
    getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Update collider position
     * @param {number} x - New X coordinate
     * @param {number} y - New Y coordinate
     */
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Check collision with another collider
     * @param {Collider} other - Other collider to check against
     * @returns {CollisionInfo} Collision information
     */
    checkCollision(other) {
        if (!this.enabled || !other.enabled) {
            return { colliding: false, overlap: 0, side: null };
        }

        if (this.type === 'box' && other.type === 'box') {
            return this.#checkBoxCollision(other);
        } else if (this.type === 'circle' && other.type === 'circle') {
            return this.#checkCircleCollision(other);
        }

        // Default to box collision for mixed types
        return this.#checkBoxCollision(other);
    }

    /**
     * Check if point is inside collider
     * @param {number} pointX - X coordinate of point
     * @param {number} pointY - Y coordinate of point
     * @returns {boolean} True if point is inside collider
     */
    containsPoint(pointX, pointY) {
        if (this.type === 'circle') {
            const radius = this.width / 2;
            const centerX = this.x + radius;
            const centerY = this.y + radius;
            const distance = Math.sqrt(
                Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2)
            );
            return distance <= radius;
        }

        return (
            pointX >= this.x &&
            pointX <= this.x + this.width &&
            pointY >= this.y &&
            pointY <= this.y + this.height
        );
    }

    /**
     * Private method to check collision between two box colliders
     * @private
     * @param {Collider} other - Other box collider
     * @returns {CollisionInfo} Collision information
     */
    #checkBoxCollision(other) {
        const left = Math.max(this.x, other.x);
        const right = Math.min(this.x + this.width, other.x + other.width);
        const top = Math.max(this.y, other.y);
        const bottom = Math.min(this.y + this.height, other.y + other.height);

        if (left < right && top < bottom) {
            const overlapX = right - left;
            const overlapY = bottom - top;
            const overlap = Math.min(overlapX, overlapY);
            
            // Determine collision side
            let side = 'left';
            if (overlapY < overlapX) {
                side = this.y < other.y ? 'top' : 'bottom';
            } else {
                side = this.x < other.x ? 'left' : 'right';
            }

            return { colliding: true, overlap, side };
        }

        return { colliding: false, overlap: 0, side: null };
    }

    /**
     * Private method to check collision between two circle colliders
     * @private
     * @param {Collider} other - Other circle collider
     * @returns {CollisionInfo} Collision information
     */
    #checkCircleCollision(other) {
        const radius1 = this.width / 2;
        const radius2 = other.width / 2;
        const centerX1 = this.x + radius1;
        const centerY1 = this.y + radius1;
        const centerX2 = other.x + radius2;
        const centerY2 = other.y + radius2;

        const distance = Math.sqrt(
            Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
        );
        const overlap = radius1 + radius2 - distance;

        if (overlap > 0) {
            // Calculate collision side based on centers
            const angle = Math.atan2(centerY2 - centerY1, centerX2 - centerX1);
            let side = 'right';
            if (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) side = 'bottom';
            else if (angle > -3 * Math.PI / 4 && angle < -Math.PI / 4) side = 'top';
            else if (angle > (3 * Math.PI) / 4 || angle < -3 * Math.PI / 4) side = 'left';

            return { colliding: true, overlap, side };
        }

        return { colliding: false, overlap: 0, side: null };
    }
}

export default Collider;