/**
 * @jest-environment jsdom
 */

describe('Player', () => {
    let player;
    let mockCanvas;
    let mockContext;
    let mockInputManager;

    beforeEach(() => {
        // Mock canvas and context
        mockContext = {
            drawImage: jest.fn(),
            fillRect: jest.fn(),
            clearRect: jest.fn()
        };
        
        mockCanvas = {
            width: 800,
            height: 600,
            getContext: () => mockContext
        };

        // Mock input manager
        mockInputManager = {
            isKeyPressed: jest.fn(),
            addKeyListener: jest.fn()
        };

        // Create fresh player instance before each test
        player = {
            x: 400,
            y: 550,
            width: 32,
            height: 32,
            speed: 5,
            health: 100,
            isAlive: true,
            lastShot: 0,
            shootCooldown: 250, // ms
            update: jest.fn(),
            render: jest.fn(),
            shoot: jest.fn(),
            takeDamage: jest.fn()
        };
    });

    describe('Movement', () => {
        test('should move left when left arrow is pressed', () => {
            mockInputManager.isKeyPressed.mockReturnValue(true);
            const initialX = player.x;
            
            player.update(mockInputManager);
            
            expect(player.x).toBeLessThan(initialX);
            expect(mockInputManager.isKeyPressed).toHaveBeenCalledWith('ArrowLeft');
        });

        test('should move right when right arrow is pressed', () => {
            mockInputManager.isKeyPressed.mockReturnValue(true);
            const initialX = player.x;
            
            player.update(mockInputManager);
            
            expect(player.x).toBeGreaterThan(initialX);
            expect(mockInputManager.isKeyPressed).toHaveBeenCalledWith('ArrowRight');
        });

        test('should not move beyond left boundary', () => {
            player.x = 0;
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'ArrowLeft');
            
            player.update(mockInputManager);
            
            expect(player.x).toBe(0);
        });

        test('should not move beyond right boundary', () => {
            player.x = mockCanvas.width - player.width;
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'ArrowRight');
            
            player.update(mockInputManager);
            
            expect(player.x).toBe(mockCanvas.width - player.width);
        });
    });

    describe('Shooting', () => {
        test('should shoot when space is pressed and cooldown elapsed', () => {
            const now = Date.now();
            jest.spyOn(Date, 'now').mockReturnValue(now);
            player.lastShot = now - player.shootCooldown - 1;
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'Space');

            player.update(mockInputManager);

            expect(player.shoot).toHaveBeenCalled();
            expect(player.lastShot).toBe(now);
        });

        test('should not shoot when cooldown has not elapsed', () => {
            const now = Date.now();
            jest.spyOn(Date, 'now').mockReturnValue(now);
            player.lastShot = now - player.shootCooldown + 100; // Not enough time passed
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'Space');

            player.update(mockInputManager);

            expect(player.shoot).not.toHaveBeenCalled();
        });
    });

    describe('Health and Damage', () => {
        test('should take damage and update health', () => {
            const initialHealth = player.health;
            const damage = 20;

            player.takeDamage(damage);

            expect(player.health).toBe(initialHealth - damage);
        });

        test('should die when health reaches 0', () => {
            player.health = 10;
            const damage = 20;

            player.takeDamage(damage);

            expect(player.isAlive).toBe(false);
            expect(player.health).toBe(0);
        });

        test('should not go below 0 health', () => {
            player.health = 10;
            const damage = 100;

            player.takeDamage(damage);

            expect(player.health).toBe(0);
        });
    });

    describe('Rendering', () => {
        test('should call render with correct context', () => {
            player.render(mockContext);

            expect(mockContext.drawImage).toHaveBeenCalled();
        });

        test('should not render if player is not alive', () => {
            player.isAlive = false;
            
            player.render(mockContext);

            expect(mockContext.drawImage).not.toHaveBeenCalled();
        });
    });

    describe('Collision Detection', () => {
        test('should detect collision with enemy projectile', () => {
            const projectile = {
                x: player.x + 5,
                y: player.y + 5,
                width: 5,
                height: 5
            };

            const collision = player.checkCollision(projectile);

            expect(collision).toBe(true);
        });

        test('should not detect collision when projectile is outside bounds', () => {
            const projectile = {
                x: player.x + player.width + 10,
                y: player.y + player.height + 10,
                width: 5,
                height: 5
            };

            const collision = player.checkCollision(projectile);

            expect(collision).toBe(false);
        });
    });
});