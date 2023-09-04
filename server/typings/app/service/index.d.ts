// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAuthAdmin = require('../../../app/service/authAdmin');
import ExportCommon = require('../../../app/service/common');
import ExportRedis = require('../../../app/service/redis');
import ExportUpload = require('../../../app/service/upload');

declare module 'egg' {
  interface IService {
    authAdmin: AutoInstanceType<typeof ExportAuthAdmin>;
    common: AutoInstanceType<typeof ExportCommon>;
    redis: AutoInstanceType<typeof ExportRedis>;
    upload: AutoInstanceType<typeof ExportUpload>;
  }
}
