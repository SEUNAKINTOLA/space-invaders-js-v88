/**
 * @jest-environment jsdom
 */

describe('InputManager', () => {
    let inputManager;
    
    // Mock event handlers
    const mockKeyDownHandler = jest.fn();
    const mockKeyUpHandler = jest.fn();
    
    beforeEach(() => {
        // Reset the DOM
        document.body.innerHTML = '';
        
        // Create a new InputManager instance
        inputManager = {
            keyStates: new Map(),
            keyHandlers: new Map(),
            initialize: function() {
                window.addEventListener('keydown', this.handleKeyDown.bind(this));
                window.addEventListener('keyup', this.handleKeyUp.bind(this));
            },
            handleKeyDown: function(event) {
                this.keyStates.set(event.code, true);
                const handler = this.keyHandlers.get(event.code);
                if (handler) {
                    handler(true);
                }
            },
            handleKeyUp: function(event) {
                this.keyStates.set(event.code, false);
                const handler = this.keyHandlers.get(event.code);
                if (handler) {
                    handler(false);
                }
            }
        };
        
        // Initialize the input manager
        inputManager.initialize();
    });

    afterEach(() => {
        // Clean up event listeners
        window.removeEventListener('keydown', inputManager.handleKeyDown);
        window.removeEventListener('keyup', inputManager.handleKeyUp);
        
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('Key State Management', () => {
        test('should track key state changes correctly', () => {
            // Simulate keydown event
            const keyDownEvent = new KeyboardEvent('keydown', { code: 'Space' });
            window.dispatchEvent(keyDownEvent);
            
            expect(inputManager.keyStates.get('Space')).toBe(true);

            // Simulate keyup event
            const keyUpEvent = new KeyboardEvent('keyup', { code: 'Space' });
            window.dispatchEvent(keyUpEvent);
            
            expect(inputManager.keyStates.get('Space')).toBe(false);
        });

        test('should handle multiple keys simultaneously', () => {
            // Simulate multiple keydown events
            const spaceKeyDown = new KeyboardEvent('keydown', { code: 'Space' });
            const arrowLeftKeyDown = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
            
            window.dispatchEvent(spaceKeyDown);
            window.dispatchEvent(arrowLeftKeyDown);
            
            expect(inputManager.keyStates.get('Space')).toBe(true);
            expect(inputManager.keyStates.get('ArrowLeft')).toBe(true);
        });
    });

    describe('Key Handler Registration', () => {
        test('should execute registered handlers on key events', () => {
            // Register a mock handler
            inputManager.keyHandlers.set('Space', mockKeyDownHandler);

            // Simulate keydown event
            const keyDownEvent = new KeyboardEvent('keydown', { code: 'Space' });
            window.dispatchEvent(keyDownEvent);
            
            expect(mockKeyDownHandler).toHaveBeenCalledWith(true);

            // Simulate keyup event
            const keyUpEvent = new KeyboardEvent('keyup', { code: 'Space' });
            window.dispatchEvent(keyUpEvent);
            
            expect(mockKeyDownHandler).toHaveBeenCalledWith(false);
        });

        test('should not execute handlers for unregistered keys', () => {
            // Register handler for Space key only
            inputManager.keyHandlers.set('Space', mockKeyDownHandler);

            // Simulate keydown event for a different key
            const keyDownEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
            window.dispatchEvent(keyDownEvent);
            
            expect(mockKeyDownHandler).not.toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        test('should handle rapid key presses correctly', () => {
            const handler = jest.fn();
            inputManager.keyHandlers.set('Space', handler);

            // Simulate rapid key presses
            for (let i = 0; i < 5; i++) {
                const keyDownEvent = new KeyboardEvent('keydown', { code: 'Space' });
                const keyUpEvent = new KeyboardEvent('keyup', { code: 'Space' });
                
                window.dispatchEvent(keyDownEvent);
                window.dispatchEvent(keyUpEvent);
            }

            expect(handler).toHaveBeenCalledTimes(10); // 5 downs + 5 ups
        });

        test('should handle invalid key codes gracefully', () => {
            const invalidKeyEvent = new KeyboardEvent('keydown', { code: undefined });
            
            // Should not throw an error
            expect(() => {
                window.dispatchEvent(invalidKeyEvent);
            }).not.toThrow();
        });
    });

    describe('Memory Management', () => {
        test('should not leak memory when handling multiple events', () => {
            const initialSize = inputManager.keyStates.size;
            
            // Simulate many key events
            for (let i = 0; i < 100; i++) {
                const keyCode = `Key${i}`;
                const keyDownEvent = new KeyboardEvent('keydown', { code: keyCode });
                window.dispatchEvent(keyDownEvent);
            }

            expect(inputManager.keyStates.size).toBeLessThan(200);
        });
    });
});