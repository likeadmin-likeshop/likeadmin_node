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
}

module.exports = GenController
