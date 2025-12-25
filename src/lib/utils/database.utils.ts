/**
 * Utility functions for database operations
 * Handles conversion between TypeScript camelCase and SQL snake_case
 */

/**
 * Convert camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys from camelCase to snake_case
 */
export function objectToSnakeCase<T extends Record<string, any>>(
  obj: T
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = toSnakeCase(key);
      const value = obj[key];

      // Handle nested objects (skip Date objects)
      const isDateLike = value?.constructor?.name === 'Date' || value?.toISOString;
      if (value && typeof value === 'object' && !Array.isArray(value) && !isDateLike) {
        result[snakeKey] = objectToSnakeCase(value);
      } else if (Array.isArray(value)) {
        // Handle arrays of objects
        result[snakeKey] = value.map((item: any) =>
          item && typeof item === 'object' ? objectToSnakeCase(item) : item
        );
      } else {
        result[snakeKey] = value;
      }
    }
  }

  return result;
}

/**
 * Convert object keys from snake_case to camelCase
 */
export function objectToCamelCase<T extends Record<string, any>>(
  obj: T
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = toCamelCase(key);
      const value = obj[key];

      // Handle nested objects (skip Date objects)
      const isDateLike = value?.constructor?.name === 'Date' || value?.toISOString;
      if (value && typeof value === 'object' && !Array.isArray(value) && !isDateLike) {
        result[camelKey] = objectToCamelCase(value);
      } else if (Array.isArray(value)) {
        // Handle arrays of objects
        result[camelKey] = value.map((item: any) =>
          item && typeof item === 'object' ? objectToCamelCase(item) : item
        );
      } else {
        result[camelKey] = value;
      }
    }
  }

  return result;
}

/**
 * Convert array of objects from snake_case to camelCase
 */
export function arrayToCamelCase<T extends Record<string, any>>(
  arr: T[]
): Record<string, any>[] {
  return arr.map((obj) => objectToCamelCase(obj));
}

/**
 * Convert array of objects from camelCase to snake_case
 */
export function arrayToSnakeCase<T extends Record<string, any>>(
  arr: T[]
): Record<string, any>[] {
  return arr.map((obj) => objectToSnakeCase(obj));
}

