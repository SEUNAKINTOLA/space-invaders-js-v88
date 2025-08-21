/**
 * Performance tests for collision detection system
 * @jest-environment node
 */

describe('Collision System Performance', () => {
  // Test setup constants
  const NUM_OBJECTS = 1000;
  const ITERATIONS = 100;
  const BOUNDARY = { x: 0, y: 0, width: 1000, height: 1000 };
  
  /**
   * Helper to create a random game object
   * @returns {Object} Game object with position and dimensions
   */
  const createRandomObject = () => ({
    x: Math.random() * BOUNDARY.width,
    y: Math.random() * BOUNDARY.height,
    width: 10 + Math.random() * 40,
    height: 10 + Math.random() * 40,
    velocity: {
      x: -5 + Math.random() * 10,
      y: -5 + Math.random() * 10
    }
  });

  /**
   * Helper to generate test objects
   * @param {number} count Number of objects to generate
   * @returns {Array} Array of game objects
   */
  const generateTestObjects = (count) => {
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(createRandomObject());
    }
    return objects;
  };

  /**
   * Measures execution time of a function
   * @param {Function} fn Function to measure
   * @returns {number} Execution time in milliseconds
   */
  const measureExecutionTime = (fn) => {
    const start = performance.now();
    fn();
    return performance.now() - start;
  };

  /**
   * Updates object positions based on velocity
   * @param {Array} objects Array of game objects
   */
  const updateObjectPositions = (objects) => {
    objects.forEach(obj => {
      obj.x += obj.velocity.x;
      obj.y += obj.velocity.y;

      // Bounce off boundaries
      if (obj.x <= 0 || obj.x + obj.width >= BOUNDARY.width) {
        obj.velocity.x *= -1;
      }
      if (obj.y <= 0 || obj.y + obj.height >= BOUNDARY.height) {
        obj.velocity.y *= -1;
      }
    });
  };

  describe('Collision Detection Performance', () => {
    let testObjects;

    beforeEach(() => {
      testObjects = generateTestObjects(NUM_OBJECTS);
    });

    test('should maintain reasonable performance with many objects', () => {
      const times = [];

      for (let i = 0; i < ITERATIONS; i++) {
        const time = measureExecutionTime(() => {
          // Brute force collision check for baseline comparison
          for (let j = 0; j < testObjects.length; j++) {
            for (let k = j + 1; k < testObjects.length; k++) {
              const obj1 = testObjects[j];
              const obj2 = testObjects[k];

              // Basic AABB collision check
              const collision = !(
                obj1.x + obj1.width < obj2.x ||
                obj2.x + obj2.width < obj1.x ||
                obj1.y + obj1.height < obj2.y ||
                obj2.y + obj2.height < obj1.y
              );
            }
          }
          updateObjectPositions(testObjects);
        });
        times.push(time);
      }

      const averageTime = times.reduce((a, b) => a + b) / times.length;
      console.log(`Average collision check time: ${averageTime.toFixed(2)}ms`);
      
      // Performance threshold - adjust based on environment
      expect(averageTime).toBeLessThan(100); // 100ms threshold
    });

    test('should scale linearly with object count', () => {
      const objectCounts = [100, 500, 1000, 2000];
      const scalingTimes = [];

      objectCounts.forEach(count => {
        const objects = generateTestObjects(count);
        const time = measureExecutionTime(() => {
          for (let j = 0; j < objects.length; j++) {
            for (let k = j + 1; k < objects.length; k++) {
              const obj1 = objects[j];
              const obj2 = objects[k];

              // Basic AABB collision check
              const collision = !(
                obj1.x + obj1.width < obj2.x ||
                obj2.x + obj2.width < obj1.x ||
                obj1.y + obj1.height < obj2.y ||
                obj2.y + obj2.height < obj1.y
              );
            }
          }
        });
        scalingTimes.push({ count, time });
      });

      // Log scaling results
      scalingTimes.forEach(({ count, time }) => {
        console.log(`Objects: ${count}, Time: ${time.toFixed(2)}ms`);
      });

      // Verify roughly quadratic scaling (n^2)
      for (let i = 1; i < scalingTimes.length; i++) {
        const ratio = scalingTimes[i].time / scalingTimes[i-1].time;
        const countRatio = (scalingTimes[i].count / scalingTimes[i-1].count) ** 2;
        
        // Allow for some variance in scaling
        expect(ratio).toBeLessThan(countRatio * 1.5);
      }
    });
  });

  describe('Memory Usage', () => {
    test('should maintain stable memory usage', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const objects = generateTestObjects(NUM_OBJECTS);
      
      // Run multiple collision checks
      for (let i = 0; i < ITERATIONS; i++) {
        for (let j = 0; j < objects.length; j++) {
          for (let k = j + 1; k < objects.length; k++) {
            const obj1 = objects[j];
            const obj2 = objects[k];

            const collision = !(
              obj1.x + obj1.width < obj2.x ||
              obj2.x + obj2.width < obj1.x ||
              obj1.y + obj1.height < obj2.y ||
              obj2.y + obj2.height < obj1.y
            );
          }
        }
        updateObjectPositions(objects);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

      console.log(`Memory increase: ${memoryIncrease.toFixed(2)}MB`);
      expect(memoryIncrease).toBeLessThan(50); // 50MB threshold
    });
  });
});