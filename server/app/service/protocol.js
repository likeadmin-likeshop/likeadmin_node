const Service = require('egg').Service
const { version, publicUrl } = require('../extend/config')
const util = require('../util/urlUtil')

class ProtocolService extends Service {
    async details() {
        const { ctx } = this;
        try {
            const defaultVal = '{"name":"","content":""}';
            const service = await ctx.service.common.getVal("protocol", "service", defaultVal);
            const privacy = await ctx.service.common.getVal("protocol", "privacy", defaultVal);
            const data = {
                service: JSON.parse(service),
		        privacy: JSON.parse(privacy)
            }
            return data;
        } catch (err) {
            throw new Error(`service error: ${err}`);
        }
    }

    async save(req) {
        const { ctx } = this;
        const { service,  privacy} = req;        

        try {
            const serviceJson = JSON.stringify(service);
            const privacyJson = JSON.stringify(privacy);
            await ctx.service.common.set("protocol", "service", serviceJson);
            await ctx.service.common.set("protocol", "privacy", privacyJson);
        } catch (err) {
            throw new Error(`service error: ${err}`);
        }
    }
}


module.exports = ProtocolService
