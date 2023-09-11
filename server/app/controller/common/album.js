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

class CommonAblumController extends baseController {
    async cateList() {
        const { ctx } = this;
        try {
            const params = ctx.query;
            const data = await ctx.service.album.cateList(params);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.cateList error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async cateAdd() {
        const { ctx } = this;

        try {
            const addReq = ctx.request.body;

            await ctx.service.album.cateAdd(addReq);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.cateAdd error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async cateRename() {
        const { ctx } = this;

        try {
            const { id, name } = ctx.request.body;

            await ctx.service.album.cateRename(id, name);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.cateRename error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async cateDel() {
        const { ctx } = this;

        try {
            const { id } = ctx.request.body;

            await ctx.service.album.cateDel(id);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.cateDel error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }    

    async albumList() {
        const { ctx } = this;
        try {
            const params = ctx.query;
            const data = await ctx.service.album.albumList(params);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.albumList error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = CommonAblumController
