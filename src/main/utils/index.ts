export function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) buf[i] = view[i];
  return buf;
}

/**
 * 将 ArrayBuffer 转换为 base64 字符串
 * @param arr ArrayBuffer
 * @returns base64str
 */
/* eslint-disable */
export function arrayBufferToBase64(arr: ArrayBuffer) {
  const array = new Uint8Array(arr);
  const length = array.byteLength;
  const table = ["A", "B", "C", "D", "E", "F", "G", "H",
    "I", "J", "K", "L", "M", "N", "O", "P",
    "Q", "R", "S", "T", "U", "V", "W", "X",
    "Y", "Z", "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u", "v",
    "w", "x", "y", "z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9", "+", "/"];
  let base64Str = "";
  for (var i = 0; length - i >= 3; i += 3) {
    const num1 = array[i];
    const num2 = array[i + 1];
    const num3 = array[i + 2];
    base64Str += table[num1 >>> 2]
      + table[((num1 & 0b11) << 4) | (num2 >>> 4)]
      + table[((num2 & 0b1111) << 2) | (num3 >>> 6)]
      + table[num3 & 0b111111];
  }
  const lastByte = length - i;
  if (lastByte === 1) {
    var lastNum1 = array[i];
    base64Str += table[lastNum1 >>> 2] + table[((lastNum1 & 0b11) << 4)] + "==";
  } else if (lastByte === 2) {
    var lastNum1 = array[i];
    var lastNum2 = array[i + 1];
    base64Str += table[lastNum1 >>> 2]
      + table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)]
      + table[(lastNum2 & 0b1111) << 2]
      + "=";
  }
  return base64Str;
}
