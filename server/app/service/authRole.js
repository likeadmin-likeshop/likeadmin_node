const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')

class AuthRoleService extends Service {
    async all() {
        const { ctx } = this;
        try {
            const roleModel = ctx.model.SystemAuthRole;
            const roles = await roleModel.findAll({
                order: [['sort', 'DESC'], ['id', 'DESC']],
            });

            const res = roles.map(role => role.toJSON());
            return res;
        } catch (err) {
            ctx.logger.error(`AuthRoleService.all error: ${err}`);
            throw err;
        }
    }

    async list(page) {
        const { ctx } = this;
        const { SystemAuthRole } = ctx.model;

        try {
            const limit = parseInt(page.pageSize, 10);
            const offset = page.pageSize * (page.pageNo - 1);

            const roleModel = await SystemAuthRole.findAndCountAll({
                limit,
                offset,
                order: [['sort', 'DESC'], ['id', 'DESC']],
            });

            const [roles, count] = await Promise.all([
                roleModel.rows.map(role => role.toJSON()),
                roleModel.count,
            ]);

            const roleResp = await Promise.all(
                roles.map(async role => {
                    const { id, name, sort, isDisable, createTime, updateTime, remark } = role;
                    const member = await this.getMemberCnt(role.id);

                    return {
                        id,
                        name,
                        sort,
                        isDisable,
                        createTime,
                        updateTime,
                        remark,
                        menus: [],
                        member,
                    };
                })
            );

            return {
                pageNo: page.pageNo,
                pageSize: page.pageSize,
                count,
                lists: roleResp,
            };
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('List Find err');
        }
    }
    // getMemberCnt 根据角色ID获取成员数量
    async getMemberCnt(roleId) {
        const { ctx } = this;
        const { SystemAuthAdmin } = ctx.model;

        try {
            const count = await SystemAuthAdmin.count({
                where: {
                    role: roleId,
                    isDelete: 0,
                },
            });

            return 0;
        } catch (err) {
            ctx.logger.error(err);
            throw new Error('Get Member Count error');
        }
    }
}


module.exports = AuthRoleService
