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

class SystemMenuController extends baseController {
    // 菜单列表
    async menuList() {
        const { ctx } = this;
        try {
            const params = ctx.query;
            const data = await ctx.service.authMenu.list(params);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemController.menuList error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    // 菜单详情
    async menuDetail() {
        const { ctx } = this;
        try {
            const id = ctx.query.id;
            const data = await ctx.service.authMenu.detail(id);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemController.menuDetail error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    // 新增菜单
    async menuAdd() {
        const { ctx } = this;

        try {
            const addReq = ctx.request.body;

            await ctx.service.authMenu.add(addReq);

            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`SystemController.menuAdd error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    // 编辑菜单
    async menuEdit() {
        const { ctx } = this;

        try {
            const editReq = ctx.request.body;

            await ctx.service.authMenu.edit(editReq);
            
            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`SystemController.menuEdit error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    // 删除菜单
    async menuDel() {
        const { ctx } = this;

        try {
            const id = ctx.request.body.id;

            await ctx.service.authMenu.del(id);
            
            this.result({
                data: {}
            })
        } catch (err) {
            ctx.logger.error(`SystemController.menuDel error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }
}

module.exports = SystemMenuController
