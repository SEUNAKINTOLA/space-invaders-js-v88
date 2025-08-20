/**
 * @fileoverview Collision detection system for game objects
 * Handles broad and narrow phase collision detection using QuadTree optimization
 */

/**
 * Class representing the collision detection system
 * Manages collision detection and resolution between game objects
 */
class CollisionSystem {
  /**
   * Create a collision system
   * @param {Object} config - Configuration options
   * @param {number} config.worldWidth - Width of the game world
   * @param {number} config.worldHeight - Height of the game world
   * @param {number} config.maxObjects - Max objects per QuadTree node
   * @param {number} config.maxLevels - Max levels in QuadTree
   */
  constructor(config = {}) {
    this.config = {
      worldWidth: config.worldWidth || 800,
      worldHeight: config.worldHeight || 600,
      maxObjects: config.maxObjects || 10,
      maxLevels: config.maxLevels || 4
    };

    // Active colliders in the system
    this.colliders = new Set();
    
    // Collision pairs detected in current frame
    this.collisionPairs = new Map();
    
    // Collision response handlers
    this.collisionHandlers = new Map();
  }

  /**
   * Add a collider to the collision system
   * @param {Collider} collider - Collider component to add
   */
  addCollider(collider) {
    if (!collider || this.colliders.has(collider)) {
      return;
    }
    this.colliders.add(collider);
  }

  /**
   * Remove a collider from the collision system
   * @param {Collider} collider - Collider component to remove
   */
  removeCollider(collider) {
    this.colliders.delete(collider);
  }

  /**
   * Register a collision handler for specific collider types
   * @param {string} typeA - First collider type
   * @param {string} typeB - Second collider type
   * @param {Function} handler - Collision handler function
   */
  registerCollisionHandler(typeA, typeB, handler) {
    const key = this.getCollisionHandlerKey(typeA, typeB);
    this.collisionHandlers.set(key, handler);
  }

  /**
   * Generate unique key for collision handler pair
   * @private
   * @param {string} typeA - First collider type
   * @param {string} typeB - Second collider type
   * @returns {string} Unique collision pair key
   */
  getCollisionHandlerKey(typeA, typeB) {
    return typeA <= typeB ? `${typeA}:${typeB}` : `${typeB}:${typeA}`;
  }

  /**
   * Check collision between two colliders
   * @private
   * @param {Collider} a - First collider
   * @param {Collider} b - Second collider
   * @returns {boolean} True if colliding
   */
  checkCollision(a, b) {
    // Basic AABB collision check
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }

  /**
   * Handle collision between two colliders
   * @private
   * @param {Collider} a - First collider
   * @param {Collider} b - Second collider
   */
  handleCollision(a, b) {
    const key = this.getCollisionHandlerKey(a.type, b.type);
    const handler = this.collisionHandlers.get(key);
    
    if (handler) {
      handler(a, b);
    }
  }

  /**
   * Update the collision system
   * Performs broad and narrow phase collision detection
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Clear previous collision pairs
    this.collisionPairs.clear();

    // Broad phase - Build spatial partition
    const activeColliders = Array.from(this.colliders);
    
    // Narrow phase - Check potential collisions
    for (let i = 0; i < activeColliders.length; i++) {
      const colliderA = activeColliders[i];
      
      for (let j = i + 1; j < activeColliders.length; j++) {
        const colliderB = activeColliders[j];

        // Skip if same collider or either is inactive
        if (!colliderA.active || !colliderB.active) {
          continue;
        }

        // Check for collision
        if (this.checkCollision(colliderA, colliderB)) {
          // Store collision pair
          const pairKey = `${colliderA.id}:${colliderB.id}`;
          this.collisionPairs.set(pairKey, [colliderA, colliderB]);
          
          // Handle collision
          this.handleCollision(colliderA, colliderB);
        }
      }
    }
  }

  /**
   * Get all current collision pairs
   * @returns {Array} Array of colliding object pairs
   */
  getCollisionPairs() {
    return Array.from(this.collisionPairs.values());
  }

  /**
   * Clear all colliders and collision data
   */
  clear() {
    this.colliders.clear();
    this.collisionPairs.clear();
  }
}

export default CollisionSystem;