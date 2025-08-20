/**
 * ResizeObserver utility class for handling canvas resize events
 * Provides a wrapper around window resize events with debouncing and cleanup
 */
class ResizeObserver {
    /**
     * Creates a new ResizeObserver instance
     * @param {Function} callback - Function to call when resize occurs
     * @param {number} [debounceTime=250] - Debounce time in milliseconds
     */
    constructor(callback, debounceTime = 250) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        this.callback = callback;
        this.debounceTime = debounceTime;
        this.timeoutId = null;
        this.isActive = false;

        // Bind methods to preserve context
        this.handleResize = this.handleResize.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    /**
     * Debounced resize handler
     * @private
     */
    handleResize() {
        if (!this.isActive) return;

        // Clear any existing timeout
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
        }

        // Set new timeout
        this.timeoutId = window.setTimeout(() => {
            if (this.isActive) {
                try {
                    this.callback();
                } catch (error) {
                    console.error('Error in resize callback:', error);
                }
            }
        }, this.debounceTime);
    }

    /**
     * Start observing resize events
     * @returns {void}
     */
    start() {
        if (this.isActive) return;

        this.isActive = true;
        window.addEventListener('resize', this.handleResize, false);

        // Initial callback execution
        try {
            this.callback();
        } catch (error) {
            console.error('Error in initial resize callback:', error);
        }
    }

    /**
     * Stop observing resize events and cleanup
     * @returns {void}
     */
    stop() {
        if (!this.isActive) return;

        this.isActive = false;
        window.removeEventListener('resize', this.handleResize, false);

        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    /**
     * Force a resize event immediately
     * @returns {void}
     */
    forceResize() {
        if (!this.isActive) return;

        try {
            this.callback();
        } catch (error) {
            console.error('Error in forced resize callback:', error);
        }
    }

    /**
     * Check if the observer is currently active
     * @returns {boolean}
     */
    isObserving() {
        return this.isActive;
    }
}

export default ResizeObserver;