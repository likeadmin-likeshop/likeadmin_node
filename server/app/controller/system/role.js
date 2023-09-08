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

class SystemRoleController extends baseController {
    async roleAll() {
        const { ctx } = this;
        try {
            const data = await ctx.service.authRole.all();
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemAuthPostController.roleAll error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    // 角色列表
    async roleList() {
        const { ctx } = this;
        try {
            const params = ctx.query;
            const data = await ctx.service.authRole.list(params);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemController.roleList error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    //详情
    async detail() {
        const { ctx } = this;
        try {
            const id = ctx.query.id;
            const data = await ctx.service.authRole.detail(id);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemController.roleList error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async add() {
        const { ctx } = this;
        const { authRole } = ctx.service;

        try {
            const addReq = ctx.request.body;

            const data = await authRole.add(addReq);

            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(err);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async edit() {
        const { ctx } = this;
        const { authRole } = ctx.service;

        try {
            const editReq = ctx.request.body;

            await authRole.edit(editReq);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(err);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async del() {
        const { ctx } = this;
        const { authRole } = ctx.service;

        try {
            const id = ctx.request.body.id;

            await authRole.del(id);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(err);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = SystemRoleController
