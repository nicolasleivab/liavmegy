const { TextEncoder, TextDecoder } = require("util");

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

// Polyfill for crypto.subtle.digest in Node.js for RxDB
if (typeof global.crypto === "undefined") {
  global.crypto = {};
}
if (typeof global.crypto.subtle === "undefined") {
  const { webcrypto } = require("crypto");
  global.crypto.subtle = webcrypto.subtle;
}
