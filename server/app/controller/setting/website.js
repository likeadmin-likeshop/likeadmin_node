'use strict';

const baseController = require('../baseController');

class SettingWebsiteController extends baseController {
  async details() {
    const { ctx } = this;
    try {
      const data = await ctx.service.website.details();
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingWebsiteController.details error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async save() {
    const { ctx } = this;
    const params = ctx.request.body;
    try {
      await ctx.service.website.save(params);
      this.result({
        data: {},
      });
    } catch (err) {
      ctx.logger.error(`SettingWebsiteController.save error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }
}

module.exports = SettingWebsiteController;
