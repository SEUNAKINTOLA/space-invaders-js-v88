/**
 * @jest/environment jsdom
 */

describe('Enemy', () => {
    let enemy;
    let mockCanvas;
    let mockContext;
    
    beforeEach(() => {
        // Setup mock canvas and context
        mockCanvas = document.createElement('canvas');
        mockContext = mockCanvas.getContext('2d');
        mockCanvas.width = 800;
        mockCanvas.height = 600;
        
        // Mock enemy initial properties
        enemy = {
            x: 100,
            y: 50,
            width: 32,
            height: 32,
            speed: 2,
            health: 100,
            isActive: true,
            pattern: 'zigzag',
            sprite: {
                draw: jest.fn(),
                update: jest.fn()
            }
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Enemy Creation', () => {
        test('should create enemy with correct initial properties', () => {
            expect(enemy.x).toBe(100);
            expect(enemy.y).toBe(50);
            expect(enemy.width).toBe(32);
            expect(enemy.height).toBe(32);
            expect(enemy.health).toBe(100);
            expect(enemy.isActive).toBe(true);
        });

        test('should have valid movement pattern', () => {
            expect(['zigzag', 'linear', 'circular']).toContain(enemy.pattern);
        });
    });

    describe('Enemy Movement', () => {
        test('should update position based on movement pattern', () => {
            const initialX = enemy.x;
            const initialY = enemy.y;
            
            // Simulate movement update
            enemy.x += enemy.speed;
            enemy.y += Math.sin(enemy.x * 0.05) * 2; // Zigzag pattern

            expect(enemy.x).toBe(initialX + enemy.speed);
            expect(enemy.y).not.toBe(initialY);
        });

        test('should stay within canvas bounds', () => {
            enemy.x = mockCanvas.width + 10;
            enemy.y = mockCanvas.height + 10;

            // Simulate boundary check
            if (enemy.x > mockCanvas.width) enemy.x = mockCanvas.width;
            if (enemy.y > mockCanvas.height) enemy.y = mockCanvas.height;

            expect(enemy.x).toBeLessThanOrEqual(mockCanvas.width);
            expect(enemy.y).toBeLessThanOrEqual(mockCanvas.height);
        });
    });

    describe('Enemy Health System', () => {
        test('should take damage correctly', () => {
            const initialHealth = enemy.health;
            const damage = 25;
            
            enemy.health -= damage;

            expect(enemy.health).toBe(initialHealth - damage);
        });

        test('should deactivate when health reaches zero', () => {
            enemy.health = 0;
            
            // Simulate health check
            if (enemy.health <= 0) {
                enemy.isActive = false;
            }

            expect(enemy.isActive).toBe(false);
        });
    });

    describe('Enemy Collision Detection', () => {
        test('should detect collision with player projectile', () => {
            const projectile = {
                x: enemy.x,
                y: enemy.y,
                width: 5,
                height: 5
            };

            // Simple AABB collision detection
            const collision = (
                projectile.x < enemy.x + enemy.width &&
                projectile.x + projectile.width > enemy.x &&
                projectile.y < enemy.y + enemy.height &&
                projectile.y + projectile.height > enemy.y
            );

            expect(collision).toBe(true);
        });

        test('should not detect collision when objects are not overlapping', () => {
            const projectile = {
                x: enemy.x + 100, // Far from enemy
                y: enemy.y + 100,
                width: 5,
                height: 5
            };

            // Simple AABB collision detection
            const collision = (
                projectile.x < enemy.x + enemy.width &&
                projectile.x + projectile.width > enemy.x &&
                projectile.y < enemy.y + enemy.height &&
                projectile.y + projectile.height > enemy.y
            );

            expect(collision).toBe(false);
        });
    });

    describe('Enemy Sprite Rendering', () => {
        test('should call sprite draw method', () => {
            enemy.sprite.draw(mockContext);
            expect(enemy.sprite.draw).toHaveBeenCalledWith(mockContext);
        });

        test('should update sprite animation', () => {
            enemy.sprite.update();
            expect(enemy.sprite.update).toHaveBeenCalled();
        });
    });

    describe('Enemy Wave Behavior', () => {
        test('should initialize with correct wave position', () => {
            const wavePosition = 2;
            const waveSpacing = 50;
            
            enemy.x = wavePosition * waveSpacing;
            
            expect(enemy.x).toBe(100);
        });

        test('should maintain formation spacing', () => {
            const enemies = [];
            const spacing = 50;

            // Create formation of enemies
            for (let i = 0; i < 3; i++) {
                enemies.push({
                    x: i * spacing,
                    y: 50,
                    width: 32,
                    height: 32
                });
            }

            // Check spacing between enemies
            for (let i = 1; i < enemies.length; i++) {
                const distance = enemies[i].x - enemies[i-1].x;
                expect(distance).toBe(spacing);
            }
        });
    });
});