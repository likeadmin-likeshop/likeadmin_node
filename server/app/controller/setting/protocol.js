'use strict';

const baseController = require('../baseController');

class SettingProtocolController extends baseController {
  async details() {
    const { ctx } = this;
    try {
      const data = await ctx.service.protocol.details();
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingProtocolController.details error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async save() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      await ctx.service.protocol.save(params);
      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(`SettingProtocolController.save error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }
}

module.exports = SettingProtocolController;
