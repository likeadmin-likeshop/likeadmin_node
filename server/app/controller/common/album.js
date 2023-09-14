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

    async albumRename() {
        const { ctx } = this;

        try {
            const { id, name } = ctx.request.body;

            await ctx.service.album.albumRename(id, name);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.albumRename error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async albumMove() {
        const { ctx } = this;
        const { request } = ctx;

        try {
            const { ids, cid } = request.body;

            await ctx.service.album.albumMove(ids, cid);
            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.albumMove error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async albumAdd() {
        const { ctx } = this;
        const { request } = ctx;
        try {
            const addReq = request.body;

            const res = await ctx.service.album.albumAdd(addReq);

            this.result({
                data: {
                    id: res
                }
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.albumAdd error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async albumDel() {
        const { ctx } = this;
        const { request } = ctx;

        try {
            const { ids } = request.body;

            await ctx.service.album.albumDel(ids);
            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.albumDel error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async uploadImage() {
        const { ctx } = this;
        try {
            const stream = await ctx.getFileStream();
            const cid = stream.fields.cid || 0;

            const data = await ctx.service.album.uploadFile(cid, stream);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.uploadImage error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async uploadVideo() {
        const { ctx } = this;
        try {
            const stream = await ctx.getFileStream();
            const cid = stream.fields.cid || 0;
            const type = 20;

            const data = await ctx.service.album.uploadFile(cid, stream, type);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`CommonAblumController.uploadVideo error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = CommonAblumController
