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

class SettingStorageController extends baseController {
    async list() {
        const { ctx } = this;
        try {
            const data = await ctx.service.storage.list();
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SettingStorageController.list error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async detail() {
        const { ctx } = this;
        const { alias } = ctx.query;
        try {
            const data = await ctx.service.storage.detail(alias);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SettingStorageController.details error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async edit() {
        const { ctx } = this;
        const editReq = ctx.request.body;
        try {
            const data = await ctx.service.storage.edit(editReq);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SettingStorageController.edit error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async change() {
        const { ctx } = this;
        const { alias, status } = ctx.request.body;
        try {
            const data = await ctx.service.storage.change(alias, status);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SettingStorageController.change error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = SettingStorageController
