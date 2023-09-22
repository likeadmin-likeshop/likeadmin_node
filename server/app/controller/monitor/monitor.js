'use strict'

const baseController = require('../baseController')
const md5 = require('md5')
const {
    backstageTokenSet,
    backstageTokenKey,
    reqAdminIdKey,
    reqRoleIdKey,
    reqUsernameKey,
    reqNicknameKey
} = require('../../extend/config')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const serverUtil = require('../../util/server')
const await = require('await-stream-ready/lib/await')

class MonitorController extends baseController {
    async server() {
        const { ctx } = this;
        const cpu = await serverUtil.getCpuInfo();
        const mem = await serverUtil.getMemInfo();
        const sys = await serverUtil.getSysInfo();
        const disk = await serverUtil.getDiskInfo();
        const go = await serverUtil.getNodeInfo();

        this.result({
            data: {
                cpu,
                mem,
                sys,
                disk,
                go
            }
        })
    }

    async cache() {
        const { ctx } = this;
        const cmdStatsMap = await ctx.service.redis.info('commandstats');
        const stats = [];

        for (const [k, v] of Object.entries(cmdStatsMap)) {
            stats.push({
                name: k.split('_')[1],
                value: v.slice(v.indexOf('=') + 1, v.indexOf(',')),
            });
        }

        const info = await ctx.service.redis.info();
        const dbSize = await ctx.service.redis.dbSize();

        this.result({
            data: {
                info,
                commandStats: stats,
                dbSize,
            }
        })
    }
}

module.exports = MonitorController
