'use strict';

const baseController = require('../baseController');

class SettingCopyrightController extends baseController {
  async details() {
    const { ctx } = this;
    try {
      const data = await ctx.service.copyright.details();
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingCopyrightController.details error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async save() {
    const { ctx } = this;
    const params = ctx.request.body && JSON.stringify(ctx.request.body);
    try {
      await ctx.service.copyright.save(params);
      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(`SettingCopyrightController.save error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }
}

module.exports = SettingCopyrightController;
