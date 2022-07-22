export default function debug(name="", enable=true) {
  return function(...msg) {
    if (enable) {
      console.log(`[${name}] `, ...msg);
    }
  }
}