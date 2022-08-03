export const debounce = (fn, delay=500) => {
  let timer;
  return (...args) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  }
}

export const getLocalItem = (key: string) => window.localStorage.getItem(key);

export const setLocalItem = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
}