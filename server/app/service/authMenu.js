const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')
const { backstageRolesKey } = require('../extend/config')

class AuthMenuService extends Service {
    async list() {
        const { ctx } = this;
        const { SystemAuthMenu } = ctx.model;

        try {
            const menus = await SystemAuthMenu.findAll({
                order: [['menuSort', 'DESC'], ['id']],
            });

            const menuResps = menus.map(menu => menu.toJSON());

            const tree = util.listToTree(menuResps, 'id', 'pid', 'children');

            return tree;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('list Menu error');
        }
    }

    async detail(id) {
        const { ctx } = this;

        const menu = await ctx.model.SystemAuthMenu.findOne({
            where: {
                id,
            },
        });

        if (!menu) {
            throw new Error('菜单已不存在!');
        }

        const res = menu.toJSON();

        return res;
    }

    async add(addReq) {
        const { ctx } = this;

        delete addReq.id;

        const menu = ctx.model.SystemAuthMenu.build(addReq);

        const transaction = await ctx.model.transaction();

        try {
            await menu.save({ transaction });

            await transaction.commit();

            ctx.service.redis.del(backstageRolesKey);
        } catch (err) {
            await transaction.rollback();
            throw new Error(err, 'Add Create err');
        }
    }

    async edit(editReq) {
        const { ctx } = this;

        const menu = await ctx.model.SystemAuthMenu.findOne({
            where: {
                id: editReq.id,
            },
        });

        if (!menu) {
            throw new Error('菜单已不存在!');
        }

        const transaction = await ctx.model.transaction();

        try {
            Object.assign(menu, editReq);

            await menu.save({ transaction });

            await transaction.commit();

            ctx.service.redis.del(backstageRolesKey);
        } catch (err) {
            await transaction.rollback();
            throw new Error(err, 'Edit Updates err');
        }
    }

    async del(id) {
        const { ctx } = this;

        const menu = await ctx.model.SystemAuthMenu.findOne({
            where: {
                id,
            },
        });

        if (!menu) {
            throw new Error('菜单已不存在!');
        }

        const transaction = await ctx.model.transaction();

        try {
            const childMenu = await ctx.model.SystemAuthMenu.findOne({
                where: {
                    pid: id,
                },
            });

            if (childMenu) {
                throw new Error('请先删除子菜单再操作！');
            }

            await menu.destroy({ transaction });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(err, 'Delete Delete err');
        }
    }
}


module.exports = AuthMenuService
