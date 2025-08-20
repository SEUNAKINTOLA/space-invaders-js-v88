/**
 * @fileoverview Touch input handler for Space Invaders game
 * Manages touch events and gesture recognition for game controls
 */

/**
 * Represents a touch input point with coordinates and identifier
 * @typedef {Object} TouchPoint
 * @property {number} identifier - Unique touch identifier
 * @property {number} x - X coordinate of touch
 * @property {number} y - Y coordinate of touch
 * @property {number} startX - Initial X coordinate when touch started
 * @property {number} startY - Initial Y coordinate when touch started
 */

/**
 * Handles touch input events and gesture recognition
 */
export class TouchInput {
    /**
     * Creates a new TouchInput instance
     * @param {HTMLElement} element - DOM element to attach touch listeners to
     */
    constructor(element) {
        if (!element) {
            throw new Error('TouchInput requires a valid DOM element');
        }

        /** @private {HTMLElement} */
        this.element = element;

        /** @private {Map<number, TouchPoint>} */
        this.activeTouches = new Map();

        /** @private {Set<Function>} */
        this.moveListeners = new Set();
        
        /** @private {Set<Function>} */
        this.tapListeners = new Set();

        /** @private {Object} */
        this.config = {
            tapThreshold: 10, // Maximum pixel movement to still count as tap
            doubleTapDelay: 300, // Milliseconds between taps to count as double tap
        };

        /** @private {number} */
        this.lastTapTime = 0;

        this.bindEvents();
    }

    /**
     * @private
     * Binds touch event listeners
     */
    bindEvents() {
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });
    }

    /**
     * @private
     * Handles touch start events
     * @param {TouchEvent} event 
     */
    handleTouchStart(event) {
        event.preventDefault();
        
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            this.activeTouches.set(touch.identifier, {
                identifier: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                startX: touch.clientX,
                startY: touch.clientY
            });
        }
    }

    /**
     * @private
     * Handles touch move events
     * @param {TouchEvent} event 
     */
    handleTouchMove(event) {
        event.preventDefault();
        
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const activeTouch = this.activeTouches.get(touch.identifier);
            
            if (activeTouch) {
                activeTouch.x = touch.clientX;
                activeTouch.y = touch.clientY;
                
                this.moveListeners.forEach(listener => {
                    listener({
                        identifier: touch.identifier,
                        x: touch.clientX,
                        y: touch.clientY,
                        deltaX: touch.clientX - activeTouch.startX,
                        deltaY: touch.clientY - activeTouch.startY
                    });
                });
            }
        }
    }

    /**
     * @private
     * Handles touch end events
     * @param {TouchEvent} event 
     */
    handleTouchEnd(event) {
        event.preventDefault();
        
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const activeTouch = this.activeTouches.get(touch.identifier);
            
            if (activeTouch) {
                const deltaX = touch.clientX - activeTouch.startX;
                const deltaY = touch.clientY - activeTouch.startY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance <= this.config.tapThreshold) {
                    const now = Date.now();
                    const isDoubleTap = (now - this.lastTapTime) <= this.config.doubleTapDelay;
                    
                    this.tapListeners.forEach(listener => {
                        listener({
                            x: touch.clientX,
                            y: touch.clientY,
                            isDoubleTap
                        });
                    });
                    
                    this.lastTapTime = now;
                }
                
                this.activeTouches.delete(touch.identifier);
            }
        }
    }

    /**
     * @private
     * Handles touch cancel events
     * @param {TouchEvent} event 
     */
    handleTouchCancel(event) {
        event.preventDefault();
        
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            this.activeTouches.delete(touches[i].identifier);
        }
    }

    /**
     * Adds a touch move event listener
     * @param {Function} listener - Callback function for touch move events
     */
    onTouchMove(listener) {
        if (typeof listener === 'function') {
            this.moveListeners.add(listener);
        }
    }

    /**
     * Adds a tap event listener
     * @param {Function} listener - Callback function for tap events
     */
    onTap(listener) {
        if (typeof listener === 'function') {
            this.tapListeners.add(listener);
        }
    }

    /**
     * Removes a touch move event listener
     * @param {Function} listener - Listener to remove
     */
    removeTouchMoveListener(listener) {
        this.moveListeners.delete(listener);
    }

    /**
     * Removes a tap event listener
     * @param {Function} listener - Listener to remove
     */
    removeTapListener(listener) {
        this.tapListeners.delete(listener);
    }

    /**
     * Cleans up all event listeners
     */
    destroy() {
        this.element.removeEventListener('touchstart', this.handleTouchStart);
        this.element.removeEventListener('touchmove', this.handleTouchMove);
        this.element.removeEventListener('touchend', this.handleTouchEnd);
        this.element.removeEventListener('touchcancel', this.handleTouchCancel);
        
        this.moveListeners.clear();
        this.tapListeners.clear();
        this.activeTouches.clear();
    }
}