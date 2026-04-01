const isBrowser = typeof window !== 'undefined';

export const readStorageValue = (key) => {
  if (!isBrowser) return null;

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}"`, error);
    return null;
  }
};

export const readJSONStorage = (key, fallback) => {
  const value = readStorageValue(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}"`, error);
    return fallback;
  }
};

export const writeJSONStorage = (key, value) => {
  if (!isBrowser) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to write localStorage key "${key}"`, error);
    return false;
  }
};
