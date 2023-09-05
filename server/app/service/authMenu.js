const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')

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
}


module.exports = AuthMenuService
