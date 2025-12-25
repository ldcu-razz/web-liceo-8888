export const compareObjects = <T extends Record<string, unknown>>(obj1: T, obj2: T): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Deep equality check for two values, handling primitives, arrays, and nested objects
 */
const deepEqual = (value1: unknown, value2: unknown): boolean => {
  // Handle primitives and null/undefined
  if (value1 === value2) return true;
  
  // Handle null or undefined cases
  if (value1 == null || value2 == null) return false;
  
  // Handle arrays
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    return value1.every((item, index) => deepEqual(item, value2[index]));
  }
  
  // Handle objects
  if (typeof value1 === 'object' && typeof value2 === 'object') {
    const obj1 = value1 as Record<string, unknown>;
    const obj2 = value2 as Record<string, unknown>;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
  }
  
  return false;
};

/**
 * Returns an object containing only the properties that differ between obj1 and obj2.
 * Performs deep comparison for arrays and nested objects.
 */
export const getObjectDiff = <T extends Record<string, unknown>>(obj1: T, obj2: T): Partial<T> => {
  return Object.keys(obj1).reduce((acc, key) => {
    if (!deepEqual(obj1[key], obj2[key])) {
      acc[key as keyof T] = obj1[key as keyof T];
    }
    return acc;
  }, {} as Partial<T>);
};