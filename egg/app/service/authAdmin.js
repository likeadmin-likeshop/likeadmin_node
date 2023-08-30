const Service = require('egg').Service
const { BackstageManageKey } = require('../extend/config')
const parser = require('ua-parser-js');

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
        await ctx.service.redis.hSet(BackstageManageKey, parseInt(admin.id, 10), str, 0);
    }

    async recordLoginLog(adminId, username, errStr) {
        const { ctx } = this;
        console.log(adminId, username, errStr,'adminId, username, errStr.....')
        const ua = parser(ctx.request.header['user-agent']);
        let status = 0;
        if(!errStr){
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
