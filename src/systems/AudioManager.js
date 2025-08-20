/**
 * @fileoverview Audio Manager System for Space Invaders
 * Handles loading, playing, and managing game audio assets
 */

class AudioManager {
    /**
     * @constructor
     * Creates a new AudioManager instance
     */
    constructor() {
        this.sounds = new Map();
        this.musicTracks = new Map();
        this.masterVolume = 1.0;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.5;
        this.isMuted = false;
        this.currentMusic = null;
        this.audioContext = null;
        this.initialized = false;
    }

    /**
     * Initialize the audio context and system
     * @returns {Promise<void>}
     */
    async init() {
        try {
            // Create audio context on user interaction to comply with browser policies
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            
            // Create master gain node
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.connect(this.audioContext.destination);
            
            // Create separate gain nodes for music and SFX
            this.musicGainNode = this.audioContext.createGain();
            this.sfxGainNode = this.audioContext.createGain();
            
            // Connect gain nodes
            this.musicGainNode.connect(this.masterGainNode);
            this.sfxGainNode.connect(this.masterGainNode);
            
            this.updateVolumes();
        } catch (error) {
            console.error('Failed to initialize AudioManager:', error);
            this.initialized = false;
        }
    }

    /**
     * Load an audio file and store it in the appropriate collection
     * @param {string} id - Unique identifier for the sound
     * @param {string} url - URL of the audio file
     * @param {boolean} isMusic - Whether this is a music track or sound effect
     * @returns {Promise<void>}
     */
    async loadSound(id, url, isMusic = false) {
        if (!this.initialized) {
            throw new Error('AudioManager not initialized');
        }

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            if (isMusic) {
                this.musicTracks.set(id, audioBuffer);
            } else {
                this.sounds.set(id, audioBuffer);
            }
        } catch (error) {
            console.error(`Failed to load audio file ${id}:`, error);
            throw error;
        }
    }

    /**
     * Play a sound effect
     * @param {string} id - Identifier of the sound to play
     * @param {number} [volume=1.0] - Volume modifier for this specific sound
     * @returns {Promise<void>}
     */
    async playSound(id, volume = 1.0) {
        if (!this.initialized || this.isMuted) return;

        const sound = this.sounds.get(id);
        if (!sound) {
            console.warn(`Sound ${id} not found`);
            return;
        }

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = sound;
            source.connect(gainNode);
            gainNode.connect(this.sfxGainNode);
            
            gainNode.gain.value = volume;
            source.start(0);
        } catch (error) {
            console.error(`Failed to play sound ${id}:`, error);
        }
    }

    /**
     * Play background music
     * @param {string} id - Identifier of the music track
     * @param {boolean} [loop=true] - Whether to loop the music
     * @returns {Promise<void>}
     */
    async playMusic(id, loop = true) {
        if (!this.initialized || this.isMuted) return;

        const music = this.musicTracks.get(id);
        if (!music) {
            console.warn(`Music track ${id} not found`);
            return;
        }

        // Stop current music if playing
        if (this.currentMusic) {
            this.stopMusic();
        }

        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = music;
            source.loop = loop;
            source.connect(this.musicGainNode);
            source.start(0);
            
            this.currentMusic = source;
        } catch (error) {
            console.error(`Failed to play music ${id}:`, error);
        }
    }

    /**
     * Stop currently playing music
     */
    stopMusic() {
        if (this.currentMusic) {
            try {
                this.currentMusic.stop();
                this.currentMusic = null;
            } catch (error) {
                console.error('Failed to stop music:', error);
            }
        }
    }

    /**
     * Update all volume levels
     * @private
     */
    updateVolumes() {
        if (!this.initialized) return;

        const masterLevel = this.isMuted ? 0 : this.masterVolume;
        this.masterGainNode.gain.value = masterLevel;
        this.musicGainNode.gain.value = this.musicVolume;
        this.sfxGainNode.gain.value = this.sfxVolume;
    }

    /**
     * Set master volume level
     * @param {number} level - Volume level (0.0 to 1.0)
     */
    setMasterVolume(level) {
        this.masterVolume = Math.max(0, Math.min(1, level));
        this.updateVolumes();
    }

    /**
     * Set music volume level
     * @param {number} level - Volume level (0.0 to 1.0)
     */
    setMusicVolume(level) {
        this.musicVolume = Math.max(0, Math.min(1, level));
        this.updateVolumes();
    }

    /**
     * Set sound effects volume level
     * @param {number} level - Volume level (0.0 to 1.0)
     */
    setSFXVolume(level) {
        this.sfxVolume = Math.max(0, Math.min(1, level));
        this.updateVolumes();
    }

    /**
     * Toggle mute state
     * @returns {boolean} New mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateVolumes();
        return this.isMuted;
    }

    /**
     * Clean up and release resources
     */
    dispose() {
        this.stopMusic();
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.sounds.clear();
        this.musicTracks.clear();
        this.initialized = false;
    }
}

// Export singleton instance
const audioManager = new AudioManager();
export default audioManager;