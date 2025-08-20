/**
 * @jest-environment jsdom
 */

describe('WaveManager', () => {
  let waveManager;
  let mockGameEngine;
  let mockEnemyPattern;

  beforeEach(() => {
    // Mock game engine
    mockGameEngine = {
      addEntity: jest.fn(),
      removeEntity: jest.fn(),
      getCanvas: () => ({
        width: 800,
        height: 600
      })
    };

    // Mock enemy pattern
    mockEnemyPattern = {
      getFormation: jest.fn(),
      calculatePositions: jest.fn()
    };

    // Initialize wave manager with mocks
    waveManager = new WaveManager(mockGameEngine);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Wave Generation', () => {
    test('should initialize with correct default values', () => {
      expect(waveManager.currentWave).toBe(0);
      expect(waveManager.isWaveActive).toBeFalsy();
      expect(waveManager.enemies).toEqual([]);
    });

    test('should generate new wave with correct number of enemies', () => {
      const waveNumber = 1;
      waveManager.generateWave(waveNumber);

      const expectedEnemyCount = 5 + (waveNumber * 2); // Example wave scaling
      expect(mockGameEngine.addEntity).toHaveBeenCalledTimes(expectedEnemyCount);
    });

    test('should increase difficulty with each wave', () => {
      waveManager.generateWave(1);
      const wave1Speed = waveManager.enemies[0].speed;

      waveManager.generateWave(2);
      const wave2Speed = waveManager.enemies[0].speed;

      expect(wave2Speed).toBeGreaterThan(wave1Speed);
    });
  });

  describe('Wave Management', () => {
    test('should track active enemies correctly', () => {
      waveManager.generateWave(1);
      const initialEnemyCount = waveManager.enemies.length;
      
      waveManager.removeEnemy(waveManager.enemies[0]);
      
      expect(waveManager.enemies.length).toBe(initialEnemyCount - 1);
    });

    test('should trigger next wave when all enemies are defeated', () => {
      const nextWaveSpy = jest.spyOn(waveManager, 'generateWave');
      waveManager.generateWave(1);
      
      // Simulate defeating all enemies
      while (waveManager.enemies.length > 0) {
        waveManager.removeEnemy(waveManager.enemies[0]);
      }

      expect(nextWaveSpy).toHaveBeenCalledWith(2);
    });

    test('should handle wave completion callback', () => {
      const mockCallback = jest.fn();
      waveManager.onWaveComplete(mockCallback);
      
      waveManager.generateWave(1);
      
      // Simulate defeating all enemies
      while (waveManager.enemies.length > 0) {
        waveManager.removeEnemy(waveManager.enemies[0]);
      }

      expect(mockCallback).toHaveBeenCalledWith(1);
    });
  });

  describe('Enemy Patterns', () => {
    test('should position enemies according to pattern', () => {
      const mockPositions = [
        { x: 100, y: 100 },
        { x: 200, y: 100 }
      ];
      
      mockEnemyPattern.calculatePositions.mockReturnValue(mockPositions);
      waveManager.setPattern(mockEnemyPattern);
      waveManager.generateWave(1);

      expect(mockEnemyPattern.calculatePositions).toHaveBeenCalled();
      expect(waveManager.enemies[0].position).toEqual(mockPositions[0]);
    });

    test('should update enemy formations during wave', () => {
      waveManager.setPattern(mockEnemyPattern);
      waveManager.generateWave(1);
      
      const newFormation = 'circle';
      mockEnemyPattern.getFormation.mockReturnValue(newFormation);
      
      waveManager.updateFormation();
      
      expect(mockEnemyPattern.getFormation).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid wave numbers', () => {
      expect(() => waveManager.generateWave(-1)).toThrow('Invalid wave number');
      expect(() => waveManager.generateWave(0)).toThrow('Invalid wave number');
    });

    test('should handle missing pattern configuration', () => {
      waveManager.setPattern(null);
      expect(() => waveManager.generateWave(1)).toThrow('No pattern configured');
    });
  });

  describe('Performance', () => {
    test('should efficiently handle large number of enemies', () => {
      const startTime = performance.now();
      waveManager.generateWave(10); // Large wave
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });
  });
});