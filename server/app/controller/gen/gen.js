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
}

module.exports = GenController
