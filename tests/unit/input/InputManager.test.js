// tests/unit/input/InputManager.test.js

describe('InputManager', () => {
  let inputManager;
  let mockKeyboardInput;
  let mockTouchInput;

  beforeEach(() => {
    // Mock keyboard input implementation
    mockKeyboardInput = {
      init: jest.fn(),
      update: jest.fn(),
      isKeyPressed: jest.fn(),
      destroy: jest.fn()
    };

    // Mock touch input implementation
    mockTouchInput = {
      init: jest.fn(),
      update: jest.fn(),
      getTouchPosition: jest.fn(),
      destroy: jest.fn()
    };

    // Create input manager instance with mocked dependencies
    inputManager = {
      keyboardInput: mockKeyboardInput,
      touchInput: mockTouchInput,
      init: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize both keyboard and touch inputs', () => {
      inputManager.init();
      
      expect(mockKeyboardInput.init).toHaveBeenCalled();
      expect(mockTouchInput.init).toHaveBeenCalled();
    });

    test('should handle initialization errors gracefully', () => {
      mockKeyboardInput.init.mockImplementation(() => {
        throw new Error('Keyboard init failed');
      });

      expect(() => inputManager.init()).not.toThrow();
    });
  });

  describe('Update Loop', () => {
    test('should update both input systems each frame', () => {
      inputManager.update();

      expect(mockKeyboardInput.update).toHaveBeenCalled();
      expect(mockTouchInput.update).toHaveBeenCalled();
    });

    test('should continue updating if one input system fails', () => {
      mockKeyboardInput.update.mockImplementation(() => {
        throw new Error('Keyboard update failed');
      });

      expect(() => inputManager.update()).not.toThrow();
      expect(mockTouchInput.update).toHaveBeenCalled();
    });
  });

  describe('Input State Management', () => {
    test('should correctly report keyboard input state', () => {
      mockKeyboardInput.isKeyPressed.mockReturnValue(true);
      
      const result = inputManager.keyboardInput.isKeyPressed('Space');
      
      expect(result).toBe(true);
      expect(mockKeyboardInput.isKeyPressed).toHaveBeenCalledWith('Space');
    });

    test('should correctly report touch input position', () => {
      const mockPosition = { x: 100, y: 200 };
      mockTouchInput.getTouchPosition.mockReturnValue(mockPosition);
      
      const position = inputManager.touchInput.getTouchPosition();
      
      expect(position).toEqual(mockPosition);
      expect(mockTouchInput.getTouchPosition).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    test('should properly cleanup all input systems', () => {
      inputManager.destroy();

      expect(mockKeyboardInput.destroy).toHaveBeenCalled();
      expect(mockTouchInput.destroy).toHaveBeenCalled();
    });

    test('should handle cleanup errors gracefully', () => {
      mockKeyboardInput.destroy.mockImplementation(() => {
        throw new Error('Keyboard cleanup failed');
      });

      expect(() => inputManager.destroy()).not.toThrow();
      expect(mockTouchInput.destroy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle rapid input system switching', () => {
      // Simulate rapid switching between input methods
      inputManager.update();
      inputManager.update();
      inputManager.update();

      expect(mockKeyboardInput.update).toHaveBeenCalledTimes(3);
      expect(mockTouchInput.update).toHaveBeenCalledTimes(3);
    });

    test('should handle simultaneous inputs', () => {
      mockKeyboardInput.isKeyPressed.mockReturnValue(true);
      mockTouchInput.getTouchPosition.mockReturnValue({ x: 150, y: 150 });

      const keyPressed = inputManager.keyboardInput.isKeyPressed('Space');
      const touchPos = inputManager.touchInput.getTouchPosition();

      expect(keyPressed).toBe(true);
      expect(touchPos).toEqual({ x: 150, y: 150 });
    });
  });

  describe('Performance', () => {
    test('should handle multiple rapid updates efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        inputManager.update();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Ensure updates complete within reasonable time (50ms)
      expect(duration).toBeLessThan(50);
    });
  });
});