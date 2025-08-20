/**
 * @jest/environment jsdom
 */

describe('AudioManager', () => {
    let audioManager;
    let mockAudio;

    beforeEach(() => {
        // Mock the Audio API
        mockAudio = {
            play: jest.fn(),
            pause: jest.fn(),
            load: jest.fn(),
            volume: 0.5
        };
        global.Audio = jest.fn(() => mockAudio);
        
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('should initialize with default volume', () => {
            const defaultVolume = 0.5;
            audioManager = new AudioManager();
            expect(audioManager.getVolume()).toBe(defaultVolume);
        });

        test('should initialize with custom volume', () => {
            const customVolume = 0.7;
            audioManager = new AudioManager(customVolume);
            expect(audioManager.getVolume()).toBe(customVolume);
        });

        test('should clamp volume between 0 and 1', () => {
            const tooHighVolume = new AudioManager(1.5);
            expect(tooHighVolume.getVolume()).toBe(1.0);

            const tooLowVolume = new AudioManager(-0.5);
            expect(tooLowVolume.getVolume()).toBe(0.0);
        });
    });

    describe('sound management', () => {
        beforeEach(() => {
            audioManager = new AudioManager();
        });

        test('should load sound successfully', () => {
            const soundId = 'laser';
            const soundPath = 'assets/sounds/laser.mp3';
            
            audioManager.loadSound(soundId, soundPath);
            expect(global.Audio).toHaveBeenCalledWith(soundPath);
        });

        test('should play loaded sound', () => {
            const soundId = 'explosion';
            const soundPath = 'assets/sounds/explosion.mp3';
            
            audioManager.loadSound(soundId, soundPath);
            audioManager.playSound(soundId);
            
            expect(mockAudio.play).toHaveBeenCalled();
        });

        test('should throw error when playing unloaded sound', () => {
            expect(() => {
                audioManager.playSound('nonexistent');
            }).toThrow('Sound not loaded: nonexistent');
        });

        test('should stop sound playback', () => {
            const soundId = 'background';
            const soundPath = 'assets/sounds/background.mp3';
            
            audioManager.loadSound(soundId, soundPath);
            audioManager.playSound(soundId);
            audioManager.stopSound(soundId);
            
            expect(mockAudio.pause).toHaveBeenCalled();
            expect(mockAudio.load).toHaveBeenCalled();
        });
    });

    describe('volume control', () => {
        beforeEach(() => {
            audioManager = new AudioManager();
        });

        test('should set volume for all sounds', () => {
            const newVolume = 0.8;
            const soundId = 'test';
            const soundPath = 'assets/sounds/test.mp3';
            
            audioManager.loadSound(soundId, soundPath);
            audioManager.setVolume(newVolume);
            
            expect(mockAudio.volume).toBe(newVolume);
            expect(audioManager.getVolume()).toBe(newVolume);
        });

        test('should mute all sounds', () => {
            const soundId = 'test';
            const soundPath = 'assets/sounds/test.mp3';
            
            audioManager.loadSound(soundId, soundPath);
            audioManager.mute();
            
            expect(mockAudio.volume).toBe(0);
            expect(audioManager.isMuted()).toBe(true);
        });

        test('should unmute and restore previous volume', () => {
            const initialVolume = 0.5;
            const soundId = 'test';
            const soundPath = 'assets/sounds/test.mp3';
            
            audioManager.loadSound(soundId, soundPath);
            audioManager.setVolume(initialVolume);
            audioManager.mute();
            audioManager.unmute();
            
            expect(mockAudio.volume).toBe(initialVolume);
            expect(audioManager.isMuted()).toBe(false);
        });
    });

    describe('error handling', () => {
        beforeEach(() => {
            audioManager = new AudioManager();
        });

        test('should handle failed sound loading', () => {
            const soundId = 'error';
            const soundPath = 'invalid/path.mp3';
            
            mockAudio.onerror = jest.fn();
            audioManager.loadSound(soundId, soundPath);
            
            // Simulate error event
            mockAudio.onerror();
            
            expect(() => {
                audioManager.playSound(soundId);
            }).toThrow('Sound failed to load: error');
        });

        test('should handle invalid volume values', () => {
            expect(() => {
                audioManager.setVolume('invalid');
            }).toThrow('Volume must be a number between 0 and 1');
        });
    });

    describe('cleanup', () => {
        beforeEach(() => {
            audioManager = new AudioManager();
        });

        test('should properly dispose of all sounds', () => {
            const soundIds = ['sound1', 'sound2', 'sound3'];
            soundIds.forEach(id => {
                audioManager.loadSound(id, `assets/sounds/${id}.mp3`);
            });

            audioManager.dispose();
            
            soundIds.forEach(id => {
                expect(() => {
                    audioManager.playSound(id);
                }).toThrow(`Sound not loaded: ${id}`);
            });
        });
    });
});