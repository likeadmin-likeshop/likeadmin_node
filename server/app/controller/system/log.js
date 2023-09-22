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
const urlUtil = require('../../util/urlUtil')

class SystemLogController extends baseController {
    async operate() {
        const { ctx } = this;
        try {
            const listReq = ctx.request.query;
            const data = await ctx.service.log.operate(listReq);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemLogController.operate error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = SystemLogController
