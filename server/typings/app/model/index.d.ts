// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportAlbum = require('../../../app/model/album');
import ExportAlbumCate = require('../../../app/model/albumCate');
import ExportArticle = require('../../../app/model/article');
import ExportArticleCategory = require('../../../app/model/articleCategory');
import ExportArticleCollect = require('../../../app/model/articleCollect');
import ExportDecoratePage = require('../../../app/model/decoratePage');
import ExportDecorateTabbar = require('../../../app/model/decorateTabbar');
import ExportDictData = require('../../../app/model/dictData');
import ExportDictType = require('../../../app/model/dictType');
import ExportGenTable = require('../../../app/model/genTable');
import ExportGenTableColumn = require('../../../app/model/genTableColumn');
import ExportHotSearch = require('../../../app/model/hotSearch');
import ExportNoticeSetting = require('../../../app/model/noticeSetting');
import ExportOfficialReply = require('../../../app/model/officialReply');
import ExportSystemAuthAdmin = require('../../../app/model/systemAuthAdmin');
import ExportSystemAuthDept = require('../../../app/model/systemAuthDept');
import ExportSystemAuthMenu = require('../../../app/model/systemAuthMenu');
import ExportSystemAuthPerm = require('../../../app/model/systemAuthPerm');
import ExportSystemAuthPost = require('../../../app/model/systemAuthPost');
import ExportSystemAuthRole = require('../../../app/model/systemAuthRole');
import ExportSystemConfig = require('../../../app/model/systemConfig');
import ExportSystemLogLogin = require('../../../app/model/systemLogLogin');
import ExportSystemLogOperate = require('../../../app/model/systemLogOperate');
import ExportSystemLogSms = require('../../../app/model/systemLogSms');
import ExportUser = require('../../../app/model/user');
import ExportUserAuth = require('../../../app/model/userAuth');

declare module 'egg' {
  interface IModel {
    Album: ReturnType<typeof ExportAlbum>;
    AlbumCate: ReturnType<typeof ExportAlbumCate>;
    Article: ReturnType<typeof ExportArticle>;
    ArticleCategory: ReturnType<typeof ExportArticleCategory>;
    ArticleCollect: ReturnType<typeof ExportArticleCollect>;
    DecoratePage: ReturnType<typeof ExportDecoratePage>;
    DecorateTabbar: ReturnType<typeof ExportDecorateTabbar>;
    DictData: ReturnType<typeof ExportDictData>;
    DictType: ReturnType<typeof ExportDictType>;
    GenTable: ReturnType<typeof ExportGenTable>;
    GenTableColumn: ReturnType<typeof ExportGenTableColumn>;
    HotSearch: ReturnType<typeof ExportHotSearch>;
    NoticeSetting: ReturnType<typeof ExportNoticeSetting>;
    OfficialReply: ReturnType<typeof ExportOfficialReply>;
    SystemAuthAdmin: ReturnType<typeof ExportSystemAuthAdmin>;
    SystemAuthDept: ReturnType<typeof ExportSystemAuthDept>;
    SystemAuthMenu: ReturnType<typeof ExportSystemAuthMenu>;
    SystemAuthPerm: ReturnType<typeof ExportSystemAuthPerm>;
    SystemAuthPost: ReturnType<typeof ExportSystemAuthPost>;
    SystemAuthRole: ReturnType<typeof ExportSystemAuthRole>;
    SystemConfig: ReturnType<typeof ExportSystemConfig>;
    SystemLogLogin: ReturnType<typeof ExportSystemLogLogin>;
    SystemLogOperate: ReturnType<typeof ExportSystemLogOperate>;
    SystemLogSms: ReturnType<typeof ExportSystemLogSms>;
    User: ReturnType<typeof ExportUser>;
    UserAuth: ReturnType<typeof ExportUserAuth>;
  }
}
