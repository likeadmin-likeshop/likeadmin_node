// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportBaseController = require('../../../app/controller/baseController');
import ExportSystem = require('../../../app/controller/system');
import ExportUpload = require('../../../app/controller/upload');

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    system: ExportSystem;
    upload: ExportUpload;
  }
}
