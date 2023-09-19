const Service = require('egg').Service
const { version, publicUrl } = require('../extend/config')
const util = require('../util/urlUtil')

class CopyrightService extends Service {
    async details() {
        const { ctx } = this;
        try {
            const copyrightStr = await ctx.service.common.getVal("website", "copyright", "[]");
            let copyright = [];
            if (copyrightStr) {
                copyright = JSON.parse(copyrightStr);
            }
            return copyright;
        } catch (err) {
            ctx.logger.error(`IndexService.config error: ${err}`);
            throw err;
        }
    }

    async save(req) {
        const { ctx } = this;

        try {
            await ctx.service.common.set("website", "copyright", req);
        } catch (error) {
            ctx.logger.error(`IndexService.config error: ${err}`);
            throw err;
        }
    }
}


module.exports = CopyrightService
