'use strict';

const baseController = require('../baseController');

class SettingDictController extends baseController {
  async list() {
    const { ctx } = this;
    try {
      const listReq = ctx.request.query;
      const data = await ctx.service.dict.list(listReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.list error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async all() {
    const { ctx } = this;
    try {
      const data = await ctx.service.dict.all();
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.all error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async add() {
    const { ctx } = this;
    try {
      const addReq = ctx.request.body;
      const data = await ctx.service.dict.add(addReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.add error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async detail() {
    const { ctx } = this;
    try {
      const { id } = ctx.request.query;
      const data = await ctx.service.dict.detail(id);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.detail error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async edit() {
    const { ctx } = this;
    try {
      const editReq = ctx.request.body;
      const data = await ctx.service.dict.edit(editReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.edit error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async del() {
    const { ctx } = this;
    try {
      const delReq = ctx.request.body;
      const data = await ctx.service.dict.del(delReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.del error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async dataList() {
    const { ctx } = this;
    try {
      const listReq = ctx.request.query;
      const data = await ctx.service.dict.dataList(listReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.dataList error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async dataAll() {
    const { ctx } = this;
    try {
      const allReq = ctx.request.query;
      const data = await ctx.service.dict.dataAll(allReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.dataAll error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async dataDetail() {
    const { ctx } = this;
    try {
      const { id } = ctx.request.query;
      const data = await ctx.service.dict.dataDetail(id);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.dataDetail error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async dataAdd() {
    const { ctx } = this;
    try {
      const addReq = ctx.request.body;
      const data = await ctx.service.dict.dataAdd(addReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.dataAdd error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async dataEdit() {
    const { ctx } = this;
    try {
      const editReq = ctx.request.body;
      const data = await ctx.service.dict.dataEdit(editReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.dataEdit error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }

  async dataDel() {
    const { ctx } = this;
    try {
      const delReq = ctx.request.body;
      const data = await ctx.service.dict.dataDel(delReq);
      this.result({
        data,
      });
    } catch (err) {
      ctx.logger.error(`SettingDictController.dataDel error: ${err}`);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  }
}

module.exports = SettingDictController;
