'use strict'

const baseController = require('./baseController')
const md5 = require('md5')
const {
    backstageTokenSet,
    backstageTokenKey,
    reqAdminIdKey,
    reqRoleIdKey,
    reqUsernameKey,
    reqNicknameKey
} = require('../extend/config')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const urlUtil = require('../util/urlUtil')

class SystemController extends baseController {
    async login() {
        const { ctx } = this
        const body = ctx.request.body
        try {
            this.ctx.validate({
                username: { type: 'string', min: 2, max: 20, require: true },
                password: { type: 'string', min: 6, max: 20, require: true },
            })
            const sysAdmin = await ctx.model.SystemAuthAdmin.findOne({
                where: {
                    username: body.username
                }
            })
            if (!sysAdmin) {
                this.result({ data: '', message: '没有找到该用户', code: 1002 })
                return;
            }
            if (sysAdmin.is_delete === 1) {
                this.result({ data: '', message: '该账户已被删除', code: 1002 })
                return;
            }
            if (sysAdmin.is_disable === 1) {
                this.result({ data: '', message: '该账户已被禁用', code: 1002 })
                return;
            }
            const md5Pwd = md5(body.password + sysAdmin.salt);
            if (sysAdmin.password !== md5Pwd) {
                this.result({ data: '', message: '密码错误', code: 1002 })
                return;
            }
            const token = ctx.setToken({ password: body.password, username: body.username });
            const adminIdStr = String(sysAdmin.id);

            //非多次登录
            if (sysAdmin.is_multipoint === 0) {
                const sysAdminSetKey = backstageTokenSet + adminIdStr;
                const ts = ctx.service.redis.sGet(sysAdminSetKey);
                if (ts.length > 0) {
                    const keys = [];
                    for (const t of ts) {
                        keys.push(t);
                    }
                    ctx.service.redis.del(keys);
                }
                ctx.service.redis.del(sysAdminSetKey);
                ctx.service.redis.sSet(sysAdminSetKey, token);
            }

            // 缓存登录信息
            ctx.service.redis.set(backstageTokenKey + token, adminIdStr, 7200);
            ctx.service.authAdmin.cacheAdminUserByUid(sysAdmin.id);

            // 更新登录信息
            const dateTime = Math.floor(Date.now() / 1000);
            await ctx.model.SystemAuthAdmin.update({
                last_login_ip: ctx.request.ip,
                last_login_time: dateTime,
                update_time: dateTime,
            }, {
                where: {
                    id: sysAdmin.id,
                },
            })

            // 记录登录日志
            const resultLog = await ctx.service.authAdmin.recordLoginLog(sysAdmin.id, body.username, '');
            if (!resultLog) {
                this.result({ data: '', message: '请求错误', code: 1002 })
                return;
            }

            this.result({
                data: {
                    token
                }
            })
        } catch (error) {
            const { errors = [] } = error
            this.result({ data: '', message: errors[0].message, code: 1001 })
        }
    }

    async self() {
        const { ctx } = this
        const SystemAuthAdmin = ctx.model.SystemAuthAdmin;
        const SystemAuthMenu = ctx.model.SystemAuthMenu;
        const authAdminService = ctx.service.authAdmin;
        const adminId = ctx.session[reqAdminIdKey]

        try {
            const sysAdmin = await SystemAuthAdmin.findOne({
                where: {
                    id: adminId,
                    isDelete: 0,
                },
                attributes: ['id', 'nickname', 'nickname', 'avatar', 'role', 'deptId', 'isMultipoint', 'isDisable', 'lastLoginIp', 'lastLoginTime', 'createTime', 'updateTime']
            });

            if (!sysAdmin) {
                return null;
            }

            let auths = [];
            if (adminId > 1) {
                const roleId = parseInt(sysAdmin.role, 10);
                const menuIds = await authAdminService.selectMenuIdsByRoleId(roleId);

                if (menuIds.length > 0) {
                    const menus = await SystemAuthMenu.findAll({
                        where: {
                            id: {
                                [Op.in]: menuIds,
                            },
                            isDisable: 0,
                            menuType: ['C', 'A'],
                        },
                        order: [['menuSort', 'ASC'], ['id', 'ASC']],
                    });

                    if (menus.length > 0) {
                        auths = menus.map((menu) => menu.perms.trim());
                    }
                }
            } else {
                auths = ['*'];
            }

            const admin = {
                user: {
                    ...sysAdmin.toJSON(),
                    dept: sysAdmin.deptId.toString(),
                    avatar: urlUtil.toAbsoluteUrl(sysAdmin.avatar),
                },
                permissions: auths,
            };

            this.result({
                data: admin
            })
        } catch (err) {
            console.error('GetAdminInfo error:', err);
            return null;
        }
    }

    async menusRoute() {
        const { ctx } = this;
        const roleId = ctx.session[reqRoleIdKey];
        const data = await ctx.service.authAdmin.selectMenuByRoleId(roleId);
        this.result({
            data
        })
    }

    async console() {
        const { ctx } = this;
        try {
            const data = await ctx.service.common.getConsole();
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`systemController.console error: ${err}`);
        }
    }

    async configInfo() {
        const { ctx } = this;
        try {
            const data = await ctx.service.common.getConfig();
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`systemController.config error: ${err}`);
        }
    }

    async deptList() {
        const { ctx } = this;
        try {
            const listReq = ctx.request.query;
            const data = await ctx.service.systemAuthDept.list(listReq);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemAuthDeptController.deptList error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async postList() {
        const { ctx } = this;
        try {
            const params = ctx.query;
            const data = await ctx.service.systemAuthPost.list(params);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemAuthPostController.postList error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async roleAll() {
        const { ctx } = this;
        try {
            const data = await ctx.service.systemAuthRole.all();
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemAuthPostController.roleAll error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async adminList() {
        const { ctx } = this;
        try {
            const params = ctx.query;
            const data = await ctx.service.authAdmin.adminList(params);
            this.result({
                data
            })
        } catch (err) {
            ctx.logger.error(`SystemAuthPostController.roleAll error: ${err}`);
            ctx.body = 'Internal Server Error';
            ctx.status = 500;
        }
    }

    async logout() {
        this.ctx.cookies.set('token', null, { maxAge: 0 })
        this.result({ data: '' })
    }

    register() {

    }

    async siteIpInfo() {
        const { data, error } = await this.ctx.service.user.ipInfo()
        if (error) {
            this.result({ data: '', message: error, code: 1001 })
        } else {
            this.result({ data: data })
        }
    }
}

module.exports = SystemController
