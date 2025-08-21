/**
 * PlayerController.js
 * Handles player input and movement controls for the Space Invaders game
 */

class PlayerController {
    /**
     * @param {Object} player - The player entity to control
     * @param {Object} inputManager - The input manager instance
     * @param {Object} gameConfig - Configuration object for player controls
     */
    constructor(player, inputManager, gameConfig) {
        this.player = player;
        this.inputManager = inputManager;
        this.config = gameConfig;
        
        // Control state
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.canShoot = true;
        this.lastShootTime = 0;
        
        // Bind methods to maintain context
        this.update = this.update.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Initialize input listeners
        this.initializeControls();
    }

    /**
     * Sets up input event listeners
     * @private
     */
    initializeControls() {
        this.inputManager.addKeyDownListener(this.handleKeyDown);
        this.inputManager.addKeyUpListener(this.handleKeyUp);
    }

    /**
     * Handles keydown events
     * @param {string} key - The key that was pressed
     * @private
     */
    handleKeyDown(key) {
        switch (key) {
            case 'ArrowLeft':
            case 'a':
                this.isMovingLeft = true;
                break;
            case 'ArrowRight':
            case 'd':
                this.isMovingRight = true;
                break;
            case 'Space':
            case ' ':
                this.tryShoot();
                break;
        }
    }

    /**
     * Handles keyup events
     * @param {string} key - The key that was released
     * @private
     */
    handleKeyUp(key) {
        switch (key) {
            case 'ArrowLeft':
            case 'a':
                this.isMovingLeft = false;
                break;
            case 'ArrowRight':
            case 'd':
                this.isMovingRight = false;
                break;
        }
    }

    /**
     * Attempts to shoot if cooldown has elapsed
     * @private
     */
    tryShoot() {
        const currentTime = Date.now();
        if (this.canShoot && currentTime - this.lastShootTime >= this.config.shootCooldown) {
            this.player.shoot();
            this.lastShootTime = currentTime;
        }
    }

    /**
     * Updates player position based on current input state
     * @param {number} deltaTime - Time elapsed since last update
     */
    update(deltaTime) {
        // Calculate movement
        let moveDirection = 0;
        if (this.isMovingLeft) moveDirection -= 1;
        if (this.isMovingRight) moveDirection += 1;

        // Apply movement with boundary checking
        const newX = this.player.x + (moveDirection * this.config.moveSpeed * deltaTime);
        const minX = 0;
        const maxX = this.config.gameWidth - this.player.width;

        this.player.x = Math.max(minX, Math.min(maxX, newX));
    }

    /**
     * Cleans up event listeners
     */
    destroy() {
        this.inputManager.removeKeyDownListener(this.handleKeyDown);
        this.inputManager.removeKeyUpListener(this.handleKeyUp);
    }

    /**
     * Enables or disables shooting ability
     * @param {boolean} enabled - Whether shooting should be enabled
     */
    setShootingEnabled(enabled) {
        this.canShoot = enabled;
    }

    /**
     * Resets controller state
     */
    reset() {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.canShoot = true;
        this.lastShootTime = 0;
    }
}

export default PlayerController;