/**
 * @jest-environment jsdom
 */

describe('PlayerController Tests', () => {
    let playerController;
    let mockPlayer;
    let mockInputManager;
    let mockAudioManager;
    
    // Mock constants that would normally come from PlayerConstants
    const MOCK_CONSTANTS = {
        MOVE_SPEED: 5,
        SHOOT_COOLDOWN: 250,
        PLAYER_WIDTH: 32,
        PLAYER_HEIGHT: 32
    };

    beforeEach(() => {
        // Setup mocks
        mockPlayer = {
            position: { x: 400, y: 500 },
            width: MOCK_CONSTANTS.PLAYER_WIDTH,
            height: MOCK_CONSTANTS.PLAYER_HEIGHT,
            shoot: jest.fn(),
            move: jest.fn(),
            update: jest.fn()
        };

        mockInputManager = {
            isKeyPressed: jest.fn(),
            getMousePosition: jest.fn()
        };

        mockAudioManager = {
            playSound: jest.fn()
        };

        // Create controller instance with mocks
        playerController = {
            player: mockPlayer,
            inputManager: mockInputManager,
            audioManager: mockAudioManager,
            lastShootTime: 0,
            update: jest.fn(),
            handleMovement: jest.fn(),
            handleShooting: jest.fn()
        };
    });

    describe('Movement Tests', () => {
        test('should move player left when left key is pressed', () => {
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'ArrowLeft');
            
            playerController.handleMovement();
            
            expect(mockPlayer.move).toHaveBeenCalledWith(-MOCK_CONSTANTS.MOVE_SPEED, 0);
        });

        test('should move player right when right key is pressed', () => {
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'ArrowRight');
            
            playerController.handleMovement();
            
            expect(mockPlayer.move).toHaveBeenCalledWith(MOCK_CONSTANTS.MOVE_SPEED, 0);
        });

        test('should not move player when no movement keys are pressed', () => {
            mockInputManager.isKeyPressed.mockReturnValue(false);
            
            playerController.handleMovement();
            
            expect(mockPlayer.move).not.toHaveBeenCalled();
        });

        test('should prevent player from moving outside game bounds', () => {
            const GAME_WIDTH = 800;
            mockPlayer.position.x = GAME_WIDTH - MOCK_CONSTANTS.PLAYER_WIDTH;
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'ArrowRight');
            
            playerController.handleMovement();
            
            expect(mockPlayer.position.x).toBeLessThanOrEqual(GAME_WIDTH - MOCK_CONSTANTS.PLAYER_WIDTH);
        });
    });

    describe('Shooting Tests', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should shoot when space is pressed and cooldown is complete', () => {
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'Space');
            
            playerController.handleShooting();
            
            expect(mockPlayer.shoot).toHaveBeenCalled();
            expect(mockAudioManager.playSound).toHaveBeenCalledWith('shoot');
        });

        test('should not shoot when space is pressed during cooldown', () => {
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'Space');
            
            // First shot
            playerController.handleShooting();
            
            // Attempt second shot before cooldown
            playerController.handleShooting();
            
            expect(mockPlayer.shoot).toHaveBeenCalledTimes(1);
        });

        test('should allow shooting after cooldown period', () => {
            mockInputManager.isKeyPressed.mockImplementation(key => key === 'Space');
            
            // First shot
            playerController.handleShooting();
            
            // Advance time past cooldown
            jest.advanceTimersByTime(MOCK_CONSTANTS.SHOOT_COOLDOWN + 1);
            
            // Second shot
            playerController.handleShooting();
            
            expect(mockPlayer.shoot).toHaveBeenCalledTimes(2);
        });
    });

    describe('Update Loop Tests', () => {
        test('should call handleMovement and handleShooting in update', () => {
            playerController.update();
            
            expect(playerController.handleMovement).toHaveBeenCalled();
            expect(playerController.handleShooting).toHaveBeenCalled();
        });

        test('should update player position', () => {
            playerController.update();
            
            expect(mockPlayer.update).toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        test('should handle multiple keys pressed simultaneously', () => {
            mockInputManager.isKeyPressed.mockImplementation(key => 
                ['ArrowLeft', 'Space'].includes(key)
            );
            
            playerController.handleMovement();
            playerController.handleShooting();
            
            expect(mockPlayer.move).toHaveBeenCalled();
            expect(mockPlayer.shoot).toHaveBeenCalled();
        });

        test('should handle rapid key presses', () => {
            for (let i = 0; i < 10; i++) {
                mockInputManager.isKeyPressed.mockImplementation(key => key === 'ArrowRight');
                playerController.handleMovement();
            }
            
            expect(mockPlayer.move).toHaveBeenCalledTimes(10);
        });
    });
});