'use strict';

const path = require('path');
const { publicPrefix, publicUrl } = require('../extend/config');

// 定义转换绝对路径的方法
function toAbsoluteUrl(u) {
  // TODO: engine默认local
  if (!u) {
    return '';
  }
  const parsedUrl = new URL(publicUrl);

  if (u.indexOf('/public/static/') === 0) {
    parsedUrl.pathname = path.join(parsedUrl.pathname, u);
    return parsedUrl.toString();
  }

  if (u.includes('public/uploads/')) {
    parsedUrl.pathname = path.join(parsedUrl.pathname, u);
    return parsedUrl.toString();
  }

  const engine = 'local';
  if (engine === 'local') {
    parsedUrl.pathname = path.join(parsedUrl.pathname, publicPrefix, u);
    return parsedUrl.toString();
  }

  // TODO: 其他engine
  return u;
}

function toRelativeUrl(u) {
  if (u === '') {
    return '';
  }

  const up = new URL(u);

  const engine = 'local';

  if (engine === 'local') {
    const lu = up.toString();
    return lu.replace(publicUrl, '').replace(publicPrefix, '');
  }

  // TODO: 其他engine
  return u;
}

module.exports = {
  toAbsoluteUrl,
  toRelativeUrl,
};
