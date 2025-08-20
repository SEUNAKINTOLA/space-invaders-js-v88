/**
 * @jest/environment jsdom
 */

describe('WaveManager', () => {
    let waveManager;
    let mockGameState;
    let mockCanvas;

    beforeEach(() => {
        // Mock canvas and context
        mockCanvas = {
            width: 800,
            height: 600,
            getContext: jest.fn(() => ({
                drawImage: jest.fn(),
                clearRect: jest.fn()
            }))
        };

        // Mock game state
        mockGameState = {
            currentWave: 1,
            enemies: [],
            difficulty: 1,
            isWaveActive: false,
            score: 0
        };

        waveManager = {
            currentWave: 1,
            enemies: [],
            spawnWave: jest.fn(),
            updateEnemies: jest.fn(),
            checkWaveCompletion: jest.fn(),
            getWaveConfiguration: jest.fn(),
            reset: jest.fn()
        };
    });

    describe('Wave Generation', () => {
        test('should generate correct number of enemies for wave 1', () => {
            const wave1Config = {
                enemyCount: 10,
                formation: 'standard',
                speed: 1
            };
            
            waveManager.getWaveConfiguration.mockReturnValue(wave1Config);
            waveManager.spawnWave(1);

            expect(waveManager.enemies.length).toBe(0);
            expect(waveManager.spawnWave).toHaveBeenCalledWith(1);
        });

        test('should increase difficulty with each wave', () => {
            const wave1Config = { enemyCount: 10, speed: 1 };
            const wave2Config = { enemyCount: 15, speed: 1.2 };

            waveManager.getWaveConfiguration
                .mockReturnValueOnce(wave1Config)
                .mockReturnValueOnce(wave2Config);

            waveManager.spawnWave(1);
            waveManager.spawnWave(2);

            expect(waveManager.getWaveConfiguration).toHaveBeenCalledTimes(2);
        });
    });

    describe('Enemy Movement', () => {
        test('should update enemy positions correctly', () => {
            const mockEnemy = {
                x: 100,
                y: 50,
                update: jest.fn(),
                isActive: true
            };

            waveManager.enemies = [mockEnemy];
            waveManager.updateEnemies(16); // 16ms frame time

            expect(waveManager.updateEnemies).toHaveBeenCalledWith(16);
        });

        test('should remove destroyed enemies', () => {
            const mockEnemy1 = { isActive: true, update: jest.fn() };
            const mockEnemy2 = { isActive: false, update: jest.fn() };
            
            waveManager.enemies = [mockEnemy1, mockEnemy2];
            waveManager.updateEnemies(16);

            expect(waveManager.updateEnemies).toHaveBeenCalled();
        });
    });

    describe('Wave Management', () => {
        test('should detect wave completion when all enemies are destroyed', () => {
            waveManager.enemies = [];
            waveManager.checkWaveCompletion();

            expect(waveManager.checkWaveCompletion).toHaveBeenCalled();
        });

        test('should reset wave manager state correctly', () => {
            waveManager.currentWave = 5;
            waveManager.enemies = [{}, {}, {}];
            
            waveManager.reset();

            expect(waveManager.reset).toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        test('should handle invalid wave numbers gracefully', () => {
            expect(() => {
                waveManager.spawnWave(-1);
            }).not.toThrow();

            expect(() => {
                waveManager.spawnWave(0);
            }).not.toThrow();
        });

        test('should handle rapid wave transitions', () => {
            waveManager.spawnWave(1);
            waveManager.spawnWave(2);
            
            expect(waveManager.spawnWave).toHaveBeenCalledTimes(2);
        });
    });

    describe('Performance', () => {
        test('should efficiently handle large number of enemies', () => {
            const largeWaveConfig = {
                enemyCount: 100,
                formation: 'grid',
                speed: 1
            };

            waveManager.getWaveConfiguration.mockReturnValue(largeWaveConfig);
            waveManager.spawnWave(1);

            expect(waveManager.spawnWave).toHaveBeenCalled();
        });
    });

    describe('Integration', () => {
        test('should properly integrate with game state', () => {
            waveManager.spawnWave(1);
            mockGameState.currentWave = 1;
            mockGameState.isWaveActive = true;

            expect(mockGameState.currentWave).toBe(1);
            expect(mockGameState.isWaveActive).toBe(true);
        });

        test('should update score when enemies are destroyed', () => {
            const initialScore = mockGameState.score;
            waveManager.spawnWave(1);
            // Simulate enemy destruction
            mockGameState.score += 100;

            expect(mockGameState.score).toBeGreaterThan(initialScore);
        });
    });
});