// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportAuth = require('../../../app/middleware/auth');
import ExportAuthority = require('../../../app/middleware/authority');

declare module 'egg' {
  interface IMiddleware {
    auth: typeof ExportAuth;
    authority: typeof ExportAuthority;
  }
}
