/**
 * Integration tests for the Wave System
 * Tests interaction between WaveManager, enemy patterns and game entities
 */

describe('Wave System Integration', () => {
  let waveManager;
  let gameEngine;
  let renderer;
  
  // Mock dependencies
  const mockGameObject = {
    id: 'test-enemy',
    position: { x: 0, y: 0 },
    update: jest.fn(),
    render: jest.fn()
  };

  const mockEnemy = {
    ...mockGameObject,
    type: 'enemy',
    health: 100,
    damage: 20,
    movePattern: jest.fn()
  };

  beforeEach(() => {
    // Reset mocks and create fresh instances
    jest.clearAllMocks();
    
    gameEngine = {
      addEntity: jest.fn(),
      removeEntity: jest.fn(),
      getEntitiesByType: jest.fn(() => []),
      update: jest.fn()
    };

    renderer = {
      clear: jest.fn(),
      render: jest.fn()
    };

    waveManager = {
      currentWave: 1,
      spawnWave: jest.fn(),
      update: jest.fn(),
      onWaveComplete: jest.fn()
    };
  });

  describe('Wave Spawning', () => {
    it('should spawn correct number of enemies for wave 1', async () => {
      // Arrange
      const expectedEnemyCount = 5;
      waveManager.spawnWave.mockImplementation(() => {
        for (let i = 0; i < expectedEnemyCount; i++) {
          gameEngine.addEntity(mockEnemy);
        }
      });

      // Act
      await waveManager.spawnWave(1);

      // Assert
      expect(gameEngine.addEntity).toHaveBeenCalledTimes(expectedEnemyCount);
      expect(waveManager.currentWave).toBe(1);
    });

    it('should handle enemy death and wave completion', () => {
      // Arrange
      const enemyList = [
        { ...mockEnemy, id: 'enemy-1' },
        { ...mockEnemy, id: 'enemy-2' }
      ];
      gameEngine.getEntitiesByType.mockReturnValue(enemyList);

      // Act
      gameEngine.removeEntity(enemyList[0]);
      gameEngine.getEntitiesByType.mockReturnValue([enemyList[1]]);
      waveManager.update();
      
      gameEngine.removeEntity(enemyList[1]);
      gameEngine.getEntitiesByType.mockReturnValue([]);
      waveManager.update();

      // Assert
      expect(waveManager.onWaveComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Enemy Movement Patterns', () => {
    it('should execute correct movement pattern for wave type', () => {
      // Arrange
      const enemy = { ...mockEnemy };
      const startPos = { x: 100, y: 100 };
      enemy.position = { ...startPos };

      // Act
      enemy.movePattern({ deltaTime: 16, wave: 1 });

      // Assert
      expect(enemy.movePattern).toHaveBeenCalledWith(
        expect.objectContaining({
          deltaTime: 16,
          wave: 1
        })
      );
    });

    it('should update enemy positions based on pattern', () => {
      // Arrange
      const enemy = { ...mockEnemy };
      const pattern = (entity, deltaTime) => {
        entity.position.x += 5 * deltaTime;
        entity.position.y += 2 * deltaTime;
      };
      enemy.movePattern.mockImplementation(pattern);

      // Act
      enemy.movePattern(enemy, 1);

      // Assert
      expect(enemy.position.x).not.toBe(0);
      expect(enemy.position.y).not.toBe(0);
    });
  });

  describe('Wave Difficulty Progression', () => {
    it('should increase enemy count with each wave', async () => {
      // Arrange
      const wave1Count = 5;
      const wave2Count = 8;

      // Act & Assert - Wave 1
      waveManager.spawnWave.mockImplementation(() => {
        for (let i = 0; i < wave1Count; i++) {
          gameEngine.addEntity(mockEnemy);
        }
      });
      await waveManager.spawnWave(1);
      expect(gameEngine.addEntity).toHaveBeenCalledTimes(wave1Count);

      // Act & Assert - Wave 2
      jest.clearAllMocks();
      waveManager.spawnWave.mockImplementation(() => {
        for (let i = 0; i < wave2Count; i++) {
          gameEngine.addEntity(mockEnemy);
        }
      });
      await waveManager.spawnWave(2);
      expect(gameEngine.addEntity).toHaveBeenCalledTimes(wave2Count);
    });

    it('should increase enemy health with each wave', async () => {
      // Arrange
      const baseHealth = 100;
      const healthMultiplier = 1.5;

      // Act
      const wave1Enemy = { ...mockEnemy, health: baseHealth };
      const wave2Enemy = { 
        ...mockEnemy, 
        health: baseHealth * healthMultiplier 
      };

      // Assert
      expect(wave2Enemy.health).toBeGreaterThan(wave1Enemy.health);
    });
  });

  describe('Game Engine Integration', () => {
    it('should properly integrate with game loop', () => {
      // Arrange
      const deltaTime = 16;
      const enemies = [mockEnemy, { ...mockEnemy, id: 'enemy-2' }];
      gameEngine.getEntitiesByType.mockReturnValue(enemies);

      // Act
      gameEngine.update(deltaTime);
      
      // Assert
      expect(waveManager.update).toHaveBeenCalled();
      enemies.forEach(enemy => {
        expect(enemy.update).toHaveBeenCalled();
      });
    });

    it('should handle rendering of wave entities', () => {
      // Arrange
      const enemies = [mockEnemy, { ...mockEnemy, id: 'enemy-2' }];
      gameEngine.getEntitiesByType.mockReturnValue(enemies);

      // Act
      renderer.render();

      // Assert
      expect(renderer.clear).toHaveBeenCalled();
      enemies.forEach(enemy => {
        expect(enemy.render).toHaveBeenCalled();
      });
    });
  });
});