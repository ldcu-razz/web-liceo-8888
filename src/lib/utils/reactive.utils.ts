export const debounce = <T>(fn: (...args: T[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<typeof fn>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args as Parameters<typeof fn>), delay);
  };
};

export const throttle = (fn: () => void, delay: number) => {
  let lastCall = 0;
  return (...args: Parameters<typeof fn>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args as Parameters<typeof fn>);
    }
  };
};

export const distinctUntilChanged = <T>(comparator?: (a: T, b: T) => boolean) => {
  let lastValue: T | undefined = undefined;
  let hasValue = false;
  
  return (value: T): boolean => {
    const isEqual = hasValue && (comparator ? comparator(value, lastValue!) : value === lastValue);
    
    if (!isEqual) {
      lastValue = value;
      hasValue = true;
      return true; // value changed
    }
    return false; // value didn't change
  };
};