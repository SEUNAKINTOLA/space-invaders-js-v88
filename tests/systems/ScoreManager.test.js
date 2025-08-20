/**
 * @jest-environment jsdom
 */

describe('ScoreManager', () => {
    let scoreManager;
    let mockAudioManager;

    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '<div id="score">0</div>';
        
        // Mock AudioManager
        mockAudioManager = {
            playSound: jest.fn()
        };

        // Create fresh ScoreManager instance for each test
        scoreManager = {
            currentScore: 0,
            highScore: 0,
            scoreElement: document.getElementById('score'),
            audioManager: mockAudioManager,
            
            initialize() {
                this.currentScore = 0;
                this.highScore = localStorage.getItem('highScore') || 0;
                this.updateDisplay();
            },

            addPoints(points) {
                this.currentScore += points;
                this.updateDisplay();
                this.checkHighScore();
                this.audioManager.playSound('score');
            },

            updateDisplay() {
                if (this.scoreElement) {
                    this.scoreElement.textContent = this.currentScore;
                }
            },

            checkHighScore() {
                if (this.currentScore > this.highScore) {
                    this.highScore = this.currentScore;
                    localStorage.setItem('highScore', this.highScore);
                    this.audioManager.playSound('highscore');
                }
            },

            reset() {
                this.currentScore = 0;
                this.updateDisplay();
            },

            getScore() {
                return this.currentScore;
            },

            getHighScore() {
                return this.highScore;
            }
        };
    });

    afterEach(() => {
        // Clean up localStorage after each test
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('should initialize with score of 0', () => {
            scoreManager.initialize();
            expect(scoreManager.getScore()).toBe(0);
        });

        test('should load high score from localStorage', () => {
            localStorage.setItem('highScore', '1000');
            scoreManager.initialize();
            expect(scoreManager.getHighScore()).toBe('1000');
        });
    });

    describe('score management', () => {
        test('should correctly add points', () => {
            scoreManager.initialize();
            scoreManager.addPoints(100);
            expect(scoreManager.getScore()).toBe(100);
        });

        test('should update display when adding points', () => {
            scoreManager.initialize();
            scoreManager.addPoints(50);
            expect(document.getElementById('score').textContent).toBe('50');
        });

        test('should play score sound when points are added', () => {
            scoreManager.initialize();
            scoreManager.addPoints(100);
            expect(mockAudioManager.playSound).toHaveBeenCalledWith('score');
        });
    });

    describe('high score handling', () => {
        test('should update high score when current score exceeds it', () => {
            localStorage.setItem('highScore', '100');
            scoreManager.initialize();
            scoreManager.addPoints(150);
            expect(scoreManager.getHighScore()).toBe(150);
        });

        test('should save high score to localStorage', () => {
            scoreManager.initialize();
            scoreManager.addPoints(200);
            expect(localStorage.getItem('highScore')).toBe('200');
        });

        test('should play high score sound when high score is beaten', () => {
            scoreManager.initialize();
            scoreManager.addPoints(500);
            expect(mockAudioManager.playSound).toHaveBeenCalledWith('highscore');
        });

        test('should not update high score when current score is lower', () => {
            localStorage.setItem('highScore', '1000');
            scoreManager.initialize();
            scoreManager.addPoints(500);
            expect(scoreManager.getHighScore()).toBe('1000');
        });
    });

    describe('reset functionality', () => {
        test('should reset score to 0', () => {
            scoreManager.initialize();
            scoreManager.addPoints(100);
            scoreManager.reset();
            expect(scoreManager.getScore()).toBe(0);
        });

        test('should update display when reset', () => {
            scoreManager.initialize();
            scoreManager.addPoints(100);
            scoreManager.reset();
            expect(document.getElementById('score').textContent).toBe('0');
        });

        test('should maintain high score after reset', () => {
            scoreManager.initialize();
            scoreManager.addPoints(1000);
            const highScore = scoreManager.getHighScore();
            scoreManager.reset();
            expect(scoreManager.getHighScore()).toBe(highScore);
        });
    });

    describe('error handling', () => {
        test('should handle missing score element gracefully', () => {
            document.body.innerHTML = ''; // Remove score element
            scoreManager.initialize();
            expect(() => scoreManager.addPoints(100)).not.toThrow();
        });

        test('should handle invalid point values', () => {
            scoreManager.initialize();
            scoreManager.addPoints('invalid');
            expect(scoreManager.getScore()).toBe(0);
        });
    });
});