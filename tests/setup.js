/**
 * @fileoverview Test setup configuration for Space Invaders JS V88
 * Configures the test environment with custom matchers and global setup
 */

// Mock canvas and WebGL context since we're in Node environment
class MockCanvasContext {
  constructor() {
    this.drawImage = jest.fn();
    this.fillRect = jest.fn();
    this.clearRect = jest.fn();
    this.beginPath = jest.fn();
    this.closePath = jest.fn();
    this.moveTo = jest.fn();
    this.lineTo = jest.fn();
    this.stroke = jest.fn();
    this.fill = jest.fn();
    this.save = jest.fn();
    this.restore = jest.fn();
    this.translate = jest.fn();
    this.rotate = jest.fn();
    this.scale = jest.fn();
  }
}

// Mock HTML Canvas element
class MockCanvas {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.style = {};
    this.getContext = jest.fn(() => new MockCanvasContext());
  }
}

// Setup global mocks
global.HTMLCanvasElement = MockCanvas;
global.window = {
  requestAnimationFrame: callback => setTimeout(callback, 0),
  cancelAnimationFrame: jest.fn(),
  innerWidth: 800,
  innerHeight: 600,
};
global.document = {
  createElement: (element) => {
    if (element === 'canvas') {
      return new MockCanvas();
    }
    return {};
  },
  body: {
    appendChild: jest.fn(),
  },
};

// Custom matchers for game engine testing
expect.extend({
  toBeWithinBounds(received, min, max) {
    const pass = received >= min && received <= max;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${min} - ${max}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${min} - ${max}`,
        pass: false,
      };
    }
  },

  toHaveCollision(received, target) {
    const receivedBounds = received.getBounds();
    const targetBounds = target.getBounds();
    
    const hasCollision = !(
      receivedBounds.right < targetBounds.left ||
      receivedBounds.left > targetBounds.right ||
      receivedBounds.bottom < targetBounds.top ||
      receivedBounds.top > targetBounds.bottom
    );

    if (hasCollision) {
      return {
        message: () => 'expected objects not to have collision',
        pass: true,
      };
    } else {
      return {
        message: () => 'expected objects to have collision',
        pass: false,
      };
    }
  },
});

// Performance testing utilities
global.performanceTest = {
  startTime: 0,
  endTime: 0,
  
  start() {
    this.startTime = performance.now();
  },
  
  end() {
    this.endTime = performance.now();
    return this.endTime - this.startTime;
  },
};

// Cleanup function to reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
  
  // Reset canvas mock calls
  const context = new MockCanvas().getContext('2d');
  Object.keys(context).forEach(key => {
    if (typeof context[key] === 'function') {
      context[key].mockClear();
    }
  });
});

// Global test timeout
jest.setTimeout(10000);

// Console error/warning handling
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  throw new Error(args.join(' '));
};

console.warn = (...args) => {
  throw new Error(args.join(' '));
};

// Restore console functions after tests
afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});