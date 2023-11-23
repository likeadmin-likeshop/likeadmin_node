'use strict'

const baseController = require('../baseController')
const md5 = require('md5')
const {
    backstageTokenSet,
    backstageTokenKey,
    reqAdminIdKey,
    reqRoleIdKey,
    reqUsernameKey,
    reqNicknameKey
} = require('../../extend/config')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const await = require('await-stream-ready/lib/await')
const fs = require('fs');
const { Readable } = require('stream');

class GenController extends baseController {
    async list() {
        const { ctx } = this;
        try {
            const listReq = ctx.request.query;
            const data = await ctx.service.gen.list(listReq);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`GenController.list error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async dbTables() {
        const { ctx } = this;
        try {
            const listReq = ctx.request.query;
            const data = await ctx.service.gen.dbTables(listReq);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`GenController.dbTables error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async importTable() {
        const { ctx } = this;
        try {
            const { tables } = ctx.request.query;
            const data = await ctx.service.gen.importTable(tables);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`GenController.importTable error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async delTable() {
        const { ctx } = this;
        const { ids } = ctx.request.body;

        try {
            await ctx.service.gen.delTable(ids);
            this.result({
                data: ''
            })
        } catch (err) {
            ctx.logger.error(`DelTable Delete error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async syncTable() {
        const { ctx } = this;
        const { id } = ctx.request.query;

        try {
            await ctx.service.gen.syncTable(id);
            this.result({
                data: ''
            })
        } catch (err) {
            ctx.logger.error(`syncTable error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async previewCode() {
        const { ctx } = this;
        const { id } = ctx.request.query;

        try {
            const res = await ctx.service.gen.previewCode(id);
            this.result({
                data: res
            })
        } catch (err) {
            ctx.logger.error(`previewCode error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    //downloadCode 下载代码
    async downloadCode() {
        const { ctx } = this;
        const { tables } = ctx.request.query;

        try {
            const tablesList = tables.split(',');
            const zipPath = 'app/public/downloads/file.zip';
            await ctx.service.gen.downloadCode(zipPath, tablesList);

            // 将文件转成数据流的方式返回给前端
            const fileStream = fs.createReadStream(zipPath);
            const fileContents = new Readable().wrap(fileStream);
            const contentType = 'application/zip';
            ctx.set('Content-Type', contentType);
            ctx.set('Content-Disposition', 'attachment; filename=likeadmin-gen.zip');
            ctx.body = fileContents;
        } catch (err) {
            ctx.logger.error(`downloadCode error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = GenController
