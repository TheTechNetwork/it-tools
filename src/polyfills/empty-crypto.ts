// Empty stand-in for Node's `crypto` module in the browser bundle.
//
// The only browser-runtime consumers of `crypto` are bcryptjs and node-forge,
// and both prefer the Web Crypto API (globalThis.crypto): bcryptjs calls
// `crypto.getRandomValues` first and only falls back to Node's crypto, and
// node-forge reads `window.crypto` directly, gating its `require('crypto')`
// behind an `isNodejs` check. Aliasing `crypto` to this stub — instead of to
// crypto-browserify — keeps the entire browserify crypto chain (including the
// vulnerable, never-executed `elliptic`, pulled via browserify-sign and
// create-ecdh) out of the dependency tree and the bundle.
export default {};
