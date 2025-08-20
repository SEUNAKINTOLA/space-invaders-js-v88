/**
 * @jest/environment jsdom
 */

describe('Input System Integration Tests', () => {
  let inputManager;
  let keyboardInput;
  let touchInput;
  
  // Mock event handlers
  const mockKeyDownHandler = jest.fn();
  const mockKeyUpHandler = jest.fn();
  const mockTouchStartHandler = jest.fn();
  const mockTouchEndHandler = jest.fn();

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="game-container">
        <canvas id="gameCanvas"></canvas>
        <div id="touch-controls"></div>
      </div>
    `;

    // Reset all mocks
    jest.clearAllMocks();
    
    // Initialize input systems
    keyboardInput = {
      init: jest.fn(),
      update: jest.fn(),
      isKeyPressed: jest.fn(),
      addKeyDownListener: jest.fn(),
      addKeyUpListener: jest.fn(),
      destroy: jest.fn()
    };

    touchInput = {
      init: jest.fn(),
      update: jest.fn(),
      isTouchActive: jest.fn(),
      addTouchStartListener: jest.fn(),
      addTouchEndListener: jest.fn(),
      destroy: jest.fn()
    };

    inputManager = {
      init: jest.fn(),
      update: jest.fn(),
      registerKeyboardInput: jest.fn(),
      registerTouchInput: jest.fn(),
      destroy: jest.fn()
    };
  });

  afterEach(() => {
    // Cleanup
    jest.resetAllMocks();
    document.body.innerHTML = '';
  });

  describe('Input System Initialization', () => {
    test('should initialize both keyboard and touch input systems', () => {
      inputManager.init();
      
      expect(keyboardInput.init).toHaveBeenCalled();
      expect(touchInput.init).toHaveBeenCalled();
    });

    test('should register input handlers correctly', () => {
      inputManager.registerKeyboardInput(keyboardInput);
      inputManager.registerTouchInput(touchInput);

      expect(keyboardInput.addKeyDownListener).toHaveBeenCalled();
      expect(touchInput.addTouchStartListener).toHaveBeenCalled();
    });
  });

  describe('Input System Event Handling', () => {
    beforeEach(() => {
      inputManager.init();
      inputManager.registerKeyboardInput(keyboardInput);
      inputManager.registerTouchInput(touchInput);
    });

    test('should handle simultaneous keyboard and touch events', () => {
      // Simulate keyboard event
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(keyEvent);

      // Simulate touch event
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      document.getElementById('touch-controls').dispatchEvent(touchEvent);

      expect(keyboardInput.update).toHaveBeenCalled();
      expect(touchInput.update).toHaveBeenCalled();
    });

    test('should maintain input state consistency across systems', () => {
      // Set up mock returns
      keyboardInput.isKeyPressed.mockReturnValue(true);
      touchInput.isTouchActive.mockReturnValue(true);

      // Simulate input updates
      inputManager.update();

      expect(keyboardInput.isKeyPressed).toHaveBeenCalled();
      expect(touchInput.isTouchActive).toHaveBeenCalled();
    });
  });

  describe('Input System Cleanup', () => {
    test('should properly cleanup both input systems', () => {
      inputManager.init();
      inputManager.registerKeyboardInput(keyboardInput);
      inputManager.registerTouchInput(touchInput);

      inputManager.destroy();

      expect(keyboardInput.destroy).toHaveBeenCalled();
      expect(touchInput.destroy).toHaveBeenCalled();
    });
  });

  describe('Input System Edge Cases', () => {
    test('should handle rapid switching between input methods', () => {
      inputManager.init();
      
      // Simulate rapid alternating inputs
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 200, clientY: 100 }]
      });

      for (let i = 0; i < 5; i++) {
        document.dispatchEvent(keyEvent);
        document.getElementById('touch-controls').dispatchEvent(touchEvent);
      }

      expect(keyboardInput.update).toHaveBeenCalled();
      expect(touchInput.update).toHaveBeenCalled();
    });

    test('should handle invalid input gracefully', () => {
      inputManager.init();
      
      // Attempt to register null input systems
      expect(() => {
        inputManager.registerKeyboardInput(null);
      }).not.toThrow();

      expect(() => {
        inputManager.registerTouchInput(null);
      }).not.toThrow();
    });
  });
});