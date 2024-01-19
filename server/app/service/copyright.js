'use strict';

const Service = require('egg').Service;

class CopyrightService extends Service {
  async details() {
    const { ctx } = this;
    try {
      const copyrightStr = await ctx.service.common.getVal('website', 'copyright', '[]');
      let copyright = [];
      if (copyrightStr) {
        copyright = JSON.parse(copyrightStr);
      }
      return copyright;
    } catch (err) {
      throw new Error(`IndexService.config error: ${err}`);
    }
  }

  async save(req) {
    const { ctx } = this;

    try {
      await ctx.service.common.set('website', 'copyright', req);
    } catch (err) {
      throw new Error(`IndexService.config error: ${err}`);
    }
  }
}


module.exports = CopyrightService;
