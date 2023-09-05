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

class SystemDeptController extends baseController {
    async deptList() {
        const { ctx } = this;
        try {
            const listReq = ctx.request.query;
            const data = await ctx.service.authDept.list(listReq);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemAuthDeptController.deptList error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async deptAdd() {
        const { ctx } = this;
        const { authDept } = ctx.service;

        try {
            const addReq = ctx.request.body;

            const data = await authDept.add(addReq);

            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(err);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async deptDetail() {
        const { ctx } = this;
        const { authDept } = ctx.service;

        try {
            const id = ctx.request.query.id;

            const data = await authDept.detail(id);

            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(err);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async deptEdit() {
        const { ctx } = this;
        const { authDept } = ctx.service;

        try {
            const editReq = ctx.request.body;

            await authDept.edit(editReq);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(err);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async deptDel() {
        const { ctx } = this;
        const { authDept } = ctx.service;

        try {
            const id = ctx.request.body.id;

            await authDept.del(id);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(err);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async deptAll() {
        const { ctx } = this;
        const { authDept } = ctx.service;

        try {
            const data = await authDept.all();

            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(err);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = SystemDeptController
