// pdf.js 6.x calls the TC39 "Upsert" Map methods (getOrInsert /
// getOrInsertComputed) without shipping a polyfill. They only landed in very
// recent browsers (Chrome 145, Firefox 144, Safari 26.2), so backfill them for
// everyone else. Imported before pdf.js on both the main thread and the pdf.js
// worker so rendering works regardless of browser version.
const proto = Map.prototype as {
  getOrInsert?: unknown;
  getOrInsertComputed?: unknown;
};

if (typeof proto.getOrInsertComputed !== 'function') {
  proto.getOrInsertComputed = function <K, V>(this: Map<K, V>, key: K, callback: (key: K) => V): V {
    if (!this.has(key)) {
      this.set(key, callback(key));
    }
    return this.get(key) as V;
  };
}

if (typeof proto.getOrInsert !== 'function') {
  proto.getOrInsert = function <K, V>(this: Map<K, V>, key: K, defaultValue: V): V {
    if (!this.has(key)) {
      this.set(key, defaultValue);
    }
    return this.get(key) as V;
  };
}
