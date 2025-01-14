'use strict';

const baseController = require('../baseController');
const serverUtil = require('../../util/server');

class MonitorController extends baseController {
  async server() {
    const cpu = await serverUtil.getCpuInfo();
    const mem = await serverUtil.getMemInfo();
    const sys = await serverUtil.getSysInfo();
    const disk = await serverUtil.getDiskInfo();
    const node = await serverUtil.getNodeInfo();

    this.result({
      data: {
        cpu,
        mem,
        sys,
        disk,
        node,
      },
    });
  }

  async cache() {
    const { ctx } = this;
    const cmdStatsMap = await ctx.service.redis.info('commandstats');
    const stats = [];

    for (const [ k, v ] of Object.entries(cmdStatsMap)) {
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
      },
    });
  }
}

module.exports = MonitorController;
