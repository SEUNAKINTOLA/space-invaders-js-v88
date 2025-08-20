/**
 * @fileoverview QuadTree implementation for efficient collision detection
 * Divides space into quadrants to reduce collision checks between objects
 */

/**
 * @typedef {Object} Bounds
 * @property {number} x - X coordinate of the bounds
 * @property {number} y - Y coordinate of the bounds
 * @property {number} width - Width of the bounds
 * @property {number} height - Height of the bounds
 */

/**
 * Represents a boundary rectangle for the QuadTree
 */
class Boundary {
    /**
     * @param {number} x - X coordinate of the boundary
     * @param {number} y - Y coordinate of the boundary
     * @param {number} width - Width of the boundary
     * @param {number} height - Height of the boundary
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Checks if a point is within the boundary
     * @param {number} x - X coordinate to check
     * @param {number} y - Y coordinate to check
     * @returns {boolean}
     */
    contains(x, y) {
        return (x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height);
    }

    /**
     * Checks if this boundary intersects with another boundary
     * @param {Bounds} bounds - Boundary to check intersection with
     * @returns {boolean}
     */
    intersects(bounds) {
        return !(bounds.x > this.x + this.width ||
                bounds.x + bounds.width < this.x ||
                bounds.y > this.y + this.height ||
                bounds.y + bounds.height < this.y);
    }
}

/**
 * QuadTree data structure for spatial partitioning
 */
class QuadTree {
    /**
     * @param {Boundary} boundary - Boundary of this quad
     * @param {number} capacity - Maximum number of objects before splitting
     * @param {number} maxDepth - Maximum depth of the tree
     * @param {number} [depth=0] - Current depth of this quad
     */
    constructor(boundary, capacity, maxDepth, depth = 0) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.maxDepth = maxDepth;
        this.depth = depth;
        this.objects = [];
        this.divided = false;
        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
    }

    /**
     * Splits the quad into four subquads
     * @private
     */
    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.width / 2;
        const h = this.boundary.height / 2;

        const ne = new Boundary(x + w, y, w, h);
        const nw = new Boundary(x, y, w, h);
        const se = new Boundary(x + w, y + h, w, h);
        const sw = new Boundary(x, y + h, w, h);

        this.northeast = new QuadTree(ne, this.capacity, this.maxDepth, this.depth + 1);
        this.northwest = new QuadTree(nw, this.capacity, this.maxDepth, this.depth + 1);
        this.southeast = new QuadTree(se, this.capacity, this.maxDepth, this.depth + 1);
        this.southwest = new QuadTree(sw, this.capacity, this.maxDepth, this.depth + 1);

        this.divided = true;
    }

    /**
     * Inserts an object into the QuadTree
     * @param {Object} object - Object with bounds (x, y, width, height)
     * @returns {boolean} - Whether the insertion was successful
     */
    insert(object) {
        if (!this.boundary.intersects(object)) {
            return false;
        }

        if (this.objects.length < this.capacity || this.depth >= this.maxDepth) {
            this.objects.push(object);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        return (this.northeast.insert(object) ||
                this.northwest.insert(object) ||
                this.southeast.insert(object) ||
                this.southwest.insert(object));
    }

    /**
     * Queries objects that could collide with the given bounds
     * @param {Bounds} bounds - Boundary to check for potential collisions
     * @param {Array} [found=[]] - Array to store found objects
     * @returns {Array} Array of objects that could potentially collide
     */
    query(bounds, found = []) {
        if (!this.boundary.intersects(bounds)) {
            return found;
        }

        for (const object of this.objects) {
            if (bounds.intersects(object)) {
                found.push(object);
            }
        }

        if (this.divided) {
            this.northwest.query(bounds, found);
            this.northeast.query(bounds, found);
            this.southwest.query(bounds, found);
            this.southeast.query(bounds, found);
        }

        return found;
    }

    /**
     * Clears the QuadTree
     */
    clear() {
        this.objects = [];
        
        if (this.divided) {
            this.northeast = null;
            this.northwest = null;
            this.southeast = null;
            this.southwest = null;
            this.divided = false;
        }
    }
}

export { QuadTree, Boundary };