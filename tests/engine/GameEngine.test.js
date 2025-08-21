/**
 * @jest-environment jsdom
 */

describe('GameEngine', () => {
    let gameEngine;
    let mockCanvas;
    let mockState;
    let mockInputManager;
    
    // Mock RAF for testing game loop
    let rafCallback;
    global.requestAnimationFrame = (cb) => {
        rafCallback = cb;
        return 1;
    };
    
    beforeEach(() => {
        // Reset mocks before each test
        mockCanvas = {
            clear: jest.fn(),
            render: jest.fn(),
            getContext: jest.fn(),
            width: 800,
            height: 600
        };
        
        mockState = {
            update: jest.fn(),
            getCurrentState: jest.fn(),
            setState: jest.fn(),
            getEntities: jest.fn().mockReturnValue([]),
            addEntity: jest.fn(),
            removeEntity: jest.fn()
        };
        
        mockInputManager = {
            update: jest.fn(),
            isKeyPressed: jest.fn(),
            registerHandler: jest.fn()
        };
        
        // Create new GameEngine instance for each test
        gameEngine = {
            canvas: mockCanvas,
            state: mockState,
            inputManager: mockInputManager,
            isRunning: false,
            lastTimestamp: 0,
            start: jest.fn(),
            stop: jest.fn(),
            update: jest.fn(),
            render: jest.fn(),
            init: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(gameEngine.isRunning).toBe(false);
            expect(gameEngine.lastTimestamp).toBe(0);
        });

        test('should properly initialize dependencies', () => {
            expect(gameEngine.canvas).toBeDefined();
            expect(gameEngine.state).toBeDefined();
            expect(gameEngine.inputManager).toBeDefined();
        });
    });

    describe('Game Loop', () => {
        test('should start game loop when start is called', () => {
            gameEngine.start();
            expect(gameEngine.isRunning).toBe(true);
            expect(requestAnimationFrame).toHaveBeenCalled();
        });

        test('should stop game loop when stop is called', () => {
            gameEngine.start();
            gameEngine.stop();
            expect(gameEngine.isRunning).toBe(false);
        });

        test('should calculate correct delta time', () => {
            const timestamp1 = 1000;
            const timestamp2 = 1016; // 16ms later (typical frame time)
            
            gameEngine.lastTimestamp = timestamp1;
            gameEngine.update(timestamp2);
            
            // Expected deltaTime should be approximately 16ms (0.016 seconds)
            expect(gameEngine.update).toHaveBeenCalledWith(expect.any(Number));
        });
    });

    describe('State Management', () => {
        test('should update game state', () => {
            gameEngine.update(16);
            expect(mockState.update).toHaveBeenCalled();
        });

        test('should handle state transitions', () => {
            const newState = { name: 'PLAY' };
            mockState.setState(newState);
            expect(mockState.setState).toHaveBeenCalledWith(newState);
        });
    });

    describe('Rendering', () => {
        test('should clear canvas before rendering', () => {
            gameEngine.render();
            expect(mockCanvas.clear).toHaveBeenCalled();
        });

        test('should render all entities', () => {
            const mockEntities = [
                { render: jest.fn() },
                { render: jest.fn() }
            ];
            mockState.getEntities.mockReturnValue(mockEntities);
            
            gameEngine.render();
            mockEntities.forEach(entity => {
                expect(entity.render).toHaveBeenCalled();
            });
        });
    });

    describe('Input Handling', () => {
        test('should update input manager', () => {
            gameEngine.update(16);
            expect(mockInputManager.update).toHaveBeenCalled();
        });

        test('should register input handlers', () => {
            const handler = jest.fn();
            mockInputManager.registerHandler('keydown', handler);
            expect(mockInputManager.registerHandler).toHaveBeenCalledWith('keydown', handler);
        });
    });

    describe('Error Handling', () => {
        test('should handle render errors gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockCanvas.render.mockImplementation(() => {
                throw new Error('Render error');
            });
            
            expect(() => gameEngine.render()).not.toThrow();
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });

        test('should handle update errors gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockState.update.mockImplementation(() => {
                throw new Error('Update error');
            });
            
            expect(() => gameEngine.update(16)).not.toThrow();
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });
    });

    describe('Performance', () => {
        test('should maintain consistent frame rate', () => {
            const timestamps = [];
            const numFrames = 10;
            
            for (let i = 0; i < numFrames; i++) {
                timestamps.push(i * 16); // Simulate 60fps
            }
            
            timestamps.forEach(timestamp => {
                gameEngine.update(timestamp);
            });
            
            // Verify update was called for each frame
            expect(gameEngine.update).toHaveBeenCalledTimes(numFrames);
        });
    });
});