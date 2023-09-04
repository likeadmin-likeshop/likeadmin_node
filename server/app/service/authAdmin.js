const Service = require('egg').Service
const { backstageManageKey, backstageRolesKey, reqAdminIdKey, superAdminId } = require('../extend/config')
const parser = require('ua-parser-js');
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const util = require('../util')

class AuthAdminService extends Service {
    async cacheAdminUserByUid(id) {
        const { ctx } = this;
        const admin = await ctx.model.SystemAuthAdmin.findOne({
            where: {
                id
            }
        })
        if (!admin) {
            return;
        }
        const str = await JSON.stringify(admin);
        if (!str) {
            return;
        }
        await ctx.service.redis.hSet(backstageManageKey, parseInt(admin.id, 10), str, 0);
    }

    async cacheRoleMenusByRoleId(roleId) {
        const { ctx } = this;
        try {
            const perms = await ctx.model.SystemAuthPerm.findAll({
                where: {
                    roleId,
                },
            });

            const menuIds = perms.map(perm => perm.menuId);

            const menus = await ctx.model.SystemAuthMenu.findAll({
                where: {
                    isDisable: 0,
                    id: {
                        [Op.in]: menuIds,
                    },
                    menuType: {
                        [Op.in]: ['C', 'A'],
                    },
                },
                order: [
                    ['menuSort', 'ASC'],
                    ['id', 'ASC'],
                ],
            });

            const menuArray = menus
                .filter(menu => menu.perms !== '')
                .map(menu => menu.perms.trim());

            const redisKey = backstageRolesKey;
            const roleIdStr = String(roleId);
            const menuString = menuArray.join(',');

            await ctx.service.redis.hSet(redisKey, roleIdStr, menuString, 0)

            return menuArray;
        } catch (err) {
            ctx.logger.error('CacheRoleMenusByRoleId error:', err);
            throw err;
        }
    }

    //SelectMenuIdsByRoleId 根据角色ID获取菜单ID
    async selectMenuIdsByRoleId(roleId) {
        console.log(roleId, '....')
        const { ctx } = this;
        const systemAuthRole = ctx.model.SystemAuthRole;
        const systemAuthPerm = ctx.model.SystemAuthPerm;
        try {
            const role = await systemAuthRole.findOne({
                where: {
                    id: roleId,
                    is_disable: 0,
                },
            });
            if (!role) {
                return [];
            }

            const perms = await systemAuthPerm.findAll({
                where: {
                    roleId: role.id,
                },
            });

            const menuIds = perms.map((perm) => perm.MenuId);
            console.log(menuIds, 'menuIds....')
            return menuIds;
        } catch (err) {
            console.error('SelectMenuIdsByRoleId error:', err);
            return [];
        }
    }

    //SelectMenuByRoleId 根据角色ID获取菜单
    async selectMenuByRoleId(roleId) {
        const { ctx } = this;
        const adminId = ctx.session[reqAdminIdKey];
        console.log(adminId,'adminId....')
        let menuIds = await this.selectMenuIdsByRoleId(roleId);
        if (!menuIds || menuIds.length === 0) {
            menuIds = [0];
        }
        console.log(menuIds,'menuIds......')
        let chain = ctx.model.SystemAuthMenu
            .findAll({
                where: {
                    menuType: ['M', 'C'],
                    isDisable: 0,
                },
                order: [['menuSort', 'DESC'], ['id']],
            });
        console.log(chain,'chain....')
        if (adminId !== superAdminId) {
            chain = chain.where({
                id: menuIds,
            });
        }
        const menus = await chain;
        const menuResps = menus.map(menu => menu.toJSON());
        const mapList = util.listToTree(
            util.structsToMaps(menuResps),
            'id',
            'pid',
            'children'
        );
        console.log(mapList,'mapList....')
        return mapList;
    }

    async recordLoginLog(adminId, username, errStr) {
        const { ctx } = this;
        console.log(adminId, username, errStr, 'adminId, username, errStr.....')
        const ua = parser(ctx.request.header['user-agent']);
        let status = 0;
        if (!errStr) {
            status = 1
        }
        try {
            const params = {
                adminId,
                username,
                ip: ctx.request.ip,
                os: JSON.stringify(ua.os),
                browser: JSON.stringify(ua.browser),
                status,
            }
            const result = await ctx.model.SystemLogLogin.create({
                ...params
            })
            return result;
        } catch (error) {
            return false;
        }
    }
}


module.exports = AuthAdminService
