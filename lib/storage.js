export const storage = {
  async get(key) {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    const value = window.localStorage.getItem(key);
    return value === null ? null : { key, value };
  },

  async set(key, value) {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    window.localStorage.setItem(key, value);
    return { key, value };
  },
};
