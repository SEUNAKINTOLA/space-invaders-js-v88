/**
 * @fileoverview Volume Control UI component for managing game audio levels
 * Provides a user interface for controlling master volume and individual sound categories
 */

class VolumeControl {
    /**
     * @param {Object} config - Configuration object
     * @param {number} config.initialVolume - Initial volume level (0-1)
     * @param {Function} config.onVolumeChange - Callback when volume changes
     * @param {HTMLElement} config.container - Container element to append volume control
     */
    constructor(config = {}) {
        this.volume = config.initialVolume || 1.0;
        this.onVolumeChange = config.onVolumeChange || (() => {});
        this.container = config.container || document.body;
        
        // Bound methods
        this.handleVolumeInput = this.handleVolumeInput.bind(this);
        this.handleMuteToggle = this.handleMuteToggle.bind(this);
        
        // State
        this.isMuted = false;
        this.previousVolume = this.volume;
        
        this.initialize();
    }

    /**
     * Creates and initializes the volume control UI elements
     * @private
     */
    initialize() {
        // Create container
        this.controlContainer = document.createElement('div');
        this.controlContainer.className = 'volume-control';
        
        // Create slider
        this.volumeSlider = document.createElement('input');
        this.volumeSlider.type = 'range';
        this.volumeSlider.min = '0';
        this.volumeSlider.max = '1';
        this.volumeSlider.step = '0.1';
        this.volumeSlider.value = this.volume;
        this.volumeSlider.className = 'volume-slider';
        
        // Create mute button
        this.muteButton = document.createElement('button');
        this.muteButton.className = 'volume-mute-btn';
        this.updateMuteButtonIcon();
        
        // Create volume label
        this.volumeLabel = document.createElement('span');
        this.volumeLabel.className = 'volume-label';
        this.updateVolumeLabel();
        
        // Add event listeners
        this.volumeSlider.addEventListener('input', this.handleVolumeInput);
        this.muteButton.addEventListener('click', this.handleMuteToggle);
        
        // Append elements
        this.controlContainer.appendChild(this.muteButton);
        this.controlContainer.appendChild(this.volumeSlider);
        this.controlContainer.appendChild(this.volumeLabel);
        this.container.appendChild(this.controlContainer);
    }

    /**
     * Handles volume slider input events
     * @param {Event} event - Input event
     * @private
     */
    handleVolumeInput(event) {
        const newVolume = parseFloat(event.target.value);
        this.setVolume(newVolume);
    }

    /**
     * Handles mute button click events
     * @private
     */
    handleMuteToggle() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    /**
     * Sets the volume level
     * @param {number} value - Volume level (0-1)
     * @public
     */
    setVolume(value) {
        // Validate and clamp volume value
        this.volume = Math.max(0, Math.min(1, value));
        
        // Update UI
        this.volumeSlider.value = this.volume;
        this.updateVolumeLabel();
        
        // If volume is set to 0, update mute state
        this.isMuted = this.volume === 0;
        this.updateMuteButtonIcon();
        
        // Trigger callback
        this.onVolumeChange(this.volume);
    }

    /**
     * Mutes the volume
     * @public
     */
    mute() {
        this.previousVolume = this.volume;
        this.isMuted = true;
        this.setVolume(0);
        this.updateMuteButtonIcon();
    }

    /**
     * Unmutes the volume
     * @public
     */
    unmute() {
        this.isMuted = false;
        this.setVolume(this.previousVolume);
        this.updateMuteButtonIcon();
    }

    /**
     * Updates the mute button icon based on mute state
     * @private
     */
    updateMuteButtonIcon() {
        this.muteButton.textContent = this.isMuted ? '🔇' : '🔊';
    }

    /**
     * Updates the volume label display
     * @private
     */
    updateVolumeLabel() {
        const percentage = Math.round(this.volume * 100);
        this.volumeLabel.textContent = `${percentage}%`;
    }

    /**
     * Gets the current volume level
     * @returns {number} Current volume level (0-1)
     * @public
     */
    getVolume() {
        return this.volume;
    }

    /**
     * Checks if audio is currently muted
     * @returns {boolean} Mute state
     * @public
     */
    getMuted() {
        return this.isMuted;
    }

    /**
     * Removes the volume control from the DOM and cleans up event listeners
     * @public
     */
    destroy() {
        this.volumeSlider.removeEventListener('input', this.handleVolumeInput);
        this.muteButton.removeEventListener('click', this.handleMuteToggle);
        this.controlContainer.remove();
    }
}

export default VolumeControl;