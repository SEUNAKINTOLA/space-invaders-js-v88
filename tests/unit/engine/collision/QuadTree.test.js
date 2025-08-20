/**
 * @jest/environment jsdom
 */

describe('QuadTree', () => {
  let quadTree;
  const bounds = {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  };
  
  const mockObject = {
    x: 100,
    y: 100,
    width: 20,
    height: 20,
    id: 'test-object'
  };

  beforeEach(() => {
    // Reset QuadTree before each test with default capacity of 4
    quadTree = new QuadTree(bounds, 4);
  });

  describe('Constructor', () => {
    test('should create QuadTree with correct initial properties', () => {
      expect(quadTree.bounds).toEqual(bounds);
      expect(quadTree.capacity).toBe(4);
      expect(quadTree.objects).toEqual([]);
      expect(quadTree.divided).toBe(false);
    });

    test('should throw error if invalid bounds provided', () => {
      expect(() => new QuadTree(null)).toThrow('Invalid bounds');
      expect(() => new QuadTree({})).toThrow('Invalid bounds');
      expect(() => new QuadTree({ x: 0, y: 0 })).toThrow('Invalid bounds');
    });
  });

  describe('insert()', () => {
    test('should insert object into quadtree', () => {
      const success = quadTree.insert(mockObject);
      
      expect(success).toBe(true);
      expect(quadTree.objects).toHaveLength(1);
      expect(quadTree.objects[0]).toBe(mockObject);
    });

    test('should subdivide when capacity is reached', () => {
      // Insert objects until capacity is reached
      for (let i = 0; i < 5; i++) {
        quadTree.insert({
          x: i * 50,
          y: i * 50,
          width: 20,
          height: 20,
          id: `obj-${i}`
        });
      }

      expect(quadTree.divided).toBe(true);
      expect(quadTree.northwest).toBeTruthy();
      expect(quadTree.northeast).toBeTruthy();
      expect(quadTree.southwest).toBeTruthy();
      expect(quadTree.southeast).toBeTruthy();
    });

    test('should not insert objects outside bounds', () => {
      const outsideObject = {
        x: 1000,
        y: 1000,
        width: 20,
        height: 20
      };

      const success = quadTree.insert(outsideObject);
      expect(success).toBe(false);
      expect(quadTree.objects).toHaveLength(0);
    });
  });

  describe('query()', () => {
    beforeEach(() => {
      // Insert some test objects
      quadTree.insert({ x: 100, y: 100, width: 20, height: 20, id: 'obj1' });
      quadTree.insert({ x: 200, y: 200, width: 20, height: 20, id: 'obj2' });
      quadTree.insert({ x: 300, y: 300, width: 20, height: 20, id: 'obj3' });
    });

    test('should return objects within query range', () => {
      const range = {
        x: 90,
        y: 90,
        width: 50,
        height: 50
      };

      const found = quadTree.query(range);
      expect(found).toHaveLength(1);
      expect(found[0].id).toBe('obj1');
    });

    test('should return empty array when no objects in range', () => {
      const range = {
        x: 0,
        y: 0,
        width: 50,
        height: 50
      };

      const found = quadTree.query(range);
      expect(found).toHaveLength(0);
    });

    test('should handle query across subdivided regions', () => {
      // Insert more objects to force subdivision
      for (let i = 0; i < 5; i++) {
        quadTree.insert({
          x: i * 50,
          y: i * 50,
          width: 20,
          height: 20,
          id: `extra-${i}`
        });
      }

      const range = {
        x: 0,
        y: 0,
        width: 400,
        height: 400
      };

      const found = quadTree.query(range);
      expect(found.length).toBeGreaterThan(0);
    });
  });

  describe('clear()', () => {
    test('should remove all objects and subdivisions', () => {
      // Insert objects and force subdivision
      for (let i = 0; i < 5; i++) {
        quadTree.insert({
          x: i * 50,
          y: i * 50,
          width: 20,
          height: 20,
          id: `obj-${i}`
        });
      }

      quadTree.clear();

      expect(quadTree.objects).toHaveLength(0);
      expect(quadTree.divided).toBe(false);
      expect(quadTree.northwest).toBeNull();
      expect(quadTree.northeast).toBeNull();
      expect(quadTree.southwest).toBeNull();
      expect(quadTree.southeast).toBeNull();
    });
  });

  describe('Performance', () => {
    test('should handle large number of insertions efficiently', () => {
      const startTime = performance.now();
      const numObjects = 1000;

      for (let i = 0; i < numObjects; i++) {
        quadTree.insert({
          x: Math.random() * bounds.width,
          y: Math.random() * bounds.height,
          width: 10,
          height: 10,
          id: `perf-${i}`
        });
      }

      const endTime = performance.now();
      const timePerInsert = (endTime - startTime) / numObjects;

      // Assuming reasonable performance on modern hardware
      expect(timePerInsert).toBeLessThan(1); // Less than 1ms per insert
    });

    test('should handle multiple queries efficiently', () => {
      // Setup with 100 random objects
      for (let i = 0; i < 100; i++) {
        quadTree.insert({
          x: Math.random() * bounds.width,
          y: Math.random() * bounds.height,
          width: 10,
          height: 10,
          id: `query-${i}`
        });
      }

      const startTime = performance.now();
      const numQueries = 1000;
      
      for (let i = 0; i < numQueries; i++) {
        quadTree.query({
          x: Math.random() * bounds.width,
          y: Math.random() * bounds.height,
          width: 50,
          height: 50
        });
      }

      const endTime = performance.now();
      const timePerQuery = (endTime - startTime) / numQueries;

      expect(timePerQuery).toBeLessThan(0.5); // Less than 0.5ms per query
    });
  });
});