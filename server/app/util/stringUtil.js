'use strict';

function toSnakeCase(s) {
  let buf = '';
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (r === r.toUpperCase()) {
      if (i > 0) {
        buf += '_';
      }
      buf += r.toLowerCase();
    } else {
      buf += r;
    }
  }
  return buf;
}

module.exports = {
  toSnakeCase,
};
