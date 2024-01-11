'use strict';

const baseController = require('../baseController');

class SystemLogController extends baseController {
  async operate() {
    const { ctx } = this;
    try {
      const listReq = ctx.request.query;
      const data = await ctx.service.log.operate(listReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SystemLogController.operate error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }
}

module.exports = SystemLogController;
