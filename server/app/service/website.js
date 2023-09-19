const Service = require('egg').Service
const { version, publicUrl } = require('../extend/config')
const util = require('../util/urlUtil')

class WebsiteService extends Service {
    async details() {
        const { ctx } = this;
        try {
            const website = await ctx.service.common.get('website');
            return {
                name: website.name,
                logo: util.toAbsoluteUrl(website.logo),
                favicon: util.toAbsoluteUrl(website.favicon),
                backdrop: util.toAbsoluteUrl(website.backdrop),
                shopName: website.shopName,
                shopLogo: util.toAbsoluteUrl(website.shopLogo),
            };
        } catch (err) {
            ctx.logger.error(`IndexService.config error: ${err}`);
            throw err;
        }
    }

    async save(req) {
        const { ctx } = this;

        try {
            await Promise.all([
                ctx.service.common.set('website','name',req.name),
                ctx.service.common.set('website','logo',util.toRelativeUrl(req.logo)),
                ctx.service.common.set('website','favicon',util.toRelativeUrl(req.favicon)),
                ctx.service.common.set('website','backdrop',util.toRelativeUrl(req.backdrop)),
                ctx.service.common.set('website','shopName',req.shopName),
                ctx.service.common.set('website','shopLogo',util.toRelativeUrl(req.shopLogo)),
            ]);
        } catch (error) {
            ctx.logger.error(`IndexService.config error: ${err}`);
            throw err;
        }
    }
}


module.exports = WebsiteService
