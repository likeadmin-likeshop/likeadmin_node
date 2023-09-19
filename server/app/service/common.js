const Service = require('egg').Service
const { version, publicUrl } = require('../extend/config')
const util = require('../util/urlUtil')

class CommonService extends Service {
    async getConsole() {
        const { ctx } = this;
        try {
            // 版本信息
            const name = await this.getVal('website', 'name', 'LikeAdmin-Nodejs');
            const versionInfo = {
                name,
                version,
                website: 'www.likeadmin.cn',
                based: 'Vue3.x、ElementUI、MySQL',
                channel: {
                    gitee: 'https://gitee.com/likeadmin/likeadmin_python',
                    website: 'https://www.likeadmin.cn',
                },
            };

            // 今日数据
            const today = {
                time: '2022-08-11 15:08:29',
                todayVisits: 10,
                totalVisits: 100,
                todaySales: 30,
                totalSales: 65,
                todayOrder: 12,
                totalOrder: 255,
                todayUsers: 120,
                totalUsers: 360,
            };

            // 访客图表
            const now = new Date();
            const date = [];
            for (let i = 14; i >= 0; i--) {
                const currentDate = new Date(now); // 创建新的 Date 对象保存当前日期
                currentDate.setDate(currentDate.getDate() - i); // 设置日期
                date.push(currentDate.toISOString().split('T')[0]);
            }
            const visitor = {
                date,
                list: [12, 13, 11, 5, 8, 22, 14, 9, 456, 62, 78, 12, 18, 22, 46],
            };

            return {
                version: versionInfo,
                today,
                visitor,
            };
        } catch (err) {
            ctx.logger.error(`IndexService.console error: ${err}`);
            throw err;
        }
    }

    async getConfig() {
        const { ctx } = this;
        try {
            const website = await this.get('website');
            const copyrightStr = await this.getVal('website', 'copyright', '');
            let copyright = [];
            if (copyrightStr) {
                copyright = JSON.parse(copyrightStr);
            }
            return {
                webName: website.name,
                webLogo: util.toAbsoluteUrl(website.logo),
                webFavicon: util.toAbsoluteUrl(website.favicon),
                webBackdrop: util.toAbsoluteUrl(website.backdrop),
                ossDomain: publicUrl,
                copyright: copyright,
            };
        } catch (err) {
            ctx.logger.error(`IndexService.config error: ${err}`);
            throw err;
        }
    }

    async getVal(cnfType, name, defaultVal) {
        const { ctx } = this;
        try {
            const config = await this.get(cnfType, name);
            let data = config[name];
            if (!data) {
                data = defaultVal;
            }
            return data;
        } catch (err) {
            ctx.logger.error(`ConfigUtilService.getVal error: ${err}`);
            throw err;
        }
    }

    async get(cnfType, name) {
        const { ctx } = this;
        try {
            const object = {
                type: cnfType,
                ...(name && { name }),
            };
            const configs = await ctx.model.SystemConfig.findAll({
                where: object,
            });
            const data = {};
            for (const config of configs) {
                data[config.name] = config.value;
            }
            return data;
        } catch (err) {
            ctx.logger.error(`ConfigUtilService.get error: ${err}`);
            throw err;
        }
    }

    async set(cnfType, name, val) {
        const { ctx } = this;
        const { SystemConfig } = ctx.model;

        try {
            let config = await SystemConfig.findOne({
                where: { type: cnfType, name },
            });

            if (!config) {
                config = await SystemConfig.create({ type: cnfType, name });
            }

            await config.update({ value: val });

            ctx.status = 200;
        } catch (error) {
            ctx.body = 'Internal server error';
            ctx.status = 500;
        }
    }
}


module.exports = CommonService
