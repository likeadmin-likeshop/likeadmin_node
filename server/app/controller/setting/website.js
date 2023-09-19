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

class SettingWebsiteController extends baseController {
    async details() {
        const { ctx } = this;
        try {
            const data = await ctx.service.website.details();
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SettingWebsiteController.details error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async save() {
        const { ctx } = this;
        const params = ctx.request.body;
        try {
            await ctx.service.website.save(params);
            this.result({
                data:{}
            })
        } catch (err) {
            ctx.logger.error(`SettingWebsiteController.save error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = SettingWebsiteController
